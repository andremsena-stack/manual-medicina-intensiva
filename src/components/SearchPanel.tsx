import { useEffect, useRef, useState } from "react";
import type { ModuleId, SearchResult } from "../types";

interface SearchPanelProps {
  query: string;
  results: SearchResult[];
  onQueryChange: (query: string) => void;
  onSelectResult: (moduleId: ModuleId, sectionId?: string) => void;
}

export function SearchPanel({ query, results, onQueryChange, onSelectResult }: SearchPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSearch = query.trim().length >= 2;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <section
      className={`search-panel ${isOpen ? "search-panel--open" : "search-panel--collapsed"}`}
      aria-labelledby="global-search-title"
    >
      <div className="search-panel__header">
        <div>
          <span className="eyebrow">Busca global</span>
          <h2 id="global-search-title">Encontrar no manual</h2>
        </div>
        <div className="search-panel__actions">
          <span className="count-pill">{hasSearch ? `${results.length} resultado(s)` : "Busca recolhida"}</span>
          <button
            className="button button--quiet search-panel__toggle"
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-controls="global-search-body"
            aria-expanded={isOpen}
          >
            {isOpen ? "Recolher" : "Abrir busca"}
          </button>
        </div>
      </div>

      {isOpen ? (
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
            <p className="empty-state">Abra a busca e digite pelo menos 2 letras para pesquisar nos modulos.</p>
          )}
        </div>
      ) : (
        <div className="search-panel__collapsed-body">
          <span>Busque drogas, formulas, procedimentos ou termos clinicos quando precisar.</span>
          {query ? <strong>Termo atual: {query}</strong> : null}
        </div>
      )}
    </section>
  );
}
