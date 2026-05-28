"""
Renderiza os 6 criativos (2 angulos x 3 formatos) + regera copy.txt.
Uso: python render_all.py
"""
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import ad_a_dor
import ad_b_antipdf
from copy import build_copy_txt


if __name__ == "__main__":
    print("Renderizando angulo A (Referencia consolidada)...")
    ad_a_dor.main()
    print()
    print("Renderizando angulo B (Uma ferramenta no lugar de varias)...")
    ad_b_antipdf.main()
    print()

    copy_txt_path = os.path.join(HERE, "copy.txt")
    with open(copy_txt_path, "w", encoding="utf-8") as f:
        f.write(build_copy_txt())
    print("copy.txt atualizado.")
    print()
    print("OK — 6 PNGs + copy.txt gerados em marketing/meta-ads/lancamento-assinatura/")
