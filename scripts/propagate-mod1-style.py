"""
Propaga o sistema de estilo + Google Fonts do Mod 1 para Mod 2..6.

Estratégia:
1. Lê Mod 1 e extrai o bloco entre </title> e </head> (links Google Fonts +
   ambos <style>...</style>).
2. Para cada Mod 2..6:
   - Substitui o bloco equivalente no head pelo do Mod 1.
   - Preserva os <meta>, <title> e qualquer outra tag específica do módulo.
3. Imprime relatório.

Regras CSS são genéricas (body, section, table, .alert, .figure-split, etc.).
Não há nada Mod-1-específico além de cores e tipografia, que devem ser uniformes.
"""

import re
import sys
from pathlib import Path


MOD1 = Path("src/data/modules/modulo_01_via_aerea_iot.html")
TARGETS = [
    Path("src/data/modules/modulo_02_pos_intubacao_confirmacao.html"),
    Path("src/data/modules/modulo_03_ventilacao_mecanica.html"),
    Path("src/data/modules/modulo_04_manutencao_sedoanalgesia.html"),
    Path("src/data/modules/modulo_05_drogas_vasoativas.html"),
    Path("src/data/modules/modulo_06_disturbios_hidroeletroliticos.html"),
]


def extract_head_block(html: str) -> str:
    """Extrai o conteúdo entre </title> e </head> (links de fonte + styles)."""
    m = re.search(r"</title>\s*(.*?)</head>", html, flags=re.DOTALL)
    if not m:
        raise RuntimeError("padrao head nao encontrado")
    return m.group(1).strip()


def replace_head_block(html: str, new_block: str) -> str:
    """Substitui o conteúdo entre </title> e </head>."""
    return re.sub(
        r"(</title>\s*).*?(</head>)",
        lambda m: m.group(1) + "\n  " + new_block + "\n" + m.group(2),
        html,
        count=1,
        flags=re.DOTALL,
    )


def main() -> None:
    mod1_html = MOD1.read_text(encoding="utf-8")
    template = extract_head_block(mod1_html)
    print(f"[template] {len(template):,} chars extraidos de {MOD1.name}")
    print()

    for path in TARGETS:
        if not path.exists():
            print(f"[skip] {path} nao existe")
            continue
        html = path.read_text(encoding="utf-8")
        before = len(html)
        new_html = replace_head_block(html, template)
        after = len(new_html)
        path.write_text(new_html, encoding="utf-8")
        delta = after - before
        sign = "+" if delta >= 0 else ""
        print(f"  OK {path.name}: {before:,} -> {after:,} bytes ({sign}{delta:,})")


if __name__ == "__main__":
    main()
