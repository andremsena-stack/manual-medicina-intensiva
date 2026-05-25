import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "ba6f02e5c99c2902ccaead7a27b6d31f7cab8b31db427f8c0a5b20e19a5eb1ef",
  "modulo_02_pos_intubacao_confirmacao.html": "cc0c94dcc2147c0118c7f7fbb147cd862f0b6f466adf032b4e9cb86a10303392",
  "modulo_03_ventilacao_mecanica.html": "5250c4442c9f31727a6ea4983aeacd1b45199b02d899d0e6c6780d96e8d7223e",
  "modulo_04_manutencao_sedoanalgesia.html": "16aa3ad956ec40bf8f2210449f3b8da27fa658e8186267cfb1c8aceb41e9e9ce",
  "modulo_05_drogas_vasoativas.html": "f1aca64d33da7a0f1cb9fe82b0e4471f0169b237221ec08b357e9430aa85675a",
  "modulo_06_disturbios_hidroeletroliticos.html": "0d4e984122bcfe650ac2672b3ee0afdd3e2567aff4881d9198702dad137440db",
  "modulo_07_calculadoras_interativas.html": "4fb7f14f2f3ccccf33b09ac9617e87de10988a784be0130185f0f1ee6e3e0f49",
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
