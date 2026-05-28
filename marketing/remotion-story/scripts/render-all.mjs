#!/usr/bin/env node
// Renderiza todas as composições registradas em src/Root.tsx para arquivos
// MP4 em out/. Roda sequencialmente — o Chromium do Remotion fica pesado se
// rodar em paralelo na mesma máquina.
//
// Uso:
//   node scripts/render-all.mjs           # renderiza tudo
//   node scripts/render-all.mjs vertical  # so 9:16
//   node scripts/render-all.mjs square    # so 1:1
//   node scripts/render-all.mjs tall      # so 4:5

import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "out");

// (composition id, arquivo de saida, grupo)
const COMPOSITIONS = [
  // 9:16 vertical — Stories / Reels / Ads
  ["StoryVideo", "story.mp4", "vertical"],
  ["StoryVideo-Vasoativas", "story-vasoativas.mp4", "vertical"],
  ["StoryVideo-Calculadoras", "story-calculadoras.mp4", "vertical"],
  ["StoryVideo-ViaAerea", "story-via-aerea.mp4", "vertical"],
  ["StoryVideo-PosIot", "story-pos-iot.mp4", "vertical"],
  ["StoryVideo-Sedoanalgesia", "story-sedoanalgesia.mp4", "vertical"],
  ["StoryVideo-Hidroeletroliticos", "story-hidroeletroliticos.mp4", "vertical"],
  ["StoryVideo-Short", "story-short.mp4", "vertical"],
  ["ReelLancamento", "reel-lancamento.mp4", "vertical"],
  ["QuizSerio", "quiz-serio.mp4", "vertical"],
  ["QuizLeve", "quiz-leve.mp4", "vertical"],

  // 1:1 quadrado — Feed
  ["FeedSquare", "feed-square.mp4", "square"],
  ["FeedSquare-Short", "feed-square-short.mp4", "square"],
  ["ReelLancamento-FeedSquare", "reel-lancamento-square.mp4", "square"],
  ["QuizSerio-FeedSquare", "quiz-serio-square.mp4", "square"],
  ["QuizLeve-FeedSquare", "quiz-leve-square.mp4", "square"],

  // 4:5 alto — Feed alto
  ["FeedTall", "feed-tall.mp4", "tall"],
  ["FeedTall-Short", "feed-tall-short.mp4", "tall"],
  ["ReelLancamento-FeedTall", "reel-lancamento-tall.mp4", "tall"],
  ["QuizSerio-FeedTall", "quiz-serio-tall.mp4", "tall"],
  ["QuizLeve-FeedTall", "quiz-leve-tall.mp4", "tall"],
];

const filterGroup = process.argv[2];
const selection = filterGroup
  ? COMPOSITIONS.filter(([, , g]) => g === filterGroup)
  : COMPOSITIONS;

if (selection.length === 0) {
  console.error(`Grupo desconhecido: ${filterGroup}`);
  console.error("Grupos: vertical | square | tall");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const run = (id, file) =>
  new Promise((res, rej) => {
    // Em Windows, npx é npx.cmd e precisa de shell: true pro spawn não dar EINVAL.
    const child = spawn(
      "npx",
      [
        "remotion",
        "render",
        "src/index.ts",
        id,
        resolve(outDir, file),
        "--log=info",
      ],
      { cwd: root, stdio: "inherit", shell: true },
    );
    child.on("exit", (code) =>
      code === 0
        ? res()
        : rej(new Error(`Render falhou (${id}): exit ${code}`)),
    );
    child.on("error", rej);
  });

const t0 = Date.now();
const failures = [];

for (const [id, file] of selection) {
  const tStart = Date.now();
  console.log(`\n=========================`);
  console.log(`Renderizando: ${id} -> out/${file}`);
  console.log(`=========================\n`);
  try {
    await run(id, file);
    const secs = Math.round((Date.now() - tStart) / 1000);
    console.log(`OK  ${id} (${secs}s)`);
  } catch (err) {
    console.error(`FALHOU  ${id}: ${err.message}`);
    failures.push(id);
  }
}

const totalSecs = Math.round((Date.now() - t0) / 1000);
console.log(`\n=========================`);
console.log(`Concluido em ${totalSecs}s`);
console.log(`Sucesso: ${selection.length - failures.length}/${selection.length}`);
if (failures.length) {
  console.log(`Falhas: ${failures.join(", ")}`);
  process.exit(1);
}
