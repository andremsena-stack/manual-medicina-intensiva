import { useCallback, useEffect, useMemo, useState } from "react";
import { InstallPrompt } from "./components/InstallPrompt";
import { ModuleHome } from "./components/ModuleHome";
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
  const [expandedModuleId, setExpandedModuleId] = useState<ModuleId | null>(() => route.moduleId);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    setExpandedModuleId(route.moduleId);
  }, [route.moduleId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsSidebarOpen(false);
      }
      // Cmd/Ctrl+K abre a busca global de qualquer lugar
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeModule = modules.find((module) => module.id === route.moduleId) ?? modules[0];
  const results = useMemo(() => searchModules(modules, query), [modules, query]);

  const navigateTo = useCallback((moduleId: ModuleId, sectionId?: string) => {
    window.location.hash = routeToHash({ view: "module", moduleId, sectionId });
  }, []);

  const navigateHome = useCallback(() => {
    window.location.hash = routeToHash({ view: "home", moduleId: "modulo-01" });
  }, []);

  const navigateToModule = useCallback(
    (moduleId: ModuleId) => navigateTo(moduleId),
    [navigateTo]
  );

  const selectModule = (moduleId: ModuleId) => {
    if (route.view === "module" && moduleId === activeModule.id) {
      setExpandedModuleId((current) => (current === moduleId ? null : moduleId));
      return;
    }

    setExpandedModuleId(moduleId);
    navigateTo(moduleId);
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

  const isHome = route.view === "home";

  return (
    <div className={`app-shell ${isSidebarOpen ? "app-shell--sidebar-open" : ""}`}>
      <Sidebar
        modules={modules}
        activeModule={activeModule}
        activeSectionId={route.sectionId}
        expandedModuleId={expandedModuleId}
        isOpen={isSidebarOpen}
        isHomeActive={isHome}
        onCollapse={() => setIsSidebarOpen(false)}
        onSelectHome={() => {
          navigateHome();
          setIsSidebarOpen(false);
        }}
        onSelectModule={(moduleId) => {
          selectModule(moduleId);
          setIsSidebarOpen(false);
        }}
        onSelectSection={(moduleId, sectionId) => {
          setExpandedModuleId(moduleId);
          navigateTo(moduleId, sectionId);
          setIsSidebarOpen(false);
        }}
      />

      <div className="workspace">
        <button
          className="module-menu-trigger"
          type="button"
          onClick={openSidebar}
          aria-label="Abrir sumario de modulos"
          title="Sumário de módulos"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="5" cy="6.5" r="1.2" fill="currentColor" />
            <line x1="9" y1="6.5" x2="19" y2="6.5" />
            <circle cx="5" cy="12" r="1.2" fill="currentColor" />
            <line x1="9" y1="12" x2="19" y2="12" />
            <circle cx="5" cy="17.5" r="1.2" fill="currentColor" />
            <line x1="9" y1="17.5" x2="19" y2="17.5" />
          </svg>
        </button>

        <main className="content-grid">
          <div className="primary-column">
            {isHome ? (
              <ModuleHome modules={modules} onSelectModule={navigateToModule} />
            ) : (
              <ModuleViewer
                module={activeModule}
                targetSectionId={route.sectionId}
                modules={modules}
                onNavigateModule={navigateToModule}
              />
            )}
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

        <nav className="mobile-action-bar" aria-label="Acoes do modulo">
          <button
            className="mobile-action-bar__btn"
            type="button"
            onClick={openSidebar}
            aria-label="Abrir sumario de modulos"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="5" cy="6.5" r="1.2" fill="currentColor" />
              <line x1="9" y1="6.5" x2="19" y2="6.5" />
              <circle cx="5" cy="12" r="1.2" fill="currentColor" />
              <line x1="9" y1="12" x2="19" y2="12" />
              <circle cx="5" cy="17.5" r="1.2" fill="currentColor" />
              <line x1="9" y1="17.5" x2="19" y2="17.5" />
            </svg>
          </button>
          <button
            className="mobile-action-bar__btn"
            type="button"
            onClick={() => setSearchPanelOpen(true)}
            aria-label="Abrir busca global"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </button>
        </nav>
      </div>
      <InstallPrompt />
    </div>
  );
}

export default App;
