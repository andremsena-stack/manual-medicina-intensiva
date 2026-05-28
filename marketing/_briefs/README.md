# Briefs de marketing — convenção de criação

Sistema para evitar que materiais visuais saiam com cara de produção em massa
(carrosséis com 7 slides idênticos, mesma paleta, mesma estrutura). Cada peça
preenche um **brief** antes de ser produzida — e o brief força a justificar
**por que essa peça é diferente das outras**.

## Arquivos

```
marketing/_briefs/
├── README.md                       ← este arquivo
├── _TEMPLATE.md                    ← template em branco; copia pra criar brief novo
├── <slug-da-peca>.md               ← um por peça (ex: carrossel-fundador-v3.md)
└── _archive/                       ← briefs de peças já publicadas (opcional)
```

## Fluxo

1. **Antes** de gerar qualquer asset (slide, vídeo, reel, story), copie
   `_TEMPLATE.md` pra `<slug-da-peca>.md` e preencha tudo:
   - Público + canal
   - Mensagem central em uma frase
   - **Recurso primário** (uma única escolha — ver tabela abaixo)
   - **Por que esse recurso e não outro nesta peça** (forçada)
   - Recursos de apoio (no máximo 1)
   - Referência inspiracional (link ou print)
2. Discutir/aprovar o brief.
3. Só depois disso, gerar os assets na pasta correspondente
   (`marketing/<slug-da-peca>/`).
4. Quando publicar, mover o brief pra `_archive/` (ou marcar `status: published`).

## Recursos disponíveis e quando usar

| Recurso | Onde brilha | Onde NÃO usar |
|---|---|---|
| **Spline** ([spline.design](https://spline.design)) | Cenas 3D abstratas, fluxos, transformações de superfície/luz. Hero estético. | Quando o conteúdo é literal (ampola, monitor); fica genérico. |
| **Sketchfab** ([sketchfab.com](https://sketchfab.com)) | Modelos 3D realistas existentes: anatomia, equipamento UTI, ampolas. Autenticidade técnica. | Quando você precisa de animação custom (Sketchfab tem só auto-spin). |
| **Three.js / React-Three-Fiber direto** | Cena custom com física, partículas, controle total. Singularidade máxima. | Peças rápidas — custo alto. |
| **Vídeo real** (câmera + edição) | Plantão real, mão segurando ampola, monitor real. Autenticidade emocional. | Quando você precisa de abstração ou conceito. |
| **Imagem AI** (Bloom / Midjourney) | Conceitos abstratos ("instinto clínico", "a hora errada de intubar"), capas editoriais. | Quando precisa de precisão técnica (mãos com 7 dedos viralizam errado). |
| **Tipografia animada** (GSAP / Lottie) | Frases-chave em movimento, peça minimalista. | Quando o argumento é visual, não verbal. |
| **Screenshot real do app** (mockup) | Provar funcionalidade. "Olha o produto rodando." | Hero — fica chato sem composição extra. |
| **Foto técnica/produto** (banco de imagens ou própria) | Contexto clínico, ambientação. | Hero de marca — falta singularidade. |

## Regra anti-repetição

**Nenhuma peça publicada nos últimos 14 dias pode ter o mesmo recurso primário
da próxima.** Se a última foi Spline, a próxima escolhe entre as outras 7
opções. Quando a lista esgotar, recomeça com variação dentro do recurso (ex:
Spline noturno vs Spline com líquido vs Spline tipográfico).

Vai gerar:
- Cadências mais ricas no feed (Instagram, LinkedIn);
- Material reaproveitável em contextos diferentes;
- Decisão deliberada em vez de "qual template a gente usa hoje".

## Onde os assets vivem

Tudo em `marketing/<slug-da-peca>/`. Esse subfolder fica **fora do repo**
(gitignored em `.gitignore` raiz). Só os briefs (`marketing/_briefs/*.md`) são
versionados — eles são a propriedade intelectual decisória, os PNGs são
exports.

## Padrão dos slugs

`<canal>-<tema>-<versao>` em kebab-case. Exemplos:

- `instagram-carrossel-broncoespasmo-v1`
- `linkedin-post-furosemida-v1`
- `reel-antes-depois-paywall-v2`
- `story-bug-amiodarona-v1`

`v1` evita conflito se a mesma ideia ganhar versões diferentes (variação A/B).
