import { useEffect } from "react";
import { moduleSources } from "../data/moduleSources";
import "./ReviewAllModules.css";

/**
 * Página de revisão integral dos módulos clínicos.
 *
 * Acesso local: http://localhost:5173/?preview=modulos (Vite Dev, com HMR).
 *
 * Cada HTML canônico vive em src/data/modules/ e é importado via ?raw em
 * src/data/moduleSources.ts. Os arquivos são renderizados em iframes isolados
 * (sandbox) para não conflitarem entre si nem com o app que envolve esta página.
 *
 * Use esta view só para revisão — edições devem ser feitas no HTML canônico,
 * marcadas em docs/REVISAO_MODULOS.md e registradas em docs/changelog.md
 * conforme a regra clínica do projeto.
 */
export function ReviewAllModules() {
  useEffect(() => {
    document.body.classList.add("review-active");
    return () => document.body.classList.remove("review-active");
  }, []);

  return (
    <div className="review-shell">
      <aside className="review-toc" aria-label="Sumário de módulos">
        <div className="review-toc-brand">
          <span className="review-toc-eyebrow">Revisão integral</span>
          <h1>Manual de Medicina Intensiva</h1>
          <p>Modo de pré-visualização local. Sem login, sem assinatura.</p>
        </div>

        <nav aria-label="Ir para módulo">
          <ol className="review-toc-list">
            {moduleSources.map((m) => (
              <li key={m.id}>
                <a href={`#${m.id}`}>
                  <span className="review-toc-num">{String(m.number).padStart(2, "0")}</span>
                  <span className="review-toc-title">{m.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="review-toc-help">
          <p><strong>Como editar</strong></p>
          <ol>
            <li>Abra <code>src/data/modules/modulo_XX_*.html</code>.</li>
            <li>Salve — o Vite recarrega o iframe via HMR.</li>
            <li>Marque o item em <code>docs/REVISAO_MODULOS.md</code>.</li>
            <li>Antes do deploy: <code>npm run verify:modules</code> e atualizar o hash.</li>
          </ol>
        </div>
      </aside>

      <main className="review-main">
        {moduleSources.map((m) => (
          <section key={m.id} id={m.id} className="review-module">
            <header className="review-module-header">
              <span className="review-module-number">{String(m.number).padStart(2, "0")}</span>
              <div className="review-module-titles">
                <h2>{m.title}</h2>
                <span className="review-module-file">{m.fileName}</span>
              </div>
            </header>
            <iframe
              title={`Módulo ${m.number} — ${m.title}`}
              srcDoc={m.html}
              className="review-iframe"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              loading="lazy"
            />
          </section>
        ))}
      </main>
    </div>
  );
}
