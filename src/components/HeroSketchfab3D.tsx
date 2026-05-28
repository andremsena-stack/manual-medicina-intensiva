// ─────────────────────────────────────────────────────────────────────────────
// HeroSketchfab3D — embute um modelo 3D do Sketchfab (https://sketchfab.com)
// no hero da landing via iframe. Diferente do Spline (que usa JS runtime de
// ~200kb), Sketchfab é puramente iframe — zero dep npm adicional, peso só
// quando o usuário carrega.
//
// Quando o env var VITE_SKETCHFAB_MODEL_URL está vazio, o componente não
// renderiza nada (fallback gracioso).
//
// Como usar:
// 1. Acesse https://sketchfab.com e encontre/faça upload de um modelo.
// 2. Na página do modelo, clique "Embed" → "Embed code" → copie a URL
//    do `src` do iframe (algo como:
//    https://sketchfab.com/models/<MODEL_ID>/embed)
// 3. Adicione em .env.local na raiz do projeto:
//      VITE_SKETCHFAB_MODEL_URL=https://sketchfab.com/models/<MODEL_ID>/embed
// 4. Restart Vite (npm run dev).
//
// Quando usar Sketchfab vs Spline:
// - Sketchfab: modelos 3D realistas existentes — anatomia, equipamento de
//   UTI (ventilador, monitor, laringoscópio), ampolas de droga, órgãos.
//   Acervo amplo, qualidade fotorrealista, grátis pra maioria dos modelos.
// - Spline: cenas 3D estilizadas custom — fluxos abstratos, transformações,
//   animações próprias. Você cria do zero no editor visual.
//
// Mix recomendado: usar diferentes recursos por peça pra evitar uniformidade
// (ver marketing/_briefs/README.md sobre variação por design).
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  /** URL de embed do Sketchfab (https://sketchfab.com/models/<ID>/embed). Vazia = não renderiza. */
  modelUrl?: string;
  /** Classes extras (ex: posicionamento absolute). */
  className?: string;
  /** Parâmetros opcionais do viewer. Defaults pensados pra hero background:
   *  autostart, sem UI, sem watermark, tema escuro, transparente. */
  viewerParams?: Partial<SketchfabViewerParams>;
};

type SketchfabViewerParams = {
  /** Inicia rotação/animação sozinho. Default: 1 */
  autostart: 0 | 1;
  /** Mostra controles do viewer. Default: 0 (esconde) */
  ui_controls: 0 | 1;
  /** Mostra info do modelo. Default: 0 */
  ui_infos: 0 | 1;
  /** Mostra botão de "stop". Default: 0 */
  ui_stop: 0 | 1;
  /** Mostra inspector. Default: 0 */
  ui_inspector: 0 | 1;
  /** Mostra watermark Sketchfab. Default: 0 (precisa plano pago pra realmente esconder). */
  ui_watermark: 0 | 1;
  /** Mostra link pro modelo. Default: 0 */
  ui_watermark_link: 0 | 1;
  /** Tema: light | dark. Default: dark */
  ui_theme: "light" | "dark";
  /** Fundo transparente. Default: 1 */
  transparent: 0 | 1;
  /** Audio. Default: 0 */
  audio: 0 | 1;
  /** Auto-spin do modelo (em radians/s ou 0 pra parar). Default: 0.3 */
  autospin: number;
  /** Habilita zoom com scroll. Default: 0 (preserva scroll da página) */
  scrollwheel: 0 | 1;
};

const DEFAULT_PARAMS: SketchfabViewerParams = {
  autostart: 1,
  ui_controls: 0,
  ui_infos: 0,
  ui_stop: 0,
  ui_inspector: 0,
  ui_watermark: 0,
  ui_watermark_link: 0,
  ui_theme: "dark",
  transparent: 1,
  audio: 0,
  autospin: 0.3,
  scrollwheel: 0
};

function buildEmbedUrl(modelUrl: string, params: SketchfabViewerParams): string {
  // modelUrl pode vir como /models/<ID> OU /models/<ID>/embed. Normaliza.
  const normalized = modelUrl.endsWith("/embed") ? modelUrl : `${modelUrl.replace(/\/$/, "")}/embed`;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }
  return `${normalized}?${query.toString()}`;
}

export function HeroSketchfab3D({ modelUrl, className, viewerParams }: Props) {
  if (!modelUrl) {
    // Nenhum URL configurado — não renderiza nada.
    return null;
  }

  const finalParams = { ...DEFAULT_PARAMS, ...viewerParams };
  const embedUrl = buildEmbedUrl(modelUrl, finalParams);

  return (
    <div className={`hero-sketchfab-3d ${className ?? ""}`.trim()} aria-hidden="true">
      <iframe
        title="Modelo 3D"
        src={embedUrl}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="lazy"
        // sandbox propositalmente omitido: Sketchfab viewer precisa de scripts +
        // pointer-lock + same-origin. O iframe está em domínio externo confiável.
      />
    </div>
  );
}
