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
  "modulo_04_manutencao_sedoanalgesia.html": "35d9620e61fefe1c291398860a39fb37d21f2df2d397d389afa0b123f27330f1",
  "modulo_05_drogas_vasoativas.html": "6af9dc2b1017c5109ca3976f1b9d18d11469e7748f59765412e198ab435e064d",
  "modulo_06_calculadoras_interativas.html": "c368da8cf02aa4a51734ea6ce7cbb43aa23b150660130192e8fbb59f46b182e5",
  "modulo_07_referencias.html": "9ce3ba35cc56e2bcd1ab00752c1de3ed2045827151b4d4efe6f5923db8e3eda9"
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
