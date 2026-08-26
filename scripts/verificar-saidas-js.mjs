/**
 * Roda uma solucao de referencia para cada exercicio `output_match` da trilha
 * de JavaScript e compara com a saida esperada guardada no curriculo.
 *
 * O ponto importante: o codigo NAO e executado com um `eval` improvisado aqui.
 * Este script carrega `public/js-runtime.js` - o MESMO arquivo que o
 * `public/js-worker.js` usa no navegador - e chama a mesma funcao `executar`.
 * Assim, se este teste passa, o aluno ve exatamente o mesmo resultado: a
 * formatacao do `console.log`, o `prompt` alimentado pelo stdin e as mensagens
 * de erro sao produzidos pelo codigo de producao, nao por uma imitacao.
 *
 * A normalizacao da saida e a mesma de `src/lib/exercises/validate.ts`.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');

/* ---------------------------------------------------------------------------
 * O runtime de producao, carregado do arquivo que vai para o navegador
 * ------------------------------------------------------------------------ */

const contexto = vm.createContext({});
vm.runInContext(readFileSync(resolve(raiz, 'public', 'js-runtime.js'), 'utf8'), contexto, {
  filename: 'js-runtime.js',
});
const { executar } = contexto.CQJSRuntime;

/* ---------------------------------------------------------------------------
 * Solucoes de referencia
 *
 * Uma por exercicio de codigo, escrita como um aluno resolveria - inclusive
 * usando so o que ja foi ensinado ate aquela licao.
 * ------------------------------------------------------------------------ */

export const SOLUCOES = {
  /* ----------------------------------------------------------- Fundamentos */
  'js-fund-02-e1': 'console.log("Olá, CodeQuest!");',
  'js-fund-02-e2':
    'console.log("Meu nome é Dev");\nconsole.log("Estou aprendendo JavaScript");',
  'js-fund-03-e2': '// console.log("teste temporário");\nconsole.log("Relatório final");',
  'js-fund-04-e2': 'let mensagem = "Tudo certo!";\nconsole.log(mensagem);',
  'js-fund-05-e1':
    'const cidade = prompt("De qual cidade você é? ");\nconsole.log("Boa viagem para " + cidade);',

  /* ------------------------------------------------------------- Variaveis */
  'js-var-01-e1': 'const nome = "Ana";\nconsole.log(nome);',
  'js-var-02-e2': 'console.log("10" + 5);\nconsole.log(10 + 5);',
  'js-var-03-e1':
    'const numero = Number(prompt("Digite um número: "));\nconsole.log(numero + 10);',
  'js-var-04-e1':
    'const nome = "Ana";\nconst nota1 = 7;\nconst nota2 = 9;\nconsole.log(`A média de ${nome} é ${(nota1 + nota2) / 2}`);',

  /* ---------------------------------------------------------- Condicionais */
  'js-cond-01-e2': 'const compra = 150;\n\nif (compra > 100) {\n  console.log("Tem desconto");\n}',
  'js-cond-02-e1':
    'const idade = Number(prompt("Digite sua idade: "));\n\nif (idade >= 18) {\n  console.log("Maior de idade");\n} else {\n  console.log("Menor de idade");\n}',
  'js-cond-02-e2':
    'const idade = Number(prompt("Digite sua idade: "));\n\nif (idade >= 18) {\n  console.log("Maior de idade");\n} else {\n  console.log("Menor de idade");\n}',
  'js-cond-03-e1':
    'const temperatura = 12;\n\nif (temperatura > 30) {\n  console.log("Calor");\n} else if (temperatura >= 15) {\n  console.log("Ameno");\n} else {\n  console.log("Frio");\n}',
  'js-cond-04-e1':
    'const idade = 22;\nconst temHabilitacao = false;\n\nif (idade >= 18 && temHabilitacao) {\n  console.log("Pode dirigir");\n} else {\n  console.log("Não pode dirigir");\n}',

  /* ------------------------------------------------------------ Repeticoes */
  'js-rep-01-e1': 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
  'js-rep-02-e1':
    'let contador = 3;\n\nwhile (contador >= 1) {\n  console.log(contador);\n  contador--;\n}\n\nconsole.log("Fim");',
  'js-rep-03-e1':
    'let soma = 0;\n\nfor (let i = 1; i <= 100; i++) {\n  soma += i;\n}\n\nconsole.log(soma);',
  'js-rep-03-e2':
    'let quantidade = 0;\n\nfor (let i = 1; i <= 20; i++) {\n  if (i % 3 === 0) {\n    quantidade++;\n  }\n}\n\nconsole.log(quantidade);',
  'js-rep-04-e1':
    'for (let i = 1; i <= 10; i++) {\n  if (i === 7) {\n    continue;\n  }\n  console.log(i);\n}',
  'js-rep-04-e2':
    'const linguagens = ["Python", "JavaScript", "Java"];\n\nfor (const linguagem of linguagens) {\n  console.log(linguagem);\n}',

  /* --------------------------------------------------------------- Funcoes */
  'js-func-01-e1':
    'function abrirJogo() {\n  console.log("Partida iniciada");\n}\n\nabrirJogo();\nabrirJogo();',
  'js-func-02-e1':
    'function calcularMedia(a, b) {\n  return (a + b) / 2;\n}\n\nconsole.log(calcularMedia(7, 9));',
  'js-func-03-e1':
    'const ehPar = (numero) => numero % 2 === 0;\n\nconsole.log(ehPar(4));\nconsole.log(ehPar(7));',
  'js-func-04-e2':
    'let contador = 0;\n\nfunction registrar() {\n  contador++;\n  console.log(contador);\n}\n\nregistrar();\nregistrar();\nregistrar();',

  /* -------------------------------------------------------------- Desafios */
  'js-des-01-e1':
    'for (let i = 1; i <= 15; i++) {\n  if (i % 3 === 0 && i % 5 === 0) {\n    console.log("FizzBuzz");\n  } else if (i % 3 === 0) {\n    console.log("Fizz");\n  } else if (i % 5 === 0) {\n    console.log("Buzz");\n  } else {\n    console.log(i);\n  }\n}',
  'js-des-02-e1':
    'function validarSenha(senha) {\n  if (senha.length < 8) {\n    return "Senha muito curta";\n  }\n  if (senha === "12345678") {\n    return "Senha óbvia demais";\n  }\n  return "Senha aceita";\n}\n\nconsole.log(validarSenha("abc"));\nconsole.log(validarSenha("12345678"));\nconsole.log(validarSenha("codequest2026"));',
  'js-des-02-e2': 'const email = "  ANA@Email.COM  ";\n\nconsole.log(email.trim().toLowerCase());',
  'js-des-03-e1':
    'const notas = [7, 9.5, 4, 8.5];\n\nconst aprovadas = notas.filter((nota) => nota >= 7);\nconst soma = notas.reduce((total, nota) => total + nota, 0);\n\nconsole.log(`Aprovadas: ${aprovadas.length}`);\nconsole.log(`Média: ${soma / notas.length}`);',
  'js-des-03-e2':
    'const precos = [10, 20, 30];\n\nconst comDesconto = precos.map((preco) => preco * 0.9);\nconsole.log(comDesconto.join(", "));',

  /* --------------------------------------------------------- Projeto final */
  'js-proj-01-e1':
    'const aluno = { nome: "Ana", nota: 9 };\n\nconsole.log(aluno.nome);\nconsole.log(aluno.nota);',
  'js-proj-02-e1':
    'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}\n\nconsole.log(situacao(8));\nconsole.log(situacao(6));\nconsole.log(situacao(3));',
  'js-proj-02-e2':
    'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}\n\nconst turma = [\n  { nome: "Ana", nota1: 7, nota2: 9 },\n  { nome: "Luiz", nota1: 4, nota2: 5 },\n  { nome: "Kauan", nota1: 6, nota2: 6 },\n];\n\nfor (const aluno of turma) {\n  const media = (aluno.nota1 + aluno.nota2) / 2;\n  console.log(`${aluno.nome}: média ${media} - ${situacao(media)}`);\n}',
  'js-proj-02-e3':
    'function situacao(media) {\n  if (media >= 7) return "Aprovado";\n  if (media >= 5) return "Recuperação";\n  return "Reprovado";\n}\n\nconst turma = [\n  { nome: "Ana", nota1: 7, nota2: 9 },\n  { nome: "Luiz", nota1: 4, nota2: 5 },\n  { nome: "Kauan", nota1: 6, nota2: 6 },\n];\n\nlet somaDasMedias = 0;\nlet aprovados = 0;\n\nfor (const aluno of turma) {\n  const media = (aluno.nota1 + aluno.nota2) / 2;\n  console.log(`${aluno.nome}: média ${media} - ${situacao(media)}`);\n  somaDasMedias += media;\n  if (situacao(media) === "Aprovado") {\n    aprovados++;\n  }\n}\n\nconsole.log("---");\nconsole.log(`Média da turma: ${Math.round((somaDasMedias / turma.length) * 100) / 100}`);\nconsole.log(`Aprovados: ${aprovados} de ${turma.length}`);',
};

/* ---------------------------------------------------------------------------
 * A mesma normalizacao de `normalizeOutput` em src/lib/exercises/validate.ts
 * ------------------------------------------------------------------------ */

const normalizar = (valor) =>
  valor
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((linha) => linha.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
    .trim();

/* ---------------------------------------------------------------------------
 * Conferencia
 * ------------------------------------------------------------------------ */

/*
 * `SOLUCOES` tambem e importado por `scripts/testar-estrutura.mts`, que confere
 * as regras de estrutura contra estas mesmas solucoes - assim as duas
 * conferencias olham exatamente o mesmo codigo.
 *
 * Por isso a parte de linha de comando fica dentro de um `if`: importar este
 * arquivo nao pode disparar o verificador nem encerrar o processo.
 */
const arquivo = process.argv[2];

if (arquivo) {
  const exercicios = JSON.parse(readFileSync(arquivo, 'utf8'));

  let falhas = 0;
  const semSolucao = [];

  for (const exercicio of exercicios) {
    const codigo = SOLUCOES[exercicio.id];
    if (codigo === undefined) {
      semSolucao.push(exercicio.id);
      continue;
    }

    const resultado = executar(codigo, exercicio.stdin);

    if (resultado.error !== null) {
      falhas += 1;
      console.log(`ERRO   ${exercicio.id}: ${resultado.error.split('\n')[0]}`);
      continue;
    }

    if (normalizar(resultado.stdout) === normalizar(exercicio.expected)) {
      console.log(`ok     ${exercicio.id}`);
    } else {
      falhas += 1;
      console.log(`FALHA  ${exercicio.id}`);
      console.log(`       esperado: ${JSON.stringify(normalizar(exercicio.expected))}`);
      console.log(`       obtido:   ${JSON.stringify(normalizar(resultado.stdout))}`);
    }
  }

  if (semSolucao.length > 0) {
    console.log(`\nsem solucao de referencia: ${semSolucao.join(', ')}`);
  }

  const conferidos = exercicios.length - falhas - semSolucao.length;
  console.log(`\n${conferidos}/${exercicios.length} conferidos com sucesso`);
  process.exit(falhas > 0 || semSolucao.length > 0 ? 1 : 0);
}
