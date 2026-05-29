import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { palette } from "../theme";

const STAGE_W = 1080;
const STAGE_H = 1920;

// Carrega fontes via @remotion/google-fonts pra garantir consistencia
// em qualquer host de render — independente do que estiver instalado.
const { fontFamily: sansFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
});
const { fontFamily: monoFamily } = loadJetBrains("normal", {
  weights: ["400", "500", "600", "700"],
});

const fontStack = `'${sansFamily}', 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif`;
const monoStack = `'${monoFamily}', 'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace`;

// ---------- Background ----------

const WaveRings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rings = [
    { baseR: 520, phase: 0, opacity: 0.22 },
    { baseR: 760, phase: 0.9, opacity: 0.16 },
    { baseR: 980, phase: 1.8, opacity: 0.1 },
  ];
  return (
    <svg
      width={STAGE_W}
      height={STAGE_H}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <radialGradient id="ring-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.cyanBright} stopOpacity="0" />
          <stop offset="60%" stopColor={palette.cyanBright} stopOpacity="0.18" />
          <stop offset="100%" stopColor={palette.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      {rings.map((r, i) => {
        const radius = r.baseR + Math.sin(t * 0.9 + r.phase) * 22;
        return (
          <circle
            key={i}
            cx={STAGE_W / 2}
            cy={STAGE_H / 2}
            r={radius}
            fill="none"
            stroke={palette.cyanBright}
            strokeOpacity={r.opacity}
            strokeWidth={1.4}
          />
        );
      })}
      <circle
        cx={STAGE_W / 2}
        cy={STAGE_H / 2}
        r={1200}
        fill="url(#ring-grad)"
      />
    </svg>
  );
};

const GrainOverlay: React.FC = () => (
  <svg
    width={STAGE_W}
    height={STAGE_H}
    style={{
      position: "absolute",
      inset: 0,
      mixBlendMode: "overlay",
      opacity: 0.04,
      pointerEvents: "none",
    }}
  >
    <filter id="grain-turb">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain-turb)" />
  </svg>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ---------- Phone screenshots fantasma ----------

interface GhostShotProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  driftSeed: number;
}

const GhostShot: React.FC<GhostShotProps> = ({
  src,
  x,
  y,
  width,
  height,
  driftSeed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Phone shots agora aparecem so no finale (f280-390) pra nao competir com calculadora
  const fadeIn = interpolate(frame, [280, 330], [0, 0.18], {
    extrapolate: "clamp",
  });
  const fadeOut = interpolate(frame, [365, 390], [1, 0], {
    extrapolate: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  const driftY = Math.sin(t * 0.4 + driftSeed) * 24;
  const driftX = Math.cos(t * 0.3 + driftSeed * 1.3) * 14;

  return (
    <div
      style={{
        position: "absolute",
        left: x + driftX,
        top: y + driftY,
        width,
        height,
        opacity,
        filter: "blur(28px) brightness(1.3)",
        borderRadius: 48,
        overflow: "hidden",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

// ---------- Calculadora de droga vasoativa (Noradrenalina) ----------
//
// Formula: mL/h = (dose mcg/kg/min * peso kg * 60 min) / (concentracao mcg/mL)
// Concentracao padrao noradrenalina: 8 mg em 50 mL = 0.16 mg/mL = 160 mcg/mL
// Demo: peso 70 kg, concentracao fixa, dose anima de 0.10 -> 0.30 mcg/kg/min

interface RowProps {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  big?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, unit, accent, big }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "20px 32px",
      borderBottom: big
        ? "none"
        : `1px solid rgba(48, 241, 230, 0.12)`,
      gap: 16,
    }}
  >
    <span
      style={{
        fontFamily: monoStack,
        fontSize: big ? 22 : 22,
        fontWeight: 500,
        color: big ? palette.cyanBright : "rgba(245,249,252,0.55)",
        letterSpacing: big ? 3 : 2,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: fontStack,
        fontSize: big ? 130 : 44,
        fontWeight: big ? 800 : 600,
        color: accent ? palette.cyanBright : palette.white,
        letterSpacing: big ? -2 : -0.5,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {value}
      {unit && (
        <span
          style={{
            fontSize: big ? 42 : 22,
            fontWeight: 500,
            color: "rgba(245,249,252,0.55)",
            marginLeft: 12,
            letterSpacing: 0,
          }}
        >
          {unit}
        </span>
      )}
    </span>
  </div>
);

const CalculadoraVasoativa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Aparece f90-130 (spring), hold ate f240, fade-out f240-280
  const enterSpring = spring({
    fps,
    frame: frame - 90,
    config: { damping: 18, stiffness: 110, mass: 0.9 },
  });
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const enterScale = interpolate(enterSpring, [0, 1], [0.9, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [60, 0]);

  const exitOpacity = interpolate(frame, [240, 280], [1, 0], {
    extrapolate: "clamp",
  });
  const exitScale = interpolate(frame, [240, 280], [1, 0.94], {
    extrapolate: "clamp",
  });

  const opacity = enterOpacity * exitOpacity;
  const scale = enterScale * exitScale;

  // Dose anima de 0.10 -> 0.30 entre f140 e f230 (3s de movimento smooth)
  const dose = interpolate(
    frame,
    [140, 170, 190, 220, 230],
    [0.1, 0.18, 0.22, 0.28, 0.3],
    { extrapolate: "clamp" }
  );

  // Output velocidade mL/h baseado na formula
  const peso = 70;
  const concentracao_mcg_per_ml = 160; // 8mg em 50mL
  const velocidade = (dose * peso * 60) / concentracao_mcg_per_ml;

  // Subtle pulse na borda durante o reveal do output
  const pulse = 0.5 + 0.5 * Math.sin((frame - 90) / 10);
  const borderGlow = interpolate(pulse, [0, 1], [0.25, 0.45]);

  return (
    <div
      style={{
        position: "absolute",
        top: STAGE_H / 2 - 540,
        left: (STAGE_W - 820) / 2,
        width: 820,
        opacity,
        transform: `translateY(${enterY}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Container card */}
      <div
        style={{
          background: `linear-gradient(180deg, ${palette.navy2} 0%, ${palette.navy} 100%)`,
          borderRadius: 36,
          border: `1px solid rgba(48, 241, 230, ${borderGlow})`,
          boxShadow: `0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(48,241,230,0.15)`,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px 20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid rgba(48, 241, 230, 0.15)`,
            background: `linear-gradient(180deg, rgba(48,241,230,0.06), rgba(48,241,230,0))`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontFamily: monoStack,
                fontSize: 16,
                fontWeight: 500,
                color: palette.cyanBright,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Calculadora
            </span>
            <span
              style={{
                fontFamily: fontStack,
                fontSize: 36,
                fontWeight: 700,
                color: palette.white,
                letterSpacing: -0.5,
              }}
            >
              Noradrenalina
            </span>
          </div>
          {/* Live indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: palette.cyanBright,
                boxShadow: `0 0 14px ${palette.cyanBright}`,
                opacity: 0.6 + 0.4 * pulse,
              }}
            />
            <span
              style={{
                fontFamily: monoStack,
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(245,249,252,0.55)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Live
            </span>
          </div>
        </div>

        {/* Inputs */}
        <Row label="Peso" value="70" unit="kg" />
        <Row label="Diluição" value="8mg/50mL" />
        <Row label="Dose alvo" value={dose.toFixed(2)} unit="mcg/kg/min" accent />

        {/* Output destacado */}
        <div
          style={{
            background: `linear-gradient(180deg, rgba(48,241,230,0.08), rgba(48,241,230,0.02))`,
            padding: "24px 0 32px 0",
            borderTop: `1px solid rgba(48, 241, 230, 0.18)`,
          }}
        >
          <Row
            label="Vazão"
            value={velocidade.toFixed(1)}
            unit="mL/h"
            accent
            big
          />
        </div>
      </div>

      {/* Caption ancora abaixo */}
      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          fontFamily: monoStack,
          fontSize: 18,
          fontWeight: 500,
          color: "rgba(245,249,252,0.42)",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Bomba ajustada em 1 toque
      </div>
    </div>
  );
};

// ---------- Componente principal ----------

export const StoryVideoAdCinematicManifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eyebrow "DA EMERGÊNCIA À UTI" — fade-in f30-50, hold, fade-out f100-120
  const eyebrowIn = interpolate(frame, [30, 50], [0, 1], {
    extrapolate: "clamp",
  });
  const eyebrowOut = interpolate(frame, [100, 120], [1, 0], {
    extrapolate: "clamp",
  });
  const eyebrowOpacity = eyebrowIn * eyebrowOut;
  const eyebrowY = interpolate(eyebrowIn, [0, 1], [-30, 0]);

  // Headline "Manual Virtus" — spring f260-330, slow zoom, fade-out f370-390
  const headlineSpring = spring({
    fps,
    frame: frame - 260,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });
  const headlineScaleIn = interpolate(headlineSpring, [0, 1], [0.85, 1]);
  const headlineOpacityIn = interpolate(headlineSpring, [0, 1], [0, 1]);
  const slowZoom = 1 + Math.max(0, frame - 260) / 6000;
  const headlineFadeOut = interpolate(frame, [370, 390], [1, 0], {
    extrapolate: "clamp",
  });
  const headlineOpacity = headlineOpacityIn * headlineFadeOut;
  const headlineScale = headlineScaleIn * slowZoom;

  // Subtitulo + handle — fade-in f320-350, fade-out f375-390
  const subtitleIn = interpolate(frame, [320, 350], [0, 1], {
    extrapolate: "clamp",
  });
  const subtitleOut = interpolate(frame, [375, 390], [1, 0], {
    extrapolate: "clamp",
  });
  const subtitleOpacity = subtitleIn * subtitleOut;
  const subtitleY = interpolate(subtitleIn, [0, 1], [20, 0]);

  // Calculadora ativa entre f90 e f280 — esconde ao começar headline pra liberar palco
  const calcVisible = frame >= 90 && frame <= 280;

  // Background gradient radial naval com bias no topo
  const bgStyle: React.CSSProperties = {
    background: `radial-gradient(ellipse at 50% 28%, ${palette.navy4} 0%, ${palette.navy3} 32%, ${palette.ink} 78%)`,
  };

  return (
    <AbsoluteFill style={bgStyle}>
      {/* Camada 1 — Background com ondas */}
      <WaveRings />

      {/* Camada 2 — Phone screenshots fantasma (so no finale) */}
      <GhostShot
        src={staticFile("app-shots/screen-1.png")}
        x={80}
        y={220}
        width={320}
        height={620}
        driftSeed={0}
      />
      <GhostShot
        src={staticFile("app-shots/screen-2.png")}
        x={(STAGE_W - 320) / 2}
        y={680}
        width={320}
        height={620}
        driftSeed={2.1}
      />
      <GhostShot
        src={staticFile("app-shots/screen-3.png")}
        x={STAGE_W - 80 - 320}
        y={1140}
        width={320}
        height={620}
        driftSeed={4.2}
      />

      <GrainOverlay />

      {/* Camada 3 — Eyebrow "DA EMERGÊNCIA À UTI" */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: eyebrowOpacity,
          transform: `translateY(${eyebrowY}px)`,
          fontFamily: monoStack,
          fontSize: 28,
          fontWeight: 500,
          color: palette.cyanBright,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        Da Emergência à UTI
      </div>

      {/* Camada 4 — Calculadora vasoativa (Noradrenalina) */}
      {calcVisible && <CalculadoraVasoativa />}

      {/* Camada 5 — Headline gigante "Manual Virtus" */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: STAGE_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            fontFamily: fontStack,
            fontSize: 196,
            fontWeight: 800,
            color: palette.white,
            letterSpacing: -4,
            lineHeight: 0.95,
            textAlign: "center",
            padding: "0 40px",
            textShadow:
              "0 0 60px rgba(48,241,230,0.18), 0 12px 40px rgba(0,0,0,0.55)",
          }}
        >
          Manual
          <br />
          Virtus
        </div>
      </div>

      {/* Camada 6 — Subtitulo "Decisoes a beira do leito" */}
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: fontStack,
          fontSize: 36,
          fontWeight: 400,
          color: "rgba(245,249,252,0.80)",
          letterSpacing: 1.2,
        }}
      >
        Decisões à beira do leito
      </div>

      {/* Logo Virtus + handle */}
      <div
        style={{
          position: "absolute",
          top: 1580,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        <Img
          src={staticFile("virtus-logo/icon.png")}
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            filter: `drop-shadow(0 0 18px ${palette.cyanBright}88)`,
          }}
        />
        <div
          style={{
            fontFamily: monoStack,
            fontSize: 22,
            fontWeight: 500,
            color: palette.cyanBright,
            letterSpacing: 3,
          }}
        >
          manualvirtus.com.br
        </div>
      </div>

      {/* Camada 7 — Vignette */}
      <Vignette />
    </AbsoluteFill>
  );
};

export default StoryVideoAdCinematicManifesto;
