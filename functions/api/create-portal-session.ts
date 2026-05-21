import {
  getClerkUser,
  getSafeReturnUrl,
  jsonResponse,
  requireClerkUserId,
  stripePost,
  subscriptionFromMetadata,
  type Env
} from "../_shared";

interface PortalSession {
  url?: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const userId = await requireClerkUserId(request, env);
    const user = await getClerkUser(env, userId);
    const subscription = subscriptionFromMetadata(user.private_metadata);

    if (!subscription.customerId) {
      return jsonResponse({ error: "Cliente Stripe ainda nao encontrado para esta conta." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as { returnUrl?: string };
    const returnUrl = getSafeReturnUrl(request, env, body.returnUrl);
    const params = new URLSearchParams();

    params.set("customer", subscription.customerId);
    params.set("return_url", returnUrl);

    const session = await stripePost<PortalSession>(env, "/billing_portal/sessions", params);

    if (!session.url) {
      return jsonResponse({ error: "Stripe nao retornou URL do portal." }, { status: 502 });
    }

    return jsonResponse({ url: session.url });
  } catch (caught) {
    if (caught instanceof Response) {
      return caught;
    }

    return jsonResponse({ error: "Falha ao abrir portal de assinatura." }, { status: 500 });
  }
};
