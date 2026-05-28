import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { beatColors, fontStack, palette } from "../theme";
import type { ProblemBeat as ProblemBeatT } from "../types";

interface Props {
  payload: ProblemBeatT["payload"];
}

// Problem: lista vermelha com slash riscando cada item.
export const ProblemBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.problem;

  const titleSpring = spring({ frame, fps, config: { damping: 16 } });

  // Shake sutil
  const shake = frame < 12 ? Math.sin(frame * 1.8) * (12 - frame) * 0.6 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      <AbsoluteFill
        style={{
          padding: "0 90px",
          justifyContent: "center",
          alignItems: "flex-start",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            opacity: titleSpring,
            transform: `translateX(${(1 - titleSpring) * -40}px)`,
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginBottom: 64,
          }}
        >
          <div
            style={{
              width: 16,
              height: 76,
              background: c.accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 820,
            }}
          >
            {payload.title}
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}>
          {payload.bullets.map((b, i) => {
            const start = 18 + i * 14;
            const local = spring({
              frame: frame - start,
              fps,
              config: { damping: 14 },
            });
            const strikeWidth = spring({
              frame: frame - (start + 22),
              fps,
              config: { damping: 18 },
            });
            return (
              <li
                key={i}
                style={{
                  opacity: local,
                  transform: `translateX(${(1 - local) * 30}px)`,
                  position: "relative",
                  fontSize: 44,
                  fontWeight: 600,
                  color: palette.white,
                  padding: "22px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: palette.redSoft,
                    color: c.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  X
                </span>
                <span style={{ position: "relative" }}>
                  {b}
                  <span
                    style={{
                      position: "absolute",
                      left: -4,
                      right: -4,
                      top: "55%",
                      height: 4,
                      background: c.accent,
                      transformOrigin: "left center",
                      transform: `scaleX(${strikeWidth})`,
                      borderRadius: 2,
                      opacity: 0.85,
                    }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
