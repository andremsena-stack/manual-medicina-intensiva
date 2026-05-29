"""
Gerador do carrossel "Cenário clínico: TCE → SIADH → IOT → vasoativas →
correção de hipernatremia" — Manual Virtus.

11 slides 1080×1350 (Instagram 4:5). PNG por slide.

Uso:
    cd marketing/carrossel-cenario-tce-siadh
    python generate.py

Saída: slides/slide_01.png ... slide_11.png

Fontes: tenta Inter; cai pra Segoe UI Bold/Regular (Windows) ou Arial.
Pra usar Inter em todas as máquinas, baixe e instale a família em
https://fonts.google.com/specimen/Inter, ou coloque .ttf em fonts/.

Regras clínicas (CLAUDE.md §1): números canônicos do Mod 5/6 do Manual,
não inventar doses. Hipernatremia >10 mEq/L em 24h = risco de mielinólise
pontina (regra obrigatória).
"""

from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# =========================================================================
# CONSTANTS
# =========================================================================

W, H = 1080, 1350  # Instagram 4:5 feed alto
HERE = Path(__file__).parent
OUT = HERE / "slides"
OUT.mkdir(exist_ok=True)
LOGO_PATH = HERE / "assets" / "icon.png"

# Paleta exata do projeto (src/theme.ts)
PALETTE = {
    "ink": "#040d18",
    "ink_deep": "#020812",
    "navy": "#081726",
    "navy2": "#0a1d2e",
    "navy3": "#0d2438",
    "navy4": "#123c69",
    "cyan": "#12bed1",
    "cyan_bright": "#30f1e6",
    "cyan_soft": (48, 241, 230, 46),  # 0.18 alpha
    "amber": "#f4b740",
    "red": "#ef4444",
    "red_soft": (239, 68, 68, 46),
    "green": "#22c55e",
    "white": "#f5f9fc",
    "white_dim": (245, 249, 252, 184),  # 0.72
    "white_faint": (245, 249, 252, 107),  # 0.42
}

# =========================================================================
# FONTS
# =========================================================================


def _try_fonts(names: list[str], size: int) -> ImageFont.FreeTypeFont:
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    """Resolve fonte por weight semântico."""
    if weight == "bold":
        return _try_fonts(
            [
                str(HERE / "fonts" / "Inter-Bold.ttf"),
                "C:/Windows/Fonts/Inter-Bold.ttf",
                "C:/Windows/Fonts/segoeuib.ttf",
                "C:/Windows/Fonts/arialbd.ttf",
            ],
            size,
        )
    if weight == "semibold":
        return _try_fonts(
            [
                str(HERE / "fonts" / "Inter-SemiBold.ttf"),
                "C:/Windows/Fonts/Inter-SemiBold.ttf",
                "C:/Windows/Fonts/segoeuisb.ttf",
                "C:/Windows/Fonts/segoeuib.ttf",
            ],
            size,
        )
    if weight == "medium":
        return _try_fonts(
            [
                str(HERE / "fonts" / "Inter-Medium.ttf"),
                "C:/Windows/Fonts/Inter-Medium.ttf",
                "C:/Windows/Fonts/segoeui.ttf",
                "C:/Windows/Fonts/arial.ttf",
            ],
            size,
        )
    # regular
    return _try_fonts(
        [
            str(HERE / "fonts" / "Inter-Regular.ttf"),
            "C:/Windows/Fonts/Inter.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ],
        size,
    )


# =========================================================================
# DRAWING UTILS
# =========================================================================


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def gradient_v(
    img: Image.Image, top: str, bottom: str, x0: int = 0, y0: int = 0, x1=None, y1=None
):
    """Desenha um gradient vertical do top pro bottom no retângulo."""
    if x1 is None:
        x1 = img.width
    if y1 is None:
        y1 = img.height
    r1, g1, b1 = hex_to_rgb(top)
    r2, g2, b2 = hex_to_rgb(bottom)
    h = y1 - y0
    for i in range(h):
        ratio = i / max(1, h - 1)
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        ImageDraw.Draw(img).rectangle([x0, y0 + i, x1, y0 + i + 1], fill=(r, g, b))


def gradient_radial_glow(
    img: Image.Image,
    cx: int,
    cy: int,
    radius: int,
    color: str,
    alpha: int = 100,
):
    """Adiciona glow radial centrado em (cx,cy)."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    rgb = hex_to_rgb(color)
    steps = 60
    for i in range(steps, 0, -1):
        r = int(radius * i / steps)
        a = int(alpha * (1 - i / steps) ** 2)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*rgb, a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(40))
    img.alpha_composite(overlay)


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill=None,
    outline=None,
    width: int = 0,
):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_chip(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    fg: str = None,
    bg: tuple = None,
    fz: int = 24,
):
    """Desenha um pequeno chip pílula com texto upper."""
    if fg is None:
        fg = PALETTE["cyan_bright"]
    if bg is None:
        bg = PALETTE["cyan_soft"]
    f = font("semibold", fz)
    text = text.upper()
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x = 22
    pad_y = 12
    w = tw + pad_x * 2
    h = th + pad_y * 2
    rounded_rect(draw, (x, y, x + w, y + h), radius=h // 2, fill=bg)
    draw.text(
        (x + pad_x, y + pad_y - bbox[1]),
        text,
        font=f,
        fill=fg,
    )
    return w, h


def draw_text_wrapped(
    draw: ImageDraw.ImageDraw,
    pos: tuple[int, int],
    text: str,
    max_width: int,
    font_obj: ImageFont.FreeTypeFont,
    fill: str,
    line_spacing: float = 1.18,
) -> int:
    """Quebra texto em linhas que cabem em max_width. Retorna y final."""
    x, y = pos
    words = text.split()
    lines: list[str] = []
    current = ""
    for w_ in words:
        test = w_ if not current else current + " " + w_
        bbox = draw.textbbox((0, 0), test, font=font_obj)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = w_
    if current:
        lines.append(current)
    line_h = (font_obj.size or 24) * line_spacing
    for i, line in enumerate(lines):
        draw.text((x, y + int(line_h * i)), line, font=font_obj, fill=fill)
    return int(y + line_h * len(lines))


def draw_page_marker(
    draw: ImageDraw.ImageDraw, idx: int, total: int
):
    """Indicador [01/11] no canto sup direito."""
    txt = f"{idx:02d}/{total:02d}"
    f = font("semibold", 22)
    bbox = draw.textbbox((0, 0), txt, font=f)
    tw = bbox[2] - bbox[0]
    draw.text(
        (W - 56 - tw, 56),
        txt,
        font=f,
        fill=PALETTE["white_faint"],
    )


def draw_footer_handle(draw: ImageDraw.ImageDraw, with_brand: bool = True):
    """Rodapé com handle. with_brand=False pra slide 11 que já é todo brand."""
    if not with_brand:
        return
    f = font("medium", 22)
    txt = "manualvirtus.com.br"
    bbox = draw.textbbox((0, 0), txt, font=f)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((W - tw) // 2, H - 64),
        txt,
        font=f,
        fill=PALETTE["white_faint"],
    )


def draw_logo(img: Image.Image, x: int, y: int, size: int, glow: bool = True):
    """Desenha o logo Manual Virtus."""
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo.thumbnail((size, size))
        # Glow
        if glow:
            glow_img = Image.new("RGBA", logo.size, (0, 0, 0, 0))
            for r in range(20, 0, -2):
                blur_layer = Image.new(
                    "RGBA", logo.size, (*hex_to_rgb(PALETTE["cyan_bright"]), 30)
                )
                blur_layer.putalpha(logo.split()[-1])
                blur_layer = blur_layer.filter(ImageFilter.GaussianBlur(r))
                glow_img.alpha_composite(blur_layer)
            img.alpha_composite(glow_img, (x, y))
        img.alpha_composite(logo, (x, y))
    except Exception as e:
        print(f"[logo] erro: {e}")


# =========================================================================
# BASE: cria canvas com gradient base + page marker + footer
# =========================================================================


def new_slide(
    idx: int,
    total: int,
    gradient: tuple[str, str] = None,
    radial_glow: tuple = None,
    with_footer: bool = True,
) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    """Cria canvas base com background, page marker e footer handle."""
    if gradient is None:
        gradient = (PALETTE["navy"], PALETTE["ink"])
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    gradient_v(img, gradient[0], gradient[1])
    if radial_glow:
        cx, cy, r, col, alpha = radial_glow
        gradient_radial_glow(img, cx, cy, r, col, alpha)
    draw = ImageDraw.Draw(img)
    draw_page_marker(draw, idx, total)
    if with_footer:
        draw_footer_handle(draw, with_brand=True)
    return img, draw


# =========================================================================
# SLIDE 1 — HOOK 23h47
# =========================================================================


def slide_01_hook():
    img, draw = new_slide(
        1, 11,
        gradient=(PALETTE["navy"], PALETTE["ink_deep"]),
        radial_glow=(W // 2, 380, 600, PALETTE["red"], 60),
    )
    # Chip subtle
    cx, cy = 88, 96
    draw_chip(draw, cx, cy, "Cenário clínico", fg=PALETTE["cyan_bright"], fz=22)

    # HERO 23h47
    f_hero = font("bold", 220)
    txt = "23h47"
    bbox = draw.textbbox((0, 0), txt, font=f_hero)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((W - tw) // 2, 240),
        txt,
        font=f_hero,
        fill=PALETTE["cyan_bright"],
    )

    # Subline
    f_sub = font("medium", 44)
    sub = "Você assume o leito 12."
    bbox = draw.textbbox((0, 0), sub, font=f_sub)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((W - tw) // 2, 510),
        sub,
        font=f_sub,
        fill=PALETTE["white_dim"],
    )

    # CARD de PV em vermelho/âmbar
    card_x, card_y = 90, 610
    card_w, card_h = W - 180, 540
    rounded_rect(
        draw,
        (card_x, card_y, card_x + card_w, card_y + card_h),
        radius=28,
        fill=(58, 18, 22, 220),
        outline=PALETTE["red"],
        width=2,
    )
    # Header card
    f_chip = font("semibold", 22)
    label = "SINAIS VITAIS — ENTRADA"
    bbox = draw.textbbox((0, 0), label, font=f_chip)
    draw.text(
        (card_x + 36, card_y + 30),
        label,
        font=f_chip,
        fill=PALETTE["red"],
    )

    # 4 métricas 2x2: PAM 45, Glasgow 8, FR 41, SpO₂ 84
    metrics = [
        ("PAM", "45", "mmHg"),
        ("Glasgow", "8", "/15"),
        ("FR", "41", "rpm"),
        ("SpO₂", "84", "%"),
    ]
    inner_x = card_x + 36
    inner_y = card_y + 100
    col_w = (card_w - 72) // 2
    row_h = (card_h - 140) // 2  # 200 por row, com 90 de fontsize cabe folgado
    for i, (k, v, unit) in enumerate(metrics):
        row, col = divmod(i, 2)
        mx = inner_x + col * col_w
        my = inner_y + row * row_h
        # label
        f_label = font("medium", 26)
        draw.text((mx, my), k, font=f_label, fill=PALETTE["white_dim"])
        # value (reduzido pra 96 pra dar respiro)
        f_value = font("bold", 96)
        draw.text(
            (mx, my + 42),
            v,
            font=f_value,
            fill=PALETTE["red"] if k != "Glasgow" else PALETTE["amber"],
        )
        # unit
        f_unit = font("medium", 28)
        v_bbox = draw.textbbox((0, 0), v, font=f_value)
        draw.text(
            (mx + (v_bbox[2] - v_bbox[0]) + 14, my + 92),
            unit,
            font=f_unit,
            fill=PALETTE["white_faint"],
        )

    return img


# =========================================================================
# SLIDE 2 — Apresentação do paciente
# =========================================================================


def slide_02_patient():
    img, draw = new_slide(
        2, 11,
        gradient=(PALETTE["navy2"], PALETTE["ink"]),
    )
    # Chip top
    draw_chip(draw, 88, 96, "Quadro inicial")

    # Headline
    f_h = font("bold", 88)
    draw.text((88, 200), "Quem é ele?", font=f_h, fill=PALETTE["white"])

    # 3 dados objetivos como rows
    items = [
        ("Homem · 75 kg", "Vítima de TCE há 6 h"),
        ("Internação", "Admitido rebaixado, em piora ventilatória"),
        ("Volume urinário", "3.000 mL nas últimas 5 h"),
    ]
    y = 440
    for label, value in items:
        # Bullet line cyan
        bar_x = 100
        draw.rectangle([bar_x, y + 14, bar_x + 6, y + 86], fill=PALETTE["cyan_bright"])
        # Label
        f_l = font("medium", 26)
        draw.text(
            (bar_x + 28, y),
            label.upper(),
            font=f_l,
            fill=PALETTE["cyan_bright"],
        )
        # Value
        f_v = font("semibold", 46)
        draw.text(
            (bar_x + 28, y + 38),
            value,
            font=f_v,
            fill=PALETTE["white"],
        )
        y += 168

    # Footer interpretativo
    f_int = font("medium", 28)
    draw.text(
        (88, 1100),
        "Diurese > 600 mL/h sustentada → red flag pra distúrbio osmolar.",
        font=f_int,
        fill=PALETTE["white_faint"],
    )

    return img


# =========================================================================
# SLIDE 3 — Exames falam
# =========================================================================


def slide_03_labs():
    img, draw = new_slide(
        3, 11,
        gradient=(PALETTE["navy3"], PALETTE["ink"]),
    )
    draw_chip(draw, 88, 96, "Exames")
    f_h = font("bold", 88)
    draw.text((88, 200), "Os exames falam.", font=f_h, fill=PALETTE["white"])

    # Tabela compacta
    rows = [
        ("Na", "158", "mEq/L", "(135-145)", "alarm"),
        ("K", "5,4", "mEq/L", "(3,5-5,0)", "warn"),
        ("Osm urinária", "↑↑", "", "", "warn"),
        ("Na urinário", "↑", "", "", "warn"),
        ("Gasometria", "padrão SIADH inicial", "", "", "neutral"),
    ]
    table_x = 88
    table_y = 440
    table_w = W - 176
    row_h = 92
    for i, (k, v, unit, ref, kind) in enumerate(rows):
        rx = table_x
        ry = table_y + i * row_h
        # row bg sutil zebra
        bg = (255, 255, 255, 8) if i % 2 == 0 else (255, 255, 255, 4)
        rounded_rect(draw, (rx, ry, rx + table_w, ry + row_h - 8), radius=14, fill=bg)
        # label
        f_k = font("semibold", 32)
        draw.text((rx + 26, ry + 26), k, font=f_k, fill=PALETTE["white_dim"])
        # value — fontsize menor pra textos longos (linhas tipo "padrão SIADH inicial")
        is_long_text = len(v) > 5
        f_v = font("bold", 28 if is_long_text else 50)
        col = (
            PALETTE["red"]
            if kind == "alarm"
            else PALETTE["amber"]
            if kind == "warn"
            else PALETTE["white"]
        )
        bbox = draw.textbbox((0, 0), v, font=f_v)
        vw = bbox[2] - bbox[0]
        draw.text(
            (rx + 350, ry + (32 if is_long_text else 18)),
            v,
            font=f_v,
            fill=col,
        )
        # unit + ref
        f_u = font("medium", 24)
        if unit or ref:
            draw.text(
                (rx + 350 + vw + 16, ry + 38),
                f"{unit} {ref}".strip(),
                font=f_u,
                fill=PALETTE["white_faint"],
            )

    # Conclusion banner
    banner_y = table_y + len(rows) * row_h + 30
    banner_h = 110
    rounded_rect(
        draw,
        (table_x, banner_y, table_x + table_w, banner_y + banner_h),
        radius=18,
        fill=(48, 241, 230, 30),
        outline=PALETTE["cyan_bright"],
        width=2,
    )
    f_diag = font("bold", 36)
    draw.text(
        (table_x + 26, banner_y + 18),
        "Suspeita:",
        font=font("medium", 26),
        fill=PALETTE["cyan_bright"],
    )
    draw.text(
        (table_x + 26, banner_y + 48),
        "SIADH pós-TCE (secreção inapropriada de ADH).",
        font=f_diag,
        fill=PALETTE["white"],
    )

    return img


# =========================================================================
# SLIDE 4 — Engagement A/B/C/D
# =========================================================================


def slide_04_engagement():
    img, draw = new_slide(
        4, 11,
        gradient=(PALETTE["navy"], PALETTE["ink_deep"]),
    )
    draw_chip(draw, 88, 96, "Decisão clínica")
    f_h = font("bold", 64)
    draw.text(
        (88, 200),
        "O que você prioriza\nnos próximos 5 min?",
        font=f_h,
        fill=PALETTE["white"],
    )

    options = [
        ("A", "IOT + ventilação protetora"),
        ("B", "Noradrenalina (PAM 45)"),
        ("C", "Corrigir Na devagar (≤ 10 mEq/L/24h)"),
        ("D", "Caçar e tratar fonte do SIADH"),
    ]
    y = 480
    box_h = 130
    gap = 16
    for letter, text in options:
        bx = 88
        bw = W - 176
        rounded_rect(
            draw,
            (bx, y, bx + bw, y + box_h),
            radius=22,
            fill=(255, 255, 255, 12),
            outline=(48, 241, 230, 90),
            width=2,
        )
        # Letter chip
        circ_size = 70
        cx = bx + 30
        cy = y + (box_h - circ_size) // 2
        draw.ellipse(
            [cx, cy, cx + circ_size, cy + circ_size],
            fill=PALETTE["cyan_bright"],
        )
        f_letter = font("bold", 42)
        bbox = draw.textbbox((0, 0), letter, font=f_letter)
        lw = bbox[2] - bbox[0]
        lh = bbox[3] - bbox[1]
        draw.text(
            (cx + (circ_size - lw) // 2, cy + (circ_size - lh) // 2 - 2),
            letter,
            font=f_letter,
            fill=PALETTE["ink_deep"],
        )
        # Option text
        f_t = font("semibold", 34)
        draw.text(
            (bx + 130, y + 44),
            text,
            font=f_t,
            fill=PALETTE["white"],
        )
        y += box_h + gap

    # Subtitle
    f_sub = font("medium", 26)
    sub = "Spoiler: você faz as 4. Em ordem. Próximos slides."
    bbox = draw.textbbox((0, 0), sub, font=f_sub)
    sw = bbox[2] - bbox[0]
    draw.text(
        ((W - sw) // 2, 1180),
        sub,
        font=f_sub,
        fill=PALETTE["white_faint"],
    )

    return img


# =========================================================================
# SLIDE 5 — Decisão 1: IOT
# =========================================================================


def _decision_header(
    draw: ImageDraw.ImageDraw, n: int, title: str, mod_chip: str
):
    # Big chip "Decisão N"
    chip_text = f"Decisão {n}/4"
    draw_chip(
        draw, 88, 96, chip_text, fg=PALETTE["ink_deep"], bg=hex_to_rgb(PALETTE["cyan_bright"]) + (255,)
    )
    # Mod chip à direita
    f_mod = font("semibold", 22)
    bbox = draw.textbbox((0, 0), mod_chip.upper(), font=f_mod)
    mw = bbox[2] - bbox[0] + 40
    mh = 48
    mx = W - 88 - mw
    my = 96
    rounded_rect(
        draw,
        (mx, my, mx + mw, my + mh),
        radius=24,
        fill=(255, 255, 255, 18),
    )
    draw.text(
        (mx + 20, my + 9),
        mod_chip.upper(),
        font=f_mod,
        fill=PALETTE["white_dim"],
    )
    # Title
    f_t = font("bold", 76)
    draw.text((88, 210), title, font=f_t, fill=PALETTE["white"])


def slide_05_iot():
    img, draw = new_slide(5, 11, gradient=(PALETTE["navy"], PALETTE["ink"]))
    _decision_header(draw, 1, "IOT.", "Mod 1")

    # Reason
    f_reason = font("semibold", 38)
    reason = "Glasgow 8 + FR 41 + SpO₂ 84 ="
    draw.text((88, 360), reason, font=f_reason, fill=PALETTE["white_dim"])
    f_concl = font("bold", 44)
    draw.text(
        (88, 410),
        "falência ventilatória + via aérea desprotegida.",
        font=f_concl,
        fill=PALETTE["white"],
    )

    # Card mockup "Sequência rápida"
    cx, cy = 88, 540
    cw, ch = W - 176, 420
    rounded_rect(
        draw,
        (cx, cy, cx + cw, cy + ch),
        radius=28,
        fill=(13, 36, 56, 230),
        outline=(48, 241, 230, 80),
        width=2,
    )
    f_card_label = font("medium", 22)
    draw.text(
        (cx + 36, cy + 28),
        "SEQUÊNCIA RÁPIDA — MOD 1",
        font=f_card_label,
        fill=PALETTE["cyan_bright"],
    )
    f_card_title = font("bold", 44)
    draw.text(
        (cx + 36, cy + 64),
        "Pré-IOT → Indução → Bloqueio → Tubo",
        font=f_card_title,
        fill=PALETTE["white"],
    )

    # 3 step rows
    steps = [
        ("Pré-O₂", "FiO₂ 100% + posição olfativa"),
        ("Indução", "Etomidato ou cetamina (calc no Mod 7)"),
        ("Bloqueio", "Succinilcolina ou rocurônio"),
    ]
    sy = cy + 140
    for label, val in steps:
        # Dot
        draw.ellipse(
            [cx + 36, sy + 14, cx + 56, sy + 34],
            fill=PALETTE["cyan_bright"],
        )
        f_l = font("medium", 26)
        draw.text((cx + 78, sy + 4), label.upper(), font=f_l, fill=PALETTE["cyan_bright"])
        f_v = font("semibold", 30)
        draw.text((cx + 78, sy + 38), val, font=f_v, fill=PALETTE["white"])
        sy += 82

    # Footer caveat
    f_cav = font("medium", 24)
    draw.text(
        (88, 1100),
        "Indicação aqui é clínica. Doses específicas no módulo de calculadora.",
        font=f_cav,
        fill=PALETTE["white_faint"],
    )

    return img


# =========================================================================
# SLIDE 6 — Decisão 2: Peso predito + Vt
# =========================================================================


def slide_06_predicted_weight():
    img, draw = new_slide(6, 11, gradient=(PALETTE["navy2"], PALETTE["ink"]))
    _decision_header(draw, 2, "Peso predito.", "Mod 7")

    # Card calc com input → output
    cx, cy = 88, 360
    cw, ch = W - 176, 640
    rounded_rect(
        draw,
        (cx, cy, cx + cw, cy + ch),
        radius=28,
        fill=(13, 36, 56, 230),
        outline=(48, 241, 230, 60),
        width=2,
    )
    # Input
    f_in_label = font("medium", 24)
    draw.text(
        (cx + 36, cy + 32),
        "ENTRADA",
        font=f_in_label,
        fill=PALETTE["amber"],
    )
    f_in_value = font("bold", 88)
    draw.text(
        (cx + 36, cy + 64),
        "175 cm",
        font=f_in_value,
        fill=PALETTE["amber"],
    )
    f_in_hint = font("medium", 24)
    draw.text(
        (cx + 36, cy + 168),
        "altura estimada pré-IOT (homem)",
        font=f_in_hint,
        fill=PALETTE["white_faint"],
    )

    # Separator
    draw.rectangle(
        [cx + 36, cy + 220, cx + cw - 36, cy + 222],
        fill=(48, 241, 230, 60),
    )

    # Output 1: peso predito
    f_out_label = font("medium", 24)
    draw.text(
        (cx + 36, cy + 248),
        "PESO PREDITO",
        font=f_out_label,
        fill=PALETTE["cyan_bright"],
    )
    f_out_value = font("bold", 96)
    draw.text(
        (cx + 36, cy + 282),
        "≈ 71 kg",
        font=f_out_value,
        fill=PALETTE["white"],
    )

    # Output 2: Vt
    f_vt_label = font("medium", 24)
    draw.text(
        (cx + 36, cy + 408),
        "Vt ALVO  (6 mL/kg)",
        font=f_vt_label,
        fill=PALETTE["cyan_bright"],
    )
    f_vt_value = font("bold", 96)
    draw.text(
        (cx + 36, cy + 442),
        "≈ 425 mL",
        font=f_vt_value,
        fill=PALETTE["white"],
    )

    # Alert driving pressure
    f_dp_label = font("semibold", 28)
    draw.text(
        (cx + 36, cy + 570),
        "Driving pressure ≤ 15 cmH₂O",
        font=f_dp_label,
        fill=PALETTE["amber"],
    )

    # Footer
    f_foot = font("medium", 24)
    draw.text(
        (88, 1100),
        "Peso real (75 kg) ≠ peso predito (71 kg). Não confundir.",
        font=f_foot,
        fill=PALETTE["white_faint"],
    )

    return img


# =========================================================================
# SLIDE 7 — Decisão 3: Noradrenalina
# =========================================================================


def slide_07_norepi():
    img, draw = new_slide(7, 11, gradient=(PALETTE["navy"], PALETTE["ink_deep"]))
    _decision_header(draw, 3, "Noradrenalina.", "Mod 5 §5.1")

    # Sub-headline
    f_sub = font("semibold", 36)
    draw.text(
        (88, 350),
        "Alvo PAM ≥ 65 mmHg.",
        font=f_sub,
        fill=PALETTE["white_dim"],
    )

    # 3 cards horizontais: Diluição / Dose / Vazão
    cards = [
        ("Diluição padrão", "64", "mcg/mL", "8 mg × 4 amp em 250 mL"),
        ("Dose inicial", "0,1", "mcg/kg/min", "75 kg → 7,5 mcg/min"),
        ("Vazão da bomba", "≈ 7", "mL/h", "450 mcg/h ÷ 64 mcg/mL"),
    ]
    card_w = (W - 176 - 32) // 3
    card_h = 480
    card_y = 470
    for i, (label, value, unit, hint) in enumerate(cards):
        cx = 88 + i * (card_w + 16)
        rounded_rect(
            draw,
            (cx, card_y, cx + card_w, card_y + card_h),
            radius=24,
            fill=(13, 36, 56, 220),
            outline=(48, 241, 230, 60),
            width=2,
        )
        f_label = font("medium", 22)
        draw.text(
            (cx + 22, card_y + 28),
            label.upper(),
            font=f_label,
            fill=PALETTE["cyan_bright"],
        )
        # Big value
        f_value = font("bold", 96)
        draw.text(
            (cx + 22, card_y + 80),
            value,
            font=f_value,
            fill=PALETTE["white"],
        )
        # Unit
        f_unit = font("semibold", 28)
        draw.text(
            (cx + 22, card_y + 200),
            unit,
            font=f_unit,
            fill=PALETTE["amber"],
        )
        # Hint
        f_hint = font("medium", 22)
        # wrap manual
        draw_text_wrapped(
            draw,
            (cx + 22, card_y + 270),
            hint,
            max_width=card_w - 44,
            font_obj=f_hint,
            fill=PALETTE["white_faint"],
            line_spacing=1.3,
        )

    # Bottom note Mod 5
    f_note = font("medium", 24)
    draw.text(
        (88, 1100),
        "Exemplo canônico do Módulo 5 §5.1 — hemitartarato 8 mg/4 mL.",
        font=f_note,
        fill=PALETTE["white_faint"],
    )

    return img


# =========================================================================
# SLIDE 8 — Decisão 4: Hipernatremia (cuidado mielinólise)
# =========================================================================


def slide_08_hyperna():
    img, draw = new_slide(
        8, 11,
        gradient=(PALETTE["navy2"], PALETTE["ink"]),
        radial_glow=(W // 2, 1100, 600, PALETTE["red"], 50),
    )
    _decision_header(draw, 4, "Hipernatremia 158.", "Mod 6")

    # Alert banner topo
    ay = 360
    ah = 130
    rounded_rect(
        draw,
        (88, ay, W - 88, ay + ah),
        radius=22,
        fill=(239, 68, 68, 50),
        outline=PALETTE["red"],
        width=3,
    )
    f_alert_label = font("bold", 24)
    draw.text(
        (88 + 28, ay + 22),
        "REGRA OBRIGATÓRIA",
        font=f_alert_label,
        fill=PALETTE["red"],
    )
    f_alert_text = font("bold", 38)
    draw.text(
        (88 + 28, ay + 58),
        "Máx 10 mEq/L em 24 h. Risco de mielinólise.",
        font=f_alert_text,
        fill=PALETTE["white"],
    )

    # Card de cálculo de déficit
    cx, cy = 88, 530
    cw, ch = W - 176, 510
    rounded_rect(
        draw,
        (cx, cy, cx + cw, cy + ch),
        radius=24,
        fill=(13, 36, 56, 230),
        outline=(48, 241, 230, 60),
        width=2,
    )
    f_label = font("medium", 22)
    draw.text(
        (cx + 28, cy + 26),
        "DÉFICIT DE ÁGUA LIVRE — MÓDULO 6",
        font=f_label,
        fill=PALETTE["cyan_bright"],
    )
    # Fórmula
    f_form_label = font("medium", 26)
    draw.text(
        (cx + 28, cy + 68),
        "ACT × (Na atual / Na alvo − 1)",
        font=f_form_label,
        fill=PALETTE["white_dim"],
    )
    # Substituição
    f_sub = font("semibold", 30)
    draw.text(
        (cx + 28, cy + 130),
        "0,6 × 75 × (158 / 145 − 1)",
        font=f_sub,
        fill=PALETTE["white"],
    )
    # =
    f_eq = font("bold", 92)
    draw.text(
        (cx + 28, cy + 210),
        "≈ 4,0 L",
        font=f_eq,
        fill=PALETTE["cyan_bright"],
    )
    f_eq_label = font("medium", 24)
    draw.text(
        (cx + 28, cy + 340),
        "a repor em 48 h. Não em bolus.",
        font=f_eq_label,
        fill=PALETTE["white_faint"],
    )
    # Lateral: alvo de queda
    side_x = cx + cw - 320
    f_side_label = font("medium", 22)
    draw.text(
        (side_x, cy + 68),
        "QUEDA SEGURA",
        font=f_side_label,
        fill=PALETTE["amber"],
    )
    f_side_v = font("bold", 64)
    draw.text(
        (side_x, cy + 102),
        "≤ 10",
        font=f_side_v,
        fill=PALETTE["amber"],
    )
    f_side_u = font("semibold", 24)
    draw.text(
        (side_x, cy + 180),
        "mEq/L em 24 h",
        font=f_side_u,
        fill=PALETTE["white_dim"],
    )

    return img


# =========================================================================
# SLIDE 9 — Recap com smartphone
# =========================================================================


def slide_09_recap():
    img, draw = new_slide(
        9, 11,
        gradient=(PALETTE["navy3"], PALETTE["ink_deep"]),
        radial_glow=(W // 2, 700, 700, PALETTE["cyan_bright"], 50),
    )
    draw_chip(draw, 88, 96, "Recap")

    f_h = font("bold", 110)
    txt = "8 minutos."
    bbox = draw.textbbox((0, 0), txt, font=f_h)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((W - tw) // 2, 200),
        txt,
        font=f_h,
        fill=PALETTE["cyan_bright"],
    )

    # Smartphone mockup centralizado
    phone_w = 340
    phone_h = 700
    phone_x = (W - phone_w) // 2
    phone_y = 380
    # Body
    rounded_rect(
        draw,
        (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h),
        radius=44,
        fill="#10151c",
        outline=(48, 241, 230, 50),
        width=2,
    )
    # Screen
    screen_pad = 16
    sx = phone_x + screen_pad
    sy = phone_y + screen_pad
    sw_ = phone_w - screen_pad * 2
    sh_ = phone_h - screen_pad * 2
    rounded_rect(
        draw,
        (sx, sy, sx + sw_, sy + sh_),
        radius=32,
        fill="#0a1018",
    )
    # Status bar top
    f_clock = font("semibold", 18)
    draw.text((sx + 22, sy + 18), "23:55", font=f_clock, fill=PALETTE["white"])
    draw.text(
        (sx + sw_ - 60, sy + 18),
        "100%",
        font=f_clock,
        fill=PALETTE["white"],
    )

    # 4 app cards 2x2 dentro da tela
    apps = [
        ("IOT", PALETTE["red"], (58, 18, 22)),
        ("VENT", PALETTE["amber"], (58, 42, 10)),
        ("NA", PALETTE["cyan_bright"], (10, 42, 54)),
        ("Na+", PALETTE["green"], (13, 42, 26)),
    ]
    card_pad = 24
    card_gap = 16
    card_w = (sw_ - card_pad * 2 - card_gap) // 2
    card_h = card_w
    grid_x = sx + card_pad
    grid_y = sy + 80
    for i, (label, fg, bg) in enumerate(apps):
        row, col = divmod(i, 2)
        ax = grid_x + col * (card_w + card_gap)
        ay = grid_y + row * (card_h + card_gap)
        # bg gradient sutil
        rounded_rect(
            draw,
            (ax, ay, ax + card_w, ay + card_h),
            radius=24,
            fill=bg + (255,),
        )
        f_glyph = font("bold", 56)
        bbox = draw.textbbox((0, 0), label, font=f_glyph)
        gw = bbox[2] - bbox[0]
        gh = bbox[3] - bbox[1]
        draw.text(
            (ax + (card_w - gw) // 2, ay + (card_h - gh) // 2 - 8),
            label,
            font=f_glyph,
            fill=fg,
        )

    # Home indicator
    bar_w = 100
    draw.rounded_rectangle(
        (sx + (sw_ - bar_w) // 2, sy + sh_ - 18, sx + (sw_ + bar_w) // 2, sy + sh_ - 12),
        radius=3,
        fill=(245, 249, 252, 140),
    )

    # 4 etapas embaixo do smartphone (timeline)
    steps = ["IOT", "Vent protetora", "Noradrenalina", "Hidratação"]
    sy_t = phone_y + phone_h + 30
    full_w = W - 176
    step_w = full_w // len(steps)
    for i, s in enumerate(steps):
        sx_t = 88 + i * step_w + step_w // 2
        # dot
        draw.ellipse(
            [sx_t - 8, sy_t, sx_t + 8, sy_t + 16],
            fill=PALETTE["cyan_bright"],
        )
        if i < len(steps) - 1:
            draw.rectangle(
                [sx_t + 8, sy_t + 6, sx_t + step_w - 8, sy_t + 10],
                fill=(48, 241, 230, 90),
            )
        # label
        f_s = font("medium", 22)
        bbox = draw.textbbox((0, 0), s, font=f_s)
        sw_t = bbox[2] - bbox[0]
        draw.text(
            (sx_t - sw_t // 2, sy_t + 28),
            s,
            font=f_s,
            fill=PALETTE["white_dim"],
        )

    # Tagline final
    f_tag = font("semibold", 30)
    tag = "Tudo num só app. Sem trocar de aba."
    bbox = draw.textbbox((0, 0), tag, font=f_tag)
    tw_t = bbox[2] - bbox[0]
    draw.text(
        ((W - tw_t) // 2, 1230),
        tag,
        font=f_tag,
        fill=PALETTE["white"],
    )

    return img


# =========================================================================
# SLIDE 10 — Prova social discreta
# =========================================================================


def slide_10_sources():
    img, draw = new_slide(10, 11, gradient=(PALETTE["navy"], PALETTE["ink"]))
    draw_chip(draw, 88, 96, "Referências")

    f_h = font("bold", 88)
    draw.text((88, 200), "23h47 vira 23h55.", font=f_h, fill=PALETTE["white"])
    f_sub = font("medium", 36)
    draw.text(
        (88, 320),
        "Conduta apoiada em:",
        font=f_sub,
        fill=PALETTE["white_dim"],
    )

    sources = [
        ("Surviving Sepsis Campaign 2024", "Choque séptico + meta PAM ≥ 65"),
        ("ARDSNet", "Ventilação protetora pelo peso predito"),
        ("SBEM / SBEM-SP", "SIADH e hipernatremia hospitalar"),
        ("Mod 5 §5.1 — Manual Virtus", "Noradrenalina diluição padrão"),
        ("Mod 6 — Manual Virtus", "Distúrbios hidroeletrolíticos"),
    ]
    y = 460
    for src, desc in sources:
        # check icon (círculo cyan + check desenhado como vetor)
        cx = 100
        cy = y + 16
        rsz = 32
        draw.ellipse([cx, cy, cx + rsz, cy + rsz], fill=PALETTE["cyan_bright"])
        # Check vetor: 2 linhas formando um ✓
        check_color = PALETTE["ink_deep"]
        pad = 7
        # Linha curta esq-baixo
        draw.line(
            [(cx + pad, cy + rsz // 2 + 1), (cx + rsz // 2 - 1, cy + rsz - pad - 1)],
            fill=check_color,
            width=4,
        )
        # Linha longa baixo-cima-direita
        draw.line(
            [(cx + rsz // 2 - 1, cy + rsz - pad - 1), (cx + rsz - pad + 1, cy + pad)],
            fill=check_color,
            width=4,
        )
        # source
        f_src = font("semibold", 36)
        draw.text((cx + 54, y), src, font=f_src, fill=PALETTE["white"])
        # desc
        f_desc = font("medium", 24)
        draw.text((cx + 54, y + 50), desc, font=f_desc, fill=PALETTE["white_faint"])
        y += 120

    return img


# =========================================================================
# SLIDE 11 — CTA brand
# =========================================================================


def slide_11_cta():
    img, draw = new_slide(
        11, 11,
        gradient=(PALETTE["navy"], PALETTE["ink_deep"]),
        radial_glow=(W // 2, 650, 800, PALETTE["cyan_bright"], 80),
        with_footer=False,
    )

    # Title
    f_h = font("bold", 64)
    title1 = "Você assume"
    title2 = "plantão amanhã."
    bbox1 = draw.textbbox((0, 0), title1, font=f_h)
    bbox2 = draw.textbbox((0, 0), title2, font=f_h)
    tw1 = bbox1[2] - bbox1[0]
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((W - tw1) // 2, 180), title1, font=f_h, fill=PALETTE["white"])
    draw.text(((W - tw2) // 2, 260), title2, font=f_h, fill=PALETTE["white"])

    # Logo centro
    logo_size = 320
    draw_logo(
        img,
        (W - logo_size) // 2,
        420,
        logo_size,
        glow=True,
    )

    # Brand "Manual Virtus"
    f_brand = font("bold", 84)
    line1 = "Manual"
    bbox = draw.textbbox((0, 0), line1, font=f_brand)
    lw1 = bbox[2] - bbox[0]
    line2 = "Virtus"
    bbox2 = draw.textbbox((0, 0), line2, font=f_brand)
    lw2 = bbox2[2] - bbox2[0]
    # Concat com cor diferente
    total_w = lw1 + 24 + lw2
    bx = (W - total_w) // 2
    draw.text((bx, 800), line1, font=f_brand, fill=PALETTE["white"])
    draw.text((bx + lw1 + 24, 800), line2, font=f_brand, fill=PALETTE["cyan_bright"])

    # Tagline
    f_tag = font("medium", 32)
    tag = "No bolso. Sem trocar de app."
    bbox = draw.textbbox((0, 0), tag, font=f_tag)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 920), tag, font=f_tag, fill=PALETTE["white_dim"])

    # Pricing card
    pc_w = 600
    pc_h = 130
    pc_x = (W - pc_w) // 2
    pc_y = 1010
    rounded_rect(
        draw,
        (pc_x, pc_y, pc_x + pc_w, pc_y + pc_h),
        radius=24,
        fill=(48, 241, 230, 30),
        outline=PALETTE["cyan_bright"],
        width=2,
    )
    f_price = font("bold", 64)
    price = "R$ 25,99/mês"
    bbox = draw.textbbox((0, 0), price, font=f_price)
    pw = bbox[2] - bbox[0]
    draw.text(
        ((W - pw) // 2, pc_y + 22),
        price,
        font=f_price,
        fill=PALETTE["white"],
    )
    f_pc_sub = font("medium", 22)
    pc_sub = "Assinatura mensal · cancele quando quiser"
    bbox = draw.textbbox((0, 0), pc_sub, font=f_pc_sub)
    pws = bbox[2] - bbox[0]
    draw.text(
        ((W - pws) // 2, pc_y + 92),
        pc_sub,
        font=f_pc_sub,
        fill=PALETTE["white_dim"],
    )

    # Handle bem destacado embaixo
    f_handle = font("semibold", 30)
    handle = "manualvirtus.com.br"
    bbox = draw.textbbox((0, 0), handle, font=f_handle)
    hw = bbox[2] - bbox[0]
    draw.text(
        ((W - hw) // 2, 1200),
        handle,
        font=f_handle,
        fill=PALETTE["cyan_bright"],
    )

    return img


# =========================================================================
# MAIN
# =========================================================================


SLIDES = [
    ("slide_01_hook", slide_01_hook),
    ("slide_02_patient", slide_02_patient),
    ("slide_03_labs", slide_03_labs),
    ("slide_04_engagement", slide_04_engagement),
    ("slide_05_iot", slide_05_iot),
    ("slide_06_predicted_weight", slide_06_predicted_weight),
    ("slide_07_norepi", slide_07_norepi),
    ("slide_08_hyperna", slide_08_hyperna),
    ("slide_09_recap", slide_09_recap),
    ("slide_10_sources", slide_10_sources),
    ("slide_11_cta", slide_11_cta),
]


def main():
    print(f"[gen] gerando {len(SLIDES)} slides em {OUT}/")
    for name, fn in SLIDES:
        img = fn()
        out_path = OUT / f"{name}.png"
        # Garante RGB final pra PNG (Instagram aceita RGBA mas RGB é menor)
        if img.mode == "RGBA":
            bg = Image.new("RGB", img.size, hex_to_rgb(PALETTE["ink_deep"]))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        img.save(out_path, "PNG", optimize=True)
        print(f"[gen]   {out_path.name}  {out_path.stat().st_size // 1024} KB")
    print(f"[gen] concluído.")


if __name__ == "__main__":
    main()
