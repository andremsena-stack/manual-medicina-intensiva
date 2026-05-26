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
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "../App";
import { useImageWithoutHalo } from "../utils/imageProcessing";
import { moduleSources } from "../data/moduleSources";
import { track } from "../utils/analytics";

// Registra plugin uma vez no módulo. ScrollTrigger é free no GSAP.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Landing exibe apenas dois módulos representativos em rotação: módulo 1
// (capítulo clínico — via aérea) e módulo 7 (calculadoras interativas). Cobre
// os dois formatos do produto sem cansar o visitante. O paywall carousel
// segue exibindo os 8 módulos completos.
const LANDING_MODULE_NUMBERS = new Set([1, 7]);
const landingModuleSources = moduleSources.filter((mod) => LANDING_MODULE_NUMBERS.has(mod.number));

const billingRequired = import.meta.env.VITE_CLERK_BILLING_REQUIRED !== "false";
const stripeCheckoutFallbackUrl = import.meta.env.VITE_STRIPE_CHECKOUT_URL;
const isDevEnvironment = import.meta.env.DEV;
// Planos de assinatura recorrente. Price IDs não são segredos — são identificadores
// públicos do Stripe, seguros para constar no bundle do frontend.
const PLANS = [
  {
    id: "annual" as const,
    priceId: "price_1TazAEAnI7zzun0R5wGrD2ol",
    label: "Anual",
    price: "R$ 199,99",
    period: "por ano",
    perMonth: "R$ 16,67/mês",
    badge: "Melhor valor" as string | null,
    highlight: true
  },
  {
    id: "quarterly" as const,
    priceId: "price_1Taz9eAnI7zzun0RCHhB5NOg",
    label: "Trimestral",
    price: "R$ 63,99",
    period: "por 3 meses",
    perMonth: "R$ 21,33/mês",
    badge: null as string | null,
    highlight: false
  },
  {
    id: "monthly" as const,
    priceId: "price_1Taz9MAnI7zzun0R92AYw0ld",
    label: "Mensal",
    price: "R$ 25,99",
    period: "por mês",
    perMonth: null as string | null,
    badge: null as string | null,
    highlight: false
  }
];

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
    stat: "6 áreas clínicas",
    title: "Seis módulos clínicos",
    description:
      "Via aérea e IOT, pós-intubação, ventilação mecânica, sedoanalgesia, drogas vasoativas e calculadoras interativas, revisados e consolidados."
  },
  {
    icon: "flow",
    stat: "Texto + calculadora",
    title: "Capítulos com discussão clínica",
    description:
      "Capítulos com discussão sobre via aérea, ventilação mecânica, sedoanalgesia e vasoativos, com referências recolhíveis e leitura otimizada para celular."
  },
  {
    icon: "calc",
    stat: "Dose ↔ vazão",
    title: "Calculadoras com bloqueio mútuo",
    description:
      "Cálculo de doses, diluições e vazões com bloqueio mútuo dose/vazão, unidades e bolus editáveis e constantes clínicas centralizadas."
  },
  {
    icon: "offline",
    stat: "Sem internet",
    title: "Disponível offline no plantão",
    description:
      "Funciona sem internet após o primeiro acesso autenticado, com cache assinado, service worker e busca global em todos os módulos."
  },
  {
    icon: "update",
    stat: "Changelog versionado",
    title: "Atualizações rastreadas",
    description:
      "Toda alteração clínica passa por revisão médica e é registrada em changelog versionado. Você sempre consulta uma versão identificada."
  },
  {
    icon: "shield",
    stat: "0 dados de paciente",
    title: "Privacidade clínica",
    description:
      "Sem cadastro de paciente e sem armazenamento de dados sensíveis. Apenas o seu login e a sua assinatura ficam vinculados à conta."
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
            <button
              className="button button--ghost"
              type="button"
              onClick={() => track("landing_nav_signin_click")}
            >
              Entrar
            </button>
          </SignInButton>
        )}
        {previewMode ? (
          <button className="button button--cta" type="button" disabled>
            Quero meu acesso
          </button>
        ) : (
          <SignUpButton mode="modal">
            <button
              className="button button--cta"
              type="button"
              onClick={() => track("landing_nav_signup_click")}
            >
              Quero meu acesso
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

// Variants compartilhados para reveal sequencial (Framer Motion).
// Easing custom (cubic-bezier 0.16,1,0.3,1) = "expo-out" suave, mais cinemático
// que ease-out padrão. Usado em headline split, phone reveal e meta entries.
const HERO_EASE = [0.16, 1, 0.3, 1] as const;

const heroWordVariants: Variants = {
  hidden: { opacity: 0, y: 72, skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.9, ease: HERO_EASE }
  })
};

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0.8) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: HERO_EASE }
  })
};

// HeroCanvasBg: fundo animado em canvas substituindo o vídeo de fundo.
// Renderiza partículas em deriva + curva sinusoidal (estilo "dose flowing") +
// grid sutil. Pausa em prefers-reduced-motion. Não bloqueia interação.
function HeroCanvasBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    let curvePhase = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 600 ? 35 : 60;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.35 + 0.1
      }));
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Radial glow ciano leve no centro-superior
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.55);
      grad.addColorStop(0, "rgba(48, 241, 230, 0.06)");
      grad.addColorStop(1, "rgba(48, 241, 230, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Linhas de grid horizontais (estilo dashboard clínico)
      ctx.strokeStyle = "rgba(159, 232, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let y = 80; y < h; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Curva sinusoidal (sweep visual de "dose fluindo")
      curvePhase += 0.004;
      ctx.strokeStyle = "rgba(48, 241, 230, 0.14)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y =
          h * 0.55 +
          Math.sin(x * 0.005 + curvePhase) * 70 +
          Math.sin(x * 0.012 + curvePhase * 0.6) * 24;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Curva secundária deslocada
      ctx.strokeStyle = "rgba(46, 139, 255, 0.08)";
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y =
          h * 0.45 +
          Math.sin(x * 0.004 - curvePhase * 0.8) * 60 +
          Math.cos(x * 0.009 + curvePhase) * 18;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = `rgba(48, 241, 230, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      draw();
    } else {
      // Render frame único estático
      draw();
      window.cancelAnimationFrame(rafId);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-v2-bg" aria-hidden="true" />;
}

function LandingHeroV2({ previewMode = false }: { previewMode?: boolean }) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parallax do phone (rotação 3D suave seguindo o mouse). Desligado quando
  // o usuário pediu prefers-reduced-motion.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 18 });
  const phoneRotateY = useTransform(springX, [-1, 1], [-7, 7]);
  const phoneRotateX = useTransform(springY, [-1, 1], [4, -4]);
  const phoneFloatY = useTransform(springY, [-1, 1], [-10, 10]);

  // Estado do carousel (rotação automática dos 2 módulos visíveis).
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = landingModuleSources.length;

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

  const handleMouseMove = (event: React.MouseEvent) => {
    if (reduceMotion || !stageRef.current) {
      return;
    }
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setPaused(false);
  };

  return (
    <section
      className="hero-v2"
      aria-labelledby="hero-v2-title"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setPaused(true)}
    >
      <HeroCanvasBg />
      <LandingNav previewMode={previewMode} />

      <div className="hero-v2-stage">
        <motion.h1
          id="hero-v2-title"
          className="hero-v2-title hero-v2-title--top"
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-v2-word" custom={0} variants={heroWordVariants}>
            Decisão
          </motion.span>
          <motion.span className="hero-v2-word" custom={1} variants={heroWordVariants}>
            Rápida
          </motion.span>
        </motion.h1>

        <div className="hero-v2-phone-anchor">
          <div className="hero-v2-phone-entrance">
            <motion.div
              className="hero-v2-phone-motion"
              style={reduceMotion ? undefined : { rotateY: phoneRotateY, rotateX: phoneRotateX, y: phoneFloatY }}
            >
            <div
              className="landing-phone hero-v2-phone"
              role="figure"
              aria-label={`Pré-visualização do módulo ${current.number}`}
            >
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
            </motion.div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="hero-v2-title hero-v2-title--bottom"
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-v2-word" custom={2} variants={heroWordVariants}>
            Paciente
          </motion.span>
          <motion.span className="hero-v2-word" custom={3} variants={heroWordVariants}>
            Seguro
          </motion.span>
        </motion.div>

        <motion.div
          className="hero-v2-meta"
          variants={heroFadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
        >
          <p className="hero-v2-lead">
            Capítulos clínicos, calculadoras de dose por peso e fluxos consolidados num único
            app. Decisões rápidas no plantão — e mais segurança para o paciente.
          </p>
          <div className="hero-v2-cta">
            {previewMode ? (
              <button className="button button--cta button--lg" type="button" disabled>
                Quero meu acesso
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button
                  className="button button--cta button--lg"
                  type="button"
                  onClick={() => track("landing_hero_signup_click")}
                >
                  Quero meu acesso
                </button>
              </SignUpButton>
            )}
            {previewMode ? (
              <button className="button button--ghost button--lg" type="button" disabled>
                Já tenho conta
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="button button--ghost button--lg"
                  type="button"
                  onClick={() => track("landing_hero_signin_click")}
                >
                  Já tenho conta
                </button>
              </SignInButton>
            )}
          </div>
        </motion.div>

        <motion.div
          className="hero-v2-carousel-meta"
          variants={heroFadeUp}
          initial="hidden"
          animate="visible"
          custom={1.05}
        >
          <span className="hero-v2-carousel-label">
            Módulo {current.number} de {total} em rotação
          </span>
          <span className="hero-v2-carousel-title">{current.title}</span>
          <div className="hero-v2-carousel-controls">
            <button
              type="button"
              className="landing-carousel-arrow"
              onClick={goPrev}
              aria-label="Módulo anterior"
            >
              ‹
            </button>
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
            <button
              type="button"
              className="landing-carousel-arrow"
              onClick={goNext}
              aria-label="Próximo módulo"
            >
              ›
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// AnimatedCalculator: demonstra a calculadora dose↔vazão em ação. GSAP
// timeline anima os números sendo digitados/calculados quando a seção entra
// no viewport (via ScrollTrigger). Mostra também o "modo ativo" alternando
// entre dose e vazão pra ilustrar bloqueio mútuo.
function AnimatedCalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const pesoRef = useRef<HTMLSpanElement>(null);
  const diluicaoRef = useRef<HTMLSpanElement>(null);
  const doseRef = useRef<HTMLSpanElement>(null);
  const vazaoRef = useRef<HTMLSpanElement>(null);
  const doseFieldRef = useRef<HTMLDivElement>(null);
  const vazaoFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      // Etapa 1: peso preenchendo
      const peso = { val: 0 };
      tl.to(peso, {
        val: 70,
        duration: 1.0,
        ease: "power2.out",
        onUpdate: () => {
          if (pesoRef.current) pesoRef.current.textContent = Math.round(peso.val).toString();
        }
      });

      // Etapa 2: diluição já fixa, só fade-in
      tl.fromTo(
        diluicaoRef.current,
        { opacity: 0.35 },
        { opacity: 1, duration: 0.5 },
        "+=0.1"
      );

      // Etapa 3: dose ativa, digitando
      tl.to(doseFieldRef.current, {
        borderColor: "rgba(48, 241, 230, 0.7)",
        backgroundColor: "rgba(48, 241, 230, 0.08)",
        duration: 0.3
      }, "+=0.2");

      const dose = { val: 0 };
      tl.to(dose, {
        val: 0.10,
        duration: 1.0,
        ease: "power2.out",
        onUpdate: () => {
          if (doseRef.current) doseRef.current.textContent = dose.val.toFixed(2).replace(".", ",");
        }
      });

      // Etapa 4: vazão calculada (bloqueada, derivada da dose)
      tl.fromTo(
        vazaoFieldRef.current,
        { opacity: 0.4 },
        { opacity: 1, duration: 0.3 },
        "+=0.15"
      );
      const vazao = { val: 0 };
      tl.to(vazao, {
        val: 26.3,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (vazaoRef.current) vazaoRef.current.textContent = vazao.val.toFixed(1).replace(".", ",");
        }
      }, "<");

      // Etapa 5: pausa, depois inverte — dose vira derivada e vazão é ativa
      tl.to({}, { duration: 1.2 });
      tl.to(doseFieldRef.current, {
        borderColor: "rgba(159, 232, 255, 0.16)",
        backgroundColor: "transparent",
        duration: 0.4
      });
      tl.to(vazaoFieldRef.current, {
        borderColor: "rgba(48, 241, 230, 0.7)",
        backgroundColor: "rgba(48, 241, 230, 0.08)",
        duration: 0.3
      }, "<");

      // Etapa 6: vazão digita 35
      const vazao2 = { val: 26.3 };
      tl.to(vazao2, {
        val: 35.0,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          if (vazaoRef.current) vazaoRef.current.textContent = vazao2.val.toFixed(1).replace(".", ",");
        }
      });

      // Etapa 7: dose recalcula
      const dose2 = { val: 0.10 };
      tl.to(dose2, {
        val: 0.133,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          if (doseRef.current) doseRef.current.textContent = dose2.val.toFixed(2).replace(".", ",");
        }
      }, "<");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="animcalc" aria-labelledby="animcalc-title">
      <div className="animcalc-copy">
        <span className="animcalc-eyebrow">Como funciona</span>
        <h2 id="animcalc-title" className="animcalc-title">
          Bloqueio mútuo dose ↔ vazão.
        </h2>
        <p className="animcalc-lead">
          O campo ativo calcula o outro automaticamente. Edite a dose, a vazão sai. Edite a
          vazão, a dose recalcula. Sem decisão dupla, sem ambiguidade — apenas o par coerente
          para diluição, peso e velocidade de infusão.
        </p>
        <ul className="animcalc-bullets">
          <li>Constantes clínicas centralizadas e versionadas.</li>
          <li>Unidades editáveis (mcg/kg/min, mg/h, mL/h).</li>
          <li>Compatível com bolus, infusão contínua e ajuste por peso.</li>
        </ul>
      </div>
      <div className="animcalc-widget" aria-hidden="true">
        <div className="animcalc-header">
          <span className="animcalc-header-label">Calculadora — noradrenalina</span>
          <span className="animcalc-header-tag">demonstração ao vivo</span>
        </div>
        <div className="animcalc-grid">
          <div className="animcalc-field">
            <span className="animcalc-field-label">Peso</span>
            <div className="animcalc-field-value">
              <span ref={pesoRef} className="animcalc-field-number">0</span>
              <span className="animcalc-field-unit">kg</span>
            </div>
          </div>
          <div className="animcalc-field">
            <span className="animcalc-field-label">Diluição</span>
            <div className="animcalc-field-value">
              <span ref={diluicaoRef} className="animcalc-field-number animcalc-field-number--soft">
                4 mg / 250 mL
              </span>
            </div>
          </div>
          <div ref={doseFieldRef} className="animcalc-field animcalc-field--editable">
            <span className="animcalc-field-label">Dose</span>
            <div className="animcalc-field-value">
              <span ref={doseRef} className="animcalc-field-number">0,00</span>
              <span className="animcalc-field-unit">mcg/kg/min</span>
            </div>
          </div>
          <div ref={vazaoFieldRef} className="animcalc-field animcalc-field--editable">
            <span className="animcalc-field-label">Vazão</span>
            <div className="animcalc-field-value">
              <span ref={vazaoRef} className="animcalc-field-number">0,0</span>
              <span className="animcalc-field-unit">mL/h</span>
            </div>
          </div>
        </div>
        <p className="animcalc-footnote">
          O campo destacado em ciano é o ativo. O outro é calculado automaticamente.
        </p>
      </div>
    </section>
  );
}

export function SignedOutScreen({ previewMode = false }: { previewMode?: boolean } = {}) {
  useEffect(() => {
    document.body.classList.add("landing-active");
    return () => document.body.classList.remove("landing-active");
  }, []);

  // GSAP: pulse contínuo no CTA principal do banner + reveal sequenciado
  // dos 3 cards de planos via ScrollTrigger. Respeita prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to(".cta-banner-cta", {
        scale: 1.03,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.fromTo(
        ".cta-banner-card",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-banner-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Reveal do header da pricing section (sem mexer nos cards — Framer já cuida deles)
      gsap.fromTo(
        ".pricing-v2-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-v2",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-shell">
      <main className="landing">
        <LandingHeroV2 previewMode={previewMode} />

        <section className="cta-banner" aria-labelledby="cta-banner-title">
          <div className="cta-banner-header">
            <span className="cta-banner-eyebrow">Comece hoje</span>
            <h2 id="cta-banner-title" className="cta-banner-title">
              A partir de R$ 25,99/mês.
            </h2>
            <p className="cta-banner-lead">
              Acesso completo aos seis módulos clínicos, calculadoras interativas, modo offline
              e atualizações. Cancele quando quiser.
            </p>
          </div>
          <div className="cta-banner-grid">
            {PLANS.map((plan) => (
              <a
                key={plan.id}
                href="#planos"
                className={`cta-banner-card${plan.highlight ? " cta-banner-card--featured" : ""}`}
                onClick={() =>
                  track("landing_cta_banner_card_click", { plan: plan.id, price: plan.price })
                }
              >
                {plan.badge && (
                  <span className="cta-banner-card-badge">{plan.badge}</span>
                )}
                <span className="cta-banner-card-label">{plan.label}</span>
                <span className="cta-banner-card-price">{plan.price}</span>
                <span className="cta-banner-card-period">
                  {plan.perMonth ? plan.perMonth : plan.period}
                </span>
              </a>
            ))}
          </div>
          {previewMode ? (
            <button className="cta-banner-cta" type="button" disabled>
              Quero meu acesso <span aria-hidden="true">→</span>
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button
                className="cta-banner-cta"
                type="button"
                onClick={() => track("landing_cta_banner_main_cta_click")}
              >
                Quero meu acesso <span aria-hidden="true">→</span>
              </button>
            </SignUpButton>
          )}
        </section>

        <section className="features-v2" aria-labelledby="features-title">
          <div className="features-v2-header">
            <span className="features-v2-eyebrow">O que você ganha</span>
            <h2 id="features-title" className="features-v2-title">
              Tudo o que o cenário de cuidados intensivos exige.
            </h2>
          </div>
          <div className="features-v2-grid">
            {landingFeatures.map((feature, idx) => (
              <motion.article
                key={feature.title}
                className="features-v2-card"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: idx * 0.08, ease: HERO_EASE }
                }}
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="features-v2-card-top">
                  <span className="features-v2-card-number">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="features-v2-card-icon" aria-hidden="true">
                    <FeatureIcon name={feature.icon} />
                  </span>
                </div>
                <span className="features-v2-card-stat">{feature.stat}</span>
                <h3 className="features-v2-card-title">{feature.title}</h3>
                <p className="features-v2-card-body">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <AnimatedCalculator />

        <section className="refs-v2" aria-labelledby="refs-title">
          <div className="refs-v2-header">
            <span className="refs-v2-eyebrow">Referências e credibilidade</span>
            <h2 id="refs-title" className="refs-v2-title">
              Conteúdo rastreável, sem improviso.
            </h2>
          </div>
          <div className="refs-v2-grid">
            {referenceSources.map((item, idx) => (
              <motion.article
                key={item.title}
                className="refs-v2-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: idx * 0.09, ease: HERO_EASE }
                }}
                viewport={{ once: true, margin: "-60px" }}
              >
                <span className="refs-v2-card-number">{String(idx + 1).padStart(2, "0")}</span>
                <h3 className="refs-v2-card-title">{item.title}</h3>
                <p className="refs-v2-card-body">{item.description}</p>
              </motion.article>
            ))}
          </div>
          <p className="refs-v2-disclaimer">
            O Manual é uma ferramenta educacional de apoio clínico. Não substitui o julgamento
            médico individualizado nem os protocolos institucionais.
          </p>
        </section>

        <section className="pricing-v2" aria-labelledby="pricing-title" id="planos">
          <div className="pricing-v2-header">
            <span className="pricing-v2-eyebrow">Planos de assinatura</span>
            <h2 id="pricing-title" className="pricing-v2-title">
              Escolha seu acesso
            </h2>
            <p className="pricing-v2-lead">
              Todos os planos liberam os seis módulos clínicos, calculadoras interativas,
              modo offline e atualizações inclusas. Sem fidelidade — cancele quando quiser.
            </p>
          </div>
          <div className="pricing-v2-grid">
            {PLANS.map((plan, idx) => (
              <motion.div
                key={plan.id}
                className={`pricing-v2-card${plan.highlight ? " pricing-v2-card--featured" : ""}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: idx * 0.09, ease: HERO_EASE }
                }}
                viewport={{ once: true, margin: "-60px" }}
              >
                {plan.badge && <span className="pricing-v2-card-badge">{plan.badge}</span>}
                <span className="pricing-v2-card-label">{plan.label}</span>
                <div className="pricing-v2-card-amount">
                  <span className="pricing-v2-card-price">{plan.price}</span>
                  <span className="pricing-v2-card-period">{plan.period}</span>
                </div>
                {plan.perMonth && (
                  <span className="pricing-v2-card-per-month">equivale a {plan.perMonth}</span>
                )}
                <ul className="pricing-v2-card-list" aria-label="O que está incluso">
                  <li>Seis módulos clínicos completos</li>
                  <li>Calculadoras de dose, vazão e diluição</li>
                  <li>Modo offline após primeiro acesso</li>
                  <li>Atualizações inclusas, sem custo extra</li>
                </ul>
                {previewMode ? (
                  <button
                    className={`pricing-v2-card-cta${plan.highlight ? " pricing-v2-card-cta--primary" : ""}`}
                    type="button"
                    disabled
                  >
                    Quero meu acesso <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <SignUpButton mode="modal">
                    <button
                      className={`pricing-v2-card-cta${plan.highlight ? " pricing-v2-card-cta--primary" : ""}`}
                      type="button"
                      onClick={() =>
                        track("landing_pricing_card_click", { plan: plan.id, price: plan.price })
                      }
                    >
                      Quero meu acesso <span aria-hidden="true">→</span>
                    </button>
                  </SignUpButton>
                )}
              </motion.div>
            ))}
          </div>
          <p className="pricing-v2-note">
            Crie a conta e escolha o plano para liberar o acesso completo ao Manual.
          </p>
        </section>

        <footer className="footer-v2">
          <div className="footer-v2-top">
            <FooterBrand />
            <nav className="footer-v2-nav" aria-label="Rodapé">
              <a href="#planos">Planos</a>
              {previewMode ? (
                <button className="footer-v2-nav-link" type="button" disabled>
                  Entrar
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="footer-v2-nav-link" type="button">
                    Entrar
                  </button>
                </SignInButton>
              )}
            </nav>
          </div>
          <div className="footer-v2-meta">
            <span>
              Manual de Medicina Intensiva — produto digital educacional para estudo e apoio à
              prática clínica.
            </span>
            <span className="footer-v2-meta-brand">© Virtus · Clinical Tools</span>
          </div>
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
     Todos os módulos usam .app#moduleApp (grid 310px 1fr) — a regra abaixo cobre
     também o caso histórico de módulos sem aside ou com estruturas alternativas. */
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
  onCheckout,
  checkingOutPriceId,
  isWaiting,
  onRefresh
}: {
  onCheckout: (priceId: string) => void;
  checkingOutPriceId: string | null;
  isWaiting: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="paywall-overlay" role="dialog" aria-modal="false" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <div className="paywall-card-copy">
          <span className="paywall-eyebrow">Assine para acessar</span>
          <h2 id="paywall-title" className="paywall-title">
            Escolha o plano para liberar o Manual
          </h2>
          <p className="paywall-lead">
            Sua conta está criada. Escolha um plano abaixo para liberar o acesso completo —
            calculadoras interativas, módulos clínicos e modo offline.
          </p>
          <div className="paywall-plan-grid" role="list">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                className={`paywall-plan-card${plan.highlight ? " paywall-plan-card--featured" : ""}`}
                type="button"
                role="listitem"
                onClick={() => onCheckout(plan.priceId)}
                disabled={checkingOutPriceId !== null}
              >
                {plan.badge && <span className="paywall-plan-badge">{plan.badge}</span>}
                <span className="paywall-plan-label">{plan.label}</span>
                <span className="paywall-plan-price">{plan.price}</span>
                <span className="paywall-plan-period">{plan.period}</span>
                {plan.perMonth && (
                  <span className="paywall-plan-per-month">{plan.perMonth}</span>
                )}
                <span className="paywall-plan-action">
                  {checkingOutPriceId === plan.priceId ? "Aguardando..." : "Assinar"}
                </span>
              </button>
            ))}
          </div>
          <button
            className="button button--quiet paywall-refresh"
            type="button"
            onClick={onRefresh}
            disabled={isWaiting}
          >
            {isWaiting ? "Aguardando confirmação do pagamento..." : "Já paguei — atualizar acesso"}
          </button>
          <p className="paywall-note">
            Após assinar você é redirecionado de volta. O acesso é liberado automaticamente
            assim que o Stripe confirma o pagamento.
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
  // founderAccess: true concede acesso vitalício, independente de assinatura.
  const founderAccess = metadata?.founderAccess === true;
  const subscriptionStatus =
    typeof metadata?.subscriptionStatus === "string" ? metadata.subscriptionStatus : undefined;
  const stripeSubscriptionStatus =
    typeof metadata?.stripeSubscriptionStatus === "string" ? metadata.stripeSubscriptionStatus : undefined;
  const active =
    founderAccess ||
    subscriptionStatus === "active" ||
    stripeSubscriptionStatus === "active";

  return {
    active,
    status: founderAccess ? "founder" : (subscriptionStatus ?? stripeSubscriptionStatus ?? "none")
  };
}


function SignedInAccessGate({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [accessState, setAccessState] = useState<AccessState>("idle");
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isCheckoutBusy, setIsCheckoutBusy] = useState(false);
  const [checkingOutPriceId, setCheckingOutPriceId] = useState<string | null>(null);
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

  const checkoutPlan = async (priceId: string) => {
    if (checkingOutPriceId) return;
    setCheckingOutPriceId(priceId);
    try {
      const token = await getToken();
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ priceId, returnUrl: appReturnUrl })
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Nao foi possivel iniciar o checkout.");
      }
      window.location.assign(data.url);
    } catch {
      setCheckingOutPriceId(null);
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
  void checkingOutPriceId;

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
          onCheckout={(priceId) => { void checkoutPlan(priceId); }}
          checkingOutPriceId={checkingOutPriceId}
          isWaiting={isWaitingPayment}
          onRefresh={() => { void refreshAccess(); }}
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
        onCheckout={() => undefined}
        checkingOutPriceId={null}
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
