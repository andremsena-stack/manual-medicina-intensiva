import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "bf4ced96cef67ad9dbebccc59ebfadb8a7b24f9e0c9339e99df053cc2d890fa0",
  "modulo_02_pos_intubacao_confirmacao.html": "cb7d2b528c8a4d04964cc94db3d6d07f683c4e7305c3d728d0af846eec0eb93c",
  "modulo_03_ventilacao_mecanica.html": "963723674b772d1f5b9b37e7b5013841249b18a80299e27bc6b92019cc40c978",
  "modulo_04_manutencao_sedoanalgesia.html": "982fbbe39c1fabbdde337f61ef58413b06de408b0479a996fbf1d9076d57e7d0",
  "modulo_05_drogas_vasoativas.html": "177facdfba05bca28746d389445741ab2bc022052bcb71d6f4fa866966e68837",
  "modulo_06_disturbios_hidroeletroliticos.html": "e6e4733f0e3eebf5bba230099d11f7ed9e8718ac551ec2294af45e8ac8f4417e",
  "modulo_07_calculadoras_interativas.html": "b8da57601f948cbf7d8c8e559c453641c594ea555396c3bcea8f098a47f1b4bb",
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
