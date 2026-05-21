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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeModule = modules.find((module) => module.id === route.moduleId) ?? modules[0];
  const results = useMemo(() => searchModules(modules, query), [modules, query]);

  const navigateTo = (moduleId: ModuleId, sectionId?: string) => {
    window.location.hash = routeToHash({ moduleId, sectionId });
  };

  const openSidebar = () => {
    setIsSearchOpen(false);
    setIsSidebarOpen(true);
  };

  const setSearchPanelOpen = (open: boolean) => {
    setIsSearchOpen(open);
    if (open) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`app-shell ${isSidebarOpen ? "app-shell--sidebar-open" : ""}`}>
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
          <button
            className="button button--primary mobile-menu"
            type="button"
            onClick={openSidebar}
            aria-label="Abrir sumario de modulos"
          >
            Modulos
          </button>
        </header>

        <main className="content-grid">
          <div className="primary-column">
            <ModuleViewer module={activeModule} targetSectionId={route.sectionId} />
          </div>
        </main>

        <SearchPanel
          query={query}
          results={results}
          isOpen={isSearchOpen}
          onOpenChange={setSearchPanelOpen}
          onQueryChange={setQuery}
          onSelectResult={(moduleId, sectionId) => {
            navigateTo(moduleId, sectionId);
            setIsSearchOpen(false);
            setIsSidebarOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default App;
