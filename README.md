# Manual Interativo de Medicina Intensiva

PWA em React + Vite + TypeScript para acesso offline aos modulos 1-6 do Manual Interativo de Medicina Intensiva.

## Regra central de seguranca clinica

Nao modificar doses, diluicoes, formulas, limites clinicos, textos de alerta ou recomendacoes medicas sem solicitacao explicita.

Qualquer alteracao clinica deve ser registrada no changelog como:

> REQUER REVISAO MEDICA

O papel tecnico do projeto e melhorar estrutura, interface, responsividade, validacao, organizacao modular, testes e rastreabilidade, preservando a logica clinica validada.

## Arquitetura

- `src/components/AuthGate.tsx`: bloqueio de acesso com Clerk Auth e assinatura Stripe.
- `functions/api/`: rotas protegidas para status de assinatura, Checkout, Portal do Cliente e webhook Stripe.
- `src/data/modules/`: HTMLs clinicos canonicos dos modulos 1-6.
- `src/components/ModuleViewer.tsx`: renderiza o HTML bruto em `iframe srcDoc`.
- `src/utils/search.ts`: busca global em texto extraido dos modulos.
- `src/utils/iframeSafety.ts`: camada de interface em tempo de execucao para pares dose/vazao, sem alterar formulas ou constantes.
- `src/features/calculators/`: area reservada para futuras calculadoras React.
- `public/sw.js`: service worker offline-first.
- `public/manifest.webmanifest`: manifesto PWA.
- `docs/`: politica clinica, fontes, changelog e notas tecnicas.
- `legacy/`: entrada de fallback para a versao HTML estatica anterior.

## Login e assinatura

O app usa Clerk para autenticar usuarios e Stripe Checkout para assinatura mensal. A verificacao de acesso e feita em Cloudflare Pages Functions usando token Clerk no backend.

Variaveis principais:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_BILLING_REQUIRED=true
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=https://manual-medicina-intensiva.pages.dev
```

Veja o passo a passo em `docs/clerk-auth-billing.md`.

Observacao comercial importante: enquanto os HTMLs estiverem empacotados no bundle estatico, o Clerk protege a experiencia de uso, mas nao torna o conteudo tecnicamente inacessivel para usuarios avancados. Antes do lancamento pago, mover os modulos para entrega por backend protegido se a protecao forte do conteudo for obrigatoria.

## Versoes clinicas integradas

- Modulo 1: `modulo_01_via_aerea_iot_harmonizado_v7_clinico_refs_recolhiveis.html`
- Modulo 2: `modulo_02_pos_intubacao_confirmacao_revisado_v7_clinico_refs_recolhiveis.html`
- Modulo 3: `modulo_03_ventilacao_mecanica_harmonizado_v5_harmonizado_refs_recolhiveis.html`
- Modulo 4: `modulo_04_manutencao_sedoanalgesia_harmonizado_v6_harmonizado_refs_recolhiveis.html`
- Modulo 5: `modulo_05_drogas_vasoativas_harmonizado_v6_harmonizado_refs_recolhiveis.html`
- Modulo 6: `modulo_06_calculadoras_interativas_revisado_v30_unidade_dose_editavel_bolus_corrigido_refs_recolhiveis.html`

## Fontes internas

As fontes clinicas locais ficam referenciadas em:

`C:\Users\andre\OneDrive\Documentos\New project\MEDICINA\GUIA INTENSIVA\FONTES`

Esses arquivos nao sao copiados para `/Source` nesta fase. Nao remover, renomear ou alterar fontes locais sem autorizacao.

## Calculadoras

No v1, as calculadoras JavaScript existentes permanecem dentro dos HTMLs aprovados. A migracao futura para React deve manter rastreabilidade, constantes clinicas centralizadas, testes minimos e registro obrigatorio em `docs/changelog.md`.

Regras de interface para dose versus vazao:

- dose preenchida calcula/bloqueia vazao;
- vazao preenchida calcula/bloqueia dose;
- os dois campos nao devem ficar como entradas ativas simultaneas;
- ao limpar o campo ativo, o outro modo volta a ficar disponivel.

## Scripts

```bash
npm run dev
npm run build
npm run verify:modules
npm run test:calculators
```

`verify:modules` confirma que os HTMLs clinicos em `src/data/modules/` mantem os hashes esperados.

## Hospedagem

O build usa `base: './'`, entao o resultado estatico pode ser publicado em Vercel, Netlify, GitHub Pages ou servidor local.
