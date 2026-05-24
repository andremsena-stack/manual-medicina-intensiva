# Changelog

## 2026-05-22 — Renumeração: Distúrbios → Mod 7, Referências → Mod 8 (regra final)

### Tipo de alteração

- Arquitetura/convenção — **regra estabelecida**: módulo de Referências
  consolidadas sempre fica como ÚLTIMO módulo. Cada novo módulo clínico
  adicionado empurra Referências para o final e renumera tudo.

### Alterações realizadas

**1. Arquivos renomeados** (via `git mv` — preserva histórico):
- `modulo_07_referencias.html` → `modulo_08_referencias.html`
- `modulo_08_disturbios_hidroeletroliticos.html` → `modulo_07_disturbios_hidroeletroliticos.html`

**2. `src/data/moduleSources.ts`** — ordem e atribuições atualizadas:
- `id: "modulo-07"` agora aponta para Distúrbios (number 7)
- `id: "modulo-08"` agora aponta para Referências (number 8)

**3. Conteúdo HTML atualizado**:

`modulo_07_disturbios_hidroeletroliticos.html`:
- `<title>`: "Módulo 8: Distúrbios..." → "Módulo 7: Distúrbios..."
- Hero h2: "Módulo 8 — Distúrbios..." → "Módulo 7 — Distúrbios..."

`modulo_08_referencias.html`:
- `<title>`: "Módulo 7: Referências" → "Módulo 8: Referências"
- Aside brand h1: "Módulo 7" → "Módulo 8"
- Aside brand parágrafo: "seis módulos clínicos" → "sete módulos clínicos"
- Hero parágrafo: "Bibliografia primária dos seis módulos" → "dos sete módulos clínicos"
- Nav item: `#refs-modulo-8` "8. Módulo 8 - Distúrbios..." → `#refs-modulo-7` "7. Módulo 7 - Distúrbios..."
- Section `id="refs-modulo-8"` → `id="refs-modulo-7"` com h2 atualizado

**4. `scripts/verify-module-hashes.mjs`** — entradas trocadas + hashes recomputados:
- Mod 7: `e2799041d4316ded672f25c73995b253092d65e977d9b08f2bc6eec371f1528c`
- Mod 8: `a3212900a6088ca84edc241564d88326e793018240c8ed77d82e936058d53e0c`

### Regra estabelecida para futuros módulos

Toda vez que um novo módulo clínico for adicionado:

1. O novo módulo recebe o próximo número disponível antes do de Referências (ex.: se hoje há Mod 1–7 clínicos + Mod 8 refs, o próximo seria Mod 8 clínico, renumerando Refs para Mod 9).
2. O arquivo de Referências é renomeado (`modulo_NN_referencias.html`).
3. O conteúdo do Mod Referências é atualizado:
   - `<title>`, brand h1, parágrafos contam o novo total de módulos clínicos
   - Nova seção de refs do novo módulo é inserida na ordem correta (`#refs-modulo-N`)
4. `moduleSources.ts`, `verify-module-hashes.mjs` atualizados.
5. URLs com `modulo-07` continuam apontando para "o módulo de número 7", seja qual for. Bookmarks antigos podem mudar de conteúdo — é uma quebra documentada.

### Validação runtime

```
/modulo-07 → "Módulo 7 — Distúrbios hidroeletrolíticos" ✓
/modulo-08 → "Módulo 8: Referências"
  Brand h1: "Módulo 8" ✓
  Seções de refs: 7 (Mod 1, 2, 3, 4, 5, 6, 7-Distúrbios) ✓
```

### Arquivos modificados

- `src/data/modules/modulo_07_disturbios_hidroeletroliticos.html` (renomeado)
- `src/data/modules/modulo_08_referencias.html` (renomeado + conteúdo)
- `src/data/moduleSources.ts`
- `scripts/verify-module-hashes.mjs`

## 2026-05-22 — Novo Módulo 8: Distúrbios hidroeletrolíticos (REQUER REVISAO MEDICA)

### Tipo de alteração

- **Conteúdo clínico novo — adição de módulo completo** sobre distúrbios
  de sódio, potássio, fósforo, magnésio e cálcio em UTI/emergência

### Estrutura do Mod 8 (`src/data/modules/modulo_08_disturbios_hidroeletroliticos.html`)

Layout idêntico aos demais módulos (aside com nav + main com hero + sections), com 7 seções:

1. **Princípios gerais** — 3 perguntas-chave (aguda × crônica, sintoma, causa) + pré-requisitos
2. **Distúrbios do sódio** — hipoNa/hiperNa
3. **Distúrbios do potássio** — hipoK/hiperK
4. **Distúrbios do fósforo** — hipoP/hiperP
5. **Reposição de magnésio** — hipomagnesemia
6. **Reposição de cálcio** — hipoCa/hiperCa
7. **Calculadora operacional** — placeholder com lista de medicações que serão integradas ao Mod 6 em rodada futura

### Cada seção tem (padronizado)

- **Valores de referência e classificação** (leve/moderado/grave + cronicidade quando aplicável)
- **Etiologias** em grid 2×2: clínicas vs medicamentosas
- **Quando o tratamento está indicado** (regras objetivas com gatilhos)
- **Consequências do distúrbio** (neuro, cardio, sistêmico)
- **Regras de reposição em tabela**: cenário | dose | diluição/velocidade | via (periférica/central)
- **Alerts** específicos para riscos (SDM em hiponatremia, vesicância de CaCl₂, hipoMg precede reposição de K/Ca, etc.)
- **Citação de fontes primárias** ao final de cada seção

### Conteúdo destacado

**Sódio:**
- SF 3% bólus 100–150 mL em 10 min para sintomático grave; alvo Δ Na 4–6 mEq/L
- Crônica: ≤ 8 mEq/L em 24 h, ≤ 18 em 48 h (≤ 6 em alto risco — alcoolismo/desnutrição/hipoK/hepatopatia)
- Cálculo prático: 1 mL/kg de SF 3% ≈ ↑ Na 1 mEq/L
- Hipernatremia crônica: queda ≤ 10 mEq/L em 24 h

**Potássio:**
- Hipocalemia: oral até 40 mEq 2–3×/dia; IV periférica ≤ 10 mEq/h e ≤ 40 mEq/L; central até 20–40 mEq/h com ECG
- Apresentação BR: KCl 19,1% — ampola 10 mL = 25,6 mEq
- Hipercalemia: protocolo escalonado de 6 passos (gluconato Ca → insulina+SG → β2 → furosemida → resina → diálise)
- "Sempre antes": dosar e corrigir Mg

**Fósforo:**
- IV se P < 1,0 mg/dL ou sintomas (insuf respiratória, hemólise, IC)
- Fórmula individualizada (Bech 2013): 0,5 × peso × (1,25 − P mmol/L) mmol; máx 7 mmol/h
- Fosfato de potássio: 3 mmol P + 4,4 mmol K/mL

**Magnésio:**
- TdP / sintomático grave: MgSO₄ 2 g em 5–20 min
- Eclâmpsia: 4–6 g em 15–20 min + manut 1–2 g/h
- Apresentação BR: MgSO₄ 50% (500 mg/mL) e 10% (100 mg/mL)
- Mg sérico reflete só 1% do estoque corporal — reposição empírica em hipoK/hipoCa refratárias

**Cálcio:**
- Hipocalcemia sintomática: gluconato 10% 10–20 mL em 10 min (periférica) ou cloreto 10% 5–10 mL (CENTRAL apenas — vesicante)
- Equivalência: 10 mL gluconato = 90 mg Ca elementar; 10 mL CaCl₂ = 272 mg
- Hipercalcemia: SF 0,9% 200–300 mL/h + calcitonina 4 UI/kg SC + zoledronato 4 mg ou pamidronato 60–90 mg

### Wiring no app

- `src/types.ts`: `ModuleId` inclui `"modulo-08"`
- `src/utils/route.ts`: `MODULE_IDS` inclui `"modulo-08"`
- `src/data/moduleSources.ts`: importa e registra modulo08 com `id: "modulo-08", number: 8, title: "Distúrbios hidroeletrolíticos"`
- `scripts/verify-module-hashes.mjs`: novo hash `9d50c53590d36b59fa3a5204462f93136b84cc0d390c00ed419b38f93f51cdec`

### Mod 7 — nova seção de referências (#refs-modulo-8)

19 referências citadas:
- Refardt 2024 NDT (hyponatraemia standard)
- Verbalis 2017 JASN, Sterns 2015 NEJM, Adrogué 2000 NEJM
- Lindner 2020 EJEM (KDIGO conference), UK Renal 2022, Weisberg 2008 CCM, Allon 1996 AJKD (hipercalemia)
- Geerse 2010 CritCare, Bech 2013 JCC, Charron 2003 CCM (fósforo)
- Hansen 2018 JIC, Tong 2005 JICM (magnésio)
- Cooper 2008 BMJ, Bilezikian 2003 Mayo, Wagner 2022 Transfusion (cálcio)
- EMCrit IBCC, U. Michigan Trauma ICU Protocol, Saudi MOH Adult Electrolyte Protocol (recursos operacionais)

### **REQUER REVISAO MEDICA**

Como módulo clínico novo, todo o conteúdo precisa de validação institucional antes do uso em produção:

- Valores de referência (variam por laboratório)
- Pontos de corte para tratamento (variam por protocolo)
- Doses, velocidades e concentrações em cada tabela
- Sequência do protocolo escalonado de hipercalemia
- Indicações de via central vs periférica para cada solução
- Regras do delta máximo de correção em 24 h e 48 h
- Cálculos individualizados (Bech para fósforo, fórmula de Adrogué)
- Mensagens dos alerts de segurança

### Pendente (próxima rodada)

- **Calculadora operacional no Mod 6** com nova categoria *Distúrbio eletrolítico* — preparo das soluções, cálculo de volume a aspirar, vazão de infusão por via (periférica/central), com seleção do distúrbio que filtra as medicações apropriadas

### Arquivos modificados/novos

- `src/data/modules/modulo_08_disturbios_hidroeletroliticos.html` (NOVO)
- `src/data/modules/modulo_07_referencias.html` (nova seção #refs-modulo-8 com 19 refs)
- `src/data/moduleSources.ts` (importa modulo08)
- `src/types.ts` (`ModuleId` extendido)
- `src/utils/route.ts` (`MODULE_IDS` extendido)
- `scripts/verify-module-hashes.mjs`:
  - Mod 7: `d44303010150359880d65fa6ef6efd1a93722bef59e4082e30bedd62be5666c7`
  - Mod 8: `9d50c53590d36b59fa3a5204462f93136b84cc0d390c00ed419b38f93f51cdec`

## 2026-05-22 — Calc Mod 6: presets visíveis sem `<details>`, preparo manual abaixo (colapsável)

### Tipo de alteração

- Interface — **expor a sugestão de solução como campo principal
  (visível, não colapsado)**, mantendo o preparo manual abaixo como
  `<details>` colapsável

### Problema

Após a rodada anterior, a "Sugestão de solução (preset)" estava dentro
de um `<details>` colapsável em Bólus e IOT. Mesmo aberto por padrão,
isso obscurecia a informação principal de "com o que estou trabalhando"
e exigia um clique para o prescritor abrir e ver a solução padrão. Na
Infusão Contínua, o preset estava aninhado junto com o preparo manual
em um único `<details>`, o que misturava informação fixa (preset) com
edição (manual).

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**Bólus / dose intermitente:**
- `<details>Sugestão de solução (preset)</details>` removido.
- `dvaBolusPresentation` agora aparece em um `<div class="calc-grid">`
  visível direto, label "Solução final sugerida (preset)".
- `compact-note` curta logo abaixo explica que para customização use
  o painel de Preparo manual.

**IOT:**
- Idem: `<details>Sugestão de solução (preset)</details>` removido.
- `iotPresentation` exposto em `<div class="calc-grid">` visível direto,
  label "Solução final sugerida (preset)".

**Infusão Contínua:**
- O `<details>Solução final</details>` consolidado (que continha preset
  + manual + diluente) foi dividido:
  - `infPrep` (Solução final sugerida — preset) volta a aparecer em
    `<div class="calc-grid">` visível direto, ao lado de "Planejar
    solução para 12h".
  - O painel `<details>Preparo manual da solução (sobrescreve o
    preset)</details>` agrupa os campos editáveis: massa + unidade +
    diluente + volume final + concentração calculada.
- Resultado: prescritor vê imediatamente a Solução final sugerida sem
  precisar clicar. Para customizar (preparo manual), abre o details.

### Estrutura final de cada calculadora

```
Bólus:
  [Categoria | Medicação | Apresentação comercial | Dose | Unidade]
  [Solução final sugerida (preset)]   ← visível direto
  [Intermittent panel (conditional)]
  <details>Preparo manual da solução (sobrescreve o preset)</details>

IOT:
  [Categoria | Medicação | Dose | Unidade | Apresentação comercial]
  [Solução final sugerida (preset)]   ← visível direto
  <details>Preparo manual da solução (sobrescreve o preset)</details>

Infusão Contínua:
  [Categoria | Medicação | Dose | Vazão]
  [Solução final sugerida (preset) | Planejar 12h]   ← visível direto
  <details open>Ampola/fr. disponível</details>
  <details>Preparo manual da solução (sobrescreve o preset)</details>
```

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `c4a7ef356d6f49e03341ef5c9f1f0e48647aee76b8d43626d18709e61b64fdec`)

## 2026-05-22 — Calc Mod 6: "Ampola sem diluente (puro)" — layout compacto quando preset é uso puro

### Tipo de alteração

- Interface — **simplificação da exibição quando o preset selecionado é
  a própria ampola sem diluição** (propofol, clevidipina, labetalol pronto
  para uso, etc.)

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**1. Novo helper `isPurePrep(prep)`** — verifica se o objeto preset
indica uso puro/pronta para uso, via regex em `prep.label + prep.prep`:

```js
/não diluir|nao diluir|sem diluição|sem diluicao|uso usual puro|
 pronta para uso|pronto para uso|emulsão lipídica pronta|\bpuro\b/i
```

Retorna `true` para entries como:
- Propofol: "10 mg/mL puro" → ✓
- Clevidipina: "emulsão lipídica pronta para uso" → ✓
- Metoprolol/Labetalol: "solução pronta para uso" → ✓

Retorna `false` para presets com diluição (ex.: Fentanil "500 mcg em
50 mL").

**2. `calcInfusion` — card "Solução preparada" com 2 layouts:**

**Layout puro (isPurePrep === true):**
```
Apresentação: ...
Solução final: **Ampola sem diluente (puro)** — concentração X mg/mL
```
(Linhas de Diluente/uso, Volume total, Massa total suprimidas — eram
redundantes com o próprio uso da ampola.)

**Layout padrão (preset com diluição):**
```
Apresentação: ...
Diluente/uso: ...
Volume total da solução: ...
Massa total na solução: ...
Concentração final: ...
```

**3. `calcDVABolus` — card "Solução preparada" com 2 layouts:**

**Layout puro:**
```
Apresentação: ...
Solução final: **Ampola sem diluente (puro)** — concentração X mg/mL
Volume a administrar: X mL (Y ampolas)
Massa total: X mg
```

**Layout padrão (com diluição):**
Inclui Diluente/uso + Preparo da solução + Volume + Massa + Concentração.

**4. IOT calc não recebeu o branching nesta rodada** — os presets de IOT
são todos `{label, conc, unit}` sem campo `prep` com texto descritivo,
então `isPurePrep` retorna sempre `false` para IOT. Quase todas as
drogas IOT são pure-push por natureza (sem texto explícito), o que pode
ser endereçado em rodada futura adicionando flag `isPureBolus: true` às
entries IOT se necessário.

### Validação runtime

```
isPurePrep:
  Propofol "10 mg/mL puro"                → true  ✓
  Clevidipina "emulsão pronta para uso"   → true  ✓
  Fentanil "500 mcg em 50 mL"             → false ✓

Render Propofol em infusão contínua:
  "Solução final: Ampola sem diluente (puro) — concentração 10 mg/mL" ✓
  Linhas de diluente/volume/massa total suprimidas ✓

Render Fentanil em infusão contínua:
  Layout padrão mantido ✓
```

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `f15c0a5c3e4f106227df3dbe65ea7dee585228bf89044076eda551b65af4c685`)

## 2026-05-22 — Calc Mod 6: boxes reorganizados, redundâncias removidas, salbutamol IV com apresentação BR

### Tipo de alteração

- Interface — **consolidação de boxes da calculadora, eliminação de
  redundâncias visuais e correção de label técnico**

### Alterações no Mod 6 (`src/data/modules/modulo_06_calculadoras_interativas.html`)

**1. Calculadora de Bólus / dose intermitente:**

- Removida a `<div class="compact-note">` com texto genérico sobre
  anti-hipertensivos em bólus (era warning generalista que duplica
  alertas drug-specific já presentes no `notes` de cada entrada).
- O `<select id="dvaBolusPresentation">` (antes label "Concentração
  usada no cálculo" — terminologia técnica confusa para leitor
  clínico) foi **colapsado em um `<details>Sugestão de solução
  (preset)</details>`** com label interno "Solução pré-definida"
  + compact-note explicando que para reconstituição/diluição
  customizada deve-se usar o painel de Preparo manual.
- Padrão agora idêntico ao da calculadora IOT.

**2. Calculadora de Infusão Contínua — boxes consolidados:**

Estrutura anterior:
```
[Categoria | Medicação | Solução final sugerida | Dose desejada]
[Vazão | Planejar | Frasco/bolsa | Diluente]
<details>Ampola/fr. disponível</details>
<details>Solução final montada (editável)</details>
```

Estrutura nova:
```
[Categoria | Medicação | Dose desejada | Vazão]
[Planejar 12h]
<details>Ampola/fr. disponível</details>
<details>Solução final
  [Solução final sugerida (preset)]
  [Massa | Unidade | Diluente | Volume final]
  [Concentração final calculada]
</details>
<input id="infBagVolume" type="hidden">   <!-- compat planning24h -->
```

Justificativa: o usuário identificou que "Solução final sugerida" e
"Solução final montada" estavam em locais distintos e o diluente em
um terceiro lugar, causando confusão. Agora tudo que fundamenta a
solução final está em um único box: preset + edição + diluente +
volume final + concentração calculada.

`infBagVolume` (antes select 100/250/500/1000 mL) virou hidden e é
sincronizado automaticamente com `infFinalVolume` pela função
`updateFinalSolutionPreview()` — preserva o cálculo `planning24h`
sem duplicar inputs visuais.

**3. Resultado da Infusão Contínua — apresentação única:**

Antes: duas linhas no card "Solução preparada" — "Apresentação do
fármaco" (genérica) + "Apresentação disponível informada" (manual)
apareciam SIMULTANEAMENTE quando o usuário preenchia a ampola
manualmente.

Depois: a **manual prevalece**. Se `informedAmpouleLine()` retorna
valor, mostra apenas "Apresentação disponível informada"; caso
contrário, mostra apenas "Apresentação do fármaco".

**4. Salbutamol IV — ampoule auto-preenchida:**

`ampouleInfoByName` atualizada para salbutamol:
- Antes: `{content:5000, volume:null}` (label genérico, sem volume → no
  auto-fill do painel de ampola)
- Depois: `{content:500, volume:1, label:"ampola 500 mcg/1 mL (0,5
  mg/mL); conferir disponibilidade local — algumas instituições usam
  5 mg/5 mL"}`

Resultado: ao selecionar Salbutamol IV em Infusão Contínua, o painel
"Ampola/fr. disponível" auto-preenche 500 mcg em 1 mL.

### Validação runtime

```
Fentanil → preset auto-fill: 500 mcg em 50 mL → 10 mcg/mL ✓
  Diluente preferred: SF 0,9% ✓
  infBagVolume hidden sincronizado: 50 ✓

Salbutamol IV → ampoule auto-fill: 500 mcg em 1 mL ✓
  Solução final auto-fill: 5 mg em 50 mL ✓
```

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `9a788c1ffca9ae220a7adc78b57c2c8e5c52cbddfd27660ea1f765529c3e3de4`)

## 2026-05-22 — Auditoria pós-refator: categoria "Broncodilatadores" → "Broncoespasmo refratário"; notas de cetamina clarificadas

### Tipo de alteração

- Interface + nomenclatura — **alinhamento de títulos com conteúdo**
  após auditoria de integração entre módulos

### Achados da auditoria (delegada a agente Explore)

| Aspecto | Status | Decisão |
|---|---|---|
| Mod 4 §6.5 anticonvulsivantes (7 drogas) | ✓ Completo | Nenhuma ação |
| Mod 5 narrativa de broncoespasmo | Lacuna (fora de escopo) | Nenhuma ação — Mod 5 é DVA, broncoespasmo cabe no Mod 6 + Mod 4 |
| Magnésio: 2 entries em dvaBolusDrugs (broncoesp/eclâmpsia) | Justificado | Nenhuma ação |
| Adrenalina: 4 entries (push/DVA/broncoesp/anafilaxia) | Justificado | Nenhuma ação |
| Cetamina: 4 entries (IOT/analgésico/sedativo/status/broncoesp) | Categorização justificada por findability | **Notas clarificadas** |
| Seção 3 Mod 6 (Bólus/intermitente) | ✓ Coerente | Nenhuma ação |
| Categoria "Broncodilatadores" do Mod 6 | ✗ Inadequado (aminofilina e cetamina não são broncodilatadores) | **Renomeado** |
| Referências Mod 7 | ✓ Sem órfãs ou duplicações críticas | Nenhuma ação |

### Alterações aplicadas

**1. `infusionData.broncoespasmo.label`:**
- Antes: `"Broncodilatadores"`
- Depois: `"Broncoespasmo refratário — terapia IV"`
- Motivo: aminofilina (metilxantina) e cetamina (antagonista NMDA) não são
  broncodilatadores estricto sensu. A categoria agrupa a armamentaria IV
  para broncoespasmo crítico refratário — o título agora reflete o uso
  clínico real.

**2. `INFUSION_GROUPS` grupo `broncoespasmo`:**
- Antes: `label:"Broncodilatadores"`
- Depois: `label:"Broncoespasmo refratário"`
- Consistência no painel agrupado do cenário-resumo.

**3. `cetamina_analgesia` (categoria Analgésico) — notas reescritas:**
- Indicação primária explicitada: **ANALGESIA POUPADORA DE OPIOIDE**.
- Cross-reference para as outras entradas de cetamina (sedativo,
  anticonvulsivante, broncoespasmo).
- Orientação: "Escolher a entrada conforme o OBJETIVO TERAPÊUTICO PRIMÁRIO".

**4. `cetamina` (categoria Sedativo) — notas reescritas:**
- Nome ampliado: "Cetamina — sedação dissociativa".
- Indicação primária explicitada: **SEDAÇÃO DISSOCIATIVA**, especialmente
  quando hipotensão limita outros sedativos (cetamina preserva PA).
- Cross-reference para Analgésico (mesma dose), Anticonvulsivante (faixa
  mais alta) e Broncoespasmo (faixa mais alta).

### Justificativa para manter cetamina em múltiplas categorias

Doses são idênticas em sub-anestésico (0,05–0,3 mg/kg/h) — analgesia,
poupador de opioide e sedação são INDICAÇÕES, não doses distintas. A
categorização dual em Analgésico e Sedativo facilita findability: o
clínico que busca "qual droga para sedação dissociativa" encontra na
categoria Sedativo; quem busca "qual adjuvante poupador de opioide"
encontra em Analgésico. As notas agora deixam claro que é a MESMA droga
com mesma dose, escolhendo a entrada pelo objetivo terapêutico.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `c368da8cf02aa4a51734ea6ce7cbb43aa23b150660130192e8fbb59f46b182e5`)

## 2026-05-22 — Broncoespasmo refratário: adrenalina IV + aminofilina + cetamina + protocolo (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **expansão da categoria Broncodilatadores no Mod 6
  com 3 novas drogas + atualização do protocolo do salbutamol IV**

### Drogas adicionadas em `infusionData.broncoespasmo.drugs`

1. **Adrenalina IV — broncoespasmo refratário**
   - administrationType: continuous_infusion
   - doseUnit: mcg/kg/min, defaultDose 0,05
   - Faixa: 0,05–2 mcg/kg/min titulada por resposta + hemodinâmica
   - Bólus alternativo (via calculadora intermitente): 50–100 mcg/min, 0,01 mg/kg, máx 0,1 mg/bólus, máx total 1 mg
   - Preps: 1 mg em 100 mL = 10 mcg/mL (adulto); 1 mg em 1000 mL = 1 mcg/mL (neonato/criança)
   - Indicação: refratariedade a salbutamol, taquifilaxia a β2 seletivos, broncoespasmo associado a anafilaxia
   - phaseInfo + notes com sequência prática (ACR 2025, WMS 2022)
   - Cautela: ECG contínuo, PA invasiva, FC, SpO2, lactato

2. **Aminofilina IV — adjuvante em broncoespasmo ventilado**
   - administrationType: continuous_infusion
   - doseUnit: mg/kg/h, defaultDose 0,5
   - Carga: 5–6 mg/kg em 20–30 min (omitir se uso prévio de teofilina)
   - Manutenção: 0,5–0,7 mg/kg/h adulto; 0,2–0,4 mg/kg/h idoso/hepatopata/IC
   - Janela terapêutica estreita: 10–20 mcg/mL
   - Preps: 500 mg em 500 mL = 1 mg/mL
   - Indicação: evidência limitada; considerar em ventilado quando outras opções falharam (Craig 2020, Abdelgadir 2025)
   - phaseInfo + notes com alertas (interações cimetidina/fluoroquinolona/macrolídeo, toxicidade arrítmica/convulsão)
   - Lookup de diluente: SF 0,9% preferred + SG aceitável
   - `ampouleInfoByName` registrado: ampola 24 mg/mL × 10 mL = 240 mg

3. **Cetamina IV — adjuvante em broncoespasmo grave**
   - administrationType: continuous_infusion
   - doseUnit: mg/kg/h, defaultDose 1
   - Faixa: 0,5–2 mg/kg/h em infusão adjuvante; bólus prévio 0,5–1 mg/kg
   - Preps: 500 mg em 50 mL = 10 mg/mL
   - Indicação: broncoespasmo crítico refratário, especialmente com indicação de IOT (Medar 2020)
   - Notes: monitorar PA, FC, secreções, fenômenos emergentes, PIC

### Salbutamol IV atualizado

- Nome: "Salbutamol IV — broncoespasmo crítico"
- Faixa expandida: 5–20 mcg/min (titulação a partir de 5 → 20; máximo 25 mcg/min)
- Novo `phaseInfo`: protocolo escalonado GINA 2024–2025
  1. Terapia inicial intensiva (SABA + corticoide + ipratrópio + O2)
  2. Magnésio IV 2 g em 20–30 min (categoria Bólus)
  3. Salbutamol IV E/OU adrenalina IV em refratários com monitorização cardíaca
- Notes ampliado: alerta de sinergia cardiovascular com adrenalina IV

### Referências adicionadas ao Mod 7 (seção 6 - Calculadoras)

1. **GINA 2024–2025 Global Strategy for Asthma** (Reddel, Bacharier, Bateman)
2. **Abdelgadir 2025** Arch Dis Child — metanálise pediátrica segunda linha
3. **Abu-Sultaneh 2025** Pediatric Pulmonology — network meta-analysis
4. **Craig 2020** Cochrane — overview de escalada em crianças
5. **Baggott 2022** Thorax — adrenalina vs SABA, metanálise
6. **Gaudio 2022** WMS — protocolo adrenalina IV
7. **Adrenalin FDA prescribing info** (02 jun 2022)
8. **Albuterol Sulfate FDA prescribing info** (21 mar 2025)
9. **ACR Manual on Contrast Media 2025** — protocolo β2 + adrenalina IV

### **REQUER REVISAO MEDICA**

Validar antes de uso em produção:
- Dose default da adrenalina IV (0,05 mcg/kg/min) — alguns serviços preferem iniciar mais conservador
- Dose default da aminofilina (0,5 mg/kg/h) e tabela de manutenção por idade/comorbidade
- Cetamina 0,5–2 mg/kg/h adjuvante — confirmar protocolo institucional
- Faixa máxima do salbutamol IV (25 mcg/min) — varia por serviço
- Sequência escalonada do protocolo refratário (corresponde ao GINA 2024–2025)
- Monitorização obrigatória durante uso combinado β2 IV + adrenalina IV

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (novas drogas, lookup diluente, `ampouleInfoByName`, `brazilAmpouleOptions`)
- `src/data/modules/modulo_07_referencias.html` (9 novas referências)
- `scripts/verify-module-hashes.mjs`:
  - Mod 6: `950d9addd8563b8f3197a72d438049c54e6613d4cdbadf6eba785b488b98383a`
  - Mod 7: `9ce3ba35cc56e2bcd1ab00752c1de3ed2045827151b4d4efe6f5923db8e3eda9`

## 2026-05-22 — Furosemida: dose por função renal + fases de ataque/escalada + monitorização ampliada (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **estruturação avançada da entrada da furosemida**
  em campos `range` / `phaseInfo` / `maxInfusionTime` / `notes`, conforme
  protocolo de dosagem por função renal e estratégia de escalada

### Mudanças no Mod 6 — entrada `furosemida`

**`range`** atualizado com tiers por função renal:
- Função renal normal: 5–10 mg/h
- Insuficiência renal moderada: 10–20 mg/h
- Insuficiência renal grave: 20–40 mg/h
- Taxa máxima FDA: 4 mg/min (240 mg/h)
- Dose diária usual ≤ 400–500 mg, máximo 600 mg/dia

**`phaseInfo`** (NOVO) — protocolo de ataque + escalada:
- Dose de ataque OBRIGATÓRIA antes da infusão (sem ataque: 6–20 h
  para atingir equilíbrio)
- Pré-uso oral: ataque IV = 1–2,5× dose oral domiciliar
- Virgem de terapia: limite inferior do intervalo
- Reavaliação após 1 h: se inadequado, repetir bólus e aumentar
  taxa em 50–100%
- Reajuste a cada 4–6 h conforme balanço hídrico, função renal,
  hemodinâmica e eletrólitos

**`maxInfusionTime`** (NOVO):
- Dose diária usual ≤ 400–500 mg; máx 600 mg/dia em protocolos
  específicos
- Reavaliar transição para via oral em 24–48 h

**`notes`** ampliado com monitorização e populações especiais:
- Monitorização frequente: K, Na, Mg, Ca, CO₂/bicarbonato (alcalose),
  ureia, creatinina, glicemia, ácido úrico
- Avaliação com **sódio urinário** no início da terapia
- Aumento de Cr > 0,3 mg/dL em 72 h: comum em dose alta, mas análise
  post hoc do DOSE mostrou que elevação inicial se associa a melhores
  desfechos a longo prazo
- Riscos: ototoxicidade (minimizada pela taxa máx 4 mg/min), retenção
  urinária aguda (HPB), encefalopatia em cirrose por mudanças bruscas
  de volume
- Cautela em idosos (iniciar dose inferior; risco renal)

### Mod 7 — atualização da bula FDA Furosemide

- Data atualizada de **10 mar 2025** → **13 mai 2026** (com nota da
  revisão intermediária em 03 nov 2025).
- Texto da referência ampliado para incluir os pontos de monitorização
  e cautelas em populações especiais.

### Referências citadas (já existentes no Mod 7)

Todos os 6 itens referenciados pelo usuário já estavam no Mod 7
(Brater 1998, Hollenberg 2024, Hollenberg 2019, Felker 2020) e o item
3/5 (FDA Furosemide) foi atualizado para a versão mais recente.

### **REQUER REVISAO MEDICA**

Pontos para validação institucional:
- Tiers de dose por função renal (5–10 / 10–20 / 20–40 mg/h).
- Estratégia "ataque IV = 1–2,5× dose oral domiciliar".
- Reavaliação após 1 h com escalada 50–100%.
- Dose máxima 600 mg/dia em protocolos específicos.
- Avaliação de resposta com sódio urinário precoce.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `src/data/modules/modulo_07_referencias.html`
- `scripts/verify-module-hashes.mjs`:
  - Mod 6: `0aeb043a03ff6b3d8dce8fb54ba09153e3431cab771762e20375bdeeaabcf53e`
  - Mod 7: `0f6e19607359a0fa3c5c0ee893e4683c725e31929962503c9fac27c7c2912070`

## 2026-05-22 — Furosemida: indicações da infusão contínua expandidas + 10 referências bibliográficas (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **revisão substancial das notas da furosemida na
  calculadora + adição de bibliografia primária ao Módulo 7**

### Mudanças no Mod 6 — entrada `furosemida` em `infusionData.diuretico`

`range` atualizado:
- Antes: `"5–20 mg/h; doses maiores apenas com protocolo e monitorização"`
- Depois: `"5–20 mg/h; doses maiores apenas com protocolo e monitorização. Taxa máxima conforme bula FDA: 4 mg/min"`

`notes` expandido para cobrir as indicações específicas da infusão
contínua em insuficiência cardíaca aguda descompensada:

> Indicações específicas para infusão contínua em insuficiência cardíaca
> aguda descompensada: (a) resistência diurética com resposta inadequada
> a bólus intermitentes; (b) doses crônicas > 240 mg/dia de furosemida
> equivalente (excluídos do DOSE trial); (c) resposta diurética vigorosa
> mas transitória; (d) insuficiência renal com resposta inadequada a
> intermitentes; (e) síndrome cardiorrenal; (f) disfunção ventricular
> direita grave. O estudo DOSE não demonstrou superioridade em desfechos
> primários, mas metanálises mostram maior débito urinário em 24h, maior
> redução de peso/BNP e menor necessidade de escalada terapêutica.
> Administrar dose de ataque antes da infusão (estado de equilíbrio sem
> ataque: 6–20 h). Monitorar diurese, PA, K, Mg, Na, creatinina, alcalose
> metabólica e ototoxicidade.

### 10 referências adicionadas ao Mod 7, seção 6 (Calculadoras)

A DOSE trial (Felker 2011) já estava no Mod 7. Adicionadas:

1. **Hollenberg SM, et al.** 2024 ACC Expert Consensus on Heart Failure
   Focused Update. *JACC*. 2024;84(13):1241-1267.
2. **Felker GM, et al.** Diuretic Therapy for Patients With Heart Failure:
   JACC State-of-the-Art Review. *JACC*. 2020;75(10):1178-1195.
3. **Ellison DH, Felker GM.** Diuretic Treatment in Heart Failure.
   *NEJM*. 2017;377(20):1964-1975.
4. **Heidenreich PA, et al.** 2022 AHA/ACC/HFSA Guideline for the
   Management of Heart Failure. *JACC*. 2022;79(17):e263-e421.
5. **Jentzer JC, et al.** Contemporary Management of Severe Acute Kidney
   Injury and Refractory Cardiorenal Syndrome. *JACC*. 2020;76(9):1084-1101.
6. **Hollenberg SM, et al.** 2019 ACC Expert Consensus on HF.
   *JACC*. 2019;74(15):1966-2011.
7. **Brater DC.** Diuretic Therapy. *NEJM*. 1998;339(6):387-395.
8. **Rasoul D, et al.** Continuous Infusion Versus Bolus Injection of Loop
   Diuretics for Acute Heart Failure. *Cochrane Database*. 2024;5:CD014811.
9. **Ng KT, Yap JLL.** Continuous Infusion vs. Intermittent Bolus
   Injection of Furosemide in Acute Decompensated Heart Failure:
   Systematic Review and Meta-Analysis. *Anaesthesia*. 2018;73(2):238-247.
10. **Furosemide — FDA prescribing information**. U.S. Food and Drug
    Administration. Atualizado em 10 mar 2025.

### **REQUER REVISAO MEDICA**

- Confirmar as 6 indicações específicas para infusão contínua (a-f).
- Confirmar a citação dos achados das metanálises (maior débito
  urinário em 24h, redução de peso/BNP).
- Confirmar a taxa máxima de 4 mg/min conforme bula FDA.
- Confirmar a recomendação de dose de ataque antes da infusão.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `src/data/modules/modulo_07_referencias.html`
- `scripts/verify-module-hashes.mjs`:
  - Mod 6: `d96efd1966260e1b77d13e89158237f76ea2d098a56819562f797732a2e2d852`
  - Mod 7: `4ffca79062f9b86542b5bfab4393022a5ecdff95888bc77a9502799133e1a9a5`

## 2026-05-22 — Nitroprussiato: restrição reativada a SG 5% (FDA categórica) + 2 referências FDA

### Tipo de alteração

- Conteúdo clínico — **correção de regressão**: nitroprussiato volta a
  ser restrito a SG 5% (dextrose 5%) conforme bula FDA, anulando a
  flexibilização introduzida na rodada anterior.

### Motivo

A bula FDA do nitroprussiato (atualizada 2021-07-22) é categórica:
- Diluente OBRIGATÓRIO: dextrose 5% em água
- Concentração: 50 mg em 250–1000 mL
- Proteção da luz: manga opaca/papel alumínio (não cobrir equipo/câmara)
- Estabilidade da solução recém-diluída: 24 h protegida da luz
- Nenhuma outra droga deve compartilhar a mesma solução

Nitroglicerina, por outro lado, **aceita ambos** SF 0,9% e SG 5% pela
bula FDA (concentração máxima 400 mcg/mL, sem mistura com outras
drogas; risco de adsorção em PVC e pseudoaglutinação se mesmo equipo
de sangue).

### Mudanças aplicadas em `DILUENT_INFO_BY_NAME`

| Droga | Antes | Depois | Status select |
|---|---|---|---|
| **Nitroprussiato** | `[SF 0,9%, SG 5%]` (preferred SF) | `[SG 5%]` (restrito) | **bloqueado** |
| Nitroglicerina | `[SF 0,9%, SG 5%]` (preferred SF) | `[SF 0,9%, SG 5%]` (preferred SF) | sem mudança |

Entrada duplicada de nitroprussiato no bloco "Vasoativas preferred SF"
removida — agora aparece apenas no bloco de restritas.

### Referências FDA adicionadas ao Mod 7, seção 5

`src/data/modules/modulo_07_referencias.html`:

1. **Sodium Nitroprusside — FDA prescribing information** (2021-07-22).
   Diluente obrigatório SG 5%; proteção da luz; estabilidade 24 h;
   não compartilhar solução.

2. **Nitroglycerin — FDA prescribing information** (2021-07-22).
   Diluentes aprovados SG 5% OU SF 0,9%; concentração máxima
   400 mcg/mL; risco de adsorção em PVC; risco de pseudoaglutinação
   se equipo compartilhado com hemoderivado.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `src/data/modules/modulo_07_referencias.html`
- `scripts/verify-module-hashes.mjs`:
  - Mod 6: `9bb6095ebd2f4558f9b8bd422db311ceb46c28b225342b59481279f03a30db0a`
  - Mod 7: `9c696c9a2b1ab6cb78d6e152b417d3467c63ccc5581c78a85473a0b3366bed10`

## 2026-05-22 — Mod 7: nova referência — Stability Study of Common Vasoactive Drugs

### Tipo de alteração

- Conteúdo bibliográfico — **adição de referência primária que embasa a
  tabela de compatibilidades de diluente do Módulo 6**

### Alteração

`src/data/modules/modulo_07_referencias.html`, seção 5 (Drogas vasoativas):
adicionada como última referência da lista:

> Yang H, Xiang B, Gong D, Zhao G, Zhang W. **Stability Study of Common
> Vasoactive Drugs Diluted in Five Types of Solutions**. *Frontiers in
> Pharmacology*. 2025.

Anotação contextual: "Estudo de estabilidade físico-química de
noradrenalina, adrenalina, dopamina, dobutamina, nitroglicerina e
nitroprussiato em cinco diluentes (SF 0,9%, SG 5%, Ringer lactato e
demais soluções comuns). Base para a tabela de compatibilidades de
diluente adotada na calculadora do Módulo 6."

### Arquivos modificados

- `src/data/modules/modulo_07_referencias.html`
- `scripts/verify-module-hashes.mjs` (Mod 7:
  `17a46055d5982e7ab7edd2bfa5a949935b8fb191eca42842155b83d4b55d7178`)

## 2026-05-22 — Mod 6: ajuste de diluentes conforme tabela de referência (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **revisão de compatibilidades de diluente em
  vasoativas baseada em tabela de referência fornecida pelo usuário**

### Tabela de referência fornecida

| Droga | Diluentes Preferenciais | Restrições/Observações |
|---|---|---|
| Dobutamina | Dextrose 5%, NaCl 0,9%, **Ringer lactato** | Contraindicado: bicarbonato 5%, alcalinas, bissulfito + etanol |
| Norepinefrina | Dextrose 5%, NaCl 0,9% | Preferir acesso central |
| Epinefrina | Dextrose 5%, NaCl 0,9% | Preferir acesso central em doses altas |
| Dopamina | Dextrose 5%, NaCl 0,9% | Preferir acesso central em doses altas (>3 mcg/kg/min) |
| Nitroglicerina | **NaCl 0,9% (preferencial)** | Degrada em dextrose c/ nitroprussiato; adsorção em PVC |
| Nitroprussiato | **NaCl 0,9% (preferencial)** | Compatível c/ NaCl; evitar mistura prolongada em dextrose c/ nitroglicerina |

### Mudanças aplicadas em `DILUENT_INFO_BY_NAME`

1. **Dobutamina** — adicionado **Ringer lactato** como diluente aceitável.
   - Antes: `["SF 0,9%", "SG 5%"]`
   - Depois: `["SF 0,9%", "SG 5%", "Ringer lactato"]` (preferred SF 0,9%)

2. **Nitroprussiato** — removida restrição a SG 5%.
   - Antes: `preferred:"SG 5%", allowed:["SG 5%"]` (select bloqueado)
   - Depois: `preferred:"SF 0,9%", allowed:["SF 0,9%", "SG 5%"]` (select livre)
   - Conforme tabela de referência: NaCl 0,9% é o preferencial; SG aceitável
     mas com restrição de mistura prolongada com nitroglicerina.

### Mantidas (já estavam corretas)

- **Noradrenalina/Norepinefrina, Adrenalina, Dopamina**: SF 0,9%
  (preferred) + SG 5% aceitável. ✓
- **Nitroglicerina**: SF 0,9% (preferred) + SG 5% aceitável. ✓
  Observação sobre adsorção em PVC e degradação com nitroprussiato
  permanece como nota clínica no campo `notes` da droga.

### **REQUER REVISAO MEDICA**

A tabela aplicada altera as restrições anteriores em duas drogas:

1. **Nitroprussiato deixa de ser restrito a SG 5%**. Validar com o
   protocolo do serviço se a permissão a SF 0,9% é aceitável.
2. **Dobutamina ganha Ringer lactato como opção**. Validar se há
   restrição local (compatibilidade com outros fluidos da linha).

### Observações clínicas adicionais (não codificadas como UI restrita)

Dessas observações da tabela, algumas já estão no campo `notes` de cada
droga; outras podem ser incorporadas em rodada futura:

- Dobutamina: contraindicação com bicarbonato 5%, soluções alcalinas e
  bissulfito + etanol.
- Norepinefrina, Epinefrina, Dopamina (>3 mcg/kg/min): preferência por
  acesso central.
- Nitroglicerina: adsorção em PVC; degradação em dextrose quando
  misturada com nitroprussiato.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `fbd4b4f09f47ee7f7529fc8842a92b4ed49dc67ab0149b0894504bef96cc9f4f`)

## 2026-05-22 — Mod 6: vasoativas com preferred SF 0,9% (padrão institucional confirmado)

### Tipo de alteração

- Conteúdo clínico — **inversão de preferred de diluente em vasoativas
  contínuas**, conforme confirmação do usuário

### Alterações realizadas

Em `DILUENT_INFO_BY_NAME` (`src/data/modules/modulo_06_calculadoras_interativas.html`):

| Droga | Antes (preferred) | Depois (preferred) | Alternativa |
|---|---|---|---|
| Noradrenalina | SG 5% | **SF 0,9%** | SG 5% |
| Norepinefrina | SG 5% | **SF 0,9%** | SG 5% |
| Adrenalina | SG 5% | **SF 0,9%** | SG 5% |
| Dobutamina | SG 5% | **SF 0,9%** | SG 5% |
| Dopamina | SG 5% | **SF 0,9%** | SG 5% |
| Nitroglicerina | SG 5% | **SF 0,9%** | SG 5% |
| Isoproterenol | SG 5% | **SF 0,9%** | SG 5% |
| Isoprenalina | SG 5% | **SF 0,9%** | SG 5% |

A literatura aceita ambos os diluentes para essas drogas — a escolha de
SF 0,9% como preferencial reflete o padrão institucional confirmado pelo
usuário (revisor clínico).

### O que **não** mudou

- **Amiodarona** segue restrita a SG 5% (precipita em SF) — confirmado.
- **Fenitoína** segue restrita a SF 0,9% (precipita em SG) — confirmado.
- **Nitroprussiato** segue restrito a SG 5% (bula + fotoproteção) — confirmado.
- **Tiopental** segue restrito a SF 0,9% — confirmado.
- **Succinilcolina** segue restrita a SF 0,9% — confirmado.
- **Clevidipina/Propofol** seguem "uso puro (não diluir)".

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (lookup)
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `9de1003c313ef776b14e68f630e0e518094e2abfb39e4bfcdfdf78eb8b747180`)

## 2026-05-22 — Mod 6: lookup central de diluentes para todas as drogas + bloqueio em restrições (REQUER REVISAO MEDICA)

### Tipo de alteração

- **Conteúdo clínico (segurança) + interface** — extensão dos
  metadados de diluente a todas as drogas com informação conhecida e
  bloqueio do select quando a diluição é restrita por compatibilidade

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**1. Lookup central `DILUENT_INFO_BY_NAME`**

Tabela `[substring(lowercase), preferredDiluent, allowedDiluents[]]` com
~50 entradas cobrindo:

**Restritas (allowedDiluents.length = 1, select bloqueado):**

| Droga | Diluente único | Motivo |
|---|---|---|
| Fenitoína | SF 0,9% | Precipita em SG 5% |
| Amiodarona | SG 5% | Precipita em SF 0,9% |
| Nitroprussiato | SG 5% | Padrão de bula + proteção da luz |
| Clevidipina | uso puro (não diluir) | Emulsão lipídica pronta |
| Propofol | uso puro (não diluir) | Apresentação pronta |
| Tiopental | SF 0,9% | Estabilidade após reconstituição |
| Succinilcolina/Suxametônio | SF 0,9% | Estabilidade |
| Atropina | SF 0,9% | Bólus simples |
| Furosemida | SF 0,9% | Estabilidade em SG reduz potência |

**Preferred SG 5% (vasoativas, estabilidade):**
- Noradrenalina, Adrenalina, Dobutamina, Dopamina, Nitroglicerina, Isoproterenol

**Preferred SF 0,9% (com SG aceitável):**
- Vasopressina, Fenilefrina, Milrinona, Hidralazina, Nicardipina, Esmolol, Labetalol, Procainamida, Octreotida
- Fenobarbital, Levetiracetam (+ Ringer lactato), Lidocaína
- Etomidato, Cetamina, Midazolam, Fentanil, Remifentanil, Sufentanil, Alfentanil, Morfina, Hidromorfona, Dexmedetomidina
- Rocurônio, Cisatracúrio, Atracúrio, Sugammadex, Neostigmina
- Sulfato de magnésio, Salbutamol

**2. Função `getDrugDiluentInfo(drug)` com 3-níveis de precedência:**

1. Campo direto na droga (`drug.preferredDiluent` + `drug.allowedDiluents`)
2. Lookup central por substring do nome (`lookupDiluentByName`)
3. Default genérico (SF 0,9% / SG 5% / conforme protocolo)

**3. `populateDiluentSelect` agora bloqueia o `<select>`** quando
`info.allowed.length <= 1`:
- `sel.disabled = true`
- Classe CSS `.diluent-restricted` aplicada (fundo âmbar suave, cursor not-allowed)
- Tooltip: "Diluição restrita por compatibilidade — não permitido alterar."

**4. Estilo CSS no `<head>` do HTML:**
```css
.diluent-restricted{background:#fff7ed !important;border-color:#fdba74 !important;color:#7c2d12 !important;cursor:not-allowed;font-weight:600}
```

### Validação runtime (10 drogas testadas)

```
RESTRITAS (disabled=true, 1 opção):
  Fenitoína       → [SF 0,9%]
  Amiodarona      → [SG 5%]
  Nitroprussiato  → [SG 5%]
  Clevidipina     → [uso puro (não diluir)]
  Propofol        → [uso puro (não diluir)]
  Atropina        → [SF 0,9%]

LIVRES (múltiplas opções com preferred):
  Noradrenalina   → [SG 5%, SF 0,9%] default SG 5%
  Dobutamina      → [SG 5%, SF 0,9%] default SG 5%
  Fentanil        → [SF 0,9%, SG 5%] default SF 0,9%
  Midazolam       → [SF 0,9%, SG 5%] default SF 0,9%
```

### **REQUER REVISAO MEDICA**

A tabela `DILUENT_INFO_BY_NAME` carrega informações clínicas sobre
compatibilidade de diluentes baseadas em bulas profissionais e padrões
institucionais comuns. Cada entrada precisa ser validada antes do uso
em produção:

- Confirmar a restrição estrita da Amiodarona ao SG 5% (incompatibilidade
  com SF 0,9% — precipitação).
- Confirmar Fenitoína exclusivamente em SF 0,9% (precipita em SG 5%).
- Confirmar Nitroprussiato em SG 5% (protocolo institucional).
- Confirmar Clevidipina/Propofol como "uso puro (não diluir)".
- Confirmar preferências de vasoativas (Noradrenalina/Dobutamina em SG 5%
  vs SF 0,9% — varia por serviço).
- Validar Tiopental restrito a SF 0,9% após reconstituição (algumas
  fontes aceitam SG).
- Validar Succinilcolina restrita a SF 0,9% (preferência forte por
  estabilidade).

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `4e4a9b0869a903d892aa2750c210b605f898e588e0d49112f118a70d1d9d0541`)

## 2026-05-22 — Mod 6: uniformização Bólus + IOT + Infusão Contínua (preparo manual + diluente por droga)

### Tipo de alteração

- Interface + arquitetura — **padrão unificado de preparo manual em
  todas as calculadoras com diluente preferencial por droga**

### Estrutura comum implementada nas 3 calculadoras

```
Categoria | Droga
Apresentação comercial (preset BR)
Preparo de solução:
  ├ Sugestão de solução (preset padronizado)
  └ Preparo manual: massa + unidade + diluente + volume → conc calculada (precedência sobre preset)
Dose desejada
[Vazão / Volume / Tempo conforme tipo de administração]
```

### Alterações realizadas

**1. Novos helpers globais** em `src/data/modules/modulo_06_calculadoras_interativas.html`:

- `DEFAULT_ALLOWED_DILUENTS = ["SF 0,9%", "SG 5%", "conforme protocolo"]`
- `getDrugDiluentInfo(drug)` → `{ preferred, allowed }` lendo
  `drug.preferredDiluent` e `drug.allowedDiluents`; fallback ao default.
- `populateDiluentSelect(selectId, drug)` repopula o `<select>` com as
  opções permitidas para a droga, selecionando a preferred.

**2. Metadados clínicos em drogas-chave** (`preferredDiluent` + `allowedDiluents`):

- **Fenitoína** (loading): `preferredDiluent:"SF 0,9%"`, `allowedDiluents:["SF 0,9%"]` — incompatível com SG 5% (precipita).
- **Fenobarbital** (loading): preferred SF 0,9%; allowed SF + SG.
- **Levetiracetam** (loading): preferred SF 0,9%; allowed SF + SG + Ringer lactato.
- **Magnésio (eclâmpsia)**: preferred SF 0,9%; allowed SF + SG.
- **Magnésio (broncoespasmo)**: preferred SF 0,9%; allowed SF + SG.
- **Amiodarona**: preferred SG 5%; allowed `["SG 5%"]` — precipita em SF 0,9%.

Demais drogas usam o fallback (SF/SG/protocolo).

**3. Calculadora de Bólus / Dose Intermitente** — painel "Ajustes
avançados de concentração" substituído por **"Preparo manual da solução"**:
- Campos: `dvaBolusManMass` + `dvaBolusManMassUnit` (mcg/mg/g/UI) +
  `dvaBolusManDiluent` (select populado pela droga) + `dvaBolusManVolume` (mL) +
  `dvaBolusManConcPreview` (readonly).
- `getBolusManualSolutionConc()` retorna `{conc, concUnit, filled}`.
- `currentDVABolus` agora consulta manual primeiro; se preenchido,
  sobrescreve `presentation.conc` e `presentation.unit` no cálculo do
  volume a aspirar.
- `updateDVABolusDefaults` repopula o diluente com `populateDiluentSelect`
  e limpa os campos manuais ao trocar de droga.
- Listeners de input incluem todos os campos manuais novos.
- Toggle `dvaBolusUseCustom` removido (precedência automática).

**4. Calculadora de IOT** — análogo:
- "Ajustes avançados de concentração" reorganizado em **duas
  `<details>`**: (a) "Sugestão de solução (preset)" (já existia, agora
  mais conciso) e (b) **"Preparo manual da solução"**.
- Campos: `iotManMass` + `iotManMassUnit` + `iotManDiluent` +
  `iotManVolume` + `iotManConcPreview`.
- `getIOTManualSolutionConc()` + `updateIOTManualConcPreview()` análogos
  ao bólus.
- `currentIOT` ramificado: manual filled → precedência sobre preset.
- `updateIOTDrugDefaults` chama `populateDiluentSelect("iotManDiluent", d)`.
- Campos antigos `iotUseCustom`, `iotCustomConc`, `iotCustomUnit`
  preservados como `<input type="hidden">` para retrocompatibilidade com
  referências residuais.

**5. Calculadora de Infusão Contínua** — `updateInfPrep` agora chama
`populateDiluentSelect("infDiluent", d)`, fazendo o select de diluente
respeitar o preferencial da droga (ex.: Amiodarona pré-seleciona SG 5%
e oculta SF 0,9%). Solução final editável já estava implementada
(Fase 2).

### Validação runtime

```
Fenitoína     → diluentes: ["SF 0,9%"]                            (restrito) ✓
Fenobarbital  → diluentes: ["SF 0,9%", "SG 5%"]                                ✓
Levetiracetam → diluentes: ["SF 0,9%", "SG 5%", "Ringer lactato"]               ✓
Amiodarona    → diluentes: ["SG 5%"]                              (restrito) ✓
Fentanil      → diluentes: ["SF 0,9%", "SG 5%", "conforme protocolo"] (fallback) ✓

Override manual em fenitoína:
  preset:  50 mg/mL → 1260 mg = 25.2 mL ✓
  manual:  10 mg/mL → 1260 mg = 126 mL  ✓ (precedência)
  preview: "10 mg/mL | 1000 mg em 100 mL de SF 0,9%" ✓
```

### Por que importa clinicamente

- **Segurança de incompatibilidades**: drogas com diluente único (fenitoína
  só SF, amiodarona só SG) deixam de oferecer alternativa perigosa no
  dropdown — só aparecem opções safe.
- **Flexibilidade controlada**: drogas com múltiplos diluentes permitidos
  (levetiracetam) mostram todas as opções, com o preferred já selecionado.
- **Preparo manual uniforme** nas 3 calculadoras: o mesmo padrão
  cognitivo (massa + unidade + diluente + volume → conc) vale para
  qualquer droga.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `c4b5b7452c0ea8d48f9d2be244401533536aac37f7d2dd63a07f35eecc249937`)

### Pendente / próximas iterações

- Estender `preferredDiluent`/`allowedDiluents` a mais drogas conforme
  padronização institucional (atualmente só nas drogas com regra crítica
  explícita).
- Pode-se adicionar alertas visuais (ex.: badge âmbar) quando o usuário
  escolhe um diluente que NÃO é o preferred — pendente.

## 2026-05-22 — Mod 6: separação clara entre Calculadora de Bólus e Calculadora de Infusão Contínua

### Tipo de alteração

- Interface — **reestruturação da seção 3 para eliminar redundância
  e simplificar navegação**

### Problema

A seção 3 "Calculadora de droga vasoativa" continha DOIS painéis:
1. "DVA contínua — dose ↔ bomba" (calcDVA)
2. "Bólus / push-dose" (calcDVABolus)

O painel 1 era redundante com a seção 4 "Drogas em infusão contínua", já
que `infusionData.vasoativa.drugs` é populado dinamicamente com o spread
de `dvaDrugs.{vasopressor,inotropico,vasodilatador,cronotropico}`. Resultado:
mesmo conjunto de drogas (noradrenalina, dobutamina, milrinona, etc.) aparece
em DOIS lugares com cálculos paralelos, gerando confusão de navegação e risco
de divergência futura.

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**1. Painel "DVA contínua" removido** da seção 3. Todo conteúdo de DVA em
infusão contínua segue disponível na seção 4 (Drogas em infusão contínua)
ao escolher a categoria "Droga vasoativa", que mostra o catálogo completo
de vasopressores, inotrópicos, vasodilatadores e cronotrópicos.

**2. Seção 3 renomeada** para **"3. Calculadora de bólus / dose intermitente"**.
Foco exclusivo:
- Bólus único / push-dose (atropina, adrenalina/fenilefrina push, etc.)
- Anti-hipertensivos em bólus (esmolol, labetalol, etc.)
- Anticonvulsivantes em dose de carga (fenitoína, fenobarbital, levetiracetam, magnésio eclâmpsia)
- Broncodilatador adjuvante intermitente (magnésio broncoespasmo)
- Outros bólus

**3. Parágrafo de orientação** logo abaixo do título, com link interno
para a calculadora de infusão contínua, explicando que drogas vasoativas
em infusão contínua titulada usam a calculadora dedicada (categoria
"Droga vasoativa").

**4. Subtítulo do painel** atualizado: "Bólus / push-dose / intermitente".

**5. Navegação interna** (TOC original do HTML) atualizada:
"3. Calculadora de DVA" → "3. Calculadora de bólus / intermitente".

**6. Funções JS defensivas**
- `initDVA()`, `updateDVADrugs()`, `calcDVA()`, `addDVAToSummary()` recebem
  early return `if(!document.getElementById("dvaCat")) return;`
- Listeners de `peso/cenário` que chamam `calcDVA()` continuam funcionando
  sem erro de console pois a função retorna cedo agora.
- As funções permanecem definidas no escopo do script para retrocompatibilidade
  com `dvaScenarioMeta`, `dvaScenarioFit` e demais helpers que ainda são
  referenciados pelo `infusionScenarioMeta` (que usa essas funções para
  drogas vasoativas em infusão contínua).

### Validação runtime

```
sec3 título:    "3. Calculadora de bólus / dose intermitente" ✓
sec3 painéis:   1 (apenas Bólus / push-dose / intermitente) ✓
dvaCat:         removido ✓
dvaBolusCat:    presente ✓ (bólus calc OK)
infCat:         presente ✓ (infusão contínua OK)
Erros runtime:  0 ✓
Peso change:    não crasha (defensivos OK) ✓
```

### Drogas afetadas

- Vasopressores, inotrópicos, vasodilatadores, cronotrópicos em infusão
  contínua: **acesso pela seção 4** → Categoria "Droga vasoativa".
- Bólus puros e intermitentes: **acesso pela seção 3** (calculadora dedicada).

Sem alteração de dose, faixa terapêutica ou diluição em nenhum item.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `7426dc60da44f316783071a4dd7f096d91cb0932e65c671c88ac08f53f2d4250`)

## 2026-05-22 — Mod 6 Fase 2: solução final editável no painel de infusão contínua

### Tipo de alteração

- Interface + lógica de cálculo — **flexibilidade para montar solução
  personalizada além dos presets** (item 3 do refator de segurança/UX)

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**1. Novo painel "Solução final montada (editável)"** logo após o painel
da ampola, no `<section id="continua">`. 4 campos:
- `infFinalMass` (number) — quantidade do fármaco
- `infFinalMassUnit` (select mcg/mg/g/UI)
- `infFinalVolume` (number, mL) — volume final
- `infFinalConcPreview` (readonly) — concentração calculada

**2. Auto-fill ao selecionar preset** (`updateInfPrep`):
- `extractSolutionDefaultsFromPrep()` faz parse de `prep.label` com regex
  `/(\d+(?:[.,]\d+)?)\s*(mcg|mg|g|UI)\s+em\s+(\d+(?:[.,]\d+)?)\s*mL/i`
- Quando o label segue o padrão "X mcg/mg/g/UI em Y mL", massa e volume
  são extraídos diretamente.
- Quando não bate (ex.: "10 mg/mL puro" do propofol), fallback usa
  `prep.conc × infBagVolume` (default 250 mL) para derivar massa.
- A unidade de massa é inferida de `prep.unit` (mcgml → mcg, etc).

**3. Concentração editável tem precedência no cálculo**
(`calcInfusion`, `addInfusionToSummary`):
- `getEditableSolutionConc()` lê massa+unidade+volume e devolve
  `{conc, concUnit}`.
- Se a leitura é válida (massa>0 e volume>0), substitui `prep.conc`
  e `prep.unit` no cálculo da vazão; senão, fallback ao preset.
- Suporte a unidade "g" (converte para mg internamente para o cálculo).

**4. Live preview da concentração**
- `updateFinalSolutionPreview()` formata em tempo real:
  `"X mg/mL | Massa: Y mg em Z mL"` no campo readonly.
- Listeners de input em `infFinalMass`, `infFinalMassUnit`,
  `infFinalVolume` chamam `updateFinalSolutionPreview()` + `calcInfusion()`.

### Validação runtime

| Droga | Auto-fill | Edição | Vazão recalcula |
|---|---|---|---|
| Fentanil "500 mcg em 50 mL" | 500 mcg / 50 mL → 10 mcg/mL ✓ | mass → 1000 mcg | 20 mcg/mL → 3,5 mL/h (era 7,0) ✓ |
| Noradrenalina "16 mg em 250 mL" | 16000 mcg / 250 mL → 64 mcg/mL ✓ | — | — |
| Propofol "10 mg/mL puro" | fallback 2500 mg em 250 mL → 10 mg/mL ✓ | — | — |

### Casos não-clínicos abrangidos

- O preset "Solução final sugerida" continua existindo e funciona como
  ponto de partida — o usuário pode aceitar a sugestão ou editar.
- O painel da ampola permanece independente — é apenas para calcular
  quanto aspirar (massa/volume da fonte).
- O usuário pode criar uma solução não-padronizada (ex.: noradrenalina
  32 mg em 250 mL = 128 mcg/mL ao invés do preset 64) e a calculadora
  responde com a vazão ajustada.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `4392627b27785bdc50283c5b48baffaca6e087ce7c7743f6fa0ce3fa6569e587`)

### Status do refator de 8 itens

- ✅ Item 1: Magnésio fora de infusão contínua (Fase 1)
- ✅ Item 2: `administrationType` field (Fase 1)
- ✅ Item 3: Solução final editável (Fase 2 — esta entrada)
- ✅ Item 4: Ampola separada de solução final (já existia, agora explícito)
- ✅ Item 5: Fórmulas confirmadas
- ✅ Item 6: UI condicional por tipo (Fase 1)
- ✅ Item 7: Magnésio cadastrado em 2 categorias (Fase 1)
- ✅ Item 8: Alert de segurança (Fase 1)

Refator de calculadora interativa completo.

## 2026-05-22 — Mod 6: tipo de administração + magnésio movido para intermitente (REQUER REVISAO MEDICA)

### Tipo de alteração

- **Conteúdo clínico (correção de risco) + arquitetura da calculadora**

### Problema corrigido

Sulfato de magnésio IV para broncoespasmo estava cadastrado em
`infusionData.broncoespasmo` (categoria de infusão contínua) com
`defaultDose:6000 mg/h` — o que representava o RATE necessário para
infundir 2 g em 20 min, MAS o campo era apresentado como "dose desejada
em mg/h". Um clínico que aceitasse o default poderia, na pior leitura,
configurar uma infusão contínua de 6000 mg/h — dose perigosa.

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

**1. Magnésio removido de `infusionData.broncoespasmo`**
- A categoria mantém apenas Salbutamol IV (legitimamente continuous_infusion 5–20 mcg/min).

**2. Magnésio re-cadastrado em DOIS slots na calculadora de bólus** (com `administrationType:"intermittent_infusion"`):
- **`broncodilatador_adjuvante.magnesio_broncoespasmo`** — nova categoria:
  - Dose: 2 g IV em 20–30 min (adjuvante em asma grave/DPOC refratária)
  - Solução: 2 g em 100 mL SF 0,9% → 20 mg/mL
  - Apresentações: MgSO₄ 50% (500 mg/mL) ou 10% (100 mg/mL)
- **`anticonvulsivante_bolus.magnesio_anticonvulsivante`** — junto aos demais loadings:
  - Dose: 4–6 g IV em 15–20 min (eclâmpsia/pré-eclâmpsia grave)
  - Solução: 4 g em 100 mL → 40 mg/mL
  - Apresentações: idem
  - Nota explícita: NÃO é a manutenção contínua (que seria 1–2 g/h em bomba separada).

**3. Novo campo `administrationType`** com valores:
- `"continuous_infusion"` (infusão contínua titulada)
- `"bolus"` (existente; bólus único)
- `"intermittent_infusion"` (NOVO; dose total em tempo definido)

Aplicado em Salbutamol IV (continuous_infusion) e nas duas entradas
novas de magnésio. Demais drogas continuam funcionando pelo
comportamento padrão (sem o campo = bolus em `dvaBolusDrugs`; sem o
campo = continuous_infusion em `infusionData`).

**4. UI condicional por administrationType**
- Novo painel `#dvaBolusIntermittentPanel` (display:none por padrão) com inputs:
  - `dvaBolusTimeMin` (tempo em min)
  - `dvaBolusFinalVolume` (volume final em mL)
- Quando a droga selecionada tem `administrationType==="intermittent_infusion"`:
  - Painel é exibido (display:grid)
  - Valores default preenchidos a partir de `defaultTimeMin` e `defaultFinalVolume` da droga
  - Alert âmbar visível sob o painel: "Administração intermitente — não é infusão contínua. Atenção à dose total em gramas, NÃO em mg/h"
- Quando não é intermittent: painel e alert ocultos.

**5. Branching no `currentDVABolus` + `calcDVABolus`**
- Para intermittent: calcula `doseInMg → volumeAspirar (massa/conc. ampola) → vazão = volumeFinal / (tempo/60)`.
- Headline mostra "X g em Y min → vazão Z mL/h" em vez de "X mg → V mL".
- Card "Solução preparada" mostra: apresentação comercial, volume a aspirar da ampola, volume final, massa total (em g e mg), concentração final calculada.
- Card "Posologia e farmacodinâmica" mostra: dose total, tempo de administração, vazão na bomba.
- Card "Cuidados e segurança" inclui linha extra: "Administração intermitente em bomba — NÃO é infusão contínua. A vazão calculada vale apenas pelos minutos definidos."

**6. `addDVABolusToSummary` ramificado**
- Para intermittent: item entra no cenário-resumo com `type:"Intermitente"`, dose formatada como "X g em Y min", volume como "Z mL/h por Y min".

**7. Suporte a unidade "g"** em `baseMassUnitFromDoseUnit`. Nova helper `toMilligrams()` para converter g/mg/mcg → mg.

**8. Notes de segurança em ambas entradas de magnésio**
- "NÃO CONFUNDIR a dose total em gramas com taxa em mg/h"
- Recomendação de monitorização (PA, reflexos patelares, FR, função renal, ECG)
- Antagonista: gluconato de cálcio
- Em eclâmpsia: lembrete de que essa é a dose de ATAQUE, não a manutenção contínua

### **REQUER REVISAO MEDICA**

Toda nomenclatura/faixa cruzada com referências (GINA 2024, ACOG eclampsia,
EMCrit IBCC). Validações pendentes:
- Confirmar protocolo institucional para a dose de ataque em eclâmpsia (4 vs 6 g).
- Confirmar tempo de infusão (20 vs 30 min) para broncoespasmo no serviço.
- Validar os textos de alerta para o cenário local.
- A manutenção contínua de magnésio em eclâmpsia (1–2 g/h) **ainda não foi cadastrada**.
  Pode ser adicionada à `infusionData` em rodada futura se desejado.

### Itens pendentes para Fase 2 (próxima rodada)

- **Item 3**: solução final totalmente editável (inputs massa desejada + volume final + concentração calculada) no painel de infusão contínua. Hoje, o preset de `prep.conc` é fixo.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `e1c9c4f908faf259dca83bd0fd395cf1ebfa68b93543e7d7ed64d6687d480485`)

## 2026-05-22 — Mod 6: renomear categoria "Broncoespasmo grave — ASMA/DPOC" para "Broncodilatadores"

### Tipo de alteração

- Interface — **renomeação de rótulo de categoria de medicação**

### Motivo

"Broncoespasmo grave — ASMA/DPOC" descreve um **cenário clínico**, não uma
classe farmacológica. Como o dropdown de cenário já contempla isso (no
painel 1 — Dados do paciente), o rótulo da categoria deve refletir a
**classe de drogas** que ela agrupa.

### Alterações realizadas

`src/data/modules/modulo_06_calculadoras_interativas.html`:

- `infusionData.broncoespasmo.label`: `"Broncoespasmo grave — ASMA/DPOC"`
  → **`"Broncodilatadores"`** (linha 891).
- `INFUSION_GROUPS` grupo `broncoespasmo`: `"Broncoespasmo / asma"`
  → **`"Broncodilatadores"`** (linha 2652). Mantida a consistência no
  painel agrupado do cenário-resumo.

### O que **não** foi alterado

- Opção do dropdown de cenário clínico (linha 270:
  `<option value="broncoespasmo">Broncoespasmo grave — ASMA/DPOC</option>`)
  — esse continua sendo um cenário, está corretamente nomeado.
- `scenarioNotes.broncoespasmo` — textos contextuais do cenário mantidos.
- A chave interna `broncoespasmo` foi preservada — refator apenas de
  rótulo, sem mudança de lógica/contrato.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 6:
  `1975fe83829f61fe4198868a0fdcdaf866cf8907dee220b5d7ea7c1b6e029b68`)

## 2026-05-22 — Mod 4 seção 7: widget interativo substituído por exemplo didático estático

### Tipo de alteração

- Interface + conteúdo didático — **reescrita da seção 7 do Mod 4 para
  apresentar o cálculo de infusão completo, com origem dos números**

### Problema

A seção 7 trazia um conversor interativo (`<input>` de peso, droga, dose,
concentração) que produzia "Resultado: 210 mcg/h → 5,25 mL/h", mas o
campo `Concentração final (mcg/mL)` aparecia preenchido com **40 mcg/mL**
sem nenhum contexto sobre como esse número foi obtido — não havia
apresentação comercial, preparo da solução, nem faixa terapêutica.
Faltavam ainda os passos intermediários do cálculo.

### Alterações realizadas

`src/data/modules/modulo_04_manutencao_sedoanalgesia.html`:

- Widget interativo (form + `calc-result`) removido.
- `<script>` que dirigia o widget (funções `updateDoseAndConcLabels` e
  `calcInfusao`, listeners de input, presets por droga, ~65 linhas)
  removido para evitar erros de referência no console.
- Substituído por **exemplo didático estático** estruturado em 4 passos
  para o caso Remifentanil / paciente 70 kg / SDRA grave:
  - **Passo 1 — Apresentação comercial**: frasco-ampola 2 mg liofilizado.
  - **Passo 2 — Preparo**: reconstituir 2 mg + SF q.s.p. 50 mL → 40 mcg/mL.
  - **Passo 3 — Faixa terapêutica**: 0,03–0,15 mcg/kg/min; escolha 0,05 mcg/kg/min.
  - **Passo 4 — Cálculo**: 0,05 × 70 = 3,5 mcg/min → × 60 = 210 mcg/h → ÷ 40 = **5,25 mL/h**.
- Alert verde final consolida a prescrição.
- Alert azul de generalização aponta para o Módulo 6 como ferramenta
  operacional para outras drogas (todas com seleção de presets,
  apresentação, preparo e faixa).

### Por que essa abordagem é melhor

- Conecta apresentação → preparo → concentração → faixa → cálculo numa
  única narrativa, eliminando o "Concentração final" órfão.
- O leitor entende **de onde** vem cada número (40 mcg/mL não cai do céu —
  vem do preparo 2 mg / 50 mL).
- A calculadora operacional continua no Módulo 6, sem duplicação aqui.
- Remove código JS embarcado redundante, sincronizando o Mod 4 com o
  princípio de calculadora-única.

### Arquivos modificados

- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `scripts/verify-module-hashes.mjs` (Mod 4:
  `35d9620e61fefe1c291398860a39fb37d21f2df2d397d389afa0b123f27330f1`)

## 2026-05-22 — Mod 5 SVG eixos vasoativos: β2 com efeito hemodinâmico (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **texto de legenda em SVG diagramático**

### Alterações realizadas

- No SVG "Eixos hemodinâmicos das drogas vasoativas"
  (`src/data/modules/modulo_05_drogas_vasoativas.html` linha 185), a segunda
  linha do box β2 estava com texto "lactato adrenérgico" — descontextualizado
  do padrão hemodinâmico dos demais boxes:
  - α1: vasoconstrição / ↑ RVS / ↑ PAM
  - β1: ↑ inotropia / ↑ FC / ↑ DC
  - β2: vasodilatação / **lactato adrenérgico** ← inconsistente
- Substituído por: **↓ RVS / ↓ PAM** — espelha o padrão de α1 (ambos
  receptores vasculares afetando RVS/PAM), comunicando o efeito hemodinâmico
  direto da vasodilatação β2.
- A informação sobre lactato/glicogenólise β2 permanece preservada no texto
  da tabela acima do SVG ("Vasodilatação, broncodilatação, glicogenólise,
  lactato por estímulo adrenérgico") e na coluna "Cuidados/limitações"
  ("hiperlactatemia adrenérgica"). Não houve perda de conteúdo clínico —
  apenas reorganização do que cabe no diagrama vs. na tabela.

### **REQUER REVISAO MEDICA**

Validar se a representação resumida `↓ RVS / ↓ PAM` é adequada para o
efeito β2 puro (sem considerar β1 concomitante em drogas mistas). Em
contexto isolado de β2 ativo, a vasodilatação periférica reduz RVS e
secundariamente reduz PAM — está coerente. A pequena elevação eventual
de DC por redução de pós-carga não é o sinal hemodinâmico dominante
quando o agonista é β2-seletivo.

### Arquivos modificados

- `src/data/modules/modulo_05_drogas_vasoativas.html` (linha 185, SVG)
- `scripts/verify-module-hashes.mjs` (Mod 5:
  `6af9dc2b1017c5109ca3976f1b9d18d11469e7748f59765412e198ab435e064d`)

## 2026-05-22 — Tabelas: hierarquia visual, cabeçalho em gradiente, primeira coluna como tópico

### Tipo de alteração

- Interface — **estilização visual das tabelas** (hierarquia, legibilidade,
  impacto/memorização). Sem alteração de conteúdo clínico.

### Alterações no `injectMobileResponsiveStyles` (`src/utils/iframeSafety.ts`)

**Base estética (qualquer viewport)**:

- Tabela ganha fundo branco, borda externa suave (#d8e2ea), `border-radius`
  12px, sombra discreta (elevação leve).
- Cabeçalho `<thead th>` com **gradiente navy** (#1a4d80 → #123c69), texto
  branco em **MAIÚSCULAS** com `letter-spacing` 0.05em — sinaliza início
  de linha de leitura.
- Bordas internas reduzidas a hairlines (#eef2f7) horizontais + verticais
  finas — preservam alinhamento sem ruído.
- Zebra striping (`nth-child(even)`) com tom muito claro (#f8fafc).
- Hover de linha com tinta azul-claro (#eff5fa, 140ms transition) — feedback
  de leitura ativa.
- **Primeira coluna** ganha peso 600 + cor navy escura (#0d2438): atua como
  "tópico" da linha (entidade — droga, estrutura anatômica, etc.).
- `<strong>` em primeira coluna intensifica para `#123c69` + 700.

**Modo cards (mobile <768px e tabelas largas no tablet 768-1023)**:

- Cada `<tr>` vira card empilhado: fundo branco, borda + **stripe verde
  esmeralda 4px à esquerda** (cor de acento `--accent` #0b6b5c), sombra
  mais pronunciada (depth 4-12px).
- **Primeira `<td>` vira TÍTULO do card**: fonte 16px, peso 700, cor
  primary, com underline (hairline border-bottom) — corta da seção de
  dados. O `data-label` da primeira td é suprimido (redundante: "Categoria:
  Analgésicos opioides" → o título sozinho já comunica).
- Demais `<td>` recebem rótulo da coluna como caption tipográfico
  (uppercase 11px, cor `#5f6b7a`) acima do valor — preserva contexto
  perdido pelo desaparecimento do thead.
- Hover/zebra desativados no modo cards (não fazem sentido em layout
  empilhado).

**Tablet 768-1023, tabelas normais (≤4 colunas)**:

- Mantém layout de tabela com fonte/padding reduzidos (11-12px header,
  13px body, padding 8-10px) — mais densidade onde cabe sem cortar.

### Resultado esperado

- **Hierarquia visual**: cabeçalho navy + maiúsculas → primeira coluna em
  peso/cor → demais colunas em peso normal. Olho identifica a coluna-chave
  imediatamente.
- **Memorização**: cores e estrutura consistentes por viewport. No mobile,
  a "carteira" de cards com primeira célula como título funciona como
  flashcard visual.
- **Leitura ativa**: hover dá feedback de qual linha o olho está varrendo.
- **Densidade ajustada**: tablet com 6 colunas → cards verticais
  legíveis; tablet com 3-4 colunas → tabela compacta; desktop → tabela
  cheia normal.

### Notas técnicas

- Uso de `!important` cirúrgico para sobrescrever a CSS embarcada de cada
  módulo (cada HTML tem o seu `<style>` próprio com regras de tabela).
- Nenhum hash de módulo foi alterado — todas as mudanças via injeção
  runtime em `applyIframeSafetyLayer`.

### Arquivos modificados

- `src/utils/iframeSafety.ts` (apenas `injectMobileResponsiveStyles`)

## 2026-05-22 — Responsividade de tabelas: tablet com cards para tabelas largas

### Tipo de alteração

- Interface — **comportamento responsivo de tabelas no breakpoint tablet
  (768-1023px)**

### Problema

A CSS injetada no iframe forçava `min-width: 640px` para tabelas no tablet,
fazendo tabelas com 5-6 colunas (ex.: "Classes de medicamentos por utilidade
clínica" do Mod 4) estourarem horizontalmente o container, com colunas
cortadas e visual desalinhado em relação ao texto envolvente.

### Solução

`src/utils/iframeSafety.ts`:

- `applyDataLabelsToTables()` agora também marca tabelas com **≥ 5 colunas**
  recebendo a classe `codex-wide-table` em runtime.
- CSS reescrito em `injectMobileResponsiveStyles()`:
  - **<768px**: todas as tabelas viram cards rotulados (mantido).
  - **768-1023px**:
    - Tabelas `codex-wide-table` viram cards rotulados (mesma técnica do
      mobile) — colunas demais sairiam apertadas demais para layout em
      grade.
    - Tabelas com ≤ 4 colunas ganham **layout compacto** (font 13px,
      padding 6-8px, `vertical-align: top`, `overflow-wrap: anywhere`)
      respeitando a largura do container, sem `min-width` forçado e sem
      scroll horizontal — alinha com o texto envolvente.
  - **≥ 1024px**: layout completo. `.codex-table-scroll` deixa de impor
    `overflow-x` no desktop.

### Resultado esperado

- Mod 4 seção 5 (6 colunas), 6.1/6.2/6.3/6.4 (6 colunas), 8 (6 colunas),
  10.5 (6 colunas), 11 (3-4 colunas conforme rev.) — todas tabelas com
  ≥ 5 colunas viram cards rotulados no tablet.
- Mod 5 e Mod 6 — análogo.
- Tabelas curtas (≤ 4 colunas) permanecem como tabela compacta legível
  no tablet, sem cortar conteúdo.

### Arquivos modificados

- `src/utils/iframeSafety.ts` (CSS + lógica de marcação)

Nenhum hash de módulo foi alterado — todas as mudanças via runtime injection.

## 2026-05-22 — Mod 5: remoção do bloco "5.0 Regra de apresentação medicamentosa"

### Tipo de alteração

- Interface — **remoção do mesmo bloco metainformativo redundante,
  agora no Mod 5**

### Alterações realizadas

- Removido o `<details>` "5.0 Regra de apresentação medicamentosa" em
  `src/data/modules/modulo_05_drogas_vasoativas.html` (mesmo padrão da
  remoção feita no Mod 4 mais cedo). Tabela editorial de convenção de
  nomenclatura + alerta "Regra prática" — informação para padronização
  interna, sem valor para o leitor clínico.
- O `<details>` seguinte "Apresentações comerciais usuais no Brasil — DVA
  e infusões críticas" permanece, pois traz dado clínico útil.

### Arquivos modificados

- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `scripts/verify-module-hashes.mjs` (Mod 5:
  `30f414d8061313aca06391214314447448f93ae1492a3344a1c20d8609b85448`)

## 2026-05-22 — Mod 4: remoção do bloco "6.0 Regra de apresentação medicamentosa"

### Tipo de alteração

- Interface — **remoção de bloco metainformativo redundante para o leitor**

### Alterações realizadas

- Removido o `<details>` "6.0 Regra de apresentação medicamentosa" em
  `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`.
- Esse bloco descrevia para o leitor a convenção interna de nomenclatura
  (apresentação comercial vs. concentração usada no cálculo vs. solução
  final/preparo). É informação para padronização editorial, não para
  uso clínico — não tem motivo de aparecer no conteúdo lido.
- O bloco seguinte "Apresentações comerciais usuais no Brasil" permanece
  intacto, pois traz dado clínico útil.

### Arquivos modificados

- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `scripts/verify-module-hashes.mjs` (Mod 4:
  `519ed95a6c1b9df6f03410879bfa81edb35b61d2ca737cefc01055ace03a8aa5`)

## 2026-05-22 — Mod 4: tópico de anticonvulsivantes em status epilepticus (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **nova subseção narrativa com tabela de anticonvulsivantes**

### Alterações realizadas

- Adicionada subseção **6.5 — Anticonvulsivantes em status epilepticus**
  no `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`, logo
  após "6.4 Bloqueadores neuromusculares".
- Conteúdo:
  - Parágrafo de abertura descrevendo o algoritmo escalonado (fase 1
    benzodiazepínico → fase 2 carga IV → fase 3 BIC anestésica) com
    referência ao NCS 2012 e ESETT 2019.
  - Tabela única com colunas: **Fármaco | Mecanismo | Faixa / dose |
    Preparo / exemplo | Cenário preferencial | Cuidados / contraindicações**.
  - 7 linhas: 3 drogas de carga IV (fenitoína, fenobarbital, levetiracetam)
    + 4 anestésicas em BIC (midazolam, propofol, tiopental, cetamina).
  - Cada linha alinhada às faixas codificadas no Módulo 6.
  - Alert amarelo enfatizando monitorização (EEG contínuo, hemodinâmica
    invasiva, vasopressor pronto, transição para anticonvulsivantes de
    manutenção antes do desmame da BIC).
  - Alert azul cruzando referência operacional para a calculadora do
    Módulo 6 (categorias *Anticonvulsivante em BIC* e *Anticonvulsivante —
    dose de carga IV*).

### **REQUER REVISAO MEDICA**

Todas as informações da nova tabela espelham a entrada já validada no
Módulo 6 (faixas, preparos, cuidados), mas precisam de validação
clínica institucional final — especialmente:

- Coluna "Cenário preferencial" (preferências contextuais entre 2ª linhas).
- Linhas de cetamina (1–7 mg/kg/h) — exige protocolo especializado.
- Mensagens dos alerts (regras de monitorização).

### Arquivos modificados

- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html` (nova subseção 6.5)
- `scripts/verify-module-hashes.mjs` (hash do Mod 4 atualizado para
  `216b7a957784ca17e858d60cb86247f92540e84fc35c3daabb4e525202b90be3`)

## 2026-05-22 — Anticonvulsivantes: novos bólus + ajustes em BICs (REQUER REVISAO MEDICA)

### Tipo de alteração

- **Conteúdo clínico — adição de drogas, ajuste de faixas posológicas e
  inclusão de referências bibliográficas**

### Drogas adicionadas em `dvaBolusDrugs.anticonvulsivante_bolus` (Mod 6)

1. **Fenitoína — dose de carga**
   - Apresentação: 250 mg/5 mL (50 mg/mL)
   - Dose: **15–20 mg/kg IV** (default 18 mg/kg)
   - Velocidade máxima: 50 mg/min (25 mg/min em idosos/cardiopatas)
   - Diluição: **EXCLUSIVAMENTE em SF 0,9%** (incompatível com SG 5%, precipita)
   - Alerta de purple glove syndrome / preferência por via central

2. **Fenobarbital — dose de carga**
   - Apresentação: 200 mg/2 mL (100 mg/mL)
   - Dose: **15–20 mg/kg IV** (default 18 mg/kg), até 30 mg/kg cumulativo
   - Velocidade: 50–100 mg/min em adultos (1 mg/kg/min em pediatria)
   - Diluição: 1:9 em SF/SG → 10 mg/mL
   - Alerta de hipotensão e depressão respiratória

3. **Levetiracetam (Keppra) — dose de carga**
   - Apresentação: 500 mg/5 mL (100 mg/mL)
   - Dose: **30–60 mg/kg IV** (default 60 mg/kg), máximo 4500 mg
   - Tempo de infusão: 15 min
   - Concentração máxima diluída: 15 mg/mL
   - Ajuste em insuficiência renal (ClCr < 80 mL/min)

### Drogas ajustadas em `infusionData.anticonvulsivante` (Mod 6)

- **Midazolam — status epilepticus refratário**:
  - Faixa anterior: "0,1–0,2 mg/kg/h inicial" (subestimava manutenção)
  - Faixa nova: **0,05–2 mg/kg/h** após bólus de carga **0,2 mg/kg IV**;
    até **2,9 mg/kg/h** em status super-refratário com EEG (NCS 2012)
  - `phaseInfo` reescrito para descrever bolus inicial e bólus de
    pré-titulação (0,1 mg/kg antes de aumentos)
  - Adicionado `maxInfusionTime` com guidance de desmame
  - **Correção de confusão clínica relatada pelo usuário**: a proposta
    inicial "ataque 100–250 mg em 2 min" havia sido confundida com tiopental
    e foi descartada.

- **Propofol — status epilepticus refratário**:
  - Faixa atual mantida (30–200 mcg/kg/min)
  - Adicionada referência explícita ao **bólus de carga 1–2 mg/kg IV lento**
    e equivalência em mg/kg/h (1,8–12 mg/kg/h)
  - `phaseInfo` adicionado
  - `maxInfusionTime` reforça alerta de PRIS com dose > 4 mg/kg/h por > 48h

- **Tiopental — status epilepticus refratário** (NOVO slot em
  anticonvulsivante; já existia como `tiopental_infusao` em sedativo):
  - Manutenção 3–5 mg/kg/h (faixa 0,5–5 mg/kg/h conforme protocolo)
  - Bólus de carga **3–5 mg/kg IV lento** (frequentemente fracionado em
    100–250 mg conforme PA), vasopressor pronto antes do ataque
  - Titular para burst-suppression no EEG

### Helpers atualizados

- `brazilAmpouleOptions`: novos entries para fenitoína, fenobarbital e
  levetiracetam (apresentações comerciais BR + alertas de diluição)
- `ampouleInfoByName`: novos retornos com `content`/`volume`/`unit` para
  auto-preenchimento do painel "Ampola/fr. disponível"

### Bibliografia adicionada em `modulo_07_referencias.html`

- **Brophy GM et al.** NCS Status Epilepticus Guidelines (2012). DOI: 10.1007/s12028-012-9695-z
- **Kapur J et al.** ESETT Trial. *NEJM* 2019;381:2103–2113. DOI: 10.1056/NEJMoa1905795
- **Glauser T et al.** AES Evidence-Based Guideline (2016). DOI: 10.5698/1535-7597-16.1.48
- Bulas profissionais (DailyMed/FDA) de fenitoína, fenobarbital e levetiracetam (Keppra) — incluindo alertas de incompatibilidade SG 5%, purple glove syndrome e concentração máxima diluída.

### **REQUER REVISAO MEDICA**

Todas as faixas e velocidades inseridas foram cruzadas com bibliografia
primária (NCS 2012, ESETT 2019, AES 2016, bulas profissionais), mas
precisam de validação clínica institucional:

- Confirmar adequação das doses padrão (defaults) para o serviço
- Confirmar política de via central vs. periférica para fenitoína
- Confirmar protocolo de monitorização hemodinâmica e EEG para tiopental
- Confirmar critérios de transição entre fase 2 (levetiracetam/fos-fenitoína/valproato) e fase 3 (anestésicos em BIC) no protocolo do serviço
- Validar o alerta de PRIS com propofol > 4 mg/kg/h por > 48h

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (novos slots, faixas ajustadas, helpers)
- `src/data/modules/modulo_07_referencias.html` (6 novas referências)
- `scripts/verify-module-hashes.mjs` (hashes atualizados):
  - Mod 6: `70f8ced902566db86228a8083357cddeabcd426ea39fadb545372804aa49187f`
  - Mod 7: `9c323cea1809e84e73efdc03a053dee83392d243bcc5a6761922c6d25b5cbb8d`

### Pendente (próxima rodada)

- Incorporar menção a fenitoína/fenobarbital/levetiracetam no Mod 4 (sedoanalgesia) onde já se cita status epilepticus como indicação de sedação profunda — esperando confirmação do usuário sobre escopo.

## 2026-05-22 — Responsividade mobile (Parte 1)

### Tipo de alteração

- Interface — **responsividade mobile do app shell + conteúdo dos iframes**

### Alterações realizadas

**`src/styles.css`:**

- Removido override que jogava `.module-menu-trigger` para `top:10px; left:10px`
  no mobile — o botão TOC agora permanece em `top:50%` (mid-height) em todas as
  resoluções, evitando colisão com o `<h1>` do módulo no topo do iframe.
- Reduzido `padding` do `.workspace` para `6px` no mobile (≤680px) para liberar
  largura útil para o conteúdo.

**`src/utils/iframeSafety.ts`:**

- Nova função `injectMobileResponsiveStyles(doc)` que injeta dentro do iframe:
  - `box-sizing: border-box` global, `img/svg/figure max-width:100%`,
    `pre/code` com word-wrap, `overflow-wrap: break-word` em textos.
  - **`@media (max-width: 767px)`**: cada `<table>` vira lista de cards
    empilhados. `thead` esconde; cada `<tr>` vira card com borda e padding;
    cada `<td>` mostra o rótulo da coluna (via `data-label`) acima do
    conteúdo. `body` recebe `padding-inline` (44px à esquerda, 56px à
    direita) para evitar que o conteúdo do iframe seja coberto pelos
    botões fixed (TOC à esquerda, busca à direita).
  - **`@media (min-width: 768px) and (max-width: 1023px)`**: tabela mantém
    layout original mas é envelopada em `.codex-table-scroll` (overflow-x
    auto) para evitar estouro horizontal.
  - SVG dentro de `.svg-box` ganha scroll horizontal quando estoura.
- Nova função `applyDataLabelsToTables(doc)` que, em runtime, lê os
  cabeçalhos `<th>` de cada `<table>`, adiciona `data-label` em cada
  `<td>` correspondente do `<tbody>`, e envelopa a tabela em
  `.codex-table-scroll`. Sinalizado por `dataset.codexLabelsApplied` para
  evitar reprocessamento em re-renders.
- Ambas chamadas a partir de `applyIframeSafetyLayer`, idempotentes.

### Cobertura

- 7 módulos canônicos (`modulo_01` a `modulo_07`) recebem o tratamento
  automaticamente — **sem edição dos HTMLs canônicos**, portanto os hashes
  permanecem inalterados (`npm run verify:modules` passou).

### O que **não** foi feito nesta rodada (Parte 2 pendente)

- Componente `<ZoomableContent>` com modal fullscreen para imagens/tabelas
  (pinch-zoom no mobile, X / ESC / focus trap).
- Detecção automática de overflow para exibir ícone de lupa só quando
  fizer sentido.

### Arquivos modificados

- `src/styles.css`
- `src/utils/iframeSafety.ts`

## 2026-05-22 — Ampola: input por massa+volume com concentração derivada

### Tipo de alteração

- Interface + lógica de cálculo (não-clínica) — **simplificação dos inputs de
  ampola na calculadora de infusão contínua**

### Alterações realizadas

- Painel "Ampola/fr. disponível" reformulado:
  - Antes: `Concentração da ampola` (mcg/mL | mg/mL | UI/mL) + `Unidade` +
    `Volume total` + `Conteúdo total` (readonly).
  - Depois: `Massa total da ampola` + `Unidade da massa` (mg | mcg | UI) +
    `Volume total (mL)` + `Concentração calculada` (readonly).
  - Concentração da ampola passa a ser sempre derivada (massa ÷ volume),
    eliminando inconsistência potencial entre o número informado e o que está
    escrito no rótulo da ampola.
  - O preview agora exibe: `5 mg/mL | Massa total da ampola: 15 mg`.
- Painel "Ajustes avançados da solução final" **removido**:
  - O override manual de `Concentração final da solução` deixa de existir.
  - A concentração final passa a vir exclusivamente do preset
    `Solução final sugerida` (campo `prep.conc` / `prep.unit` no
    `infusionData`).
  - Quem precisar de uma preparação fora do padrão deve solicitar a adição da
    preparação ao catálogo — evita risco de cálculo silenciosamente errado por
    valores destoantes inseridos no override.

### Mudanças no JS

- `getInfAmpOverride()` agora lê `infAmpMass` + `infAmpMassUnit` + `infAmpVolume`
  e computa `conc = mass/volume`.
- `updateAmpContentPreview()` exibe concentração calculada + massa total.
- `updateInfPrep()` preenche os campos de ampola a partir de
  `ampouleInfoByName()` (não mais `infConc`/`infConcUnit`).
- `calcInfusion()` e `addInfusionToSummary()` deixam de ler `infConc`/`infConcUnit`
  — usam `prep.conc` e `prep.unit` diretamente.
- `initInfusion()` registra event listeners apenas para os novos IDs.
- Adicionada `concUnitFromMassUnit()` (inverso de `massUnitFromConcUnit()`).

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (hash atualizado para
  `e80f7eb90b4b43246e0bc15338db706f944cd01fe94837004076184724031a98`)

## 2026-05-22 — Headline DVA mostra dose prescrita + equivalência por hora

### Tipo de alteração

- Interface — **legibilidade do headline da calculadora DVA**

### Alterações realizadas

- `calcDVA` em `src/data/modules/modulo_06_calculadoras_interativas.html`:
  - Modo **dose → vazão**: quando a `doseUnit` difere da unidade por hora
    convertida (ex.: `UI/min` → `UI/h`, `mcg/kg/min` → `mcg/h`,
    `mcg/min` → `mcg/h`), o headline agora exibe a dose prescrita primeiro e
    a massa por hora entre parênteses. Exemplo: `Vasopressina: 0,0300 UI/min
    (1,80 UI/h) → 9,00 mL/h`.
  - Modo **vazão → dose**: aplica simetricamente — primeiro a dose calculada
    na `doseUnit` clínica, depois a massa equivalente por hora entre parênteses.
  - Quando `doseUnit` já é por hora (`mg/h`, `mcg/h`, `mg/kg/h`), o formato
    antigo é mantido para evitar redundância.

### Motivo clínico

A unidade clinicamente prescrita é a referência para o intensivista (UI/min
para vasopressina, mcg/kg/min para noradrenalina/adrenalina, etc.). Mostrar a
unidade convertida por hora isoladamente forçava conversão mental no leitor.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (`calcDVA`)
- `scripts/verify-module-hashes.mjs` (hash atualizado para
  `31ca0ec701b54de00ccb20d62aa0d76a28d553aac72282e4853fe2b51a015f38`)

## 2026-05-22 — Amiodarona: orientação de vazão por fase (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **reescrita do texto de orientação de fases (`phaseInfo`)**

### Alterações realizadas

- Reescrito o campo `phaseInfo` de `infusionData.antiarritmico.drugs.amiodarona`
  (`src/data/modules/modulo_06_calculadoras_interativas.html`).
- Texto anterior expressava equivalências em mg/min (1 mg/min, 0,5 mg/min) sem
  trazer a vazão prática em mL/h.
- Texto atual traz vazões de referência por fase para a solução padrão
  900 mg/500 mL (1,8 mg/mL):
  - **Fase 1 (ataque 150 mg em 10 min)** → ≈ **500 mL/h** por 10 min
  - **Fase 2 (manutenção 60 mg/h por 6 h)** → ≈ **33 mL/h**
  - **Fase 3 (manutenção 30 mg/h por 18 h)** → ≈ **17 mL/h**

### Verificação matemática (solução 1,8 mg/mL)

- Fase 1: 150 mg / 10 min = 15 mg/min = 900 mg/h ⇒ 900 / 1,8 = **500 mL/h** ✓
- Fase 2: 60 mg/h ⇒ 60 / 1,8 = 33,33 mL/h ≈ **33 mL/h** ✓
- Fase 3: 30 mg/h ⇒ 30 / 1,8 = 16,67 mL/h ≈ **17 mL/h** ✓

### **REQUER REVISAO MEDICA**

Mudança em texto de orientação clínica/posológica:
- Confirmar adequação dos arredondamentos (33 e 17 mL/h) ao padrão institucional.
- Confirmar que a apresentação 900 mg/500 mL em SG 5% é a preparação de referência
  para o serviço; caso o serviço adote outra concentração, a vazão deve ser
  recalculada (ou usar a calculadora interativa para a apresentação real).
- Manter a ressalva de ajuste por ritmo, PA e protocolo institucional.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (`phaseInfo` da amiodarona)
- `scripts/verify-module-hashes.mjs` (hash atualizado para
  `ecfbf4ac6073474247393a83d2009c663710d39a9a4bacff983f019f070bd2a2`)

## 2026-05-22 — Nova prep de Dobutamina (REQUER REVISAO MEDICA)

### Tipo de alteração

- Conteúdo clínico — **adição de nova preparação de medicação**

### Alterações realizadas

- Adicionada segunda opção de preparação para **Dobutamina** na calculadora de infusão contínua /
  drogas vasoativas (`infusionData.vasoativa.drugs.dobutamina` / `dvaDrugs.inotropico.drugs.dobutamina`):
  - **Solução concentrada**: 4 ampolas de 250 mg/20 mL em 250 mL → 4000 mcg/mL (4 mg/mL)
  - Preparo: 80 mL de dobutamina (4 ampolas × 250 mg/20 mL) + 170 mL de diluente = 250 mL
  - Acrescentada conforme solicitação clínica explícita do usuário.

### Verificação matemática

- 4 ampolas × 250 mg = **1000 mg** total de dobutamina
- 4 ampolas × 20 mL = **80 mL** aspirados
- Diluente: 250 - 80 = **170 mL**
- Concentração final: 1000 mg / 250 mL = **4 mg/mL = 4000 mcg/mL** ✓

### **REQUER REVISAO MEDICA**

A diluição/concentração adicionada precisa de validação clínica antes de uso em produção:
- Confirmar se 4000 mcg/mL está dentro dos limites de osmolaridade/estabilidade para infusão central
- Confirmar compatibilidade com diluentes habituais (SG 5% / SF 0,9%)
- Confirmar protocolo institucional para uso de soluções concentradas de dobutamina

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html` (nova opção em `preps:[]`)
- `scripts/verify-module-hashes.mjs` (hash atualizado)

## 2026-05-22 — Cards visuais no cenário-resumo (Módulo 6)

### Tipo de alteração

- Interface
- Apresentação de cálculos

### Alterações realizadas

- Adicionados cards visuais de infusão contínua no `#summaryOut` do Módulo 6, no estilo dark
  medical-tech (mesmo da landing): por medicação adicionada ao cenário-resumo, um bloco com 4
  cards mostrando **Peso**, **Diluição** (concentração final extraída de `chartPrep`/`prep`),
  **Dose** (destacada em ciano) e **Vazão calculada** (destacada em azul).
- Helpers novos no JS interno: `splitValueUnit(string)` separa número e unidade; `shortPrepLabel(prep)`
  tenta extrair `X mg/mL` ou `X mg em N mL` do texto de preparo, com fallback de truncamento.
- `renderSummary()` modificado para inserir `renderInfusionCards()` entre o cabeçalho do cenário e
  a tabela de registro existente — a tabela completa permanece logo abaixo, sem alterações.
- CSS inline novo (16 regras `.resumo-card*`) no `<style>` do Módulo 6, scope local — não afeta
  outros módulos nem o app shell.

### Impacto clínico

- **Sem impacto clínico.** As funções `calcInfusion()`, `addInfusionToSummary()` e os valores
  armazenados em `state.summary[]` permanecem **intactos**. A mudança é estritamente de
  apresentação: os mesmos valores já calculados ganham uma visualização adicional.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs` (hash do Módulo 6 atualizado para `20d565fa…`)
- `docs/changelog.md`

## 2026-05-21 — Refactor de referências (Módulo 7)

### Tipo de alteração

- Organização de conteúdo
- Navegação

### Alterações realizadas

- Removida a seção `<section id="referencias">` (bibliografia consolidada de fim de módulo) dos
  seis módulos clínicos (módulo_01 a módulo_06). Os links `<li><a href="#referencias">…</a></li>`
  do TOC interno e o rótulo `"Ref"` no array `shortLabels` da navegação JS do Módulo 1 também
  foram removidos.
- Criado o **Módulo 7 — Referências consolidadas** em
  `src/data/modules/modulo_07_referencias.html`. Reúne a bibliografia primária dos seis módulos
  em subseções (`#refs-modulo-1` a `#refs-modulo-6`) na ordem original, com listas recolhíveis
  (`<details class="refs-collapsible">`).
- Os mini-blocos contextuais `<div class="ref"><strong>Referencial:</strong> …</div>` espalhados
  ao longo dos módulos foram preservados intactos. Eles ancoram diretamente o raciocínio ao
  texto-fonte e não fazem parte da consolidação.
- Hashes SHA-256 dos sete arquivos atualizados em `scripts/verify-module-hashes.mjs`.
- `src/data/moduleSources.ts` e `src/types.ts` ajustados para incluir `modulo-07`.

### Impacto clínico

- **Sem impacto clínico.** Nenhum conteúdo de doses, diluições, fórmulas, limites clínicos ou
  recomendações médicas foi alterado. As citações foram movidas de localização, mas o texto
  bibliográfico permanece idêntico ao original.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `src/data/modules/modulo_07_referencias.html` (novo)
- `src/data/moduleSources.ts`
- `src/types.ts`
- `scripts/verify-module-hashes.mjs`
- `docs/REVISAO_MODULOS.md`

## 2026-05-21

### Tipo de alteracao

- Autenticacao
- Assinatura
- Documentacao
- Organizacao

### Alteracoes realizadas

- Renomeada a variavel de ambiente `STRIPE_MONTHLY_PRICE_ID` para `STRIPE_PRICE_ID` (valor oficial `price_1TZf0zAIon1Sw6HssZDB0ZPO`) em `functions/_shared.ts`, `functions/api/create-checkout-session.ts`, `.env.example` e documentacao.
- Ajustado `AuthGate` para iniciar a assinatura via `POST /api/create-checkout-session`, mantendo `VITE_STRIPE_CHECKOUT_URL` apenas como fallback de desenvolvimento.
- Preparado o projeto para migracao de dominio proprio `manualvirtus.com.br`.
- Adicionado `docs/DEPLOY_MANUALVIRTUS.md` com passos operacionais para Registro.br, Cloudflare, Clerk, DNS, variaveis de ambiente e redeploy.
- Ajustado o gate de assinatura para liberar o app quando `user.publicMetadata.subscriptionStatus` ou `user.publicMetadata.stripeSubscriptionStatus` estiver como `active`.
- Mantida tela `SignedOut` com landing de login/cadastro e bloqueio integral do manual fora do gate autenticado.
- Atualizados `.env.example`, `README.md` e `docs/clerk-auth-billing.md` com variaveis de producao para `manualvirtus.com.br`.
- Confirmado que o Vite usa `base: "./"` e nao depende de `pages.dev`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `.env.example`
- `README.md`
- `docs/DEPLOY_MANUALVIRTUS.md`
- `docs/clerk-auth-billing.md`
- `docs/changelog.md`
- `src/components/AuthGate.tsx`

## 2026-05-21

### Tipo de alteracao

- Interface
- Organizacao
- Documentacao
- PWA/offline
- Autenticacao
- Assinatura

### Alteracoes realizadas

- Substituida a primeira abordagem de Clerk Billing/PricingTable por infraestrutura Clerk Auth + Stripe Checkout.
- Instalado `@clerk/clerk-react` e ajustada a interface de autenticacao para usar `SignedOut`, `SignInButton`, `SignUpButton`, `SignedIn` e `UserButton`.
- Usuarios desconectados passam a ver uma tela inicial com botoes `Entrar` e `Criar conta`.
- Usuarios conectados sem assinatura ativa sao direcionados ao fluxo de pagamento Stripe antes da liberacao do manual.
- Usuarios com assinatura ativa veem o app normalmente e o avatar/menu de usuario com opcao de sair.
- Adicionados estados visuais `ClerkLoading` e `ClerkFailed` para evitar tela em branco quando o Clerk ainda esta carregando ou quando o dominio/DNS ainda nao foi verificado.
- Adicionadas Cloudflare Pages Functions para consultar status de assinatura, criar checkout mensal, abrir Portal do Cliente Stripe e receber webhook Stripe.
- Adicionada validacao backend do token Clerk com `@clerk/backend`.
- Adicionada sincronizacao do status de assinatura Stripe no `public_metadata` do usuario Clerk.
- Reescrita a Function `/api/stripe-webhook` para validar assinatura pelo SDK oficial Stripe com corpo bruto e `STRIPE_WEBHOOK_SECRET`.
- Padronizado `publicMetadata.subscriptionStatus` como `active` ou `inactive` conforme eventos de checkout e assinatura.
- Adicionado botao de gerenciamento de assinatura para usuarios autenticados com acesso ativo.
- Atualizadas variaveis de ambiente em `.env.example`.
- Atualizada documentacao de configuracao em `docs/clerk-auth-billing.md` e `README.md`.
- Removido o menu interno dos modulos renderizados no iframe por camada de seguranca visual em runtime, preservando o menu lateral principal da PWA.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v59`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `package.json`
- `package-lock.json`
- `.env.example`
- `.gitignore`
- `functions/_shared.ts`
- `functions/api/subscription-status.ts`
- `functions/api/create-checkout-session.ts`
- `functions/api/create-portal-session.ts`
- `functions/api/stripe-webhook.ts`
- `src/main.tsx`
- `src/components/AuthGate.tsx`
- `src/styles.css`
- `src/utils/iframeSafety.ts`
- `README.md`
- `docs/clerk-auth-billing.md`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Organizacao
- Documentacao
- PWA/offline

### Alteracoes realizadas

- Instalado SDK oficial do Clerk para autenticar usuarios no PWA.
- Adicionado `AuthGate` para bloquear o manual quando o usuario nao estiver logado ou nao possuir assinatura/feature liberada.
- Integrado `PricingTable` do Clerk para exibir planos quando a conta esta autenticada, mas sem acesso ativo.
- Adicionada tela de configuracao ausente quando `VITE_CLERK_PUBLISHABLE_KEY` nao estiver definida.
- Adicionadas variaveis de ambiente em `.env.example`.
- Criado `docs/clerk-auth-billing.md` com fluxo de configuracao, assinatura mensal, protecao forte do conteudo e regra futura de sessao unica.
- Atualizado `README.md` com a arquitetura de login/assinatura.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v58`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `package.json`
- `package-lock.json`
- `.env.example`
- `.gitignore`
- `src/main.tsx`
- `src/components/AuthGate.tsx`
- `src/styles.css`
- `README.md`
- `docs/clerk-auth-billing.md`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Renomeado o topico `2. Estrategia de intubacao e bolus farmacologico` para `2. Calculadora para Intubacao`.
- Atualizado o item correspondente no menu interno do Modulo 6.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v57`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao apenas de nomenclatura visual da secao.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Substituidas frases genericas de estabilidade/validade por informacoes documentadas por molecula quando presentes na base de bulas consultada.
- Incluidas mensagens especificas para propofol, clevidipina, nitroprussiato, amiodarona, nicardipina, octreotida e nitroglicerina.
- Reduzido o texto padrao para medicamentos sem estabilidade documentada na base local: `Sem estabilidade documentada nesta base; seguir bula/farmacia.`
- Atualizadas fontes rastreaveis de estabilidade em `docs/clinical-sources.md`.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v56`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca troca orientacao operacional generica por dados resumidos de bula/rotulo quando disponiveis.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `docs/clinical-sources.md`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Adicionado mini-fluxo compacto no modelo SVA dentro do card `Tecnica e contexto` da estrategia de intubacao do Modulo 6.
- Criadas sequencias curtas para RSI, sequencia modificada, DSI, intubacao acordada e crash airway.
- Mantido o mini-fluxo em chips pequenos para evitar aumento relevante do tamanho visual do box.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v55`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca adiciona uma sequencia operacional sintetica para tecnica de intubacao.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Calculadora
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Adicionada `Hidralazina IV` na categoria de anti-hipertensivo/vasodilatador em bolus.
- Atualizada a orientacao de nitroglicerina em bolus para restringir o uso ao fenotipo SCAPE/EAP hipertensivo grave com VNI e monitorizacao.
- Incluida nota operacional de que nitroprussiato nao deve ser administrado como bolus IV direto, permanecendo como infusao titulada e protegida da luz.
- Adicionadas categorias de infusao continua: antiarritmicos, anticonvulsivantes/anestesicos em BIC e gastro-hepatologia/hemostatico esplancnico.
- Incluidas `Amiodarona`, `Lidocaina IV antiarritmica`, `Procainamida`, `Midazolam status epilepticus`, `Propofol status epilepticus`, `Cetamina status epilepticus` e `Octreotida`.
- Adicionados campos visuais para fases de administracao, bolus associado e tempo maximo/limite quando aplicavel.
- Incluida orientacao de dose de ataque do esmolol no box de infusao continua.
- Removida a linha visual redundante de resultado em massa/tempo no preparo operacional estruturado.
- Renomeada a secao para `4. Drogas em infusão contínua - preparo e administração.`
- Compactada a navegacao lateral principal e reposicionado o menu interno recolhido dos modulos como aba lateral.
- Atualizadas fontes rastreaveis em `docs/clinical-sources.md`.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v54`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca adiciona novas classes farmacologicas, novas medicacoes, indicacoes de uso, limites operacionais e orientacoes de preparo/estabilidade.
- Ajustes de interface sem impacto clinico: compactacao da navegacao, titulo da secao e reposicionamento do menu interno.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `src/styles.css`
- `src/utils/iframeSafety.ts`
- `docs/clinical-sources.md`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Calculadora
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Adicionada categoria `Betabloqueador em bolus / anti-impulso` na calculadora de bolus/push-dose do Modulo 6.
- Incluidas as medicacoes `Metoprolol IV`, `Esmolol dose de ataque` e `Labetalol IV`.
- Adicionadas apresentacoes, preparo/uso usual puro, dose inicial, faixa operacional, cuidados e alertas clinicos para cada betabloqueador.
- Ajustada a calculadora de bolus para aceitar dose por peso (`mcg/kg` e `mg/kg`) quando a medicacao exigir, preservando doses absolutas para as demais drogas.
- Adicionado teste minimo para conversao de bolus por peso em volume administrado.
- Atualizado o cenario `Disseccao aortica` para enderecar metoprolol, esmolol e labetalol como opcoes de controle de FC/dP/dt antes de vasodilatacao.
- Atualizadas fontes rastreaveis em `docs/clinical-sources.md` com ACC/AHA Aortic Disease 2022 e bulas DailyMed de metoprolol, esmolol e labetalol.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v53`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca adiciona nova categoria farmacologica, novas medicacoes e orientacoes clinicas de uso em bolus/push-dose.
- Nao houve alteracao das doses ou formulas ja existentes nas demais calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `docs/clinical-sources.md`
- `scripts/calculator-tests.mjs`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Padronizado o planejamento de solucao do Modulo 6 para 12 horas como opcao inicial.
- Removida a opcao visual de planejamento para 48 horas na calculadora de infusao continua.
- Mantida opcao de 24 horas apenas como planejamento que exige validacao por bula, farmacia clinica e protocolo local.
- Adicionada linha `Estabilidade/validade` nos boxes de medicacao das calculadoras de IOT, bolus DVA, DVA e infusao continua.
- Adicionada orientacao de estabilidade/validade no `Preparo operacional estruturado` e no texto gerado do `Cenario-resumo`.
- Incluidas orientacoes especificas para emulsao lipidica, nitroprussiato fotossensivel, solucoes reconstituidas/diluidas, bolus/seringas de titulacao e infusoes curtas.
- Registrada fonte de apoio DailyMed em `docs/clinical-sources.md` para rastreabilidade de bulas e estabilidade.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v52`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca adiciona texto clinico sobre estabilidade, validade, descarte, fotoprotecao e tempo operacional de uso da solucao.
- Nao houve alteracao de dose, formula, concentracao, volume calculado ou logica dose/vazao das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `docs/clinical-sources.md`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Adicionada orientacao `Diluente/uso` nos resultados das calculadoras do Modulo 6.
- A orientacao passa a indicar se o preparo e puro/pronto para uso ou se deve ser diluido.
- Quando houver diluente selecionado na calculadora, o resumo passa a exibir o diluente usado no calculo.
- O `Cenario-resumo` e o texto gerado para registro agora incluem orientacao de diluente/uso por medicacao adicionada.
- Mantida a logica de dose, vazao, concentracao, volume final e planejamento de 24h.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v51`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A mudanca adiciona texto clinico sobre preparo puro versus diluido, diluente preferencial/usado no calculo e compatibilidade por bula/protocolo.
- Nao houve alteracao de dose, formula, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Simplificada a visualizacao do `Preparo operacional estruturado` no `Cenario-resumo` do Modulo 6.
- Removidos os cards visuais `Massa/tempo` e `Calculo operacional` dessa visualizacao.
- Removida a coluna `Massa/tempo` da tabela-resumo.
- Padronizado o resumo para nao reutilizar o HTML detalhado de planejamento de 24h nessa area.
- Mantidos `Apresentacao/preparo`, `Dose`, `Volume/vazao` e `Faixa terapeutica` como elementos principais da visualizacao.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v50`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.
- A mudanca altera apenas a visualizacao resumida dos itens ja calculados.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Reformatado o texto gerado em `Cenario-resumo` no Modulo 6.
- O texto para prontuario agora lista as medicacoes na ordem de adicao, em topicos enumerados.
- Cada medicacao passa a exibir dose/unidade de referencia, volume aspirado + diluente, massa por volume total, concentracao por mL e vazao em bomba em linhas separadas.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v49`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.
- A mudanca altera apenas a formatacao do texto gerado a partir dos valores ja calculados.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Removida do Modulo 6 a secao inicial `Dados e seguranca`.
- Reorganizada a ordem visual do Modulo 6 para iniciar diretamente em `Dados globais do paciente`.
- Atualizados sumario interno e numeracao dos blocos operacionais do Modulo 6.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v48`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Foi removido bloco textual metodologico/de seguranca do Modulo 6.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Removido do Modulo 6 o box informativo sobre peso predito em `Dados globais do paciente`, conforme solicitacao do autor.
- Sincronizada a copia espelho do Modulo 6 em `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v47`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Foi removido um bloco textual informativo de conteudo clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- PWA/offline
- Interface

### Alteracoes realizadas

- Ajustado o service worker para buscar navegacoes e HTML pela rede antes de usar cache local.
- Mantido fallback offline para `index.html` quando a rede nao estiver disponivel.
- Reduzida a chance de o PWA manter a interface antiga apos novo deploy.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v46`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Removido o redimensionamento em grid quando o sumario de modulos e aberto em telas maiores.
- Mantidos o sumario de modulos e o painel de busca como paineis laterais sobrepostos ao conteudo central.
- Ajustada a prioridade visual dos paineis laterais para que a leitura do modulo nao seja reestruturada ao abrir menus.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v45`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/styles.css`
- `src/App.tsx`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Substituida a aba recolhida de busca por uma lupa lateral direita.
- Mantido o formulario de busca oculto ate clique na lupa.
- Ajustado o sumario lateral: clicar no modulo alterna a exibicao dos subtópicos do modulo ativo.
- Mantida a seta lateral como controle de recolhimento da barra de modulos inteira.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v44`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/App.tsx`
- `src/components/SearchPanel.tsx`
- `src/components/Sidebar.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Removido o elemento `header.topbar` da aplicacao.
- Mantido apenas um botao flutuante compacto para abrir o sumario de modulos.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v43`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/App.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- Interface
- PWA/offline

### Alteracoes realizadas

- Consolidada a delimitacao entre os Modulos 2, 4 e 6 sobre sedoanalgesia.
- Acrescentado no Modulo 2 o escopo de uso para os primeiros minutos apos confirmacao do tubo.
- Acrescentado no Modulo 4 o escopo de referencia longitudinal para manutencao de sedoanalgesia em UTI.
- Mantido o Modulo 6 como local operacional para calculo de volume, concentracao e vazao.
- Recolhidos por padrao blocos longos no Modulo 2 e a regra de apresentacao medicamentosa no Modulo 4 para reduzir redundancia visual.
- Sincronizadas as copias espelho em `modules/`.
- Atualizados os hashes de integridade dos Modulos 2 e 4.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v42`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao delimitou e reorganizou conteudo clinico de sedoanalgesia entre modulos.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-21

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reduzida a barra superior da aplicacao para um controle flutuante compacto de abertura do sumario de modulos.
- Ajustado o cabecalho do `ModuleViewer` para exibir apenas numero e titulo do modulo em formato enxuto.
- Ajustado o painel de busca lateral para informar `Digite 2+ letras` antes da pesquisa.
- Adicionado fechamento dos paineis laterais por tecla `Escape`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v41`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de conteudo medico, dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/App.tsx`
- `src/components/ModuleViewer.tsx`
- `src/components/SearchPanel.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Consolidada a sobreposicao entre os Modulos 1 e 2 sobre complicacoes peri e pos-IOT.
- Reorganizado o Modulo 1 para tratar complicacoes pelo angulo de antecipacao e prevencao durante a intubacao.
- Mantida a resposta operacional detalhada no Modulo 2 para confirmacao do tubo, DOPE/DOPES, hipotensao pos-IOT, sedoanalgesia imediata e primeiros minutos apos a IOT.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v40`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao resumiu e reorganizou conteudo clinico sobre complicacoes peri e pos-IOT.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Consolidada a sobreposicao entre os Modulos 2 e 3 sobre transicao para ventilacao mecanica e auto-PEEP.
- Mantida no Modulo 2 a tabela de ajustes iniciais pos-IOT e transformada a explicacao detalhada de auto-PEEP em triagem rapida de beira-leito.
- Mantido o Modulo 3 como referencia principal para fisiologia, curvas e ajuste definitivo de auto-PEEP.
- Recolhido o bloco `Medidas de ponte ate ajuste definitivo` no Modulo 2 para reduzir poluicao visual sem remover condutas.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 2.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v39`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao resumiu e reorganizou conteudo clinico de ventilacao mecanica/auto-PEEP no Modulo 2.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Organizacao
- Conteudo clinico
- PWA/offline

### Alteracoes realizadas

- Convertidas as calculadoras didaticas dos Modulos 4 e 5 em blocos recolhidos, preservando a funcionalidade e reduzindo redundancia visual com o Modulo 6.
- Renomeadas as entradas de navegacao dos Modulos 4 e 5 de `Mini-calculadora` para `Exemplo de calculo`.
- Removidas as notas metodologicas exibidas ao final das referencias dos Modulos 1 a 6, mantendo a politica metodologica e clinica registrada na documentacao do projeto.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e scripts de calculo existentes.
- Sincronizadas as copias espelho em `modules/`.
- Atualizados os hashes de integridade dos Modulos 1 a 6.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v38`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao removeu avisos/metodologia visiveis nos HTMLs e reposicionou calculadoras didaticas como conteudo recolhido.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou logica das calculadoras.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_03_ventilacao_mecanica.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_05_drogas_vasoativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Removidos os blocos de selos visuais no topo dos modulos 2 a 6 para reduzir poluicao visual e redundancia de apresentacao.
- Mantido o conteudo clinico correspondente no corpo dos modulos.
- Sincronizadas as copias espelho em `modules/`.
- Atualizados os hashes de integridade dos modulos 2 a 6.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v37`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou calculadora.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_03_ventilacao_mecanica.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_05_drogas_vasoativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Reescrita e ampliada a secao `11. Hipotensao pos-intubacao` do Modulo 2 com sintese de evidencia, janelas de risco de 30 a 60 minutos e condutas para reconhecimento/correcao precoce.
- Acrescentados topicos operacionais `Evidencia e janela de risco` e `Reconhecer em tempo real`.
- Atualizadas as listas de resposta imediata e prevencao para proxima IOT, sem incluir doses novas.
- Acrescentadas referencias primarias sobre hipotensao/colapso cardiovascular peri-intubacao: Heffner 2012, Green 2015, INTUBE/JAMA 2021, INTUBE/AJRCCM 2022, PrePARE 2019 e Tangkulpanich 2023.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 2.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v36`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo clinico interpretativo e recomendacoes operacionais de reconhecimento/correcao de hipotensao pos-IOT.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Interface
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Removido do Modulo 2 o box visual `Nota operacional` sobre diluicoes padronizaveis e concentracao customizavel, conforme solicitacao explicita.
- Mantidas as tabelas de sedoanalgesia, doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 2.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v35`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao removeu texto operacional relacionado a diluicoes/concentracoes exibido ao leitor.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Ampliada a tabela `9.1 Estrategia por cenario clinico` do Modulo 2 com as colunas `Farmaco/estrategia sugerida` e `Evidencia comparativa e desfecho`.
- Incluidas sinteses de evidencia para analgesia/sedacao pos-RSI, choque, broncoespasmo, HIC/TCE e delirium/agitação sem necessidade de sedacao profunda.
- Acrescentadas referencias primarias e estudos comparativos: MENDS, SEDCOM, MIDEX/PRODEX, MENDS2, SPICE III, Brain Trauma Foundation e estudo randomizado de cetamina em pacientes ventilados.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 2.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v34`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo clinico explicativo e interpretacao de evidencia farmacologica, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Reorganizada a secao `1. Objetivo do modulo` do Modulo 2: os blocos `Confirmar`, `Fixar` e `Estabilizar` foram reunidos em um fluxograma unico.
- Adicionada tabela abaixo do fluxograma com atitudes imediatas, parametros a observar e observacoes de seguranca para cada etapa.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 2.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v33`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao reorganizou e detalhou conteudo operacional pos-IOT conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Removido o paragrafo introdutorio/disclaimer da secao `8.1 Estrategias de intubacao — tecnica versus contexto fisiologico` do Modulo 1.
- Mantido todo o restante da secao 8.1 sem alteracoes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v32`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao removeu texto editorial/clinico introdutorio conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Aprofundada a secao `Estrategia A/B/C/D` do Modulo 1 com dois blocos expansivos: `5.4 Como usar o algoritmo A/B/C/D na via aerea critica` e `5.5 Pontos de seguranca antes de passar de um plano ao outro`.
- Organizada a logica dos Planos A, B, C e D em tabela com objetivo, acoes-chave e criterio para avancar.
- Incluidos pontos de seguranca sobre declaracao de falha, mudanca real de estrategia, capnografia, priorizacao de oxigenacao e preparacao do Plano D antes da inducao.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v31`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo clinico explicativo e operacional sobre estrategia de via aerea, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Expandida a secao `11. Complicacoes peri-intubacao` do Modulo 1 para contemplar, alem de hipotensao pos-IOT, os topicos de hipoxemia peri-IOT, intubacao esofagica/tubo mal posicionado, aspiracao peri-intubacao, awareness/paralisia consciente e colapso cardiovascular peri-IOT.
- Cada novo subtopico foi organizado com conceito, risco, prevencao e resposta pratica.
- Adicionadas referencias formais para o estudo INTUBE/JAMA 2021 e para a diretriz DAS 2025 de intubacao traqueal dificil nao antecipada.
- Mantidas doses, diluicoes, formulas, volumes, concentracoes e calculadoras existentes.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v30`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo clinico explicativo e operacional, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Adicionada coluna `Mecanismo resumido` na tabela da secao `9.2 Opioides/analgesicos e adjuvantes analgesicos` do Modulo 1.
- Adicionada linha `Mecanismo de acao` aos blocos detalhados de fentanil, remifentanil, alfentanil, sufentanil, lidocaina IV e morfina.
- Incluida lidocaina IV na tabela-resumo da secao 9.2 para alinhar a tabela com o bloco detalhado ja existente.
- Mantidas doses, diluicoes, volumes, apresentacoes, indicacoes de preferencia e alertas ja existentes.
- Atualizada a nota de fontes regulatorias para incluir alfentanil, sufentanil, morfina e lidocaina.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v29`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo farmacologico explicativo, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Organizacao
- PWA/offline

### Alteracoes realizadas

- Adicionada linha `Mecanismo de acao` aos hipnoticos/sedativos de inducao do Modulo 1: etomidato, propofol, cetamina, midazolam e tiopental.
- Mantidas doses, diluicoes, volumes, apresentacoes, indicacoes de preferencia e alertas ja existentes.
- Atualizada a nota de fontes regulatorias para incluir apoio a mecanismo de acao.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v28`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao adicionou conteudo farmacologico explicativo, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Removido do Modulo 1 o alerta `Integracao farmacologica` da secao `8.1 Estrategias de intubacao`.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v27`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao removeu conteudo explicativo clinico-textual, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Interface
- PWA/offline

### Alteracoes realizadas

- Removido do Modulo 1 o alerta `Conceito` da secao `8.1 Estrategias de intubacao`.
- Mantido o alerta subsequente de integracao farmacologica.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v26`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- Alteracao removeu conteudo explicativo clinico-textual, conforme solicitacao explicita.
- Nao houve alteracao de dose, formula, diluicao, volume calculado ou concentracao.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Navegacao
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Ajustado o sumario interno dos modulos renderizados no `ModuleViewer` para listar topicos em grade de ate 4 colunas por linha.
- Aplicado o comportamento via camada comum `iframeSafety.ts`, afetando todos os modulos sem reescrever o conteudo clinico dos HTMLs.
- Adicionadas quebras responsivas para 2 colunas e 1 coluna em telas estreitas.
- Ajustado o sumario interno aberto para ocupar menos altura visual e preservar rolagem quando necessario.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v25`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a layout, navegacao e responsividade do sumario interno dos modulos.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/utils/iframeSafety.ts`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reduzido o cabecalho do `ModuleViewer` para exibir apenas numero do modulo e titulo.
- Removido da interface o caminho tecnico `src/data/modules/...` exibido no cabecalho do modulo.
- Removido o marcador separado `Modulo X` para evitar duplicidade visual.
- Ajustado o espacamento do cabecalho do modulo para ocupar menos altura.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v24`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a interface e reducao de metadados visuais.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/components/ModuleViewer.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Conteudo editorial
- PWA/offline

### Alteracoes realizadas

- Removida do topo do Modulo 1 a linha de selos tecnicos `SVG nativo`, `Cards expansíveis`, `Fonte primaria obrigatoria`, `Sem SPIN` e `Pronto para expansao JS`.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v23`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a remocao de metadados tecnicos de interface.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Removido o texto tecnico `PWA offline-first` e a descricao do cabecalho superior da interface publica.
- Removido o badge visual `v1` do cabecalho superior.
- Reduzida a barra superior para um controle minimo contendo apenas o botao `Modulos`.
- Removido fundo, borda e sombra do cabecalho superior para reduzir ocupacao visual.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v22`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a interface e ocupacao visual.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/App.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Navegacao
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Transformado o card `Via aerea fisiologica` do bloco inicial do Modulo 1 em link interno para o item `3.3 Via aerea fisiologicamente dificil`.
- Adicionado identificador direto ao titulo `3.3 Via aerea fisiologicamente dificil`.
- Convertida a busca global em aba lateral direita recolhida, abrindo como painel sobreposto ao conteudo central.
- Ao abrir a busca global, o sumario lateral de modulos e fechado automaticamente.
- Ajustado o sumario lateral de modulos para redimensionar o conteudo central em telas com largura suficiente, evitando sobreposicao ao modulo exibido.
- Removida a coluna fixa de busca do layout principal.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v21`.

### Impacto clinico

- Sem impacto clinico.
- Alteracoes restritas a navegacao, responsividade e affordance visual.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/App.tsx`
- `src/components/SearchPanel.tsx`
- `src/styles.css`
- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Navegacao
- PWA/offline

### Alteracoes realizadas

- Transformado o card `Via aerea anatomica` do bloco inicial do Modulo 1 em link interno para a secao `2. Anatomia aplicada`.
- Adicionado estilo visual de foco/hover para indicar que o card e selecionavel.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v20`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a navegacao e affordance visual.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Conteudo editorial
- PWA/offline

### Alteracoes realizadas

- Corrigida a numeracao do bloco expansivel `Linha do tempo visual das sequencias` no Modulo 1.
- Alterado o marcador de `8.0` para `1.1`, pois o bloco esta dentro da secao `1. Introducao`.
- Sincronizada a copia espelho em `modules/`.
- Atualizado o hash de integridade do Modulo 1.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v19`.

### Impacto clinico

- Sem impacto clinico.
- Alteracao restrita a numeracao editorial de topico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `scripts/verify-module-hashes.mjs`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- PWA/offline

### Alteracoes realizadas

- Removido da interface publica o painel lateral de disclaimer/politica clinica.
- Mantida a politica clinica nos documentos internos do projeto, incluindo `README.md`, `docs/clinical-sources.md` e `docs/changelog.md`.
- Removidos estilos CSS sem uso associados ao painel `policy-panel`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v18`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/App.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Transformada a busca global em painel recolhivel, fechado por padrao.
- Adicionado botao `Abrir busca/Recolher` para expandir o buscador sob demanda.
- Mantida indicacao compacta de busca recolhida e contagem de resultados quando houver termo ativo.
- Mantido foco automatico no campo ao abrir o buscador.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v17`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/components/SearchPanel.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reposicionado o botao de minimizacao do sumario lateral principal para uma posicao flutuante na extremidade direita da barra lateral.
- Mantido o botao visivel durante a rolagem interna do sumario, reduzindo a necessidade de voltar ao topo para minimizar.
- Preservada a minimizacao por duplo clique no item do modulo.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v16`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/components/Sidebar.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Ajustado o sumario lateral principal para permanecer aberto ao clicar em um modulo ou subtopico.
- Adicionada minimizacao por botao visual com seta apontada para a esquerda.
- Adicionada minimizacao por duplo clique no item do modulo.
- Mantido fechamento automatico apenas ao selecionar resultado pela busca global.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v15`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/App.tsx`
- `src/components/Sidebar.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Tornado mais compacto o painel de apresentacao da ampola/fr. disponivel na calculadora de infusao continua do modulo 6.
- Reduzidos espacamentos, altura dos campos e tamanho do cabecalho do painel.
- Mantida grade responsiva compacta para evitar empilhamento excessivo dos campos dentro do iframe.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v14`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reorganizado o bloco `Estrategia de intubacao` do modulo 6 em cards visuais.
- Agrupados tecnica e contexto fisiologico em um card.
- Agrupados objetivo, preferir, sequencia e ajuste pelo cenario em um card.
- Isolado `Evitar/cautela` em um card proprio.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v13`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Adicionada garantia de runtime no `ModuleViewer` para injetar o menu minimizavel em qualquer modulo que carregue sem o botao `Minimizar/Menu`.
- Preservado o menu nativo dos modulos quando ja estiver presente no HTML fonte.
- Aplicada a camada de fallback aos modulos 1 a 6 via `iframeSafety`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v12`.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou conteudo medico.

### Arquivos modificados

- `src/utils/iframeSafety.ts`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Calculo
- Conteudo clinico
- PWA/offline

### Alteracoes realizadas

- Reorganizado o planejamento de solucao do modulo 6 para unir volume aspirado e solucao final em um unico box operacional.
- Incluida necessidade calculada em ampolas/frascos com uma casa decimal e solicitacao pratica em numero inteiro para farmacia.
- Substituido o box isolado de sugestao pratica por informacao integrada ao preparo da solucao.
- Unificados os blocos de dose inicial calculada e vazao calculada.
- Unificados volume consumido e necessidade para o periodo selecionado.
- Adicionado contador visual `Itens adicionados` junto aos botoes de adicao ao cenario-resumo.
- Adicionada confirmacao visual com o nome da medicacao apos inclusao no cenario-resumo.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v11`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A alteracao preserva as formulas de dose e vazao, mas modifica a apresentacao operacional do preparo e a exibicao de necessidade fracionada/solicitacao inteira de ampolas.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Replicado para os modulos 2, 3, 4 e 5 o padrao de menu interno minimizavel ja aplicado aos modulos 1 e 6.
- Adicionado botao `Minimizar/Menu` no painel lateral interno de cada modulo.
- Mantidos os atalhos dos paineis como menus selecionaveis para redirecionamento as secoes correspondentes.
- Adicionado estado visual do item de menu ativo em todos os modulos 2 a 5.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v10`.
- Atualizados os hashes esperados dos modulos 2 a 5.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou conteudo medico.

### Arquivos modificados

- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_03_ventilacao_mecanica.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_05_drogas_vasoativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Padronizado o bloco `Preparo operacional estruturado` do modulo 6 para todos os itens adicionados ao cenario-resumo.
- Aplicada a mesma organizacao visual usada no planejamento de infusao continua aos itens de IOT, DVA continua e bolus/push-dose.
- Separados preparo/apresentacao, dose, massa/tempo, volume/vazao, calculo operacional e faixa terapeutica em caixas proprias quando esses dados ja estao disponiveis no item calculado.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v9`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao, recomendacao ou texto medico.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Tornado minimizavel o painel lateral interno do modulo 1, replicando o comportamento do modulo 6.
- Mantidos os atalhos do painel como menus selecionaveis para redirecionamento as secoes correspondentes do modulo.
- Adicionado estado visual do item de menu ativo no modulo 1.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v8`.
- Atualizado hash esperado do modulo 1.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, recomendacao ou conteudo medico.

### Arquivos modificados

- `src/data/modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_01_via_aerea_iot.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reformatado o planejamento de solucao das infusoes do modulo 6 em caixas separadas por parametro operacional.
- Destacados visualmente apresentacao, sugestao pratica, volume aspirado, solucao final, dose, vazao, consumo em 24h, necessidade total e resultado por hora.
- Aplicadas cores de preenchimento diferentes para facilitar leitura rapida sem alterar calculos, doses, concentracoes ou textos operacionais.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v7`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou recomendacao.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Conteudo clinico
- PWA/offline

### Alteracoes realizadas

- Reorganizados os resultados das medicacoes do modulo 6 em cartoes visuais: operacional, farmacocinetica/faixa, cenario e cuidados/seguranca.
- Destacados apresentacao, calculo operacional, volume a aspirar/administrar e concentracao usada nos resultados das calculadoras.
- Adicionados banners de cenario com cores para adequacao/atencao quando a avaliacao puder ser derivada dos textos ja existentes no modulo.
- Mantida a sugestao de substituto/alternativa usando textos de sugestao ja presentes em `scenarioNotes`, sem reescrever doses ou formulas.
- Aplicado o padrao aos resultados de IOT, DVA em bolus, DVA continua e infusao continua.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v6`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- REQUER REVISAO MEDICA.
- A alteracao nao modifica doses, formulas, diluicoes ou calculos, mas adiciona classificacao visual de adequacao/atencao por cenario a partir dos textos existentes.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Tornado minimizavel o painel lateral interno do modulo 6.
- Mantidos os atalhos do painel como menus selecionaveis para redirecionamento as secoes correspondentes do modulo.
- Adicionado estado visual do item de menu ativo no modulo 6.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v5`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Interface
- Responsividade
- PWA/offline

### Alteracoes realizadas

- Reorganizada a navegacao lateral para exibir as secoes do modulo ativo logo abaixo do respectivo modulo.
- Removido o bloco separado de secoes que aparecia ao final do sumario lateral.
- Adicionado recuo visual para diferenciar secoes internas do modulo ativo.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v4`.

### Impacto clinico

- Sem impacto clinico.

### Arquivos modificados

- `src/components/Sidebar.tsx`
- `src/styles.css`
- `public/sw.js`
- `docs/changelog.md`

## 2026-05-19

### Tipo de alteracao

- Conteudo clinico
- Calculo
- Interface
- Organizacao
- Documentacao
- PWA/offline

### Alteracoes realizadas

- Integrada a pasta revisada `MÓDULO 1-6_REVISAO_2026-05-19` como pacote v33.
- Atualizados os HTMLs canonicos dos modulos 1 a 6 em `src/data/modules/`.
- Atualizadas as copias legadas correspondentes em `modules/`.
- Atualizados assets legados em `assets/css/manual.css` e `assets/js/manual-library.js`.
- Adicionado `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_v33.html`.
- Atualizados os HTMLs autonomos de compatibilidade `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo.html` e `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_codex.html`.
- Atualizados `build_manifest.json`, `docs/auditoria/build_manifest.json`, `docs/module_versions.json`, `README.md` e `docs/implementation-notes.md`.
- Preservada a PWA React/Vite/TypeScript, incluindo `package.json`, `src/App.tsx`, componentes, testes e configuracao de build.
- Reaplicado o destaque visual no modulo 6 para sugestao pratica, volume aspirado e diluente/solucao final.
- Incrementada a versao do cache do service worker para `guia-intensiva-pwa-v3`.
- Atualizados hashes esperados dos modulos.

### Impacto clinico

- REQUER REVISAO MEDICA.
- O pacote v33 altera conteudo clinico e calculadoras em multiplos modulos, incluindo referencias recolhiveis e ajustes do modulo 6.
- O Codex nao reescreveu doses, formulas, diluicoes ou recomendacoes por conta propria; integrou a revisao autoral e manteve rastreabilidade.

### Arquivos modificados

- `assets/css/manual.css`
- `assets/js/manual-library.js`
- `build_manifest.json`
- `docs/auditoria/build_manifest.json`
- `docs/changelog.md`
- `docs/codex_prompt.md`
- `docs/implementation-notes.md`
- `docs/module_versions.json`
- `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo.html`
- `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_codex.html`
- `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_v33.html`
- `modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_02_pos_intubacao_confirmacao.html`
- `modules/modulo_03_ventilacao_mecanica.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_05_drogas_vasoativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `README.md`
- `scripts/verify-module-hashes.mjs`
- `src/data/modules/modulo_01_via_aerea_iot.html`
- `src/data/modules/modulo_02_pos_intubacao_confirmacao.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `src/data/modules/modulo_06_calculadoras_interativas.html`

## 2026-05-18

### Tipo de alteracao

- Interface
- Responsividade

### Alteracoes realizadas

- Destacada visualmente a "Sugestao pratica" no planejamento de preparo do modulo 6.
- Destacados os trechos de volume aspirado e diluente/volume final nas linhas operacionais de preparo.
- Aplicado o mesmo realce no painel da calculadora de infusao e no resumo operacional de preparo.
- Incrementada a versao do cache do service worker para forcar atualizacao da PWA.
- Sincronizada a copia canonica `src/data/modules/` com a copia legada `modules/`.
- Atualizado hash esperado do modulo 6.

### Impacto clinico

- Sem impacto clinico.
- Nao houve alteracao de dose, formula, diluicao, volume calculado, concentracao ou recomendacao.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `public/sw.js`
- `scripts/verify-module-hashes.mjs`
- `docs/changelog.md`

## 2026-05-18

### Tipo de alteracao

- Correção de bug
- Build

### Alteracoes realizadas

- Adicionado `vite.config.mjs`.
- Atualizados scripts npm para usar `--config vite.config.mjs --configLoader native`, evitando falha de carregamento de config pelo esbuild em ambiente Windows/OneDrive.
- Gerado `package-lock.json` apos `npm install`.
- Confirmado build estatico em `dist/`.

### Impacto clinico

- Sem impacto clinico.

### Arquivos modificados

- `package.json`
- `package-lock.json`
- `vite.config.mjs`
- `docs/changelog.md`

## 2026-05-18

### Tipo de alteracao

- Conteudo clinico
- Calculo
- Interface
- Responsividade
- Organizacao
- Documentacao

### Alteracoes realizadas

- Integrada a pasta revisada `MÓDULO 1-6_REVISAO_AUTOR` sem sobrescrever a arquitetura React/Vite/TypeScript.
- Atualizados os HTMLs canonicos dos modulos 1, 3, 4, 5 e 6 em `src/data/modules/`.
- Atualizadas as copias legadas correspondentes em `modules/`.
- Mantido o modulo 2 inalterado por hash.
- Atualizados `assets/css/manual.css` e `assets/js/manual-library.js` para a biblioteca estatica legada.
- Adicionados `docs/developer_notes.md`, `docs/module_versions.json`, `docs/auditoria/build_manifest.json` e `src/data/medications/README.medications.json`.
- Adicionado `src/styles/manual.css` como referencia de estilo do pacote estatico.
- Atualizados os HTMLs autonomos `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo.html` e `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_codex.html`.
- Atualizados metadados de modulo em `src/data/moduleSources.ts`.
- Atualizados `build_manifest.json`, `README.md`, `docs/implementation-notes.md` e hashes esperados em `scripts/verify-module-hashes.mjs`.

### Impacto clinico

- REQUER REVISAO MEDICA.
- O pacote revisado altera conteudo clinico e calculadoras em multiplos modulos, incluindo medicacoes, doses, sedoanalgesia, drogas vasoativas, ventilacao e calculadoras.
- O Codex nao reescreveu formulas, doses ou recomendacoes por conta propria; integrou a revisao autoral fornecida e preservou a rastreabilidade.

### Arquivos modificados

- `assets/css/manual.css`
- `assets/js/manual-library.js`
- `build_manifest.json`
- `docs/auditoria/build_manifest.json`
- `docs/changelog.md`
- `docs/developer_notes.md`
- `docs/implementation-notes.md`
- `docs/module_versions.json`
- `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo.html`
- `manual_medicina_intensiva_modulos_1_6_consolidado_autonomo_codex.html`
- `modules/modulo_01_via_aerea_iot.html`
- `modules/modulo_03_ventilacao_mecanica.html`
- `modules/modulo_04_manutencao_sedoanalgesia.html`
- `modules/modulo_05_drogas_vasoativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `package.template.json`
- `README.md`
- `scripts/verify-module-hashes.mjs`
- `service-worker.js`
- `src/data/medications/README.medications.json`
- `src/data/moduleSources.ts`
- `src/data/modules/modulo_01_via_aerea_iot.html`
- `src/data/modules/modulo_03_ventilacao_mecanica.html`
- `src/data/modules/modulo_04_manutencao_sedoanalgesia.html`
- `src/data/modules/modulo_05_drogas_vasoativas.html`
- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `src/styles/manual.css`

## 2026-05-18

### Tipo de alteracao

- Conteudo clinico
- Calculo
- Interface
- Responsividade

### Alteracoes realizadas

- Substituido o modulo 6 pelo arquivo revisado fornecido pelo autor: `modulo_06_calculadoras_interativas_revisado_v10_planejamento_legivel.html`.
- Atualizada a copia canonica da PWA em `src/data/modules/modulo_06_calculadoras_interativas.html`.
- Atualizada a copia da pasta `modules/modulo_06_calculadoras_interativas.html` para manter compatibilidade com a estrutura legada.
- Atualizado o hash esperado do modulo 6 em `scripts/verify-module-hashes.mjs`.
- Atualizado `build_manifest.json` com o novo tamanho do modulo 6 e recomendacao de compartilhamento da PWA.
- Mantida a camada React/PWA sem reescrever o conteudo medico.

### Impacto clinico

- REQUER REVISAO MEDICA.
- O modulo revisado inclui ajustes em medicacoes/calculadoras e conteudo farmacologico fornecidos pelo autor.
- O Codex nao alterou doses, formulas, diluicoes ou recomendacoes por conta propria; apenas incorporou o HTML revisado recebido.

### Arquivos modificados

- `src/data/modules/modulo_06_calculadoras_interativas.html`
- `modules/modulo_06_calculadoras_interativas.html`
- `scripts/verify-module-hashes.mjs`
- `build_manifest.json`
- `docs/changelog.md`

## 2026-05-18

### Tipo de alteracao

- Interface
- Responsividade
- Organizacao
- PWA/offline
- Testes
- Documentacao

### Alteracoes realizadas

- Criada aplicacao React + Vite + TypeScript com `base: './'`.
- Preservados os HTMLs clinicos canonicos em `src/data/modules/`.
- Criado `ModuleViewer` para renderizacao dos modulos via `iframe srcDoc`.
- Criada navegacao lateral por modulo e secao.
- Criada busca global por texto extraido dos modulos.
- Adicionado manifesto PWA e service worker offline-first.
- Mantida entrada `legacy/` para consulta da versao estatica anterior.
- Criada pasta futura `src/features/calculators/`.
- Adicionada camada de interface em tempo de execucao para bloquear pares dose/vazao conhecidos sem alterar formulas.
- Criados testes minimos para PBW, concentracao, dose para vazao, vazao para dose, campos invalidos e bloqueio dose/vazao simultaneo.
- Criada documentacao de fontes clinicas e notas de implementacao.

### Impacto clinico

- Sem impacto clinico.
- Nenhuma dose, diluicao, formula, limite clinico, texto de alerta ou recomendacao medica foi alterada nos HTMLs fonte.
- A camada de dose/vazao atua apenas em estado de interface no iframe.

### Arquivos modificados

- `index.html`
- `manifest.webmanifest`
- `icon.svg`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `README.md`
- `legacy/index.html`
- `public/icon.svg`
- `public/manifest.webmanifest`
- `public/sw.js`
- `src/App.tsx`
- `src/main.tsx`
- `src/registerServiceWorker.ts`
- `src/styles.css`
- `src/components/ModuleViewer.tsx`
- `src/components/SearchPanel.tsx`
- `src/components/Sidebar.tsx`
- `src/data/clinicalSources.ts`
- `src/data/moduleSources.ts`
- `src/features/calculators/README.md`
- `src/features/calculators/audit.ts`
- `src/types.ts`
- `src/utils/iframeSafety.ts`
- `src/utils/modules.ts`
- `src/utils/route.ts`
- `src/utils/search.ts`
- `src/utils/text.ts`
- `scripts/calculator-tests.mjs`
- `scripts/verify-module-hashes.mjs`
- `tests/calculator-tests.html`
- `docs/clinical-sources.md`
- `docs/changelog.md`
- `docs/implementation-notes.md`
