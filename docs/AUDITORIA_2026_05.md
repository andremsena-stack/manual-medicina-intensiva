# Auditoria 2026-05 — Cleanup backlog do Manual Virtus

**Data**: 27/05/2026
**Contexto**: auditoria de arquitetura e descoberta de bug crítico de PWA durante a
sessão de revisão de layout dos módulos web do Manual Virtus (branch
`fix/largura-modulo-web`). Achados consolidados a partir das tasks de dispatch
executadas neste working dir.
**Status**: documento **informativo**. Não aplicar nenhuma correção descrita aqui
sem autorização explícita do owner. Serve de roteiro para limpezas futuras.

---

## 1. Bug crítico em produção: PWA "Não consegui carregar o app"

### Sintoma

Em iOS PWA instalado (modo standalone), a tela de fallback aparece para uma fração
dos usuários:

> "Não consegui carregar o app / Recarregar e limpar cache"

O botão de limpar cache **não resolve** — o usuário continua preso no fallback até
desinstalar e reinstalar o PWA.

### Causa raiz

Drift entre dois arquivos de configuração do Vite. O projeto tem **dois**
arquivos `vite.config.*`, e o script de build só lê **um** deles:

| Arquivo | `base` declarado | Lido pelo build? |
|---|---|---|
| `vite.config.mjs` (linha 5) | `"./"` (relativo) | **SIM** — `package.json` script `build` usa `--config vite.config.mjs` |
| `vite.config.ts` (linha 12) | `"/"` (absoluto, com comentário "FIX CRITICO") | **NÃO** — nenhum script o referencia |

O commit `943b1eb` ("FIX CRITICO: vite base ./ -> /") foi aplicado **apenas no
arquivo `.ts`**, que o build ignora. O bundle de produção continua sendo gerado
com paths relativos.

### Cadeia do erro em produção (iOS PWA standalone)

1. `dist/index.html` referencia `./assets/index-XXX.js` (relativo, porque `base: "./"`).
2. Em PWA standalone com Service Worker interceptando a navegação, o browser
   resolve `./assets/x` como `/assets/assets/x` (path duplicado).
3. 404 no asset → SW devolve `index.html` como fallback de navegação.
4. O JS chega ao `<script type="module">` com MIME `text/html` → o module
   loader rejeita e não executa.
5. React nunca monta em `#root`.
6. O timeout de 4s definido em `index.html:185-193` dispara → a tela de
   fallback aparece.

### Fix proposto (NÃO aplicado nesta task)

- **`vite.config.mjs` linha 5**: trocar `base: "./"` por `base: "/"`.
- **`public/sw.js` linha 6**: bumpar `CACHE_NAME` de `guia-intensiva-pwa-v64`
  para `v65` — invalida o cache em clientes que já têm o SW antigo instalado
  e força fetch do novo bundle.
- **Deploy**: via Cloudflare Pages no merge para `main`.

### Cleanup candidato

- **Remover `vite.config.ts`** (não é lido por nenhum script — é código morto
  que apenas semeia confusão), **ou** padronizar em um único arquivo
  `vite.config.{ts|mjs}` e excluir o outro, para eliminar o risco de drift
  futuro entre os dois.

---

## 2. Arquitetura de layout dos módulos web

Insight estrutural observado durante o trabalho do header bottom mobile na
branch `fix/largura-modulo-web`.

### Onde vivem os triggers de TOC e Busca

Os botões flutuantes de "abrir TOC" e "abrir Busca" **não estão dentro do
iframe** do módulo — são componentes React no shell externo:

| Arquivo | Papel |
|---|---|
| `src/App.tsx` linhas 113-129 | Renderiza `.module-menu-trigger` e o trigger de busca |
| `src/components/SearchPanel.tsx` | Painel da busca |
| `src/styles.css` | Estilos dos triggers e media queries responsivas |
| `src/utils/iframeSafety.ts` | **Não renderiza nada** — apenas reserva espaço dentro do iframe (via padding no `<body>`) para que o conteúdo do módulo não fique escondido atrás dos triggers que pairam sobre o iframe |

### Implicações

- Qualquer mudança visual nos triggers exige editar **três** arquivos
  (`App.tsx`, `styles.css`, `iframeSafety.ts`). Mudança local não existe.
- A reserva de padding é feita ao longo de **toda a altura** do iframe,
  embora os triggers só ocupem uma faixa fina mid-height — desperdício de
  área útil.
- Hoje, em mobile, a reserva é de **86px horizontais** (36 esq + 50 dir).
  Em viewport 414px isso deixa a coluna útil de leitura em **276px**.
- A substituição feita na branch `fix/largura-modulo-web` (header bottom de
  44px) elimina a reserva lateral e amplia a coluna útil para **382px** no
  mesmo viewport de 414px.

### Cleanup candidato

- Revisar `iframeSafety.ts` **depois** do merge do header bottom: os blocos
  que calculam e aplicam padding **lateral** no body do iframe podem virar
  dead code se a barra inferior cobrir os dois breakpoints (mobile e
  desktop). Manter apenas o padding inferior necessário para a barra.

---

## 3. Service Worker — histórico de versionamento

Evolução do `CACHE_NAME` em `public/sw.js`:

| Versão | Mudança principal |
|---|---|
| v57 | Adoção da estratégia stale-while-revalidate |
| v62 | (não documentado neste working dir — investigar no log) |
| v63 | (não documentado neste working dir — investigar no log) |
| v64 | Migração para estratégia **network-first** (commit `bf31ec1`, motivação: evitar bundle-hash-mismatch após deploy) |
| **v65 (proposto)** | Invalidação forçada para clientes legacy depois do fix do `base` do Vite (ver §1) |

### Cleanup candidato

- Adicionar comentário no topo do `public/sw.js` documentando: (a) a
  estratégia atual de cache, (b) a política de quando bumpar a versão,
  (c) um pequeno changelog inline das mudanças relevantes (estratégias e
  fixes críticos), para evitar bumps esquecidos ou bumps desnecessários.

---

## 4. Estado do working copy — arquivos pré-existentes não tratados

Snapshot de `git status` antes das modificações desta sessão. Estes itens
não foram tocados nesta task — são pendências herdadas que precisam de
decisão posterior.

### Modificados, não commitados

```
.claude/settings.local.json
CLAUDE.md
dist/index.html
dist/manifest.webmanifest
dist/sw.js
node_modules/.package-lock.json
package.json
package-lock.json
src/components/AuthGate.tsx
src/styles.css           (bloco .hero-spline-3d modificado antes de hoje)
src/utils/iframeSafety.ts
```

### Untracked

```
.claude/                                              (várias entradas)
marketing/carrossel-convite-app/
marketing/carrossel-divulgacao/
marketing/carrossel-landing-aligned/
marketing/carrossel-nova-fase/
marketing/instagram-carrossel-funcoes/
marketing/instagram-carrossel-fundador/
marketing/meta-ads-virtus/
marketing/meta-ads/ad_b_oferta_1x1.png
marketing/meta-ads/ad_b_oferta_1x1.py
marketing/meta-ads/lancamento-assinatura/__pycache__/  (já commitado em outra branch — só lixo de cache Python aqui)
marketing/post-funcoes-atuais/
marketing/reel-lancamento-30s/
marketing/remotion-story/
marketing/story-nova-fase/
public/virtus-clinical-sem-fundo.png                  (logo deprecada — ver CLAUDE.md §5)
public/virtus-icon-only.png                            (logo deprecada)
public/virtus-logo.png                                 (logo deprecada)
src/components/HeroSpline3D.tsx                        (componente novo, sem commit nem uso atual?)
```

### Cleanup candidato

Passar um pente fino no working copy:

- **`.gitignore`**: adicionar `dist/`, `node_modules/.package-lock.json`,
  `__pycache__/`, e considerar `.claude/settings.local.json`.
- **`.claude/`**: decidir o que entra no repo (configs compartilhadas de
  agente) e o que é local-only.
- **Logos deprecadas em `public/`**: confirmar com o owner e remover
  (`virtus-clinical-sem-fundo.png`, `virtus-icon-only.png`, `virtus-logo.png`)
  — o CLAUDE.md §5 já marca como deprecadas.
- **`src/components/HeroSpline3D.tsx`**: identificar se está sendo usado
  em algum lugar; se não, decidir entre commitar (uso futuro planejado)
  ou remover.
- **Marketing untracked**: cada subpasta deve ter destino claro
  (committar, mover, ignorar).

---

## 5. Branches ativas

| Branch | Estado | Descrição |
|---|---|---|
| `feat/meta-ads-refactor-iphone` | Pushed, aguarda PR | Refactor + iPhone mockup do pacote Meta Ads lançamento-assinatura |
| `fix/largura-modulo-web` | Local | Header bottom mobile + max-width 900px desktop nos módulos web |
| `fix/pwa-vite-base-path` | **Proposta, ainda não criada** | Fix do bug crítico §1 (vite base + SW v65) |
| `docs/auditoria-2026-05` | Local (esta task) | Este documento |

### Cleanup candidato

- Depois de mergear cada branch para `main`, deletar local **e** remota.
- Não deixar branch zombie acumulando.
- Confirmar com o owner antes de qualquer `git branch -D`.

---

## 6. Backlog priorizado

| Prioridade | Item | Notas |
|---|---|---|
| **CRÍTICO** | Aplicar fix do PWA — `vite.config.mjs` base + SW v65 (§1) | Bug em produção, afeta conversão e onboarding mobile |
| **ALTA** | Remover ou unificar `vite.config.ts` (§1) | Elimina risco de drift futuro |
| **MÉDIA** | Revisar `iframeSafety.ts` após merge do header bottom (§2) | Padding lateral pode virar dead code |
| **MÉDIA** | Pente fino em `git status`: gitignore, `.claude/`, `settings.local.json`, logos deprecadas (§4) | Higiene do repo |
| **BAIXA** | Documentar `sw.js` — estratégia + política de bump (§3) | Evita futuros bumps esquecidos |
| **BAIXA** | Consolidar branches mergeadas (§5) | Limpeza periódica |

---

## 7. Decisões pendentes do owner

Itens que dependem de autorização ou direcionamento antes de avançar:

- **Fix do PWA (§1)**: autorizado a abrir a branch `fix/pwa-vite-base-path`
  e aplicar o patch? Pendente.
- **Branch `fix/largura-modulo-web`**: mergear agora ou só depois de revisar
  no preview em iOS real?
- **Cleanup do `vite.config.ts`**: deletar de vez, ou renomear/manter como
  variante experimental? Pendente.
- **Logos deprecadas em `public/`**: remover do filesystem ou só do bundle?

---

### Atualização 27/05 — Dead code identificado em iframeSafety.ts

Após merge de `fix/largura-modulo-web`, os seguintes blocos ficam obsoletos:

- Arquivo: `src/utils/iframeSafety.ts`
- Linha aproximada: 540-546 (especificamente 543-545)
- Bloco:

  ```css
  @media (max-width: 767px) {
    body  {
      font-size: 15px !important;
      line-height: 1.65 !important;
      /* Reserva espaço para os triggers fixos do shell parent: TOC à esquerda (32px) + folga 4px = 36px; busca à direita (38px) + folga 12px = 50px */
      padding-left: 36px !important;
      padding-right: 50px !important;
    }
    ...
  }
  ```

- Motivo: triggers laterais foram movidos pra header bottom; reserva de
  padding lateral (36px esquerda / 50px direita) não é mais necessária.
  O body do iframe pode voltar a usar padding lateral simétrico (provável
  16px/16px) ou herdar o padding do `main`.

Único ponto no arquivo que faz essa reserva — `grep` por
`trigger|shell parent|36px|50px` confirma. Outros pontos do arquivo
(`padding-left: 22px` em `.timeline`, `padding-left: 14px`, etc.) são
recuos internos de elementos clínicos, não reserva pros triggers.

Cleanup futuro: depois de validar visualmente no preview que a header
bottom funciona em todos os módulos, remover esses blocos.

---

*Documento gerado em 27/05/2026 a partir dos achados de dispatch da sessão
de revisão de layout. Atualizar conforme itens forem resolvidos.*
