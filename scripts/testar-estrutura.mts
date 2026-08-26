/**
 * Testes da conferencia de ESTRUTURA do codigo dos exercicios.
 *
 * ---------------------------------------------------------------------------
 * O BUG QUE ISTO FECHA
 *
 * `checkOutputMatch` sempre comparou apenas o texto impresso. Em "some os
 * numeros de 1 a 100", `print(5050)` produzia a saida esperada e era aceito -
 * o aluno passava sem escrever o laco, que era o assunto inteiro da licao.
 *
 * ---------------------------------------------------------------------------
 * O QUE E CONFERIDO, PARA CADA EXERCICIO DE CODIGO
 *
 *   1. a SOLUCAO DE REFERENCIA passa (nenhuma regra e restritiva demais);
 *   2. a TRAPACA - so imprimir a saida esperada - e recusada;
 *   3. todo exercicio de codigo tem regra (nao da para esquecer um novo).
 *
 * O item 1 e o que importa: e facil escrever uma regra que barra a trapaca e,
 * junto, barra quem resolveu certo. Por isso as duas metades andam sempre
 * juntas aqui.
 *
 * Rodar com: npm run test:estrutura
 */

import { readFileSync } from 'node:fs';
import { allLessons, languageOfModule } from '../src/content/index';
import { REQUISITOS } from '../src/content/requisitos';
import { apenasCodigo, conferirEstrutura } from '../src/lib/exercises/estrutura';

let passaram = 0;
let falharam = 0;

const ok = (condicao: boolean, titulo: string) => {
  if (condicao) {
    passaram += 1;
  } else {
    falharam += 1;
    console.error(`FALHOU ${titulo}`);
  }
};

const secao = (titulo: string) => console.log(`\n--- ${titulo} ---`);

interface Solucao {
  lang: string;
  codigo: string;
}

const SOLUCOES: Record<string, Solucao> = JSON.parse(
  readFileSync('scripts/solucoes-referencia.json', 'utf8'),
);

/* =========================================================================
 * 1. O varredor de comentarios e textos
 * ====================================================================== */
secao('apenasCodigo (comentarios e textos saem de cena)');

const casos: [string, string, string, boolean][] = [
  // codigo, linguagem, o que se procura, deve achar?
  ['# for numero in range(5)\nprint(1)', 'python', '\\bfor\\b', false],
  ['for n in range(5):\n    print(n)', 'python', '\\bfor\\b', true],
  ['print("for")', 'python', '\\bfor\\b', false],
  ['print("""for""")', 'python', '\\bfor\\b', false],
  ['// for (let i = 0)\nconsole.log(1)', 'javascript', '\\bfor\\b', false],
  ['/* for */\nconsole.log(1)', 'javascript', '\\bfor\\b', false],
  ['console.log("for")', 'javascript', '\\bfor\\b', false],
  ['console.log(`for`)', 'javascript', '\\bfor\\b', false],
  ['for (let i = 0; i < 5; i++) {}', 'javascript', '\\bfor\\b', true],
  // Aspa escapada NAO fecha o texto: o `for` continua dentro das aspas.
  ["print('nao \\' fecha for')", 'python', '\\bfor\\b', false],
  // Interpolacao E codigo: o `/` de dentro das chaves precisa sobreviver.
  ['print(f"media {(a + b) / 2}")', 'python', '/', true],
  ['console.log(`media ${(a + b) / 2}`)', 'javascript', '/', true],
  ['console.log(`so texto`)', 'javascript', '/', false],
];

for (const [codigo, lang, padrao, esperado] of casos) {
  const limpo = apenasCodigo(codigo, lang);
  const achou = new RegExp(padrao, 'm').test(limpo);
  ok(achou === esperado, `${lang}: ${JSON.stringify(codigo).slice(0, 46)} -> esperava ${esperado}`);
}
console.log(`ok     ${casos.length} casos do varredor`);

/* =========================================================================
 * 2. Todo exercicio de codigo tem regra
 * ====================================================================== */
secao('cobertura');

const exerciciosDeCodigo = allLessons().flatMap((licao) =>
  licao.exercises
    .filter((e) => e.validationType === 'output_match')
    .map((e) => ({ e, lang: languageOfModule(licao.moduleId)!.slug })),
);

const semRegra = exerciciosDeCodigo.filter(({ e }) => !REQUISITOS[e.id]).map(({ e }) => e.id);
ok(semRegra.length === 0, `exercicios de codigo sem regra: ${semRegra.join(', ')}`);
console.log(`ok     ${exerciciosDeCodigo.length} exercicios de codigo, todos com regra`);

const semSolucao = exerciciosDeCodigo.filter(({ e }) => !SOLUCOES[e.id]).map(({ e }) => e.id);
ok(semSolucao.length === 0, `exercicios sem solucao de referencia: ${semSolucao.join(', ')}`);

const regraOrfa = Object.keys(REQUISITOS).filter(
  (id) => !exerciciosDeCodigo.some(({ e }) => e.id === id),
);
ok(regraOrfa.length === 0, `regras apontando para exercicio inexistente: ${regraOrfa.join(', ')}`);

/* =========================================================================
 * 3. A solucao de referencia passa
 * ====================================================================== */
secao('a solucao de referencia continua sendo aceita');

const reprovadas: string[] = [];
for (const { e, lang } of exerciciosDeCodigo) {
  const solucao = SOLUCOES[e.id];
  if (!solucao) continue;
  const falha = conferirEstrutura(solucao.codigo, lang, e.requisitos);
  if (falha) reprovadas.push(`${e.id} (${falha.tipo})`);
}
ok(reprovadas.length === 0, `solucoes de referencia recusadas: ${reprovadas.join(', ')}`);
console.log(`ok     ${exerciciosDeCodigo.length} solucoes de referencia aceitas`);

/* =========================================================================
 * 4. A trapaca e recusada
 *
 * A trapaca imita o que o aluno faria: um unico comando imprimindo a saida
 * esperada, letra por letra.
 * ====================================================================== */
secao('a trapaca (imprimir a saida pronta) e recusada');

/** `print("...")` / `console.log("...")` com a saida esperada inteira. */
const trapacear = (esperado: string, lang: string): string => {
  const texto = JSON.stringify(esperado);
  return lang === 'python' ? `print(${texto})` : `console.log(${texto})`;
};

/** Variacao: uma linha de saida por comando, que e o mais natural de tentar. */
const trapacearLinhaALinha = (esperado: string, lang: string): string =>
  esperado
    .split('\n')
    .map((linha) =>
      lang === 'python' ? `print(${JSON.stringify(linha)})` : `console.log(${JSON.stringify(linha)})`,
    )
    .join('\n');

const passouTrapaca: string[] = [];
let isentos = 0;
for (const { e, lang } of exerciciosDeCodigo) {
  /*
   * Nos primeiros exercicios ("mostre Olá na tela") escrever o texto literal
   * E a resposta certa - nao existe trapaca a barrar. A isencao fica marcada
   * no proprio catalogo (`literalEhASolucao`), para ser deliberada e visivel
   * em vez de esses casos passarem despercebidos aqui.
   */
  if (e.requisitos?.literalEhASolucao) {
    isentos += 1;
    continue;
  }
  for (const tentativa of [
    trapacear(e.expectedAnswer, lang),
    trapacearLinhaALinha(e.expectedAnswer, lang),
  ]) {
    const falha = conferirEstrutura(tentativa, lang, e.requisitos);
    if (!falha) passouTrapaca.push(e.id);
  }
}
ok(
  passouTrapaca.length === 0,
  `trapaca ACEITA em: ${[...new Set(passouTrapaca)].join(', ')}`,
);
console.log(
  `ok     ${(exerciciosDeCodigo.length - isentos) * 2} tentativas de trapaca recusadas ` +
    `(2 formatos x ${exerciciosDeCodigo.length - isentos} exercicios; ` +
    `${isentos} isentos, onde o literal e a licao)`,
);

/* =========================================================================
 * 5. Trapaca disfarcada de comentario
 * ====================================================================== */
secao('comentario nao satisfaz exigencia');

const disfarces: string[] = [];
for (const { e, lang } of exerciciosDeCodigo) {
  const exige = e.requisitos?.exige;
  if (!exige || exige.length === 0 || e.requisitos?.literalEhASolucao) continue;

  // Escreve a trapaca e, num comentario, jura que usou a estrutura pedida.
  const comentario = lang === 'python' ? '# for while def if and return range' : '// for while function if return of';
  const tentativa = `${comentario}\n${trapacear(e.expectedAnswer, lang)}`;
  if (!conferirEstrutura(tentativa, lang, e.requisitos)) disfarces.push(e.id);
}
ok(disfarces.length === 0, `comentario passou por estrutura em: ${disfarces.join(', ')}`);
console.log('ok     comentario com as palavras certas nao engana a conferencia');

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
