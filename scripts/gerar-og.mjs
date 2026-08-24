/**
 * Gera `public/og.jpg` (a imagem de previa do link) a partir de
 * `scripts/og-image.html`.
 *
 * Rodar com: npm run og:gen
 *
 * O Playwright NAO e dependencia do projeto de proposito - ele baixa um
 * Chromium inteiro (uns 300 MB) e seria um peso para todo mundo por causa de
 * um script que roda uma vez a cada mudanca de identidade visual. Se nao
 * estiver instalado, o script explica o que fazer e sai sem quebrar nada.
 */
import { pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const fonte = resolve(aqui, 'og-image.html');
const saida = resolve(aqui, '..', 'public', 'og.jpg');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    [
      'Playwright nao encontrado.',
      '',
      'Instale so para esta tarefa e rode de novo:',
      '  npm i -D playwright && npx playwright install chromium',
      '  npm run og:gen',
      '',
      'A imagem atual em public/og.jpg continua valendo ate la.',
    ].join('\n'),
  );
  process.exit(1);
}

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await pagina.goto(pathToFileURL(fonte).href, { waitUntil: 'networkidle' });
// Espera as fontes do Google assentarem antes de fotografar.
await pagina.waitForTimeout(2000);
await pagina.screenshot({ path: saida, type: 'jpeg', quality: 90 });
await navegador.close();

console.log(`imagem gerada: ${saida}`);
