"""
Helpers compartilhados para os criativos Meta Ads — Lancamento Assinatura.

Convencao: cada ad importa daqui e chama render() em 3 formatos
(1080x1080, 1080x1350, 1080x1920). Mantem branding, chrome e paleta
identicos a marketing/meta-ads/ad_b_oferta_1x1.py (referencia legada).
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

FONT_DIR = (
    r"C:\Users\andre\AppData\Roaming\Claude"
    r"\local-agent-mode-sessions\skills-plugin"
    r"\68bb1bcc-abe5-40c6-af71-1ecf29bad7aa"
    r"\0c9b4f51-013c-40c6-bd04-925316cf9e41"
    r"\skills\canvas-design\canvas-fonts"
)


def F(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


# ---------- paleta (alinhada com src/styles.css) ----------
INK = (238, 249, 255)
INK_SOFT = (216, 236, 246)
INK_MUTED = (155, 176, 190)
INK_DIM = (95, 118, 134)
LINE_FAINT = (40, 70, 90)
CYAN = (48, 241, 230)       # #30f1e6 cyan-light
CYAN_2 = (18, 190, 209)     # #12bed1 cyan
BLUE = (46, 139, 255)
NAVY_DEEP = (13, 36, 56)    # #0d2438
NAVY_MID = (18, 60, 105)    # #123c69


# ---------- helpers texto ----------
def text_centered(d, txt, font, y, fill, x_center):
    bb = d.textbbox((0, 0), txt, font=font)
    w = bb[2] - bb[0]
    d.text((x_center - w // 2 - bb[0], y), txt, font=font, fill=fill)


def text_left(d, txt, font, x, y, fill):
    bb = d.textbbox((0, 0), txt, font=font)
    d.text((x - bb[0], y - bb[1]), txt, font=font, fill=fill)


def text_right(d, txt, font, x_right, y, fill):
    bb = d.textbbox((0, 0), txt, font=font)
    d.text((x_right - (bb[2] - bb[0]) - bb[0], y), txt, font=font, fill=fill)


# ---------- canvas ----------
def gradient_canvas(W, H):
    """Gradiente vertical navy + 2 glows (cyan top-right, blue bottom-left) + grain."""
    grad = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        if t < 0.55:
            k = t / 0.55
            r = int(3 + (7 - 3) * k)
            g = int(16 + (19 - 16) * k)
            b = int(25 + (29 - 25) * k)
        else:
            k = (t - 0.55) / 0.45
            r = int(7 + (3 - 7) * k)
            g = int(19 + (10 - 19) * k)
            b = int(29 + (16 - 29) * k)
        grad.putpixel((0, y), (r, g, b))
    img = grad.resize((W, H))

    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    # Glow proporcional ao menor lado pra escalar bem em 9:16
    base = min(W, H)
    for r, alpha, cx, cy, col in [
        (int(base * 0.62), 30, int(W * 0.85), int(H * 0.05), CYAN),
        (int(base * 0.68), 22, int(W * 0.15), int(H * 1.00), BLUE),
    ]:
        for i in range(18):
            rr = int(r * (1 - i / 18))
            a = int(alpha * (1 - i / 18))
            gd.ellipse(
                [cx - rr, cy - rr, cx + rr, cy + rr],
                fill=(int(col[0] * a / 255), int(col[1] * a / 255), int(col[2] * a / 255)),
            )
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    img = Image.blend(img, Image.eval(glow, lambda v: min(255, v)), 0.55)

    grain = Image.effect_noise((W, H), 6).convert("RGB")
    grain = grain.point(lambda v: int((v - 128) * 0.18 + 128))
    img = Image.blend(img, grain, 0.05)
    return img


# ---------- chrome (frame + brand) ----------
def draw_frame(img, ad_label, margin=64):
    """Cantos finos + eyebrow superior + brand/url inferior."""
    W, H = img.size
    d = ImageDraw.Draw(img)
    inset = 44
    tlen = 22
    for (x, y) in [
        (inset, inset),
        (W - inset, inset),
        (inset, H - inset),
        (W - inset, H - inset),
    ]:
        sx = -1 if x > W / 2 else 1
        sy = -1 if y > H / 2 else 1
        d.line([(x, y), (x + sx * tlen, y)], fill=LINE_FAINT, width=1)
        d.line([(x, y), (x, y + sy * tlen)], fill=LINE_FAINT, width=1)

    f_mono = F("JetBrainsMono-Regular.ttf", 15)
    d.text((margin, margin - 18), "MANUAL VIRTUS  ·  CLINICAL TOOLS", font=f_mono, fill=INK_DIM)
    text_right(d, ad_label, f_mono, W - margin, margin - 18, INK_DIM)

    f_brand = F("InstrumentSerif-Regular.ttf", 20)
    d.text((margin, H - margin - 4), "Virtus", font=f_brand, fill=INK_SOFT)
    f_tag = F("JetBrainsMono-Regular.ttf", 12)
    d.text((margin + 60, H - margin + 4), "— clinical tools", font=f_tag, fill=INK_DIM)
    text_right(d, "manualvirtus.com.br", f_tag, W - margin, H - margin + 4, INK_DIM)


# ---------- componentes reutilizaveis ----------
def draw_pill_outline(d, x_center, y, label, font, color=CYAN):
    """Pill outline (eyebrow ribbon, ex.: 'PLANTAO NOTURNO')."""
    bb = d.textbbox((0, 0), label, font=font)
    w = (bb[2] - bb[0]) + 48
    h = 36
    x0 = x_center - w // 2
    d.rounded_rectangle([x0, y, x0 + w, y + h], radius=h // 2, outline=color, width=1)
    text_centered(d, label, font, y + 11, color, x_center)


def draw_price_chip(d, x_center, y, label):
    """Chip discreto com 'A PARTIR DE R$ 25,99/MES' ou similar."""
    f = F("JetBrainsMono-Bold.ttf", 14)
    bb = d.textbbox((0, 0), label, font=f)
    w = (bb[2] - bb[0]) + 36
    h = 34
    x0 = x_center - w // 2
    d.rounded_rectangle([x0, y, x0 + w, y + h], radius=h // 2, outline=CYAN_2, width=1)
    text_centered(d, label, f, y + 11, CYAN_2, x_center)


def draw_cta_pill(img, x_center, y, label, w=540, h=72):
    """Pill cyan gradient com texto navy — CTA principal."""
    W, _ = img.size
    bx = x_center - w // 2
    btn = Image.new("RGB", (w, h), CYAN)
    for x in range(w):
        t = x / (w - 1)
        r = int(CYAN[0] * (1 - t) + CYAN_2[0] * t)
        g = int(CYAN[1] * (1 - t) + CYAN_2[1] * t)
        b = int(CYAN[2] * (1 - t) + CYAN_2[2] * t)
        for py in range(h):
            btn.putpixel((x, py), (r, g, b))
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, w - 1, h - 1], radius=h // 2, fill=255)
    img.paste(btn, (bx, y), mask)
    d = ImageDraw.Draw(img)
    f_btn = F("InstrumentSans-Bold.ttf", 22)
    bb = d.textbbox((0, 0), label, font=f_btn)
    tx = x_center - (bb[2] - bb[0]) // 2
    d.text((tx, y + h // 2 - (bb[3] - bb[1]) // 2 - 4), label, font=f_btn, fill=(2, 22, 27))


def draw_ecg_line(d, y, W, color=None, width=2, amplitude=60):
    """ECG estilizado horizontal, com um QRS no terco central."""
    if color is None:
        color = (CYAN[0], CYAN[1], CYAN[2])
    pts = []
    qrs_center = W // 2
    qrs_span = 80
    for x in range(0, W, 2):
        dx = x - qrs_center
        if -qrs_span // 2 < dx < -10:
            yo = 0
        elif -10 <= dx < 0:
            yo = -amplitude
        elif 0 <= dx < 10:
            yo = amplitude
        elif 10 <= dx < qrs_span // 2:
            yo = 0
        else:
            yo = 0
        pts.append((x, y + yo))
    for i in range(len(pts) - 1):
        d.line([pts[i], pts[i + 1]], fill=color, width=width)


def render_pdf_stack(img, x, y, count=6, w=120, h=150, color=INK_DIM):
    """Pilha de retangulos representando PDFs empilhados em desordem."""
    d = ImageDraw.Draw(img)
    import random
    random.seed(42)  # determinismo
    for i in range(count):
        offset_x = random.randint(-25, 25)
        offset_y = i * 18
        rotation = random.randint(-8, 8)
        # Retangulo simples (sem rotacao real, marcamos com offset)
        x0 = x + offset_x - i * 4
        y0 = y + offset_y
        d.rounded_rectangle(
            [x0, y0, x0 + w, y0 + h],
            radius=6,
            outline=color,
            width=2,
        )
        # Linhas de texto fake dentro do PDF
        for lj in range(3):
            ly = y0 + 24 + lj * 18
            d.line([(x0 + 14, ly), (x0 + w - 14, ly)], fill=color, width=1)
        # Tag "PDF" no canto
        f_tag = F("JetBrainsMono-Bold.ttf", 10)
        d.text((x0 + 8, y0 + 6), "PDF", font=f_tag, fill=color)


def render_phone_outline(img, x_center, y, w=240, h=420, color=CYAN_2):
    """Outline de smartphone com marca 'V' no centro brilhando."""
    d = ImageDraw.Draw(img)
    x0 = x_center - w // 2
    # Carcaca
    d.rounded_rectangle([x0, y, x0 + w, y + h], radius=28, outline=color, width=3)
    # Tela interna
    inset = 12
    d.rounded_rectangle(
        [x0 + inset, y + inset + 18, x0 + w - inset, y + h - inset - 18],
        radius=18,
        outline=(LINE_FAINT[0], LINE_FAINT[1], LINE_FAINT[2]),
        width=1,
    )
    # Notch
    d.rounded_rectangle(
        [x_center - 28, y + 8, x_center + 28, y + 22],
        radius=7,
        fill=(2, 8, 14),
    )
    # Glow + marca V
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = x_center, y + h // 2
    for r, a in [(140, 32), (110, 48), (80, 62), (50, 80)]:
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(CYAN[0], CYAN[1], CYAN[2], a))
    glow = glow.filter(ImageFilter.GaussianBlur(28))
    img.paste(glow, (0, 0), glow)
    # V grande
    d = ImageDraw.Draw(img)
    f_v = F("Gloock-Regular.ttf", 140)
    text_centered(d, "V", f_v, cy - 95, INK, cx)
