interface InputPair {
  doseId: string;
  rateId: string;
}

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

function injectModuleMenuStyles(document: Document): void {
  if (document.getElementById("codex-runtime-module-menu-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "codex-runtime-module-menu-style";
  style.textContent = `
    .brand__row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .brand__content{min-width:0}
    .nav-toggle{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.10);color:#fff;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
    .nav-toggle:hover{background:rgba(255,255,255,.18)}
    nav a:hover,nav a.module-nav-link--active{background:rgba(255,255,255,.14);color:#fff}
    .app:not(.nav-collapsed) aside nav ul{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    .app:not(.nav-collapsed) aside nav li{margin:0;min-width:0}
    .app:not(.nav-collapsed) aside nav a{align-items:center;display:flex;height:100%;line-height:1.2;min-height:38px;padding:8px 9px}
    @media(min-width:981px){.app:not(.nav-collapsed){grid-template-columns:1fr}.app:not(.nav-collapsed) aside{height:auto;max-height:46vh;position:sticky;top:0;z-index:10}.app:not(.nav-collapsed) main{max-width:none}}
    .app.nav-collapsed{display:block;grid-template-columns:1fr}
    .app.nav-collapsed aside{background:transparent!important;box-shadow:none!important;height:52px!important;left:auto!important;max-height:none!important;overflow:visible!important;padding:0!important;position:fixed!important;right:0!important;top:46vh!important;width:54px!important;z-index:80!important}
    .app.nav-collapsed .brand{border:0!important;margin:0!important;padding:0!important;text-align:center}
    .app.nav-collapsed .brand__row{display:block}
    .app.nav-collapsed .brand__content{display:none!important}
    .app.nav-collapsed .nav-toggle{align-items:center;background:#123c69;border:1px solid rgba(255,255,255,.28);border-radius:8px 0 0 8px;box-shadow:0 14px 30px rgba(13,36,56,.28);display:flex;height:52px;justify-content:center;padding:0;width:54px}
    .app.nav-collapsed .nav-toggle:hover{background:#0d2438}
    .app.nav-collapsed nav{display:none}
    .app.nav-collapsed nav a{align-items:center;display:flex;justify-content:center;min-height:40px;padding:9px 4px;position:relative}
    .app.nav-collapsed nav a .nav-label{clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}
    .app.nav-collapsed nav a::before{content:attr(data-short);font-size:12px;font-weight:800}
    @media(max-width:980px){.app,.app.nav-collapsed{grid-template-columns:1fr}aside{position:sticky;top:0;z-index:10;height:auto;max-height:82vh}.app.nav-collapsed aside{height:52px!important;left:auto!important;position:fixed!important;right:0!important;top:46vh!important;width:54px!important}.app.nav-collapsed nav{display:none}.app.nav-collapsed .brand{border-bottom:0!important;margin:0!important;padding:0!important;text-align:center}.app.nav-collapsed .brand__row{display:block}.app.nav-collapsed .brand__content{display:none!important}.app.nav-collapsed .brand h1{font-size:16px}.app.nav-collapsed .brand p,.app.nav-collapsed .brand .toc-note,.app.nav-collapsed .brand .small{display:none}}
    @media(max-width:720px){.app:not(.nav-collapsed) aside nav ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:460px){.app:not(.nav-collapsed) aside nav ul{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function shortMenuLabel(link: HTMLAnchorElement, index: number): string {
  const text = link.textContent?.trim() ?? "";
  const number = text.match(/^([0-9]+(?:\.[0-9]+)?)/);

  if (number) {
    return number[1];
  }

  if (/refer/i.test(text)) {
    return "Ref";
  }

  if (/leit/i.test(text)) {
    return "Ler";
  }

  return String(index + 1);
}

function ensureBrandStructure(document: Document, brand: Element): void {
  if (brand.querySelector(".brand__row")) {
    return;
  }

  const row = document.createElement("div");
  row.className = "brand__row";

  const content = document.createElement("div");
  content.className = "brand__content";

  while (brand.firstChild) {
    content.appendChild(brand.firstChild);
  }

  row.appendChild(content);
  brand.appendChild(row);
}

function ensureModuleMenu(document: Document): void {
  injectModuleMenuStyles(document);

  const app = document.querySelector<HTMLElement>(".app");
  const brand = document.querySelector(".brand");
  const nav = document.querySelector<HTMLElement>("aside nav");

  if (!app || !brand || !nav) {
    return;
  }

  if (!app.id) {
    app.id = "moduleApp";
  }

  if (!nav.id) {
    nav.id = "moduleNav";
  }

  if (!nav.getAttribute("aria-label")) {
    nav.setAttribute("aria-label", "Secoes do modulo");
  }

  ensureBrandStructure(document, brand);

  const row = brand.querySelector(".brand__row");
  let toggle = document.getElementById("moduleNavToggle");

  if (!toggle && row) {
    toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.id = "moduleNavToggle";
    toggle.setAttribute("type", "button");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Minimizar";
    toggle.dataset.codexInjectedMenu = "true";
    row.appendChild(toggle);
  }

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  links.forEach((link, index) => {
    if (!link.dataset.short) {
      link.dataset.short = shortMenuLabel(link, index);
    }

    if (!link.querySelector(".nav-label")) {
      const label = document.createElement("span");
      label.className = "nav-label";
      label.textContent = link.textContent;
      link.textContent = "";
      link.appendChild(label);
    }
  });

  if (!toggle || toggle.dataset.codexMenuGuarded === "true" || toggle.dataset.codexInjectedMenu !== "true") {
    return;
  }

  const setCollapsed = (collapsed: boolean) => {
    app.classList.toggle("nav-collapsed", collapsed);
    toggle.textContent = collapsed ? "Menu" : "Minimizar";
    toggle.setAttribute("aria-expanded", String(!collapsed));
  };

  const setActive = (activeLink: HTMLAnchorElement | null) => {
    links.forEach((link) => link.classList.remove("module-nav-link--active"));
    activeLink?.classList.add("module-nav-link--active");
  };

  toggle.dataset.codexMenuGuarded = "true";
  toggle.addEventListener("click", () => setCollapsed(!app.classList.contains("nav-collapsed")));

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href") ?? "");

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ block: "start", behavior: "smooth" });
      setActive(link);

      if (document.defaultView?.matchMedia("(max-width: 980px)").matches) {
        setCollapsed(true);
      }
    });
  });

  setActive(links[0] ?? null);
}

export function applyIframeSafetyLayer(document: Document): void {
  injectGuardStyles(document);
  ensureModuleMenu(document);
  DOSE_RATE_PAIRS.forEach((pair) => wirePair(document, pair));
}
