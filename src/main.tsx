import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { AuthConfigurationMissing, AuthGate, SignedOutScreen } from "./components/AuthGate";
import { registerServiceWorker } from "./registerServiceWorker";
import "./styles.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
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

const clerkAppearance = {
  variables: {
    colorPrimary: "#123c69",
    colorText: "#172033",
    borderRadius: "8px"
  }
};

if (isAppPreview) {
  // Dev-only: renderiza o App standalone sem Clerk. Permite iterar a navegação,
  // sidebar e busca sem precisar de login em produção. Eliminado do bundle prod
  // pelo gate import.meta.env.DEV combinado com o dynamic import.
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else if (isModulesPreview) {
  // Dev-only: import dinâmico para que ReviewAllModules NÃO entre na build de produção
  // (combinado com import.meta.env.DEV gateado acima, o branch some inteiro do bundle prod).
  void import("./components/ReviewAllModules").then(({ ReviewAllModules }) => {
    root.render(
      <StrictMode>
        <ReviewAllModules />
      </StrictMode>
    );
  });
} else if (isLandingPreview) {
  root.render(
    <StrictMode>
      <SignedOutScreen previewMode />
    </StrictMode>
  );
} else if (!clerkPublishableKey) {
  root.render(
    <StrictMode>
      <AuthConfigurationMissing />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
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
    </StrictMode>
  );
  registerServiceWorker();
}
