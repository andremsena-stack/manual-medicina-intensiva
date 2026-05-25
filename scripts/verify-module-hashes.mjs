import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "cf4d07d8f4d2b395347de1c6e7a4ee6d66ee14f2308359efca5823a93bfb1e33",
  "modulo_02_pos_intubacao_confirmacao.html": "afa5be1afd59c6ccc3e1259a2c04259feb5547d0e1e98b43dd007af82d67b80e",
  "modulo_03_ventilacao_mecanica.html": "5250c4442c9f31727a6ea4983aeacd1b45199b02d899d0e6c6780d96e8d7223e",
  "modulo_04_manutencao_sedoanalgesia.html": "16aa3ad956ec40bf8f2210449f3b8da27fa658e8186267cfb1c8aceb41e9e9ce",
  "modulo_05_drogas_vasoativas.html": "f1aca64d33da7a0f1cb9fe82b0e4471f0169b237221ec08b357e9430aa85675a",
  "modulo_06_disturbios_hidroeletroliticos.html": "0d4e984122bcfe650ac2672b3ee0afdd3e2567aff4881d9198702dad137440db",
  "modulo_07_calculadoras_interativas.html": "91ee212fd31f840cc878d36e11884ddca2b28c699664061f46655bb4eed98ab8",
  "modulo_08_referencias.html": "2b5ab7186a4ec7d2b3e3f2ee0034d2b68eee0b2ac0d4e56c5e99bd6631bbb532"
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
