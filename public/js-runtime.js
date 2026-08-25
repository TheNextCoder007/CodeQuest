/*
 * Runtime dos exercicios de JavaScript do CodeQuest.
 *
 * Este arquivo e carregado em DOIS lugares, de proposito:
 *
 *   1. `public/js-worker.js`, no navegador (via importScripts), que e quem
 *      roda o codigo do aluno de verdade;
 *   2. `scripts/verificar-saidas-js.mjs`, no Node, que confere as solucoes de
 *      referencia de cada exercicio.
 *
 * Sendo o MESMO arquivo nos dois, o que o teste aprova e exatamente o que o
 * navegador executa - nao ha como a conferencia passar e o app divergir.
 *
 * Nenhuma dependencia externa: JavaScript ja roda no dispositivo, entao o
 * custo e zero e funciona offline no .apk e no .exe.
 */

(function (raiz) {
  'use strict';

  /* ======================================================================
   * 1. Como um valor vira texto no terminal
   *
   * O `console.log` de verdade mostra objetos de forma interativa, e cada
   * navegador escreve de um jeito. Como os exercicios do tipo output_match
   * comparam a saida caractere por caractere, a formatacao precisa ser
   * NOSSA e deterministica.
   * =================================================================== */

  var PROFUNDIDADE_MAXIMA = 4;
  var IDENTIFICADOR = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

  /** Texto entre aspas duplas, com escapes visiveis (usado dentro de listas). */
  function comAspas(texto) {
    return (
      '"' +
      texto
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t') +
      '"'
    );
  }

  function formatarValor(valor, profundidade, vistos) {
    if (valor === null) return 'null';
    if (valor === undefined) return 'undefined';

    var tipo = typeof valor;

    if (tipo === 'string') return profundidade === 0 ? valor : comAspas(valor);
    if (tipo === 'number') return Object.is(valor, -0) ? '-0' : String(valor);
    if (tipo === 'bigint') return String(valor) + 'n';
    if (tipo === 'boolean') return String(valor);
    if (tipo === 'symbol') return valor.toString();
    if (tipo === 'function') return '[Function: ' + (valor.name || 'anonima') + ']';

    // A partir daqui e objeto. Referencia circular vira um marcador em vez de
    // estourar a pilha - acontece bastante com quem esta aprendendo.
    if (vistos.indexOf(valor) !== -1) return '[circular]';

    if (valor instanceof Error) return valor.name + ': ' + valor.message;
    if (valor instanceof Date) {
      return isNaN(valor.getTime()) ? 'Invalid Date' : valor.toISOString();
    }
    if (valor instanceof RegExp) return String(valor);

    if (profundidade >= PROFUNDIDADE_MAXIMA) {
      return Array.isArray(valor) ? '[Array]' : '[Object]';
    }

    vistos.push(valor);
    try {
      if (Array.isArray(valor)) {
        var itens = [];
        for (var i = 0; i < valor.length; i += 1) {
          // Posicao vazia (`[1, , 3]`) nao e a mesma coisa que `undefined`.
          itens.push(i in valor ? formatarValor(valor[i], profundidade + 1, vistos) : '<vazio>');
        }
        return itens.length === 0 ? '[]' : '[' + itens.join(', ') + ']';
      }

      if (typeof Map !== 'undefined' && valor instanceof Map) {
        var pares = [];
        valor.forEach(function (v, k) {
          pares.push(
            formatarValor(k, profundidade + 1, vistos) +
              ' => ' +
              formatarValor(v, profundidade + 1, vistos),
          );
        });
        return 'Map(' + valor.size + ') {' + (pares.length ? ' ' + pares.join(', ') + ' ' : '') + '}';
      }

      if (typeof Set !== 'undefined' && valor instanceof Set) {
        var elementos = [];
        valor.forEach(function (v) {
          elementos.push(formatarValor(v, profundidade + 1, vistos));
        });
        return (
          'Set(' + valor.size + ') {' + (elementos.length ? ' ' + elementos.join(', ') + ' ' : '') + '}'
        );
      }

      var chaves = Object.keys(valor);
      var corpo = [];
      for (var c = 0; c < chaves.length; c += 1) {
        var chave = chaves[c];
        var rotulo = IDENTIFICADOR.test(chave) ? chave : comAspas(chave);
        corpo.push(rotulo + ': ' + formatarValor(valor[chave], profundidade + 1, vistos));
      }

      // Instancia de classe aparece com o nome dela na frente, como no Node.
      var prefixo = '';
      var construtor = valor.constructor;
      if (construtor && construtor.name && construtor.name !== 'Object') {
        prefixo = construtor.name + ' ';
      }

      return prefixo + (corpo.length === 0 ? '{}' : '{ ' + corpo.join(', ') + ' }');
    } finally {
      vistos.pop();
    }
  }

  /** Uma chamada de console.log vira uma linha: argumentos separados por espaco. */
  function formatarArgumentos(argumentos) {
    var partes = [];
    for (var i = 0; i < argumentos.length; i += 1) {
      partes.push(formatarValor(argumentos[i], 0, []));
    }
    return partes.join(' ');
  }

  /* ======================================================================
   * 2. Compilacao do codigo do aluno
   *
   * `new Function` (e nao `eval`) para que o codigo do aluno NAO enxergue as
   * variaveis internas deste arquivo: dentro dele so existem os nomes
   * declarados como parametro e os globais.
   *
   * O `"use strict"` e proposital e pedagogico: sem ele, `nome = "Ana"` sem
   * `let` cria uma variavel global em silencio. Com ele o aluno recebe um
   * ReferenceError claro - que e exatamente o que a licao de variaveis
   * ensina a evitar.
   * =================================================================== */

  function compilar(codigo) {
    return new Function('console', 'prompt', 'alert', '"use strict";\n' + codigo);
  }

  /*
   * Quantas linhas o `new Function` acrescenta antes da primeira linha do
   * aluno. Em vez de chutar 2 ou 3 (o valor muda entre motores), medimos uma
   * vez com uma sonda que passa pela MESMA compilacao.
   */
  var DESLOCAMENTO = (function () {
    try {
      compilar('throw new Error("cq-sonda");')();
    } catch (erro) {
      var achado = /<anonymous>:(\d+):/.exec(String((erro && erro.stack) || ''));
      if (achado) return Number(achado[1]) - 1;
    }
    return 2;
  })();

  /** Linha do codigo do aluno onde o erro aconteceu, ou null se nao der para saber. */
  function linhaDoErro(erro) {
    var achado = /<anonymous>:(\d+):/.exec(String((erro && erro.stack) || ''));
    if (!achado) return null;
    var linha = Number(achado[1]) - DESLOCAMENTO;
    return linha > 0 ? linha : null;
  }

  /** Mensagem curta e util: tipo do erro, descricao e a linha do aluno. */
  function formatarErro(erro, linhasDoCodigo) {
    var descricao =
      erro instanceof Error
        ? (erro.name || 'Error') + ': ' + erro.message
        : 'Valor lancado que nao e um erro: ' + formatarValor(erro, 1, []);

    var linha = linhaDoErro(erro);
    if (linha === null || linha > linhasDoCodigo.length) return descricao;

    var trecho = linhasDoCodigo[linha - 1];
    return 'Linha ' + linha + ': ' + descricao + (trecho ? '\n    ' + trecho.trim() : '');
  }

  /* ======================================================================
   * 3. Execucao
   * =================================================================== */

  /**
   * Roda o codigo do aluno e devolve `{ stdout, error }`.
   *
   * `entradas` alimenta o `prompt()` na ordem, do mesmo jeito que o `stdin`
   * dos exercicios de Python alimenta o `input()`.
   */
  function executar(codigo, entradas) {
    var texto = String(codigo == null ? '' : codigo);
    var linhas = texto.replace(/\r\n/g, '\n').split('\n');
    var fila = (entradas || []).slice();
    var saida = '';

    function escrever(argumentos) {
      saida += formatarArgumentos(argumentos) + '\n';
    }

    // Um console reduzido: tudo cai no mesmo terminal, como o print do Python.
    var consoleFalso = {
      log: function () {
        escrever(arguments);
      },
      info: function () {
        escrever(arguments);
      },
      warn: function () {
        escrever(arguments);
      },
      error: function () {
        escrever(arguments);
      },
      debug: function () {
        escrever(arguments);
      },
    };

    /*
     * `prompt` e o `input()` do navegador. Escreve a pergunta SEM quebrar a
     * linha (igual ao Python) e devolve sempre texto - o que preserva a
     * pegadinha classica de somar duas entradas e receber concatenacao, que a
     * licao de conversao de tipos usa.
     */
    function promptFalso(mensagem) {
      if (mensagem !== undefined) saida += formatarValor(mensagem, 0, []);
      if (fila.length === 0) {
        throw new Error('O programa pediu mais entradas do que este exercicio fornece.');
      }
      return String(fila.shift());
    }

    // Nao e usado nas licoes, mas se o aluno escrever `alert` por conta
    // propria e melhor mostrar no terminal do que estourar um erro.
    function alertFalso(valor) {
      saida += formatarValor(valor, 0, []) + '\n';
    }

    var programa;
    try {
      programa = compilar(texto);
    } catch (erroDeSintaxe) {
      // SyntaxError acontece na COMPILACAO: nao existe pilha com a linha do aluno.
      return {
        stdout: saida,
        error:
          'Erro de sintaxe: ' +
          (erroDeSintaxe && erroDeSintaxe.message ? erroDeSintaxe.message : String(erroDeSintaxe)),
      };
    }

    try {
      programa(consoleFalso, promptFalso, alertFalso);
    } catch (erro) {
      return { stdout: saida, error: formatarErro(erro, linhas) };
    }

    return { stdout: saida, error: null };
  }

  raiz.CQJSRuntime = {
    executar: executar,
    formatar: function (valor) {
      return formatarValor(valor, 0, []);
    },
  };
})(typeof self !== 'undefined' ? self : globalThis);
