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
import { fontStack, palette } from "../../theme";
import { COPY } from "./copy";

// Cena 3: "Por isso, agora:" + logo Manual Virtus com glow cyan pulsando +
// titulo + handle. Estabelece o produto como solução.
//
// Timeline interna (frames relativos ao inicio da Sequence):
//   0-30   : eyebrow "Por isso, agora:" desce com fade
//   15-45  : glow cyan radial expande
//   20-50  : logo aparece com scale-up spring
//   50-75  : titulo "Manual Virtus" + tagline aparecem
//   75-90  : handle aparece
//   90-100 : hold (cena seguinte vai entrar)

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    fps,
    frame: frame - 20,
    config: { damping: 13, stiffness: 105, mass: 0.9 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Glow pulse continuo
  const glowPulse =
    0.55 + 0.45 * Math.sin(((frame / fps) * Math.PI * 2) / 1.6);
  const glowOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eyebrowOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eyebrowY = interpolate(frame, [0, 25], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [50, 75], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const handleOpacity = interpolate(frame, [75, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Glow radial cyan atras do logo */}
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

      {/* Eyebrow */}
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
        {COPY.POR_ISSO}
      </div>

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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

      {/* Titulo "Manual Virtus" + tagline */}
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
          {COPY.BRAND_PREFIX}{" "}
          <span style={{ color: palette.cyanBright }}>{COPY.BRAND_SUFFIX}</span>
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
          {COPY.TAGLINE}
        </div>
      </div>

      {/* Handle */}
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
        {COPY.HANDLE}
      </div>
    </AbsoluteFill>
  );
};
