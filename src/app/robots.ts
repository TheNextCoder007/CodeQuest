import type { MetadataRoute } from 'next';
import { ROTAS_PRIVADAS, urlAbsoluta } from '@/lib/site';

/**
 * robots.txt do CodeQuest.
 *
 * Libera a parte publica e barra o que exige login. As rotas privadas tambem
 * levam `noindex` no proprio HTML (ver `metadataPrivada` em
 * `src/lib/metadata.ts`): o robots impede a visita, o meta impede que a pagina
 * apareca caso o Google chegue nela por um link de fora.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ROTAS_PRIVADAS,
      },
    ],
    sitemap: `${urlAbsoluta('/')}sitemap.xml`,
  };
}
