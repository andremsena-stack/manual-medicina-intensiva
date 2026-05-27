# Notas de implementação

Convenções técnicas estabelecidas. Visão geral arquitetural em
[`../AGENTS.md`](../AGENTS.md); workflows clínicos em
[`./REVISAO_MODULOS.md`](./REVISAO_MODULOS.md).

## Convenções de build e empacotamento

- PWA reside na própria pasta do projeto (raiz do repositório).
- `vite.config.mjs` usa `base: './'` para o build funcionar em
  hospedagem estática com subpasta ou em domínio próprio.
- Os HTMLs clínicos canônicos ficam em `src/data/modules/` e são
  importados como texto bruto via `?raw` em
  `src/data/moduleSources.ts`.
- `ModuleViewer` usa `<iframe srcDoc>`, preservando scripts, estilos
  e calculadoras legadas dos módulos.
- Busca global usa `DOMParser` no navegador para extrair seções e
  texto indexável a partir dos HTMLs carregados.
- Service worker (`public/sw.js`, registrado por
  `src/registerServiceWorker.ts`) faz cache local dos assets visitados
  e não depende de CDN.

## Política clínica

- Nenhum HTML clínico foi reescrito sem registro em
  [`changelog.md`](changelog.md).
- Alterações de doses, diluições, fórmulas, limites, alertas ou
  recomendações exigem solicitação explícita e marcação
  `REQUER REVISAO MEDICA` no changelog.
- Fontes clínicas locais ficam referenciadas em
  [`clinical-sources.md`](clinical-sources.md), não copiadas para o repo.

## Calculadoras

- Calculadoras legadas continuam dentro do HTML do **Módulo 7 —
  Calculadoras interativas**. Módulo 7 também concentra cálculos de
  reposição de eletrólitos (transferidos do Mod 6 atual Distúrbios).
- A camada [`src/utils/iframeSafety.ts`](../src/utils/iframeSafety.ts)
  identifica pares conhecidos de dose/vazão e bloqueia o campo oposto
  quando um modo está ativo.
- Essa camada **não altera** constantes, textos clínicos ou fórmulas;
  atua apenas no DOM carregado pelo iframe.
- Futuras calculadoras React devem morar em
  `src/features/calculators/` com testes mínimos em
  `scripts/calculator-tests.mjs`.

## Rastreabilidade

- `scripts/verify-module-hashes.mjs` guarda os hashes SHA-256
  esperados dos 9 HTMLs canônicos.
- Qualquer alteração nos HTMLs fonte fará a verificação falhar — force
  atualização explícita do hash e registro em
  [`changelog.md`](changelog.md).

## Limitações conhecidas

- Verificação visual completa depende de instalar dependências e rodar
  o Vite dev (`npm run dev`) com os modos de preview ([`../AGENTS.md`](../AGENTS.md) §8).
- Service worker requer `localhost` ou hospedagem HTTPS; navegadores
  não registram service worker em `file://`.
- Conteúdo clínico ainda viaja no bundle estático — proteção forte
  requer migração futura para entrega via Function/Worker. Detalhe em
  [`clerk-auth-billing.md`](clerk-auth-billing.md) (seção "Proteção
  real do conteúdo").
