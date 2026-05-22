# Changelog

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
