import React from "react";
import { palette } from "../../theme";

// Símbolos SVG inline genéricos — não copiam logos de terceiros.
// Cada um representa visualmente um app clínico que o usuário usa hoje.
// Reutilizado pelo grid 2D (AppIconsScene) e pela textura do iPhone 3D.

const SymHeart = () => (
  <path d="M50 86 L18 54 C8 44 8 28 18 18 C28 8 44 8 54 18 L50 22 L46 18 C56 8 72 8 82 18 C92 28 92 44 82 54 Z" />
);
const SymBolt = () => (
  <path d="M58 8 L26 56 L46 56 L38 92 L72 42 L52 42 Z" />
);
const SymMoon = () => (
  <path d="M68 14 C46 14 28 32 28 54 C28 76 46 94 68 94 C58 88 50 76 50 62 C50 38 58 22 68 14 Z" />
);
const SymShield = () => (
  <path d="M50 8 L18 22 V52 C18 72 32 86 50 96 C68 86 82 72 82 52 V22 Z" />
);
const SymGauge = () => (
  <g>
    <path d="M50 18 C28 18 12 36 12 58 H22 C22 42 34 28 50 28 C66 28 78 42 78 58 H88 C88 36 72 18 50 18 Z" />
    <rect x="48" y="32" width="4" height="30" transform="rotate(48 50 58)" />
    <circle cx="50" cy="58" r="6" />
  </g>
);
const SymBaby = () => (
  <g>
    <circle cx="50" cy="46" r="28" />
    <circle cx="40" cy="44" r="3.5" fill={palette.navy} />
    <circle cx="60" cy="44" r="3.5" fill={palette.navy} />
    <path d="M40 56 Q50 64 60 56" stroke={palette.navy} strokeWidth="3" fill="none" />
  </g>
);
const SymDrop = () => (
  <path d="M50 10 C36 32 22 50 22 68 C22 84 35 96 50 96 C65 96 78 84 78 68 C78 50 64 32 50 10 Z" />
);
const SymBook = () => (
  <g>
    <path d="M16 22 H46 C50 22 52 24 52 28 V88 C52 84 50 82 46 82 H16 Z" />
    <path d="M84 22 H54 C50 22 48 24 48 28 V88 C48 84 50 82 54 82 H84 Z" />
  </g>
);
const SymSyringe = () => (
  <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none">
    <line x1="20" y1="80" x2="60" y2="40" />
    <line x1="14" y1="86" x2="22" y2="78" />
    <rect x="58" y="30" width="22" height="22" rx="3" transform="rotate(45 69 41)" fill="currentColor" />
    <line x1="80" y1="20" x2="92" y2="8" />
  </g>
);

export interface AppIconSpec {
  label: string;
  bg: string;
  bgEnd: string;
  symbolColor: string;
  symbol: React.ReactNode;
  /** Glyph 1-letter pra renderizacao em Canvas 2D (textura do iPhone 3D),
   * onde renderizar SVG paths daria muito trabalho. */
  glyph: string;
}

export const ICONS: AppIconSpec[] = [
  {
    label: "CTI",
    bg: "#3a1620",
    bgEnd: "#5a1c2c",
    symbolColor: "#ff6b6b",
    symbol: <SymHeart />,
    glyph: "♥",
  },
  {
    label: "Arritmias",
    bg: "#3a2a0a",
    bgEnd: "#5a4012",
    symbolColor: palette.amber,
    symbol: <SymBolt />,
    glyph: "⚡",
  },
  {
    label: "Sedoanalgesia",
    bg: "#1f1a3a",
    bgEnd: "#332a5a",
    symbolColor: "#b39bff",
    symbol: <SymMoon />,
    glyph: "☾",
  },
  {
    label: "Antibióticos",
    bg: "#0d2a1a",
    bgEnd: "#16432b",
    symbolColor: palette.green,
    symbol: <SymShield />,
    glyph: "⛨",
  },
  {
    label: "Cálculo",
    bg: palette.navy2,
    bgEnd: palette.navy4,
    symbolColor: palette.cyanBright,
    symbol: <SymGauge />,
    glyph: "ƒ",
  },
  {
    label: "Pediatria",
    bg: "#3a1830",
    bgEnd: "#5a2448",
    symbolColor: "#ffb3d1",
    symbol: <SymBaby />,
    glyph: "☺",
  },
  {
    label: "Diluições",
    bg: "#0a2a36",
    bgEnd: "#114658",
    symbolColor: palette.cyan,
    symbol: <SymDrop />,
    glyph: "💧",
  },
  {
    label: "Distúrbios hidroeletroliticos",
    bg: "#3a1418",
    bgEnd: "#5a1c22",
    symbolColor: "#ff8a8a",
    symbol: <SymBook />,
    glyph: "Na",
  },
  {
    label: "DVA",
    bg: "#2a0c10",
    bgEnd: "#3a121a",
    symbolColor: palette.red,
    symbol: <SymSyringe />,
    glyph: "⚕",
  },
];
