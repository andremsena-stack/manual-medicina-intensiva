import type { ModuleId, ModuleRecord } from "../types";

interface SidebarProps {
  modules: ModuleRecord[];
  activeModule: ModuleRecord;
  activeSectionId?: string;
  expandedModuleId?: ModuleId | null;
  isOpen: boolean;
  isHomeActive: boolean;
  onCollapse: () => void;
  onSelectHome: () => void;
  onSelectModule: (moduleId: ModuleId) => void;
  onSelectSection: (moduleId: ModuleId, sectionId: string) => void;
}

export function Sidebar({
  modules,
  activeModule,
  activeSectionId,
  expandedModuleId,
  isOpen,
  isHomeActive,
  onCollapse,
  onSelectHome,
  onSelectModule,
  onSelectSection
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Navegacao do manual">
      <div className="sidebar__top">
        <div>
          <span className="eyebrow eyebrow--inverse">Manual Interativo</span>
          <h1>Medicina Intensiva</h1>
        </div>
      </div>

      <button
        className="button button--inverse sidebar__close sidebar__collapse sidebar__edge-collapse"
        type="button"
        onClick={onCollapse}
        aria-label="Minimizar sumario lateral"
        title="Minimizar sumario lateral"
      >
        <span className="sidebar__collapse-icon" aria-hidden="true" />
      </button>

      <nav className="module-nav" aria-label="Modulos">
        <button
          className={`module-nav__home ${isHomeActive ? "module-nav__home--active" : ""}`}
          type="button"
          onClick={onSelectHome}
          aria-current={isHomeActive ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="module-nav__home-icon">
            <path d="M4 11l8-7 8 7" />
            <path d="M6 10v9h12v-9" />
            <path d="M10 19v-5h4v5" />
          </svg>
          <span>Início</span>
        </button>

        {modules.map((module) => {
          const isActiveModule = !isHomeActive && module.id === activeModule.id;
          const isExpandedModule = !isHomeActive && module.id === expandedModuleId;

          return (
            <div key={module.id} className="module-nav__group">
              <button
                className={`module-nav__item ${isActiveModule ? "module-nav__item--active" : ""}`}
                type="button"
                onClick={() => onSelectModule(module.id)}
                aria-expanded={isExpandedModule}
              >
                <span>Modulo {module.number}</span>
                <strong>{module.title}</strong>
              </button>

              {isExpandedModule ? (
                <div className="section-nav section-nav--inline" aria-label={`Secoes do modulo ${module.number}`}>
                  <div className="section-nav__title">Secoes do modulo {module.number}</div>
                  {module.sections.length ? (
                    module.sections.map((section) => (
                      <button
                        key={section.id}
                        className={`section-nav__item ${
                          section.id === activeSectionId ? "section-nav__item--active" : ""
                        }`}
                        type="button"
                        onClick={() => onSelectSection(module.id, section.id)}
                      >
                        {section.title}
                      </button>
                    ))
                  ) : (
                    <p className="section-nav__empty">Este modulo nao declarou secoes com identificador.</p>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
