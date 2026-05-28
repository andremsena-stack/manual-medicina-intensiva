import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { beatColors, fontStack, palette } from "../theme";
import type { StatBeat as StatBeatT } from "../types";

interface Props {
  payload: StatBeatT["payload"];
}

// Stat: numero gigante anima de 0 ate o alvo. Anel radial em volta.
export const StatBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.stat;

  const target = parseFloat(payload.value.replace(/[^\d.]/g, "")) || 0;
  const decimals = (payload.value.split(".")[1] || "").length;
  const countProgress = spring({
    frame,
    fps,
    config: { damping: 30, mass: 1.4 },
  });
  const displayed = (target * countProgress).toFixed(decimals);

  const ringProgress = spring({
    frame,
    fps,
    config: { damping: 22 },
  });

  const captionOpacity = interpolate(frame, [22, 38], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      <AbsoluteFill
        style={{
          padding: "0 90px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: c.accent,
            marginBottom: 36,
            opacity: captionOpacity,
          }}
        >
          O dado que ninguém fala
        </div>

        <div
          style={{
            position: "relative",
            width: 720,
            height: 720,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={720}
            height={720}
            viewBox="0 0 720 720"
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotate(-90deg)",
            }}
          >
            <circle
              cx="360"
              cy="360"
              r="320"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            <circle
              cx="360"
              cy="360"
              r="320"
              fill="none"
              stroke={c.accent}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 320}
              strokeDashoffset={2 * Math.PI * 320 * (1 - ringProgress * 0.75)}
              style={{ filter: `drop-shadow(0 0 18px ${c.accent}88)` }}
            />
          </svg>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 240,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -8,
                color: palette.white,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayed}
              {payload.unit ? (
                <span
                  style={{
                    fontSize: 100,
                    color: c.accent,
                    marginLeft: 12,
                  }}
                >
                  {payload.unit}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            marginTop: 56,
            maxWidth: 880,
            textAlign: "center",
            lineHeight: 1.3,
            opacity: captionOpacity,
          }}
        >
          {payload.caption}
        </div>

        {payload.source ? (
          <div
            style={{
              fontSize: 22,
              color: palette.whiteFaint,
              marginTop: 28,
              letterSpacing: 1,
              opacity: captionOpacity,
            }}
          >
            {payload.source}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
