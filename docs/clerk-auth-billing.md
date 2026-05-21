# Clerk Auth + Stripe Billing

## Objetivo

Adicionar controle comercial ao Manual Interativo de Medicina Intensiva:

- login por Clerk;
- assinatura mensal por Stripe Checkout;
- liberacao de acesso por status de assinatura salvo no `private_metadata` do usuario Clerk;
- portal Stripe para o assinante gerenciar cartao, faturas e cancelamento;
- webhook Stripe para sincronizar criacao, atualizacao e cancelamento de assinatura.

## Variaveis de ambiente

Configure no Cloudflare Pages em `Settings > Environment variables`.

### Frontend

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
```

### Backend / Functions

```env
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manual-medicina-intensiva.pages.dev
```

Nunca exponha `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY` ou `STRIPE_WEBHOOK_SECRET` com prefixo `VITE_`.

## Configuracao no Clerk

1. Criar uma aplicacao no Clerk.
2. Ativar os metodos de login desejados.
3. Copiar a publishable key para `VITE_CLERK_PUBLISHABLE_KEY`.
4. Copiar a secret key para `CLERK_SECRET_KEY`.
5. Conferir o dominio de producao em URLs permitidas.

## Configuracao no Stripe

1. Criar um produto para a assinatura do manual.
2. Criar um preco recorrente mensal.
3. Copiar o `price_...` para `STRIPE_MONTHLY_PRICE_ID`.
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
3. Depois do login, o frontend chama `/api/subscription-status` com token Clerk.
4. A Function valida o token com `@clerk/backend`.
5. A Function consulta o `private_metadata` do usuario no Clerk.
6. Se `stripeSubscriptionStatus` estiver em `STRIPE_ALLOWED_STATUSES`, o manual e liberado.
7. Sem assinatura ativa, o usuario ve o botao `Assinar mensalmente`.
8. O checkout e criado por `/api/create-checkout-session`.
9. O Stripe chama `/api/stripe-webhook`, que atualiza o `private_metadata`.
10. O usuario pode abrir o Portal Stripe por `/api/create-portal-session`.

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
