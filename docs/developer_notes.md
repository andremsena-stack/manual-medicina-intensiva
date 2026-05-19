# Notas de arquitetura para o Codex

## Decisão atual
Este kit preserva cada módulo como HTML isolado porque cada arquivo contém CSS, detalhes/menus recolhíveis e, no Módulo 6, JavaScript de calculadoras.

## Regra de segurança
Não converter as calculadoras diretamente para React sem teste matemático. Primeiro criar testes de regressão usando exemplos do HTML.

## Módulo 6
Contém calculadoras de:
- bólus para IOT;
- DVA;
- infusão contínua;
- planejamento de ampolas/frascos e bolsas;
- PBW;
- cenários clínicos;
- estratégias de IOT.

## Ordem sugerida de refatoração
1. Layout/navegação.
2. Busca.
3. Viewer dos módulos.
4. Extração de dados do Módulo 6.
5. Componentes de calculadora.
6. Testes.
7. Offline/PWA.
