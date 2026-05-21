import {
  getClerkUser,
  getPrimaryEmail,
  getSafeReturnUrl,
  jsonResponse,
  requireClerkUserId,
  requireEnv,
  stripePost,
  subscriptionFromMetadata,
  type Env
} from "../_shared";

interface CheckoutSession {
  id: string;
  url: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const userId = await requireClerkUserId(request, env);
    const user = await getClerkUser(env, userId);
    const body = (await request.json().catch(() => ({}))) as { returnUrl?: string };
    const returnUrl = getSafeReturnUrl(request, env, body.returnUrl);
    const subscription = subscriptionFromMetadata(user.private_metadata);

    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("line_items[0][price]", requireEnv(env, "STRIPE_MONTHLY_PRICE_ID"));
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}checkout=success`);
    params.set("cancel_url", `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}checkout=cancelled`);
    params.set("client_reference_id", userId);
    params.set("metadata[clerk_user_id]", userId);
    params.set("subscription_data[metadata][clerk_user_id]", userId);
    params.set("allow_promotion_codes", "true");

    if (subscription.customerId) {
      params.set("customer", subscription.customerId);
    } else {
      params.set("customer_creation", "always");
      const email = getPrimaryEmail(user);
      if (email) {
        params.set("customer_email", email);
      }
    }

    const session = await stripePost<CheckoutSession>(env, "/checkout/sessions", params);
    return jsonResponse({ url: session.url });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return jsonResponse({ error: "checkout_session_failed" }, { status: 500 });
  }
};
