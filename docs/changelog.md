# Changelog

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
