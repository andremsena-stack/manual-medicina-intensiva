import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { beatColors, fontStack, palette } from "../theme";
import type { HookBeat as HookBeatT } from "../types";

interface Props {
  payload: HookBeatT["payload"];
}

// Hook: tipografia grande, palavra-acento pulsante, cardiograma na base.
export const HookBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = beatColors.hook;

  const eyebrowProgress = spring({ frame, fps, config: { damping: 18 } });
  const line1Progress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16 },
  });
  const line2Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16 },
  });

  const pulse = 1 + Math.sin(frame / 6) * 0.04;

  // ECG-like animated polyline
  const ecgPhase = (frame * 12) % (width + 200);

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      {/* Cardiograma de fundo */}
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "flex-end" }}
      >
        <svg
          width={width}
          height={240}
          viewBox={`0 0 ${width} 240`}
          style={{ opacity: 0.55 }}
        >
          <defs>
            <linearGradient id="ecgFade" x1="0" x2="1">
              <stop offset="0" stopColor={c.accent} stopOpacity="0" />
              <stop offset="0.5" stopColor={c.accent} stopOpacity="1" />
              <stop offset="1" stopColor={c.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M0 120 L${ecgPhase - 280} 120 L${ecgPhase - 200} 120 L${
              ecgPhase - 160
            } 60 L${ecgPhase - 130} 200 L${ecgPhase - 100} 30 L${
              ecgPhase - 70
            } 160 L${ecgPhase - 40} 120 L${width} 120`}
            fill="none"
            stroke="url(#ecgFade)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: "0 90px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {payload.eyebrow ? (
          <div
            style={{
              opacity: eyebrowProgress,
              transform: `translateY(${(1 - eyebrowProgress) * 16}px)`,
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: c.accent,
              fontWeight: 600,
              marginBottom: 36,
            }}
          >
            {payload.eyebrow}
          </div>
        ) : null}

        <div
          style={{
            opacity: line1Progress,
            transform: `translateY(${(1 - line1Progress) * 32}px)`,
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 880,
          }}
        >
          {payload.line1}
        </div>

        {payload.accentWord ? (
          <div
            style={{
              opacity: line2Progress,
              transform: `scale(${pulse})`,
              fontSize: 124,
              fontWeight: 900,
              color: c.accent,
              lineHeight: 1,
              marginTop: 18,
              textShadow: `0 0 30px ${c.accent}66`,
            }}
          >
            {payload.accentWord}
          </div>
        ) : null}

        {payload.line2 ? (
          <div
            style={{
              opacity: line2Progress,
              transform: `translateY(${(1 - line2Progress) * 24}px)`,
              fontSize: 42,
              fontWeight: 500,
              color: palette.whiteDim,
              marginTop: 26,
              maxWidth: 820,
              lineHeight: 1.3,
            }}
          >
            {payload.line2}
          </div>
        ) : null}
      </AbsoluteFill>

      {/* Tag canto superior */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          fontSize: 22,
          letterSpacing: 4,
          color: palette.whiteFaint,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        VIRTUS / CLINICAL TOOLS
      </div>
    </AbsoluteFill>
  );
};
