import { StrictMode, Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { AuthConfigurationMissing, AuthGate, SignedOutScreen } from "./components/AuthGate";
import { registerServiceWorker } from "./registerServiceWorker";
import { initMetaPixel, handleCheckoutCallback } from "./utils/metaPixel";

// ErrorBoundary que escreve o erro no fallback HTML — captura crashes de
// render do React (que NÃO disparam window.onerror). Essencial para debug
// remoto em iOS PWA standalone sem acesso a DevTools.
class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof document === "undefined") return;
    const fb = document.getElementById("preReactFallback");
    const diag = document.getElementById("preReactDiag");
    if (!fb || !diag) return;
    const stackLines = (error.stack || "").split("\n").slice(0, 4).join("\n");
    const compStack = (info.componentStack || "").split("\n").slice(0, 4).join("\n");
    const msg = `[React render error] ${error.message}\n${stackLines}\n--- component stack ---${compStack}`;
    const existing = diag.textContent ? diag.textContent + "\n\n" : "";
    diag.textContent = existing + msg;
    fb.classList.add("has-error", "is-stuck");
    const title = document.getElementById("preReactTitle");
    const sub = document.getElementById("preReactSub");
    if (title) title.textContent = "Erro ao carregar o app";
    if (sub) sub.textContent = "O React não conseguiu renderizar. Veja detalhes abaixo.";
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
// Self-hosted Inter Tight via @fontsource (latin subset, pesos usados na landing).
// Substitui o <link> Google Fonts no index.html — evita FOUT e dependência externa.
import "@fontsource/inter-tight/latin-400.css";
import "@fontsource/inter-tight/latin-600.css";
import "@fontsource/inter-tight/latin-700.css";
import "@fontsource/inter-tight/latin-800.css";
import "@fontsource/inter-tight/latin-900.css";
import "./styles.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Meta Pixel — no-op se VITE_META_PIXEL_ID nao estiver setado (conta BM bloqueada).
// Quando a env var for definida no painel Cloudflare, dispara PageView + processa
// callback de checkout (Purchase) automaticamente.
initMetaPixel();
handleCheckoutCallback();

const root = createRoot(document.getElementById("root") as HTMLElement);
const previewMode =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("preview")
    : null;
const isLandingPreview = previewMode === "landing";
// Revisão integral dos módulos: SOMENTE em dev (npm run dev). Em build de produção
// o branch é removido pelo bundler para que o conteúdo pago não seja exposto via URL.
const isModulesPreview =
  import.meta.env.DEV && (previewMode === "modulos" || previewMode === "modules");
// Preview do app completo (Sidebar + ModuleViewer + Search) sem Clerk. DEV-only.
const isAppPreview = import.meta.env.DEV && previewMode === "app";
// Preview isolado do paywall (overlay + carrossel) sobre o App. DEV-only.
const isPaywallPreview = import.meta.env.DEV && previewMode === "paywall";

const clerkAppearance = {
  variables: {
    colorPrimary: "#123c69",
    colorText: "#172033",
    borderRadius: "8px"
  }
};

if (isPaywallPreview) {
  // Dev-only: renderiza App + paywall overlay para validar layout do carrossel
  // sem precisar de Clerk autenticado nem de subscription. Eliminado do bundle prod.
  void import("./components/AuthGate").then(({ PaywallPreview }) => {
    root.render(
      <StrictMode><RootErrorBoundary>
        <PaywallPreview />
      </RootErrorBoundary></StrictMode>
    );
  });
} else if (isAppPreview) {
  // Dev-only: renderiza o App standalone sem Clerk. Permite iterar a navegação,
  // sidebar e busca sem precisar de login em produção. Eliminado do bundle prod
  // pelo gate import.meta.env.DEV combinado com o dynamic import.
  root.render(
    <StrictMode><RootErrorBoundary>
      <App />
    </RootErrorBoundary></StrictMode>
  );
} else if (isModulesPreview) {
  // Dev-only: import dinâmico para que ReviewAllModules NÃO entre na build de produção
  // (combinado com import.meta.env.DEV gateado acima, o branch some inteiro do bundle prod).
  void import("./components/ReviewAllModules").then(({ ReviewAllModules }) => {
    root.render(
      <StrictMode><RootErrorBoundary>
        <ReviewAllModules />
      </RootErrorBoundary></StrictMode>
    );
  });
} else if (isLandingPreview) {
  root.render(
    <StrictMode><RootErrorBoundary>
      <SignedOutScreen previewMode />
    </RootErrorBoundary></StrictMode>
  );
} else if (!clerkPublishableKey) {
  root.render(
    <StrictMode><RootErrorBoundary>
      <AuthConfigurationMissing />
    </RootErrorBoundary></StrictMode>
  );
} else {
  root.render(
    <StrictMode><RootErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        afterSignOutUrl="/"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        appearance={clerkAppearance}
      >
        <AuthGate>
          <App />
        </AuthGate>
      </ClerkProvider>
    </RootErrorBoundary></StrictMode>
  );
  registerServiceWorker();
}
