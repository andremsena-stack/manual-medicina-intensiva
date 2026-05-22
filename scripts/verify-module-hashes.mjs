import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "ba6f02e5c99c2902ccaead7a27b6d31f7cab8b31db427f8c0a5b20e19a5eb1ef",
  "modulo_02_pos_intubacao_confirmacao.html": "9d20f129cf31bca24c8bc5319aced3d43b7c2e8b0ffc0260f0f064494b1cfe70",
  "modulo_03_ventilacao_mecanica.html": "5250c4442c9f31727a6ea4983aeacd1b45199b02d899d0e6c6780d96e8d7223e",
  "modulo_04_manutencao_sedoanalgesia.html": "ba3bdd0941e78dc603f2948a6ea212d60ba5d11abe37a68052ec0fc5adb28bd3",
  "modulo_05_drogas_vasoativas.html": "a5bf4307858b9c45ac27feb16a72cb362ddf354457d69ff3e751f7a7cc7b5e06",
  "modulo_06_calculadoras_interativas.html": "31ca0ec701b54de00ccb20d62aa0d76a28d553aac72282e4853fe2b51a015f38",
  "modulo_07_referencias.html": "536529f10f84f1791ee30f2a1f42095c3001a15da44fc0597a9c5df84b403ecc"
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
