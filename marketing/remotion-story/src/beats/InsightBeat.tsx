import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { beatColors, fontStack, palette } from "../theme";
import type { InsightBeat as InsightBeatT } from "../types";

interface Props {
  payload: InsightBeatT["payload"];
}

// Insight: citacao com barra lateral cyan que cresce + texto por palavras.
export const InsightBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.insight;

  const barHeight = spring({ frame, fps, config: { damping: 18 } });
  const words = payload.quote.split(" ");

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

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
              fontSize: 26,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: c.accent,
              marginBottom: 36,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {payload.eyebrow}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div
            style={{
              width: 8,
              minHeight: 340,
              background: `linear-gradient(180deg, ${c.accent}, ${c.accent}55)`,
              borderRadius: 4,
              boxShadow: `0 0 20px ${c.accent}66`,
              transformOrigin: "top",
              transform: `scaleY(${barHeight})`,
            }}
          />

          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: -1,
              maxWidth: 820,
            }}
          >
            {words.map((w, i) => {
              const local = interpolate(
                frame,
                [10 + i * 3, 22 + i * 3],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <span
                  key={i}
                  style={{
                    opacity: local,
                    display: "inline-block",
                    transform: `translateY(${(1 - local) * 14}px)`,
                    marginRight: 14,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>

        {payload.attribution ? (
          <div
            style={{
              marginTop: 56,
              marginLeft: 40,
              fontSize: 28,
              color: palette.whiteDim,
              fontStyle: "italic",
              opacity: interpolate(frame, [40, 55], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {payload.attribution}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
