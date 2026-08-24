/**
 * Endereco publico do site.
 *
 * Usado pelo sitemap, pelo robots.txt e pelas tags Open Graph - todos
 * precisam de URL ABSOLUTA (o Google e o WhatsApp nao resolvem caminho
 * relativo).
 *
 * A ordem de busca importa:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` - o que voce configurar na Vercel, e o que
 *      manda. Essa variavel ja existia no projeto para o retorno do Google.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` - o dominio FIXO de producao que a
 *      Vercel injeta sozinha. Repare que nao usamos `VERCEL_URL`: aquela
 *      muda a cada deploy (`projeto-a1b2c3.vercel.app`) e colocaria um
 *      endereco descartavel dentro do sitemap.
 *   3. localhost - so em desenvolvimento.
 */

const limpar = (valor: string): string => valor.trim().replace(/\/+$/, '');

/** Ambiente minimo que a resolucao precisa (fica explicito para poder testar). */
export interface AmbienteDoSite {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}

/**
 * Funcao pura, para `npm run test:seo` conseguir cobrir cada combinacao.
 *
 * Repare na ordem: uma `NEXT_PUBLIC_SITE_URL` apontando para localhost perde
 * para o dominio de producao da Vercel. Sem isso, esquecer de trocar a
 * variavel no painel publicaria um sitemap inteiro apontando para
 * `http://localhost:3000` - que e exatamente o que aconteceria aqui, ja que o
 * `.env.local` de desenvolvimento tem localhost.
 */
export function resolverSiteUrl(env: AmbienteDoSite): string {
  const explicita = env.NEXT_PUBLIC_SITE_URL?.trim();
  const ehLocal = (valor: string) => /localhost|127\.0\.0\.1/.test(valor);

  if (explicita && !ehLocal(explicita)) return limpar(explicita);

  const producaoVercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (producaoVercel) return limpar(`https://${producaoVercel.replace(/^https?:\/\//, '')}`);

  if (explicita) return limpar(explicita);
  return 'http://localhost:3000';
}

/** Ex.: `https://codequest.vercel.app` (sem barra no final). */
export const SITE_URL = resolverSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});

/**
 * Monta uma URL absoluta com barra no final.
 *
 * A barra e obrigatoria aqui porque o projeto usa `trailingSlash: true` no
 * `next.config.mjs`. Anunciar `/login` quando a pagina real e `/login/` faria
 * o Google indexar um redirecionamento em vez da pagina.
 */
export const urlAbsoluta = (caminho: string): string => {
  if (caminho === '/' || caminho === '') return `${SITE_URL}/`;
  const limpo = `/${caminho.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
  return `${SITE_URL}${limpo}`;
};

/**
 * Rotas publicas: as unicas que fazem sentido no Google.
 *
 * Todo o resto do aplicativo vive atras do login (`AppShell` manda para
 * `/login` quem nao tem sessao), entao indexar essas telas so renderia
 * resultado de busca que leva a uma pagina de carregamento.
 */
export const ROTAS_PUBLICAS = [
  { caminho: '/', prioridade: 1.0, frequencia: 'weekly' as const },
  { caminho: '/cadastro', prioridade: 0.8, frequencia: 'monthly' as const },
  { caminho: '/login', prioridade: 0.5, frequencia: 'monthly' as const },
];

/** Rotas que exigem sessao - ficam fora do sitemap e barradas no robots.txt. */
export const ROTAS_PRIVADAS = [
  '/dashboard/',
  '/perfil/',
  '/trilha/',
  '/licao/',
  '/ranking/',
  '/amigos/',
  '/duelo/',
  '/ranqueado/',
  '/usuario/',
  '/auth/',
];
