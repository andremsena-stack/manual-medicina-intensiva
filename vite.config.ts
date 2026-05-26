import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Paths absolutos (a partir de "/") em vez de relativos ("./").
  // Relativos quebram em PWA iOS standalone + Service Worker quando o
  // SW intercepta navegação que resolve para URL não-raiz: o browser
  // resolve "./assets/x" como "/assets/assets/x" → 404 → JS vem como
  // text/html (página de erro) → React não monta → tela navy.
  // O site sempre roda no domínio raiz (manualvirtus.com.br/) então
  // absoluto é seguro.
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: true,
    assetsInlineLimit: 0
  },
  server: {
    host: "127.0.0.1"
  },
  preview: {
    host: "127.0.0.1"
  }
});
