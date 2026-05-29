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
import { fontStack, palette } from "../theme";

const STAGE_W = 1080;
const STAGE_H = 1920;

const monoStack =
  "'JetBrains Mono', 'SF Mono', 'IBM Plex Mono', ui-monospace, Menlo, monospace";

// ---------- Background ----------

const WaveRings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // 3 ondas concentricas que "respiram" devagar (radius pulsa via sin)
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

  // Fade-in 90-150, hold ate 240, fade-out 240-300
  const fadeIn = interpolate(frame, [90, 150], [0, 0.18], {
    extrapolate: "clamp",
  });
  const fadeOut = interpolate(frame, [240, 300], [1, 0], {
    extrapolate: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // Drift Y muito devagar (sin wave de baixa frequencia)
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

// ---------- Componente principal ----------

export const StoryVideoAdCinematicManifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eyebrow "DA EMERGÊNCIA À UTI" — fade-in/slide f30-50, hold, fade-out f105-120
  const eyebrowIn = interpolate(frame, [30, 50], [0, 1], {
    extrapolate: "clamp",
  });
  const eyebrowOut = interpolate(frame, [105, 120], [1, 0], {
    extrapolate: "clamp",
  });
  const eyebrowOpacity = eyebrowIn * eyebrowOut;
  const eyebrowY = interpolate(eyebrowIn, [0, 1], [-30, 0]);

  // Headline "Manual Virtus" — spring f90-150, slow zoom continuo, fade-out f245-260
  const headlineSpring = spring({
    fps,
    frame: frame - 90,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });
  const headlineScaleIn = interpolate(headlineSpring, [0, 1], [0.85, 1]);
  const headlineOpacityIn = interpolate(headlineSpring, [0, 1], [0, 1]);
  const slowZoom = 1 + Math.max(0, frame - 90) / 5000;
  const headlineFadeOut = interpolate(frame, [245, 260], [1, 0], {
    extrapolate: "clamp",
  });
  const headlineOpacity = headlineOpacityIn * headlineFadeOut;
  const headlineScale = headlineScaleIn * slowZoom;

  // Subtitulo + handle — fade-in/slide f210-240, fade-out f280-300
  const subtitleIn = interpolate(frame, [210, 240], [0, 1], {
    extrapolate: "clamp",
  });
  const subtitleOut = interpolate(frame, [280, 300], [1, 0], {
    extrapolate: "clamp",
  });
  const subtitleOpacity = subtitleIn * subtitleOut;
  const subtitleY = interpolate(subtitleIn, [0, 1], [20, 0]);

  // Background gradient radial naval com bias no topo
  const bgStyle: React.CSSProperties = {
    background: `radial-gradient(ellipse at 50% 28%, ${palette.navy4} 0%, ${palette.navy3} 32%, ${palette.ink} 78%)`,
  };

  return (
    <AbsoluteFill style={bgStyle}>
      {/* Camada 1 — Background com ondas + grain */}
      <WaveRings />

      {/* Camada 2 — Phone screenshots fantasma (parallax) */}
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

      {/* Camada 4 — Headline gigante "Manual Virtus" */}
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

      {/* Camada 5 — Subtitulo "Decisoes a beira do leito" */}
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

      {/* Logo Virtus pequeno + handle */}
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

      {/* Camada 6 — Vignette */}
      <Vignette />
    </AbsoluteFill>
  );
};

export default StoryVideoAdCinematicManifesto;
