import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { AuthConfigurationMissing, AuthGate } from "./components/AuthGate";
import { registerServiceWorker } from "./registerServiceWorker";
import "./styles.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = createRoot(document.getElementById("root") as HTMLElement);

const clerkAppearance = {
  variables: {
    colorPrimary: "#123c69",
    colorText: "#172033",
    borderRadius: "8px"
  }
};

if (!clerkPublishableKey) {
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
}

registerServiceWorker();
