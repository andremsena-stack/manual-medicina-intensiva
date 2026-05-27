# Clerk Auth + Stripe Billing

Detalhes operacionais de Clerk e Stripe. Conceito geral e fluxo
end-to-end estão em [`../AGENTS.md`](../AGENTS.md) §5 (fluxo auth + paywall)
e §6 (Functions).

## Modelo comercial atual

- **Assinatura recorrente** em três planos: Mensal · Trimestral · Anual.
- **Acesso fundador vitalício** (legado de lançamento, registrado no
  `public_metadata` de quem comprou na fase one-time R$ 29,99).
- Liberação por `user.publicMetadata.subscriptionStatus = "active"`
  (ou `"trialing"`) — gate em [`src/components/AuthGate.tsx`](../src/components/AuthGate.tsx).

## Variáveis de ambiente

Configurar no Cloudflare Pages em `Settings → Variables and Secrets`.

### Frontend (Plaintext, expostas no bundle do browser)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
```

### Backend (Secret / Encrypted, lidas pelas Functions)

```env
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...          # default fallback; o frontend envia o priceId do plano escolhido
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manualvirtus.com.br
```

**Nunca prefixar com `VITE_`** as secrets backend — `VITE_*` vai pro bundle público.

Os `priceId`s dos planos atuais (Mensal/Trimestral/Anual) ficam no frontend
em `src/components/AuthGate.tsx` (constante `PLANS`) — são públicos por design.

## Setup no Clerk

1. Aplicação no Clerk Dashboard.
2. Métodos de login: email + senha (verificação por código **desligada**
   em prod — decisão de conversão).
3. `VITE_CLERK_PUBLISHABLE_KEY` ← publishable key live.
4. `CLERK_SECRET_KEY` ← secret key live.
5. Domínio de produção: `manualvirtus.com.br` em Domains/Origins.

## Setup no Stripe

1. Produtos:
   - "Manual de Medicina Intensiva — Mensal" (preço recorrente mensal)
   - "Manual de Medicina Intensiva — Trimestral" (preço recorrente trimestral)
   - "Manual de Medicina Intensiva — Anual" (preço recorrente anual)
2. Copiar cada `price_...` pra constante `PLANS` em `AuthGate.tsx`.
3. **Customer Portal**: ativar em Billing → Customer portal.
4. **Webhook endpoint**:

   ```text
   https://manualvirtus.com.br/api/stripe-webhook
   ```

   Eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. Copiar o signing secret `whsec_...` do endpoint para `STRIPE_WEBHOOK_SECRET`.

## Como o app libera acesso (resumo)

Fluxo completo com diagrama em [`../AGENTS.md`](../AGENTS.md) §5. Em uma linha:

cadastro Clerk → SignedInAccessGate → checa `publicMetadata.subscriptionStatus`
→ se inativo, paywall com Stripe Checkout do plano → webhook escreve
`active` no Clerk → paywall destrava (polling com `user.reload()`).

## Endpoints Cloudflare Functions

Documentados em [`../AGENTS.md`](../AGENTS.md) §6.

Resumo:
- `GET /api/subscription-status` — status atual do user logado
- `POST /api/create-checkout-session` — cria Stripe Checkout (mode=subscription)
- `POST /api/create-portal-session` — Customer Portal (precisa `stripeCustomerId`)
- `POST /api/stripe-webhook` — recebe eventos, atualiza Clerk metadata

## Proteção real do conteúdo (pendente de melhoria)

Esta camada restringe a experiência de uso. Como os HTMLs clínicos
ainda são empacotados no bundle estático, um usuário técnico pode
inspecionar os arquivos publicados.

Antes da expansão comercial, a proteção forte deve mover os módulos
para entrega por backend protegido:

- armazenar HTMLs fora do bundle público;
- validar token Clerk em Function/Worker;
- checar assinatura no backend antes de entregar o módulo;
- rever a estratégia offline para cache autorizado por usuário.

## Restrição de um dispositivo/sessão (pendente)

Restrição de uma conexão simultânea precisa de backend com
`CLERK_SECRET_KEY` para identificar sessão, registrar dispositivo,
revogar excedentes. Implementar antes do lançamento comercial se o
contrato de assinatura exigir uso individual estrito.
