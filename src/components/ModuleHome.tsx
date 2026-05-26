import type { ReactElement } from "react";
import type { ModuleId, ModuleRecord } from "../types";

interface ModuleHomeProps {
  modules: ModuleRecord[];
  onSelectModule: (moduleId: ModuleId) => void;
}

// SVGs custom por modulo. Estetica linear, stroke 1.6, viewBox 24x24, sem fill,
// usando currentColor para herdar a cor do card (cyan da paleta da landing).
const MODULE_ICONS: Record<ModuleId, ReactElement> = {
  // Mod 1 - Via aerea e IOT: tubo orotraqueal + balonete
  "modulo-01": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h7l4 4-4 4H5z" />
      <path d="M12 8v8" />
      <circle cx="18.5" cy="12" r="2.2" />
      <path d="M3 12h2" />
    </svg>
  ),
  // Mod 2 - Pos-intubacao e confirmacao: traqueia + check
  "modulo-02": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3v6c0 1.5-1 2.5-1 4s1 2.5 1 4v4" />
      <path d="M13 3v6c0 1.5 1 2.5 1 4s-1 2.5-1 4v4" />
      <path d="M9 7h4M9 11h4M9 15h4M9 19h4" />
      <path d="M17 12l1.6 1.6L21 11" />
    </svg>
  ),
  // Mod 3 - Ventilacao mecanica: pulmoes + curva
  "modulo-03": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v8" />
      <path d="M12 6c-1.5-2-4-2-5.5-.5C5 7 5 9.5 6 12c1 2.5 2 4 4 5 1 .5 2 0 2-1V6z" />
      <path d="M12 6c1.5-2 4-2 5.5-.5 1.5 1.5 1.5 4 .5 6.5-1 2.5-2 4-4 5-1 .5-2 0-2-1V6z" />
      <path d="M3 19c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0" />
    </svg>
  ),
  // Mod 4 - Sedoanalgesia: capsula + onda
  "modulo-04": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="9" width="14" height="6" rx="3" />
      <path d="M10 9v6" />
      <path d="M17 12h1l1.5-1.5L21 13l-1.5 1.5L21 16" />
    </svg>
  ),
  // Mod 5 - Drogas vasoativas: coracao + pulso
  "modulo-05": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h3l2-4 3 8 2-5 1.5 3H21" />
      <path d="M12 19c-2-1.5-5-3.5-6.5-6C4 10.5 5 7 8 7c1.5 0 3 1 4 2.5C13 8 14.5 7 16 7c3 0 4 3.5 2.5 6-.6 1-1.6 2-2.7 2.8" />
    </svg>
  ),
  // Mod 6 - Disturbios hidroeletroliticos: gota + Na+
  "modulo-06": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c-2 4-5 7-5 11a5 5 0 0010 0c0-4-3-7-5-11z" />
      <path d="M9 13h6M12 10v6" />
    </svg>
  ),
  // Mod 7 - Calculadoras: calculadora classica
  "modulo-07": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <rect x="7.5" y="5.5" width="9" height="3.5" rx="1" />
      <circle cx="9" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Mod 8 - Caderno de questoes: prancheta com checks
  "modulo-08": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4v-1h6v1" />
      <path d="M8.5 10l1.5 1.5L13 8" />
      <path d="M8.5 15l1.5 1.5L13 13" />
      <path d="M15 10h2" />
      <path d="M15 15h2" />
    </svg>
  ),
  // Mod 9 - Referencias: livro aberto
  "modulo-09": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5c2.5-1 5.5-1 9 1v13c-3.5-2-6.5-2-9-1z" />
      <path d="M21 5c-2.5-1-5.5-1-9 1v13c3.5-2 6.5-2 9-1z" />
      <path d="M12 6v13" />
    </svg>
  )
};

// Identifica visualmente a familia do modulo para colorir a tarja lateral.
function familyOf(moduleId: ModuleId): "clinico" | "calc" | "quiz" | "ref" {
  if (moduleId === "modulo-07") return "calc";
  if (moduleId === "modulo-08") return "quiz";
  if (moduleId === "modulo-09") return "ref";
  return "clinico";
}

export function ModuleHome({ modules, onSelectModule }: ModuleHomeProps) {
  return (
    <section className="module-home" aria-label="Página inicial do manual">
      <div className="module-home__hero">
        <div className="module-home__hero-inner">
          <img
            src="/virtus-logo/virtus_logo_horizontal_transparente.png"
            alt="Virtus Clinical Tools"
            className="module-home__logo"
          />
          <span className="module-home__eyebrow">Manual de Medicina Intensiva</span>
          <h1 className="module-home__title">
            Decisões à beira do leito,
            <br />
            com a precisão da literatura.
          </h1>
          <p className="module-home__lead">
            Ferramentas práticas de cabeceira para o cenário de cuidados intensivos —
            protocolos clínicos e calculadoras operacionais para tomada de decisão.
          </p>

          <button
            type="button"
            className="module-home__cta"
            onClick={() => onSelectModule(modules[0].id)}
          >
            Começar pelo Módulo 1
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="module-home__grid-wrap">
        <div className="module-home__grid-header">
          <span className="module-home__grid-eyebrow">Sumário</span>
          <h2 className="module-home__grid-title">Acesso direto aos módulos</h2>
        </div>

        <div className="module-home__grid" role="list">
          {modules.map((module) => {
            const family = familyOf(module.id);
            return (
              <button
                key={module.id}
                type="button"
                role="listitem"
                className={`module-home__card module-home__card--${family}`}
                onClick={() => onSelectModule(module.id)}
                aria-label={`Abrir Módulo ${module.number}: ${module.title}`}
              >
                <span className="module-home__card-icon" aria-hidden="true">
                  {MODULE_ICONS[module.id]}
                </span>
                <span className="module-home__card-num">Módulo {module.number}</span>
                <strong className="module-home__card-title">{module.title}</strong>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
