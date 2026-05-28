import { Suspense, lazy } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// HeroSpline3D — embute uma cena 3D do Spline (https://spline.design) no
// hero da landing. Quando o env var VITE_SPLINE_SCENE_URL está vazio, o
// componente não renderiza nada (fallback gracioso para o canvas animado).
//
// Como usar:
// 1. Acesse https://spline.design (free tier ok).
// 2. Crie/abra uma cena (ex: um phone 3D, ampolas flutuando, dispositivos).
// 3. Clique em "Export" → "Code Export" → copie a URL do .splinecode.
// 4. Adicione em .env.local na raiz do projeto:
//      VITE_SPLINE_SCENE_URL=https://prod.spline.design/SEU-ID/scene.splinecode
// 5. Restart Vite (npm run dev).
//
// Dicas de cena pro Manual:
// - Mantém estilo escuro casando com nossa paleta (#041018 background, #30f1e6 accent)
// - Loop infinito de animação leve (rotation lenta + float sutil), sem clicks
// - Evita modelos pesados (>5MB cancelam a vantagem do canvas leve)
// - Idealmente cena com transparência (não retângulo opaco que cobre o hero)
// ─────────────────────────────────────────────────────────────────────────────

// Lazy load: Spline runtime é ~200kb. Só baixa se a env var estiver setada.
// LazyExoticComponent retorna React.lazy resolvido no client (Vite handles SSR/build).
const Spline = lazy(() => import("@splinetool/react-spline"));

type Props = {
  /** URL .splinecode exportada do editor Spline. Vazia = não renderiza. */
  sceneUrl?: string;
  /** Classes extras (ex: posicionamento absolute). */
  className?: string;
  /** Callback opcional quando Spline carrega (útil pra fade-out de skeleton). */
  onLoad?: () => void;
};

export function HeroSpline3D({ sceneUrl, className, onLoad }: Props) {
  if (!sceneUrl) {
    // Nenhum URL configurado — não consome bandwidth, não baixa o bundle Spline.
    return null;
  }

  return (
    <div className={`hero-spline-3d ${className ?? ""}`.trim()} aria-hidden="true">
      <Suspense fallback={null}>
        <Spline scene={sceneUrl} onLoad={onLoad} />
      </Suspense>
    </div>
  );
}
