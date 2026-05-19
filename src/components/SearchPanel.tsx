import type { ModuleId, SearchResult } from "../types";

interface SearchPanelProps {
  query: string;
  results: SearchResult[];
  onQueryChange: (query: string) => void;
  onSelectResult: (moduleId: ModuleId, sectionId?: string) => void;
}

export function SearchPanel({ query, results, onQueryChange, onSelectResult }: SearchPanelProps) {
  const hasSearch = query.trim().length >= 2;

  return (
    <section className="search-panel" aria-labelledby="global-search-title">
      <div className="search-panel__header">
        <div>
          <span className="eyebrow">Busca global</span>
          <h2 id="global-search-title">Encontrar no manual</h2>
        </div>
        <span className="count-pill">{hasSearch ? `${results.length} resultado(s)` : "Digite 2+ letras"}</span>
      </div>

      <label className="field-label" htmlFor="global-search">
        Termo clinico, droga, formula ou procedimento
      </label>
      <div className="search-panel__input-row">
        <input
          id="global-search"
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
                  Modulo {result.moduleNumber} · {result.moduleTitle}
                </span>
                <strong>{result.sectionTitle}</strong>
                <span>{result.excerpt}</span>
              </button>
            ))
          ) : (
            <p className="empty-state">Nenhuma correspondencia encontrada nos modulos carregados.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
