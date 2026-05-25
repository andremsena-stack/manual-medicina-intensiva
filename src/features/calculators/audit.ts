import type { CalculatorAuditResult } from "../../types";

export const calculatorAuditResults: CalculatorAuditResult[] = [
  {
    calculator: "Calculadoras legadas em HTML",
    finding: "Calculadoras preservadas dentro dos HTMLs originais e executadas no iframe srcDoc.",
    risk: "Baixo: formulas e constantes clinicas nao foram migradas nem reescritas.",
    file: "src/data/modules/*.html",
    proposedAction: "Manter como fonte canonica no v1; migrar para React apenas apos revisao clinica.",
    requiresMedicalReview: false
  },
  {
    calculator: "Dose versus vazao",
    finding: "Pares conhecidos de dose/vazao recebem bloqueio de interface em tempo de execucao.",
    risk: "Baixo: a camada altera apenas o estado editavel dos campos no iframe, sem mudar formulas.",
    file: "src/utils/iframeSafety.ts",
    proposedAction: "Expandir a lista de pares quando novas calculadoras forem mapeadas.",
    requiresMedicalReview: false
  },
  {
    calculator: "PBW",
    finding: "O modulo de calculadoras ja contem tip educacional de PBW nos HTMLs preservados.",
    risk: "Baixo: nenhuma formula foi alterada.",
    file: "src/data/modules/modulo_07_calculadoras_interativas.html",
    proposedAction: "Manter tip didatica e cobrir formulas nos testes minimos.",
    requiresMedicalReview: false
  }
];
