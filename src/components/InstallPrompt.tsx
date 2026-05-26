import { useEffect, useState, useCallback } from "react";

/**
 * Tipo do evento `beforeinstallprompt` (não está no lib.dom.d.ts).
 * Disparado por Chrome/Edge/Android quando a PWA é elegível para instalação.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

type Platform = "ios" | "android-chrome" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  // iOS (Safari/Chrome/Firefox no iPad/iPhone — todos usam WebKit, mesmo prompt manual)
  if (/iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream) {
    return "ios";
  }
  // Android — geralmente Chrome / Samsung Internet
  if (/Android/.test(ua)) return "android-chrome";
  // Desktop Chromium-based (Chrome, Edge, Brave, Opera)
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari adiciona navigator.standalone quando instalado
  const navStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // Android/desktop usam media query display-mode:standalone
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  return navStandalone || mediaStandalone;
}

const STORAGE_DISMISSED_KEY = "virtus_install_prompt_dismissed_at";
const SHOW_AGAIN_AFTER_DAYS = 14;

function shouldShowAfterDismiss(): boolean {
  if (typeof localStorage === "undefined") return true;
  const raw = localStorage.getItem(STORAGE_DISMISSED_KEY);
  if (!raw) return true;
  const dismissedAt = parseInt(raw, 10);
  if (!Number.isFinite(dismissedAt)) return true;
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince >= SHOW_AGAIN_AFTER_DAYS;
}

export function InstallPrompt() {
  const [platform] = useState<Platform>(() => detectPlatform());
  const [standalone] = useState<boolean>(() => isStandalone());
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [iosHelpOpen, setIosHelpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (standalone) return;
    if (!shouldShowAfterDismiss()) return;

    // Android/desktop Chromium: captura o evento e mostra botão custom.
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS Safari: nunca dispara beforeinstallprompt. Mostra prompt manual
    // após pequeno delay para não atrapalhar primeiro paint.
    let iosTimer: number | undefined;
    if (platform === "ios") {
      iosTimer = window.setTimeout(() => setVisible(true), 3500);
    }

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, [platform, standalone]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setIosHelpOpen(false);
    try {
      localStorage.setItem(STORAGE_DISMISSED_KEY, String(Date.now()));
    } catch {
      /* ignore (modo privado pode bloquear localStorage) */
    }
  }, []);

  if (standalone || !visible) return null;

  const isIos = platform === "ios";
  const canPromptNatively = !isIos && deferredPrompt !== null;

  return (
    <>
      <div className="install-prompt" role="dialog" aria-labelledby="install-prompt-title">
        <div className="install-prompt__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v10" />
            <path d="M8 10l4 4 4-4" />
            <path d="M4 18h16" />
          </svg>
        </div>
        <div className="install-prompt__copy">
          <strong id="install-prompt-title" className="install-prompt__title">
            Adicionar à tela inicial
          </strong>
          <span className="install-prompt__lead">
            {isIos
              ? "Use o Manual como app nativo no seu iPhone/iPad."
              : "Instale como app — abre em janela própria, sem barra do navegador."}
          </span>
        </div>
        <div className="install-prompt__actions">
          {canPromptNatively ? (
            <button type="button" className="install-prompt__cta" onClick={handleInstall}>
              Instalar
            </button>
          ) : isIos ? (
            <button
              type="button"
              className="install-prompt__cta"
              onClick={() => setIosHelpOpen(true)}
            >
              Como instalar
            </button>
          ) : null}
          <button
            type="button"
            className="install-prompt__dismiss"
            onClick={handleDismiss}
            aria-label="Fechar sugestão de instalação"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
        </div>
      </div>

      {iosHelpOpen ? (
        <div
          className="install-help"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-help-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIosHelpOpen(false);
          }}
        >
          <div className="install-help__panel">
            <header className="install-help__head">
              <span className="install-help__eyebrow">iOS · Safari</span>
              <strong id="install-help-title" className="install-help__title">
                Como adicionar à tela de início
              </strong>
              <button
                type="button"
                className="install-help__close"
                onClick={() => setIosHelpOpen(false)}
                aria-label="Fechar tutorial"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </header>
            <ol className="install-help__steps">
              <li>
                <span className="install-help__step-num">1</span>
                <div>
                  Toque no botão <strong>Compartilhar</strong>{" "}
                  <span aria-hidden="true" className="install-help__inline-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V4" />
                      <path d="M8 8l4-4 4 4" />
                      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
                    </svg>
                  </span>{" "}
                  na barra inferior do Safari.
                </div>
              </li>
              <li>
                <span className="install-help__step-num">2</span>
                <div>
                  Role e toque em{" "}
                  <strong>Adicionar à Tela de Início</strong>{" "}
                  <span aria-hidden="true" className="install-help__inline-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="3" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                  </span>
                  .
                </div>
              </li>
              <li>
                <span className="install-help__step-num">3</span>
                <div>
                  Confirme o nome (<em>Virtus Intensiva</em>) e toque em{" "}
                  <strong>Adicionar</strong>.
                </div>
              </li>
            </ol>
            <p className="install-help__note">
              Ao abrir pelo ícone na tela de início, o app vai em tela cheia, sem
              a barra do navegador — e funciona offline depois da primeira carga.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
