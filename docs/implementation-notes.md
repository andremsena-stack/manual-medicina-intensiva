# Notas de implementacao

## Decisoes tecnicas

- A PWA foi criada na propria pasta `MÓDULO 1-6`.
- O build usa `base: './'` para funcionar em hospedagem estatica com subpasta.
- Os HTMLs clinicos permanecem como fonte canonica em `src/data/modules/`.
- O React importa esses HTMLs como texto bruto com `?raw`.
- O `ModuleViewer` usa `iframe srcDoc`, preservando scripts, estilos e calculadoras legadas dos modulos.
- A busca global usa `DOMParser` no navegador para extrair secoes e texto indexavel.
- O service worker usa cache local dos assets visitados e nao depende de CDN.

## Conteudo clinico

- Nenhum HTML clinico foi reescrito.
- Nao houve alteracao de dose, diluicao, formula, limite, alerta ou recomendacao.
- A politica obrigatoria foi documentada em `README.md`, `docs/clinical-sources.md` e `docs/changelog.md`.
- Fontes locais foram referenciadas em vez de copiadas para `/Source`, conforme o plano.
- Em 2026-05-18, o pacote `MÓDULO 1-6_REVISAO_AUTOR` foi integrado como revisao autoral dos modulos 1, 3, 4, 5 e 6, mantendo a PWA React/Vite.
- A revisao autoral foi registrada no changelog como `REQUER REVISAO MEDICA`.
- Em 2026-05-19, o pacote `MÓDULO 1-6_REVISAO_2026-05-19` foi integrado como v33 com referencias recolhiveis em todos os modulos, mantendo a PWA React/Vite.

## Calculadoras

- Calculadoras legadas continuam dentro dos HTMLs.
- A camada `src/utils/iframeSafety.ts` identifica pares conhecidos de dose/vazao e bloqueia o campo oposto quando um modo esta ativo.
- Essa camada nao altera constantes, textos clinicos nem formulas; atua apenas no DOM carregado pelo iframe.
- Futuras calculadoras React devem morar em `src/features/calculators/`.

## Rastreabilidade

- `scripts/verify-module-hashes.mjs` guarda os hashes SHA-256 esperados dos seis HTMLs canonicos.
- Qualquer alteracao nos HTMLs fonte fara a verificacao falhar.
- `scripts/calculator-tests.mjs` cobre funcoes genericas usadas como regressao minima de calculadoras.

## Limitacoes conhecidas

- A verificacao visual completa depende de instalar dependencias e rodar o servidor Vite.
- O service worker funciona em `localhost` ou hospedagem HTTPS; navegadores nao registram service worker em `file://`.
