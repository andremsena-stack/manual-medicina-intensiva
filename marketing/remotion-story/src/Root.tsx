import { Composition } from "remotion";
import { computeStoryDuration, StoryVideo } from "./StoryVideo";
import { defaultBeats } from "./data";
import {
  calculadorasBeats,
  shortAdBeats,
  posIotBeats,
  vasoativasBeats,
  sedoanalgesiaBeats,
  hidroeletroliticosBeats,
  viaAereaBeats,
  reelLancamentoBeats,
  quizSerioBeats,
  quizLeveBeats,
} from "./variants";

const FPS = 30;

// Instagram Stories / Reels / Ads vertical = 1080 x 1920 (9:16).
const STORY = { width: 1080, height: 1920 };
// Instagram Feed quadrado = 1080 x 1080 (1:1).
const FEED_SQUARE = { width: 1080, height: 1080 };
// Instagram Feed alto (preferido) = 1080 x 1350 (4:5).
const FEED_TALL = { width: 1080, height: 1350 };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 — roteiro principal completo (~32s) */}
      <Composition
        id="StoryVideo"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(defaultBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: defaultBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 5 (drogas vasoativas) */}
      <Composition
        id="StoryVideo-Vasoativas"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(vasoativasBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: vasoativasBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 7 (calculadoras) */}
      <Composition
        id="StoryVideo-Calculadoras"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(calculadorasBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: calculadorasBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 1 (via aerea) */}
      <Composition
        id="StoryVideo-ViaAerea"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(viaAereaBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: viaAereaBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 2 (pos-IOT) */}
      <Composition
        id="StoryVideo-PosIot"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(posIotBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: posIotBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 4 (sedoanalgesia) */}
      <Composition
        id="StoryVideo-Sedoanalgesia"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(sedoanalgesiaBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: sedoanalgesiaBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — foco Modulo 6 (disturbios hidroeletroliticos) */}
      <Composition
        id="StoryVideo-Hidroeletroliticos"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(hidroeletroliticosBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: hidroeletroliticosBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — variante curta (~15s) pra Ads de conversao */}
      <Composition
        id="StoryVideo-Short"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(shortAdBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: shortAdBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — Reel de lançamento (~30s) ancorado no plantão noturno */}
      <Composition
        id="ReelLancamento"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(reelLancamentoBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: reelLancamentoBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — Quiz Sério (intensivista veterano, ~26s) */}
      <Composition
        id="QuizSerio"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizSerioBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: quizSerioBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 9:16 — Quiz Leve (residente, ~26s) */}
      <Composition
        id="QuizLeve"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizLeveBeats)}
        fps={FPS}
        {...STORY}
        defaultProps={{ beats: quizLeveBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 1:1 — feed quadrado, roteiro principal (escalado do palco 9:16) */}
      <Composition
        id="FeedSquare"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(defaultBeats)}
        fps={FPS}
        {...FEED_SQUARE}
        defaultProps={{ beats: defaultBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 1:1 — feed quadrado, variante curta (Ads de conversao) */}
      <Composition
        id="FeedSquare-Short"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(shortAdBeats)}
        fps={FPS}
        {...FEED_SQUARE}
        defaultProps={{ beats: shortAdBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 1:1 — feed quadrado, Reel de lançamento */}
      <Composition
        id="ReelLancamento-FeedSquare"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(reelLancamentoBeats)}
        fps={FPS}
        {...FEED_SQUARE}
        defaultProps={{ beats: reelLancamentoBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 1:1 — feed quadrado, Quiz Sério */}
      <Composition
        id="QuizSerio-FeedSquare"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizSerioBeats)}
        fps={FPS}
        {...FEED_SQUARE}
        defaultProps={{ beats: quizSerioBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 1:1 — feed quadrado, Quiz Leve */}
      <Composition
        id="QuizLeve-FeedSquare"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizLeveBeats)}
        fps={FPS}
        {...FEED_SQUARE}
        defaultProps={{ beats: quizLeveBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 4:5 — feed alto (formato preferido do Instagram), roteiro principal */}
      <Composition
        id="FeedTall"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(defaultBeats)}
        fps={FPS}
        {...FEED_TALL}
        defaultProps={{ beats: defaultBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 4:5 — feed alto, variante curta (Ads de conversao) */}
      <Composition
        id="FeedTall-Short"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(shortAdBeats)}
        fps={FPS}
        {...FEED_TALL}
        defaultProps={{ beats: shortAdBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 4:5 — feed alto, Reel de lançamento */}
      <Composition
        id="ReelLancamento-FeedTall"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(reelLancamentoBeats)}
        fps={FPS}
        {...FEED_TALL}
        defaultProps={{ beats: reelLancamentoBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 4:5 — feed alto, Quiz Sério */}
      <Composition
        id="QuizSerio-FeedTall"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizSerioBeats)}
        fps={FPS}
        {...FEED_TALL}
        defaultProps={{ beats: quizSerioBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />

      {/* 4:5 — feed alto, Quiz Leve */}
      <Composition
        id="QuizLeve-FeedTall"
        component={StoryVideo}
        durationInFrames={computeStoryDuration(quizLeveBeats)}
        fps={FPS}
        {...FEED_TALL}
        defaultProps={{ beats: quizLeveBeats }}
        calculateMetadata={({ props }) => ({
          durationInFrames: computeStoryDuration(props.beats),
        })}
      />
    </>
  );
};
