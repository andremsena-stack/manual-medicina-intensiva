import type { ModuleSource } from "../types";

import modulo01 from "./modules/modulo_01_via_aerea_iot.html?raw";
import modulo02 from "./modules/modulo_02_pos_intubacao_confirmacao.html?raw";
import modulo03 from "./modules/modulo_03_ventilacao_mecanica.html?raw";
import modulo04 from "./modules/modulo_04_manutencao_sedoanalgesia.html?raw";
import modulo05 from "./modules/modulo_05_drogas_vasoativas.html?raw";
import modulo06 from "./modules/modulo_06_calculadoras_interativas.html?raw";
import modulo07 from "./modules/modulo_07_referencias.html?raw";

export const moduleSources: ModuleSource[] = [
  {
    id: "modulo-01",
    number: 1,
    title: "Via aérea e intubação orotraqueal",
    fileName: "modulo_01_via_aerea_iot.html",
    html: modulo01
  },
  {
    id: "modulo-02",
    number: 2,
    title: "Pós-intubação e confirmação",
    fileName: "modulo_02_pos_intubacao_confirmacao.html",
    html: modulo02
  },
  {
    id: "modulo-03",
    number: 3,
    title: "Ventilação mecânica invasiva",
    fileName: "modulo_03_ventilacao_mecanica.html",
    html: modulo03
  },
  {
    id: "modulo-04",
    number: 4,
    title: "Manutenção de sedoanalgesia em UTI",
    fileName: "modulo_04_manutencao_sedoanalgesia.html",
    html: modulo04
  },
  {
    id: "modulo-05",
    number: 5,
    title: "Drogas vasoativas em medicina intensiva",
    fileName: "modulo_05_drogas_vasoativas.html",
    html: modulo05
  },
  {
    id: "modulo-06",
    number: 6,
    title: "Calculadoras interativas",
    fileName: "modulo_06_calculadoras_interativas.html",
    html: modulo06
  },
  {
    id: "modulo-07",
    number: 7,
    title: "Referências consolidadas",
    fileName: "modulo_07_referencias.html",
    html: modulo07
  }
];
