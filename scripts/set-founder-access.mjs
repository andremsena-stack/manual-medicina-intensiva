#!/usr/bin/env node
/**
 * set-founder-access.mjs
 *
 * Lê um CSV de pagamentos (export do Stripe) e marca founderAccess: true
 * no publicMetadata do Clerk para cada e-mail com Status "Paid".
 *
 * Uso:
 *   CLERK_SECRET_KEY=sk_live_... node scripts/set-founder-access.mjs [caminho-do-csv]
 *
 * Dry-run (sem alterar nada — só lista o que seria feito):
 *   CLERK_SECRET_KEY=sk_live_... DRY_RUN=true node scripts/set-founder-access.mjs [caminho-do-csv]
 *
 * Se o caminho do CSV for omitido, usa "unified_payments.csv" no diretório atual.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const DRY_RUN = process.env.DRY_RUN === "true";
const CSV_PATH = resolve(process.argv[2] ?? "unified_payments.csv");
const CLERK_API = "https://api.clerk.com/v1";

if (!CLERK_SECRET_KEY) {
  console.error("Erro: CLERK_SECRET_KEY nao definida.");
  console.error("  Uso: CLERK_SECRET_KEY=sk_live_... node scripts/set-founder-access.mjs caminho.csv");
  process.exit(1);
}

const authHeaders = {
  Authorization: `Bearer ${CLERK_SECRET_KEY}`,
  "Content-Type": "application/json",
};

// ── CSV parsing ────────────────────────────────────────────────────────────────

function parseCSV(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(",").map((h) => h.trim());

  const emailIdx = headers.indexOf("Customer Email");
  const statusIdx = headers.indexOf("Status");

  if (emailIdx === -1 || statusIdx === -1) {
    throw new Error(`CSV invalido: colunas "Customer Email" ou "Status" nao encontradas.\nCabecalho: ${headerLine}`);
  }

  const emails = [];
  for (const row of rows) {
    const cols = row.split(",");
    const email = cols[emailIdx]?.trim();
    const status = cols[statusIdx]?.trim();
    if (email && status === "Paid") {
      emails.push(email.toLowerCase());
    }
  }

  return [...new Set(emails)]; // deduplicar
}

// ── Clerk API helpers ──────────────────────────────────────────────────────────

async function findClerkUserByEmail(email) {
  const params = new URLSearchParams();
  params.append("email_address[]", email);
  const res = await fetch(`${CLERK_API}/users?${params}`, { headers: authHeaders });
  if (!res.ok) throw new Error(`Clerk API error ao buscar ${email}: ${res.status}`);
  const users = await res.json();
  return users[0] ?? null;
}

async function patchFounderAccess(userId, currentMeta) {
  const res = await fetch(`${CLERK_API}/users/${userId}/metadata`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      public_metadata: { ...currentMeta, founderAccess: true },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Patch falhou para ${userId}: ${res.status} — ${body}`);
  }
  return res.json();
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`CSV: ${CSV_PATH}`);
  console.log(DRY_RUN ? "[DRY RUN] Nenhuma alteracao sera feita.\n" : "Modo de escrita ativo.\n");

  let emails;
  try {
    emails = parseCSV(CSV_PATH);
  } catch (err) {
    console.error(`Erro ao ler CSV: ${err.message}`);
    process.exit(1);
  }

  console.log(`${emails.length} e-mails com status Paid encontrados no CSV.\n`);

  const results = { updated: 0, alreadySet: 0, notFound: 0, errors: 0 };

  for (const email of emails) {
    try {
      const user = await findClerkUserByEmail(email);

      if (!user) {
        console.log(`  [nao encontrado] ${email}`);
        results.notFound++;
        continue;
      }

      const meta = user.public_metadata ?? {};

      if (meta.founderAccess === true) {
        console.log(`  [ja ok]          ${email} (${user.id})`);
        results.alreadySet++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry-run set]    ${email} (${user.id})`);
      } else {
        await patchFounderAccess(user.id, meta);
        console.log(`  [atualizado]     ${email} (${user.id})`);
      }

      results.updated++;

      // Pausa breve para respeitar rate limits do Clerk
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.error(`  [erro]           ${email} — ${err.message}`);
      results.errors++;
    }
  }

  console.log("\n──────────────────────────────────────");
  console.log(`Atualizados:       ${results.updated}`);
  console.log(`Ja tinham flag:    ${results.alreadySet}`);
  console.log(`Nao encontrados:   ${results.notFound}`);
  console.log(`Erros:             ${results.errors}`);
  if (DRY_RUN) console.log("\n(dry run — nenhuma alteracao foi gravada)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
