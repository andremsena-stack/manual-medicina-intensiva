import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontStack, palette } from "../../theme";
import { AppIconSpec, ICONS } from "./icons";
import { COPY } from "./copy";

// Cena 2: grid 3x3 dos 9 apps clinicos flutuando + headline "Agora voce pode
// substituir tudo isso", entrada com bounce, saida com voo (esq->dir, cima->baixo).
//
// Timeline interna (frames relativos ao inicio da Sequence):
//   0-20    : grid bounce-in stagger (4f por icone)
//   20-50   : headline desce com slide+fade
//   50-80   : hold
//   80-140  : icones voam pra fora (stagger 6f) + headline desliza pra cima

const ICON_SIZE = 220;
const ICON_RADIUS = 48;
const GRID_GAP = 36;
const STAGE_W = 1080;
const STAGE_H = 1920;

interface AppIconCardProps {
  spec: AppIconSpec;
  enterFrame: number;
  exitFrame: number;
  fps: number;
  exitDirection: { dx: number; dy: number };
}

const AppIconCard: React.FC<AppIconCardProps> = ({
  spec,
  enterFrame,
  exitFrame,
  fps,
  exitDirection,
}) => {
  const frame = useCurrentFrame();

  const enter = spring({
    fps,
    frame: frame - enterFrame,
    config: { damping: 11, stiffness: 110, mass: 0.6 },
  });

  const exit = interpolate(frame, [exitFrame, exitFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(enter, [0, 1], [0.4, 1]) * (1 - exit * 0.7);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * (1 - exit);
  const flyX = interpolate(exit, [0, 1], [0, exitDirection.dx * 600]);
  const flyY = interpolate(exit, [0, 1], [0, exitDirection.dy * 600]);
  const rotate = interpolate(exit, [0, 1], [0, exitDirection.dx * 35]);

  return (
    <div
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE + 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `translate(${flyX}px, ${flyY}px) scale(${scale}) rotate(${rotate}deg)`,
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

export const AppIconsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline f 20-50 entra, f 110-140 sai
  const headSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });
  const headOpacity = interpolate(headSpring, [0, 1], [0, 1]);
  const headY = interpolate(headSpring, [0, 1], [-30, 0]);
  const headFadeOut = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headLiftOut = interpolate(frame, [110, 140], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grid layout 3x3
  const gridStartX = (STAGE_W - (3 * ICON_SIZE + 2 * GRID_GAP)) / 2;
  const gridStartY = (STAGE_H - (3 * (ICON_SIZE + 56) + 2 * GRID_GAP)) / 2 - 40;

  // Direcoes de saida: ondas radiais saindo do centro
  const exitDirs = [
    { dx: -1.2, dy: -1.0 },
    { dx: 0, dy: -1.4 },
    { dx: 1.2, dy: -1.0 },
    { dx: -1.4, dy: 0 },
    { dx: 0, dy: 1.4 },
    { dx: 1.4, dy: 0 },
    { dx: -1.2, dy: 1.0 },
    { dx: 0, dy: 1.4 },
    { dx: 1.2, dy: 1.0 },
  ];

  return (
    <AbsoluteFill>
      {/* Grid de icones */}
      <AbsoluteFill>
        {ICONS.map((spec, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = gridStartX + col * (ICON_SIZE + GRID_GAP);
          const y = gridStartY + row * (ICON_SIZE + 56 + GRID_GAP);
          const enterFrame = i * 3;
          const exitFrame = 80 + i * 6;

          return (
            <div
              key={spec.label}
              style={{ position: "absolute", left: x, top: y }}
            >
              <AppIconCard
                spec={spec}
                enterFrame={enterFrame}
                exitFrame={exitFrame}
                fps={fps}
                exitDirection={exitDirs[i]}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headOpacity * headFadeOut,
          transform: `translateY(${headY + headLiftOut}px)`,
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
          {COPY.ANTES_LABEL}
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
          {COPY.SUBSTITUI_HEADLINE_LINE1}
          <br />
          <span style={{ color: palette.cyanBright }}>
            {COPY.SUBSTITUI_HEADLINE_LINE2}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
