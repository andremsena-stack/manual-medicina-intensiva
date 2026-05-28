import { ReactNode } from "react";
import { palette } from "../theme";

interface PhoneFrameProps {
  children: ReactNode;
  width?: number;
}

// Mock de aparelho (9:19.5) para emular a tela do app dentro da story.
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  width = 620,
}) => {
  const height = (width * 19.5) / 9;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: width * 0.13,
        padding: 12,
        background:
          "linear-gradient(180deg, #1d2733 0%, #0a1018 50%, #1d2733 100%)",
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.06) inset, 0 0 60px rgba(48,241,230,0.15)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.105,
          overflow: "hidden",
          position: "relative",
          background: palette.navy,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.32,
            height: 26,
            background: "#000",
            borderRadius: 14,
            zIndex: 5,
          }}
        />
        {children}
      </div>
    </div>
  );
};
