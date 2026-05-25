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
   *  Em accordionMode, esses IDs ficam SEMPRE abertos e SEM toggle (sempre visiveis).
   *  Se omitido ou vazio, todas iniciam abertas (usuario ainda pode recolher). */
  keepExpandedIds?: string[];
  /** Se true, pula sections que ja contem <details> nativos para evitar toggles
   *  redundantes/aninhados (ex: Modulo de Disturbios). */
  skipSectionsWithDetails?: boolean;
  /** Se true, abrir uma section recolhe automaticamente as demais (comportamento
   *  acordeao). Sections em keepExpandedIds ficam imutaveis (sempre abertas, sem
   *  participar do acordeao). */
  accordionMode?: boolean;
}

export interface SafetyLayerOptions {
  pager?: PagerConfig;
  collapse?: CollapseConfig;
  /** Aplica passada de compactacao tipografica (corpo do texto, sections, headings)
   *  para reduzir scroll em modulos clinicos densos. Nao tocar em tabelas (que ja
   *  tem estilo proprio) nem em paineis de calculadora. */
  compactReading?: boolean;
}

const PAGER_ID = "codex-module-pager";
const PAGER_STYLE_ID = "codex-module-pager-style";
const COLLAPSE_STYLE_ID = "codex-section-collapse-style";
const COLLAPSE_BODY_CLASS = "codex-section-body";
const COLLAPSE_TOGGLE_CLASS = "codex-section-toggle";
const COLLAPSE_COLLAPSED_CLASS = "codex-section-collapsed";
const MOBILE_STYLE_ID = "codex-mobile-responsive-style";
const COMPACT_READING_STYLE_ID = "codex-compact-reading-style";
const TABLE_MODAL_ID = "codex-table-modal";
const TABLE_MODAL_STYLE_ID = "codex-table-modal-style";
const TABLE_LABELS_FLAG = "codexLabelsApplied";

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

function makeSectionCollapsible(
  doc: Document,
  section: HTMLElement,
  startOpen: boolean,
  closeOthers?: (current: HTMLElement) => void
): void {
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
    const wasCollapsed = section.classList.contains(COLLAPSE_COLLAPSED_CLASS);
    // Quando esta abrindo (estava colapsada), fechar as demais primeiro (acordeao).
    if (wasCollapsed && closeOthers) {
      closeOthers(section);
    }
    const isCollapsed = section.classList.toggle(COLLAPSE_COLLAPSED_CLASS);
    h2.setAttribute("aria-expanded", String(!isCollapsed));
    if (!isCollapsed) {
      // Acabou de abrir — garantir que rola para a section aberta (UX no acordeao).
      section.scrollIntoView({ block: "start", behavior: "smooth" });
    }
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
  const accordionMode = cfg.accordionMode === true;

  // Em accordionMode, sections em keepExpandedIds NAO viram colapsiveis (sempre visiveis).
  // Nos outros modos, elas continuam sendo colapsiveis mas iniciam abertas.
  const collapsibleSections: HTMLElement[] = [];
  for (const section of sections) {
    if (cfg.skipSectionsWithDetails && section.querySelector(":scope > details")) {
      continue;
    }
    if (accordionMode && keepOpen.has(section.id)) {
      continue;
    }
    collapsibleSections.push(section);
  }

  const closeOthers = accordionMode
    ? (currentSection: HTMLElement) => {
        for (const other of collapsibleSections) {
          if (other === currentSection) continue;
          if (other.classList.contains(COLLAPSE_COLLAPSED_CLASS)) continue;
          other.classList.add(COLLAPSE_COLLAPSED_CLASS);
          const otherH2 = other.querySelector(":scope > h2");
          if (otherH2) otherH2.setAttribute("aria-expanded", "false");
        }
      }
    : undefined;

  for (const section of collapsibleSections) {
    // accordionMode: todas iniciam fechadas. Senao: somente as fora de keepExpandedIds iniciam fechadas.
    const startOpen = accordionMode
      ? false
      : hasExpandedFilter
        ? keepOpen.has(section.id)
        : true;
    makeSectionCollapsible(doc, section, startOpen, closeOthers);
  }
}

function injectMobileResponsiveStyles(doc: Document): void {
  if (doc.getElementById(MOBILE_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = MOBILE_STYLE_ID;
  style.textContent = `
    /* Garantias globais de fluidez dentro do iframe do modulo */
    *, *::before, *::after { box-sizing: border-box; }
    html, body { max-width: 100%; overflow-x: hidden; }
    img, svg, video, canvas, picture, iframe { max-width: 100%; height: auto; }
    figure { margin: 16px 0; max-width: 100%; }
    figure svg, figure img { display: block; margin: 0 auto; }
    pre, code, kbd, samp { white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; }
    main, section, article { max-width: 100%; }
    h1, h2, h3, h4, h5, h6, p, li, td, th { overflow-wrap: break-word; word-break: normal; }
    table { max-width: 100%; }

    /* Container scrollavel das tabelas (respeita o conteudo). */
    .codex-table-scroll {
      display: block;
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 16px 0;
    }
    .codex-table-scroll table {
      table-layout: auto;
      width: 100%;
    }

    /* ===========================================================
       ESTETICA BASE: hierarquia visual e leitura facil.
       Aplicada em qualquer viewport; sobrescrita no modo cards.
       =========================================================== */
    table {
      background: #ffffff;
      border: 1px solid #d8e2ea !important;
      border-collapse: separate !important;
      border-spacing: 0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(13, 36, 56, 0.05), 0 1px 2px rgba(13, 36, 56, 0.04);
      margin: 16px 0;
      overflow: hidden;
    }
    table thead th {
      background: linear-gradient(180deg, #1a4d80 0%, #123c69 100%) !important;
      color: #ffffff !important;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 11px 14px;
      text-align: left;
      text-transform: uppercase;
      vertical-align: middle;
      border: 0 !important;
      border-right: 1px solid rgba(255, 255, 255, 0.14) !important;
    }
    table thead th:last-child { border-right: 0 !important; }
    table tbody td {
      border: 0 !important;
      border-top: 1px solid #eef2f7 !important;
      border-right: 1px solid #f1f5f9 !important;
      padding: 11px 14px;
      vertical-align: top;
      font-size: 14px;
      line-height: 1.5;
    }
    table tbody td:last-child { border-right: 0 !important; }
    table tbody tr:first-child td { border-top: 0 !important; }
    table tbody tr {
      transition: background-color 140ms ease;
    }
    table tbody tr:nth-child(even) td { background: #f8fafc; }
    table tbody tr:hover td { background: #eff5fa; }
    /* Primeira coluna como "topico" da linha (entidade): mais peso e cor */
    table tbody td:first-child {
      color: #0d2438;
      font-weight: 600;
    }
    table tbody td:first-child strong { color: #123c69; font-weight: 700; }

    /* ===========================================================
       MOBILE <768px: tabela vira lista de cards rotulados.
       Primeira <td> da linha vira "titulo" do card.
       =========================================================== */
    @media (max-width: 767px) {
      body  {
        font-size: 15px !important;
        line-height: 1.65 !important;
        /* Reserva espaço para os triggers fixos do shell parent: TOC à esquerda (32px) + folga 4px = 36px; busca à direita (38px) + folga 12px = 50px */
        padding-left: 36px !important;
        padding-right: 50px !important;
      }
      main  { padding: 14px 10px !important; }

      /* Hero e sections do modulo: padding e fontes reduzidos no mobile */
      .hero { padding: 18px !important; border-radius: 14px !important; }
      .hero h2 { font-size: clamp(19px, 5vw, 26px) !important; line-height: 1.25 !important; }
      .hero p  { font-size: 14px !important; }
      section  { padding: 14px 16px !important; border-radius: 12px !important; }
      section h2 { font-size: clamp(17px, 4.5vw, 22px) !important; line-height: 1.3 !important; }
      section h3 { font-size: clamp(15px, 4vw, 18px) !important; }

      /* Grids do modulo empilham em coluna unica */
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }

      table {
        display: block !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
      }
      table thead { display: none !important; }
      table tbody, table tr, table td { display: block !important; width: 100% !important; }
      table tr {
        background: #ffffff !important;
        border: 1px solid #d8e2ea !important;
        border-left: 4px solid #0b6b5c !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(13, 36, 56, 0.06) !important;
        margin: 0 0 14px 0 !important;
        padding: 14px 16px !important;
      }
      table tr:hover td { background: transparent !important; }
      table tbody tr:nth-child(even) td { background: transparent !important; }

      table td {
        border: 0 !important;
        padding: 6px 0 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        background: transparent !important;
      }
      /* Primeira td: TITULO do card */
      table td:first-child {
        border-bottom: 1px solid #eef2f7 !important;
        color: #123c69 !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        margin-bottom: 8px !important;
        padding: 0 0 10px 0 !important;
      }
      table td:first-child::before { content: none !important; }
      table td:first-child strong { color: #123c69; font-size: 16px; }

      /* Demais td: separadas por hairline, com rotulo da coluna */
      table td + td { border-top: 1px solid #eef2f7 !important; padding-top: 8px !important; margin-top: 4px !important; }
      table td[data-label]:not(:first-child)::before {
        color: #5f6b7a;
        content: attr(data-label);
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        margin-bottom: 3px;
        text-transform: uppercase;
      }

      /* SVG diagramas em largura total. */
      .svg-box, .svg-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .svg-box svg { min-width: 320px; }
    }

    /* ===========================================================
       TABLET 768-1023px:
       - Tabelas LARGAS (>=5 colunas) viram cards (mesma logica do mobile).
       - Tabelas NORMAIS (<=4 colunas) ganham layout compacto, respeita
         o container — sem min-width, sem scroll horizontal.
       =========================================================== */
    @media (min-width: 768px) and (max-width: 1023px) {
      /* Tabelas largas: cards rotulados com primeira td como titulo */
      table.codex-wide-table {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        display: block;
      }
      table.codex-wide-table thead { display: none !important; }
      table.codex-wide-table tbody,
      table.codex-wide-table tr,
      table.codex-wide-table td { display: block !important; width: 100%; }
      table.codex-wide-table tr {
        background: #ffffff !important;
        border: 1px solid #d8e2ea !important;
        border-left: 4px solid #0b6b5c !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(13, 36, 56, 0.06) !important;
        margin: 0 0 14px 0 !important;
        padding: 14px 18px !important;
      }
      table.codex-wide-table tr:hover td { background: transparent !important; }
      table.codex-wide-table tbody tr:nth-child(even) td { background: transparent !important; }
      table.codex-wide-table td {
        border: 0 !important;
        padding: 6px 0 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        background: transparent !important;
      }
      table.codex-wide-table td:first-child {
        border-bottom: 1px solid #eef2f7 !important;
        color: #123c69 !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        margin-bottom: 8px !important;
        padding: 0 0 10px 0 !important;
      }
      table.codex-wide-table td:first-child::before { content: none !important; }
      table.codex-wide-table td:first-child strong { color: #123c69; font-size: 16px; }
      table.codex-wide-table td + td { border-top: 1px solid #eef2f7 !important; padding-top: 8px !important; margin-top: 4px !important; }
      table.codex-wide-table td[data-label]:not(:first-child)::before {
        color: #5f6b7a;
        content: attr(data-label);
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        margin-bottom: 3px;
        text-transform: uppercase;
      }

      /* Tabelas normais (compactas) */
      .codex-table-scroll { overflow-x: visible; }
      table:not(.codex-wide-table) thead th {
        font-size: 11px;
        padding: 9px 10px;
      }
      table:not(.codex-wide-table) tbody td {
        padding: 8px 10px;
        font-size: 13px;
        line-height: 1.45;
        word-break: normal;
        overflow-wrap: anywhere;
      }
    }

    /* ===========================================================
       DESKTOP >=1024px: tabela completa, sem scroll forcado.
       =========================================================== */
    @media (min-width: 1024px) {
      .codex-table-scroll { overflow-x: visible; }
    }
  `;
  doc.head.appendChild(style);
}

function applyDataLabelsToTables(doc: Document): void {
  const tables = doc.querySelectorAll<HTMLTableElement>("table");
  tables.forEach((table) => {
    if ((table.dataset as DOMStringMap)[TABLE_LABELS_FLAG] === "true") return;

    // Coletar rotulos das colunas a partir do thead (ou do primeiro tr com th).
    const headerCells = table.querySelectorAll<HTMLTableCellElement>("thead th");
    let labels: string[] = [];
    if (headerCells.length > 0) {
      labels = Array.from(headerCells).map((th) => (th.textContent || "").trim());
    } else {
      const firstRow = table.querySelector("tr");
      if (firstRow) {
        const ths = firstRow.querySelectorAll("th");
        if (ths.length > 0) {
          labels = Array.from(ths).map((th) => (th.textContent || "").trim());
        }
      }
    }

    if (labels.length === 0) {
      (table.dataset as DOMStringMap)[TABLE_LABELS_FLAG] = "true";
      return;
    }

    // Marca como "wide" quando tem >=5 colunas: no tablet (768-1023) ela
    // vira cards rotulados em vez de tabela apertada.
    if (labels.length >= 5) {
      table.classList.add("codex-wide-table");
    }

    // Aplicar data-label em cada td do tbody.
    const bodyRows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll<HTMLTableCellElement>("td");
      cells.forEach((cell, index) => {
        if (cell.getAttribute("data-label")) return;
        const label = labels[index] || "";
        if (label) cell.setAttribute("data-label", label);
      });
    });

    // Wrap em container scrollavel.
    if (!table.parentElement?.classList.contains("codex-table-scroll")) {
      const wrap = doc.createElement("div");
      wrap.className = "codex-table-scroll";
      table.parentElement?.insertBefore(wrap, table);
      wrap.appendChild(table);
    }

    (table.dataset as DOMStringMap)[TABLE_LABELS_FLAG] = "true";
  });
}

function injectMobileTableInteraction(doc: Document): void {
  const viewport = doc.defaultView;
  if (!viewport || viewport.innerWidth >= 768) return;
  if (doc.getElementById(TABLE_MODAL_STYLE_ID)) return;

  // --- CSS do modal ---
  const style = doc.createElement("style");
  style.id = TABLE_MODAL_STYLE_ID;
  style.textContent = `
    #${TABLE_MODAL_ID} {
      background: rgba(4, 20, 36, 0.96);
      display: none;
      flex-direction: column;
      inset: 0;
      position: fixed;
      z-index: 9999;
    }
    #${TABLE_MODAL_ID}.codex-tmodal--open { display: flex; }
    .codex-tmodal__bar {
      align-items: center;
      background: #0d2438;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      display: flex;
      flex-shrink: 0;
      gap: 12px;
      justify-content: space-between;
      padding: 14px 16px;
    }
    .codex-tmodal__title {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .codex-tmodal__close {
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      flex-shrink: 0;
      font: inherit;
      font-size: 13px;
      padding: 8px 14px;
    }
    .codex-tmodal__body {
      -webkit-overflow-scrolling: touch;
      background: #fff;
      flex: 1;
      overflow: auto;
      padding: 16px;
    }
    .codex-tmodal__body table {
      border-collapse: collapse;
      min-width: 480px;
      width: 100%;
    }
    .codex-tmodal__body th,
    .codex-tmodal__body td {
      border: 1px solid #d8e0ea;
      font-size: 14px;
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    .codex-tmodal__body th { background: #123c69; color: #fff; }
    .codex-tmodal__body tbody tr:nth-child(even) { background: #f8fafc; }
    .codex-table-expand-btn {
      background: #eef3f8;
      border: 1px solid #d8e0ea;
      border-radius: 10px;
      color: #123c69;
      cursor: pointer;
      display: block;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      margin: 4px 0 18px;
      padding: 10px 14px;
      text-align: center;
      width: 100%;
    }
    .codex-table-expand-btn:active { background: #dce9f6; }
  `;
  doc.head.appendChild(style);

  // --- Elemento modal ---
  const modal = doc.createElement("div");
  modal.id = TABLE_MODAL_ID;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Tabela expandida");

  const bar = doc.createElement("div");
  bar.className = "codex-tmodal__bar";

  const titleEl = doc.createElement("span");
  titleEl.className = "codex-tmodal__title";
  titleEl.textContent = "Tabela";

  const closeBtn = doc.createElement("button");
  closeBtn.className = "codex-tmodal__close";
  closeBtn.type = "button";
  closeBtn.textContent = "✕ Fechar";

  const bodyEl = doc.createElement("div");
  bodyEl.className = "codex-tmodal__body";

  bar.appendChild(titleEl);
  bar.appendChild(closeBtn);
  modal.appendChild(bar);
  modal.appendChild(bodyEl);
  doc.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.remove("codex-tmodal--open");
    bodyEl.innerHTML = "";
  };

  closeBtn.addEventListener("click", closeModal);
  doc.addEventListener("keydown", (e) => {
    if ((e as KeyboardEvent).key === "Escape") closeModal();
  });

  // --- Botão de expandir por tabela ---
  const tables = doc.querySelectorAll<HTMLTableElement>("table");
  tables.forEach((table, idx) => {
    const section = table.closest("section");
    const heading = section?.querySelector("h3, h2");
    const tableTitle = heading?.textContent?.trim() ?? `Tabela ${idx + 1}`;

    const btn = doc.createElement("button");
    btn.className = "codex-table-expand-btn";
    btn.type = "button";
    btn.textContent = "↔ Ver tabela completa";
    btn.setAttribute("aria-label", `Expandir tabela: ${tableTitle}`);

    btn.addEventListener("click", () => {
      titleEl.textContent = tableTitle;
      bodyEl.innerHTML = table.outerHTML;
      modal.classList.add("codex-tmodal--open");
      bodyEl.scrollTop = 0;
    });

    const anchor = table.closest(".codex-table-scroll") ?? table;
    anchor.parentElement?.insertBefore(btn, anchor.nextSibling);
  });
}

/**
 * Compactacao tipografica para modulos clinicos densos (Mod 1-6).
 *
 * Reduz cerca de 15% do scroll total por meio de:
 * - body font-size 16->15px, line-height 1.55->1.50
 * - main padding 34->22px (desktop), max-width restrito ja existente
 * - hero padding 34->22px, margin-bottom 28->18px, h2 34->28px
 * - section padding 26->18px (desktop), margin-bottom 22->14px
 * - section h2 25->21px (margens menores), h3 19->17px (margens menores)
 * - paragrafos, listas e bordas inter-blocos compactados
 *
 * NAO toca em:
 * - Tabelas (tem layout proprio em injectMobileResponsiveStyles)
 * - Inputs/labels/cards de calculadora (`.calc-*`, `.med-*`, `.dva-*`)
 * - Mobile (<=767px) — ja e compacto via outras regras
 *
 * Injetado DEPOIS dos estilos do modulo, ganha por ordem de cascata.
 */
function injectReadabilityCompactionStyles(doc: Document): void {
  if (doc.getElementById(COMPACT_READING_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = COMPACT_READING_STYLE_ID;
  style.textContent = `
    /* Aplicado apenas em viewports >=768px. Mobile mantem o que ja existe. */
    @media (min-width: 768px) {
      body {
        font-size: 15px;
        line-height: 1.5;
      }

      main {
        padding: 22px 26px;
        max-width: 1180px;
      }

      .hero {
        padding: 22px 26px;
        margin-bottom: 18px;
        border-radius: 18px;
      }
      .hero h2 {
        font-size: 28px;
        line-height: 1.2;
        margin-bottom: 8px;
      }
      .hero p {
        font-size: 14.5px;
        line-height: 1.5;
      }
      .badge-row { margin-top: 12px; gap: 8px; }
      .badge { font-size: 11px; padding: 5px 9px; }
      .toc-note { font-size: 11px; margin-top: 8px; }

      section {
        padding: 18px 22px;
        margin-bottom: 14px;
        border-radius: 14px;
      }
      section h2 {
        font-size: 21px;
        line-height: 1.25;
        margin: 0 0 10px;
      }
      section h3 {
        font-size: 17px;
        line-height: 1.3;
        margin: 16px 0 8px;
      }
      section h4 {
        font-size: 14.5px;
        margin: 12px 0 6px;
      }

      /* Quando a section esta colapsada via .codex-section-collapsed, o h2 vira
         botao e ja tem padding proprio — nao mexer. */
      section.codex-section-collapsed {
        padding-bottom: 10px;
      }

      p {
        margin: 0 0 10px;
      }
      ul, ol {
        margin: 0 0 10px;
        padding-left: 22px;
      }
      li {
        margin-bottom: 4px;
      }
      ul ul, ol ol, ul ol, ol ul { margin: 4px 0 4px; }

      /* Cards e metricas no corpo do texto: compactar padding. */
      .card { padding: 12px 14px; }
      .card h4 { margin: 0 0 6px; }
      .metric { padding: 10px 12px; }
      .metric strong { font-size: 18px; }

      /* Alertas: compactar mas manter destaque. */
      .alert {
        padding: 10px 14px;
        margin: 10px 0;
        border-left-width: 4px;
      }

      /* Timeline (passo a passo) compactada. */
      .timeline { padding-left: 14px; }
      .timeline .step { margin: 0 0 12px; }

      /* Figure-card (radiologia/diagramas) compactada. */
      .figure-card { padding: 10px; margin: 10px 0; }
      .figure-card figcaption { font-size: 11.5px; margin-top: 6px; }

      /* Pager entre modulos: ja tem estilo proprio do iframeSafety, so reduzir margens. */
      .codex-pager { margin: 24px 0 16px; }
      .codex-pager__btn { padding: 14px 18px; }

      /* Footer de assinatura no fim do modulo. */
      .footer-sign { margin-top: 22px; }
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Intercepta cliques em links internos (`<a href="#xxx">`) dentro do iframe e os
 * converte em scroll direto para o elemento alvo no MESMO documento, abrindo
 * automaticamente sections colapsadas (modo acordeao).
 *
 * Sem essa intercepcao, o iframe (com `srcDoc`) tenta navegar para
 * `about:srcdoc#xxx`, o que em alguns navegadores recarrega o srcDoc inteiro e
 * dispara `onLoad` de novo, causando o efeito de "modulo sobreposto" relatado
 * pelo usuario. Tambem evita borbulhar para a janela top e causar troca de rota
 * no shell React.
 */
function interceptInternalLinks(doc: Document): void {
  const flag = "codexInternalLinksWired";
  const bodyDataset = doc.body.dataset as DOMStringMap;
  if (bodyDataset[flag] === "true") return;
  bodyDataset[flag] = "true";

  doc.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.charAt(0) !== "#" || href.length < 2) return;

      // Link com target=_blank/_top/_parent: deixar o browser cuidar (provavelmente
      // intencional para abrir em nova aba).
      const linkTarget = anchor.getAttribute("target");
      if (linkTarget === "_blank") return;

      const id = decodeURIComponent(href.slice(1));
      const dest = doc.getElementById(id);
      if (!dest) return;

      event.preventDefault();
      event.stopPropagation();

      // Auto-abre section colapsada (e fecha as irmas se estiver em acordeao).
      if (dest.classList.contains(COLLAPSE_COLLAPSED_CLASS)) {
        const h2 = dest.querySelector<HTMLElement>(`:scope > h2.${COLLAPSE_TOGGLE_CLASS}`);
        if (h2) h2.click();
      } else {
        // Pode ser um subelemento (h3, p, li com id) dentro de uma section colapsada.
        const parentSection = dest.closest<HTMLElement>(`section.${COLLAPSE_COLLAPSED_CLASS}`);
        if (parentSection) {
          const h2 = parentSection.querySelector<HTMLElement>(`:scope > h2.${COLLAPSE_TOGGLE_CLASS}`);
          if (h2) h2.click();
        }
        // Pode estar dentro de um <details> nativo recolhido.
        const parentDetails = dest.closest<HTMLDetailsElement>("details");
        if (parentDetails && !parentDetails.open) {
          parentDetails.open = true;
        }
      }

      dest.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    true
  );
}

export function applyIframeSafetyLayer(document: Document, opts?: SafetyLayerOptions): void {
  injectGuardStyles(document);
  injectMobileResponsiveStyles(document);
  removeInternalModuleMenu(document);
  DOSE_RATE_PAIRS.forEach((pair) => wirePair(document, pair));
  applyDataLabelsToTables(document);
  injectMobileTableInteraction(document);

  if (opts?.compactReading) {
    injectReadabilityCompactionStyles(document);
  }

  if (opts?.collapse) {
    injectSectionCollapse(document, opts.collapse);
  }

  // Intercepta cliques de links internos APOS o collapse estar configurado, para
  // que a logica de auto-abrir section recolhida funcione.
  interceptInternalLinks(document);

  if (opts?.pager) {
    injectPagerStyles(document);
    injectModulePager(document, opts.pager);
  }
}
