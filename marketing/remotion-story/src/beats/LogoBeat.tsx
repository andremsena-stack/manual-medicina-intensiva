import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { VirtusMark } from "../components/VirtusMark";
import { beatColors, fontStack, palette } from "../theme";
import type { LogoBeat as LogoBeatT } from "../types";

interface Props {
  payload: LogoBeatT["payload"];
}

// Logo: assinatura final centralizada com swoosh de luz.
export const LogoBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const c = beatColors.logo;

  const markIn = spring({ frame, fps, config: { damping: 12 } });
  const taglineIn = interpolate(frame, [14, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame, [6, 40], [-width, width], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: fontStack,
        color: c.text,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      {/* Luz que passa por tras */}
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: sweep,
            width: 400,
            height: 1200,
            background: `linear-gradient(90deg, transparent, ${c.accent}55, transparent)`,
            filter: "blur(40px)",
            transform: "translateY(-50%) rotate(15deg)",
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          textAlign: "center",
          transform: `scale(${markIn})`,
          opacity: markIn,
        }}
      >
        <VirtusMark variant="horizontal" size={140} />
        <div
          style={{
            marginTop: 18,
            fontSize: 26,
            letterSpacing: 8,
            color: c.accent,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Clinical Tools
        </div>
        {payload.tagline ? (
          <div
            style={{
              marginTop: 36,
              fontSize: 30,
              color: palette.whiteDim,
              opacity: taglineIn,
              transform: `translateY(${(1 - taglineIn) * 16}px)`,
              maxWidth: 800,
              lineHeight: 1.3,
            }}
          >
            {payload.tagline}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          fontSize: 22,
          color: palette.whiteFaint,
          letterSpacing: 4,
        }}
      >
        manualvirtus.com.br
      </div>
    </AbsoluteFill>
  );
};
