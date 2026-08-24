import type { Metadata } from 'next';
import { SITE_URL, urlAbsoluta } from './site';

/**
 * Montagem das meta tags.
 *
 * Duas formas de pagina no CodeQuest:
 *
 *   - **publica** (landing, login, cadastro): titulo e descricao proprios,
 *     link canonico e previa para redes sociais;
 *   - **privada** (tudo que exige sessao): `noindex`, para nao aparecer no
 *     Google como um resultado que leva a uma tela de carregamento.
 *
 * Toda pagina client-side ('use client') NAO pode exportar `metadata`. Por
 * isso as rotas ganham um `layout.tsx` de uma linha, que e componente de
 * servidor e carrega as tags.
 */

export const NOME_DO_APP = 'CodeQuest';

/**
 * Imagem de previa (WhatsApp, Discord, Twitter, LinkedIn).
 *
 * JPEG e nao PNG de proposito: o mesmo desenho em PNG dava 440 KB por causa
 * dos gradientes, e o WhatsApp costuma desistir de gerar a previa acima de
 * ~300 KB. Em JPEG a 90% de qualidade fica em 70 KB, sem diferenca visivel.
 *
 * Para regerar depois de editar `scripts/og-image.html`: `npm run og:gen`.
 */
export const OG_IMAGE = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  alt: 'CodeQuest — aprenda programação jogando',
};

interface Publica {
  titulo: string;
  descricao: string;
  /** Caminho da rota, ex.: '/login'. */
  caminho: string;
}

export function metadataPublica({ titulo, descricao, caminho }: Publica): Metadata {
  const url = urlAbsoluta(caminho);

  // O `template` do layout raiz cuida da aba do navegador ("Entrar ·
  // CodeQuest"), mas NAO alcanca as tags sociais. Sem isto, um link de login
  // compartilhado no WhatsApp apareceria só como "Entrar".
  const tituloSocial = `${titulo} · ${NOME_DO_APP}`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: NOME_DO_APP,
      locale: 'pt_BR',
      url,
      title: tituloSocial,
      description: descricao,
      images: [{ ...OG_IMAGE, url: `${SITE_URL}${OG_IMAGE.url}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloSocial,
      description: descricao,
      images: [`${SITE_URL}${OG_IMAGE.url}`],
    },
  };
}

/**
 * Tela que exige login.
 *
 * `noindex, nofollow` e o par do `Disallow` no robots.txt: um evita a visita,
 * o outro evita a indexacao caso o Google chegue por um link de fora.
 */
export function metadataPrivada(titulo: string): Metadata {
  return {
    title: titulo,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
