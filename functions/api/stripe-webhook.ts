import Stripe from "stripe";
import {
  findClerkUserIdByEmail,
  jsonResponse,
  requireEnv,
  updateUserStripeMetadata,
  type Env,
  type StripeSubscriptionSummary
} from "../_shared";

const activeStripeStatuses = new Set(["active", "trialing"]);
const inactiveStripeStatuses = new Set(["past_due", "unpaid", "canceled", "incomplete_expired"]);

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stripeId(value: string | { id?: string } | null | undefined): string | undefined {
  return typeof value === "string" ? value : value?.id;
}

function clerkUserIdFromMetadata(record: {
  client_reference_id?: string | null;
  metadata?: Stripe.Metadata | null;
}): string | undefined {
  return (
    asString(record.client_reference_id) ??
    asString(record.metadata?.clerkUserId) ??
    asString(record.metadata?.clerk_user_id)
  );
}

async function clerkUserIdFromCheckoutSession(
  env: Env,
  session: Stripe.Checkout.Session
): Promise<string | undefined> {
  const metadataUserId = clerkUserIdFromMetadata(session);
  if (metadataUserId) {
    return metadataUserId;
  }

  const email = session.customer_details?.email ?? session.customer_email;
  return email ? findClerkUserIdByEmail(env, email) : undefined;
}

function subscriptionStatusForStripeStatus(status: string | null | undefined): "active" | "inactive" {
  return status && activeStripeStatuses.has(status) ? "active" : "inactive";
}

function summaryFromCheckoutSession(session: Stripe.Checkout.Session): StripeSubscriptionSummary {
  return {
    customerId: stripeId(session.customer),
    subscriptionId: stripeId(session.subscription),
    status: "active"
  };
}

function summaryFromSubscription(subscription: Stripe.Subscription): StripeSubscriptionSummary {
  const status = inactiveStripeStatuses.has(subscription.status)
    ? "inactive"
    : subscriptionStatusForStripeStatus(subscription.status);

  return {
    customerId: stripeId(subscription.customer),
    subscriptionId: subscription.id,
    status,
    priceId: subscription.items.data[0]?.price?.id,
    currentPeriodEnd:
      typeof subscription.items.data[0]?.current_period_end === "number"
        ? subscription.items.data[0].current_period_end
        : null
  };
}

async function syncSubscriptionByUserId(
  env: Env,
  clerkUserId: string | undefined,
  summary: StripeSubscriptionSummary
) {
  if (!clerkUserId) {
    return;
  }

  await updateUserStripeMetadata(env, clerkUserId, summary);
}

async function handleCheckoutSessionCompleted(env: Env, session: Stripe.Checkout.Session) {
  const clerkUserId = await clerkUserIdFromCheckoutSession(env, session);
  await syncSubscriptionByUserId(env, clerkUserId, summaryFromCheckoutSession(session));
}

async function handleSubscriptionEvent(env: Env, subscription: Stripe.Subscription, deleted = false) {
  const clerkUserId =
    asString(subscription.metadata?.clerkUserId) ?? asString(subscription.metadata?.clerk_user_id);
  const summary = summaryFromSubscription(subscription);

  if (deleted) {
    summary.status = "inactive";
  }

  await syncSubscriptionByUserId(env, clerkUserId, summary);
}

async function handleStripeEvent(env: Env, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(env, event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionEvent(env, event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionEvent(env, event.data.object as Stripe.Subscription, true);
      break;
    default:
      break;
  }
}

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, { status: 405 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("Stripe-Signature");

  if (!signature) {
    return jsonResponse({ error: "missing_stripe_signature" }, { status: 400 });
  }

  const stripe = new Stripe(requireEnv(env, "STRIPE_SECRET_KEY"));
  const webhookSecret = requireEnv(env, "STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch {
    return jsonResponse({ error: "invalid_stripe_signature" }, { status: 400 });
  }

  try {
    await handleStripeEvent(env, event);
    return jsonResponse({ received: true });
  } catch {
    return jsonResponse({ error: "stripe_webhook_processing_failed" }, { status: 500 });
  }
};
