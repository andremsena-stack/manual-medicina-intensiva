# Brief: <título-curto-da-peça>

> Copia este arquivo, renomeia pro slug da peça (`<canal>-<tema>-<versão>.md`,
> ex: `instagram-carrossel-broncoespasmo-v1.md`) e preenche tudo abaixo
> **antes** de gerar qualquer asset.

## Identidade

- **Slug**: `<canal>-<tema>-<versão>`
- **Canal**: <Instagram feed | Stories | Reel | LinkedIn | Meta Ads | YouTube Shorts | …>
- **Formato**: <carrossel 1080×1350 / story 1080×1920 / reel 1080×1920 vertical / post quadrado / …>
- **Quantidade de slides/duração**: <ex: 6 slides | 15s | 30s>
- **Status**: `draft` | `approved` | `in-production` | `published` | `archived`
- **Data alvo**: <YYYY-MM-DD>
- **Autor do brief**: <nome>

## Público e contexto

- **Quem vai ver**: <perfil clínico, especialidade, momento (plantão, estudo, etc.)>
- **Por onde chega**: <feed orgânico | impulsionado | indicação | hashtag | …>
- **Estado mental quando vê**: <cansado / curioso / pesquisando / scrollando à toa>

## Mensagem

- **Frase única (≤ 12 palavras)**: <a coisa que a peça precisa entregar; se
  alguém ler só uma linha, é essa>
- **Promessa secundária (opcional)**: <gatilho de ação ou continuidade>
- **CTA**: <link / "comente Manual" / "salva pra plantão" / nenhum>

## Recurso primário (escolher UM)

- [ ] Spline (cena 3D abstrata custom)
- [ ] Sketchfab (modelo 3D realista existente)
- [ ] Three.js / R3F direto (cena custom com código)
- [ ] Vídeo real (câmera + edição)
- [ ] Imagem AI (Bloom / Midjourney)
- [ ] Tipografia animada (GSAP / Lottie)
- [ ] Screenshot real do app em mockup
- [ ] Foto técnica/produto

**Justificar a escolha em uma frase**: <por que ESTE recurso pra ESTA peça>

**Recurso primário das duas peças anteriores**: <listar; não pode repetir o
mesmo das últimas 2 sem justificativa explícita aqui>

## Recurso de apoio (no máximo UM)

- [ ] Nenhum (recomendado quando o primário já é forte)
- [ ] <um da lista acima> — usado pra <onde, e por quê>

## Estética

- **Paleta**: <hex codes ou nome — ex: navy escuro #081726 + cyan #30f1e6>
- **Tipografia**: <fonte + pesos — ex: Inter Tight 800 títulos / 500 body>
- **Mood**: <3 adjetivos — ex: clínico, urgente, confiável>
- **Referência inspiracional**: <link ou print de algo que captura o espírito;
  isso AJUDA, não é cópia>

## Estrutura por slide / cena

| # | Recurso visual | Texto principal | Notas |
|---|---|---|---|
| 1 | <Spline / Sketchfab / etc> | <título de impacto> | <observação técnica> |
| 2 | … | … | … |
| 3 | … | … | … |
| … | | | |

## O que NÃO está nesta peça

Definir negativamente força clareza:

- <Ex: "Não é tutorial de uso do app">
- <Ex: "Não cita preço">
- <Ex: "Não mostra pessoa real">

## Riscos / cuidados

- **Conteúdo clínico**: se a peça menciona dose, fluxo, fórmula ou
  recomendação médica, isso passa por revisão clínica? Se sim, marcar como
  `REQUER REVISAO MEDICA` (ver [`docs/changelog.md`](../../docs/changelog.md)).
- **Direitos de imagem**: bancos de imagem + IA generativa têm licença para
  uso comercial? Modelos Sketchfab têm licença CC compatível?
- **Plataforma**: anúncio Meta exige < 20% de texto em imagem; checar.

## Briefing aprovado por

<nome / data>

## Pós-publicação

> Preencher após a peça ir ao ar.

- **Link publicado**: <URL>
- **Métricas iniciais (24h / 7d)**: <impressões, alcance, salvamentos, CTR>
- **Aprendizado**: <o que funcionou, o que não, o que fazer diferente>
- **Status final**: `archive` quando arquivar.
