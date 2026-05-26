import type { ModuleId } from "../types";

export type AppView = "home" | "module";

export interface AppRoute {
  view: AppView;
  /** Sempre presente: usado como modulo "ativo" mesmo quando view=home, para
   *  manter sidebar consistente e permitir back/forward. */
  moduleId: ModuleId;
  sectionId?: string;
}

const DEFAULT_MODULE: ModuleId = "modulo-01";
const MODULE_IDS = new Set<ModuleId>([
  "modulo-01",
  "modulo-02",
  "modulo-03",
  "modulo-04",
  "modulo-05",
  "modulo-06",
  "modulo-07",
  "modulo-08",
  "modulo-09"
]);

export function parseHashRoute(hash: string): AppRoute {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);

  // Rota explicita de home: "#/home" ou "#home"
  if (parts[0] === "home") {
    return { view: "home", moduleId: DEFAULT_MODULE };
  }

  if (parts[0] === "module" && MODULE_IDS.has(parts[1] as ModuleId)) {
    return {
      view: "module",
      moduleId: parts[1] as ModuleId,
      sectionId: parts[2]
    };
  }

  if (MODULE_IDS.has(parts[0] as ModuleId)) {
    return {
      view: "module",
      moduleId: parts[0] as ModuleId,
      sectionId: parts[1]
    };
  }

  // Hash vazio = home (primeira impressao do usuario logado).
  return { view: "home", moduleId: DEFAULT_MODULE };
}

export function routeToHash(route: AppRoute): string {
  if (route.view === "home") return "#/home";
  return route.sectionId
    ? `#/module/${route.moduleId}/${route.sectionId}`
    : `#/module/${route.moduleId}`;
}
