"""
Renderiza os 6 criativos (2 angulos x 3 formatos) de uma vez.
Uso: python render_all.py
"""
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import ad_a_dor
import ad_b_antipdf


if __name__ == "__main__":
    print("Renderizando angulo A (Dor / 03:47)...")
    ad_a_dor.main()
    print()
    print("Renderizando angulo B (Anti-PDF)...")
    ad_b_antipdf.main()
    print()
    print("OK — 6 PNGs gerados em marketing/meta-ads/lancamento-assinatura/")
