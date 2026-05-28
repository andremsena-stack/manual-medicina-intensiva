import type { Beat } from "./types";

// Variantes de roteiro, todas reaproveitando os mesmos 7 tipos de beats.
// Otimizadas para Ads no Instagram (lead capture).
// Regras:
//   - Assinatura mensal/trimestral/anual. Anual diluído = R$ 25,99/mês.
//   - Sem atribuição de autoria a intensivistas ou entidades.
//   - Prova vem do Módulo 8 (Referências consolidadas).

const ENTRY_PRICE = {
  priceCaption: "Planos a partir de",
  price: "R$ 25,99",
  pricePeriod: "/mês",
};

// ---------- Foco: Módulo 5 — Drogas vasoativas ----------
export const vasoativasBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Choque",
      line1: "PAM caiu pra 52.",
      accentWord: "Quanto de nora?",
      line2: "Sem planilha. Sem decoreba.",
    },
  },
  {
    type: "problem",
    durationInFrames: 115,
    transitionIn: "slide-up",
    payload: {
      title: "Aminas: onde se erra mais",
      bullets: [
        "Concentração diferente em cada bag",
        "Conversão mcg/kg/min vs mL/h",
        "Esquecer de checar o peso real",
      ],
    },
  },
  {
    type: "solution",
    durationInFrames: 155,
    transitionIn: "iris",
    payload: {
      title: "Módulo 5: titulação sem planilha.",
      subtitle: "Nora, adrena, vasopressina, dobuta.",
      mode: "calculator-demo",
      calcScenario: "noradrenalina",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Vasoativos sem planilha." },
  },
];

// ---------- Foco: Módulo 7 — Calculadoras ----------
export const calculadorasBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Beira do leito",
      line1: "Abre o ChatGPT pra calcular dose?",
      accentWord: "Não precisa.",
    },
  },
  {
    type: "stat",
    durationInFrames: 105,
    transitionIn: "clock",
    payload: {
      value: "22",
      caption:
        "calculadoras com checagem dimensional. Todas no Módulo 7.",
    },
  },
  {
    type: "solution",
    durationInFrames: 120,
    transitionIn: "iris",
    payload: {
      title: "Vasoativos: dose → mL/h.",
      subtitle: "Sem decoreba.",
      mode: "calculator-demo",
      calcScenario: "noradrenalina",
    },
  },
  {
    type: "solution",
    durationInFrames: 120,
    transitionIn: "slide-left",
    payload: {
      title: "Sequência rápida de IOT.",
      subtitle: "Doses dos fármacos por peso.",
      mode: "calculator-demo",
      calcScenario: "iot-rsi",
    },
  },
  {
    type: "solution",
    durationInFrames: 120,
    transitionIn: "slide-left",
    payload: {
      title: "Reposição de sódio na hipo.",
      subtitle: "NaCl 3 % por Adrogue-Madias.",
      mode: "calculator-demo",
      calcScenario: "reposicao-sodio",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Decisão clínica afiada." },
  },
];

// ---------- Foco: Módulo 1 — Via aérea e IOT ----------
export const viaAereaBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Sala de emergência",
      line1: "IOT em 60 segundos.",
      accentWord: "Sem hesitar.",
    },
  },
  {
    type: "problem",
    durationInFrames: 110,
    transitionIn: "slide-up",
    payload: {
      title: "O que falta nas crises",
      bullets: [
        "Sequência rápida na ponta da língua",
        "Dose por peso, sem erro",
        "Plano B antes do plano A falhar",
      ],
    },
  },
  {
    type: "solution",
    durationInFrames: 155,
    transitionIn: "iris",
    payload: {
      title: "Módulo 1: sequência rápida pronta.",
      subtitle: "Etomidato, fentanil, succinilcolina por peso.",
      mode: "calculator-demo",
      calcScenario: "iot-rsi",
    },
  },
  {
    type: "insight",
    durationInFrames: 105,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Módulo 8 / Referências",
      quote: "Algoritmos com referências primárias consolidadas.",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Pra quando o paciente não espera." },
  },
];

// ---------- Foco: Módulo 2 — Pós-IOT e confirmação ----------
export const posIotBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Pós-intubação",
      line1: "Você intubou.",
      accentWord: "E agora?",
      line2: "Capnografia, RX, parâmetros. Em ordem.",
    },
  },
  {
    type: "problem",
    durationInFrames: 110,
    transitionIn: "slide-up",
    payload: {
      title: "O que não pode esquecer",
      bullets: [
        "Confirmar tubo na traqueia",
        "Ajustar Vt, FR, FiO₂ e PEEP",
        "Sedoanalgesia contínua e BNM se preciso",
      ],
    },
  },
  {
    type: "solution",
    durationInFrames: 150,
    transitionIn: "iris",
    payload: {
      title: "Módulo 2: confirmação e parâmetros iniciais.",
      subtitle: "Checklist + valores de partida.",
      mode: "module-grid",
      highlightModuleId: 2,
    },
  },
  {
    type: "insight",
    durationInFrames: 105,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Módulo 8 / Referências",
      quote: "Cada checklist com a referência primária consolidada.",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Cada minuto pós-IOT no controle." },
  },
];

// ---------- Foco: Módulo 4 — Sedoanalgesia ----------
export const sedoanalgesiaBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Sedoanalgesia",
      line1: "RASS −4 o dia inteiro?",
      accentWord: "Não precisa.",
    },
  },
  {
    type: "problem",
    durationInFrames: 105,
    transitionIn: "slide-up",
    payload: {
      title: "Onde a sedação trava",
      bullets: [
        "Doses de fentanil + midazolam de cabeça",
        "Reconhecer delirium hipoativo",
        "Trocar pra dexme sem rebote",
      ],
    },
  },
  {
    type: "solution",
    durationInFrames: 150,
    transitionIn: "iris",
    payload: {
      title: "Módulo 4: titulação por meta RASS.",
      subtitle: "Doses, conversão e manejo de delirium.",
      mode: "module-grid",
      highlightModuleId: 4,
    },
  },
  {
    type: "insight",
    durationInFrames: 105,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Módulo 8 / Referências",
      quote: "Estratégia com PADIS e ABCDEF bundle consolidados.",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Sedação na meta. Sem chute." },
  },
];

// ---------- Foco: Módulo 6 — Distúrbios hidroeletrolíticos ----------
export const hidroeletroliticosBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 85,
    payload: {
      eyebrow: "Hidroeletrolíticos",
      line1: "Na⁺ 122. Paciente sonolento.",
      accentWord: "Quanto de NaCl 3 %?",
    },
  },
  {
    type: "solution",
    durationInFrames: 155,
    transitionIn: "iris",
    payload: {
      title: "Módulo 6: reposição de sódio.",
      subtitle: "Adrogue-Madias e vazão sugerida em uma tela.",
      mode: "calculator-demo",
      calcScenario: "reposicao-sodio",
    },
  },
  {
    type: "problem",
    durationInFrames: 105,
    transitionIn: "slide-up",
    payload: {
      title: "Os cálculos que estressam",
      bullets: [
        "Reposição de Na⁺ por Adrogue-Madias",
        "Limites de correção em 24 h",
        "K⁺ em BIC com segurança",
      ],
    },
  },
  {
    type: "insight",
    durationInFrames: 105,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Módulo 8 / Referências",
      quote: "Limites de correção com referência primária consolidada.",
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
    durationInFrames: 75,
    transitionIn: "iris",
    payload: { tagline: "Correção no ritmo certo." },
  },
];

// ---------- Quiz Sério (~26 s) — tom técnico para intensivista veterano ----------
// Hook clínico direto + quiz de cálculo de noradrenalina + demo + CTA.
// Cálculo:
//   Dose = 0,1 mcg/kg/min × 80 kg = 8 mcg/min = 480 mcg/h
//   Concentração = 16 mg / 250 mL = 64 mcg/mL
//   mL/h = 480 / 64 = 7,5 mL/h  (alternativa B)
// As alternativas erradas (6 e 9 mL/h) são vizinhos numéricos plausíveis.
export const quizSerioBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 80,
    payload: {
      eyebrow: "Beira do leito",
      line1: "Sem ChatGPT.",
      accentWord: "Sem planilha.",
      line2: "Sem decoreba.",
    },
  },
  {
    type: "quiz",
    durationInFrames: 220,
    transitionIn: "iris",
    payload: {
      question: "Nora 0,1 mcg/kg/min. Quantos mL/h?",
      subquestion: "80 kg · 16 mg em 250 mL SF 0,9 %",
      options: [
        { label: "6 mL/h" },
        { label: "7,5 mL/h", correct: true },
        { label: "9 mL/h" },
      ],
      footnote: "Cada cálculo aponta para a referência primária (Módulo 8).",
    },
  },
  {
    type: "solution",
    durationInFrames: 130,
    transitionIn: "slide-left",
    payload: {
      title: "Módulo 5: titulação sem planilha.",
      subtitle: "Dose alvo → mL/h em 3 toques.",
      mode: "calculator-demo",
      calcScenario: "noradrenalina",
    },
  },
  {
    type: "insight",
    durationInFrames: 100,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Manual Virtus",
      quote: "Decisão clínica afiada. Em segundos.",
    },
  },
  {
    type: "cta",
    durationInFrames: 120,
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
    durationInFrames: 60,
    transitionIn: "iris",
    payload: { tagline: "Manual de Medicina Intensiva." },
  },
];

// ---------- Quiz Leve (~26 s) — tom cotidiano para residente ----------
// Hook R1 vs R3 + quiz de etomidato + insight bem-humorado + demo IOT + CTA.
// Cálculo: Etomidato 0,3 mg/kg × 80 kg = 24 mg (alternativa B).
export const quizLeveBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 80,
    payload: {
      eyebrow: "Sala de emergência",
      line1: "R1 vai fazer a conta.",
      accentWord: "R3 já abriu o app.",
    },
  },
  {
    type: "quiz",
    durationInFrames: 220,
    transitionIn: "iris",
    payload: {
      question: "Etomidato para IOT. Quantos mg?",
      subquestion: "0,3 mg/kg · paciente 80 kg",
      options: [
        { label: "18 mg" },
        { label: "24 mg", correct: true },
        { label: "30 mg" },
      ],
      footnote: "Spoiler: o R3 também não lembrou de cabeça.",
    },
  },
  {
    type: "insight",
    durationInFrames: 95,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Diferença real",
      quote: "Quem sabe onde achar > quem decora.",
    },
  },
  {
    type: "solution",
    durationInFrames: 130,
    transitionIn: "slide-left",
    payload: {
      title: "Módulo 1: sequência rápida.",
      subtitle: "Etomidato, fentanil, succi — doses por peso.",
      mode: "calculator-demo",
      calcScenario: "iot-rsi",
    },
  },
  {
    type: "cta",
    durationInFrames: 120,
    transitionIn: "flip",
    payload: {
      headline: "Manual no bolso.",
      ...ENTRY_PRICE,
      button: "Assinar agora",
      handle: "manualvirtus.com.br",
    },
  },
  {
    type: "logo",
    durationInFrames: 60,
    transitionIn: "iris",
    payload: { tagline: "Pra quando o plantão não espera." },
  },
];

// ---------- Reel de lançamento (~30 s) para post no feed/Reels ----------
// Roteiro de venda direta: ancorado no plantão de madrugada.
// Estrutura: hook (03:47) → dor (PDFs) → pivô (Virtus) → demo dose →
// "offline" → depoimento Sala Vermelha → CTA assinatura → assinatura visual.
// Duração-alvo: ~30 s a 30 fps (≈ 900 frames com transições).
export const reelLancamentoBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 75,
    payload: {
      eyebrow: "Plantão noturno",
      line1: "03:47.",
      accentWord: "Dose certa, agora.",
    },
  },
  {
    type: "problem",
    durationInFrames: 105,
    transitionIn: "slide-up",
    payload: {
      title: "6 PDFs abertos. De novo.",
      bullets: [
        "Protocolo de sepse num PDF",
        "Tabela de noradrenalina noutro",
        "Clearance num terceiro",
        "Surviving Sepsis num quarto",
      ],
    },
  },
  {
    type: "insight",
    durationInFrames: 70,
    transitionIn: "iris",
    payload: {
      eyebrow: "Ou.",
      quote: "Abre só o Virtus.",
    },
  },
  {
    type: "solution",
    durationInFrames: 130,
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
    durationInFrames: 125,
    transitionIn: "slide-left",
    payload: {
      title: "Funciona offline.",
      subtitle: "Onde o sinal não chega, ele chega.",
      mode: "module-grid",
      highlightModuleId: 3,
    },
  },
  {
    type: "insight",
    durationInFrames: 120,
    transitionIn: "wipe",
    payload: {
      eyebrow: "Quem já usa",
      quote:
        "Substituiu meus pdfs. Por um clique. Me ajudou no plantão da Sala Vermelha.",
      attribution: "— Dr. MB",
    },
  },
  {
    type: "cta",
    durationInFrames: 120,
    transitionIn: "flip",
    payload: {
      headline: "Manual no bolso.",
      ...ENTRY_PRICE,
      button: "Assinar agora",
      handle: "manualvirtus.com.br",
    },
  },
  {
    type: "logo",
    durationInFrames: 60,
    transitionIn: "iris",
    payload: { tagline: "Manual de Medicina Intensiva." },
  },
];

// ---------- Variante curta (~16 s) para Ads de conversão ----------
export const shortAdBeats: Beat[] = [
  {
    type: "hook",
    durationInFrames: 70,
    payload: {
      eyebrow: "Manual Virtus",
      line1: "Você decide em segundos.",
      accentWord: "A gente entrega em segundos.",
    },
  },
  {
    type: "solution",
    durationInFrames: 95,
    transitionIn: "iris",
    payload: {
      title: "8 módulos. 22 calculadoras.",
      subtitle: "Otimizado pra UTI.",
      mode: "module-grid",
      highlightModuleId: 7,
    },
  },
  {
    type: "solution",
    durationInFrames: 95,
    transitionIn: "slide-left",
    payload: {
      title: "Dose → mL/h em 3 toques.",
      mode: "calculator-demo",
      calcScenario: "noradrenalina",
    },
  },
  {
    type: "cta",
    durationInFrames: 130,
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
    durationInFrames: 65,
    transitionIn: "iris",
    payload: { tagline: "Manual Virtus / Clinical Tools" },
  },
];
