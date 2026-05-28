import type { ReactElement } from "react";

export interface ModuleEntry {
  id: number;
  label: string;
  title: string;
  family: "clinico" | "calc" | "ref";
  icon: ReactElement;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const modules: ModuleEntry[] = [
  {
    id: 1,
    label: "MODULO 1",
    title: "Via aerea & IOT",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M5 8h7l4 4-4 4H5z" />
        <path d="M12 8v8" />
        <circle cx="18.5" cy="12" r="2.2" />
        <path d="M3 12h2" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "MODULO 2",
    title: "Pos-IOT & confirmacao",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M9 3v6c0 1.5-1 2.5-1 4s1 2.5 1 4v4" />
        <path d="M13 3v6c0 1.5 1 2.5 1 4s-1 2.5-1 4v4" />
        <path d="M9 7h4M9 11h4M9 15h4M9 19h4" />
        <path d="M17 12l1.6 1.6L21 11" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "MODULO 3",
    title: "Ventilacao mecanica",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 4v8" />
        <path d="M12 6c-1.5-2-4-2-5.5-.5C5 7 5 9.5 6 12c1 2.5 2 4 4 5 1 .5 2 0 2-1V6z" />
        <path d="M12 6c1.5-2 4-2 5.5-.5 1.5 1.5 1.5 4 .5 6.5-1 2.5-2 4-4 5-1 .5-2 0-2-1V6z" />
        <path d="M3 19c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "MODULO 4",
    title: "Sedoanalgesia",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="9" width="14" height="6" rx="3" />
        <path d="M10 9v6" />
        <path d="M17 12h1l1.5-1.5L21 13l-1.5 1.5L21 16" />
      </svg>
    ),
  },
  {
    id: 5,
    label: "MODULO 5",
    title: "Drogas vasoativas",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M3 12h3l2-4 3 8 2-5 1.5 3H21" />
        <path d="M12 19c-2-1.5-5-3.5-6.5-6C4 10.5 5 7 8 7c1.5 0 3 1 4 2.5C13 8 14.5 7 16 7c3 0 4 3.5 2.5 6-.6 1-1.6 2-2.7 2.8" />
      </svg>
    ),
  },
  {
    id: 6,
    label: "MODULO 6",
    title: "Hidroeletroliticos",
    family: "clinico",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3c-2 4-5 7-5 11a5 5 0 0010 0c0-4-3-7-5-11z" />
        <path d="M9 13h6M12 10v6" />
      </svg>
    ),
  },
  {
    id: 7,
    label: "MODULO 7",
    title: "Calculadoras",
    family: "calc",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="5" y="3" width="14" height="18" rx="2.5" />
        <rect x="7.5" y="5.5" width="9" height="3.5" rx="1" />
        <circle cx="9" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="9" cy="17" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="15" cy="17" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 8,
    label: "MODULO 8",
    title: "Referencias",
    family: "ref",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M3 5c2.5-1 5.5-1 9 1v13c-3.5-2-6.5-2-9-1z" />
        <path d="M21 5c-2.5-1-5.5-1-9 1v13c3.5-2 6.5-2 9-1z" />
        <path d="M12 6v13" />
      </svg>
    ),
  },
];
