import type { ModuleId } from "../types";

export interface AppRoute {
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
  "modulo-06"
]);

export function parseHashRoute(hash: string): AppRoute {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts[0] === "module" && MODULE_IDS.has(parts[1] as ModuleId)) {
    return {
      moduleId: parts[1] as ModuleId,
      sectionId: parts[2]
    };
  }

  if (MODULE_IDS.has(parts[0] as ModuleId)) {
    return {
      moduleId: parts[0] as ModuleId,
      sectionId: parts[1]
    };
  }

  return { moduleId: DEFAULT_MODULE };
}

export function routeToHash(route: AppRoute): string {
  return route.sectionId
    ? `#/module/${route.moduleId}/${route.sectionId}`
    : `#/module/${route.moduleId}`;
}
