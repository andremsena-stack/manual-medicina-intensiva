// Gera os MP3s de narração via API do ElevenLabs.
//
// Uso:
//   $env:ELEVENLABS_API_KEY = "sua_key"
//   npm run narrate                       # gera todos os specs
//   npm run narrate -- antes-depois       # gera apenas o slug passado
//
// Saída: marketing/remotion-story/public/audio/<slug>.mp3
//        marketing/remotion-story/public/audio/<slug>.json  (metadata)

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outDir = join(projectRoot, "public", "audio");

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error(
    "[narrate] ELEVENLABS_API_KEY não está setado.\n" +
      '  PowerShell: $env:ELEVENLABS_API_KEY = "sua_key"\n' +
      '  Bash:        export ELEVENLABS_API_KEY="sua_key"',
  );
  process.exit(1);
}

// Importa o módulo TS via tsx loader não disponível por padrão; ao invés disso
// duplicamos a leitura através de um import dinâmico de um espelho .mjs.
// Para simplicidade aqui, carregamos um arquivo .mjs que reexporta o spec.
// Mas como narration.ts é puro tipo + dados, fazemos parse manual leve:
const narrationSrc = await import(
  pathToFileURL(join(projectRoot, "src", "narration.ts")).href +
    "?virtual"
).catch(() => null);

// Fallback: ler narration.ts como texto e extrair via JSON-ish.
// Aqui mantemos uma cópia mínima dos specs neste arquivo para evitar
// dependência de loader TS no script de build. Sincronize manualmente
// quando editar src/narration.ts (é só um array curto).
const SPECS = [
  {
    slug: "antes-depois",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    modelId: "eleven_multilingual_v2",
    // Texto cobre as 4 cenas do reel (20s):
    //   - Cena 1 (iPhone girando + 9 apps): "Antes: nove apps no plantão..."
    //   - Cena 2 (icones voando): "Calculadora, antibiótico, eletrólitos."
    //   - Cena 3 (reveal Manual Virtus): "Agora, um só. Manual Virtus."
    //   - Cena 4 (calc noradrenalina): "Choque séptico, paciente setenta..."
    //   - Outro: "...No bolso."
    text:
      "Antes: nove apps abertos no plantão. Calculadora, antibiótico, sedação, eletrólitos. Agora, um só. Manual Virtus. Choque séptico, paciente setenta quilos, bomba a seis vírgula seis. Dose: zero vírgula um mcg por quilo por minuto. Em segundos. No bolso.",
    voiceSettings: {
      stability: 0.55,
      similarity_boost: 0.75,
      style: 0.15,
      use_speaker_boost: true,
    },
  },
];

const wanted = process.argv.slice(2);
const specs = wanted.length
  ? SPECS.filter((s) => wanted.includes(s.slug))
  : SPECS;

if (!specs.length) {
  console.error(
    `[narrate] Nenhum spec corresponde aos slugs: ${wanted.join(", ")}`,
  );
  console.error(`[narrate] Slugs disponíveis: ${SPECS.map((s) => s.slug).join(", ")}`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

for (const spec of specs) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${spec.voiceId}?output_format=mp3_44100_128`;
  const body = {
    text: spec.text,
    model_id: spec.modelId,
    voice_settings: spec.voiceSettings ?? {},
  };

  console.log(`[narrate] ${spec.slug} -> voice ${spec.voiceId} (${spec.modelId})`);
  console.log(`[narrate]   texto: "${spec.text}"`);

  const t0 = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(
      `[narrate] FALHOU ${spec.slug}: HTTP ${res.status} ${res.statusText}\n${errText}`,
    );
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const mp3Path = join(outDir, `${spec.slug}.mp3`);
  await writeFile(mp3Path, buf);

  const meta = {
    slug: spec.slug,
    voiceId: spec.voiceId,
    modelId: spec.modelId,
    text: spec.text,
    voiceSettings: spec.voiceSettings ?? {},
    bytes: buf.length,
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - t0,
  };
  await writeFile(
    join(outDir, `${spec.slug}.json`),
    JSON.stringify(meta, null, 2) + "\n",
  );

  console.log(
    `[narrate]   ok -> public/audio/${spec.slug}.mp3 (${(buf.length / 1024).toFixed(1)} KB, ${meta.elapsedMs} ms)`,
  );
}

console.log(`[narrate] concluído (${specs.length} arquivo${specs.length > 1 ? "s" : ""}).`);
