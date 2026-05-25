# Regras do projeto Manual de Medicina Intensiva

Este arquivo é o ponto de entrada que o Claude Code (e qualquer agente do Anthropic)
deve consultar antes de mexer em conteúdo clínico, deploy ou Stripe/Clerk.

## 1. Regra clínica obrigatória

Não modificar doses, diluições, fórmulas, limites clínicos, textos de alerta ou recomendações
médicas sem solicitação explícita do usuário. Qualquer alteração clínica deve ser registrada
em `docs/changelog.md` marcada como **`REQUER REVISAO MEDICA`**.

O papel técnico é melhorar estrutura, interface, responsividade, validação, organização modular,
testes e rastreabilidade — preservando a lógica clínica validada nos HTMLs canônicos.

## 2. Workflow de revisão dos módulos (uso no Vite Dev)

O arquivo de trabalho local é **[`docs/REVISAO_MODULOS.md`](docs/REVISAO_MODULOS.md)**.
Esse é o arquivo que o usuário edita rapidamente para anotar pendências por módulo e marcar o
que já foi revisado.

**Antes de mexer em conteúdo de qualquer módulo**:

1. Ler `docs/REVISAO_MODULOS.md` para entender o que está em revisão, o que foi aprovado e
   o que está em backlog. Se o item ainda não estiver listado, propor adicioná-lo antes de
   mexer no HTML.
2. Confirmar com o usuário se a mudança é puramente técnica (interface, responsividade,
   acessibilidade, refator de código) ou se toca em conteúdo clínico. Se for clínica, exigir
   instrução explícita por escrito.

**Durante a edição**:

3. Editar diretamente o arquivo canônico em `src/data/modules/modulo_XX_*.html`. O Vite Dev
   recarrega via HMR. Modos de preview local (todos em porta 5173):
   - `http://localhost:5173/?preview=modulos` — **recomendado para revisão**: 6 módulos
     em iframes isolados com TOC lateral. Sem Clerk. Componente:
     `src/components/ReviewAllModules.tsx`.
   - `http://localhost:5173/?preview=landing` — apenas a landing, sem Clerk.
   - `http://localhost:5173` — app completo (exige Clerk, só funciona no domínio
     `manualvirtus.com.br` em produção).
4. Se o usuário ainda não está com o Vite Dev rodando, instruir: `npm run dev` (porta 5173).
   O preview pode também rodar via `npm run preview` ou Wrangler em `8788` se quiser testar
   Functions.

**Após a edição**:

5. Atualizar o status do item em `docs/REVISAO_MODULOS.md` (de `[ ]`/`[~]` para `[x]` com
   data e responsável).
6. Rodar `npm run verify:modules`. Ele vai falhar com o novo hash — copiar o hash exibido
   e atualizar `scripts/verify-module-hashes.mjs` no campo correspondente.
7. Registrar a mudança em `docs/changelog.md`. Se for clínica, marcar como
   `REQUER REVISAO MEDICA`.
8. Só rodar build/deploy depois de 5–7 concluídos.

## 3. Workflow de deploy (Cloudflare Pages)

Variáveis exigidas no build (Vite):

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
```

Variáveis exigidas em runtime nas Functions (Secrets na Cloudflare):

```
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_1TZf0zAIon1Sw6HssZDB0ZPO
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manualvirtus.com.br
```

Quando rodar `npm run build` localmente, **sempre** setar `VITE_CLERK_PUBLISHABLE_KEY` no
shell antes — senão o bundle sai sem a chave e a produção quebra com
"Clerk ainda não configurado". O CI da Cloudflare Pages lê do painel automaticamente, então
o melhor caminho é commitar e deixar o CI buildar; deploy direto via
`wrangler pages deploy dist` só com o ambiente correto setado.

## 4. Stripe — fluxo atual

- Landing usa o **Payment Link** `https://buy.stripe.com/14AeVc0vS66vgVKeJB3gk01` (one-time
  R$ 29,99 da fase fundadora) para os botões "Acesso fundador" / "Garantir acesso fundador"
  / "Quero meu acesso fundador".
- A Function `/api/create-checkout-session` continua existindo (modo subscription com
  `STRIPE_PRICE_ID`) para uso por usuários já logados sem assinatura ativa, via `AuthGate`.
- Webhook em `https://manualvirtus.com.br/api/stripe-webhook` atualiza
  `publicMetadata.subscriptionStatus` no Clerk.

## 4b. Regra de ordenação dos módulos

Ordem fixa, válida para o estado atual e para qualquer expansão futura:

1. **Módulos clínicos** ocupam as primeiras posições (atualmente 1–6).
2. **Módulo de Calculadoras interativas** é **sempre o antepenúltimo** (atualmente Mod 7).
3. **Módulo de Referências consolidadas** é **sempre o último** (atualmente Mod 8), reunindo a
   bibliografia primária de todos os módulos clínicos.

Ao adicionar novo módulo clínico, inseri-lo antes do par Calculadoras + Referências
(esses dois recuam uma posição cada e os arquivos são renomeados via `git mv` para refletir
a nova numeração). Os slugs de rota (`modulo-NN`) seguem a posição absoluta, não o tema —
manter conexão `slug ↔ posição` ao renomear.

## 5. Landing page

- Componente: `src/components/AuthGate.tsx` → função `SignedOutScreen`. Renderiza só quando
  o usuário está deslogado.
- CSS: `src/styles.css` (classes prefixadas `.landing-*`, `.virtus-logo*`, `.demo-*`).
- Logos oficiais ficam em `public/virtus-logo/` (transparentes, alpha real). Não voltar a usar
  os arquivos antigos `virtus-logo.png` / `virtus-icon-only.png` / `virtus-clinical-sem-fundo.png`
  (todos têm fundo opaco e estão deprecados).
- Modo `?preview=landing` (em `src/main.tsx`) bypass a `ClerkProvider` para preview local
  sem precisar do Clerk Live. Útil para iterar a landing no `localhost:5173`.

## 5b. Capa/Home interna (pós-login)

- Componente: `src/components/ModuleHome.tsx`. Primeira tela do usuário logado.
- Rota: `#/home` (ou hash vazio). Implementado em `src/utils/route.ts` via
  `AppRoute.view: "home" | "module"`. Em `src/App.tsx`, branch entre `<ModuleHome />` e
  `<ModuleViewer />`.
- Layout: hero à esquerda (~38%) com logo + título + lead + CTA "Começar pelo Módulo 1",
  grid à direita (~62%) com 8 cards compactos (ícone SVG custom + label "MÓDULO N" + título).
  Tema dark uniforme (paleta `#081726` → `#0a1d2e` no grid; `#0d2438` → `#123c69` no hero;
  acentos `#12bed1` / `#30f1e6`).
- Ao adicionar novo módulo, atualizar `MODULE_ICONS` em `ModuleHome.tsx` (novo SVG) e
  `familyOf()` se a posição mudar a categoria visual (clinico/calc/ref).
- Sidebar tem botão **"Início"** no topo (estado ativo quando `route.view === "home"`).

## 6. Permissões / segurança

- Não commitar sem pedido explícito.
- Não rodar `wrangler pages deploy` sem autorização explícita do usuário para o deploy
  específico.
- Não rodar `wrangler pages secret put` / `delete` sem confirmar com o usuário o nome e o
  ambiente (production/preview).
- Não modificar nameservers, DNS, billing ou rotacionar chaves sem ordem explícita.
- Não instalar pacotes npm não declarados em `package.json` sem pedir autorização.

## 7. Convenções

- Idioma do código: português, com acentuação completa em textos visíveis ao usuário.
- Não usar emojis em arquivos do projeto a menos que o usuário peça.
- Não criar documentação `.md` nova sem o usuário pedir (este arquivo, `REVISAO_MODULOS.md`
  e changelog são exceções já estabelecidas).
- Nomes de marca preservados: **Virtus**, **Clinical Tools**, **Manual de Medicina Intensiva**,
  **Virtus - Serviços Médicos** (com hífen simples).
