"""
Padroniza SVGs nos módulos clínicos para a paleta cyan + DM Sans + DNA do
projeto. Não altera estrutura — apenas cores, fontes e stroke-widths.

Regras:
- font-family="Arial" / font-family="Arial, ..." removidos (herdam DM Sans do CSS)
- Cor velha → Cor nova (paleta cyan + navy + amber + crit):

  #0b6b5c (verde-petróleo) → #12bed1 (cyan)
  #067647 (verde-floresta) → #0a8a9a (cyan-deep)
  #b54708 (amber-antigo)   → #c4690a (amber-novo)
  #b42318 (crit) → preservado (#b42318)
  #123c69 (navy) → preservado (#123c69)
  #5f6b7a (cinza)  → preservado (#5f6b7a)

  Backgrounds claros antigos → mantidos quando dentro de svg-box (svg-box ja tem bg)
  #f8fbff e #fff dentro de <rect width="..." height="..."> de SVG → removidos
  (deixar transparente, svg-box fornece o fundo).

- Stroke-width="3" → 2 (mais sutil)
- font-size dos textos: ajuste para 12-14 quando muito grande (>=18)

Uso:
    python scripts/standardize-svgs.py [arquivos...]
"""

import re
import sys
from pathlib import Path


COLOR_MAP = {
    # Verde-petróleo -> cyan
    "#0b6b5c": "#12bed1",
    "#0B6B5C": "#12bed1",
    # Verde-floresta -> cyan-deep
    "#067647": "#0a8a9a",
    "#067647": "#0a8a9a",
    # Amber antigo -> amber novo
    "#b54708": "#c4690a",
    "#B54708": "#c4690a",
    # Tons claros de alerta antigos
    "#ecfdf3": "#e6f7fa",  # green-pale -> cyan-pale
    "#fff7ed": "#fff5e6",  # amber-pale
    "#dce9f6": "#dce9f6",  # navy-pale - keep
    "#fff1f0": "#fef5f4",  # red-pale
    # cinzas neutros — preservados via não-mapeamento
}


def standardize_svg_block(svg_text: str) -> str:
    """Aplica todas as transformações em um único bloco SVG."""
    out = svg_text

    # 1. Substitui cores antigas pelas novas
    for old, new in COLOR_MAP.items():
        out = out.replace(old, new)

    # 2. Remove font-family="Arial" / "Arial, ..." — deixa herdar do CSS pai
    out = re.sub(r'\s*font-family="Arial[^"]*"', "", out)

    # 3. Reduz stroke-width="3" para 2 (mais sutil/moderno)
    out = re.sub(r'stroke-width="3"', 'stroke-width="2"', out)

    # 4. font-size grande (>=18) reduz para 14 ou 13
    def shrink_fs(m):
        size = int(m.group(1))
        if size >= 20:
            new_size = 14
        elif size >= 18:
            new_size = 13
        else:
            return m.group(0)
        return f'font-size="{new_size}"'

    out = re.sub(r'font-size="(\d+)"', shrink_fs, out)

    return out


def process_html(path: Path) -> int:
    """Processa um arquivo HTML. Retorna número de SVGs modificados."""
    html = path.read_text(encoding="utf-8")

    # Captura cada <svg>...</svg>
    svg_pattern = re.compile(r"<svg\b[^>]*>.*?</svg>", flags=re.DOTALL)

    count = 0
    changes = []

    def replace_svg(m):
        nonlocal count
        original = m.group(0)
        modified = standardize_svg_block(original)
        if modified != original:
            count += 1
            # Reporta as primeiras diffs
            orig_short = re.search(r'aria-label="([^"]*)"', original)
            label = orig_short.group(1) if orig_short else "(sem label)"
            changes.append(label[:60])
        return modified

    new_html = svg_pattern.sub(replace_svg, html)

    if new_html != html:
        path.write_text(new_html, encoding="utf-8")
        print(f"  OK {path.name}: {count} SVG(s) modificado(s)")
        for c in changes[:5]:
            print(f"     - {c}")
        if len(changes) > 5:
            print(f"     ... e mais {len(changes) - 5}")
    else:
        print(f"  {path.name}: sem mudancas")

    return count


def main() -> None:
    if len(sys.argv) < 2:
        targets = [
            Path("src/data/modules/modulo_01_via_aerea_iot.html"),
            Path("src/data/modules/modulo_02_pos_intubacao_confirmacao.html"),
            Path("src/data/modules/modulo_03_ventilacao_mecanica.html"),
            Path("src/data/modules/modulo_04_manutencao_sedoanalgesia.html"),
            Path("src/data/modules/modulo_05_drogas_vasoativas.html"),
            Path("src/data/modules/modulo_06_disturbios_hidroeletroliticos.html"),
        ]
    else:
        targets = [Path(p) for p in sys.argv[1:]]

    total = 0
    for path in targets:
        if not path.exists():
            print(f"[skip] {path}")
            continue
        total += process_html(path)
    print(f"\n[done] {total} SVG(s) padronizado(s) no total")


if __name__ == "__main__":
    main()
