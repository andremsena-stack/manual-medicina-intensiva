import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ModuleId, SearchResult } from "../types";

interface SearchPanelProps {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onQueryChange: (query: string) => void;
  onSelectResult: (moduleId: ModuleId, sectionId?: string) => void;
}

function SearchTrigger({
  isOpen,
  hasSearch,
  resultCount,
  onOpenChange
}: {
  isOpen: boolean;
  hasSearch: boolean;
  resultCount: number;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <button
      className="search-trigger"
      type="button"
      onClick={() => onOpenChange(true)}
      aria-label="Abrir busca global"
      aria-controls="global-search-modal"
      aria-expanded={isOpen}
      title="Buscar nos módulos (Ctrl+K)"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
      {hasSearch ? <strong aria-label={`${resultCount} resultados`}>{resultCount}</strong> : null}
    </button>
  );
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
      // foco no input ao abrir
      requestAnimationFrame(() => inputRef.current?.focus());
      // trava scroll do body enquanto modal aberto
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) {
    return (
      <SearchTrigger
        isOpen={false}
        hasSearch={hasSearch}
        resultCount={results.length}
        onOpenChange={onOpenChange}
      />
    );
  }

  const modal = (
    <div
      className="search-modal-overlay"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        id="global-search-modal"
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="search-modal__header">
          <div>
            <span className="eyebrow">Busca global</span>
            <h2 id="global-search-title">Encontrar no manual</h2>
          </div>
          <button
            className="search-modal__close"
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar busca"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </header>

        <div className="search-modal__body">
          <label className="field-label search-modal__field" htmlFor="global-search">
            Termo clínico, droga, fórmula ou procedimento
          </label>
          <div className="search-modal__input-row">
            <input
              id="global-search"
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Ex.: noradrenalina, PBW, capnografia, PEEP"
              type="search"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button
                className="button button--quiet search-modal__clear"
                type="button"
                onClick={() => onQueryChange("")}
              >
                Limpar
              </button>
            ) : null}
          </div>

          <p className="search-modal__meta">
            {hasSearch ? `${results.length} resultado(s)` : "Digite pelo menos 2 letras para pesquisar."}
          </p>

          <div className="search-modal__results">
            {hasSearch ? (
              results.length ? (
                <div className="search-results" role="list">
                  {results.map((result) => (
                    <button
                      key={`${result.moduleId}-${result.sectionId}-${result.excerpt}`}
                      className="search-result"
                      type="button"
                      onClick={() => onSelectResult(result.moduleId, result.sectionId)}
                      role="listitem"
                    >
                      <span className="search-result__module">
                        Módulo {result.moduleNumber} — {result.moduleTitle}
                      </span>
                      <strong>{result.sectionTitle}</strong>
                      <span>{result.excerpt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Nenhuma correspondência encontrada nos módulos carregados.</p>
              )
            ) : null}
          </div>
        </div>

        <footer className="search-modal__footer">
          <span><kbd>Esc</kbd> fechar</span>
          <span><kbd>↵</kbd> ir ao resultado destacado</span>
        </footer>
      </div>
    </div>
  );

  return (
    <>
      <SearchTrigger
        isOpen={true}
        hasSearch={hasSearch}
        resultCount={results.length}
        onOpenChange={onOpenChange}
      />
      {createPortal(modal, document.body)}
    </>
  );
}
