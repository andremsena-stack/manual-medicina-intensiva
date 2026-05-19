# Calculadoras

No v1, as calculadoras clinicas existentes permanecem dentro dos HTMLs aprovados em `src/data/modules/` e rodam no `ModuleViewer`.

Esta pasta fica reservada para futuras calculadoras React. Qualquer migracao deve:

- preservar formulas, doses, diluicoes, limites e textos de alerta;
- registrar mudancas em `docs/changelog.md`;
- marcar como `REQUER REVISAO MEDICA` se houver qualquer alteracao clinica;
- manter testes minimos para dose, vazao, concentracao, PBW e validacao.
