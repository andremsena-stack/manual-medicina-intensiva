import {
  getClerkUser,
  isSubscriptionActive,
  jsonResponse,
  requireClerkUserId,
  subscriptionFromUserMetadata,
  type Env
} from "../_shared";

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const userId = await requireClerkUserId(request, env);
    const user = await getClerkUser(env, userId);
    const subscription = subscriptionFromUserMetadata(user);

    return jsonResponse({
      active: isSubscriptionActive(env, subscription.status),
      status: subscription.status ?? "none",
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      priceId: subscription.priceId ?? null
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return jsonResponse({ active: false, error: "subscription_status_failed" }, { status: 500 });
  }
};
