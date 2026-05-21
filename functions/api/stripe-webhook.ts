import {
  extractStripeSubscriptionSummary,
  jsonResponse,
  requireEnv,
  stripeGet,
  updateUserStripeMetadata,
  type Env,
  type StripeSubscriptionSummary
} from "../_shared";

interface StripeEvent {
  type: string;
  data: {
    object: any;
  };
}

function parseStripeSignature(header: string | null): { timestamp?: string; signatures: string[] } {
  const parts = (header ?? "").split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  return { timestamp, signatures };
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

async function computeHmacSha256(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return toHex(signature);
}

async function verifyStripeSignature(request: Request, env: Env, body: string): Promise<void> {
  const secret = requireEnv(env, "STRIPE_WEBHOOK_SECRET");
  const { timestamp, signatures } = parseStripeSignature(request.headers.get("Stripe-Signature"));

  if (!timestamp || signatures.length === 0) {
    throw new Response("Missing Stripe signature", { status: 400 });
  }

  const timestampSeconds = Number(timestamp);
  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (!Number.isFinite(timestampSeconds) || ageSeconds > 300) {
    throw new Response("Expired Stripe signature", { status: 400 });
  }

  const expected = await computeHmacSha256(secret, `${timestamp}.${body}`);
  const isValid = signatures.some((signature) => timingSafeEqual(signature, expected));

  if (!isValid) {
    throw new Response("Invalid Stripe signature", { status: 400 });
  }
}

function getMetadataUserId(record: any): string | undefined {
  return (
    record?.metadata?.clerk_user_id ??
    record?.client_reference_id ??
    record?.subscription_details?.metadata?.clerk_user_id
  );
}

async function syncSubscription(env: Env, userId: string | undefined, summary: StripeSubscriptionSummary) {
  if (!userId) {
    return;
  }

  await updateUserStripeMetadata(env, userId, summary);
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.text();
    await verifyStripeSignature(request, env, body);

    const event = JSON.parse(body) as StripeEvent;
    const object = event.data.object;

    if (event.type === "checkout.session.completed") {
      const userId = getMetadataUserId(object);
      const customerId = typeof object.customer === "string" ? object.customer : object.customer?.id;
      const subscriptionId = typeof object.subscription === "string" ? object.subscription : object.subscription?.id;

      if (subscriptionId) {
        const subscription = await stripeGet(env, `/subscriptions/${subscriptionId}`);
        await syncSubscription(env, userId, extractStripeSubscriptionSummary(subscription));
      } else {
        await syncSubscription(env, userId, { customerId, status: object.status });
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await syncSubscription(env, getMetadataUserId(object), extractStripeSubscriptionSummary(object));
    }

    return jsonResponse({ received: true });
  } catch (caught) {
    if (caught instanceof Response) {
      return caught;
    }

    return jsonResponse({ error: "Falha ao processar webhook Stripe." }, { status: 500 });
  }
};
