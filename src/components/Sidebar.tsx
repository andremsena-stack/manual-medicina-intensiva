import type { ModuleId, ModuleRecord } from "../types";

interface SidebarProps {
  modules: ModuleRecord[];
  activeModule: ModuleRecord;
  activeSectionId?: string;
  isOpen: boolean;
  onCollapse: () => void;
  onSelectModule: (moduleId: ModuleId) => void;
  onSelectSection: (moduleId: ModuleId, sectionId: string) => void;
}

export function Sidebar({
  modules,
  activeModule,
  activeSectionId,
  isOpen,
  onCollapse,
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
        {modules.map((module) => {
          const isActiveModule = module.id === activeModule.id;

          return (
            <div key={module.id} className="module-nav__group">
              <button
                className={`module-nav__item ${isActiveModule ? "module-nav__item--active" : ""}`}
                type="button"
                onClick={() => onSelectModule(module.id)}
                onDoubleClick={onCollapse}
              >
                <span>Modulo {module.number}</span>
                <strong>{module.title}</strong>
              </button>

              {isActiveModule ? (
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
