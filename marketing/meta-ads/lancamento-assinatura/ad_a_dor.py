"""
Meta Ads — Angulo A (Dor / Plantao 03:47) — Lancamento Assinatura.
Renderiza 3 formatos: 1080x1080, 1080x1350, 1080x1920.

Conceito: relogio gigante 03:47 + headline 'Dose certa, agora.' +
chip de preco 'A PARTIR DE R$ 25,99/MES' + CTA 'VER PLANOS'.

Para uso em Meta Ads Manager, posicionamentos Feed + Stories + Reels.
"""
from PIL import ImageDraw
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
    text_centered,
)

HERE = os.path.dirname(os.path.abspath(__file__))


def render(W, H, out_name):
    img = gradient_canvas(W, H)
    d = ImageDraw.Draw(img)
    cx = W // 2

    # ---- proporcoes por formato ----
    if W == H:  # 1:1 (1080x1080)
        y_ribbon = 120
        y_clock = 180
        clock_size = 280
        y_head = 540
        y_body = 624
        y_chip = 730
        y_cta = 880
    elif H > W and (H / W) < 1.4:  # 4:5 (1080x1350)
        y_ribbon = 156
        y_clock = 220
        clock_size = 300
        y_head = 640
        y_body = 730
        y_chip = 850
        y_cta = 1080
    else:  # 9:16 (1080x1920)
        y_ribbon = 220
        y_clock = 320
        clock_size = 340
        y_head = 820
        y_body = 920
        y_chip = 1100
        y_cta = 1620

    # ---- ribbon eyebrow ----
    f_rib = F("JetBrainsMono-Bold.ttf", 14)
    draw_pill_outline(d, cx, y_ribbon, "PLANTAO  ·  03h47", f_rib, CYAN)

    # ---- relogio gigante 03:47 ----
    f_clock = F("Gloock-Regular.ttf", clock_size)
    text_centered(d, "03:47", f_clock, y_clock, INK, cx)

    # ---- regua sutil abaixo do relogio (separador visual) ----
    # Gloock tem descent generoso — usa y_clock + clock_size como bottom seguro
    clock_bottom = y_clock + clock_size + 10
    rule_w = int(W * 0.18)
    d.line(
        [(cx - rule_w // 2, clock_bottom),
         (cx + rule_w // 2, clock_bottom)],
        fill=LINE_FAINT, width=1,
    )

    # ---- headline ----
    f_h = F("Gloock-Regular.ttf", 58)
    text_centered(d, "Dose certa, agora.", f_h, y_head, INK, cx)

    # ---- body ----
    f_b = F("InstrumentSans-Regular.ttf", 22)
    text_centered(
        d,
        "Calculos, drogas e protocolos validados.",
        f_b, y_body, INK_MUTED, cx,
    )
    text_centered(
        d,
        "Offline. No bolso. Dark mode.",
        f_b, y_body + 36, INK_SOFT, cx,
    )

    # ---- chip preco ----
    draw_price_chip(d, cx, y_chip, "A PARTIR DE R$ 25,99 / MES")

    # ---- nota secundaria sobre anual ----
    f_note = F("JetBrainsMono-Regular.ttf", 13)
    text_centered(
        d,
        "R$ 16,67/mes no plano anual  ·  cancela quando quiser",
        f_note, y_chip + 50, INK_MUTED, cx,
    )

    # ---- CTA ----
    draw_cta_pill(img, cx, y_cta, "VER PLANOS", w=520, h=72)

    # ---- chrome ----
    draw_frame(img, "AD  ·  DOR-3AM / META")

    out_path = os.path.join(HERE, out_name)
    img.save(out_path, "PNG", optimize=True)
    print(f"{out_name} pronto.")


def main():
    render(1080, 1080, "ad_a_dor_1x1.png")
    render(1080, 1350, "ad_a_dor_4x5.png")
    render(1080, 1920, "ad_a_dor_9x16.png")


if __name__ == "__main__":
    main()
