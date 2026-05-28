import { Img, staticFile } from "remotion";
import { palette } from "../theme";

interface VirtusMarkProps {
  size?: number;
  glow?: boolean;
  variant?: "icon" | "horizontal";
}

// Marca oficial Virtus carregada do PNG transparente em /public/virtus-logo/.
// `icon`       -> monograma quadrado (logo de assinatura final, app icon)
// `horizontal` -> lockup horizontal (cabecalho, rodape de cards)
//
// Fallback: se o asset nao estiver disponivel, exibimos um placeholder em SVG
// pra nao quebrar a build do estudio.
export const VirtusMark: React.FC<VirtusMarkProps> = ({
  size = 120,
  glow = true,
  variant = "icon",
}) => {
  const src =
    variant === "horizontal"
      ? staticFile("virtus-logo/horizontal.png")
      : staticFile("virtus-logo/icon.png");

  // Lockup horizontal e ~3.4x mais largo que alto (medido no PNG oficial).
  const width = variant === "horizontal" ? size * 3.4 : size;
  const height = size;

  return (
    <Img
      src={src}
      style={{
        width,
        height,
        objectFit: "contain",
        filter: glow
          ? `drop-shadow(0 0 24px ${palette.cyanBright}66) drop-shadow(0 4px 18px rgba(0,0,0,0.45))`
          : undefined,
      }}
    />
  );
};
