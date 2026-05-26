"""
Detecta e remove margens brancas das imagens inline (data URI base64) dos
módulos HTML. Mantém a imagem nas mesmas dimensões visíveis, apenas removendo
o whitespace ao redor do conteúdo.

Uso:
    python scripts/crop-module-images.py src/data/modules/modulo_01_via_aerea_iot.html

Estratégia:
1. Encontrar todos os data URIs <img src="data:image/...;base64,...">
2. Para cada um:
   - Decodificar base64 -> bytes da imagem
   - Abrir com Pillow
   - Detectar bbox do conteúdo (não-branco) com ImageChops.difference vs fundo branco
   - Aplicar threshold tolerante (anti-aliasing) caso o bbox vazio
   - Crop com padding pequeno (4px) preservando contexto
   - Re-encodar
3. Substituir no HTML
"""

import base64
import re
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageChops, ImageOps


WHITE = (255, 255, 255)
NEAR_WHITE_THRESHOLD = 245  # qualquer pixel com algum canal < 245 é "conteúdo"
PADDING = 4                  # margem de respiro após crop


def trim_image(raw_bytes: bytes, fmt_hint: str) -> tuple[bytes, str, tuple[int, int], tuple[int, int]]:
    """Recebe bytes da imagem original e retorna bytes cortados.

    Retorna (cropped_bytes, output_fmt, original_size, new_size).
    """
    img = Image.open(BytesIO(raw_bytes))
    img.load()
    original_size = img.size

    # Normaliza para RGB: PNG com transparência -> fundo branco; P -> RGB
    if img.mode == "RGBA":
        rgb_bg = Image.new("RGB", img.size, WHITE)
        rgb_bg.paste(img, mask=img.split()[3])
        rgb = rgb_bg
    elif img.mode != "RGB":
        rgb = img.convert("RGB")
    else:
        rgb = img

    # Estratégia 1: ImageChops.difference contra fundo branco — rápido, exato.
    bg = Image.new("RGB", rgb.size, WHITE)
    diff = ImageChops.difference(rgb, bg)
    bbox = diff.getbbox()

    # Estratégia 2 (fallback): se bbox cobrir tudo (ou nada), usar threshold
    # tolerante para ignorar anti-aliasing/JPEG noise.
    if bbox is None or bbox == (0, 0, *rgb.size):
        gray = rgb.convert("L")
        # Inverte e aplica threshold: pixels claros (>=245) viram 0 (fundo);
        # pixels escuros (<245) viram conteúdo.
        thresh = gray.point(lambda v: 0 if v >= NEAR_WHITE_THRESHOLD else 255)
        bbox = thresh.getbbox()

    if not bbox:
        # Imagem completamente branca? Devolver original.
        return raw_bytes, fmt_hint, original_size, original_size

    # Aplica padding controlado
    left, top, right, bottom = bbox
    w, h = rgb.size
    left = max(0, left - PADDING)
    top = max(0, top - PADDING)
    right = min(w, right + PADDING)
    bottom = min(h, bottom + PADDING)

    cropped = img.crop((left, top, right, bottom))
    new_size = cropped.size

    # Se o crop não removeu nada significativo (< 1% por borda), devolver original
    # para evitar regravar com formato/perda diferente.
    crop_ratio = (
        (left / w + (w - right) / w + top / h + (h - bottom) / h) / 4
    )
    if crop_ratio < 0.01:
        return raw_bytes, fmt_hint, original_size, original_size

    buf = BytesIO()
    out_fmt = fmt_hint.upper()
    if out_fmt in ("JPG",):
        out_fmt = "JPEG"

    if out_fmt == "JPEG":
        # Convert RGBA->RGB para JPEG
        if cropped.mode in ("RGBA", "P", "LA"):
            rgb_out = Image.new("RGB", cropped.size, WHITE)
            if cropped.mode == "RGBA":
                rgb_out.paste(cropped, mask=cropped.split()[3])
            else:
                rgb_out.paste(cropped.convert("RGBA"), mask=cropped.convert("RGBA").split()[3])
            cropped = rgb_out
        cropped.save(buf, format="JPEG", quality=85, optimize=True, progressive=True)
    elif out_fmt == "PNG":
        cropped.save(buf, format="PNG", optimize=True)
    else:
        # Fallback: PNG
        out_fmt = "PNG"
        cropped.save(buf, format="PNG", optimize=True)

    return buf.getvalue(), out_fmt.lower(), original_size, new_size


def process_html(path: Path) -> None:
    html = path.read_text(encoding="utf-8")
    pattern = re.compile(r"data:image/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)")

    matches = list(pattern.finditer(html))
    print(f"\n[crop] {path.name}: {len(matches)} imagem(ns) data-URI encontrada(s)")

    if not matches:
        return

    replacements: list[tuple[int, int, str]] = []
    for i, m in enumerate(matches, 1):
        fmt = m.group(1).lower()
        b64 = m.group(2)
        try:
            raw = base64.b64decode(b64)
        except Exception as e:
            print(f"  #{i}: falha ao decodificar base64 ({e})")
            continue

        try:
            new_bytes, new_fmt, orig_size, new_size = trim_image(raw, fmt)
        except Exception as e:
            print(f"  #{i}: falha ao cortar ({type(e).__name__}: {e})")
            continue

        if new_bytes is raw or len(new_bytes) == len(raw):
            print(f"  #{i} ({fmt} {orig_size[0]}x{orig_size[1]}): sem crop significativo")
            continue

        new_b64 = base64.b64encode(new_bytes).decode("ascii")
        new_uri = f"data:image/{new_fmt};base64,{new_b64}"
        reduction_pct = 100.0 * (1 - len(new_bytes) / len(raw))
        print(
            f"  #{i} ({fmt}): {orig_size[0]}x{orig_size[1]} -> {new_size[0]}x{new_size[1]}  "
            f"({len(raw):,} -> {len(new_bytes):,} bytes, -{reduction_pct:.1f}%)"
        )
        replacements.append((m.start(), m.end(), new_uri))

    if not replacements:
        print("  (nenhuma alteração)")
        return

    # Aplica substituições de trás pra frente para preservar índices
    new_html = html
    for start, end, new_uri in reversed(replacements):
        new_html = new_html[:start] + new_uri + new_html[end:]

    path.write_text(new_html, encoding="utf-8")
    print(f"  OK {len(replacements)} imagem(ns) reescrita(s) em {path.name}")


def main() -> None:
    if len(sys.argv) < 2:
        # Default: processar Mod 1
        targets = [Path("src/data/modules/modulo_01_via_aerea_iot.html")]
    else:
        targets = [Path(p) for p in sys.argv[1:]]

    for path in targets:
        if not path.exists():
            print(f"[skip] {path} não existe")
            continue
        process_html(path)


if __name__ == "__main__":
    main()
