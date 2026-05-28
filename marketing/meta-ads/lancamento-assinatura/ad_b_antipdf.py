"""
Meta Ads — Angulo B (Uma ferramenta no lugar de varias) — Lancamento Assinatura.
Renderiza 3 formatos: 1080x1080, 1080x1350, 1080x1920.

Conceito: split visual — pilha cacatica de PDFs a esquerda colapsando
em um celular limpo a direita com marca V brilhando. Headline
'6 PDFs abertos. / Ou 1 app.' + chip 'A PARTIR DE R$ 25,99/MES' + CTA
'CONHECER O VIRTUS'.

Copy lida de copy.py (fonte unica). Nome do arquivo preservado por
compat com render_all.py e historico dos PNGs.
"""
from PIL import Image, ImageDraw
import os

from _common import (
    F,
    INK,
    INK_SOFT,
    INK_MUTED,
    INK_DIM,
    CYAN,
    CYAN_2,
    LINE_FAINT,
    gradient_canvas,
    draw_frame,
    draw_pill_outline,
    draw_price_chip,
    draw_cta_pill,
    render_pdf_stack,
    render_phone_outline,
    text_centered,
    text_left,
)
from copy import ANGULO_B as B

HERE = os.path.dirname(os.path.abspath(__file__))

# Mockup realista de iPhone (PNG transparente, gerado via Higgsfield).
# Cropado pro bbox do conteudo nao-transparente pra escalonamento preciso.
_IPHONE_PATH = os.path.join(HERE, "assets", "iphone_mockup.png")
_IPHONE_SRC = Image.open(_IPHONE_PATH).convert("RGBA")
_IPHONE_SRC = _IPHONE_SRC.crop(_IPHONE_SRC.getbbox())  # ~593x1215, ratio ~1:2.05


def paste_iphone(img, x_center, y_center, max_w, max_h):
    """Composita o mockup do iPhone centrado em (x_center, y_center), contido em (max_w, max_h)."""
    src_w, src_h = _IPHONE_SRC.size
    scale = min(max_w / src_w, max_h / src_h)
    new_w = int(src_w * scale)
    new_h = int(src_h * scale)
    resized = _IPHONE_SRC.resize((new_w, new_h), Image.LANCZOS)
    x = x_center - new_w // 2
    y = y_center - new_h // 2
    img.paste(resized, (x, y), resized)


def render(W, H, out_name):
    img = gradient_canvas(W, H)
    d = ImageDraw.Draw(img)
    cx = W // 2

    # ---- proporcoes por formato ----
    # Layout split horizontal funciona bem em 1:1 e 4:5; em 9:16 vira
    # vertical (PDFs em cima, celular embaixo) pra nao espremer.
    # Headline Gloock 64pt x 2 linhas ocupa ~170px (head_y .. head_y+170).
    # Body precisa comecar >= head_y + 200 pra ter respiro real.
    if W == H:  # 1:1 (1080x1080)
        y_ribbon = 110
        # split horizontal
        pdf_x, pdf_y = 170, 200
        phone_xc, phone_y = int(W * 0.72), 200
        phone_w, phone_h = 200, 320
        y_head = 580
        y_body = 800
        y_chip = 890
        y_cta = 970
        vertical = False
    elif H > W and (H / W) < 1.4:  # 4:5 (1080x1350)
        y_ribbon = 130
        pdf_x, pdf_y = 170, 230
        phone_xc, phone_y = int(W * 0.72), 230
        phone_w, phone_h = 220, 370
        y_head = 720
        y_body = 960
        y_chip = 1060
        y_cta = 1180
        vertical = False
    else:  # 9:16 (1080x1920) — empilhado verticalmente
        y_ribbon = 180
        pdf_x, pdf_y = 240, 280
        phone_xc, phone_y = cx, 760
        phone_w, phone_h = 260, 440
        y_head = 1280
        y_body = 1500
        y_chip = 1600
        y_cta = 1740
        vertical = True

    # ---- ribbon eyebrow ----
    f_rib = F("JetBrainsMono-Bold.ttf", 14)
    draw_pill_outline(d, cx, y_ribbon, B["eyebrow"], f_rib, CYAN)

    # ---- visual: PDFs caoticos ----
    if vertical:
        # 9:16 — PDFs espalhados em arco horizontal no terco superior
        render_pdf_stack(img, pdf_x, pdf_y, count=6, w=180, h=220, color=INK_DIM)
    else:
        render_pdf_stack(img, pdf_x, pdf_y, count=6, w=130, h=160, color=INK_DIM)

    # ---- seta/arrow indicando colapso ----
    if not vertical:
        # seta horizontal entre PDFs e celular
        ay = pdf_y + 140
        ax_start = pdf_x + 220
        ax_end = phone_xc - phone_w // 2 - 20
        d.line([(ax_start, ay), (ax_end, ay)], fill=CYAN_2, width=2)
        # cabeca da seta
        d.polygon(
            [(ax_end, ay), (ax_end - 14, ay - 8), (ax_end - 14, ay + 8)],
            fill=CYAN_2,
        )
        # label sobre a seta
        f_lbl = F("JetBrainsMono-Bold.ttf", 12)
        text_centered(d, B["arrow_label"], f_lbl, ay - 26, CYAN, (ax_start + ax_end) // 2)
    else:
        # seta vertical apontando pra baixo
        ay_start = pdf_y + 240
        ay_end = phone_y - 30
        d.line([(cx, ay_start), (cx, ay_end)], fill=CYAN_2, width=2)
        d.polygon(
            [(cx, ay_end), (cx - 10, ay_end - 16), (cx + 10, ay_end - 16)],
            fill=CYAN_2,
        )
        f_lbl = F("JetBrainsMono-Bold.ttf", 12)
        text_centered(d, B["arrow_label"], f_lbl, (ay_start + ay_end) // 2 - 8, CYAN, cx + 40)

    # ---- visual: celular com V ----
    # substituido por mockup PNG — ver assets/iphone_mockup.png
    # render_phone_outline(img, phone_xc, phone_y, w=phone_w, h=phone_h, color=CYAN_2)
    paste_iphone(img, phone_xc, phone_y + phone_h // 2, phone_w, phone_h)

    # ---- headline ----
    d = ImageDraw.Draw(img)
    f_h = F("Gloock-Regular.ttf", 64)
    text_centered(d, B["headline_top"], f_h, y_head, INK_MUTED, cx)
    text_centered(d, B["headline_bot"], f_h, y_head + 78, INK, cx)

    # ---- body ----
    f_b = F("InstrumentSans-Regular.ttf", 20)
    text_centered(d, B["body"][0], f_b, y_body, INK_MUTED, cx)
    text_centered(d, B["body"][1], f_b, y_body + 30, INK_SOFT, cx)

    # ---- chip preco ----
    draw_price_chip(d, cx, y_chip, B["price_chip"])

    # ---- CTA ----
    draw_cta_pill(img, cx, y_cta, B["cta"], w=560, h=72)

    # ---- chrome ----
    draw_frame(img, B["frame_label"])

    out_path = os.path.join(HERE, out_name)
    img.save(out_path, "PNG", optimize=True)
    print(f"{out_name} pronto.")


def main():
    render(1080, 1080, "ad_b_antipdf_1x1.png")
    render(1080, 1350, "ad_b_antipdf_4x5.png")
    render(1080, 1920, "ad_b_antipdf_9x16.png")


if __name__ == "__main__":
    main()
