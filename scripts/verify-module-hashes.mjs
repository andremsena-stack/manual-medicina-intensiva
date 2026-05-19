import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleDir = path.join(rootDir, "src", "data", "modules");

const expectedHashes = {
  "modulo_01_via_aerea_iot.html": "72c64855b1766a9e6331d032d1c6d17d7891e530b54deb211752e6a5c7f827f6",
  "modulo_02_pos_intubacao_confirmacao.html": "2c26c18a948fb7e128a4376fd20aa4137cfb4546f448eda070559f5e83d3db97",
  "modulo_03_ventilacao_mecanica.html": "204d39441da2cae5e1dfaa7a2700bec0fafb9df98a995b3d83092f04388c993d",
  "modulo_04_manutencao_sedoanalgesia.html": "cfdd397c56f39a6f6da73545949903279b4b538d264174ed3de4c5a43c4adbb0",
  "modulo_05_drogas_vasoativas.html": "7b0cac7165d86dcc09a433fe4a90f7289d351e60c2c3ffad088df2ce2a6804d7",
  "modulo_06_calculadoras_interativas.html": "f569da691721b6822af3c3e8786ff37119fd7f456069f2c1484dd286b303e982"
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
