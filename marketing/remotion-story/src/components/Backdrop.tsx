import { AbsoluteFill, useCurrentFrame } from "remotion";

interface BackdropProps {
  from: string;
  to: string;
  accent?: string;
  noise?: boolean;
}

// Fundo radial animado + grid sutil. Cada beat herda a paleta correta.
export const Backdrop: React.FC<BackdropProps> = ({
  from,
  to,
  accent,
  noise = true,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 30;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
        }}
      />
      {accent ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${
              50 + drift
            }% ${30 + drift / 2}%, ${accent}33 0%, transparent 55%)`,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.45,
          maskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
        }}
      />
      {noise ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "3px 3px",
            opacity: 0.4,
            mixBlendMode: "overlay",
          }}
        />
      ) : null}
    </>
  );
};
