import { useCallback, useEffect, useRef } from "react";
import type { ModuleId, ModuleRecord } from "../types";
import { applyIframeSafetyLayer, type CollapseConfig } from "../utils/iframeSafety";

// Configuracao por modulo de colapso inicial das sections.
// Modulo 6 (Disturbios): skip — ja usa <details> nativo para cada distúrbio (Hipo/Hiper).
// Modulo 7 (Calculadoras): accordionMode — #paciente fixo no topo (sem toggle, sempre
//   visivel); todas as demais (IOT, Bolus, Eletrolitos, Infusao, Cenario-resumo,
//   Sugestao de leitura) iniciam recolhidas; abrir uma fecha as outras.
// Modulo 8 (Referencias): skip — ja usa <details>/<summary> nativo por bloco.
// Modulos 1-5: todas comecam abertas; usuario pode recolher clicando no h2.
const COLLAPSE_BY_MODULE: Partial<Record<ModuleId, CollapseConfig | undefined>> = {
  "modulo-01": {},
  "modulo-02": {},
  "modulo-03": {},
  "modulo-04": {},
  "modulo-05": {},
  "modulo-06": { skipSectionsWithDetails: true },
  "modulo-07": { keepExpandedIds: ["paciente"], accordionMode: true },
  "modulo-08": undefined
};

interface ModuleViewerProps {
  module: ModuleRecord;
  targetSectionId?: string;
  modules?: ModuleRecord[];
  onNavigateModule?: (moduleId: ModuleId) => void;
}

function scrollToSection(document: Document, sectionId?: string): void {
  if (!sectionId) {
    document.defaultView?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(sectionId);
  if (target) {
    // Se a section esta recolhida (acordeao), abre antes de rolar para que o conteudo
    // fique visivel. Tambem fecha as irmas via click sintetico no h2 (preserva o
    // comportamento de acordeao definido em iframeSafety).
    if (target.classList.contains("codex-section-collapsed")) {
      const h2 = target.querySelector<HTMLElement>(":scope > h2.codex-section-toggle");
      if (h2) h2.click();
    }
    target.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

export function ModuleViewer({ module, targetSectionId, modules, onNavigateModule }: ModuleViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const syncIframe = useCallback(() => {
    const document = iframeRef.current?.contentDocument;
    if (!document || !document.head || !document.body) {
      // iframe ainda nao terminou de carregar o srcDoc; onLoad chama de novo
      return;
    }

    let pager;
    if (modules && modules.length > 0 && onNavigateModule) {
      const idx = modules.findIndex((m) => m.id === module.id);
      const prev = idx > 0 ? modules[idx - 1] : undefined;
      const next = idx < modules.length - 1 ? modules[idx + 1] : undefined;
      pager = {
        prev: prev && { id: prev.id, number: prev.number, title: prev.title },
        next: next && { id: next.id, number: next.number, title: next.title },
        onNavigate: onNavigateModule
      };
    }

    const collapse = COLLAPSE_BY_MODULE[module.id];

    applyIframeSafetyLayer(document, {
      ...(pager ? { pager } : {}),
      ...(collapse ? { collapse } : {})
    });
    scrollToSection(document, targetSectionId);
  }, [module.id, modules, onNavigateModule, targetSectionId]);

  useEffect(() => {
    syncIframe();
  }, [module.id, syncIframe]);

  return (
    <section className="module-viewer" aria-label={`Modulo ${module.number}: ${module.title}`}>
      <div className="module-viewer__toolbar">
        <h2>
          Modulo {module.number} - {module.title}
        </h2>
      </div>
      <div className="module-viewer__frame-wrap">
        <iframe
          key={module.id}
          ref={iframeRef}
          className="module-viewer__frame"
          srcDoc={module.html}
          title={`Conteudo do modulo ${module.number}: ${module.title}`}
          sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
          onLoad={syncIframe}
        />
      </div>
    </section>
  );
}
