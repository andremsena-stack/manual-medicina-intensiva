import type { ModuleId } from "../types";

interface InputPair {
  doseId: string;
  rateId: string;
}

export interface PagerTargetModule {
  id: ModuleId;
  number: number;
  title: string;
}

export interface PagerConfig {
  prev?: PagerTargetModule;
  next?: PagerTargetModule;
  onNavigate: (moduleId: ModuleId) => void;
}

export interface CollapseConfig {
  /** IDs de section que iniciam ABERTAS. Quando definido, as demais iniciam fechadas.
   *  Se omitido ou vazio, todas iniciam abertas (usuario ainda pode recolher). */
  keepExpandedIds?: string[];
  /** Se true, pula sections que ja contem <details> (ex: Modulo 7) para evitar
   *  toggles redundantes/aninhados. */
  skipSectionsWithDetails?: boolean;
}

export interface SafetyLayerOptions {
  pager?: PagerConfig;
  collapse?: CollapseConfig;
}

const PAGER_ID = "codex-module-pager";
const PAGER_STYLE_ID = "codex-module-pager-style";
const COLLAPSE_STYLE_ID = "codex-section-collapse-style";
const COLLAPSE_BODY_CLASS = "codex-section-body";
const COLLAPSE_TOGGLE_CLASS = "codex-section-toggle";
const COLLAPSE_COLLAPSED_CLASS = "codex-section-collapsed";

const DOSE_RATE_PAIRS: InputPair[] = [
  { doseId: "dvaDose", rateId: "dvaRate" },
  { doseId: "infDose", rateId: "infRate" }
];

function asInput(element: HTMLElement | null): HTMLInputElement | null {
  return element instanceof HTMLInputElement ? element : null;
}

function originalAriaLabel(input: HTMLInputElement): string {
  if (input.dataset.codexOriginalAriaLabel === undefined) {
    input.dataset.codexOriginalAriaLabel = input.getAttribute("aria-label") ?? "";
  }

  return input.dataset.codexOriginalAriaLabel;
}

function setGuardState(active: HTMLInputElement, calculated: HTMLInputElement): void {
  const hasActiveValue = active.value.trim().length > 0;
  const originalLabel = originalAriaLabel(calculated);

  calculated.disabled = hasActiveValue;
  calculated.classList.toggle("codex-calculated-field", hasActiveValue);

  if (hasActiveValue) {
    calculated.setAttribute("aria-label", "Campo bloqueado automaticamente enquanto o campo oposto esta em uso");
  } else if (originalLabel) {
    calculated.setAttribute("aria-label", originalLabel);
  } else {
    calculated.removeAttribute("aria-label");
  }
}

function wirePair(document: Document, pair: InputPair): void {
  const dose = asInput(document.getElementById(pair.doseId));
  const rate = asInput(document.getElementById(pair.rateId));

  if (!dose || !rate || dose.dataset.codexGuarded === "true") {
    return;
  }

  const sync = () => {
    if (dose.value.trim() && rate.value.trim()) {
      rate.value = "";
    }
    setGuardState(dose, rate);
    setGuardState(rate, dose);
  };

  dose.dataset.codexGuarded = "true";
  rate.dataset.codexGuarded = "true";
  dose.addEventListener("input", sync);
  rate.addEventListener("input", sync);
  sync();
}

function injectGuardStyles(document: Document): void {
  if (document.getElementById("codex-runtime-safety-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "codex-runtime-safety-style";
  style.textContent = `
    .codex-calculated-field {
      opacity: .68;
      cursor: not-allowed;
      background: #eef3f8 !important;
    }
  `;
  document.head.appendChild(style);
}

function removeInternalModuleMenu(document: Document): void {
  if (!document.getElementById("codex-runtime-module-menu-style")) {
    const style = document.createElement("style");
    style.id = "codex-runtime-module-menu-style";
    style.textContent = `
      .app {
        display: block !important;
        grid-template-columns: 1fr !important;
      }
      .app > aside {
        display: none !important;
      }
      .app > main,
      main {
        max-width: none !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  document.querySelector<HTMLElement>(".app > aside")?.remove();
  document.querySelector<HTMLElement>(".app")?.classList.add("codex-module-menu-removed");
}

function injectPagerStyles(doc: Document): void {
  if (doc.getElementById(PAGER_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = PAGER_STYLE_ID;
  style.textContent = `
    .codex-pager {
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr;
      margin: 40px 0 24px;
    }
    @media (max-width: 720px) { .codex-pager { grid-template-columns: 1fr; } }
    .codex-pager__btn {
      background: #fff;
      border: 1px solid #d8e0ea;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(16, 24, 40, .08);
      color: #172033;
      cursor: pointer;
      display: grid;
      font: inherit;
      gap: 6px;
      padding: 18px 22px;
      text-align: left;
      text-decoration: none;
      transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }
    .codex-pager__btn:hover,
    .codex-pager__btn:focus-visible {
      border-color: #0b6b5c;
      box-shadow: 0 12px 30px rgba(11, 107, 92, .14);
      outline: 0;
      transform: translateY(-1px);
    }
    .codex-pager__btn--next { text-align: right; }
    .codex-pager__btn--placeholder {
      background: transparent;
      border: 1px dashed transparent;
      box-shadow: none;
      pointer-events: none;
      visibility: hidden;
    }
    .codex-pager__label {
      color: #5f6b7a;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .codex-pager__title {
      color: #123c69;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.3;
    }
  `;
  doc.head.appendChild(style);
}

function buildPagerButton(
  doc: Document,
  kind: "prev" | "next",
  target: PagerTargetModule,
  onClick: () => void
): HTMLButtonElement {
  const btn = doc.createElement("button");
  btn.type = "button";
  btn.className = `codex-pager__btn codex-pager__btn--${kind}`;
  btn.setAttribute(
    "aria-label",
    kind === "prev"
      ? `Voltar ao Modulo ${target.number} - ${target.title}`
      : `Passar para o Modulo ${target.number} - ${target.title}`
  );

  const label = doc.createElement("span");
  label.className = "codex-pager__label";
  label.textContent = kind === "prev" ? "← Modulo anterior" : "Proximo modulo →";

  const title = doc.createElement("span");
  title.className = "codex-pager__title";
  title.textContent = `Modulo ${target.number} - ${target.title}`;

  btn.appendChild(label);
  btn.appendChild(title);
  btn.addEventListener("click", onClick);

  return btn;
}

function injectModulePager(doc: Document, cfg: PagerConfig): void {
  doc.getElementById(PAGER_ID)?.remove();

  const pager = doc.createElement("nav");
  pager.id = PAGER_ID;
  pager.className = "codex-pager";
  pager.setAttribute("aria-label", "Navegacao entre modulos");

  if (cfg.prev) {
    const prev = cfg.prev;
    pager.appendChild(
      buildPagerButton(doc, "prev", prev, () => cfg.onNavigate(prev.id))
    );
  } else {
    const placeholder = doc.createElement("span");
    placeholder.className = "codex-pager__btn codex-pager__btn--placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    pager.appendChild(placeholder);
  }

  if (cfg.next) {
    const next = cfg.next;
    pager.appendChild(
      buildPagerButton(doc, "next", next, () => cfg.onNavigate(next.id))
    );
  } else {
    const placeholder = doc.createElement("span");
    placeholder.className = "codex-pager__btn codex-pager__btn--placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    pager.appendChild(placeholder);
  }

  // Inserir antes do footer-sign (ou ao final do main, se nao houver footer)
  const main = doc.querySelector("main");
  const footer = doc.querySelector(".footer-sign");
  if (main && footer && footer.parentElement === main) {
    main.insertBefore(pager, footer);
  } else if (main) {
    main.appendChild(pager);
  } else {
    doc.body.appendChild(pager);
  }
}

function injectCollapseStyles(doc: Document): void {
  if (doc.getElementById(COLLAPSE_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = COLLAPSE_STYLE_ID;
  style.textContent = `
    .${COLLAPSE_TOGGLE_CLASS} {
      align-items: baseline;
      cursor: pointer;
      display: flex;
      gap: 12px;
      user-select: none;
    }
    .${COLLAPSE_TOGGLE_CLASS}:focus-visible {
      outline: 2px solid #0b6b5c;
      outline-offset: 4px;
      border-radius: 4px;
    }
    .${COLLAPSE_TOGGLE_CLASS}-chevron {
      align-items: center;
      color: #0b6b5c;
      display: inline-flex;
      flex-shrink: 0;
      height: 24px;
      justify-content: center;
      transition: transform 200ms ease;
      width: 24px;
    }
    .${COLLAPSE_TOGGLE_CLASS}-chevron svg {
      fill: none;
      height: 16px;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.4;
      width: 16px;
    }
    .${COLLAPSE_COLLAPSED_CLASS} .${COLLAPSE_TOGGLE_CLASS}-chevron {
      transform: rotate(-90deg);
    }
    .${COLLAPSE_BODY_CLASS} {
      display: block;
    }
    .${COLLAPSE_COLLAPSED_CLASS} .${COLLAPSE_BODY_CLASS} {
      display: none;
    }
    .${COLLAPSE_COLLAPSED_CLASS} {
      padding-bottom: 12px;
    }
  `;
  doc.head.appendChild(style);
}

function makeSectionCollapsible(doc: Document, section: HTMLElement, startOpen: boolean): void {
  const h2 = section.querySelector(":scope > h2");
  if (!h2 || h2.classList.contains(COLLAPSE_TOGGLE_CLASS)) return;

  // Move tudo que vem depois do h2 para um wrapper .codex-section-body
  let body = section.querySelector<HTMLElement>(`:scope > .${COLLAPSE_BODY_CLASS}`);
  if (!body) {
    body = doc.createElement("div");
    body.className = COLLAPSE_BODY_CLASS;
    let node: ChildNode | null = h2.nextSibling;
    while (node) {
      const next: ChildNode | null = node.nextSibling;
      body.appendChild(node);
      node = next;
    }
    section.appendChild(body);
  }

  // Adiciona chevron e wireup no h2
  h2.classList.add(COLLAPSE_TOGGLE_CLASS);
  h2.setAttribute("role", "button");
  h2.setAttribute("tabindex", "0");
  h2.setAttribute("aria-expanded", String(startOpen));
  if (section.id) {
    body.id = `${section.id}__body`;
    h2.setAttribute("aria-controls", body.id);
  }

  if (!h2.querySelector(`.${COLLAPSE_TOGGLE_CLASS}-chevron`)) {
    const chevron = doc.createElement("span");
    chevron.className = `${COLLAPSE_TOGGLE_CLASS}-chevron`;
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>`;
    h2.insertBefore(chevron, h2.firstChild);
  }

  if (!startOpen) {
    section.classList.add(COLLAPSE_COLLAPSED_CLASS);
  }

  const toggle = () => {
    const isCollapsed = section.classList.toggle(COLLAPSE_COLLAPSED_CLASS);
    h2.setAttribute("aria-expanded", String(!isCollapsed));
  };

  h2.addEventListener("click", toggle);
  h2.addEventListener("keydown", (event) => {
    const ke = event as KeyboardEvent;
    if (ke.key === "Enter" || ke.key === " ") {
      ke.preventDefault();
      toggle();
    }
  });
}

function injectSectionCollapse(doc: Document, cfg: CollapseConfig): void {
  injectCollapseStyles(doc);
  const sections = Array.from(
    doc.querySelectorAll<HTMLElement>("main > section[id]")
  );
  if (sections.length === 0) return;

  const keepOpen = new Set(cfg.keepExpandedIds ?? []);
  const hasExpandedFilter = keepOpen.size > 0;

  for (const section of sections) {
    if (cfg.skipSectionsWithDetails && section.querySelector(":scope > details")) {
      continue;
    }
    const startOpen = hasExpandedFilter ? keepOpen.has(section.id) : true;
    makeSectionCollapsible(doc, section, startOpen);
  }
}

export function applyIframeSafetyLayer(document: Document, opts?: SafetyLayerOptions): void {
  injectGuardStyles(document);
  removeInternalModuleMenu(document);
  DOSE_RATE_PAIRS.forEach((pair) => wirePair(document, pair));

  if (opts?.collapse) {
    injectSectionCollapse(document, opts.collapse);
  }

  if (opts?.pager) {
    injectPagerStyles(document);
    injectModulePager(document, opts.pager);
  }
}
