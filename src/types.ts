export type ModuleId =
  | "modulo-01"
  | "modulo-02"
  | "modulo-03"
  | "modulo-04"
  | "modulo-05"
  | "modulo-06"
  | "modulo-07"
  | "modulo-08";

export interface ModuleSection {
  id: string;
  title: string;
  text: string;
}

export interface ModuleRecord {
  id: ModuleId;
  number: number;
  title: string;
  fileName: string;
  html: string;
  sections: ModuleSection[];
  plainText: string;
}

export interface ModuleSource {
  id: ModuleId;
  number: number;
  title: string;
  fileName: string;
  html: string;
}

export interface SearchResult {
  moduleId: ModuleId;
  moduleNumber: number;
  moduleTitle: string;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;
}

export type ClinicalSourceStatus =
  | "fonte externa"
  | "fonte interna"
  | "revisão necessária";

export interface ClinicalSource {
  name: string;
  link?: string;
  scope: string;
  affectedModules: string[];
  safetyNotes: string;
  consultedAt: string;
  status: ClinicalSourceStatus;
}

export interface CalculatorAuditResult {
  calculator: string;
  finding: string;
  risk: string;
  file: string;
  proposedAction: string;
  requiresMedicalReview: boolean;
}
