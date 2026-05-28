import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { palette } from "../theme";
import { IPhoneScene3D } from "./antesDepois/IPhoneScene3D";
import { AppIconsScene } from "./antesDepois/AppIconsScene";
import { RevealScene } from "./antesDepois/RevealScene";
import { CalculadoraScene } from "./antesDepois/CalculadoraScene";

// =============================================================================
// StoryVideo-AntesDepois — orquestrador das 4 cenas do reel antes/depois.
//
// Conceito: medico hoje usa 9 apps clinicos avulsos no plantao. Reel mostra
// um smartphone 3D girando com esses 9 apps -> headline "Agora voce pode
// substituir tudo isso" + icones voando pra fora -> reveal Manual Virtus ->
// demo da calculadora resolvendo um caso de noradrenalina (Mod 5 §5.1).
//
// Timeline global (600 frames = 20s a 30fps):
//   0-150   (5.0s) : Cena 1 — IPhoneScene3D — smartphone gira 360°
//   150-280 (4.3s) : Cena 2 — AppIconsScene — grid 9 icones + headline + voo
//   280-380 (3.3s) : Cena 3 — RevealScene — Manual Virtus glow cyan
//   380-600 (7.3s) : Cena 4 — CalculadoraScene — calc noradrenalina animada
//
// Narracao ElevenLabs (`public/audio/antes-depois.mp3`) e gerada via
// `npm run narrate` — duracao deve ficar proxima de 18-19s pra fechar com fade.
// =============================================================================

const NARRATION_SRC = staticFile("audio/antes-depois.mp3");

export const SCENE_PHONE = { from: 0, duration: 150 };
export const SCENE_ICONS = { from: 150, duration: 130 };
export const SCENE_REVEAL = { from: 280, duration: 100 };
export const SCENE_CALC = { from: 380, duration: 220 };

export const TOTAL_FRAMES =
  SCENE_CALC.from + SCENE_CALC.duration; // 600 frames = 20s

const STAGE_W = 1080;
const STAGE_H = 1920;

export const StoryVideoAntesDepois: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade out global nos ultimos 18 frames (0.6s)
  const globalFadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 18, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${palette.navy3} 0%, ${palette.inkDeep} 70%)`,
        opacity: globalFadeOut,
      }}
    >
      {/* Narracao com fade nas bordas pra nao estourar */}
      <Audio
        src={NARRATION_SRC}
        volume={(f) =>
          interpolate(
            f,
            [0, 8, TOTAL_FRAMES - 18, TOTAL_FRAMES],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

      <Sequence from={SCENE_PHONE.from} durationInFrames={SCENE_PHONE.duration}>
        <IPhoneScene3D width={STAGE_W} height={STAGE_H} />
      </Sequence>

      <Sequence from={SCENE_ICONS.from} durationInFrames={SCENE_ICONS.duration}>
        <AppIconsScene />
      </Sequence>

      <Sequence
        from={SCENE_REVEAL.from}
        durationInFrames={SCENE_REVEAL.duration}
      >
        <RevealScene />
      </Sequence>

      <Sequence from={SCENE_CALC.from} durationInFrames={SCENE_CALC.duration}>
        <CalculadoraScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default StoryVideoAntesDepois;
