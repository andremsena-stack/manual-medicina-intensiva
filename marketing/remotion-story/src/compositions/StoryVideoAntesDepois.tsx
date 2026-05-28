import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontStack, palette } from "../theme";

// Narração ElevenLabs gerada por `npm run narrate` (script
// scripts/generate-narration.mjs). Se o arquivo ainda não existir,
// o Remotion mostra 404 no preview mas o resto da composition renderiza.
const NARRATION_SRC = staticFile("audio/antes-depois.mp3");

interface AppIconSpec {
  label: string;
  bg: string;
  bgEnd: string;
  symbolColor: string;
  symbol: React.ReactNode;
}

const ICON_SIZE = 220;
const ICON_RADIUS = 48;
const GRID_GAP = 36;
const STAGE_W = 1080;
const STAGE_H = 1920;

// Símbolos SVG inline — desenhos genéricos, não copiam logos de terceiros.
const SymHeart = () => (
  <path d="M50 86 L18 54 C8 44 8 28 18 18 C28 8 44 8 54 18 L50 22 L46 18 C56 8 72 8 82 18 C92 28 92 44 82 54 Z" />
);
const SymBolt = () => (
  <path d="M58 8 L26 56 L46 56 L38 92 L72 42 L52 42 Z" />
);
const SymMoon = () => (
  <path d="M68 14 C46 14 28 32 28 54 C28 76 46 94 68 94 C58 88 50 76 50 62 C50 38 58 22 68 14 Z" />
);
const SymShield = () => (
  <path d="M50 8 L18 22 V52 C18 72 32 86 50 96 C68 86 82 72 82 52 V22 Z" />
);
const SymGauge = () => (
  <g>
    <path d="M50 18 C28 18 12 36 12 58 H22 C22 42 34 28 50 28 C66 28 78 42 78 58 H88 C88 36 72 18 50 18 Z" />
    <rect x="48" y="32" width="4" height="30" transform="rotate(48 50 58)" />
    <circle cx="50" cy="58" r="6" />
  </g>
);
const SymBaby = () => (
  <g>
    <circle cx="50" cy="46" r="28" />
    <circle cx="40" cy="44" r="3.5" fill={palette.navy} />
    <circle cx="60" cy="44" r="3.5" fill={palette.navy} />
    <path d="M40 56 Q50 64 60 56" stroke={palette.navy} strokeWidth="3" fill="none" />
  </g>
);
const SymDrop = () => (
  <path d="M50 10 C36 32 22 50 22 68 C22 84 35 96 50 96 C65 96 78 84 78 68 C78 50 64 32 50 10 Z" />
);
const SymBook = () => (
  <g>
    <path d="M16 22 H46 C50 22 52 24 52 28 V88 C52 84 50 82 46 82 H16 Z" />
    <path d="M84 22 H54 C50 22 48 24 48 28 V88 C48 84 50 82 54 82 H84 Z" />
  </g>
);
const SymSyringe = () => (
  <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none">
    <line x1="20" y1="80" x2="60" y2="40" />
    <line x1="14" y1="86" x2="22" y2="78" />
    <rect x="58" y="30" width="22" height="22" rx="3" transform="rotate(45 69 41)" fill="currentColor" />
    <line x1="80" y1="20" x2="92" y2="8" />
  </g>
);

const ICONS: AppIconSpec[] = [
  {
    label: "CTI",
    bg: "#3a1620",
    bgEnd: "#5a1c2c",
    symbolColor: "#ff6b6b",
    symbol: <SymHeart />,
  },
  {
    label: "Arritmias",
    bg: "#3a2a0a",
    bgEnd: "#5a4012",
    symbolColor: palette.amber,
    symbol: <SymBolt />,
  },
  {
    label: "Sedoanalgesia",
    bg: "#1f1a3a",
    bgEnd: "#332a5a",
    symbolColor: "#b39bff",
    symbol: <SymMoon />,
  },
  {
    label: "Antibióticos",
    bg: "#0d2a1a",
    bgEnd: "#16432b",
    symbolColor: palette.green,
    symbol: <SymShield />,
  },
  {
    label: "Cálculo",
    bg: palette.navy2,
    bgEnd: palette.navy4,
    symbolColor: palette.cyanBright,
    symbol: <SymGauge />,
  },
  {
    label: "Pediatria",
    bg: "#3a1830",
    bgEnd: "#5a2448",
    symbolColor: "#ffb3d1",
    symbol: <SymBaby />,
  },
  {
    label: "Diluições",
    bg: "#0a2a36",
    bgEnd: "#114658",
    symbolColor: palette.cyan,
    symbol: <SymDrop />,
  },
  {
    label: "Distúrbios hidroeletroliticos",
    bg: "#3a1418",
    bgEnd: "#5a1c22",
    symbolColor: "#ff8a8a",
    symbol: <SymBook />,
  },
  {
    label: "DVA",
    bg: "#2a0c10",
    bgEnd: "#3a121a",
    symbolColor: palette.red,
    symbol: <SymSyringe />,
  },
];

interface AppIconProps {
  spec: AppIconSpec;
  enterFrame: number;
  exitFrame: number;
  fps: number;
}

const AppIcon: React.FC<AppIconProps> = ({ spec, enterFrame, exitFrame, fps }) => {
  const frame = useCurrentFrame();

  const enter = spring({
    fps,
    frame: frame - enterFrame,
    config: { damping: 11, stiffness: 110, mass: 0.6 },
  });

  const exit = interpolate(frame, [exitFrame, exitFrame + 14], [0, 1], {
    extrapolate: "clamp",
  });

  const scale = interpolate(enter, [0, 1], [0.4, 1]) * (1 - exit * 0.6);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * (1 - exit);
  const translateY = interpolate(exit, [0, 1], [0, -40]);

  return (
    <div
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE + 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_RADIUS,
          background: `linear-gradient(155deg, ${spec.bg} 0%, ${spec.bgEnd} 100%)`,
          boxShadow:
            "0 12px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={130}
          height={130}
          style={{ color: spec.symbolColor, fill: spec.symbolColor }}
        >
          {spec.symbol}
        </svg>
      </div>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: spec.label.length > 12 ? 16 : 22,
          fontWeight: 600,
          color: palette.white,
          letterSpacing: 0.3,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: ICON_SIZE + 8,
        }}
      >
        {spec.label}
      </div>
    </div>
  );
};

export const StoryVideoAntesDepois: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline f 60-90
  const headlineSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);
  const headlineY = interpolate(headlineSpring, [0, 1], [-30, 0]);

  // Headline fade out junto com os ícones a partir de f 130
  const headlineFadeOut = interpolate(frame, [130, 160], [1, 0], {
    extrapolate: "clamp",
  });

  // Reveal do logo Manual Virtus — f 150
  const revealSpring = spring({
    fps,
    frame: frame - 150,
    config: { damping: 13, stiffness: 105, mass: 0.9 },
  });
  const logoScale = interpolate(revealSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(revealSpring, [0, 1], [0, 1]);

  // Glow cyan que pulsa
  const glowPulse =
    0.55 +
    0.45 *
      Math.sin(((Math.max(0, frame - 150) / fps) * Math.PI * 2) / 1.6);
  const glowOpacity = interpolate(frame, [150, 175], [0, 1], {
    extrapolate: "clamp",
  });

  // Textos do reveal
  const eyebrowOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolate: "clamp",
  });
  const eyebrowY = interpolate(frame, [180, 200], [-20, 0], {
    extrapolate: "clamp",
  });

  const titleOpacity = interpolate(frame, [200, 220], [0, 1], {
    extrapolate: "clamp",
  });
  const titleY = interpolate(frame, [200, 220], [24, 0], {
    extrapolate: "clamp",
  });

  const handleOpacity = interpolate(frame, [220, 240], [0, 1], {
    extrapolate: "clamp",
  });

  // Fade out global no fim — alinhado com 450f (15s), narração termina ~f 435
  const globalFadeOut = interpolate(frame, [435, 450], [1, 0], {
    extrapolate: "clamp",
  });

  // Ícones — entrada f 0-60 com stagger, saída f 90-150 com stagger
  const gridStartX = (STAGE_W - (3 * ICON_SIZE + 2 * GRID_GAP)) / 2;
  const gridStartY = (STAGE_H - (3 * (ICON_SIZE + 56) + 2 * GRID_GAP)) / 2 - 40;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${palette.navy3} 0%, ${palette.inkDeep} 70%)`,
        opacity: globalFadeOut,
      }}
    >
      {/* Narração ElevenLabs — fade-in suave nos primeiros frames pra não estourar */}
      <Audio src={NARRATION_SRC} volume={(f) => interpolate(f, [0, 6, 435, 450], [0, 1, 1, 0], { extrapolate: "clamp" })} />

      {/* Grid 3x3 de ícones */}
      <AbsoluteFill>
        {ICONS.map((spec, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = gridStartX + col * (ICON_SIZE + GRID_GAP);
          const y = gridStartY + row * (ICON_SIZE + 56 + GRID_GAP);

          // Entrada: stagger 4 frames por ícone (linha por linha)
          const enterFrame = i * 4;
          // Saída: stagger 6 frames, esquerda→direita, cima→baixo
          const exitFrame = 90 + i * 6;

          return (
            <div
              key={spec.label}
              style={{
                position: "absolute",
                left: x,
                top: y,
              }}
            >
              <AppIcon
                spec={spec}
                enterFrame={enterFrame}
                exitFrame={exitFrame}
                fps={fps}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Headline "Agora você já pode trocar isso:" */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headlineOpacity * headlineFadeOut,
          transform: `translateY(${headlineY}px)`,
          fontFamily: fontStack,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: palette.cyanBright,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Antes
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: palette.white,
            lineHeight: 1.1,
            padding: "0 80px",
          }}
        >
          Agora você já pode
          <br />
          <span style={{ color: palette.cyanBright }}>trocar tudo isso</span>
        </div>
      </div>

      {/* Reveal — glow + logo + textos */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Glow radial cyan atrás do logo */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.cyanBright}55 0%, ${palette.cyanBright}00 60%)`,
            opacity: glowOpacity * glowPulse,
            filter: "blur(40px)",
          }}
        />

        {/* "Por isso:" eyebrow acima */}
        <div
          style={{
            position: "absolute",
            top: 620,
            opacity: eyebrowOpacity,
            transform: `translateY(${eyebrowY}px)`,
            fontFamily: fontStack,
            fontSize: 36,
            fontWeight: 500,
            color: palette.cyanBright,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Por isso, agora:
        </div>

        {/* Logo Manual Virtus centro */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Img
            src={staticFile("virtus-logo/icon.png")}
            style={{
              width: 360,
              height: 360,
              objectFit: "contain",
              filter: `drop-shadow(0 0 36px ${palette.cyanBright}aa) drop-shadow(0 8px 28px rgba(0,0,0,0.55))`,
            }}
          />
        </div>

        {/* "Guia Intensiva" abaixo */}
        <div
          style={{
            position: "absolute",
            top: 1240,
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: fontStack,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              color: palette.white,
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            Manual <span style={{ color: palette.cyanBright }}>Virtus</span>
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 34,
              fontWeight: 500,
              color: palette.whiteDim,
              letterSpacing: 1.5,
            }}
          >
            Tudo num lugar só. No bolso.
          </div>
        </div>

        {/* Handle pequeno */}
        <div
          style={{
            position: "absolute",
            bottom: 220,
            fontFamily: fontStack,
            fontSize: 28,
            fontWeight: 500,
            color: palette.whiteDim,
            letterSpacing: 2,
            opacity: handleOpacity,
          }}
        >
          manualvirtus.com.br
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default StoryVideoAntesDepois;
