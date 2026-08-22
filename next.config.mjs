/** @type {import('next').NextConfig} */

// O CodeQuest roda em 4 alvos a partir do mesmo codigo:
//   1. Site (Vercel)        -> build padrao do Next.js
//   2. Android (.apk)       -> export estatico embarcado pelo Capacitor
//   3. Windows (.exe)       -> export estatico embarcado pelo Tauri
//   4. Linux (.AppImage)    -> export estatico embarcado pelo Tauri
//
// Para 2/3/4 rodamos `npm run build:static`, que define NEXT_OUTPUT=export e
// gera a pasta `out/` com HTML/JS puros. Como toda a aplicacao e client-side
// (Supabase JS no navegador), o mesmo codigo funciona nos quatro alvos.
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig = {
  reactStrictMode: true,

  // Barra no final em TODOS os alvos, de proposito: assim a URL de retorno do
  // Google (`/auth/callback/`) e exatamente a mesma no site e nos apps
  // empacotados, e basta cadastrar um endereco no Supabase/Google Console.
  trailingSlash: true,

  ...(isStaticExport
    ? {
        output: 'export',
        images: { unoptimized: true },
      }
    : {}),
  eslint: {
    // O build de producao nao deve quebrar por causa de lint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
