import {
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser
} from "@clerk/clerk-react";
import { useEffect, useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import App from "../App";
import { useImageWithoutHalo } from "../utils/imageProcessing";
import { moduleSources } from "../data/moduleSources";

// Landing exibe apenas dois módulos representativos em rotação: módulo 1
// (capítulo clínico — via aérea) e módulo 6 (calculadoras interativas). Cobre
// os dois formatos do produto sem cansar o visitante. O paywall carousel
// segue exibindo os 7 módulos completos.
const LANDING_MODULE_NUMBERS = new Set([1, 6]);
const landingModuleSources = moduleSources.filter((mod) => LANDING_MODULE_NUMBERS.has(mod.number));

const billingRequired = import.meta.env.VITE_CLERK_BILLING_REQUIRED !== "false";
const stripeCheckoutFallbackUrl = import.meta.env.VITE_STRIPE_CHECKOUT_URL;
const isDevEnvironment = import.meta.env.DEV;
// Link de pagamento da fase fundadora. Em produção o fallback aponta para o
// Payment Link live R$ 29,99 one-time. Em dev/test, definir
// VITE_FOUNDER_PAYMENT_LINK no .env.local apontando para um Payment Link de
// teste (https://buy.stripe.com/test_...).
const founderPaymentLink =
  import.meta.env.VITE_FOUNDER_PAYMENT_LINK ??
  "https://buy.stripe.com/14AeVc0vS66vgVKeJB3gk01";

type SubscriptionStatus = {
  active: boolean;
  status?: string;
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

const landingFeatures = [
  {
    icon: "modules",
    title: "Seis módulos clínicos",
    description:
      "Via aérea e IOT, pós-intubação, ventilação mecânica, sedoanalgesia, drogas vasoativas e calculadoras interativas, revisados e consolidados."
  },
  {
    icon: "flow",
    title: "Capítulos com discussão clínica",
    description:
      "Capítulos com discussão sobre via aérea, ventilação mecânica, sedoanalgesia e vasoativos, com referências recolhíveis e leitura otimizada para celular."
  },
  {
    icon: "calc",
    title: "Calculadoras com bloqueio mútuo",
    description:
      "Cálculo de doses, diluições e vazões com bloqueio mútuo dose/vazão, unidades e bolus editáveis e constantes clínicas centralizadas."
  },
  {
    icon: "offline",
    title: "Disponível offline no plantão",
    description:
      "Funciona sem internet após o primeiro acesso autenticado, com cache assinado, service worker e busca global em todos os módulos."
  },
  {
    icon: "update",
    title: "Atualizações rastreadas",
    description:
      "Toda alteração clínica passa por revisão médica e é registrada em changelog versionado. Você sempre consulta uma versão identificada."
  },
  {
    icon: "shield",
    title: "Privacidade clínica",
    description:
      "Sem cadastro de paciente e sem armazenamento de dados sensíveis. Apenas o seu login e a sua assinatura ficam vinculados à conta."
  }
];

const chapterHighlights = [
  {
    badge: "1",
    title: "Vasoativos e perfusão",
    body:
      "Capítulo com discussão sobre escolha, titulação e diluição de noradrenalina, vasopressina e adrenalina, integrado à calculadora de dose e vazão por peso."
  },
  {
    badge: "2",
    title: "Sedoanalgesia e RASS",
    body:
      "Discussão clínica sobre fentanil, midazolam, propofol e dexmedetomidina, com calculadora de infusão contínua e meta de RASS individualizada."
  },
  {
    badge: "3",
    title: "Ventilação mecânica protetora",
    body:
      "Capítulos sobre peso predito, PEEP, pressão de platô e desmame, com calculadora interativa de parâmetros ventilatórios."
  },
  {
    badge: "4",
    title: "Reposição e bolus por peso",
    body:
      "Discussões sobre fluidos, eletrólitos e bolus por peso, com a calculadora de dose e volume associada a cada capítulo."
  }
];

const referenceSources = [
  {
    title: "Diretrizes internacionais",
    description:
      "Conteúdo alinhado a diretrizes, revisões e fontes externas amplamente adotadas em terapia intensiva, agrupadas por módulo."
  },
  {
    title: "Referências acessíveis",
    description:
      "As fontes de cada capítulo são listadas ao final das seções, com acesso direto para consulta ou para construção de bibliografia própria."
  },
  {
    title: "Fácil compreensão",
    description:
      "Nosso dispositivo entrega um mapa visual de fácil compreensão para o refino e titulação de medicações."
  },
];

function LandingNav({ previewMode = false }: { previewMode?: boolean }) {
  const cleanedMark = useImageWithoutHalo("/virtus-logo/virtus_icon_only_transparente.png");
  return (
    <header className="landing-nav">
      <a className="landing-brand" href="/" aria-label="Virtus Clinical Tools">
        <img
          className="virtus-logo virtus-logo-mark"
          src={cleanedMark ?? "/virtus-logo/virtus_icon_only_transparente.png"}
          alt=""
          aria-hidden="true"
          style={{ opacity: cleanedMark ? 1 : 0, transition: "opacity 180ms ease" }}
        />
        <span className="virtus-wordmark">
          <span className="virtus-wordmark-name">Virtus</span>
          <span className="virtus-wordmark-tag">Clinical Tools</span>
        </span>
      </a>
      <nav className="landing-nav-actions" aria-label="Acesso">
        {previewMode ? (
          <button className="button button--ghost" type="button" disabled>
            Entrar
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="button button--ghost" type="button">
              Entrar
            </button>
          </SignInButton>
        )}
        {previewMode ? (
          <button className="button button--cta" type="button" disabled>
            Acesso fundador
          </button>
        ) : (
          <SignUpButton mode="modal">
            <button className="button button--cta" type="button">
              Acesso fundador
            </button>
          </SignUpButton>
        )}
      </nav>
    </header>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    modules: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    flow: (
      <>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="12" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <path d="M8 7l8 4M8 17l8-4" />
      </>
    ),
    calc: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3M8 19h3M13 19h3" />
      </>
    ),
    offline: (
      <>
        <path d="M5 12a7 7 0 0114 0" />
        <path d="M8.5 14.5a3.5 3.5 0 017 0" />
        <circle cx="12" cy="18" r="1.2" />
        <path d="M3 3l18 18" />
      </>
    ),
    update: (
      <>
        <path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" />
        <path d="M18 4v4h-4M6 20v-4h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z" />
        <path d="M9.5 12l2 2 3.5-4" />
      </>
    )
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ProtocolDemo() {
  return (
    <div className="demo-card protocol-demo" role="figure" aria-label="Exemplos de capítulos com calculadoras associadas">
      <div className="demo-header">
        <span className="demo-tag demo-tag--info">Capítulos com calculadora</span>
      </div>
      <div className="demo-title">
        <h3>Capítulos integrados às calculadoras</h3>
        <p>Cada bloco apresenta a discussão clínica do tema e a calculadora associada do Manual.</p>
      </div>
      <ol className="protocol-steps">
        {chapterHighlights.map((item) => (
          <li key={item.badge}>
            <span className="protocol-step-badge">{item.badge}</span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="demo-footer">
        <span className="demo-pill demo-pill--success">Calculadora integrada ao capítulo</span>
        <span className="demo-pill demo-pill--warning">Unidades e diluições editáveis</span>
      </div>
    </div>
  );
}

function CalculatorDemo() {
  return (
    <div className="demo-card calc-demo" role="figure" aria-label="Exemplo de calculadora de dose e vazão">
      <div className="demo-header">
        <span className="demo-tag demo-tag--info">Calculadora de infusão</span>
      </div>
      <div className="calc-grid">
        <label className="calc-field">
          <span>Peso</span>
          <div className="calc-input">
            <strong>70</strong>
            <em>kg</em>
          </div>
        </label>
        <label className="calc-field">
          <span>Diluição</span>
          <div className="calc-input">
            <strong>4</strong>
            <em>mg / 250 mL</em>
          </div>
        </label>
        <label className="calc-field calc-field--active">
          <span>Dose</span>
          <div className="calc-input calc-input--active">
            <strong>0,10</strong>
            <em>mcg/kg/min</em>
          </div>
        </label>
        <label className="calc-field calc-field--locked">
          <span>Vazão calculada</span>
          <div className="calc-input calc-input--locked">
            <strong>26,3</strong>
            <em>mL/h</em>
          </div>
        </label>
      </div>
    </div>
  );
}

function ScreensShowcase() {
  return (
    <div className="screens-grid" role="list">
      <article className="screen-card" role="listitem">
        <div className="screen-card-frame" aria-hidden="true">
          <div className="screen-mock screen-mock--noradrenalina">
            <div className="screen-mock-bar" />
            <div className="screen-mock-row">
              <span>Noradrenalina</span>
              <span className="screen-mock-chip">0,12 mcg/kg/min</span>
            </div>
            <div className="screen-mock-row">
              <span>Vazão calculada</span>
              <span className="screen-mock-value">31,5 mL/h</span>
            </div>
            <div className="screen-mock-row screen-mock-row--soft">
              <span>Diluição</span>
              <span>4 mg / 250 mL</span>
            </div>
          </div>
        </div>
        <h3>Calculadora de vasoativos por peso</h3>
        <p>Dose, vazão e diluição em uma única tela. O bloqueio mútuo reduz o risco de erro de digitação.</p>
      </article>

      <article className="screen-card" role="listitem">
        <div className="screen-card-frame" aria-hidden="true">
          <div className="screen-mock screen-mock--sedacao">
            <div className="screen-mock-bar" />
            <div className="screen-mock-stack">
              <span className="screen-mock-tag">Sedoanalgesia</span>
              <strong>Fentanil + Midazolam</strong>
              <span className="screen-mock-meta">RASS-alvo −2 — despertar diário</span>
            </div>
            <div className="screen-mock-grid">
              <span>1,0 mcg/kg/h</span>
              <span>0,05 mg/kg/h</span>
            </div>
          </div>
        </div>
        <h3>Calculadora de sedoanalgesia</h3>
        <p>Cálculo de infusão contínua, com RASS-alvo e referência ao capítulo de sedação titulada.</p>
      </article>

      <article className="screen-card" role="listitem">
        <div className="screen-card-frame" aria-hidden="true">
          <div className="screen-mock screen-mock--vm">
            <div className="screen-mock-bar" />
            <div className="screen-mock-vm-grid">
              <div>
                <span>VT</span>
                <strong>6 mL/kg PBW</strong>
              </div>
              <div>
                <span>PEEP</span>
                <strong>10 cmH2O</strong>
              </div>
              <div>
                <span>FR</span>
                <strong>22</strong>
              </div>
              <div>
                <span>Pressão de platô</span>
                <strong>27 cmH2O</strong>
              </div>
            </div>
            <div className="screen-mock-bar screen-mock-bar--accent" />
          </div>
        </div>
        <h3>Calculadora de ventilação protetora</h3>
        <p>Apoio ao ajuste inicial por peso predito, com referência ao capítulo de pressão de platô e PEEP.</p>
      </article>
    </div>
  );
}

function FooterBrand() {
  const cleaned = useImageWithoutHalo("/virtus-logo/virtus_icon_only_footer_30px.png");
  return (
    <div className="landing-footer-brand">
      <img
        className="virtus-logo virtus-logo-footer"
        src={cleaned ?? "/virtus-logo/virtus_icon_only_footer_30px.png"}
        alt="Virtus"
        style={{ opacity: cleaned ? 1 : 0, transition: "opacity 180ms ease" }}
      />
      <span>Virtus - Serviços Médicos · Clinical Tools</span>
    </div>
  );
}

function LandingModuleCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = landingModuleSources.length;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (paused) {
      return;
    }
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % total);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [index, paused, total]);

  const current = landingModuleSources[index];
  const goPrev = () => setIndex((c) => (c - 1 + total) % total);
  const goNext = () => setIndex((c) => (c + 1) % total);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.head) {
      return;
    }
    let style = doc.getElementById("landing-preview-block-style") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "landing-preview-block-style";
      doc.head.appendChild(style);
    }
    style.textContent = PREVIEW_BLOCK_CSS;
  };

  return (
    <div
      className="landing-carousel-split"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="landing-section-copy landing-carousel-copy">
        <p className="landing-eyebrow">Conteúdo real do Manual</p>
        <h2 id="livepreview-title" className="landing-section-title">
          O conteúdo real, exatamente como você vai usar no plantão.
        </h2>
        <p className="landing-section-lead">
          Dois módulos do Manual entram em rotação no celular ao lado — um capítulo clínico e a
          tela de calculadoras. A prévia é somente leitura; a interação completa é liberada após
          o pagamento do acesso fundador.
        </p>

        <div className="landing-carousel-meta">
          <span className="landing-carousel-eyebrow">
            Módulo {current.number} de {total}
          </span>
          <h3 className="landing-carousel-title">{current.title}</h3>
        </div>

        <div className="landing-carousel-controls">
          <div className="landing-carousel-nav" role="group" aria-label="Navegar módulos">
            <button
              type="button"
              className="landing-carousel-arrow"
              onClick={goPrev}
              aria-label="Módulo anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="landing-carousel-arrow"
              onClick={goNext}
              aria-label="Próximo módulo"
            >
              ›
            </button>
          </div>
          <div className="landing-carousel-dots" role="tablist" aria-label="Módulo em destaque">
            {landingModuleSources.map((mod, i) => (
              <button
                key={mod.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Ver módulo ${mod.number} — ${mod.title}`}
                className={`landing-carousel-dot ${i === index ? "landing-carousel-dot--active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="landing-phone" role="figure" aria-label={`Pré-visualização do módulo ${current.number}`}>
        <span className="landing-phone-speaker" aria-hidden="true" />
        <div className="landing-phone-screen">
          <iframe
            key={current.id}
            ref={iframeRef}
            title={`Pré-visualização do módulo ${current.number} — ${current.title}`}
            srcDoc={current.html}
            className="landing-phone-iframe"
            sandbox="allow-same-origin allow-scripts"
            loading="lazy"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
}

export function SignedOutScreen({ previewMode = false }: { previewMode?: boolean } = {}) {
  useEffect(() => {
    document.body.classList.add("landing-active");
    return () => document.body.classList.remove("landing-active");
  }, []);

  return (
    <div className="landing-shell">
      <main className="landing">
        <LandingNav previewMode={previewMode} />

        <section className="landing-hero" aria-labelledby="hero-title">
          <span className="landing-badge">Manual de Medicina Intensiva</span>
          <h1 id="hero-title">
            A referência clínica de UTI <span className="text-glow">para o seu plantão</span>.
          </h1>
          <p className="landing-hero-subtitle">
            Capítulos clínicos, calculadoras interativas e fluxos consolidados em uma única interface,
            preparados para a consulta objetiva na emergência e na terapia intensiva.
          </p>
          <div className="landing-cta">
            {previewMode ? (
              <button className="button button--cta button--lg" type="button" disabled>
                Garantir acesso fundador — R$ 29,99
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="button button--cta button--lg" type="button">
                  Garantir acesso fundador — R$ 29,99
                </button>
              </SignUpButton>
            )}
            {previewMode ? (
              <button className="button button--ghost button--lg" type="button" disabled>
                Já tenho conta
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="button button--ghost button--lg" type="button">
                  Já tenho conta
                </button>
              </SignInButton>
            )}
          </div>
          <ul className="landing-hero-meta" aria-label="Benefícios do acesso fundador">
            <li><span className="dot dot--cyan" aria-hidden="true" /> Pagamento único de R$ 29,99</li>
            <li><span className="dot dot--cyan" aria-hidden="true" /> Seis módulos clínicos e calculadoras integradas</li>
            <li><span className="dot dot--cyan" aria-hidden="true" /> Atualizações inclusas no acesso</li>
          </ul>
        </section>

        <section className="landing-section landing-section--preview" aria-labelledby="livepreview-title">
          <LandingModuleCarousel />
        </section>

        <section className="landing-section" aria-labelledby="features-title">
          <p className="landing-eyebrow">O que você ganha</p>
          <h2 id="features-title" className="landing-section-title">
            Tudo o que o cenário de cuidados intensivos exige.
          </h2>
          <div className="landing-grid landing-grid--features">
            {landingFeatures.map((feature) => (
              <article key={feature.title} className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">
                  <FeatureIcon name={feature.icon} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-section--split" aria-labelledby="protocol-title">
          <div className="landing-section-copy">
            <p className="landing-eyebrow">Exemplo de conteúdo</p>
            <h2 id="protocol-title" className="landing-section-title">
              Capítulos com discussão clínica integrada à calculadora.
            </h2>
            <p className="landing-section-lead">
              Cada calculadora é introduzida por um capítulo que discute indicação, ajustes, limites e
              armadilhas, sem encurtar o raciocínio clínico. A leitura passa diretamente do texto à
              ferramenta utilizada à beira do leito.
            </p>
            <ul className="landing-bullets">
              <li>Capítulos com discussão objetiva e referências organizadas.</li>
              <li>Calculadoras com unidades editáveis e bloqueio mútuo dose/vazão.</li>
              <li>Leitura otimizada para celular, busca global e armazenamento offline.</li>
            </ul>
          </div>
          <ProtocolDemo />
        </section>

        <section className="landing-section landing-section--split landing-section--reverse" aria-labelledby="calc-title">
          <CalculatorDemo />
          <div className="landing-section-copy">
            <p className="landing-eyebrow">Exemplo de calculadora</p>
            <h2 id="calc-title" className="landing-section-title">
              Cálculo de dose e vazão sem espaço para ambiguidade.
            </h2>
            <p className="landing-section-lead">
              As calculadoras seguem a regra dose-vazão com bloqueio mútuo: o campo ativo calcula o
              outro automaticamente; ao limpar o campo ativo, o modo inverso volta a ficar disponível.
              As unidades e a diluição podem ser editadas conforme o cenário clínico.
            </p>
            <ul className="landing-bullets">
              <li>Constantes clínicas centralizadas e versionadas.</li>
              <li>Saída sempre coerente com o par dose/vazão escolhido.</li>
              <li>Compatibilidade com bolus, infusão contínua e ajustes por peso.</li>
            </ul>
          </div>
        </section>

        <section className="landing-section" aria-labelledby="screens-title">
          <p className="landing-eyebrow">Telas demonstrativas</p>
          <h2 id="screens-title" className="landing-section-title">
            Interface pensada para o cuidado intensivo.
          </h2>
          <ScreensShowcase />
        </section>

        <section className="landing-section" aria-labelledby="refs-title">
          <p className="landing-eyebrow">Referências e credibilidade</p>
          <h2 id="refs-title" className="landing-section-title">
            Conteúdo rastreável, sem improviso.
          </h2>
          <div className="landing-grid landing-grid--refs">
            {referenceSources.map((item) => (
              <article key={item.title} className="landing-ref">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className="landing-disclaimer">
            O Manual é uma ferramenta educacional de apoio clínico. Não substitui o julgamento médico
            individualizado nem os protocolos institucionais.
          </p>
        </section>

        <section className="landing-founder" aria-labelledby="founder-title">
          <div className="landing-founder-card">
            <span className="landing-badge landing-badge--solid">Acesso fundador</span>
            <h2 id="founder-title">
              R$ <span className="founder-price">29</span>
              <span className="founder-price-cents">,99</span>
            </h2>
            <p className="founder-mode">Pagamento único — sem mensalidade</p>
            <ul className="founder-list">
              <li><span className="dot dot--success" aria-hidden="true" /> Acesso completo aos seis módulos clínicos</li>
              <li><span className="dot dot--success" aria-hidden="true" /> Calculadoras interativas e fluxos visuais integrados</li>
              <li><span className="dot dot--success" aria-hidden="true" /> Modo offline após o primeiro acesso autenticado</li>
              <li><span className="dot dot--success" aria-hidden="true" /> Atualizações clínicas inclusas no acesso</li>
              <li><span className="dot dot--success" aria-hidden="true" /> Atendimento prioritário para a turma fundadora</li>
            </ul>
            {previewMode ? (
              <button className="button button--cta button--xl" type="button" disabled>
                Quero meu acesso fundador
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="button button--cta button--xl" type="button">
                  Quero meu acesso fundador
                </button>
              </SignUpButton>
            )}
            <p className="founder-note">
              Crie sua conta agora e conclua o pagamento de R$ 29,99 em seguida para liberar o
              acesso completo ao Manual.
            </p>
            <p className="founder-note">
              As vagas da fase fundadora são limitadas. Encerrado o período, o produto passa ao modelo
              de assinatura mensal padrão.
            </p>
          </div>
        </section>

        <footer className="landing-footer">
          <FooterBrand />
          <span className="landing-footer-meta">
            Manual de Medicina Intensiva — produto digital educacional para estudo e apoio à prática
            clínica.
          </span>
        </footer>
      </main>
    </div>
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

// CSS injetado dentro do iframe da prévia. Três responsabilidades:
// 1) Esconder o header lateral (aside/brand/nav-toggle) — sobra mais espaço útil.
// 2) Bloquear inputs/calculadoras (interatividade somente em headers de seção).
// 3) Banner sticky "somente leitura" no topo do iframe.
const PREVIEW_BLOCK_CSS = `
  /* Esconde o aside/menu lateral e força o main a ocupar toda a largura.
     Cobre os módulos 1-6 (usam .app grid 310px 1fr) e o módulo 7 (sem aside). */
  .app, #moduleApp {
    display: block !important;
    grid-template-columns: 1fr !important;
  }
  .app > aside, #moduleApp > aside, body > aside {
    display: none !important;
  }
  .app > main, #moduleApp > main {
    margin: 0 !important;
    padding: 12px 16px !important;
    max-width: none !important;
    width: 100% !important;
  }
  /* Inputs, calculadoras e form widgets ficam visualmente esmaecidos
     e não respondem a cliques/digitação. Headers (h2, h3) continuam ativos
     para permitir colapsar/expandir seções da prévia. */
  input, textarea, select, button:not([data-codex-collapsible]),
  [contenteditable], .calc-input, .calc-input--active, .calc-input--locked,
  form, [role="button"]:not(h2):not(h3) {
    pointer-events: none !important;
    cursor: not-allowed !important;
    opacity: 0.65;
  }
  /* Banner sticky avisando que é prévia */
  body::before {
    content: "Prévia somente leitura — assine para usar as calculadoras";
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    display: block;
    background: linear-gradient(90deg, #123c69, #1e5a96);
    color: #fff;
    font: 700 12px/1.4 system-ui, -apple-system, sans-serif;
    letter-spacing: 0.04em;
    text-align: center;
    padding: 8px 12px;
  }
`;

function PaywallPreviewCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = moduleSources.length;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (paused) {
      return;
    }
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % total);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [index, paused, total]);

  const current = moduleSources[index];
  const goPrev = () => setIndex((c) => (c - 1 + total) % total);
  const goNext = () => setIndex((c) => (c + 1) % total);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.head) {
      return;
    }
    let style = doc.getElementById("paywall-preview-block-style") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "paywall-preview-block-style";
      doc.head.appendChild(style);
    }
    style.textContent = PREVIEW_BLOCK_CSS;
  };

  return (
    <div
      className="paywall-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="paywall-carousel-header">
        <div>
          <span className="paywall-carousel-eyebrow">Veja por dentro do Manual</span>
          <h3 className="paywall-carousel-title">
            Módulo {current.number} — {current.title}
          </h3>
        </div>
        <div className="paywall-carousel-nav" role="group" aria-label="Navegar módulos">
          <button
            type="button"
            className="paywall-carousel-arrow"
            onClick={goPrev}
            aria-label="Módulo anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="paywall-carousel-arrow"
            onClick={goNext}
            aria-label="Próximo módulo"
          >
            ›
          </button>
        </div>
      </div>
      <div className="paywall-carousel-frame">
        <iframe
          key={current.id}
          ref={iframeRef}
          title={`Pré-visualização do módulo ${current.number} — ${current.title}`}
          srcDoc={current.html}
          className="paywall-carousel-iframe"
          sandbox="allow-same-origin allow-scripts"
          loading="lazy"
          onLoad={handleIframeLoad}
        />
      </div>
      <div className="paywall-carousel-dots" role="tablist" aria-label="Módulo em destaque">
        {moduleSources.map((mod, i) => (
          <button
            key={mod.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ver módulo ${mod.number}`}
            className={`paywall-carousel-dot ${i === index ? "paywall-carousel-dot--active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

function PaywallOverlay({
  paymentUrl,
  isWaiting,
  onRefresh
}: {
  paymentUrl: string;
  isWaiting: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="paywall-overlay" role="dialog" aria-modal="false" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <div className="paywall-card-copy">
          <span className="paywall-eyebrow">Acesso fundador</span>
          <h2 id="paywall-title" className="paywall-title">
            Conclua o pagamento para liberar o Manual
          </h2>
          <p className="paywall-lead">
            Sua conta está criada. Veja ao lado os 7 módulos reais do Manual em rotação —
            calculadoras, fluxos clínicos e referências. O acesso completo, com interação e
            cálculo, é liberado após a confirmação do pagamento de R$ 29,99 (pagamento único
            da fase fundadora).
          </p>
          <a className="button button--cta button--xl paywall-cta" href={paymentUrl}>
            Concluir pagamento — R$ 29,99
          </a>
          <button
            className="button button--quiet paywall-refresh"
            type="button"
            onClick={onRefresh}
            disabled={isWaiting}
          >
            {isWaiting ? "Aguardando confirmação do pagamento..." : "Já paguei — atualizar acesso"}
          </button>
          <p className="paywall-note">
            Após pagar você é redirecionado de volta. O acesso é liberado automaticamente assim
            que o Stripe confirma o pagamento.
          </p>
        </div>
        <PaywallPreviewCarousel />
      </div>
    </div>
  );
}

function subscriptionStatusFromPublicMetadata(
  metadata: Record<string, unknown> | null | undefined
): SubscriptionStatus {
  const subscriptionStatus =
    typeof metadata?.subscriptionStatus === "string" ? metadata.subscriptionStatus : undefined;
  const stripeSubscriptionStatus =
    typeof metadata?.stripeSubscriptionStatus === "string" ? metadata.stripeSubscriptionStatus : undefined;
  const active = subscriptionStatus === "active" || stripeSubscriptionStatus === "active";

  return {
    active,
    status: subscriptionStatus ?? stripeSubscriptionStatus ?? "none"
  };
}

function buildFounderPaymentUrl(clerkUserId: string | undefined, email: string | undefined): string {
  const params = new URLSearchParams();
  if (clerkUserId) {
    params.set("client_reference_id", clerkUserId);
  }
  if (email) {
    params.set("prefilled_email", email);
  }
  const query = params.toString();
  return query ? `${founderPaymentLink}?${query}` : founderPaymentLink;
}

function SignedInAccessGate({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [accessState, setAccessState] = useState<AccessState>("idle");
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isCheckoutBusy, setIsCheckoutBusy] = useState(false);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const pollTimeoutRef = useRef<number | null>(null);
  const isBillingBusy = isCheckoutBusy;
  const appReturnUrl = `${window.location.origin}${window.location.pathname}`;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isUserLoaded) {
      return;
    }

    if (!billingRequired) {
      setAccessState("active");
      return;
    }

    const status = subscriptionStatusFromPublicMetadata(user?.publicMetadata as Record<string, unknown>);
    setSubscription(status);
    setAccessState(status.active ? "active" : "blocked");
  }, [isLoaded, isSignedIn, isUserLoaded, user?.publicMetadata]);

  useEffect(() => {
    if (typeof window === "undefined" || !user) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") {
      return;
    }

    params.delete("checkout");
    const cleanQuery = params.toString();
    const cleanUrl =
      window.location.pathname +
      (cleanQuery ? `?${cleanQuery}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", cleanUrl);

    let attempts = 0;
    const maxAttempts = 15;
    setIsWaitingPayment(true);

    const poll = async () => {
      attempts += 1;
      try {
        await user.reload();
      } catch {
        // ignora — tenta novamente
      }
      const reloaded = subscriptionStatusFromPublicMetadata(
        user.publicMetadata as Record<string, unknown>
      );
      if (reloaded.active) {
        setSubscription(reloaded);
        setAccessState("active");
        setIsWaitingPayment(false);
        return;
      }
      if (attempts >= maxAttempts) {
        setIsWaitingPayment(false);
        return;
      }
      pollTimeoutRef.current = window.setTimeout(poll, 2000);
    };

    void poll();

    return () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, [user]);

  const refreshAccess = async () => {
    if (!user) {
      window.location.reload();
      return;
    }
    setIsWaitingPayment(true);
    try {
      await user.reload();
      const reloaded = subscriptionStatusFromPublicMetadata(
        user.publicMetadata as Record<string, unknown>
      );
      setSubscription(reloaded);
      setAccessState(reloaded.active ? "active" : "blocked");
    } catch {
      // mantém estado atual; se nada mudou, o user reverá o paywall
    } finally {
      setIsWaitingPayment(false);
    }
  };

  const openCustomerPortal = async () => {
    setIsCheckoutBusy(true);

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
    } catch {
      setIsCheckoutBusy(false);
    }
  };

  if (!isLoaded || !isUserLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return null;
  }

  if (accessState === "idle" || accessState === "loading") {
    return <LoadingScreen />;
  }

  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const paymentUrl = buildFounderPaymentUrl(user?.id, primaryEmail);
  const isBlocked = accessState === "blocked" || accessState === "error";
  // Stripe Customer Portal só faz sentido para assinaturas recorrentes.
  // No modelo atual (Payment Link one-time R$ 29,99 fundador), o webhook
  // não recebe customerId — não há subscription para gerenciar. Esconde o
  // botão "Assinatura" quando não houver stripeCustomerId no metadata.
  const stripeCustomerId =
    typeof user?.publicMetadata?.stripeCustomerId === "string"
      ? user.publicMetadata.stripeCustomerId
      : undefined;
  const hasManageableSubscription = Boolean(stripeCustomerId);
  // Mantém variável para evitar warnings com possíveis usos futuros do status
  void subscription;
  void isDevEnvironment;
  void stripeCheckoutFallbackUrl;

  return (
    <>
      <div className="account-menu-trigger" aria-label="Menu da conta">
        {!isBlocked && hasManageableSubscription && (
          <button
            className="account-billing-button"
            type="button"
            onClick={openCustomerPortal}
            disabled={isBillingBusy}
          >
            Assinatura
          </button>
        )}
        <UserButton />
      </div>
      <div className={isBlocked ? "app-paywall-locked" : undefined}>{children}</div>
      {isBlocked ? (
        <PaywallOverlay
          paymentUrl={paymentUrl}
          isWaiting={isWaitingPayment}
          onRefresh={() => {
            void refreshAccess();
          }}
        />
      ) : null}
    </>
  );
}

// Dev-only: renderiza o App com o paywall ativo para iterar visual sem Clerk.
// Importado dinamicamente em main.tsx no caminho `?preview=paywall` (DEV-only).
export function PaywallPreview() {
  return (
    <>
      <div className="app-paywall-locked">
        <App />
      </div>
      <PaywallOverlay
        paymentUrl="https://buy.stripe.com/test_preview"
        isWaiting={false}
        onRefresh={() => undefined}
      />
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
