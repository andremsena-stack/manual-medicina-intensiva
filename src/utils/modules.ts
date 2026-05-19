import type { ModuleRecord, ModuleSection, ModuleSource } from "../types";

function textFromElement(element: Element | Document): string {
  return (element.textContent ?? "").replace(/\s+/g, " ").trim();
}

function sectionTitle(section: Element): string {
  const heading = section.querySelector("h2, h3, summary");
  return heading ? textFromElement(heading) : section.id;
}

function extractSections(document: Document): ModuleSection[] {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  return sections.map((section) => ({
    id: section.id,
    title: sectionTitle(section),
    text: textFromElement(section)
  }));
}

export function createModuleRecords(sources: ModuleSource[]): ModuleRecord[] {
  const parser = new DOMParser();

  return sources.map((source) => {
    const parsed = parser.parseFromString(source.html, "text/html");
    const sections = extractSections(parsed);
    const plainText = textFromElement(parsed);

    return {
      ...source,
      sections,
      plainText
    };
  });
}
