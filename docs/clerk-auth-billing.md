# Clerk Auth + Stripe Billing

## Objetivo

Adicionar controle comercial ao Manual Interativo de Medicina Intensiva:

- login por Clerk;
- assinatura mensal por Stripe Checkout;
- liberacao de acesso por status de assinatura salvo no `public_metadata` do usuario Clerk;
- portal Stripe para o assinante gerenciar cartao, faturas e cancelamento;
- webhook Stripe para sincronizar criacao, atualizacao e cancelamento de assinatura.

## Variaveis de ambiente

Configure no Cloudflare Pages em `Settings > Environment variables`.

### Frontend (publicas)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
```

`VITE_STRIPE_CHECKOUT_URL` permanece apenas como fallback opcional de desenvolvimento; em producao o botao `Assinar agora` chama `POST /api/create-checkout-session`.

### Backend / Functions (secrets)

```env
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_1TZf0zAIon1Sw6HssZDB0ZPO
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manualvirtus.com.br
```

Nunca exponha `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ou `STRIPE_PRICE_ID` com prefixo `VITE_`.

## Configuracao no Clerk

1. Criar uma aplicacao no Clerk.
2. Ativar os metodos de login desejados.
3. Copiar a publishable key para `VITE_CLERK_PUBLISHABLE_KEY`.
4. Copiar a secret key para `CLERK_SECRET_KEY`.
5. Conferir o dominio de producao em URLs permitidas.

## Configuracao no Stripe

1. Criar um produto para a assinatura do manual.
2. Criar um preco recorrente mensal.
3. Copiar o `price_...` para `STRIPE_PRICE_ID` (atualmente `price_1TZf0zAIon1Sw6HssZDB0ZPO`).
4. Ativar o Customer Portal em Billing.
5. Criar um endpoint de webhook:

```text
https://manual-medicina-intensiva.pages.dev/api/stripe-webhook
```

Eventos recomendados:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

6. Copiar o signing secret `whsec_...` para `STRIPE_WEBHOOK_SECRET`.

## Como o app libera acesso

1. `src/main.tsx` inicializa `ClerkProvider`.
2. `src/components/AuthGate.tsx` exige login.
3. Depois do login, o frontend le `user.publicMetadata.subscriptionStatus` e `user.publicMetadata.stripeSubscriptionStatus`.
4. Se qualquer um estiver como `active`, o manual e liberado.
5. Sem assinatura ativa, o usuario ve o botao `Assinar agora`.
6. O botao chama `POST /api/create-checkout-session`, que cria a sessao Stripe usando `STRIPE_PRICE_ID`, `client_reference_id = clerkUserId`, `metadata.clerkUserId` e o email do usuario, e redireciona para o Checkout retornado.
7. O Stripe chama `/api/stripe-webhook`, que atualiza o `public_metadata`.
8. O usuario pode abrir o Portal Stripe por `/api/create-portal-session`, quando houver `stripeCustomerId`.

## Rotas criadas

- `GET /api/subscription-status`: valida token Clerk e retorna status de assinatura.
- `POST /api/create-checkout-session`: cria assinatura mensal no Stripe Checkout.
- `POST /api/create-portal-session`: abre Portal do Cliente Stripe para uma conta ja vinculada.
- `POST /api/stripe-webhook`: valida assinatura do Stripe e sincroniza status no Clerk.

## Protecao real do conteudo

Esta camada restringe a experiencia de uso e o acesso normal ao PWA. Como os HTMLs ainda sao empacotados no bundle estatico, um usuario tecnico poderia inspecionar os arquivos publicados.

Antes do lancamento comercial definitivo, a protecao forte deve mover os modulos para entrega por backend protegido:

- armazenar HTMLs fora do bundle publico;
- validar token Clerk em Function/Worker;
- checar assinatura no backend antes de entregar o modulo;
- rever a estrategia offline para cache autorizado por usuario.

## Restricao de um dispositivo/sessao

A restricao de uma conexao simultanea nao deve ficar no frontend. A etapa robusta exige backend com `CLERK_SECRET_KEY` para:

1. identificar sessao e usuario atuais;
2. registrar dispositivo/sessao ativa;
3. revogar ou bloquear sessoes excedentes;
4. exibir aviso quando a conta ja estiver ativa em outro dispositivo.

Essa regra deve ser implementada antes do lancamento comercial se o contrato de assinatura exigir uso individual estrito.
