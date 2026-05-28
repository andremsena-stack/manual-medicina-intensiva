import type { Beat } from "./types";

// Roteiro principal otimizado para Ads de captação de leads no Instagram.
// Estrutura: gancho → dor → showcase → 3 calculadoras em sequência → prova
// (Módulo 8 / Referências) → CTA com preço de entrada → assinatura visual.
// Duração-alvo: ~32 s.

const ENTRY_PRICE = {
  priceCaption: "Planos a partir de",
  price: "R$ 25,99",
  pricePeriod: "/mês",
};

export const defaultBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 80,
    payload: {
      eyebrow: "Beira do leito",
      line1: "Você tem 90 segundos.",
      accentWord: "Acertar a dose.",
      line2: "Sem buscar fórmula no Google.",
    },
  },
  {
    type: "problem",
    durationInFrames: 115,
    transitionIn: "slide-up",
    payload: {
      title: "O que rouba seu tempo na UTI",
      bullets: [
        "Procurar fórmula no celular",
        "Converter mcg/kg/min em mL/h",
        "Cruzar bula com protocolo",
      ],
    },
  },
  {
    type: "solution",
    durationInFrames: 110,
    transitionIn: "iris",
    payload: {
      title: "8 módulos. 22 calculadoras. Um toque.",
      subtitle: "Da via aérea aos distúrbios hidroeletrolíticos.",
      mode: "module-grid",
      highlightModuleId: 7,
    },
  },
  {
    type: "solution",
    durationInFrames: 110,
    transitionIn: "slide-left",
    payload: {
      title: "Vasoativos sem planilha.",
      subtitle: "Dose alvo → mL/h em 3 toques.",
      mode: "calculator-demo",
      calcScenario: "noradrenalina",
    },
  },
  {
    type: "solution",
    durationInFrames: 115,
    transitionIn: "slide-left",
    payload: {
      title: "Sequência rápida de intubação.",
      subtitle: "Doses por peso, prontas para puxar.",
      mode: "calculator-demo",
      calcScenario: "iot-rsi",
    },
  },
  {
    type: "solution",
    durationInFrames: 115,
    transitionIn: "slide-left",
    payload: {
      title: "Reposição de sódio sem decoreba.",
      subtitle: "Adrogue-Madias e vazão de NaCl 3 % em uma tela.",
      mode: "calculator-demo",
      calcScenario: "reposicao-sodio",
    },
  },
  {
    type: "insight",
    durationInFrames: 105,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Módulo 8 / Referências",
      quote:
        "Cada cálculo aponta para a referência primária. Tudo consolidado.",
    },
  },
  {
    type: "cta",
    durationInFrames: 135,
    transitionIn: "flip",
    payload: {
      headline: "Tenha o Manual no bolso.",
      ...ENTRY_PRICE,
      button: "Assinar agora",
      handle: "manualvirtus.com.br",
    },
  },
  {
    type: "logo",
    durationInFrames: 80,
    transitionIn: "iris",
    payload: {
      tagline: "Decisão clínica afiada. Em segundos.",
    },
  },
];
