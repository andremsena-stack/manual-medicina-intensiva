import { useCallback, useEffect, useRef } from "react";
import type { ModuleRecord } from "../types";
import { applyIframeSafetyLayer } from "../utils/iframeSafety";

interface ModuleViewerProps {
  module: ModuleRecord;
  targetSectionId?: string;
}

function scrollToSection(document: Document, sectionId?: string): void {
  if (!sectionId) {
    document.defaultView?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

export function ModuleViewer({ module, targetSectionId }: ModuleViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const syncIframe = useCallback(() => {
    const document = iframeRef.current?.contentDocument;
    if (!document) {
      return;
    }

    applyIframeSafetyLayer(document);
    scrollToSection(document, targetSectionId);
  }, [targetSectionId]);

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
