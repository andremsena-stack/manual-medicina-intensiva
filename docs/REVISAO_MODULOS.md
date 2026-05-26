# Revisão dos módulos clínicos

Arquivo local de trabalho. Use para anotar pendências de revisão clínica, ajustes de interface
e otimizações por módulo antes de gerar deploy.

> **Como usar no dia a dia**
>
> 1. Abrir o Vite Dev: `npm run dev` (porta 5173). Modos de preview disponíveis sem login:
>    - **`http://localhost:5173/?preview=modulos`** — revisão integral: os 6 módulos
>      empilhados em iframes isolados, com TOC lateral para pular entre eles. Recomendado
>      para esta revisão.
>    - `http://localhost:5173/?preview=landing` — apenas a landing page.
>    - `http://localhost:5173` — app completo (exige login Clerk, só funciona no domínio
>      `manualvirtus.com.br` em produção).
> 2. Editar o HTML canônico em `src/data/modules/modulo_XX_*.html`. O Vite recarrega o
>    iframe correspondente via HMR — basta salvar.
> 3. Marcar o item revisado abaixo. Trocar `[ ]` por `[x]` e adicionar data + observação.
> 4. Antes do deploy: rodar `npm run verify:modules` para ver o novo hash; atualizar
>    `scripts/verify-module-hashes.mjs` com o hash novo e registrar a mudança em
>    `docs/changelog.md`.
>
> **Regra clínica obrigatória**: doses, diluições, fórmulas, limites e textos de alerta só
> podem mudar com revisão médica explícita registrada no changelog como `REQUER REVISAO MEDICA`.

## Convenções

- **Status**: `[ ]` pendente · `[~]` em revisão · `[x]` aprovado para produção.
- **Prioridade**: `P0` bloqueia deploy · `P1` deve sair antes do lançamento comercial · `P2` melhoria contínua.
- **Tipo**: `clínico` (requer revisão médica) · `interface` · `cálculo` · `texto` · `acessibilidade`.

---

## Módulo 1 — Via aérea e intubação orotraqueal

`src/data/modules/modulo_01_via_aerea_iot.html`

- [ ] **P_** _Tipo_ — descrição do item. _(data: ____ · responsável: ____)_

## Módulo 2 — Pós-intubação e confirmação

`src/data/modules/modulo_02_pos_intubacao_confirmacao.html`

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 3 — Ventilação mecânica invasiva

`src/data/modules/modulo_03_ventilacao_mecanica.html`

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 4 — Manutenção de sedoanalgesia

`src/data/modules/modulo_04_manutencao_sedoanalgesia.html`

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 5 — Drogas vasoativas

`src/data/modules/modulo_05_drogas_vasoativas.html`

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 6 — Distúrbios hidroeletrolíticos

`src/data/modules/modulo_06_disturbios_hidroeletroliticos.html`

Sódio, potássio, fósforo, magnésio e cálcio: cada distúrbio é seção recolhível
com Hipo/Hiper como sub-collapsibles (recolhidos por padrão). Conteúdo clínico
preservado verbatim da versão Mod 7 anterior — apenas reestruturado em colapsos.

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 7 — Calculadoras interativas

`src/data/modules/modulo_07_calculadoras_interativas.html`

Calculadoras presentes:

- Bólus para IOT
- Bólus / dose intermitente (sem reposição de eletrólitos)
- **Reposição de eletrólitos** (seção dedicada §4 — KCl/MgSO₄/gluconato Ca/CaCl₂/fosfato K)
- Infusão contínua (DVA + sedativos + analgesia + diuréticos + antiarrítmicos + anticonvulsivantes + broncodilatadores)
- PBW (peso predito)
- Cenários clínicos (cenário-resumo)

Pendências:

- [ ] **P_** _Tipo_ — descrição do item.

## Módulo 8 — Caderno de questões

`src/data/modules/modulo_08_caderno_questoes.html`

Caderno com **70 questões de múltipla escolha** (10 por módulo de origem: Mod 1–6 +
Mod 7) com perfil **clínico-aplicado** (15% Lembrar, 20% Compreender, 35% Aplicar,
25% Analisar, 5% Avaliar). Cada questão tem alternativas A–D, gabarito recolhível
via `<details>`, justificativa de 50–100 palavras, conceito testado e tag Bloom.

Criado em 2026-05-26 como módulo penúltimo (entre Mod 7 Calculadoras e Mod 9
Referências), respeitando a regra de ordenação fixa.

- [ ] **P1** _clínico_ — **REQUER REVISAO MEDICA** das 70 questões (gabarito e justificativas)
      antes do lançamento comercial.
- [ ] **P2** _interface_ — confirmar render no `?preview=app` e no `?preview=modulos`.
- [ ] **P2** _texto_ — revisar consistência de Bloom labels entre questões.

## Módulo 9 — Referências consolidadas

`src/data/modules/modulo_09_referencias.html` (renomeado de `modulo_08_*` em 2026-05-26).

Reúne a bibliografia primária dos módulos clínicos, organizada por módulo de origem.
Criado em 2026-05-21 a partir das seções `<section id="referencias">` extraídas dos
módulos 1–6 (mini-blocos contextuais `.ref` permanecem nos módulos originais).

**Regra de ordenação dos módulos**: o módulo de Calculadoras interativas é sempre
o antepenúltimo; o Caderno de questões é o penúltimo; as Referências consolidadas
são sempre o último módulo. Ao adicionar novos módulos clínicos, intercalá-los
antes do bloco Calculadoras + Caderno + Referências.

- [ ] **P2** _texto_ — revisar se há referências duplicadas que devem ser deduplicadas.
- [ ] **P2** _interface_ — confirmar render no `?preview=app` e no `?preview=modulos`.

---

## Itens transversais (não específicos de um módulo)

- [ ] **P2** acessibilidade — auditar contraste e foco nos detalhes recolhíveis dos 6 módulos.
- [ ] **P2** interface — padronizar tabelas de doses entre módulos 4 e 5.
- [ ] **P1** cálculo — gerar testes de regressão para todas as calculadoras (`npm run test:calculators`)
      cobrindo casos limítrofes antes do lançamento comercial.

---

## Log de revisões aprovadas

> Move itens daqui para o changelog (`docs/changelog.md`) quando o status virar `[x]`.
> Mantém histórico local enquanto a mudança ainda não foi deployada.

- _(vazio)_
