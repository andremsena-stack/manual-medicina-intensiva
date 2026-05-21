import {
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth
} from "@clerk/clerk-react";
import { useCallback, useEffect, useState, type PropsWithChildren } from "react";

const billingRequired = import.meta.env.VITE_CLERK_BILLING_REQUIRED !== "false";

type SubscriptionStatus = {
  active: boolean;
  status?: string;
  currentPeriodEnd?: number | null;
  priceId?: string;
};

type AccessState = "idle" | "loading" | "active" | "blocked" | "error";

function AuthShell({
  title,
  subtitle,
  children
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Acesso restrito</p>
        <h1 id="auth-title">{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

function SignedOutScreen() {
  return (
    <AuthShell
      title="Manual Interativo de Medicina Intensiva"
      subtitle="Entre com sua conta para acessar o manual, as calculadoras e o uso offline autorizado."
    >
      <div className="auth-actions">
        <SignInButton mode="modal">
          <button className="button button--primary" type="button">
            Entrar
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="button button--quiet" type="button">
            Criar conta
          </button>
        </SignUpButton>
      </div>
      <p className="auth-note">O acesso completo sera vinculado a uma assinatura mensal ativa no Stripe.</p>
    </AuthShell>
  );
}

function LoadingScreen() {
  return (
    <AuthShell title="Verificando acesso" subtitle="Aguarde enquanto validamos sua sessao e assinatura.">
      <div className="auth-loader" aria-hidden="true" />
    </AuthShell>
  );
}

export function AuthConfigurationMissing() {
  return (
    <AuthShell
      title="Clerk ainda nao configurado"
      subtitle="Defina a chave publica do Clerk para ativar login, assinatura e protecao de acesso."
    >
      <div className="auth-code">
        <code>VITE_CLERK_PUBLISHABLE_KEY=pk_live_...</code>
      </div>
      <p className="auth-note">
        No Cloudflare Pages, adicione esta variavel em Settings &gt; Environment variables e gere um novo deploy.
      </p>
    </AuthShell>
  );
}

function AuthProviderFailed() {
  return (
    <AuthShell
      title="Nao foi possivel carregar o login"
      subtitle="Verifique as chaves do Clerk, o dominio de producao e os registros DNS exigidos pelo Clerk."
    >
      <p className="auth-note">
        Quando o Clerk nao consegue carregar, o app permanece bloqueado para proteger o conteudo. Depois de ajustar DNS
        e variaveis, gere um novo deploy e tente novamente.
      </p>
    </AuthShell>
  );
}

function SubscriptionScreen({
  status,
  isBusy,
  error,
  onSubscribe,
  onManage,
  onRefresh
}: {
  status: SubscriptionStatus | null;
  isBusy: boolean;
  error: string | null;
  onSubscribe: () => void;
  onManage: () => void;
  onRefresh: () => void;
}) {
  return (
    <AuthShell
      title="Assinatura necessaria"
      subtitle="Sua conta esta autenticada. Para liberar o manual completo, conclua a assinatura mensal pelo Stripe."
    >
      <div className="auth-userbar">
        <span>Status: {status?.status ?? "sem assinatura ativa"}</span>
        <UserButton />
      </div>
      <div className="auth-actions">
        <button className="button button--primary" type="button" onClick={onSubscribe} disabled={isBusy}>
          {isBusy ? "Abrindo checkout..." : "Assinar mensalmente"}
        </button>
        {status?.status ? (
          <button className="button button--quiet" type="button" onClick={onManage} disabled={isBusy}>
            Gerenciar assinatura
          </button>
        ) : null}
        <button className="button button--quiet" type="button" onClick={onRefresh} disabled={isBusy}>
          Atualizar status
        </button>
      </div>
      {error ? <p className="auth-error">{error}</p> : null}
      <p className="auth-note">
        Apos o pagamento, o Stripe notificara o app por webhook. Se o acesso nao liberar imediatamente,
        use "Atualizar status" alguns segundos depois.
      </p>
    </AuthShell>
  );
}

function SignedInAccessGate({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>("idle");
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutBusy, setIsCheckoutBusy] = useState(false);
  const isBillingBusy = isCheckoutBusy;
  const checkoutReturnState = new URLSearchParams(window.location.search).get("checkout");
  const appReturnUrl = `${window.location.origin}${window.location.pathname}`;

  const loadSubscriptionStatus = useCallback(async () => {
    if (!billingRequired) {
      setAccessState("active");
      return;
    }

    setAccessState("loading");
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch("/api/subscription-status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel validar a assinatura.");
      }

      const data = (await response.json()) as SubscriptionStatus;
      setSubscription(data);
      setAccessState(data.active ? "active" : "blocked");
    } catch (caught) {
      setAccessState("error");
      setError(caught instanceof Error ? caught.message : "Falha ao consultar assinatura.");
    }
  }, [getToken]);

  const startCheckout = useCallback(async () => {
    setIsCheckoutBusy(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ returnUrl: appReturnUrl })
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Nao foi possivel abrir o checkout.");
      }

      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha ao iniciar assinatura.");
      setIsCheckoutBusy(false);
    }
  }, [appReturnUrl, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    void loadSubscriptionStatus();
  }, [isLoaded, isSignedIn, loadSubscriptionStatus]);

  useEffect(() => {
    if (accessState !== "blocked" || isCheckoutBusy || checkoutReturnState) {
      return;
    }

    void startCheckout();
  }, [accessState, checkoutReturnState, isCheckoutBusy, startCheckout]);

  const openCustomerPortal = async () => {
    setIsCheckoutBusy(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ returnUrl: appReturnUrl })
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Nao foi possivel abrir o portal de assinatura.");
      }

      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha ao abrir portal de assinatura.");
      setIsCheckoutBusy(false);
    }
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return null;
  }

  if (accessState === "idle" || accessState === "loading") {
    return <LoadingScreen />;
  }

  if (accessState === "blocked" || accessState === "error") {
    return (
      <SubscriptionScreen
        status={subscription}
        isBusy={isBillingBusy}
        error={error}
        onSubscribe={startCheckout}
        onManage={openCustomerPortal}
        onRefresh={() => void loadSubscriptionStatus()}
      />
    );
  }

  return (
    <>
      <div className="account-menu-trigger" aria-label="Menu da conta">
        <button className="account-billing-button" type="button" onClick={openCustomerPortal} disabled={isBillingBusy}>
          Assinatura
        </button>
        <UserButton />
      </div>
      {children}
    </>
  );
}

export function AuthGate({ children }: PropsWithChildren) {
  return (
    <>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>
      <ClerkFailed>
        <AuthProviderFailed />
      </ClerkFailed>
      <ClerkLoaded>
        <SignedOut>
          <SignedOutScreen />
        </SignedOut>
        <SignedIn>
          <SignedInAccessGate>{children}</SignedInAccessGate>
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}
