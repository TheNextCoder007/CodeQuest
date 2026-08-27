/**
 * Gera o PDF do historico de versoes a partir do proprio HISTORICO.md.
 *
 * Rodar com: npm run doc:pdf
 *
 * ---------------------------------------------------------------------------
 * POR QUE ASSIM
 *
 * O texto tem UMA fonte so: `HISTORICO.md`. O PDF e derivado dele, nunca
 * escrito a mao - senao, a cada versao, seria preciso lembrar de atualizar dois
 * documentos e eles iam divergir na primeira pressa.
 *
 * A impressao usa o Chrome ou o Edge que ja existe na maquina
 * (`--headless --print-to-pdf`). Nenhuma dependencia nova, nenhum servico, nada
 * que cobre - a mesma regra que vale para o resto do projeto.
 *
 * O tema aqui e CLARO, ao contrario do app: o PDF vai por e-mail e pode ser
 * impresso, e fundo escuro em papel gasta tinta e fica ilegivel. Os destaques
 * continuam sendo o verde-agua e o azul do CodeQuest, escurecidos o suficiente
 * para ter contraste sobre branco.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const ENTRADA = join(RAIZ, 'HISTORICO.md');
const SAIDA = join(RAIZ, 'CodeQuest-Versoes.pdf');

/* =========================================================================
 * 1. Markdown -> HTML
 *
 * Um conversor pequeno e proposital: cobre exatamente o que o HISTORICO.md
 * usa (titulos, tabelas, listas, citacao, regua, negrito, italico, codigo e
 * links) e nada alem disso. Trazer uma biblioteca de markdown para converter
 * um arquivo nosso seria dependencia a mais para manter.
 * ====================================================================== */

const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Transforma um titulo no id usado pelos links internos (`#4-historico...`).
 * E a mesma regra do GitHub: minusculas, sem acento nem pontuacao, espaco
 * vira hifen. Assim o sumario do PDF continua clicavel.
 */
const identificador = (texto) =>
  texto
    .replace(/`/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const embutido = (texto) => {
  // O codigo sai de cena primeiro: dentro de `crase` nada mais e interpretado.
  const trechos = [];
  let s = texto.replace(/`([^`]+)`/g, (_, codigo) => {
    trechos.push(`<code>${escapar(codigo)}</code>`);
    return `\u0000${trechos.length - 1}\u0000`;
  });

  s = escapar(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, rotulo, destino) => {
    const alvo = destino.startsWith('#') ? destino : escapar(destino);
    return `<a href="${alvo}">${rotulo}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => trechos[Number(i)]);
};

const celulas = (linha) =>
  linha
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());

const ehSeparadorDeTabela = (linha) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(linha) && linha.includes('-');

function converter(markdown) {
  const linhas = markdown.replace(/\r\n/g, '\n').split('\n');
  const saida = [];
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];

    if (!linha.trim()) {
      i += 1;
      continue;
    }

    // regua
    if (/^-{3,}\s*$/.test(linha)) {
      saida.push('<hr>');
      i += 1;
      continue;
    }

    // titulo
    const titulo = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (titulo) {
      const nivel = titulo[1].length;
      // Emoji de abertura sai fora: no papel ele vira um quadrado (a fonte
      // colorida nao entra no PDF) e ainda inflaria o arquivo com a fonte
      // inteira embutida. Na tela, no HISTORICO.md, ele continua la.
      const texto = titulo[2].replace(/^[\p{Extended_Pictographic}️‍]+\s*/u, '').trim();
      saida.push(`<h${nivel} id="${identificador(texto)}">${embutido(texto)}</h${nivel}>`);
      i += 1;
      continue;
    }

    // citacao (pode ocupar varias linhas seguidas)
    if (linha.startsWith('>')) {
      const partes = [];
      while (i < linhas.length && linhas[i].startsWith('>')) {
        partes.push(linhas[i].replace(/^>\s?/, ''));
        i += 1;
      }
      saida.push(`<blockquote>${embutido(partes.join(' ').trim())}</blockquote>`);
      continue;
    }

    // tabela
    if (linha.trim().startsWith('|') && ehSeparadorDeTabela(linhas[i + 1] ?? '')) {
      const cabecalho = celulas(linha);
      i += 2;
      const corpo = [];
      while (i < linhas.length && linhas[i].trim().startsWith('|')) {
        corpo.push(celulas(linhas[i]));
        i += 1;
      }
      // A tabela do topo do documento nao tem cabecalho de verdade
      // (`| | |`): nesse caso ela vira so um bloco de dados.
      const temCabecalho = cabecalho.some((c) => c !== '');
      const cabecalhoHtml = temCabecalho
        ? `<thead><tr>${cabecalho.map((c) => `<th>${embutido(c)}</th>`).join('')}</tr></thead>`
        : '';
      const corpoHtml = corpo
        .map((celula) => `<tr>${celula.map((c) => `<td>${embutido(c)}</td>`).join('')}</tr>`)
        .join('');
      saida.push(
        `<table class="${temCabecalho ? '' : 'sem-cabecalho'}">${cabecalhoHtml}<tbody>${corpoHtml}</tbody></table>`,
      );
      continue;
    }

    // listas (com ou sem numero)
    const marcador = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(linha);
    if (marcador) {
      const ordenada = /\d/.test(marcador[2]);
      const itens = [];
      while (i < linhas.length) {
        const atual = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(linhas[i]);
        if (!atual || /\d/.test(atual[2]) !== ordenada) break;
        const partes = [atual[3]];
        i += 1;
        // continuacao: linha indentada que pertence ao mesmo item
        while (i < linhas.length && linhas[i].trim() && !/^(\s*)([-*]|\d+\.)\s+/.test(linhas[i])) {
          partes.push(linhas[i].trim());
          i += 1;
        }
        itens.push(`<li>${embutido(partes.join(' '))}</li>`);
      }
      saida.push(`<${ordenada ? 'ol' : 'ul'}>${itens.join('')}</${ordenada ? 'ol' : 'ul'}>`);
      continue;
    }

    // paragrafo: junta as linhas ate a proxima linha em branco
    const partes = [linha.trim()];
    i += 1;
    while (
      i < linhas.length &&
      linhas[i].trim() &&
      !/^(#{1,6}\s|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(linhas[i]) &&
      !/^-{3,}\s*$/.test(linhas[i])
    ) {
      partes.push(linhas[i].trim());
      i += 1;
    }
    saida.push(`<p>${embutido(partes.join(' '))}</p>`);
  }

  return saida.join('\n');
}

/* =========================================================================
 * 2. A folha de estilo de impressao
 * ====================================================================== */

const ESTILO = `
  @page { size: A4; margin: 18mm 16mm; }

  :root {
    --tinta:    #0d1626;
    --tinta-2:  #3d4c66;
    --suave:    #6b7a94;
    --linha:    #dfe5ee;
    --fundo-2:  #f5f8fb;
    --mint:     #007a52;
    --aqua:     #0d6f8c;
    --azul:     #1d4ed8;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #ffffff;
    color: var(--tinta);
    font-family: 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h1, h2, h3, h4 {
    line-height: 1.15;
    margin: 0;
    break-after: avoid;
    page-break-after: avoid;
  }

  h1 {
    font-size: 26pt;
    letter-spacing: -0.02em;
    color: var(--tinta);
    padding-bottom: 0.35rem;
    border-bottom: 3px solid var(--mint);
  }

  /* Cada secao de primeiro nivel comeca numa pagina nova - o documento vira
     um dossie folheavel em vez de um bloco continuo. */
  h2 {
    font-size: 16pt;
    letter-spacing: -0.015em;
    margin-top: 1.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--linha);
    break-before: page;
    page-break-before: always;
  }
  h1 + h2, h2:first-of-type { break-before: auto; page-break-before: auto; }

  /* Uma versao nunca comeca no rodape da pagina sem o que veio junto. */
  h3 {
    font-size: 12pt;
    margin-top: 1.15rem;
    color: var(--tinta);
    break-inside: avoid;
  }
  h3 + p, h3 + ul, h3 + table { break-before: avoid; page-break-before: avoid; }

  p { margin: 0.55rem 0; }
  p, li { orphans: 3; widows: 3; }

  a { color: var(--azul); text-decoration: none; }

  code {
    font-family: 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', ui-monospace, monospace;
    font-size: 0.87em;
    background: var(--fundo-2);
    border: 1px solid var(--linha);
    border-radius: 3px;
    padding: 0.05em 0.3em;
    color: var(--aqua);
    /* preserva os espacos: ha trechos em que o espaco E o assunto -
       "  Ana  " contra "Ana", na v1.8.1 (crase nao pode entrar aqui: este
       estilo mora dentro de um template literal) */
    white-space: break-spaces;
  }

  strong { color: var(--tinta); font-weight: 600; }
  em { color: var(--tinta-2); }

  hr {
    border: none;
    border-top: 1px solid var(--linha);
    margin: 1.2rem 0;
  }

  blockquote {
    margin: 0.9rem 0;
    padding: 0.6rem 0.9rem;
    background: var(--fundo-2);
    border-left: 3px solid var(--aqua);
    border-radius: 0 4px 4px 0;
    color: var(--tinta-2);
    font-size: 0.95em;
    break-inside: avoid;
  }

  ul, ol { margin: 0.55rem 0; padding-left: 1.35rem; }
  li { margin: 0.28rem 0; }
  li::marker { color: var(--mint); }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8rem 0;
    font-size: 0.93em;
    break-inside: avoid;
  }

  th, td {
    text-align: left;
    padding: 0.42rem 0.6rem;
    border-bottom: 1px solid var(--linha);
    vertical-align: top;
  }

  thead th {
    background: var(--fundo-2);
    font-size: 0.82em;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--suave);
    font-weight: 600;
    border-bottom: 1px solid var(--linha);
  }

  /* A tabela de identificacao do topo: sem cabecalho, primeira coluna e rotulo. */
  table.sem-cabecalho td:first-child {
    color: var(--suave);
    font-size: 0.9em;
    width: 12rem;
  }

  tbody tr:last-child td { border-bottom: none; }

  .rodape {
    margin-top: 2rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--linha);
    font-size: 8pt;
    color: var(--suave);
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
`;

/* =========================================================================
 * 3. Achar o Chrome ou o Edge da maquina
 * ====================================================================== */

const CAMINHOS = {
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
    '/snap/bin/chromium',
  ],
};

function acharNavegador() {
  if (process.env.CHROME_PATH) {
    if (!existsSync(process.env.CHROME_PATH)) {
      throw new Error(`CHROME_PATH aponta para um arquivo que nao existe: ${process.env.CHROME_PATH}`);
    }
    return process.env.CHROME_PATH;
  }
  const achado = (CAMINHOS[process.platform] ?? []).find((c) => existsSync(c));
  if (achado) return achado;
  throw new Error(
    'Nao achei o Chrome nem o Edge nesta maquina.\n' +
      'Instale um dos dois, ou aponte o caminho:  CHROME_PATH="/caminho/do/chrome" npm run doc:pdf',
  );
}

/* =========================================================================
 * 4. Gerar
 * ====================================================================== */

if (!existsSync(ENTRADA)) {
  console.error(`Nao achei o ${ENTRADA}. O PDF e gerado a partir dele.`);
  process.exit(1);
}

const markdown = readFileSync(ENTRADA, 'utf8');
const gerado = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>CodeQuest - Historico de versoes</title>
<style>${ESTILO}</style>
</head>
<body>
${converter(markdown)}
<div class="rodape">
  <span>CodeQuest &middot; Projeto Integrador</span>
  <span>PDF gerado em ${gerado} a partir de HISTORICO.md</span>
</div>
</body>
</html>`;

const pasta = mkdtempSync(join(tmpdir(), 'codequest-pdf-'));
const arquivoHtml = join(pasta, 'historico.html');
writeFileSync(arquivoHtml, html, 'utf8');

// Util para mexer no estilo de impressao: guarda o HTML intermediario.
if (process.env.CQ_PDF_HTML) {
  writeFileSync(process.env.CQ_PDF_HTML, html, 'utf8');
  console.log(`HTML intermediario salvo em ${process.env.CQ_PDF_HTML}`);
}

const navegador = acharNavegador();

try {
  execFileSync(
    navegador,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      // versoes mais antigas do Chrome usam este nome; a desconhecida e ignorada
      '--print-to-pdf-no-header',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=8000',
      `--print-to-pdf=${SAIDA}`,
      pathToFileURL(arquivoHtml).href,
    ],
    { stdio: 'pipe' },
  );
} catch (falha) {
  console.error('O navegador nao conseguiu gerar o PDF.');
  console.error(String(falha.stderr ?? falha.message ?? falha).slice(0, 600));
  process.exit(1);
} finally {
  rmSync(pasta, { recursive: true, force: true });
}

if (!existsSync(SAIDA)) {
  console.error('O navegador terminou sem erro, mas o PDF nao apareceu.');
  process.exit(1);
}

const kb = Math.round(statSync(SAIDA).size / 1024);
console.log(`PDF gerado: ${SAIDA} (${kb} KB)`);
console.log(`Origem: HISTORICO.md  |  Navegador: ${navegador}`);
