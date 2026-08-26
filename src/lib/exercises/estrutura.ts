import type { RequisitosDeCodigo } from '@/types/content';

/**
 * Conferencia da ESTRUTURA do codigo, e nao so da saida.
 *
 * O problema que isto resolve: `checkOutputMatch` sempre comparou apenas o
 * texto impresso. Num exercicio como "some os numeros de 1 a 100", escrever
 * `print(5050)` produz exatamente a saida esperada - e passava. O aluno
 * "acertava" sem escrever um laco, que era o unico assunto da licao.
 *
 * Cada exercicio declara o que precisa aparecer (`exige`) e o que nao pode
 * aparecer (`proibe`) em `src/content/requisitos.ts`.
 *
 * Duas leituras diferentes do mesmo codigo:
 *
 *   - `exige` olha o codigo SEM comentarios e SEM o texto das aspas. Sem
 *     isso, `# for` ou `print("for")` satisfariam a exigencia de usar `for`;
 *   - `proibe` olha o codigo CRU, justamente porque o que se quer barrar
 *     costuma estar dentro de aspas (`print("5050")`).
 */

export interface FalhaDeEstrutura {
  tipo: 'exige' | 'proibe';
  /** Explicacao para o aluno. */
  motivo: string;
}

/** O que ha dentro de `{...}` numa f-string e de `${...}` num template. */
const abreInterpolacao = (
  codigo: string,
  i: number,
  interpolavel: 'python' | 'javascript' | null,
): boolean => {
  if (interpolavel === 'python') return codigo[i] === '{';
  if (interpolavel === 'javascript') return codigo[i] === '$' && codigo[i + 1] === '{';
  return false;
};

/**
 * Devolve o codigo sem comentarios e sem o TEXTO das aspas - mas **com** o
 * que estiver interpolado.
 *
 * A interpolacao e o detalhe que faz diferenca: em
 * `print(f"média {(a + b) / 2}")` o `/` esta dentro das aspas, so que e
 * codigo de verdade. Descartar tudo entre aspas fazia a exigencia de "usa
 * divisao" reprovar a propria solucao de referencia.
 *
 * Nao e um analisador completo - e um varredor de um caractere por vez, que
 * cobre o que os exercicios usam. As aspas viram um par vazio em vez de
 * sumirem, para uma exigencia poder pedir `f"` ou a crase.
 */
export const apenasCodigo = (codigo: string, linguagem: string): string => {
  const python = linguagem === 'python';
  let saida = '';
  let i = 0;

  while (i < codigo.length) {
    const c = codigo[i];
    const par = codigo.slice(i, i + 2);
    const trio = codigo.slice(i, i + 3);

    // Comentario ate o fim da linha.
    if ((python && c === '#') || (!python && par === '//')) {
      while (i < codigo.length && codigo[i] !== '\n') i += 1;
      continue;
    }

    // Comentario de bloco (so JavaScript).
    if (!python && par === '/*') {
      i += 2;
      while (i < codigo.length && codigo.slice(i, i + 2) !== '*/') i += 1;
      i += 2;
      continue;
    }

    const tresAspas = python && (trio === '"""' || trio === "'''");
    const umaAspa = c === '"' || c === "'" || (!python && c === '`');

    if (tresAspas || umaAspa) {
      const fecha = tresAspas ? trio : c;
      const tamanhoDaAspa = tresAspas ? 3 : 1;

      /*
       * Isto e uma f-string / template literal? So nesse caso o miolo de
       * `{...}` / `${...}` conta como codigo.
       *
       * Para Python, o prefixo (`f`, `rf`, `F`...) ja foi emitido em `saida`,
       * entao basta olhar as letras coladas no fim dela.
       */
      const prefixo = /[A-Za-z]*$/.exec(saida)?.[0] ?? '';
      const interpolavel: 'python' | 'javascript' | null = python
        ? /f/i.test(prefixo)
          ? 'python'
          : null
        : c === '`'
          ? 'javascript'
          : null;

      i += tamanhoDaAspa;
      saida += fecha + fecha;

      while (i < codigo.length && codigo.slice(i, i + tamanhoDaAspa) !== fecha) {
        // Aspa escapada nao fecha o texto.
        if (codigo[i] === '\\') {
          i += 2;
          continue;
        }

        // `{{` e uma chave literal numa f-string, nao uma interpolacao.
        if (interpolavel === 'python' && codigo.slice(i, i + 2) === '{{') {
          i += 2;
          continue;
        }

        if (abreInterpolacao(codigo, i, interpolavel)) {
          i += interpolavel === 'javascript' ? 2 : 1;
          let nivel = 1;
          let miolo = '';
          while (i < codigo.length && nivel > 0) {
            if (codigo[i] === '{') nivel += 1;
            else if (codigo[i] === '}') {
              nivel -= 1;
              if (nivel === 0) break;
            }
            miolo += codigo[i];
            i += 1;
          }
          i += 1; // consome o `}`
          // O miolo e codigo: entra recursivamente, para um texto aninhado
          // dentro da interpolacao tambem ser tratado.
          saida += ` ${apenasCodigo(miolo, linguagem)} `;
          continue;
        }

        i += 1;
      }

      i += tamanhoDaAspa;
      continue;
    }

    saida += c;
    i += 1;
  }

  return saida;
};

/** Um padrao bate no texto? Aceita regex em texto ou trecho literal. */
const bate = (texto: string, padrao: string): boolean => {
  try {
    // `m` para os padroes poderem ancorar em inicio de linha (`^`), que e
    // como se detecta "esta linha continua ativa, nao foi comentada".
    return new RegExp(padrao, 'm').test(texto);
  } catch {
    // Padrao invalido vira busca literal, para nunca derrubar a correcao.
    return texto.includes(padrao);
  }
};

const MOTIVO_PADRAO = {
  exige: 'A saída está certa, mas o código não usa o que esta lição pede. Releia o enunciado.',
  proibe:
    'A saída está certa, mas o resultado foi escrito à mão em vez de ser calculado. O exercício é justamente sobre calcular.',
} as const;

/**
 * Confere os requisitos. Devolve a primeira falha, ou `null` se estiver tudo
 * certo (inclusive quando o exercicio nao declara requisito nenhum).
 */
export const conferirEstrutura = (
  codigo: string,
  linguagem: string,
  requisitos?: RequisitosDeCodigo,
): FalhaDeEstrutura | null => {
  if (!requisitos) return null;

  const limpo = apenasCodigo(codigo, linguagem);

  for (const padrao of requisitos.exige ?? []) {
    if (!bate(limpo, padrao)) {
      return { tipo: 'exige', motivo: requisitos.motivo ?? MOTIVO_PADRAO.exige };
    }
  }

  for (const padrao of requisitos.proibe ?? []) {
    if (bate(codigo, padrao)) {
      return { tipo: 'proibe', motivo: requisitos.motivo ?? MOTIVO_PADRAO.proibe };
    }
  }

  return null;
};
