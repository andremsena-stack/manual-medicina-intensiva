import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontStack, palette } from "../../theme";
import { COPY } from "./copy";

// Cena 4: Calculadora animada de noradrenalina (caso canonico Mod 5 §5.1).
// Cabecalho de paciente "JS, 70 kg, choque septico", cursor simulado clica
// em 3 campos, digita 70 / 64 / 6,6 e mostra resultado 0,1 mcg/kg/min.
//
// Timeline interna (frames relativos ao inicio da Sequence):
//   0-20    : card scale-in + header paciente entra
//   20-30   : cursor entra do canto inferior direito
//   30-45   : digita "70" no campo Peso
//   45-60   : cursor desliza pro campo Conc, digita "64"
//   60-80   : cursor desliza pro campo Vazao, digita "6,6"
//   80-95   : cursor sobe pro botao "Calcular", botao pulsa, clica
//   95-115  : resultado "0,1 mcg/kg/min" aparece com glow + scale
//   115-180 : hold com footer (fonte clinica)
//   180-210 : fade out global

const CARD_W = 880;
const CARD_H = 1280;
const CARD_TOP = 320;
const CARD_LEFT = (1080 - CARD_W) / 2;
const FIELD_H = 96;
const FIELD_GAP = 28;
const FIELD_LABEL_GAP = 12;
const FIELD_LABEL_H = 32;

// Posicoes relativas ao card — usadas pelo cursor pra navegar entre campos.
const POS_HEADER_BOTTOM = 220;
const POS_FIELD_WEIGHT_INPUT_Y = POS_HEADER_BOTTOM + 70 + FIELD_LABEL_H + FIELD_LABEL_GAP;
const POS_FIELD_CONC_INPUT_Y = POS_FIELD_WEIGHT_INPUT_Y + FIELD_H + FIELD_GAP + FIELD_LABEL_H + FIELD_LABEL_GAP;
const POS_FIELD_RATE_INPUT_Y = POS_FIELD_CONC_INPUT_Y + FIELD_H + FIELD_GAP + FIELD_LABEL_H + FIELD_LABEL_GAP;
const POS_BUTTON_Y = POS_FIELD_RATE_INPUT_Y + FIELD_H + 56;
const POS_RESULT_Y = POS_BUTTON_Y + 130;

// Helper pra "digitar" string progressivamente
const typedText = (
  text: string,
  frame: number,
  startFrame: number,
  durationFrames: number,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleChars = Math.floor(progress * text.length);
  return text.slice(0, visibleChars);
};

interface FieldRowProps {
  label: string;
  value: string;
  focused: boolean;
  /** Y absoluto dentro do card (pra alinhar com cursor) */
  y: number;
}

const FieldRow: React.FC<FieldRowProps> = ({ label, value, focused, y }) => {
  return (
    <div style={{ position: "absolute", top: y - FIELD_LABEL_H - FIELD_LABEL_GAP, left: 56, right: 56 }}>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: 22,
          fontWeight: 500,
          color: palette.whiteDim,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          marginBottom: FIELD_LABEL_GAP,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: FIELD_H,
          background: focused ? "rgba(48,241,230,0.08)" : "rgba(255,255,255,0.04)",
          border: focused
            ? `2px solid ${palette.cyanBright}`
            : "2px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          fontFamily: fontStack,
          fontSize: 40,
          fontWeight: 600,
          color: palette.white,
          boxShadow: focused
            ? `0 0 24px ${palette.cyanBright}33`
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "all 0.2s",
        }}
      >
        {value || (
          <span style={{ color: palette.whiteFaint, fontWeight: 400 }}>
            —
          </span>
        )}
      </div>
    </div>
  );
};

export const CalculadoraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entry
  const cardSpring = spring({
    fps,
    frame: frame - 0,
    config: { damping: 14, stiffness: 130, mass: 0.7 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Header patient slide-in
  const headerSpring = spring({
    fps,
    frame: frame - 8,
    config: { damping: 16, stiffness: 110 },
  });
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);
  const headerX = interpolate(headerSpring, [0, 1], [-40, 0]);

  // Cursor animation
  const cursorAppearOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor positions over time (x, y dentro do card)
  // Movimento smooth interpolando entre keyframes
  const CURSOR_KEYS = [
    { f: 20, x: CARD_W - 60, y: CARD_H - 60 }, // entrada canto BR
    { f: 30, x: 200, y: POS_FIELD_WEIGHT_INPUT_Y + FIELD_H / 2 }, // campo Peso
    { f: 45, x: 200, y: POS_FIELD_WEIGHT_INPUT_Y + FIELD_H / 2 }, // pausa digitando
    { f: 55, x: 200, y: POS_FIELD_CONC_INPUT_Y + FIELD_H / 2 }, // campo Conc
    { f: 65, x: 200, y: POS_FIELD_CONC_INPUT_Y + FIELD_H / 2 }, // pausa digitando
    { f: 75, x: 200, y: POS_FIELD_RATE_INPUT_Y + FIELD_H / 2 }, // campo Vazao
    { f: 90, x: 200, y: POS_FIELD_RATE_INPUT_Y + FIELD_H / 2 }, // pausa digitando
    { f: 100, x: CARD_W / 2, y: POS_BUTTON_Y + 45 }, // botao
  ];

  const interpolateCursorPos = (axis: "x" | "y") => {
    const points = CURSOR_KEYS.map((k) => k.f);
    const values = CURSOR_KEYS.map((k) => k[axis]);
    return interpolate(frame, points, values, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const cursorX = interpolateCursorPos("x");
  const cursorY = interpolateCursorPos("y");
  // Esconde o cursor depois do clique no botao
  const cursorOpacity =
    cursorAppearOpacity *
    interpolate(frame, [105, 115], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Click pulse no botao (apenas no momento do clique)
  const buttonClickPulse = interpolate(
    frame,
    [98, 102, 106],
    [1, 0.94, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const buttonGlow = interpolate(frame, [98, 106], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Field focus windows
  const weightFocused = frame >= 28 && frame < 48;
  const concFocused = frame >= 50 && frame < 68;
  const rateFocused = frame >= 73 && frame < 93;

  // Typed values
  const weightTyped = typedText(COPY.CALC_NUMBER_WEIGHT, frame, 32, 8);
  const concTyped = typedText(COPY.CALC_NUMBER_CONC, frame, 54, 8);
  const rateTyped = typedText(COPY.CALC_NUMBER_RATE, frame, 77, 10);

  // Result reveal
  const resultSpring = spring({
    fps,
    frame: frame - 105,
    config: { damping: 11, stiffness: 105, mass: 0.7 },
  });
  const resultScale = interpolate(resultSpring, [0, 1], [0.6, 1]);
  const resultOpacity = interpolate(resultSpring, [0, 1], [0, 1]);

  // Result glow pulse
  const resultGlow =
    0.6 +
    0.4 *
      Math.sin(((Math.max(0, frame - 105) / fps) * Math.PI * 2) / 1.4);
  const resultGlowOpacity = interpolate(frame, [105, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Footer fade-in
  const footerOpacity = interpolate(frame, [125, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Global fade-out final
  const globalFade = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: globalFade,
        fontFamily: fontStack,
      }}
    >
      {/* Card calculadora */}
      <div
        style={{
          position: "absolute",
          left: CARD_LEFT,
          top: CARD_TOP,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 36,
          background: `linear-gradient(160deg, ${palette.navy3} 0%, ${palette.ink} 100%)`,
          border: "1px solid rgba(48,241,230,0.16)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
          transform: `scale(${cardScale})`,
          transformOrigin: "center center",
          opacity: cardOpacity,
          overflow: "hidden",
        }}
      >
        {/* Header app — titulo calc */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 56,
            right: 56,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: palette.cyanBright,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {COPY.CALC_TITLE}
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: palette.white,
              letterSpacing: -0.5,
            }}
          >
            {COPY.CALC_SUBTITLE}
          </div>
        </div>

        {/* Patient header bar (sticky abaixo do titulo) */}
        <div
          style={{
            position: "absolute",
            top: 158,
            left: 36,
            right: 36,
            padding: "18px 28px",
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.32)",
            borderRadius: 18,
            opacity: headerOpacity,
            transform: `translateX(${headerX}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: palette.white,
              }}
            >
              {COPY.PATIENT_NAME}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: palette.amber,
              }}
            >
              {COPY.PATIENT_WEIGHT_LABEL}
            </div>
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 20,
              fontWeight: 500,
              color: palette.red,
              letterSpacing: 0.3,
            }}
          >
            {COPY.PATIENT_DIAGNOSIS}
          </div>
        </div>

        {/* Campos */}
        <FieldRow
          label={COPY.CALC_FIELD_WEIGHT}
          value={weightTyped}
          focused={weightFocused}
          y={POS_FIELD_WEIGHT_INPUT_Y}
        />
        <FieldRow
          label={COPY.CALC_FIELD_CONC}
          value={concTyped}
          focused={concFocused}
          y={POS_FIELD_CONC_INPUT_Y}
        />
        <FieldRow
          label={COPY.CALC_FIELD_RATE}
          value={rateTyped}
          focused={rateFocused}
          y={POS_FIELD_RATE_INPUT_Y}
        />

        {/* Botao Calcular */}
        <div
          style={{
            position: "absolute",
            top: POS_BUTTON_Y,
            left: 56,
            right: 56,
            height: FIELD_H,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${palette.cyan} 0%, ${palette.cyanBright} 100%)`,
            color: palette.inkDeep,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${buttonClickPulse})`,
            boxShadow: `0 12px 36px rgba(48,241,230,${0.25 + buttonGlow * 0.45}), inset 0 1px 0 rgba(255,255,255,0.4)`,
          }}
        >
          {COPY.CALC_BTN}
        </div>

        {/* Resultado */}
        <div
          style={{
            position: "absolute",
            top: POS_RESULT_Y,
            left: 56,
            right: 56,
            padding: "26px 28px",
            borderRadius: 22,
            background: "rgba(48,241,230,0.10)",
            border: `2px solid ${palette.cyanBright}`,
            opacity: resultOpacity,
            transform: `scale(${resultScale})`,
            boxShadow: `0 0 ${40 * resultGlowOpacity * resultGlow}px ${palette.cyanBright}88`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: palette.cyanBright,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Dose atual
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 116,
                fontWeight: 800,
                color: palette.white,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              {COPY.CALC_RESULT_VALUE}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: palette.cyanBright,
                letterSpacing: 0.4,
              }}
            >
              {COPY.CALC_RESULT_UNIT}
            </div>
          </div>
        </div>

        {/* Cursor simulado */}
        <div
          style={{
            position: "absolute",
            left: cursorX - 14,
            top: cursorY - 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: palette.cyanBright,
            opacity: cursorOpacity,
            boxShadow: `0 0 16px ${palette.cyanBright}cc, 0 0 6px ${palette.white}88`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Footer fonte clinica fora do card */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 500,
          color: palette.whiteFaint,
          letterSpacing: 0.5,
          opacity: footerOpacity,
          padding: "0 80px",
        }}
      >
        {COPY.CALC_FOOTER}
      </div>
    </AbsoluteFill>
  );
};
