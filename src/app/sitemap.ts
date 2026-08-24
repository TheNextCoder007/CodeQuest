import type { MetadataRoute } from 'next';
import { ROTAS_PUBLICAS, urlAbsoluta } from '@/lib/site';

/**
 * Sitemap do CodeQuest.
 *
 * O Next gera o arquivo em `/sitemap.xml` durante o build - tanto no build da
 * Vercel quanto no export estatico do .apk/.exe (onde ele simplesmente fica
 * junto e nao atrapalha).
 *
 * Entram SO as paginas publicas. Dashboard, perfil, trilha, licao, ranking,
 * amigos, duelo e perfil publico exigem sessao: quem chega sem login e mandado
 * para `/login`, entao indexar essas rotas colocaria no Google um resultado
 * que leva a uma tela de carregamento.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return ROTAS_PUBLICAS.map((rota) => ({
    url: urlAbsoluta(rota.caminho),
    lastModified: agora,
    changeFrequency: rota.frequencia,
    priority: rota.prioridade,
  }));
}
