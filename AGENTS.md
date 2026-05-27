# AGENTS.md

> **Ponto único de entrada para qualquer agente de IA.** Lê este arquivo primeiro,
> depois desce pros documentos específicos referenciados no [§9 Índice de docs](#9-índice-de-docs).
> Não duplica conteúdo: cada fato está em um lugar só.

---

## 0. Por onde começar

| Você é | Comece em |
|---|---|
| **Claude Code** (rodando como agente local) | [`CLAUDE.md`](CLAUDE.md) — regras operacionais (não-commitar, deploy gate, regra clínica) |
| **Outro agente IA** (ChatGPT, Gemini, Codex, etc.) | Este arquivo, segue lendo |
| **Humano dev novo** | [`README.md`](README.md) (overview rápido) → este arquivo |

---

## 1. O que é o produto

**Manual de Medicina Intensiva** (`manualvirtus.com.br`) — PWA pago para médicos
intensivistas. Capítulos clínicos + calculadoras interativas + caderno de questões +
referências consolidadas, acessível offline após primeiro login.

- **Marca**: Virtus — Clinical Tools (Virtus - Serviços Médicos como entidade)
- **Modelo comercial**: assinatura recorrente (Mensal R$ 25,99 · Trimestral R$ 63,99 ·
  Anual R$ 199,99) + acesso fundador vitalício (legado, ver [`docs/changelog.md`](docs/changelog.md))
- **Domínio prod**: `https://manualvirtus.com.br`
- **Domínio fallback**: `https://manual-medicina-intensiva.pages.dev`

---

## 2. Tech stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Estilo | CSS (sem framework) — `src/styles.css` (~80KB) |
| Tipografia | **Inter Tight** self-hosted via `@fontsource/inter-tight` |
| Animações | `framer-motion`, `gsap` (carregamento lazy onde possível) |
| Auth | **Clerk** (instância live `clerk.manualvirtus.com.br`) |
| Pagamento | **Stripe** (modo subscription recorrente) |
| Hospedagem | **Cloudflare Pages** (estático + Functions) |
| Backend | **Cloudflare Pages Functions** (`functions/api/*.ts`) |
| PWA | service worker (`service-worker.js` + `public/sw.js`) |
| Analytics | `src/utils/analytics.ts` — camada neutra (dataLayer/PostHog/Mixpanel) |

**Não usar**: nenhum CSS framework (Tailwind, MUI etc.), nenhum state manager (Redux, Zustand),
nenhuma lib de fetching (TanStack Query) — o app é simples o suficiente pra `useState` + `fetch` puro.

---

## 3. Estrutura de arquivos (essencial)

```
.
├── AGENTS.md                       ← você está aqui
├── CLAUDE.md                       ← regras operacionais Claude Code
├── README.md                       ← overview humano (pode estar com fatos legados)
├── index.html                      ← Vite entry
├── package.json                    ← deps + scripts
├── vite.config.mjs                 ← build config
├── functions/
│   ├── _shared.ts                  ← helpers (Clerk + Stripe)
│   └── api/
│       ├── create-checkout-session.ts   ← cria sessão Stripe (mode=subscription)
│       ├── create-portal-session.ts     ← abre Customer Portal Stripe
│       ├── stripe-webhook.ts            ← recebe eventos Stripe → atualiza Clerk
│       └── subscription-status.ts       ← endpoint de status pro frontend
├── src/
│   ├── main.tsx                    ← root + ClerkProvider + modos de preview
│   ├── App.tsx                     ← roteamento hash + layout (Sidebar/Search/ModuleViewer)
│   ├── components/
│   │   ├── AuthGate.tsx            ← SignedOutScreen (landing), SignedInAccessGate (paywall), PaywallOverlay
│   │   ├── ModuleHome.tsx          ← capa/home pós-login (antes de abrir módulo)
│   │   ├── ModuleViewer.tsx        ← renderiza HTML do módulo em iframe srcDoc
│   │   ├── Sidebar.tsx             ← TOC dos módulos
│   │   ├── SearchPanel.tsx         ← busca global (Ctrl+K)
│   │   ├── HeroSpline3D.tsx        ← elemento visual da landing
│   │   ├── InstallPrompt.tsx       ← prompt PWA
│   │   └── ReviewAllModules.tsx    ← modo de revisão (DEV only)
│   ├── data/
│   │   ├── moduleSources.ts        ← lista canônica dos 9 módulos (ordem + título)
│   │   ├── modules/                ← HTMLs clínicos (1 arquivo por módulo)
│   │   ├── clinicalSources.ts      ← refs clínicas
│   │   └── medications/            ← dados de medicações
│   ├── utils/
│   │   ├── analytics.ts            ← track(event, props) neutro
│   │   ├── iframeSafety.ts         ← injeção segura no iframe dos módulos (collapse, pager, dose/vazão)
│   │   ├── modules.ts              ← createModuleRecords (parsing HTML → metadata)
│   │   ├── route.ts                ← parseHashRoute / routeToHash
│   │   ├── search.ts               ← busca em texto dos módulos
│   │   ├── text.ts                 ← helpers de string
│   │   └── imageProcessing.ts      ← processamento de logos (remoção de halo, etc.)
│   ├── styles.css                  ← TODOS os estilos do app (paywall, landing, app, módulos wrapper)
│   ├── types.ts                    ← tipos compartilhados
│   └── registerServiceWorker.ts
├── public/                         ← assets estáticos (logos em /virtus-logo/, ícones)
├── scripts/
│   ├── verify-module-hashes.mjs    ← validador de integridade dos HTMLs clínicos
│   └── *.py                        ← utilitários de processamento de assets (CSS, SVG, imagens)
└── docs/                           ← ver §9
```

---

## 4. Os 9 módulos

Fonte canônica: [`src/data/moduleSources.ts`](src/data/moduleSources.ts).
HTMLs em [`src/data/modules/`](src/data/modules/).

| # | Título | Tipo |
|---|---|---|
| 1 | Via aérea e intubação orotraqueal | Clínico |
| 2 | Pós-intubação e confirmação | Clínico |
| 3 | Ventilação mecânica invasiva | Clínico |
| 4 | Manutenção de sedoanalgesia em UTI | Clínico |
| 5 | Drogas vasoativas em medicina intensiva | Clínico |
| 6 | Distúrbios hidroeletrolíticos | Clínico |
| 7 | Calculadoras interativas | Ferramenta |
| 8 | Caderno de questões | Avaliação (70 questões) |
| 9 | Referências consolidadas | Bibliografia |

### Regra de ordenação fixa (não-negociável)

1. **Módulos clínicos** ocupam as primeiras posições.
2. **Calculadoras interativas** sempre antepenúltimo.
3. **Caderno de questões** sempre penúltimo.
4. **Referências consolidadas** sempre último.

Ao adicionar novo módulo clínico: insere entre os clínicos e o trio
Calc + Caderno + Refs (que recua uma posição cada). Renomeia os arquivos via
`git mv` e atualiza `moduleSources.ts` + hashes em
`scripts/verify-module-hashes.mjs`.

### Como cada módulo renderiza

`ModuleViewer.tsx` injeta o HTML cru via `<iframe srcDoc={html} sandbox="allow-same-origin allow-scripts">`.
Em runtime, `src/utils/iframeSafety.ts` aplica camada de segurança (pager, colapso de seções,
bloqueio mútuo dose↔vazão nas calculadoras) **sem alterar fórmulas ou constantes clínicas**.

---

## 5. Fluxo auth + paywall (resumo)

```
Landing (SignedOutScreen)
   ↓ CTA "Quero meu acesso fundador" / "Entrar"
Clerk modal (SignUp ou SignIn)
   ↓ cadastro instantâneo (verificação por email DESLIGADA — ver §7)
SignedInAccessGate lê user.publicMetadata.subscriptionStatus
   ├── "active" / "trialing" → App liberado
   └── outro → Paywall overlay sobre App
                ├── Sidebar e busca seguem interativos
                ├── Painel central com pointer-events: none
                ├── Carrossel "Veja por dentro" rotando 9 módulos (iframes read-only)
                └── CTA "Concluir pagamento — R$ X" → /api/create-checkout-session
                                                          ↓
                                                  Stripe Checkout (mode=subscription)
                                                          ↓
                                                  Pagamento OK → Stripe redirect
                                                          ↓
                                                  /?checkout=success → user.reload() em polling
                                                          ↓
                                                  Webhook /api/stripe-webhook recebe
                                                  checkout.session.completed
                                                          ↓
                                                  Atualiza publicMetadata Clerk
                                                  → paywall destrava automaticamente
```

**Detalhes de implementação**: [`src/components/AuthGate.tsx`](src/components/AuthGate.tsx).
**Setup Stripe/Clerk passo-a-passo**: [`docs/clerk-auth-billing.md`](docs/clerk-auth-billing.md)
*(observação: doc descreve o setup base; o modelo recorrente Mensal/Trimestral/Anual
foi introduzido depois — fonte de verdade no código de `AuthGate.tsx` + `moduleSources.ts`)*.

---

## 6. Cloudflare Pages Functions

Todas em `functions/api/`. Compartilham helpers em `functions/_shared.ts`
(Clerk API, Stripe API, env var requirement, JWT validation).

| Endpoint | Método | Auth | Propósito |
|---|---|---|---|
| `/api/subscription-status` | GET | Bearer Clerk JWT | Retorna status da assinatura do user atual |
| `/api/create-checkout-session` | POST | Bearer Clerk JWT | Cria Stripe Checkout session (mode=subscription) com `client_reference_id={userId}` |
| `/api/create-portal-session` | POST | Bearer Clerk JWT | Abre Customer Portal Stripe (só funciona com `stripeCustomerId` no metadata) |
| `/api/stripe-webhook` | POST | Stripe signature | Recebe eventos, valida assinatura, atualiza Clerk metadata |

**Eventos webhook tratados**:
- `checkout.session.completed` → marca `subscriptionStatus: "active"` no Clerk
- `customer.subscription.updated` → atualiza status
- `customer.subscription.deleted` → marca como inativo

**Padrão de identificação Clerk user no webhook**:
1. `session.client_reference_id` (passado pelo Payment Link / Checkout)
2. fallback `session.metadata.clerkUserId`
3. fallback final `findClerkUserIdByEmail(env, email)` (frágil, evitar)

---

## 7. Regras críticas (resumo de CLAUDE.md)

> Fonte de verdade completa: [`CLAUDE.md`](CLAUDE.md). Abaixo é só o que NÃO pode
> passar sem você ler.

1. **Conteúdo clínico é imutável sem ordem explícita**. Doses, diluições, fórmulas,
   limites, textos de alerta só mudam com solicitação registrada no changelog como
   `REQUER REVISAO MEDICA`. O papel técnico é melhorar estrutura/UI/responsividade
   **preservando a lógica clínica validada**.
2. **Workflow de revisão clínica**: ler [`docs/REVISAO_MODULOS.md`](docs/REVISAO_MODULOS.md)
   antes de editar qualquer módulo. Editar o HTML canônico, rodar
   `npm run verify:modules`, atualizar hash em `scripts/verify-module-hashes.mjs`,
   registrar em `docs/changelog.md`.
3. **Secrets nunca com prefixo `VITE_`**. `VITE_*` vai pro bundle do browser
   (público). Secrets ficam no Cloudflare Pages Settings → Variables and Secrets
   como **Secret** (encrypted), não Plaintext.
4. **Deploy é manual**. Commit + push só com ordem explícita do humano. Push pro
   `main` dispara CI da Cloudflare Pages → build → deploy. Não rodar
   `wrangler pages deploy` ou `wrangler pages secret put/delete` sem autorização.
5. **Verificação Clerk por código de email está DESLIGADA em prod** (decisão de
   conversão). Cadastro vai direto pro paywall. Mudança no painel Clerk Live,
   sem alterar código.

---

## 8. Workflows de desenvolvimento

### Setup local

```bash
npm install
# cria .env.local pra Vite (frontend pk_test_/dev keys)
cp .env.example .env.local && $EDITOR .env.local
# cria .dev.vars pra Wrangler (backend sk_test_/dev keys)
$EDITOR .dev.vars
```

### Comandos principais

```bash
npm run dev               # Vite dev (porta 5173, HMR)
npm run build             # build estático em dist/
npm run preview           # serve dist/ local
npm run verify:modules    # valida hashes dos HTMLs clínicos
npm run test:calculators  # testes das calculadoras (quando existirem)

# Para testar Cloudflare Functions localmente:
npx wrangler pages dev dist --port 8788    # após npm run build
```

### Modos de preview (dev-only, removidos do bundle prod)

Acessar via query string em `http://localhost:5173/`:

| URL | O que renderiza | Quando usar |
|---|---|---|
| `/` (sem query) | App completo (precisa Clerk) | Desenvolvimento normal |
| `/?preview=landing` | `SignedOutScreen` isolada, sem Clerk | Iterar copy/visual da landing |
| `/?preview=app` | App standalone sem Clerk | Iterar navegação/sidebar/busca |
| `/?preview=modulos` | 9 módulos em iframes empilhados (TOC lateral) | Revisão clínica de todos os módulos |
| `/?preview=paywall` | App + paywall overlay sem Clerk | Iterar visual do paywall/carrossel |

Esses modos são gateados por `import.meta.env.DEV` em `src/main.tsx` — o bundler
remove o código no build de produção, então não há risco de expor conteúdo pago.

### Deploy

```bash
git push origin main         # dispara CI Cloudflare Pages
```

CI builda automaticamente (`npm install` + `npm run build`) e publica o `dist/` resultante.
Deploy completo em ~2-5 min. Verificação:

```bash
# bundle novo no ar?
curl -s https://manualvirtus.com.br/ | grep -oE 'index-[A-Za-z0-9_-]+\.(js|css)'
```

---

## 9. Índice de docs

> Cada item lista a fonte de verdade do tópico. Se houver conflito entre docs,
> o item desta lista vence — atualizar o doc no próximo passe.

| Tópico | Doc canônico |
|---|---|
| Regras operacionais Claude Code | [`CLAUDE.md`](CLAUDE.md) |
| Overview humano (entry point) | [`README.md`](README.md) |
| Workflow revisão dos módulos | [`docs/REVISAO_MODULOS.md`](docs/REVISAO_MODULOS.md) |
| Histórico de mudanças (REQUER REVISAO MEDICA) | [`docs/changelog.md`](docs/changelog.md) — append-only |
| Setup Clerk + Stripe | [`docs/clerk-auth-billing.md`](docs/clerk-auth-billing.md) |
| Setup domínio + DNS + env vars prod | [`docs/DEPLOY_MANUALVIRTUS.md`](docs/DEPLOY_MANUALVIRTUS.md) |
| Fontes clínicas (refs primárias) | [`docs/clinical-sources.md`](docs/clinical-sources.md) |
| Decisões de arquitetura | [`docs/developer_notes.md`](docs/developer_notes.md) |
| Convenções de build/PWA/iframe | [`docs/implementation-notes.md`](docs/implementation-notes.md) |
| Auditoria clínica histórica | `docs/auditoria/` (arquivo) |

---

## 10. Dicas pra agentes (lições aprendidas)

- **Não confiar em prints/cache** quando depurar Clerk metadata — usar curl direto
  na Clerk API:
  ```powershell
  curl.exe -H "Authorization: Bearer sk_live_..." https://api.clerk.com/v1/users/user_XXX
  ```
  Dashboard Clerk tem cache stale; API retorna o estado real.
- **Wrangler local + Stripe CLI**: webhook só chega se `stripe listen --forward-to`
  estiver rodando E Wrangler estiver de pé. Em Windows usar `127.0.0.1` no
  `--forward-to` (IPv6 `::1` quebra com Wrangler que escuta IPv4).
- **Bundle prod tem hash no nome**. Pra confirmar deploy: comparar hash atual
  com anterior. Se mudou, CI completou.
- **PowerShell `curl` ≠ curl real**. Em Windows, usar `curl.exe` ou
  `Invoke-RestMethod -Headers @{...}`.
- **Webhook returns 200 mesmo sem encontrar user** (silent fail no fallback de
  email). Se metadata não atualizou após pagamento, checar `client_reference_id`
  no event payload e existência do user na instância Clerk certa (live vs dev).
- **Logos deprecados** em `public/virtus-*.png` (root, sem subfolder): não voltar
  a usar. Os oficiais estão em `public/virtus-logo/`.
- **`marketing/`** é diretório local de ativos visuais (Instagram, meta-ads).
  Não vai pro repo.

---

## 11. Saúde do projeto (snapshot)

| Métrica | Valor |
|---|---|
| Branch principal | `main` |
| Tests automáticos | ⚠️ ainda não criados (`npm run test:calculators` placeholder) |
| Lint | ⚠️ não configurado (`tsc --noEmit` é o gate atual) |
| CI provider | Cloudflare Pages (auto on push) |
| Stripe webhook prod ativo | `we_1TZuKMAnI7zzun0R6BS2kt7W` → `manualvirtus.com.br/api/stripe-webhook` |
| Clerk live | instância `clerk.manualvirtus.com.br` |
| Modos de pricing live | Mensal · Trimestral · Anual + fundador vitalício (legado) |

---

Se algo neste arquivo estiver desatualizado, prefira propor uma atualização aqui
em vez de criar um novo `.md`. **Manter um único índice canônico vence ter cinco
docs parciais.**
