"""
Copy centralizada dos criativos Meta Ads — Lancamento Assinatura.

Fonte unica de verdade para textos. Edite aqui e re-rode
render_all.py para regerar os PNGs. O copy.txt (briefing pro Meta
Ads Manager) e gerado a partir deste arquivo via build_copy_txt().
"""

ANGULO_A = {
    # Conceito interno: "Referencia consolidada"
    # Usado em: ad_a_dor.py (nome do .py preservado por compat)

    # --- elementos visuais do PNG ---
    "eyebrow":      "REFERENCIA CLINICA  ·  OFFLINE",
    "clock_text":   "9",
    "clock_label":  "MODULOS NO BOLSO",
    "headline":     "Tudo num lugar so.",
    "body": [
        "Protocolos, calculadoras e referencias.",
        "Do PS a UTI. Offline. Dark mode.",
    ],
    "price_chip":   "A PARTIR DE R$ 25,99 / MES",
    "price_note":   "R$ 16,67/mes no plano anual  ·  cancela quando quiser",
    "cta":          "VER PLANOS",
    "frame_label":  "AD  ·  REFERENCIA / META",

    # --- copy do Meta Ads Manager (vai no painel, nao no PNG) ---
    "meta_body": (
        "O Manual Virtus reune os 9 modulos que voce consulta no "
        "dia a dia: vias aereas, ventilacao, hemodinamica, drogas "
        "vasoativas, disturbios hidroeletroliticos, sedoanalgesia, "
        "calculadoras de dose, caderno de questoes e referencias.\n\n"
        "Util do pronto-socorro a UTI: residentes, intensivistas e "
        "quem atende paciente grave em UPA ou enfermaria.\n\n"
        "Offline. No celular. Dark mode.\n\n"
        "▸ A partir de R$ 25,99/mes\n"
        "▸ R$ 16,67/mes no plano anual\n"
        "▸ Cancela quando quiser"
    ),
    "meta_headline":    "Referencia clinica completa, offline, no celular.",
    "meta_description": "9 modulos. Offline. Assinatura a partir de R$ 25,99/mes.",
    "meta_cta_button":  "Saiba mais",

    # --- metadata pra naming / UTM ---
    "concept_slug":  "referencia",
    "adset_label":   "Adset-Referencia",
    "adset_intent":  "posicionamento positivo / referencia consolidada",
    "section_title": "ANGULO A — REFERENCIA CONSOLIDADA",
}

ANGULO_B = {
    # Conceito interno: "Uma ferramenta no lugar de varias"
    # Usado em: ad_b_antipdf.py (nome do .py preservado por compat)

    "eyebrow":      "MENOS ABAS  ·  MAIS CLAREZA",
    "headline_top": "6 PDFs abertos.",
    "headline_bot": "Ou 1 app.",
    "arrow_label":  "VIRA",
    "phone_letter": "V",
    "body": [
        "Calculadoras, protocolos e referencias",
        "numa unica interface clinica.",
    ],
    "price_chip":   "A PARTIR DE R$ 25,99 / MES",
    "cta":          "CONHECER O VIRTUS",
    "frame_label":  "AD  ·  ANTI-PDF / META",

    "meta_body": (
        "Por que abrir varios pdfs se uma so ferramenta ja serve?\n\n"
        "Voce abre o protocolo num pdf, a calculadora de dose noutro, "
        "a tabela de diluicao num terceiro e a referencia da diretriz "
        "num quarto. A cada turno.\n\n"
        "O Manual Virtus consolida 9 modulos numa unica interface, "
        "com calculadoras interativas e referencias por capitulo. "
        "Funciona offline e roda no celular.\n\n"
        "Util pra residente, plantonista de PS/UPA e intensivista.\n\n"
        "▸ A partir de R$ 25,99/mes\n"
        "▸ Cancela quando quiser"
    ),
    "meta_headline":    "6 PDFs ou 1 app. Voce decide.",
    "meta_description": "Manual clinico completo. Offline. Assinatura a partir de R$ 25,99/mes.",
    "meta_cta_button":  "Ver demonstracao",

    "concept_slug":  "uma_ferramenta",
    "adset_label":   "Adset-Uma-Ferramenta",
    "adset_intent":  "curiosity / comparativo workflow",
    "section_title": "ANGULO B — UMA FERRAMENTA NO LUGAR DE VARIAS",
}


# NOTA: phone_letter atualmente esta hardcoded em
# _common.py:render_phone_outline. Este campo documenta o valor;
# mudar o valor aqui sozinho NAO altera o PNG.


# ---------- segmentacao + naming compartilhados ----------

CAMPAIGN_NAME = "[Virtus] [Conversao] [Lancamento-Assinatura] [2026-05]"
URL_DESTINO   = "https://manualvirtus.com.br/"
UTM_BASE = (
    "?utm_source=meta&utm_medium=paid_social"
    "&utm_campaign=lancamento_assinatura&utm_content="
)

FORMATS = [
    ("1x1",  1080, 1080),
    ("4x5",  1080, 1350),
    ("9x16", 1080, 1920),
]

PUBLICO_1 = {
    "nome": "Interesses medicos amplos",
    "interesses": [
        "Medicina (geral)",
        "Medicina de emergencia",
        "Residencia medica",
        "Plantao medico",
        "Pronto-socorro",
        "Cuidados intensivos (UTI)",
    ],
    "idade": "25-55",
    "regiao": "Brasil",
    "idioma": "Portugues",
}

PUBLICO_2 = {
    "nome": "Profissoes (Meta detailed targeting)",
    "profissoes": [
        "Medico",
        "Residente medico",
        "Medico de emergencia / plantonista",
    ],
    "excluir": ["estudantes de medicina pre-internato"],
}

PUBLICO_3 = {
    "nome": "Lookalike (apos coletar primeiros eventos)",
    "fontes": [
        "LAL 1% Brasil baseado em quem completou checkout",
        "LAL 3% Brasil baseado em quem visitou /modulos",
    ],
}


# ---------- helpers ----------

def utm_for(concept_slug: str, fmt_slug: str) -> str:
    """Monta URL final com UTM para um angulo + formato."""
    return f"{URL_DESTINO}{UTM_BASE}{concept_slug}_{fmt_slug}"


# ---------- briefing legivel (copy.txt) ----------

_HEADER = """\
================================================================
META ADS — LANCAMENTO ASSINATURA
Pacote de 6 criativos (2 angulos x 3 formatos)
================================================================

OBJETIVO DA CAMPANHA: Conversoes (cadastro + checkout)
POSICIONAMENTOS:      Feed FB/IG, Stories IG, Reels IG (estaticos), Explore
PERIODO SUGERIDO:     4 dias de teste antes de CBO
VERBA MINIMA:         R$ 30-50/dia por adset
"""

_CHECKLIST = """\
----------------------------------------------------------------
PRE-FLIGHT CHECKLIST (antes de publicar)
----------------------------------------------------------------

[ ] Pixel da Meta instalado no site (confirmar evento PageView)
[ ] Evento "InitiateCheckout" disparando em /api/create-checkout-session
[ ] Evento "Purchase" disparando no callback /sucesso
[ ] Conta Meta Business Manager verificada
[ ] Dominio manualvirtus.com.br verificado no Business Manager
[ ] Politica de privacidade acessivel via rodape
[ ] UTMs nos links de cada criativo
[ ] Naming convention seguida em campanha/adset/criativo
[ ] Verba diaria definida com teto de seguranca
"""

_REGENERATE = """\
----------------------------------------------------------------
COMO RE-GERAR OS PNGs
----------------------------------------------------------------

Diretorio: marketing/meta-ads/lancamento-assinatura/

Renderizar tudo (PNGs + copy.txt):
  python render_all.py

Renderizar so um angulo:
  python ad_a_dor.py
  python ad_b_antipdf.py

Para iterar copy: editar copy.py (fonte unica), rodar render_all.py
de novo. PNGs sao sobrescritos e copy.txt e regenerado.

Fontes: lidas de canvas-design/canvas-fonts (skill canvas-design).
Se mover o projeto, atualizar FONT_DIR em _common.py.
"""

# Sufixo dos arquivos por angulo. Mapeia concept_slug -> prefixo do PNG
# (mantido por compat com o nome historico dos .py).
_PNG_PREFIX = {
    "referencia":     "ad_a_dor",
    "uma_ferramenta": "ad_b_antipdf",
}

_CRV_TAG = {
    "referencia":     "Crv-A",
    "uma_ferramenta": "Crv-B",
}


def _format_angulo(ang: dict) -> str:
    prefix = _PNG_PREFIX[ang["concept_slug"]]
    files_block = (
        f"  {prefix}_1x1.png    (1080x1080) — Feed FB/IG, Explore\n"
        f"  {prefix}_4x5.png    (1080x1350) — Feed IG mobile dominante\n"
        f"  {prefix}_9x16.png   (1080x1920) — Stories IG, Reels estatico"
    )
    return (
        "----------------------------------------------------------------\n"
        f"{ang['section_title']}\n"
        "----------------------------------------------------------------\n"
        "\n"
        "Texto principal (corpo do anuncio):\n"
        "---\n"
        f"{ang['meta_body']}\n"
        "---\n"
        "\n"
        "Titulo (headline curta — campo Meta):\n"
        f"  {ang['meta_headline']}\n"
        "\n"
        "Descricao (campo Meta):\n"
        f"  {ang['meta_description']}\n"
        "\n"
        "Botao CTA (Meta):\n"
        f"  {ang['meta_cta_button']}\n"
        "\n"
        "Arquivos:\n"
        f"{files_block}\n"
    )


def _format_naming() -> str:
    lines = [
        "----------------------------------------------------------------",
        "NAMING CONVENTION (Meta Ads Manager)",
        "----------------------------------------------------------------",
        "",
        "Campanha:",
        f"  {CAMPAIGN_NAME}",
        "",
        "Adsets:",
        f"  [{ANGULO_A['adset_label']}]      — intencao: {ANGULO_A['adset_intent']}",
        f"  [{ANGULO_B['adset_label']}]  — intencao: {ANGULO_B['adset_intent']}",
        "",
        "Anuncios:",
    ]
    for ang in (ANGULO_A, ANGULO_B):
        tag = _CRV_TAG[ang["concept_slug"]]
        for fmt_slug, _, _ in FORMATS:
            lines.append(f"  [{tag}-{fmt_slug}] [v1]")
    lines += [
        "",
        "Exemplo full:",
        f"  {CAMPAIGN_NAME} [{ANGULO_A['adset_label']}] [{_CRV_TAG[ANGULO_A['concept_slug']]}-1x1] [v1]",
        "",
    ]
    return "\n".join(lines)


def _format_utms() -> str:
    lines = [
        "----------------------------------------------------------------",
        "UTMs (link final no botao)",
        "----------------------------------------------------------------",
        "",
        f"URL destino: {URL_DESTINO}",
        "",
    ]
    label_for = {
        "referencia":     "Angulo A",
        "uma_ferramenta": "Angulo B",
    }
    fmt_label = {"1x1": "1:1", "4x5": "4:5", "9x16": "9:16"}
    for ang in (ANGULO_A, ANGULO_B):
        slug = ang["concept_slug"]
        for fmt_slug, _, _ in FORMATS:
            lines.append(f"{label_for[slug]} — {fmt_label[fmt_slug]}:")
            lines.append(f"  {utm_for(slug, fmt_slug)}")
            lines.append("")
    return "\n".join(lines)


def _format_segmentacao() -> str:
    lines = [
        "----------------------------------------------------------------",
        "SEGMENTACAO SUGERIDA (publico)",
        "----------------------------------------------------------------",
        "",
        f"Publico 1 — {PUBLICO_1['nome']}:",
    ]
    for it in PUBLICO_1["interesses"]:
        lines.append(f"  - {it}")
    lines.append(
        f"  Idade: {PUBLICO_1['idade']}  ·  {PUBLICO_1['regiao']}  ·  {PUBLICO_1['idioma']}"
    )
    lines += ["", f"Publico 2 — {PUBLICO_2['nome']}:"]
    for it in PUBLICO_2["profissoes"]:
        lines.append(f"  - {it}")
    lines.append(f"  Excluir: {', '.join(PUBLICO_2['excluir'])}")
    lines += ["", f"Publico 3 — {PUBLICO_3['nome']}:"]
    for it in PUBLICO_3["fontes"]:
        lines.append(f"  - {it}")
    lines.append("")
    return "\n".join(lines)


def build_copy_txt() -> str:
    """Gera o conteudo do copy.txt a partir desta fonte unica.

    Mantem o mesmo formato visual do copy.txt antigo (separadores,
    blocos rotulados) pra continuar servindo de briefing legivel
    pro Meta Ads Manager.
    """
    parts = [
        _HEADER,
        _format_angulo(ANGULO_A),
        _format_angulo(ANGULO_B),
        _format_naming(),
        _format_utms(),
        _format_segmentacao(),
        _CHECKLIST,
        _REGENERATE,
    ]
    return "\n".join(parts)
