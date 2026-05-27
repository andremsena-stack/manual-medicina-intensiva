// Camada de tracking neutra, plugável. Não trava nenhum provider — apenas
// expõe um `track(event, props?)` que:
//   1. Loga no console em DEV (para validação rápida no plantão de QA).
//   2. Faz push em `window.dataLayer` (compatível com GTM / GA4 dataLayer).
//   3. Encaminha para `window.posthog?.capture()` se PostHog estiver carregado
//      (snippet injetado por env var em <head>, opcional).
//   4. Encaminha para `window.mixpanel?.track()` se Mixpanel estiver presente.
//   5. Encaminha para Meta Pixel (window.fbq) se o pixel estiver inicializado
//      e o evento estiver no META_EVENT_MAP de src/utils/metaPixel.ts.
//
// Para ativar PostHog/Mixpanel em produção, basta carregar o SDK via snippet
// no `index.html` ou via Cloudflare Pages Functions — esta função detecta
// e despacha automaticamente. Não há dependência npm adicional.
//
// Meta Pixel: inicializado por initMetaPixel() em main.tsx (no-op enquanto
// VITE_META_PIXEL_ID nao estiver setado — conta BM bloqueada por enquanto).

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
    mixpanel?: { track: (event: string, props?: Record<string, unknown>) => void };
  }
}

import { forwardToMetaPixel } from "./metaPixel";

const isDev = import.meta.env.DEV;

// Convenção de nomes: `landing_<bloco>_<acao>`, snake_case.
// Tipo literal exposto pra ajudar autocomplete e evitar typo de string nos call-sites.
export type LandingEventName =
  | "landing_nav_signup_click"
  | "landing_nav_signin_click"
  | "landing_hero_signup_click"
  | "landing_hero_signin_click"
  | "landing_cta_banner_card_click"
  | "landing_cta_banner_main_cta_click"
  | "landing_pricing_card_click"
  | "landing_carousel_module_change"
  | "landing_footer_nav_click";

export function track(
  event: LandingEventName,
  props: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") {
    return;
  }
  const payload = { event, ...props, ts: Date.now() };

  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {
    // dataLayer pode estar congelado por CSP — ignora.
  }

  try {
    window.posthog?.capture(event, props);
  } catch {
    // PostHog não carregado — ok.
  }

  try {
    window.mixpanel?.track(event, props);
  } catch {
    // Mixpanel não carregado — ok.
  }

  // Meta Pixel: forwarder e silencioso se window.fbq nao existir (pixel desativado).
  forwardToMetaPixel(event, props);
}
