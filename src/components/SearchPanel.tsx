import { useEffect, useRef } from "react";
import type { ModuleId, SearchResult } from "../types";

interface SearchPanelProps {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onQueryChange: (query: string) => void;
  onSelectResult: (moduleId: ModuleId, sectionId?: string) => void;
}

export function SearchPanel({
  query,
  results,
  isOpen,
  onOpenChange,
  onQueryChange,
  onSelectResult
}: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSearch = query.trim().length >= 2;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <section className="search-panel search-panel--collapsed" aria-label="Busca global recolhida">
        <button
          className="search-panel__rail"
          type="button"
          onClick={() => onOpenChange(true)}
          aria-controls="global-search-body"
          aria-expanded="false"
        >
          <span className="sr-only">Abrir busca global</span>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          {hasSearch ? <strong aria-label={`${results.length} resultados`}>{results.length}</strong> : null}
        </button>
      </section>
    );
  }

  return (
    <section className="search-panel search-panel--open" aria-labelledby="global-search-title">
      <div className="search-panel__header">
        <div>
          <span className="eyebrow">Busca global</span>
          <h2 id="global-search-title">Encontrar no manual</h2>
        </div>
        <div className="search-panel__actions">
          <span className="count-pill">{hasSearch ? `${results.length} resultado(s)` : "Digite 2+ letras"}</span>
          <button
            className="button button--quiet search-panel__toggle"
            type="button"
            onClick={() => onOpenChange(false)}
            aria-controls="global-search-body"
            aria-expanded="true"
          >
            Fechar
          </button>
        </div>
      </div>

      <div className="search-panel__body" id="global-search-body">
        <label className="field-label" htmlFor="global-search">
          Termo clinico, droga, formula ou procedimento
        </label>
        <div className="search-panel__input-row">
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Ex.: noradrenalina, PBW, capnografia, PEEP"
            type="search"
          />
          {query ? (
            <button className="button button--quiet" type="button" onClick={() => onQueryChange("")}>
              Limpar
            </button>
          ) : null}
        </div>

        {hasSearch ? (
          <div className="search-results" role="list">
            {results.length ? (
              results.map((result) => (
                <button
                  key={`${result.moduleId}-${result.sectionId}-${result.excerpt}`}
                  className="search-result"
                  type="button"
                  onClick={() => onSelectResult(result.moduleId, result.sectionId)}
                  role="listitem"
                >
                  <span className="search-result__module">
                    Modulo {result.moduleNumber} - {result.moduleTitle}
                  </span>
                  <strong>{result.sectionTitle}</strong>
                  <span>{result.excerpt}</span>
                </button>
              ))
            ) : (
              <p className="empty-state">Nenhuma correspondencia encontrada nos modulos carregados.</p>
            )}
          </div>
        ) : (
          <p className="empty-state">Digite pelo menos 2 letras para pesquisar nos modulos.</p>
        )}
      </div>
    </section>
  );
}
