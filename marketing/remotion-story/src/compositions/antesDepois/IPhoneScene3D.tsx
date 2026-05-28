import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "../../theme";
import { ICONS } from "./icons";

// =============================================================================
// CANVAS TEXTURE — desenha a "tela" do smartphone (status bar + grid 3x3 apps).
// Reutiliza o array ICONS via `glyph` (1-2 chars) porque renderizar paths SVG
// dentro de canvas 2D daria muito trabalho. O grid no iPhone 3D fica como
// previa abstrata; os SVGs completos aparecem na cena 2 (AppIconsScene).
// =============================================================================

const SCREEN_W = 540;
const SCREEN_H = 1170;

const drawScreen = (ctx: CanvasRenderingContext2D) => {
  // Background gradient lock-screen
  const bg = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  bg.addColorStop(0, "#0a1018");
  bg.addColorStop(1, "#16202c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Status bar
  ctx.fillStyle = palette.white;
  ctx.font = "600 28px Inter, system-ui";
  ctx.textAlign = "left";
  ctx.fillText("07:42", 38, 50);
  ctx.textAlign = "right";
  ctx.font = "600 22px Inter, system-ui";
  ctx.fillText("●●●●●  100%", SCREEN_W - 38, 50);

  // Grid 3x3 dos 9 apps
  const cols = 3;
  const rows = 3;
  const padX = 40;
  const padY = 130;
  const cardW = (SCREEN_W - padX * 2 - 30 * (cols - 1)) / cols;
  const cardH = cardW;
  const gapX = 30;
  const gapY = 40;
  const radius = 30;

  for (let i = 0; i < ICONS.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = padX + col * (cardW + gapX);
    const y = padY + row * (cardH + gapY);
    const spec = ICONS[i];

    // Card background
    const grad = ctx.createLinearGradient(x, y, x, y + cardH);
    grad.addColorStop(0, spec.bg);
    grad.addColorStop(1, spec.bgEnd);
    ctx.fillStyle = grad;
    roundedRect(ctx, x, y, cardW, cardH, radius);
    ctx.fill();

    // Card inner shadow / highlight top
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundedRect(ctx, x, y, cardW, 3, radius / 2);
    ctx.fill();

    // Glyph central
    ctx.fillStyle = spec.symbolColor;
    ctx.font = `700 ${cardW * 0.5}px Inter, 'SF Pro Display', system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(spec.glyph, x + cardW / 2, y + cardH / 2);

    // Label below card
    ctx.fillStyle = palette.white;
    const labelFont = spec.label.length > 12 ? 14 : 18;
    ctx.font = `600 ${labelFont}px Inter, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // Quebra automatica simples — se label > 14 chars, divide na metade
    if (spec.label.length > 14) {
      const mid = Math.floor(spec.label.length / 2);
      const splitAt = spec.label.indexOf(" ", mid - 4);
      if (splitAt > 0) {
        ctx.fillText(spec.label.slice(0, splitAt), x + cardW / 2, y + cardH + 8);
        ctx.fillText(spec.label.slice(splitAt + 1), x + cardW / 2, y + cardH + 8 + labelFont + 2);
      } else {
        ctx.fillText(spec.label, x + cardW / 2, y + cardH + 8);
      }
    } else {
      ctx.fillText(spec.label, x + cardW / 2, y + cardH + 8);
    }
  }

  // Home indicator bar
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  roundedRect(ctx, SCREEN_W / 2 - 90, SCREEN_H - 22, 180, 6, 3);
  ctx.fill();
};

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
};

const useScreenTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = SCREEN_W;
    canvas.height = SCREEN_H;
    const ctx = canvas.getContext("2d");
    if (ctx) drawScreen(ctx);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);
};

// =============================================================================
// PHONE MESH — corpo arredondado escuro + tela com canvas texture + frame chamfer
// =============================================================================

// Proporcao 9:19.5 (iPhone moderno aprox), escala visual 1.6 wide × 3.4 tall
const PHONE_W = 1.6;
const PHONE_H = 3.4;
const PHONE_D = 0.18;

const Phone: React.FC<{ rotY: number; tiltX: number }> = ({ rotY, tiltX }) => {
  const screenTexture = useScreenTexture();

  return (
    <group rotation={[tiltX, rotY, 0]}>
      {/* Corpo: titanium frame escuro + chamfer leve */}
      <RoundedBox
        args={[PHONE_W, PHONE_H, PHONE_D]}
        radius={0.18}
        smoothness={6}
        bevelSegments={4}
        creaseAngle={0.4}
      >
        <meshStandardMaterial
          color="#1a1f26"
          metalness={0.85}
          roughness={0.32}
        />
      </RoundedBox>

      {/* Tela: plane levemente acima da face frontal */}
      <mesh position={[0, 0, PHONE_D / 2 + 0.001]}>
        <planeGeometry args={[PHONE_W * 0.92, PHONE_H * 0.95]} />
        <meshBasicMaterial
          map={screenTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Costas: leve gradient — mesh plane atras */}
      <mesh position={[0, 0, -PHONE_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[PHONE_W * 0.92, PHONE_H * 0.95]} />
        <meshStandardMaterial color="#10151c" metalness={0.7} roughness={0.45} />
      </mesh>

      {/* Modulo de camera tras (pequena saliencia) */}
      <mesh position={[-PHONE_W * 0.28, PHONE_H * 0.34, -PHONE_D / 2 - 0.04]}>
        <boxGeometry args={[0.42, 0.42, 0.06]} />
        <meshStandardMaterial color="#0a0f15" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
};

// =============================================================================
// SCENE — composta no ThreeCanvas, controlada por useCurrentFrame.
// Timeline interna (0-base, em frames a 30 fps):
//   0-15  : fade-in opacity + tilt setup
//   15-105: rotacao Y completa (0 -> 2π), 90f = 3s
//   105-150: para de girar, fica frontal com leve tilt
// =============================================================================

interface IPhoneScene3DProps {
  /** Frame relativo à entrada da cena (cena 1 começa em frame 0 da própria cena) */
  width: number;
  height: number;
}

export const IPhoneScene3D: React.FC<IPhoneScene3DProps> = ({ width, height }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rotY = interpolate(frame, [15, 105], [0, Math.PI * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Leve tilt pra dar sensacao de "exibido em mao" depois que para de girar
  const tiltX = interpolate(frame, [105, 130], [0, -0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera zoom-out muito sutil no fim
  const cameraZ = interpolate(frame, [105, 150], [5.5, 5.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, background: "transparent" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, cameraZ], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Iluminacao tipo "cinematic product shot" */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 6, 5]}
          intensity={1.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, 3, 2]}
          intensity={0.5}
          color={palette.cyanBright}
        />
        <pointLight position={[0, -3, 4]} intensity={0.4} color="#88aaff" />

        <Phone rotY={rotY} tiltX={tiltX} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
