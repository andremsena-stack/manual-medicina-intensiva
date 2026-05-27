// Meta Pixel — instalacao condicional.
//
// O SDK so e carregado e inicializado quando VITE_META_PIXEL_ID esta setado.
// Enquanto a conta de Business Manager da Meta esta bloqueada (sem permissao
// pra criar Pixel), a env var fica vazia e nenhuma chamada ao Facebook
// acontece — zero requisicao a connect.facebook.net, zero impacto em
// performance/privacy.
//
// Como ativar quando a conta for liberada:
//   1. Criar o Pixel no Business Manager (events.facebook.com)
//   2. Setar VITE_META_PIXEL_ID=<id_de_16_digitos> no painel Cloudflare Pages
//   3. Redeploy — o snippet abaixo passa a injetar fbevents.js automaticamente
//
// Como funciona:
//   - initMetaPixel() injeta o script padrao do Facebook (fbevents.js).
//   - PageView dispara imediatamente.
//   - Eventos de conversao (InitiateCheckout, Lead, Purchase) sao disparados
//     via analytics.ts (track()) que ja existe, mapeando os nomes da landing
//     pros nomes padrao da Meta.
//   - O checkout do Stripe redireciona pra `?checkout=success`. handleCheckoutCallback()
//     detecta esse param e dispara Purchase + limpa a URL pra evitar
//     dispatch duplicado em refresh.

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: Window["fbq"];
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

// Snippet oficial do Facebook (https://developers.facebook.com/docs/meta-pixel/get-started)
// reescrito sem o `eval`-style minified — funcao explicita pra ficar auditavel.
function injectFbevents(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.fbq) return; // ja injetado

  const n: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
    n.callMethod ? n.callMethod.apply(n, args) : (n.queue as unknown[]).push(args);
  } as Window["fbq"] & ((...args: unknown[]) => void);
  // Encadeia n._fbq pra compatibilidade com o snippet original
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

let initialized = false;

export function initMetaPixel(): void {
  if (initialized) return;
  if (!PIXEL_ID) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[meta-pixel] VITE_META_PIXEL_ID nao setado — pixel desativado");
    }
    return;
  }
  injectFbevents();
  window.fbq?.("init", PIXEL_ID);
  window.fbq?.("track", "PageView");
  initialized = true;
}

// Mapa parametros do plano por priceId. Espelha PLANS de AuthGate.tsx —
// mantido aqui isolado pra nao acoplar metaPixel.ts ao componente UI.
const PLAN_VALUES: Record<string, number> = {
  price_1Taz9MAnI7zzun0R92AYw0ld: 25.99,   // mensal
  price_1Taz9eAnI7zzun0RCHhB5NOg: 63.99,   // trimestral
  price_1TazAEAnI7zzun0R5wGrD2ol: 199.99,  // anual
};

const PURCHASE_FIRED_KEY = "virtus.meta.purchase_fired";

/**
 * Detecta callback de checkout (Stripe redireciona com `?checkout=success`)
 * e dispara o evento Purchase pro Meta Pixel. Dedup por sessionStorage —
 * se o usuario fizer F5 a pagina nao dispara de novo.
 *
 * Limpa o param da URL apos processar pra que historicos/share-links
 * nao acumulem dispatches.
 */
export function handleCheckoutCallback(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get("checkout");
  if (checkout !== "success") return;

  // Dedup: ja disparado nessa sessao? Pula.
  try {
    if (sessionStorage.getItem(PURCHASE_FIRED_KEY) === "1") return;
  } catch {
    // sessionStorage indisponivel (Safari private, etc.) — segue, pior caso dispara 2x
  }

  // Best-effort: pega priceId da URL se vier (alguns fluxos passam),
  // senao deixa value=null (Meta aceita Purchase sem value).
  const priceId = params.get("price_id") ?? params.get("priceId") ?? undefined;
  const value = priceId ? PLAN_VALUES[priceId] : undefined;

  window.fbq?.("track", "Purchase", {
    value,
    currency: "BRL",
    content_type: "subscription",
    content_ids: priceId ? [priceId] : undefined,
  });

  try {
    sessionStorage.setItem(PURCHASE_FIRED_KEY, "1");
  } catch {
    // ok
  }

  // Limpa os params de checkout da URL sem dar reload
  params.delete("checkout");
  params.delete("price_id");
  params.delete("priceId");
  const newSearch = params.toString();
  const newUrl =
    window.location.pathname + (newSearch ? "?" + newSearch : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);
}

/**
 * Mapeia nomes de eventos da landing (LandingEventName em analytics.ts)
 * pros eventos padrao da Meta. Usado de dentro de track() pra encaminhar.
 */
export const META_EVENT_MAP: Record<string, string> = {
  landing_pricing_card_click: "InitiateCheckout",
  landing_cta_banner_main_cta_click: "Lead",
  landing_hero_signup_click: "Lead",
  landing_nav_signup_click: "Lead",
};

/**
 * Encaminha um evento da landing pro Meta Pixel se houver mapping.
 * Silenciosa quando o pixel nao esta ativado.
 */
export function forwardToMetaPixel(
  event: string,
  props: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  const metaEvent = META_EVENT_MAP[event];
  if (!metaEvent) return;
  try {
    window.fbq("track", metaEvent, props);
  } catch {
    // ok
  }
}
