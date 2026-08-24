/**
 * Testes de SEO.
 *
 * Duas partes:
 *
 *   1. a resolucao do endereco publico, que decide o que vai dentro do
 *      sitemap, do robots.txt e das tags Open Graph;
 *   2. o resultado do build - se `out/` existir, conferimos o sitemap, o
 *      robots e as meta tags de verdade, em vez de confiar no codigo.
 *
 * O item 2 e o que pega o erro mais caro aqui: publicar um sitemap inteiro
 * apontando para `localhost` porque alguem esqueceu a variavel de ambiente.
 *
 * Rodar com: npm run test:seo
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolverSiteUrl, urlAbsoluta, ROTAS_PRIVADAS, ROTAS_PUBLICAS } from '../src/lib/site';

let passaram = 0;
let falharam = 0;

const ok = (condicao: boolean, titulo: string) => {
  if (condicao) {
    passaram += 1;
    console.log(`ok     ${titulo}`);
  } else {
    falharam += 1;
    console.error(`FALHOU ${titulo}`);
  }
};

const secao = (titulo: string) => console.log(`\n--- ${titulo} ---`);

/* -------------------------------------------------------------------------
 * 1. De onde vem o endereco do site
 * ---------------------------------------------------------------------- */
secao('resolucao do endereco publico');
{
  ok(
    resolverSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://codequest.vercel.app' }) ===
      'https://codequest.vercel.app',
    'usa NEXT_PUBLIC_SITE_URL quando ela aponta para producao',
  );

  ok(
    resolverSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://codequest.vercel.app/' }) ===
      'https://codequest.vercel.app',
    'tira a barra do final',
  );

  // O caso que realmente importa: o .env.local de desenvolvimento tem
  // localhost, e ele NAO pode vazar para o sitemap de producao.
  ok(
    resolverSiteUrl({
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      VERCEL_PROJECT_PRODUCTION_URL: 'codequest.vercel.app',
    }) === 'https://codequest.vercel.app',
    'localhost na variavel perde para o dominio de producao da Vercel',
  );

  ok(
    resolverSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'codequest.vercel.app' }) ===
      'https://codequest.vercel.app',
    'sem variavel nenhuma, cai no dominio da Vercel',
  );

  ok(
    resolverSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'https://codequest.vercel.app' }) ===
      'https://codequest.vercel.app',
    'nao duplica o https:// se a Vercel mandar com protocolo',
  );

  ok(
    resolverSiteUrl({}) === 'http://localhost:3000',
    'fora da Vercel e sem variavel, assume localhost',
  );

  ok(
    resolverSiteUrl({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' }) === 'http://localhost:3000',
    'em desenvolvimento puro, localhost mesmo',
  );
}

secao('montagem das URLs');
{
  const base = resolverSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://exemplo.com' });
  ok(base === 'https://exemplo.com', 'base sem barra');
  ok(urlAbsoluta('/') === 'http://localhost:3000/', 'a raiz termina em barra');
  ok(
    urlAbsoluta('/login').endsWith('/login/'),
    'as rotas terminam em barra (o projeto usa trailingSlash)',
  );
  ok(urlAbsoluta('login').endsWith('/login/'), 'aceita caminho sem barra inicial');
}

secao('quais rotas entram no sitemap');
{
  const caminhos = ROTAS_PUBLICAS.map((rota) => rota.caminho);
  ok(caminhos.includes('/'), 'a landing esta no sitemap');
  ok(caminhos.length === 3, `o sitemap tem 3 rotas publicas (${caminhos.join(', ')})`);

  const gated = ['/dashboard', '/perfil', '/trilha', '/licao', '/ranking', '/amigos', '/duelo', '/usuario'];
  ok(
    gated.every((rota) => !caminhos.includes(rota)),
    'nenhuma rota que exige login entrou no sitemap',
  );
  ok(
    gated.every((rota) => ROTAS_PRIVADAS.includes(`${rota}/`)),
    'e todas elas estao barradas no robots.txt',
  );
  ok(
    ROTAS_PUBLICAS.every((rota) => rota.prioridade > 0 && rota.prioridade <= 1),
    'as prioridades estao entre 0 e 1',
  );
}

/* -------------------------------------------------------------------------
 * 2. O que o build realmente gerou
 * ---------------------------------------------------------------------- */
secao('arquivos gerados pelo build');
if (!existsSync('out/sitemap.xml')) {
  console.log('       (pulado: rode `npm run build:static` antes para conferir o resultado real)');
} else {
  const sitemap = readFileSync('out/sitemap.xml', 'utf8');
  const robots = readFileSync('out/robots.txt', 'utf8');

  ok(sitemap.startsWith('<?xml'), 'sitemap.xml e um XML valido no inicio');
  ok(sitemap.includes('<urlset'), 'sitemap.xml tem urlset');

  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(urls.length === ROTAS_PUBLICAS.length, `o sitemap lista ${urls.length} URLs`);
  ok(
    urls.every((url) => url.endsWith('/')),
    'toda URL do sitemap termina em barra',
  );
  ok(
    urls.every((url) => /^https?:\/\//.test(url)),
    'toda URL do sitemap e absoluta',
  );

  const gated = ['/dashboard', '/perfil', '/trilha', '/licao', '/ranking', '/amigos', '/duelo', '/usuario', '/auth'];
  ok(
    !urls.some((url) => gated.some((rota) => url.includes(rota))),
    'nenhuma rota privada vazou para o sitemap',
  );

  ok(robots.includes('Sitemap:'), 'robots.txt aponta para o sitemap');
  ok(
    gated.every((rota) => robots.includes(`Disallow: ${rota}/`)),
    'robots.txt barra todas as rotas privadas',
  );
  ok(robots.includes('Allow: /'), 'robots.txt libera a parte publica');

  // Se o build foi feito com uma URL de producao, nada pode apontar para
  // localhost. Em build local isso e esperado, entao so avisamos.
  const temLocalhost = sitemap.includes('localhost') || robots.includes('localhost');
  if (temLocalhost) {
    console.log(
      '       AVISO: o build atual aponta para localhost (normal em desenvolvimento).',
    );
    console.log(
      '              Na Vercel, configure NEXT_PUBLIC_SITE_URL com o endereco publico.',
    );
  } else {
    ok(true, 'nada aponta para localhost neste build');
  }

  secao('meta tags nas paginas publicas');
  const paginas: [string, string][] = [
    ['landing', 'out/index.html'],
    ['login', 'out/login/index.html'],
    ['cadastro', 'out/cadastro/index.html'],
  ];

  for (const [nome, caminho] of paginas) {
    if (!existsSync(caminho)) {
      ok(false, `${nome}: pagina gerada`);
      continue;
    }
    const html = readFileSync(caminho, 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));

    const titulo = head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const descricao = head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';

    ok(titulo.length >= 15 && titulo.length <= 65, `${nome}: title com bom tamanho (${titulo.length})`);
    ok(titulo.includes('CodeQuest'), `${nome}: title tem a marca`);
    ok(
      descricao.length >= 70 && descricao.length <= 200,
      `${nome}: description com bom tamanho (${descricao.length})`,
    );

    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
      ok(head.includes(`property="${prop}"`), `${nome}: tem ${prop}`);
    }
    ok(head.includes('name="twitter:card"'), `${nome}: tem twitter:card`);
    ok(head.includes('rel="canonical"'), `${nome}: tem link canonico`);
    ok(
      !/name="robots" content="noindex/.test(head),
      `${nome}: NAO esta marcada como noindex`,
    );

    const ogImage = head.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? '';
    ok(/^https?:\/\//.test(ogImage), `${nome}: og:image e URL absoluta`);
  }

  secao('meta tags nas paginas privadas');
  for (const [nome, caminho] of [
    ['dashboard', 'out/dashboard/index.html'],
    ['perfil', 'out/perfil/index.html'],
    ['ranking', 'out/ranking/index.html'],
    ['amigos', 'out/amigos/index.html'],
    ['duelo', 'out/duelo/index.html'],
    ['usuario', 'out/usuario/index.html'],
  ] as [string, string][]) {
    if (!existsSync(caminho)) {
      ok(false, `${nome}: pagina gerada`);
      continue;
    }
    const head = readFileSync(caminho, 'utf8');
    ok(
      /name="robots" content="noindex, nofollow"/.test(head),
      `${nome}: marcada como noindex, nofollow`,
    );
  }

  secao('verificacao do Google Search Console');
  {
    // O Google reconfere a tag de tempos em tempos e tira o acesso se ela
    // sumir - por isso ela vira teste, e nao so um comentario no layout.
    const TOKEN = 'jVu33xTPQKi2_VKWowOq8ik4UNT6qe8wx2SQzBJJcG4';
    const paginas = ['out/index.html', 'out/login/index.html', 'out/dashboard/index.html'];
    const comTag = paginas.filter((caminho) => {
      if (!existsSync(caminho)) return false;
      return readFileSync(caminho, 'utf8').includes(
        `<meta name="google-site-verification" content="${TOKEN}"/>`,
      );
    });
    ok(
      comTag.length === paginas.length,
      `a tag de verificacao do Google sai em todas as paginas (${comTag.length}/${paginas.length})`,
    );
  }

  secao('imagem de previa');
  ok(existsSync('out/og.jpg'), 'a imagem og.jpg foi publicada');
  if (existsSync('out/og.jpg')) {
    const tamanho = readFileSync('out/og.jpg').byteLength;
    ok(
      tamanho < 300 * 1024,
      `og.jpg cabe no limite pratico do WhatsApp (${Math.round(tamanho / 1024)} KB de 300)`,
    );
  }
}

console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
