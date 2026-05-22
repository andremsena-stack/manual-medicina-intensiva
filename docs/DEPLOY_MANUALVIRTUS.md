# Deploy em dominio proprio: manualvirtus.com.br

## Objetivo

Migrar o Manual Medicina Intensiva do dominio temporario:

```text
https://manual-medicina-intensiva.pages.dev
```

para o dominio principal:

```text
https://manualvirtus.com.br
```

Hospedagem: Cloudflare Pages  
App: React/Vite  
Autenticacao: Clerk Production  
Pagamento: Stripe

## A. Registro.br

1. Acessar a conta do Registro.br.
2. Abrir o dominio `manualvirtus.com.br`.
3. Trocar os nameservers atuais pelos dois nameservers fornecidos pela Cloudflare.
4. Salvar a alteracao.
5. Aguardar a propagacao e a ativacao da zona na Cloudflare.

## B. Cloudflare

1. Entrar na Cloudflare.
2. Adicionar `manualvirtus.com.br` como site/zona.
3. Aguardar a zona ficar ativa.
4. Ir em `Workers & Pages`.
5. Abrir o projeto `manual-medicina-intensiva`.
6. Entrar em `Custom domains`.
7. Adicionar:

```text
manualvirtus.com.br
```

8. Opcionalmente adicionar:

```text
www.manualvirtus.com.br
```

9. Confirmar que o custom domain do Pages aponta para o projeto:

```text
manual-medicina-intensiva
```

## C. Clerk

1. Entrar na aplicacao Clerk do Manual Medicina Intensiva.
2. Ir para `Production`.
3. Abrir `Configure`.
4. Abrir `Domains`.
5. Definir `manualvirtus.com.br` como dominio de producao.
6. Copiar todos os CNAMEs exigidos pelo Clerk.

Nao usar valores de prints antigos. Copiar os valores exibidos no painel do Clerk.

## D. Cloudflare DNS

1. Abrir a zona DNS de `manualvirtus.com.br`.
2. Criar exatamente os CNAMEs informados pelo Clerk.
3. Todos os registros Clerk devem ficar como:

```text
DNS only
```

Nunca deixar esses CNAMEs como `Proxied`.

Exemplos esperados:

```text
accounts       CNAME   accounts.clerk.services
clkmail        CNAME   valor exato mostrado pelo Clerk
clk._domainkey CNAME   valor exato mostrado pelo Clerk
clk2._domainkey CNAME  valor exato mostrado pelo Clerk
clerk          CNAME   valor exato mostrado pelo Clerk, se aparecer
```

Quando a interface pedir `Name`, usar o nome relativo, por exemplo `accounts`.

Quando a interface pedir hostname completo, usar:

```text
accounts.manualvirtus.com.br
```

## E. Clerk

1. Voltar em `Production > Configure > Domains`.
2. Clicar em `Verify`, `Recheck DNS` ou acao equivalente.
3. Aguardar propagacao se o Clerk ainda exibir registros como pendentes.
4. Repetir a verificacao ate todos os registros ficarem verificados.

## F. Cloudflare Pages environment variables

Configurar em:

```text
Workers & Pages > manual-medicina-intensiva > Settings > Variables and Secrets
```

### Variaveis publicas (Plaintext, expostas no bundle do frontend)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
```

Opcional, apenas como fallback de desenvolvimento (producao deve chamar `POST /api/create-checkout-session`):

```env
VITE_STRIPE_CHECKOUT_URL=
```

### Variaveis privadas / Secrets (Encrypted, lidas apenas pelas Functions)

```env
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_1TZf0zAIon1Sw6HssZDB0ZPO
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manualvirtus.com.br
```

### Teste

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_BILLING_REQUIRED=true

CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_1TZf0zAIon1Sw6HssZDB0ZPO
STRIPE_ALLOWED_STATUSES=active,trialing
APP_URL=https://manualvirtus.com.br
```

Nunca configurar `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ou `STRIPE_PRICE_ID` com prefixo `VITE_`.

## G. Redeploy

Opcao pela interface:

```text
Cloudflare Pages > manual-medicina-intensiva > Deployments > Retry deployment
```

Opcao por terminal:

```bash
npm run build
npx wrangler pages deploy dist --project-name manual-medicina-intensiva
```

## Checklist de validacao

- `manualvirtus.com.br` abre o app.
- Aba anonima mostra login/cadastro.
- Login Clerk carrega sem tela branca.
- Usuario sem assinatura ve botao `Assinar agora`.
- Botao `Assinar agora` chama `POST /api/create-checkout-session` e abre Stripe Checkout com o `STRIPE_PRICE_ID` configurado.
- Usuario com `publicMetadata.subscriptionStatus = "active"` acessa o manual.
- Usuario com `publicMetadata.stripeSubscriptionStatus = "active"` acessa o manual.
- `UserButton` aparece para usuario logado com assinatura ativa.
- `npm run build` passa sem erros.

## Observacoes tecnicas

- O Vite usa `base: "./"`, entao o build nao depende de `pages.dev`.
- O frontend usa somente variaveis publicas com prefixo `VITE_`.
- O frontend nao deve acessar `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY` ou `STRIPE_WEBHOOK_SECRET`.
- O webhook Stripe deve apontar para:

```text
https://manualvirtus.com.br/api/stripe-webhook
```

- Durante a transicao, o dominio temporario `manual-medicina-intensiva.pages.dev` pode continuar existindo como fallback operacional.
