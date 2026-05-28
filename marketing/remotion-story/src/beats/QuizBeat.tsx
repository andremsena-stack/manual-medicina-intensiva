import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { beatColors, fontStack, palette } from "../theme";
import type { QuizBeat as QuizBeatT } from "../types";

interface Props {
  payload: QuizBeatT["payload"];
}

// Letras das alternativas, na ordem em que aparecem.
const LETTERS = ["A", "B", "C", "D"] as const;

// Quiz: pergunta type-in, 3 cards de alternativas com slide-in, e ao
// "revealAtFrame" as erradas queimam em vermelho e a correta pulsa cyan.
// Visualmente distinto dos outros beats — chips A/B/C, multiplos elementos
// discretos e mudanca de estado por opcao.
export const QuizBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = beatColors.quiz;

  // Frame em que comeca o reveal (queima das erradas, glow da certa).
  // Default: 55% da duracao do beat. Sobrescritivel via payload.
  const revealAt =
    payload.revealAtFrame ?? Math.round(durationInFrames * 0.55);

  // ----- Animacoes globais -----
  const questionWords = payload.question.split(" ");

  // Linha de subquestion aparece um pouco depois.
  const subOpacity = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Footnote sobe no final.
  const footnoteOpacity = interpolate(
    frame,
    [revealAt + 30, revealAt + 50],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      <AbsoluteFill
        style={{
          padding: "120px 90px",
          display: "flex",
          flexDirection: "column",
          gap: 44,
        }}
      >
        {/* Pergunta — type-in por palavra */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -1.5,
            maxWidth: 920,
          }}
        >
          {questionWords.map((w, i) => {
            const local = interpolate(
              frame,
              [i * 2.5, 10 + i * 2.5],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <span
                key={i}
                style={{
                  opacity: local,
                  display: "inline-block",
                  transform: `translateY(${(1 - local) * 12}px)`,
                  marginRight: 16,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {payload.subquestion ? (
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: palette.whiteDim,
              opacity: subOpacity,
              letterSpacing: 0.2,
              marginTop: -12,
              fontFamily:
                "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, Menlo, monospace",
            }}
          >
            {payload.subquestion}
          </div>
        ) : null}

        {/* Cards de alternativas */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            marginTop: 12,
          }}
        >
          {payload.options.map((opt, i) => {
            const letter = LETTERS[i] ?? "?";

            // Entrada do card: slide da esquerda + fade.
            const enterStart = 32 + i * 18;
            const enter = spring({
              frame: frame - enterStart,
              fps,
              config: { damping: 18, stiffness: 140 },
            });

            // Vibracao sutil enquanto o leitor "pensa" (entre entry e reveal).
            const hover = Math.sin((frame - enterStart) / 8) * 1.5;

            // Reveal: erradas queimam em vermelho e somem; correta pulsa cyan.
            const revealLocal = frame - revealAt;
            const isCorrect = opt.correct === true;

            // Para erradas: flash vermelho 0->1->0 ao longo de 10f, depois
            // fade do card todo pra opacity 0.3.
            const wrongFlash = isCorrect
              ? 0
              : interpolate(
                  revealLocal,
                  [0, 6, 16, 22],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
            const wrongFade = isCorrect
              ? 0
              : interpolate(revealLocal, [10, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

            // Para a correta: glow pulsa em loop, border-color vira cyan,
            // e fica levemente maior.
            const correctGlow = isCorrect
              ? interpolate(
                  Math.sin((revealLocal - 8) / 10),
                  [-1, 1],
                  [0.4, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )
              : 0;
            const correctOn = isCorrect
              ? interpolate(revealLocal, [0, 18], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

            const baseOpacity = enter * (1 - wrongFade * 0.7);
            const scale = enter * (1 + correctOn * 0.04);

            // Cor da borda interpolada entre estados.
            const borderColor = isCorrect
              ? `rgba(48, 241, 230, ${0.25 + correctOn * 0.75})`
              : `rgba(255, 88, 88, ${wrongFlash * 0.9})`;

            // Background com flash vermelho temporário pras erradas.
            const bgFlash = isCorrect ? 0 : wrongFlash;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "28px 32px",
                  borderRadius: 18,
                  border: `2px solid ${
                    enter > 0
                      ? isCorrect && correctOn > 0
                        ? borderColor
                        : !isCorrect && wrongFlash > 0
                          ? borderColor
                          : "rgba(245,249,252,0.14)"
                      : "rgba(245,249,252,0.14)"
                  }`,
                  background: `linear-gradient(135deg,
                    rgba(13, 36, 56, ${0.55 + bgFlash * 0.35}) 0%,
                    rgba(8, 23, 38, ${0.65 + bgFlash * 0.2}) 100%)`,
                  boxShadow: isCorrect
                    ? `0 0 ${40 * correctGlow}px ${
                        palette.cyanBright
                      }${Math.round(correctOn * 80)
                        .toString(16)
                        .padStart(2, "0")}`
                    : "none",
                  opacity: baseOpacity,
                  transform: `translateX(${(1 - enter) * -120}px) translateY(${
                    hover * (1 - correctOn)
                  }px) scale(${scale})`,
                  transformOrigin: "left center",
                }}
              >
                {/* Chip da letra */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    minWidth: 64,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    fontWeight: 800,
                    background: isCorrect
                      ? `rgba(48, 241, 230, ${0.18 + correctOn * 0.25})`
                      : `rgba(48, 241, 230, ${0.14 - bgFlash * 0.1})`,
                    color: isCorrect
                      ? palette.cyanBright
                      : `rgba(245, 249, 252, ${1 - wrongFade * 0.6})`,
                    border: `1px solid ${
                      isCorrect
                        ? `rgba(48, 241, 230, ${0.3 + correctOn * 0.5})`
                        : "rgba(48, 241, 230, 0.22)"
                    }`,
                  }}
                >
                  {letter}
                </div>

                {/* Texto da alternativa */}
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    color: isCorrect
                      ? palette.white
                      : `rgba(245, 249, 252, ${1 - wrongFade * 0.5})`,
                    textDecoration:
                      !isCorrect && wrongFade > 0.5 ? "line-through" : "none",
                    textDecorationColor: "rgba(255, 88, 88, 0.7)",
                    textDecorationThickness: 3,
                    letterSpacing: -0.3,
                  }}
                >
                  {opt.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote — aparece após o reveal */}
        {payload.footnote ? (
          <div
            style={{
              marginTop: "auto",
              fontSize: 24,
              color: palette.whiteFaint,
              fontStyle: "italic",
              opacity: footnoteOpacity,
              letterSpacing: 0.3,
            }}
          >
            {payload.footnote}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
