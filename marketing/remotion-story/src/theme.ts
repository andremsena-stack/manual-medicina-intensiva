// Paleta alinhada ao Manual Virtus (CLAUDE.md secao 5b).
// Tons escuros como base e cyan como acento clinico.

export const palette = {
  ink: "#040d18",
  inkDeep: "#020812",
  navy: "#081726",
  navy2: "#0a1d2e",
  navy3: "#0d2438",
  navy4: "#123c69",
  cyan: "#12bed1",
  cyanBright: "#30f1e6",
  cyanSoft: "rgba(48, 241, 230, 0.18)",
  amber: "#f4b740",
  red: "#ef4444",
  redSoft: "rgba(239, 68, 68, 0.18)",
  green: "#22c55e",
  white: "#f5f9fc",
  whiteDim: "rgba(245, 249, 252, 0.72)",
  whiteFaint: "rgba(245, 249, 252, 0.42)",
} as const;

export const beatColors = {
  hook: {
    bgFrom: palette.ink,
    bgTo: palette.navy3,
    accent: palette.cyanBright,
    text: palette.white,
  },
  problem: {
    bgFrom: "#2a0c10",
    bgTo: "#3a121a",
    accent: palette.red,
    text: palette.white,
  },
  stat: {
    bgFrom: palette.navy2,
    bgTo: palette.navy4,
    accent: palette.amber,
    text: palette.white,
  },
  insight: {
    bgFrom: "#0b1d2e",
    bgTo: "#1a3a5f",
    accent: palette.cyanBright,
    text: palette.white,
  },
  solution: {
    bgFrom: palette.navy,
    bgTo: palette.navy4,
    accent: palette.cyan,
    text: palette.white,
  },
  cta: {
    bgFrom: "#062028",
    bgTo: "#0d2c3a",
    accent: palette.cyanBright,
    text: palette.white,
  },
  logo: {
    bgFrom: palette.inkDeep,
    bgTo: palette.navy3,
    accent: palette.cyanBright,
    text: palette.white,
  },
  // Quiz: paleta mais áspera, com vermelho ativo (queima das alternativas
  // erradas) e cyan-bright como acerto. DNA da marca preservado.
  quiz: {
    bgFrom: palette.ink,
    bgTo: palette.navy3,
    accent: palette.cyanBright,
    wrong: palette.red,
    wrongSoft: palette.redSoft,
    text: palette.white,
  },
} as const;

export const fontStack =
  "'Inter', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
