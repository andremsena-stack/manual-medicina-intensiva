import type { ModuleRecord, SearchResult } from "../types";
import { clampText, normalizeText } from "./text";

function excerptFor(text: string, normalizedText: string, normalizedQuery: string): string {
  const index = normalizedText.indexOf(normalizedQuery);
  if (index < 0) {
    return clampText(text);
  }

  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + normalizedQuery.length + 150);
  return clampText(text.slice(start, end));
}

export function searchModules(modules: ModuleRecord[], query: string): SearchResult[] {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const results: SearchResult[] = [];

  modules.forEach((module) => {
    const sections = module.sections.length
      ? module.sections
      : [{ id: "", title: module.title, text: module.plainText }];

    sections.forEach((section) => {
      const normalizedTitle = normalizeText(section.title);
      const normalizedText = normalizeText(section.text);
      const inTitle = normalizedTitle.includes(normalizedQuery);
      const inText = normalizedText.includes(normalizedQuery);

      if (!inTitle && !inText) {
        return;
      }

      results.push({
        moduleId: module.id,
        moduleNumber: module.number,
        moduleTitle: module.title,
        sectionId: section.id,
        sectionTitle: section.title,
        excerpt: excerptFor(section.text, normalizedText, normalizedQuery)
      });
    });
  });

  return results.slice(0, 40);
}
