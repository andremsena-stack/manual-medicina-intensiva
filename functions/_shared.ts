import { verifyToken } from "@clerk/backend";

export interface Env {
  APP_URL?: string;
  CLERK_SECRET_KEY: string;
  STRIPE_ALLOWED_STATUSES?: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

export interface ClerkUser {
  id: string;
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string;
  private_metadata?: Record<string, unknown>;
}

export interface StripeSubscriptionSummary {
  customerId?: string;
  subscriptionId?: string;
  status?: string;
  priceId?: string;
  currentPeriodEnd?: number | null;
}

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8"
};

export function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init?.headers ?? {})
    }
  });
}

export function requireEnv(env: Env, key: keyof Env): string {
  const value = env[key];
  if (!value || typeof value !== "string") {
    throw new Response(`Missing environment variable: ${String(key)}`, { status: 500 });
  }
  return value;
}

export async function requireClerkUserId(request: Request, env: Env): Promise<string> {
  const secretKey = requireEnv(env, "CLERK_SECRET_KEY");
  const authorization = request.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    if (!payload.sub) {
      throw new Error("Token sem usuario.");
    }

    return payload.sub;
  } catch {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export async function clerkApi<T>(env: Env, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireEnv(env, "CLERK_SECRET_KEY")}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Response(`Clerk API error: ${response.status}`, { status: 502 });
  }

  return (await response.json()) as T;
}

export async function getClerkUser(env: Env, userId: string): Promise<ClerkUser> {
  return clerkApi<ClerkUser>(env, `/users/${userId}`);
}

export function getPrimaryEmail(user: ClerkUser): string | undefined {
  const primary = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
  return primary?.email_address ?? user.email_addresses?.[0]?.email_address;
}

export async function updateUserStripeMetadata(
  env: Env,
  userId: string,
  stripe: StripeSubscriptionSummary
): Promise<void> {
  const user = await getClerkUser(env, userId);
  const current = user.private_metadata ?? {};

  await clerkApi(env, `/users/${userId}/metadata`, {
    method: "PATCH",
    body: JSON.stringify({
      private_metadata: {
        ...current,
        stripeCustomerId: stripe.customerId ?? current.stripeCustomerId,
        stripeSubscriptionId: stripe.subscriptionId ?? current.stripeSubscriptionId,
        stripeSubscriptionStatus: stripe.status ?? current.stripeSubscriptionStatus,
        stripePriceId: stripe.priceId ?? current.stripePriceId,
        stripeCurrentPeriodEnd: stripe.currentPeriodEnd ?? current.stripeCurrentPeriodEnd ?? null,
        stripeUpdatedAt: new Date().toISOString()
      }
    })
  });
}

export function subscriptionFromMetadata(metadata: Record<string, unknown> | undefined): StripeSubscriptionSummary {
  return {
    customerId: typeof metadata?.stripeCustomerId === "string" ? metadata.stripeCustomerId : undefined,
    subscriptionId:
      typeof metadata?.stripeSubscriptionId === "string" ? metadata.stripeSubscriptionId : undefined,
    status: typeof metadata?.stripeSubscriptionStatus === "string" ? metadata.stripeSubscriptionStatus : undefined,
    priceId: typeof metadata?.stripePriceId === "string" ? metadata.stripePriceId : undefined,
    currentPeriodEnd:
      typeof metadata?.stripeCurrentPeriodEnd === "number" ? metadata.stripeCurrentPeriodEnd : null
  };
}

export function isSubscriptionActive(env: Env, status: string | undefined): boolean {
  const allowed = (env.STRIPE_ALLOWED_STATUSES || "active,trialing")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return Boolean(status && allowed.includes(status));
}

export async function stripePost<T>(env: Env, path: string, params: URLSearchParams): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv(env, "STRIPE_SECRET_KEY")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    return Promise.reject(new Response(JSON.stringify(data), { status: 502, headers: jsonHeaders }));
  }

  return data as T;
}

export async function stripeGet<T>(env: Env, path: string): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${requireEnv(env, "STRIPE_SECRET_KEY")}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    return Promise.reject(new Response(JSON.stringify(data), { status: 502, headers: jsonHeaders }));
  }

  return data as T;
}

export function getSafeReturnUrl(request: Request, env: Env, proposed?: string): string {
  const fallback = env.APP_URL || new URL(request.url).origin;
  if (!proposed) {
    return fallback;
  }

  try {
    const candidate = new URL(proposed);
    const allowedOrigin = new URL(fallback).origin;
    return candidate.origin === allowedOrigin ? candidate.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function extractStripeSubscriptionSummary(subscription: any): StripeSubscriptionSummary {
  return {
    customerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
    subscriptionId: subscription.id,
    status: subscription.status,
    priceId: subscription.items?.data?.[0]?.price?.id,
    currentPeriodEnd: typeof subscription.current_period_end === "number" ? subscription.current_period_end : null
  };
}
