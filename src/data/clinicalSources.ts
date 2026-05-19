import type { ClinicalSource } from "../types";

export const clinicalSources: ClinicalSource[] = [
  {
    name: "Fontes internas locais",
    scope: "Documentos clinicos originais hospedados fora da PWA, tratados como base local do projeto.",
    affectedModules: ["todos"],
    safetyNotes:
      "Base local referenciada em C:\\Users\\andre\\OneDrive\\Documentos\\New project\\MEDICINA\\GUIA INTENSIVA\\FONTES. Nao copiar, renomear ou alterar sem autorizacao.",
    consultedAt: "2026-05-18",
    status: "fonte interna"
  },
  {
    name: "SCCM PADIS Guidelines 2018",
    link: "https://pubmed.ncbi.nlm.nih.gov/30113379/",
    scope: "Dor, agitacao/sedacao, delirium, imobilidade e sono em UTI adulta.",
    affectedModules: ["sedoanalgesia", "pos-IOT", "ventilacao mecanica"],
    safetyNotes: "Alteracoes clinicas relacionadas a sedacao e delirium exigem revisao medica.",
    consultedAt: "2026-05-18",
    status: "fonte externa"
  },
  {
    name: "SCCM Focused Update PADIS 2025",
    link: "https://pubmed.ncbi.nlm.nih.gov/39982143/",
    scope: "Atualizacao focada de dor, ansiedade, sedacao, delirium, mobilidade e sono.",
    affectedModules: ["sedoanalgesia", "delirium", "mobilidade", "sono"],
    safetyNotes: "Nao aplicar mudancas de recomendacao automaticamente.",
    consultedAt: "2026-05-18",
    status: "fonte externa"
  },
  {
    name: "Difficult Airway Society - Tracheal Intubation in Critically Ill Adults",
    link: "https://pubmed.ncbi.nlm.nih.gov/29406182/",
    scope: "Intubacao traqueal no paciente critico, pre-oxigenacao e seguranca peri-IOT.",
    affectedModules: ["IOT", "via aerea dificil", "checklist de intubacao"],
    safetyNotes: "Mudancas em algoritmo de via aerea requerem revisao medica.",
    consultedAt: "2026-05-18",
    status: "fonte externa"
  },
  {
    name: "American Heart Association - CPR and ECC Guidelines 2025",
    link: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines",
    scope: "BLS, ACLS, parada cardiorrespiratoria e cuidados pos-PCR.",
    affectedModules: ["PCR", "ACLS", "pos-PCR", "drogas em parada"],
    safetyNotes: "Nao alterar algoritmos de PCR sem revisao medica.",
    consultedAt: "2026-05-18",
    status: "fonte externa"
  },
  {
    name: "ESICM - Circulatory Shock and Hemodynamic Monitoring 2025",
    link: "https://pubmed.ncbi.nlm.nih.gov/41236566/",
    scope: "Choque, monitorizacao hemodinamica, perfusao, lactato e responsividade a fluidos.",
    affectedModules: ["choque", "drogas vasoativas", "hemodinamica"],
    safetyNotes: "Divergencias com fontes internas devem ser sinalizadas, nao corrigidas automaticamente.",
    consultedAt: "2026-05-18",
    status: "fonte externa"
  }
];
