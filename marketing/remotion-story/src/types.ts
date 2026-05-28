export type BeatType =
  | "hook"
  | "problem"
  | "stat"
  | "insight"
  | "solution"
  | "cta"
  | "logo"
  | "quiz";

export type TransitionKind =
  | "fade"
  | "slide-up"
  | "slide-left"
  | "wipe"
  | "flip"
  | "clock"
  | "iris";

interface BaseBeat<T extends BeatType, P> {
  type: T;
  durationInFrames: number;
  transitionIn?: TransitionKind;
  payload: P;
}

export type HookBeat = BaseBeat<
  "hook",
  {
    eyebrow?: string;
    line1: string;
    line2?: string;
    accentWord?: string;
  }
>;

export type ProblemBeat = BaseBeat<
  "problem",
  {
    title: string;
    bullets: string[];
  }
>;

export type StatBeat = BaseBeat<
  "stat",
  {
    value: string;
    unit?: string;
    caption: string;
    source?: string;
  }
>;

export type InsightBeat = BaseBeat<
  "insight",
  {
    eyebrow?: string;
    quote: string;
    attribution?: string;
  }
>;

export type CalcScenario =
  | "noradrenalina"
  | "iot-rsi"
  | "reposicao-sodio";

export type SolutionBeat = BaseBeat<
  "solution",
  {
    title: string;
    subtitle?: string;
    mode: "module-grid" | "calculator-demo";
    highlightModuleId?: number;
    // Aplica apenas quando mode === "calculator-demo"
    calcScenario?: CalcScenario;
  }
>;

export interface PriceTier {
  label: string; // "Mensal" / "Trimestral" / "Anual"
  price: string; // "R$ 39,90" (string para preservar formatacao)
  caption?: string; // "/mes" / "equivalente a R$ X/mes" / "12x sem juros"
  highlight?: boolean; // destaque visual
}

export type CtaBeat = BaseBeat<
  "cta",
  {
    headline: string;
    // Preco unico em destaque (ex.: "R$ 25,99")
    price?: string;
    // Pequeno texto acima do preco (ex.: "A partir de")
    priceCaption?: string;
    // Sufixo menor ao lado do preco (ex.: "/mes")
    pricePeriod?: string;
    // Modo alternativo: ate 3 planos lado-a-lado
    tiers?: PriceTier[];
    button: string;
    handle?: string;
  }
>;

export type LogoBeat = BaseBeat<
  "logo",
  {
    tagline?: string;
  }
>;

export interface QuizOption {
  // Texto curto da alternativa (ex.: "12 mg", "7,5 mL/h", "R3: passa o dado").
  label: string;
  // Marca a alternativa correta — única que sobrevive ao reveal.
  correct?: boolean;
}

export type QuizBeat = BaseBeat<
  "quiz",
  {
    // Pergunta no topo. Curta — uma linha de até ~70 caracteres.
    question: string;
    // Sub-pergunta opcional na linha de baixo (ex.: dados clínicos).
    subquestion?: string;
    // 2 a 4 alternativas. Exatamente uma deve ter correct: true.
    options: QuizOption[];
    // Frame em que as alternativas erradas começam a queimar.
    // Default: 55% da durationInFrames do beat (calculado no componente).
    revealAtFrame?: number;
    // Linha de rodapé pequena — geralmente o "spoiler" leve ou a referência.
    footnote?: string;
  }
>;

export type Beat =
  | HookBeat
  | ProblemBeat
  | StatBeat
  | InsightBeat
  | SolutionBeat
  | CtaBeat
  | LogoBeat
  | QuizBeat;

export interface StoryVideoProps {
  beats: Beat[];
}
