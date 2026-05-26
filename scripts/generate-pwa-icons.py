#!/usr/bin/env python3
"""
Gera os PNGs de PWA a partir do icon-only transparente.

Saidas em public/pwa-icons/:
  - icon-192.png          (Android Chrome, any)
  - icon-512.png          (Android splash + display, any)
  - icon-192-maskable.png (Android adaptativo, com safe-area)
  - icon-512-maskable.png (Android adaptativo, com safe-area)
  - apple-touch-icon.png  (iOS, 180x180)

Maskable icon: o logo central ocupa ~70% do canvas; restante (30% borda)
e fundo navy do brand (#0d2438), garantindo que o SO possa cortar em
qualquer forma (circulo, squircle, rounded square) sem perder o miolo.
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "virtus-logo" / "virtus_icon_only_transparente.png"
OUT_DIR = ROOT / "public" / "pwa-icons"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BRAND_DEEP = (13, 36, 56, 255)  # #0d2438

def make_any(size: int, out_name: str) -> None:
    """Icon 'any': logo escalado no canvas, fundo transparente."""
    src = Image.open(SRC).convert("RGBA")
    src_size = max(src.size)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target = int(size * 0.92)  # ~8% margem
    scale = target / src_size
    new_size = (int(src.size[0] * scale), int(src.size[1] * scale))
    resized = src.resize(new_size, Image.LANCZOS)
    offset = ((size - new_size[0]) // 2, (size - new_size[1]) // 2)
    canvas.paste(resized, offset, resized)
    canvas.save(OUT_DIR / out_name, "PNG", optimize=True)
    print(f"  OK {out_name} ({size}x{size})")

def make_maskable(size: int, out_name: str) -> None:
    """Icon maskable: fundo navy + logo centralizado em safe-area (~70%)."""
    src = Image.open(SRC).convert("RGBA")
    src_size = max(src.size)
    canvas = Image.new("RGBA", (size, size), BRAND_DEEP)
    target = int(size * 0.62)  # safe-area: logo ocupa 62% do canvas
    scale = target / src_size
    new_size = (int(src.size[0] * scale), int(src.size[1] * scale))
    resized = src.resize(new_size, Image.LANCZOS)
    offset = ((size - new_size[0]) // 2, (size - new_size[1]) // 2)
    canvas.paste(resized, offset, resized)
    canvas.save(OUT_DIR / out_name, "PNG", optimize=True)
    print(f"  OK {out_name} ({size}x{size}, maskable, bg navy)")

def make_apple_touch(size: int = 180) -> None:
    """Apple Touch Icon: PNG quadrado com fundo navy (iOS nao aceita transparencia)."""
    src = Image.open(SRC).convert("RGBA")
    src_size = max(src.size)
    canvas = Image.new("RGBA", (size, size), BRAND_DEEP)
    target = int(size * 0.78)
    scale = target / src_size
    new_size = (int(src.size[0] * scale), int(src.size[1] * scale))
    resized = src.resize(new_size, Image.LANCZOS)
    offset = ((size - new_size[0]) // 2, (size - new_size[1]) // 2)
    canvas.paste(resized, offset, resized)
    canvas.save(OUT_DIR / "apple-touch-icon.png", "PNG", optimize=True)
    print(f"  OK apple-touch-icon.png ({size}x{size}, navy bg)")

if __name__ == "__main__":
    print(f"[source] {SRC}")
    print(f"[output] {OUT_DIR}/")
    make_any(192, "icon-192.png")
    make_any(512, "icon-512.png")
    make_maskable(192, "icon-192-maskable.png")
    make_maskable(512, "icon-512-maskable.png")
    make_apple_touch(180)
    print("Done.")
