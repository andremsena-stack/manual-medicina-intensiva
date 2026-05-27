# Manual Interativo de Medicina Intensiva

PWA em React + Vite + TypeScript para a referência clínica de UTI em
`https://manualvirtus.com.br` (Virtus — Clinical Tools).

Acesso offline após primeiro login, autenticado por Clerk, gate de
leitura por assinatura recorrente Stripe (Mensal / Trimestral / Anual)
ou acesso fundador vitalício.

## Regra central de segurança clínica

Não modificar doses, diluições, fórmulas, limites clínicos, textos de
alerta ou recomendações médicas sem solicitação explícita.

Qualquer alteração clínica deve ser registrada em [`docs/changelog.md`](docs/changelog.md) como:

> REQUER REVISAO MEDICA

O papel técnico do projeto é melhorar estrutura, interface, responsividade,
validação, organização modular, testes e rastreabilidade — preservando a
lógica clínica validada nos HTMLs canônicos em `src/data/modules/`.

## Comandos principais

```bash
npm install
npm run dev               # Vite dev, porta 5173 (HMR + modos de preview)
npm run build             # build estático em dist/
npm run verify:modules    # valida hashes dos HTMLs clínicos
npm run test:calculators  # testes das calculadoras

# Cloudflare Functions locais (após npm run build):
npx wrangler pages dev dist --port 8788
```

## Onde tudo está documentado

Toda documentação do projeto está consolidada em um único índice:
**[`AGENTS.md`](AGENTS.md)** — ponto de entrada para qualquer agente de IA
ou desenvolvedor novo. Cobre tech stack, estrutura de arquivos, lista
canônica dos módulos, fluxo de auth + paywall + Stripe, endpoints das
Cloudflare Functions, modos de preview de dev, lições aprendidas e
índice dos demais docs em `docs/`.

Para regras operacionais específicas do Claude Code, ver [`CLAUDE.md`](CLAUDE.md).

## Hospedagem

Cloudflare Pages (estático + Functions). CI builda e publica
automaticamente em cada push pro `main`. Detalhes de DNS, domínio e
env vars em [`docs/DEPLOY_MANUALVIRTUS.md`](docs/DEPLOY_MANUALVIRTUS.md).
