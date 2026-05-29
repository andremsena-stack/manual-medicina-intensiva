# Carrossel — Cenário clínico: TCE → SIADH → IOT → vasoativas → correção de hipernatremia

Carrossel Instagram 4:5 (1080×1350) — 11 slides — Manual Virtus.

## O que é

Storytelling clínico no formato carrossel. Em vez de listar funcionalidades
do Manual no abstrato, esse carrossel passa por **um caso concreto** (TCE
pós-trauma que evolui com SIADH e empilha 4 decisões críticas em 8 min)
e mostra **onde o Manual Virtus apoia cada decisão** — calc de peso predito,
diluição de noradrenalina (Mod 5 §5.1), regra de correção segura de Na
(Mod 6).

Endereça as fragilidades C2 e C3 do `docs/PENDENCIAS_MARKETING.md`:
storytelling com dor + prints/cards demonstrando funcionalidade.

## Como gerar

```bash
cd marketing/carrossel-cenario-tce-siadh
python generate.py
```

Saída em `slides/slide_01.png` ... `slide_11.png`.

### Dependências

```
pip install Pillow
```

Versão testada: Python 3.14.5 + Pillow 12.2.0 em Windows 11.

### Fontes

O gerador tenta **Inter** (família oficial da marca) e cai pra **Segoe UI**
(Windows) ou Arial como fallback. Pra usar Inter em todas as máquinas,
baixe os pesos `Inter-Bold.ttf`, `Inter-SemiBold.ttf`, `Inter-Medium.ttf`,
`Inter-Regular.ttf` em https://fonts.google.com/specimen/Inter e coloque em:

```
marketing/carrossel-cenario-tce-siadh/fonts/
```

## Estrutura dos slides

| # | Role | Tema |
|---|---|---|
| 1 | Hook | 23h47 + sinais vitais alarmantes |
| 2 | Setup | Quem é o paciente (75 kg, TCE há 6h, poliúria) |
| 3 | Insight | Exames apontam SIADH pós-TCE |
| 4 | Engagement | "O que prioriza nos próximos 5 min?" A/B/C/D |
| 5 | Decisão 1 | IOT (Mod 1) |
| 6 | Decisão 2 | Peso predito + Vt protetora (Mod 7) |
| 7 | Decisão 3 | Noradrenalina (Mod 5 §5.1) |
| 8 | Decisão 4 | Hipernatremia 158, alerta mielinólise (Mod 6) |
| 9 | Recap | Smartphone com 4 apps + timeline |
| 10 | Prova social | Surviving Sepsis 2024 + ARDSNet + SBEM + Manual |
| 11 | CTA | Manual Virtus R$ 25,99/mês + handle |

## Regras clínicas seguidas

- **Doses, diluições, fórmulas e limites são canônicos** do Mod 5/6 do Manual
  ou derivados diretamente do enunciado do cenário. Nada inventado.
- **Hipernatremia**: regra obrigatória "máx 10 mEq/L em 24 h" pra evitar
  mielinólise pontina. Banner vermelho no slide 8.
- **Peso predito ≠ peso real**: usado pra cálculo de Vt protetor (slide 6).
  Peso real (75 kg) usado pra dose de noradrenalina (slide 7). Footer do
  slide 6 explicita a diferença pra evitar confusão.

## Referências usadas

- Mod 5 §5.1 — Manual Virtus (noradrenalina, diluição padrão)
- Mod 6 — Manual Virtus (distúrbios hidroeletrolíticos)
- Surviving Sepsis Campaign 2024
- ARDSNet
- SBEM / SBEM-SP (SIADH e hipernatremia hospitalar)

## Reusabilidade

Esse formato — "23h47 + leito X + sinais alarmantes → 4 decisões → recap → CTA"
— vira **template repetível** pra outros cenários. Pra criar um novo, copie
esta pasta e troque os slides 1-8 com a clínica do novo cenário. Slides 9-11
mantém estrutura visual.

Próximos cenários sugeridos:
- Choque anafilático
- FA aguda com instabilidade
- Sepse abdominal
- Status epilepticus
- IAM com supra com choque cardiogênico
