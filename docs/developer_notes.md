# Notas de arquitetura

Notas curtas para quem entra no projeto. Visão geral completa em
[`../AGENTS.md`](../AGENTS.md).

## Decisão de preservar HTMLs canônicos

Cada módulo continua como HTML isolado em `src/data/modules/` porque o
arquivo contém CSS próprio, detalhes/menus recolhíveis e (no módulo 7)
JavaScript de calculadoras. `ModuleViewer` renderiza via
`<iframe srcDoc>` preservando o conteúdo verbatim.

## Regra de segurança das calculadoras

Não converter calculadoras (Mod 7) diretamente para React sem criar
antes testes de regressão a partir de exemplos do HTML. Constantes
clínicas e fórmulas não podem mudar.

Futuras calculadoras React (se vierem) devem morar em
`src/features/calculators/` com testes em `scripts/calculator-tests.mjs`.

## Lista atual dos módulos

Fonte de verdade canônica: [`../src/data/moduleSources.ts`](../src/data/moduleSources.ts).
Lista resumida e regra de ordenação em [`../AGENTS.md`](../AGENTS.md) §4.

## Iframe safety

`src/utils/iframeSafety.ts` injeta camada de runtime no iframe de cada
módulo:

- pager prev/next entre módulos;
- colapso configurável de sections;
- bloqueio mútuo dose ↔ vazão nas calculadoras (entrada ativa
  bloqueia a outra; ao limpar, ambas ficam disponíveis).

A camada **não altera** constantes, textos clínicos ou fórmulas — atua
apenas no DOM carregado pelo iframe.

## Rastreabilidade

`scripts/verify-module-hashes.mjs` guarda hashes SHA-256 esperados dos
9 HTMLs canônicos. Qualquer alteração de fonte clínica faz a
verificação falhar — força atualização explícita do hash e registro em
`changelog.md`.

## Ordem sugerida pra refatorações futuras

1. Layout/navegação (sidebar, search, viewer).
2. Extração de dados do módulo 7 (calculadoras) para módulos React.
3. Componentes de calculadora isolados.
4. Testes de regressão por calculadora.
5. Reforço da camada PWA/offline (cache autorizado por usuário antes
   da expansão comercial).
