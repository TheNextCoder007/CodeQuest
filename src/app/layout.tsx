import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SITE_URL, urlAbsoluta } from '@/lib/site';
import { NOME_DO_APP, OG_IMAGE } from '@/lib/metadata';

/**
 * Meta tags da raiz.
 *
 * Servem de padrao para o site inteiro E sao as tags da landing (que e a
 * propria rota `/`). As outras rotas sobrescrevem o que precisam pelo
 * `layout.tsx` de cada pasta.
 */
const TITULO = 'CodeQuest — aprenda a programar jogando, de graça';
const DESCRICAO =
  'Aprenda programação do zero resolvendo desafios no navegador. Trilha de Python com correção na hora, XP, níveis, streak, conquistas, ranking e duelos 1v1 com os amigos. Grátis, sem instalar nada.';

export const metadata: Metadata = {
  // Base para transformar caminho relativo em URL absoluta nas tags sociais.
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITULO,
    // As outras paginas viram "Entrar · CodeQuest", e por aí.
    template: `%s · ${NOME_DO_APP}`,
  },
  description: DESCRICAO,
  applicationName: NOME_DO_APP,
  manifest: '/manifest.webmanifest',
  alternates: { canonical: urlAbsoluta('/') },
  keywords: [
    'aprender programação',
    'curso de python grátis',
    'programação para iniciantes',
    'exercícios de python',
    'aprender a programar do zero',
    'plataforma gamificada de programação',
    'lógica de programação',
  ],
  authors: [{ name: NOME_DO_APP }],
  creator: NOME_DO_APP,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: NOME_DO_APP,
    locale: 'pt_BR',
    url: urlAbsoluta('/'),
    title: TITULO,
    description: DESCRICAO,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRICAO,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },

  // Comprovacao de propriedade no Google Search Console.
  //
  // Fica no layout RAIZ de proposito: assim a tag sai em todas as paginas,
  // inclusive nas privadas (que herdam daqui e so trocam titulo e robots).
  // O Google aceita a verificacao encontrando a tag em qualquer uma delas.
  //
  // Depois que a propriedade estiver confirmada, NAO remova: o Google
  // reconfere de tempos em tempos e tira o acesso se a tag sumir.
  verification: {
    google: 'jVu33xTPQKi2_VKWowOq8ik4UNT6qe8wx2SQzBJJcG4',
  },
};

export const viewport: Viewport = {
  themeColor: '#04070f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Fontes opcionais: se a rede estiver indisponivel (app offline),
            o stack de fontes do sistema assume automaticamente. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
