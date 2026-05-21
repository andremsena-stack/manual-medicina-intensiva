import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "08ad8f4ae3f1334674c2401ef602927decc8431fb84ec79dccc8e9055696c4e1",
  "modulo_02_pos_intubacao_confirmacao.html": "75faf06154a26b4693c27be190f58846420dffd418fa4c4e8f11fa7dce035387",
  "modulo_03_ventilacao_mecanica.html": "d609a55d58555c3ea79670810ab4096df63351aacdca48bf62624b4ec3df71b0",
  "modulo_04_manutencao_sedoanalgesia.html": "c01b370fbdffb5f2f66f375c6ed605b148773aa95ba5999631ecf3c4ecbb0033",
  "modulo_05_drogas_vasoativas.html": "27b73b01dd1885e0b49ebf6027df46710a8095f1d97f6c58c791e3f80178583d",
  "modulo_06_calculadoras_interativas.html": "b480a4b795dce0909c33d49ca1b7a418d4389ef87a0717a425dc4f42aa89a8e4"
};

let failures = 0;

for (const [fileName, expected] of Object.entries(expectedHashes)) {
  const filePath = path.join(moduleDir, fileName);
  const buffer = await readFile(filePath);
  const actual = createHash("sha256").update(buffer).digest("hex");

  if (actual !== expected) {
    failures += 1;
    console.error(`FALHA ${fileName}`);
    console.error(`  esperado: ${expected}`);
    console.error(`  atual:    ${actual}`);
  } else {
    console.log(`OK ${fileName}`);
  }
}

if (failures > 0) {
  console.error("\nIntegridade dos modulos clinicos falhou. Revisar antes de publicar.");
  process.exitCode = 1;
} else {
  console.log("\nIntegridade dos modulos clinicos confirmada.");
}
