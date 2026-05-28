# Pendências de Marketing — Manual Virtus

Backlog de melhorias dos assets de marketing (reels, voiceovers, carrosseis).
Cada item está numerado pra trabalhar uma a uma. Atualizar status quando
fechar item ou abrir item novo.

**Última atualização**: 2026-05-28

---

## Categoria A — Reels / Stories de vídeo

### A1. Bug do `ThreeCanvas` no Studio (cena 1 do StoryVideo-AntesDepois) — BLOQUEADO

- **Branch em aberto**: `feat/reel-antes-depois-narration` (8 commits pushados).
- **Sintoma**: `THREE.WebGLRenderer: Context Lost.` em loop dentro do Remotion
  Studio, disparando `Maximum update depth exceeded` no React 19. Cena 1
  (smartphone 3D girando) não roda no preview.
- **Causa raiz**: interação ruim entre `@remotion/three` ThreeCanvas + R3F v9
  + React 19 + Remotion Studio reciclando o canvas. Bug está dentro do R3F,
  não no código próprio.
- **Caminhos possíveis**:
  - **A1.a (recomendado)**: voltar pra smartphone 2D com CSS perspective +
    rotateY + canvas texture estática. Sem WebGL = sem context loss.
    Visual menos "3D real" mas estável. Custo: ~1h refactor do
    IPhoneScene3D.tsx.
  - **A1.b**: tentar fixes pontuais — useMemo → useRef no useScreenTexture,
    frameloop="demand" no ThreeCanvas, desligar HMR. Custo incerto, pode
    não resolver.
  - **A1.c**: aceitar erro só no Studio, render headless via
    `npx remotion render` pra MP4 final. Risco: render pode ter o mesmo
    bug em modo Chromium-headless.
- **Decisão pendente**.

### A2. Reels existentes seguem template visual genérico

- Composições atuais (`StoryVideo`, `StoryVideo-Vasoativas`, `ReelLancamento`,
  `QuizSerio`, `QuizLeve`, `StoryVideo-Hidroeletroliticos` etc.) compartilham
  exatamente o mesmo motor de beats (Hook → Problem → Stat → Insight →
  Solution → CTA), mesmo lighting, mesma paleta, mesma fonte.
- **Falta diferenciação visual por reel**: cada um parece reciclagem do anterior.
- **Falta animação 3D, modelagem de objetos por tema**:
  - Reel Via Aérea: poderia ter lâmina de laringoscópio + tubo orotraqueal 3D.
  - Reel Vasoativas: bomba de infusão 3D com displays animados.
  - Reel Sedoanalgesia: ampola/seringa 3D rotacionando.
  - Reel Hidroeletrolíticos: gradient de fluido / íons animados.
- **Falta interatividade visual**: cursor simulado, cliques em campos, transições
  entre cards. A nova `CalculadoraScene` do AntesDepois (cursor + digitação)
  é o único caso onde isso existe — propagar como padrão.
- **Ação**: definir variantes visuais distintas por reel, escolher 2-3 pra
  pilotar (sugestão: ViaAerea + Vasoativas primeiro).

### A3. Reels não-AntesDepois sem voiceover

- Apenas `StoryVideo-AntesDepois` tem MP3 narração (gerado via
  `npm run narrate -- antes-depois`).
- Os outros 20+ reels (StoryVideo, Vasoativas, etc.) rodam sem áudio.
- **Ação**: adicionar SPECS no `scripts/generate-narration.mjs` pra cada slug,
  rodar `npm run narrate` (ou `npm run narrate -- <slug>`), integrar
  `<Audio>` em cada composição.

### A4. PR `feat/reel-antes-depois-narration` ainda não aberta

- 8 commits em `origin/feat/reel-antes-depois-narration`, prontos pra review.
- URL pra abrir: https://github.com/andremsena-stack/manual-medicina-intensiva/pull/new/feat/reel-antes-depois-narration
- **Ação**: abrir PR pela web, decidir se merge antes ou depois de resolver A1.

### A5. Render MP4 final do StoryVideo-AntesDepois não produzido

- **Bloqueado por A1**.
- Quando A1 resolver:
  ```
  cd marketing/remotion-story
  npx remotion render src/index.ts StoryVideo-AntesDepois out/antes-depois.mp4
  ```

### A6. Revisão visual completa do reel ainda pendente

- **Bloqueado por A1** (Studio não consegue renderizar cena 1).
- Smoke test só validou metadata (duration, fps, sem erros React no carregamento
  da comp). Cenas 2/3/4 (React puro) devem funcionar mas não foram vistas.

---

## Categoria B — Voiceover (ElevenLabs TTS)

### B1. Voz única (Adam, multilingual_v2) em todos os specs

- Voice ID `pNInz6obpgDQGcFmaJgB` — voz masculina genérica do ElevenLabs.
- Falta identidade sonora da marca Manual Virtus.
- **Caminhos**:
  - **B1.a**: usar voz médica masculina mais autoritativa do catálogo
    ElevenLabs (ex: George, Daniel, Brian).
  - **B1.b**: voice cloning — gravar 1-2 min de áudio próprio (ou de um
    intensivista parceiro com permissão), criar voz custom no ElevenLabs.
    Mais identitário mas exige consentimento gravado.
- **Decisão pendente**.

### B2. Cadência genérica do TTS

- Configurações atuais em `SPECS[0]`: `stability 0.55, similarity_boost 0.75,
  style 0.15, use_speaker_boost true`.
- `style 0.15` é flat — pouca emoção. Pode subir pra 0.40-0.60 em cenas
  dramáticas (cena 4 do AntesDepois, caso clínico de choque séptico,
  poderia ter `style 0.55`).
- **Ação**: parametrizar `voiceSettings` por slug, testar variações.

### B3. Sem efeitos sonoros / jingle

- Reels não tem SFX marcando momentos (entrada do logo, "click" no botão da
  calc, "swoosh" dos ícones voando).
- Sem música de fundo / bed track.
- **Ação**: definir biblioteca de SFX (Freesound CC0 ou pack pago), criar
  componente `<SfxLayer>` que toca via `<Audio>` em frames específicos.
  Avaliar se música de fundo cabe (pode brigar com narração).

---

## Categoria C — Carrosseis (Instagram / posts estáticos)

### C1. Formatação igual em todos os carrosseis existentes

- Pastas atuais (`marketing/carrossel-*`, `marketing/instagram-carrossel-*`,
  `marketing/post-funcoes-atuais/`, etc.) usam mesma fonte, mesmo gradient
  background, mesma estrutura de slides.
- **Falta variação visual por carrossel**: cores de destaque diferentes por
  tema clínico, ilustrações específicas, formatos de slide diferentes
  (texto + foto, só texto, gráfico, comparativo).
- **Ação**: definir 3-4 templates visuais distintos (ex: "caso clínico",
  "guia técnico", "comparativo antes/depois", "checklist").

### C2. Carrosseis 100% tipográficos — falta prints/imagens reais do app

- Nenhum carrossel atual usa screenshots da landing, dos módulos clínicos
  ou da calculadora.
- **Ação**: capturar screenshots em alta resolução de:
  - Landing pós-login (ModuleHome com 9 módulos)
  - Tela de um módulo clínico (ex: ModuleViewer Vasoativas)
  - Tela das calculadoras interativas (Mod 7) com inputs e resultado
  - Tela da landing pré-login (SignedOutScreen)
  - Mockup mobile (iframe ou device frame) com app rodando
- Integrar nos carrosseis como "prova" visual do produto.

### C3. Sem storytelling com dor / cenário clínico complexo

- Carrosseis atuais falam de "funcionalidades" no abstrato (sem caso real).
- **Falta narrativa**: paciente → o que você faria? → como o Manual Virtus
  ajuda → resultado.
- **Cenário-piloto sugerido pelo usuário**:

  > Paciente vítima de TCE, evolui com diurese de 3000 mL em 5h, admitido
  > com rebaixamento de nível de consciência e PAM 45 (estime PAS e PAD
  > pelo cálculo), Glasgow 8, FR 41 e SpO₂ 84%.
  >
  > Exames: Na 158, K 5.4, gasometria compatível com SIADH (pelo TCE);
  > peso 75 kg → calcula o peso predito.
  >
  > Sequência de raciocínio:
  > 1. Indicação de intubação (Glasgow 8 + SpO₂ 84% + FR 41).
  > 2. Drogas pra sequência rápida (SRI) — usar calc do Manual.
  > 3. Pós-IOT: parâmetros ventilatórios com peso predito calculado.
  > 4. Suporte com vasoativas — bomba de NA com calc.
  > 5. Hipernatremia 158 — correção segura via módulo de distúrbios
  >    hidroeletrolíticos.

### C4. Categoria nova proposta: "carrossel cenário clínico guiado"

- Estrutura sugerida (10-12 slides):
  - Slide 1: Hook visual + situação clínica em 1 frase.
  - Slides 2-3: Apresentação do paciente (sinais vitais, exame, exames lab).
  - Slide 4: "O que você faria?" (engagement / pausa).
  - Slides 5-9: Cada decisão clínica + screenshot da tela do Manual mostrando
    a calc / módulo / drogas relevantes.
  - Slide 10: Recap visual do fluxo completo.
  - Slide 11: CTA + URL.
- **Piloto**: implementar com o cenário TCE/SIADH de C3.
- **Ação**: criar pasta `marketing/carrossel-cenario-tce-siadh/` com
  generator Python ou Remotion-baseado (depende do tooling preferido).

---

## Categoria D — Backlog técnico curto remanescente

### D1. MP3 antes-depois regerado já commitado (`c694f13`)

- Status: **feito**, pushado para `origin/feat/reel-antes-depois-narration`.
- Sem ação pendente.

### D2. Suporte a `.env` no `generate-narration.mjs` commitado (`b25fa4c`)

- Status: **feito**, pushado.
- Sem ação pendente.

### D3. Limpeza do projeto Remotion

- Há `src/StoryVideo.tsx` antigo (484 linhas) com pattern de beats que
  convive com nova estrutura por composições em `src/compositions/`.
- Pode haver oportunidade de unificar a arquitetura, mas é refactor grande
  que NÃO bloqueia novo conteúdo.
- **Prioridade baixa**.

### D4. Branch `feat/reel-antes-depois-narration` poluída — viola feedback_branch_hygiene

- O nome da branch sugere SÓ narração, mas empilhei 8 commits de temas
  diferentes:
  - `ca23dc5` narração ElevenLabs (compatível com o nome) ✓
  - `24bad2f` label AHA → Distúrbios hidroeletroliticos (cosmético, não é
    narração)
  - `6e5d14a` npm install Three.js + R3F + drei + remotion/three (setup
    completamente novo)
  - `ff184f0` IPhoneScene3D + icons extract (redesign 3D, fora do escopo)
  - `0417736` refator pra 4 cenas + CalculadoraScene (redesign completo)
  - `b9f9fc7` texto novo do spec narração (compatível com o nome) ✓
  - `b25fa4c` suporte .env (chore, não narração)
  - `c694f13` MP3 regerado (compatível com o nome) ✓
- **Regra violada**: `feedback_branch_hygiene` — cada novo tema entra em
  branch própria com nome descritivo. Quando começou o "redesign 3D" eu
  deveria ter pedido branch nova tipo `feat/reel-antes-depois-redesign-3d`.
- **Opções de saída**:
  - **D4.a (mais limpa)**: criar branches separadas retrospectivas
    `chore/reel-narration-elevenlabs`, `feat/reel-antes-depois-redesign-3d`,
    `chore/remotion-narrate-env-support` via cherry-pick, abrir PRs
    separadas, fechar a atual sem merge. Trabalhoso.
  - **D4.b (pragmática)**: aceitar PR única com TODOS os commits, mergear
    em main com squash que reescreve a mensagem englobando tudo, deletar
    branch. Histórico fica chato mas resolve.
  - **D4.c**: rebase interativo pra reorganizar commits e fazer push --force
    na própria branch antes da PR. Mantém um nome poluído mas commits
    fazem sentido.
- **Decisão pendente** quando voltar pro trabalho.

---

## Como usar este arquivo

- Quando começar um item, marcar com `🚧 EM ANDAMENTO` no título.
- Quando fechar, marcar com `✅ FEITO em YYYY-MM-DD`.
- Itens novos descobertos no caminho: adicionar na categoria certa,
  numerar continuando a sequência (A7, B4, etc.).
- Não apagar itens feitos — mover pra seção `## Concluído` no fim do arquivo
  pra ter histórico.
