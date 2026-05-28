import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { iris } from "@remotion/transitions/iris";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { ReactElement } from "react";

import { CtaBeat } from "./beats/CtaBeat";
import { HookBeat } from "./beats/HookBeat";
import { InsightBeat } from "./beats/InsightBeat";
import { LogoBeat } from "./beats/LogoBeat";
import { ProblemBeat } from "./beats/ProblemBeat";
import { QuizBeat } from "./beats/QuizBeat";
import { SolutionBeat } from "./beats/SolutionBeat";
import { StatBeat } from "./beats/StatBeat";
import type { Beat, StoryVideoProps, TransitionKind } from "./types";

const TRANSITION_FRAMES = 14;

// Mapa de transicoes nomeadas para presentations do @remotion/transitions.
const presentationFor = (kind: TransitionKind, w: number, h: number) => {
  switch (kind) {
    case "slide-up":
      return slide({ direction: "from-bottom" });
    case "slide-left":
      return slide({ direction: "from-right" });
    case "wipe":
      return wipe({ direction: "from-left" });
    case "flip":
      return flip({ direction: "from-right" });
    case "clock":
      return clockWipe({ width: w, height: h });
    case "iris":
      return iris({ width: w, height: h });
    case "fade":
    default:
      return fade();
  }
};

const timingFor = (kind: TransitionKind) => {
  if (kind === "fade" || kind === "wipe" || kind === "clock") {
    return linearTiming({ durationInFrames: TRANSITION_FRAMES });
  }
  return springTiming({
    config: { damping: 200 },
    durationInFrames: TRANSITION_FRAMES,
    durationRestThreshold: 0.001,
  });
};

const renderBeat = (beat: Beat) => {
  switch (beat.type) {
    case "hook":
      return <HookBeat payload={beat.payload} />;
    case "problem":
      return <ProblemBeat payload={beat.payload} />;
    case "stat":
      return <StatBeat payload={beat.payload} />;
    case "insight":
      return <InsightBeat payload={beat.payload} />;
    case "solution":
      return <SolutionBeat payload={beat.payload} />;
    case "cta":
      return <CtaBeat payload={beat.payload} />;
    case "logo":
      return <LogoBeat payload={beat.payload} />;
    case "quiz":
      return <QuizBeat payload={beat.payload} />;
  }
};

// Layout-base de todos os beats: 1080 x 1920 (9:16).
// Em qualquer outro aspect ratio (1:1, 4:5...) o palco e escalado pra caber.
const STAGE_W = 1080;
const STAGE_H = 1920;

export const StoryVideo: React.FC<StoryVideoProps> = ({ beats }) => {
  const { width, height } = useVideoConfig();

  // Escala uniforme + centralizacao no canvas. Os beats sao desenhados
  // num palco fixo 1080x1920 e o palco e que se acomoda no formato alvo.
  const k = Math.min(width / STAGE_W, height / STAGE_H);
  const offsetX = (width - STAGE_W * k) / 2;
  const offsetY = (height - STAGE_H * k) / 2;

  return (
    <AbsoluteFill style={{ background: "#020812" }}>
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${k})`,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        <TransitionSeries>
          {beats.map((beat, i) => {
            const items: ReactElement[] = [];

            if (i > 0) {
              const kind = beat.transitionIn ?? "fade";
              items.push(
                <TransitionSeries.Transition
                  key={`t-${i}`}
                  presentation={presentationFor(kind, STAGE_W, STAGE_H)}
                  timing={timingFor(kind)}
                />
              );
            }

            items.push(
              <TransitionSeries.Sequence
                key={`s-${i}`}
                durationInFrames={beat.durationInFrames}
              >
                {renderBeat(beat)}
              </TransitionSeries.Sequence>
            );

            return items;
          })}
        </TransitionSeries>

        {/* Marca d'agua persistente discreta */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            fontFamily:
              "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 18,
            color: "rgba(245,249,252,0.35)",
            letterSpacing: 3,
            textTransform: "uppercase",
            zIndex: 5,
          }}
        >
          @manual.virtus
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const computeStoryDuration = (beats: Beat[]) => {
  const beatsTotal = beats.reduce((sum, b) => sum + b.durationInFrames, 0);
  const transitions = Math.max(0, beats.length - 1) * TRANSITION_FRAMES;
  return beatsTotal + transitions;
};
