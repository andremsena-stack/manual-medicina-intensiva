import { useEffect, useMemo, useState } from "react";
import { ModuleViewer } from "./components/ModuleViewer";
import { SearchPanel } from "./components/SearchPanel";
import { Sidebar } from "./components/Sidebar";
import { moduleSources } from "./data/moduleSources";
import type { ModuleId } from "./types";
import { createModuleRecords } from "./utils/modules";
import { parseHashRoute, routeToHash } from "./utils/route";
import { searchModules } from "./utils/search";

function App() {
  const modules = useMemo(() => createModuleRecords(moduleSources), []);
  const [route, setRoute] = useState(() => parseHashRoute(window.location.hash));
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeModule = modules.find((module) => module.id === route.moduleId) ?? modules[0];
  const results = useMemo(() => searchModules(modules, query), [modules, query]);

  const navigateTo = (moduleId: ModuleId, sectionId?: string) => {
    window.location.hash = routeToHash({ moduleId, sectionId });
  };

  return (
    <div className="app-shell">
      <Sidebar
        modules={modules}
        activeModule={activeModule}
        activeSectionId={route.sectionId}
        isOpen={isSidebarOpen}
        onCollapse={() => setIsSidebarOpen(false)}
        onSelectModule={(moduleId) => navigateTo(moduleId)}
        onSelectSection={navigateTo}
      />

      <div className="workspace">
        <header className="topbar">
          <button className="button button--primary mobile-menu" type="button" onClick={() => setIsSidebarOpen(true)}>
            Modulos
          </button>
          <div>
            <span className="eyebrow">PWA offline-first</span>
            <p>Conteudo clinico preservado em HTML fonte e renderizado via ModuleViewer.</p>
          </div>
          <span className="build-badge">v1</span>
        </header>

        <main className="content-grid">
          <div className="primary-column">
            <ModuleViewer module={activeModule} targetSectionId={route.sectionId} />
          </div>
          <div className="secondary-column">
            <SearchPanel
              query={query}
              results={results}
              onQueryChange={setQuery}
              onSelectResult={(moduleId, sectionId) => {
                navigateTo(moduleId, sectionId);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
