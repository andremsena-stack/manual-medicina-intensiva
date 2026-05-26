#!/usr/bin/env python3
"""
Converte Mod 8 (Caderno de questoes) para versao interativa:
  - Cada questao vira <form> com radios A-D
  - Adiciona id/data-correct/data-error-type/data-q-id ao <article>
  - Header da questao ganha chip de status "nao respondida"
  - Cada secao <section id="cad-mod-N"> vira <details open> colapsavel
    com progresso "X/10 respondidas"

Tipos de erro classificados por questao (qkey "N.M"):
  - conceitual    Definicao, regra, criterio (Lembrar/Compreender)
  - calculo       Calculo de dose/vazao/preparo
  - fisiologico   Mecanismo fisiologico, resposta organica
  - farmacologico Escolha de droga, dose, interacao
  - procedural    Sequencia de acoes, algoritmo, protocolo
  - interpretativo Leitura de exame, tracado, estudo

Reverter aborta se nao achar dados esperados, preservando o original.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "modules" / "modulo_08_caderno_questoes.html"

ERROR_TYPES = {
    # M1 Via aerea e IOT
    "1.1": "conceitual",     "1.2": "fisiologico",   "1.3": "farmacologico",
    "1.4": "conceitual",     "1.5": "fisiologico",   "1.6": "farmacologico",
    "1.7": "interpretativo", "1.8": "procedural",    "1.9": "fisiologico",
    "1.10": "procedural",
    # M2 Pos-IOT
    "2.1": "conceitual",     "2.2": "interpretativo","2.3": "procedural",
    "2.4": "calculo",        "2.5": "conceitual",    "2.6": "calculo",
    "2.7": "interpretativo", "2.8": "conceitual",    "2.9": "fisiologico",
    "2.10": "procedural",
    # M3 VM
    "3.1": "conceitual",     "3.2": "conceitual",    "3.3": "calculo",
    "3.4": "interpretativo", "3.5": "fisiologico",   "3.6": "fisiologico",
    "3.7": "farmacologico",  "3.8": "procedural",    "3.9": "fisiologico",
    "3.10": "conceitual",
    # M4 Sedoanalgesia
    "4.1": "conceitual",     "4.2": "conceitual",    "4.3": "calculo",
    "4.4": "farmacologico",  "4.5": "interpretativo","4.6": "procedural",
    "4.7": "conceitual",     "4.8": "farmacologico", "4.9": "calculo",
    "4.10": "procedural",
    # M5 Vasoativas
    "5.1": "conceitual",     "5.2": "fisiologico",   "5.3": "farmacologico",
    "5.4": "calculo",        "5.5": "fisiologico",   "5.6": "farmacologico",
    "5.7": "interpretativo", "5.8": "calculo",       "5.9": "farmacologico",
    "5.10": "procedural",
    # M6 H/E
    "6.1": "conceitual",     "6.2": "fisiologico",   "6.3": "conceitual",
    "6.4": "calculo",        "6.5": "procedural",    "6.6": "calculo",
    "6.7": "farmacologico",  "6.8": "conceitual",    "6.9": "procedural",
    "6.10": "procedural",
    # M7 Calculadoras
    "7.1": "calculo",        "7.2": "calculo",       "7.3": "calculo",
    "7.4": "calculo",        "7.5": "calculo",       "7.6": "conceitual",
    "7.7": "calculo",        "7.8": "calculo",       "7.9": "calculo",
    "7.10": "procedural",
}

LETTERS = ["A", "B", "C", "D"]

text = SRC.read_text(encoding="utf-8")

# Skip if already converted (idempotente)
if 'class="quiz-q__form"' in text:
    print("[skip] arquivo ja convertido (encontrei quiz-q__form)")
    raise SystemExit(0)

# --- 1) Transformar cada <article class="quiz-q"> -----------------------
article_re = re.compile(
    r'<article class="quiz-q">([\s\S]*?)</article>'
)

def process_article(m):
    body = m.group(1)

    num_m = re.search(r'Questao\s+(\d+)\.(\d+)|Quest\xe3o\s+(\d+)\.(\d+)', body)
    if not num_m:
        return m.group(0)
    chapter = num_m.group(1) or num_m.group(3)
    qnum = num_m.group(2) or num_m.group(4)
    q_id = f"q-{chapter}-{qnum}"
    qkey = f"{chapter}.{qnum}"

    correct_m = re.search(
        r'Resposta correta:\s*<strong>\s*([ABCD])\s*</strong>',
        body,
    )
    if not correct_m:
        return m.group(0)
    correct = correct_m.group(1)
    error_type = ERROR_TYPES.get(qkey, "conceitual")

    # Substitui <ol class="quiz-q__options">...</ol> por <form>
    ol_m = re.search(
        r'<ol class="quiz-q__options">([\s\S]*?)</ol>',
        body,
    )
    if not ol_m:
        return m.group(0)
    ol_inner = ol_m.group(1)
    li_re = re.compile(r'<li>([\s\S]*?)</li>')
    options = li_re.findall(ol_inner)
    if len(options) != 4:
        return m.group(0)

    form_lines = [f'<form class="quiz-q__form" data-q-id="{q_id}">']
    for idx, raw in enumerate(options):
        letter = LETTERS[idx]
        opt = raw.strip()
        form_lines.append(
            f'          <label class="quiz-q__opt" data-letter="{letter}">'
            f'<input type="radio" name="{q_id}" value="{letter}" aria-label="Alternativa {letter}">'
            f'<span class="quiz-q__opt-letter" aria-hidden="true">{letter}</span>'
            f'<span class="quiz-q__opt-text">{opt}</span>'
            f'</label>'
        )
    form_lines.append('        </form>')
    form_html = '\n'.join(form_lines)
    body = body.replace(ol_m.group(0), form_html)

    # Insere status chip no header (apos o bloom)
    body = re.sub(
        r'(<span class="quiz-q__bloom"[^>]*>[^<]*</span>)\s*</header>',
        r'\1<span class="quiz-q__status" data-status="unanswered">nao respondida</span></header>',
        body,
        count=1,
    )

    open_tag = (
        f'<article class="quiz-q" id="{q_id}" '
        f'data-q-id="{q_id}" '
        f'data-correct="{correct}" '
        f'data-error-type="{error_type}">'
    )
    return open_tag + body + '</article>'

text = article_re.sub(process_article, text)

# --- 2) Embrulhar cada secao em <details open class="quiz-chapter"> ------
section_re = re.compile(
    r'<section id="cad-mod-(\d+)">\s*'
    r'(<span class="section-eyebrow">[^<]*</span>)\s*'
    r'(<h2>[^<]*</h2>)\s*'
    r'([\s\S]*?)\s*'
    r'</section>'
)

def wrap_chapter(m):
    ch_num, eyebrow, h2, inner = m.groups()
    return (
        f'<section id="cad-mod-{ch_num}" class="quiz-chapter-section">\n'
        f'      <details open class="quiz-chapter" data-chapter="{ch_num}">\n'
        f'        <summary class="quiz-chapter__summary">\n'
        f'          {eyebrow}\n'
        f'          {h2}\n'
        f'          <span class="quiz-chapter__progress" data-chapter-progress="{ch_num}" aria-live="polite">0 / 10 respondidas</span>\n'
        f'        </summary>\n'
        f'        <div class="quiz-chapter__body">\n'
        f'          {inner}\n'
        f'        </div>\n'
        f'      </details>\n'
        f'    </section>'
    )

# Substitui apenas as 7 secoes cad-mod-N
text = section_re.sub(wrap_chapter, text)

SRC.write_text(text, encoding="utf-8")
print(f"[ok] {SRC.name} convertido para versao interativa")
