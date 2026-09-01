import type { RequisitosDeCodigo } from '@/types/content';

/**
 * O que cada exercicio de codigo exige na ESTRUTURA, alem da saida bater.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISTO EXISTE
 *
 * Desde a primeira versao do projeto, `checkOutputMatch` comparava apenas o
 * texto impresso. Em "some os numeros de 1 a 100", escrever `print(5050)`
 * gerava exatamente a saida esperada e era aceito - o aluno passava sem
 * escrever o laco, que era o unico assunto da licao.
 *
 * ---------------------------------------------------------------------------
 * COMO LER AS REGRAS
 *
 *   exige   - padroes que PRECISAM aparecer, conferidos no codigo sem
 *             comentarios e sem o conteudo dos textos (para `# for` ou
 *             `print("for")` nao valerem por um `for` de verdade);
 *   proibe  - padroes que NAO podem aparecer, conferidos no codigo CRU,
 *             porque a trapaca costuma estar dentro de aspas;
 *   motivo  - o que o aluno le quando nao cumpre.
 *
 * Sao expressoes regulares (com a flag `m`). Um exercicio sem entrada aqui
 * nao tem exigencia nenhuma - e proposital nos primeiros, onde imprimir o
 * texto literal E a licao.
 *
 * ---------------------------------------------------------------------------
 * COMO CONFERIR
 *
 * `npm run test:estrutura` roda, para CADA exercicio: a solucao de referencia
 * (que precisa passar) e uma trapaca que so imprime a saida esperada (que
 * precisa ser recusada). Nenhuma regra daqui foi escrita sem esse par.
 */

const CALCULE = 'A saída está certa, mas o resultado foi escrito à mão em vez de ser calculado — e calcular é justamente o assunto desta lição.';
const USE_A_ESTRUTURA = (o: string) =>
  `A saída está certa, mas o código não usa ${o}, que é o que esta lição ensina.`;

export const REQUISITOS: Record<string, RequisitosDeCodigo> = {
  /* =====================================================================
   * PYTHON - Fundamentos
   * ================================================================== */
  'py-fund-02-e1': { literalEhASolucao: true, exige: ['print\\s*\\('], motivo: USE_A_ESTRUTURA('print()') },
  'py-fund-02-e2': { literalEhASolucao: true,
    exige: ['print\\s*\\([\\s\\S]*print\\s*\\('],
    motivo: 'São duas linhas, então são dois print(). Cada um já pula de linha sozinho.',
  },
  'py-fund-03-e2': { literalEhASolucao: true,
    exige: ['print\\s*\\('],
    // Linha do teste ainda ativa (sem `#` na frente) = nao foi comentada.
    proibe: ['^\\s*print\\s*\\(\\s*["\']teste'],
    motivo: 'Comente a linha do teste com # em vez de apagá-la — é isso que a lição pratica.',
  },
  /*
   * ATENCAO ao comparar com `js-fund-04-e2`: os dois tem o mesmo numero e a
   * mesma saida ("Tudo certo!"), mas NAO sao o mesmo exercicio.
   *
   *   JavaScript - erro de digitacao no nome da variavel
   *                (`let mensagem` / `console.log(menssagem)`);
   *   Python     - parentese que ficou sem fechar (`print("Tudo certo!"`).
   *
   * A regra daqui ja foi a do JavaScript, copiada: exigia `print(mensagem)`
   * num exercicio onde nao existe variavel nenhuma. A resposta certa - fechar
   * o parentese - era recusada, com uma mensagem que falava de uma variavel
   * que o aluno nunca viu. Aqui imprimir o literal E a licao, como nos outros
   * exercicios de `literalEhASolucao`.
   */
  'py-fund-04-e2': {
    literalEhASolucao: true,
    exige: ['print\\s*\\('],
    motivo: USE_A_ESTRUTURA('print()'),
  },
  'py-fund-05-e1': {
    exige: ['input\\s*\\(', 'print\\s*\\('],
    proibe: ['Recife'],
    motivo: 'A cidade tem de vir do input(), não estar escrita no código.',
  },

  /* =====================================================================
   * PYTHON - Variaveis
   * ================================================================== */
  'py-var-01-e1': {
    exige: ['nome\\s*=', 'print\\s*\\(\\s*nome\\s*\\)'],
    motivo: 'Guarde o texto na variável `nome` e mostre a variável, não o texto direto.',
  },
  'py-var-02-e2': {
    exige: ['print\\s*\\([\\s\\S]*print\\s*\\('],
    proibe: ['105'],
    motivo: CALCULE,
  },
  'py-var-03-e1': {
    exige: ['int\\s*\\(', 'input\\s*\\('],
    proibe: ['42'],
    motivo: 'O número tem de vir do input() convertido com int(), e a soma ser feita pelo programa.',
  },
  'py-var-04-e1': {
    exige: ['f["\']', '/'],
    proibe: ['A média de Ana é 8'],
    motivo: 'Use uma f-string e deixe a divisão para o Python calcular.',
  },

  /* =====================================================================
   * PYTHON - Condicionais
   * ================================================================== */
  'py-cond-01-e2': { exige: ['\\bif\\b'], motivo: USE_A_ESTRUTURA('if') },
  'py-cond-02-e1': {
    exige: ['\\bif\\b', '\\belse\\b', 'input\\s*\\(', 'int\\s*\\('],
    motivo: USE_A_ESTRUTURA('if / else com o valor lido do input()'),
  },
  'py-cond-02-e2': {
    exige: ['\\bif\\b', '\\belse\\b', 'input\\s*\\(', 'int\\s*\\('],
    motivo: USE_A_ESTRUTURA('if / else com o valor lido do input()'),
  },
  'py-cond-03-e1': {
    exige: ['\\bif\\b', '\\belif\\b', '\\belse\\b'],
    motivo: USE_A_ESTRUTURA('if / elif / else'),
  },
  'py-cond-04-e1': { exige: ['\\bif\\b', '\\band\\b'], motivo: USE_A_ESTRUTURA('if com and') },

  /* =====================================================================
   * PYTHON - Repeticoes
   * ================================================================== */
  'py-rep-01-e1': { exige: ['\\bfor\\b', 'range\\s*\\('], motivo: USE_A_ESTRUTURA('for com range()') },
  'py-rep-02-e1': { exige: ['\\bwhile\\b'], motivo: USE_A_ESTRUTURA('while') },
  'py-rep-03-e1': { exige: ['\\bfor\\b'], proibe: ['5050'], motivo: CALCULE },
  'py-rep-03-e2': {
    exige: ['\\bfor\\b', '%'],
    proibe: ['print\\s*\\(\\s*6\\s*\\)'],
    motivo: CALCULE,
  },
  'py-rep-04-e1': {
    exige: ['\\bfor\\b', '\\bcontinue\\b'],
    motivo: USE_A_ESTRUTURA('continue para pular o 7'),
  },

  /* =====================================================================
   * PYTHON - Listas
   * ================================================================== */
  'py-lis-01-e1': {
    exige: ['cores\\s*=\\s*\\[', 'cores\\s*\\['],
    proibe: ['print\\s*\\(\\s*["\']azul'],
    motivo: 'Crie a lista `cores` e mostre os itens por índice, em vez de escrever os textos.',
  },
  'py-lis-01-e2': { exige: ['len\\s*\\('], proibe: ['print\\s*\\(\\s*4\\s*\\)'], motivo: CALCULE },
  'py-lis-02-e1': {
    exige: ['append\\s*\\(', 'print\\s*\\(\\s*time\\s*\\)'],
    motivo: 'Use append() para acrescentar e mostre a própria lista `time`.',
  },
  'py-lis-02-e2': {
    exige: ['fila\\s*\\[\\s*0\\s*\\]\\s*=', 'remove\\s*\\(', 'print\\s*\\(\\s*fila\\s*\\)'],
    motivo: 'Troque pelo índice, remova pelo valor e mostre a própria lista `fila`.',
  },
  'py-lis-03-e1': { exige: ['\\bfor\\b', '\\bin\\b'], motivo: USE_A_ESTRUTURA('um for percorrendo a lista') },
  'py-lis-03-e2': {
    exige: ['\\bfor\\b', '\\bif\\b'],
    proibe: ['print\\s*\\(\\s*30\\s*\\)'],
    motivo: USE_A_ESTRUTURA('um for com if para escolher o que mostrar'),
  },
  'py-lis-04-e1': {
    exige: ['sum\\s*\\(', 'len\\s*\\('],
    proibe: ['40\\s*\\)', '10\\.0'],
    motivo: CALCULE,
  },
  'py-lis-04-e2': {
    // `sorted()` e o ponto da questao: `.sort()` alteraria a lista original e a
    // segunda linha sairia ordenada tambem.
    exige: ['sorted\\s*\\('],
    proibe: ['\\[\\s*3\\s*,\\s*7\\s*,\\s*12\\s*\\]'],
    motivo: 'Use sorted() para não alterar a lista original, e mostre as duas versões.',
  },

  /* =====================================================================
   * PYTHON - Dicionarios
   * ================================================================== */
  'py-dic-01-e1': {
    exige: ['livro\\s*=\\s*\\{', 'livro\\s*\\['],
    proibe: ['print\\s*\\(\\s*["\']Python Fluente'],
    motivo: 'Crie o dicionário `livro` e mostre os valores pela chave, não o texto direto.',
  },
  'py-dic-01-e2': {
    exige: ['perfil\\s*\\[', 'print\\s*\\(\\s*perfil\\s*\\)'],
    motivo: 'Escreva nas chaves de `perfil` e mostre o próprio dicionário.',
  },
  'py-dic-02-e1': {
    exige: ['get\\s*\\('],
    proibe: ['print\\s*\\(\\s*["\']escuro'],
    motivo: 'O valor padrão tem de vir do get(), não estar escrito no print().',
  },
  'py-dic-02-e2': {
    exige: ['\\bif\\b', '\\bin\\b', 'cadastro'],
    /*
     * Ancorado na COLUNA ZERO, sem `\\s*` depois do `^`: a resposta certa tem
     * este mesmo print, mas indentado dentro do `else`. Com `^\\s*` a regra
     * reprovava a propria solucao de referencia.
     */
    proibe: ['^print\\s*\\(\\s*["\']Falta'],
    motivo: USE_A_ESTRUTURA('um if com in para conferir a chave'),
  },
  'py-dic-03-e1': {
    exige: ['\\bfor\\b', 'items\\s*\\('],
    motivo: USE_A_ESTRUTURA('um for com items() para pegar chave e valor'),
  },
  'py-dic-03-e2': {
    exige: ['sum\\s*\\(', 'values\\s*\\('],
    proibe: ['340'],
    motivo: CALCULE,
  },
  'py-dic-04-e1': {
    exige: ['\\bfor\\b', 'contagem\\s*\\['],
    proibe: ['["\']gato["\']\\s*:\\s*3'],
    motivo: 'A contagem tem de ser feita percorrendo a lista, não escrita pronta.',
  },
  'py-dic-04-e2': {
    exige: ['\\bfor\\b', '\\bif\\b', 'maior'],
    proibe: ['print\\s*\\(\\s*["\']Luiz'],
    motivo: 'Descubra o líder percorrendo o dicionário, em vez de escrever o nome.',
  },

  /* =====================================================================
   * PYTHON - Funcoes
   * ================================================================== */
  'py-func-01-e1': { exige: ['\\bdef\\b'], motivo: USE_A_ESTRUTURA('uma função (def)') },
  'py-func-02-e1': {
    exige: ['\\bdef\\b', '\\breturn\\b'],
    proibe: ['8\\.0'],
    motivo: 'A função precisa calcular a média e devolvê-la com return.',
  },
  'py-func-03-e1': {
    exige: ['\\bdef\\b', '\\breturn\\b', '%'],
    proibe: ['print\\s*\\(\\s*True\\s*\\)'],
    motivo: 'A função precisa decidir se o número é par, não devolver a resposta pronta.',
  },

  /* =====================================================================
   * PYTHON - Desafios
   * ================================================================== */
  'py-des-01-e1': { exige: ['\\bfor\\b', '%'], motivo: USE_A_ESTRUTURA('um for com o operador %') },
  'py-des-02-e1': {
    exige: ['\\bdef\\b', '\\breturn\\b', 'len\\s*\\('],
    motivo: USE_A_ESTRUTURA('uma função com return e len()'),
  },
  'py-des-03-e1': { exige: ['\\bfor\\b'], proibe: ['7\\.25'], motivo: CALCULE },

  /* =====================================================================
   * PYTHON - Projeto final
   * ================================================================== */
  'py-proj-01-e1': {
    exige: ['\\bdef\\b', '\\breturn\\b', '\\bif\\b'],
    motivo: USE_A_ESTRUTURA('uma função que devolve o texto com return'),
  },
  'py-proj-01-e2': {
    exige: ['\\bdef\\b', '\\bfor\\b'],
    motivo: USE_A_ESTRUTURA('um for percorrendo a turma'),
  },
  'py-proj-01-e3': {
    exige: ['\\bdef\\b', '\\bfor\\b'],
    proibe: ['6\\.17'],
    motivo: CALCULE,
  },

  /* =====================================================================
   * JAVASCRIPT - Fundamentos
   * ================================================================== */
  'js-fund-02-e1': { literalEhASolucao: true, exige: ['console\\.log\\s*\\('], motivo: USE_A_ESTRUTURA('console.log()') },
  'js-fund-02-e2': { literalEhASolucao: true,
    exige: ['console\\.log\\s*\\([\\s\\S]*console\\.log\\s*\\('],
    motivo: 'São duas linhas, então são dois console.log(). Cada um já pula de linha sozinho.',
  },
  'js-fund-03-e2': { literalEhASolucao: true,
    exige: ['console\\.log\\s*\\('],
    proibe: ['^\\s*console\\.log\\s*\\(\\s*["\']teste'],
    motivo: 'Comente a linha do teste com // em vez de apagá-la — é isso que a lição pratica.',
  },
  'js-fund-04-e2': {
    exige: ['console\\.log\\s*\\(\\s*mensagem\\s*\\)'],
    motivo: 'Corrija o nome da variável no console.log() em vez de escrever o texto direto.',
  },
  'js-fund-05-e1': {
    exige: ['prompt\\s*\\(', 'console\\.log\\s*\\('],
    proibe: ['Recife'],
    motivo: 'A cidade tem de vir do prompt(), não estar escrita no código.',
  },

  /* =====================================================================
   * JAVASCRIPT - Variaveis
   * ================================================================== */
  'js-var-01-e1': {
    exige: ['(const|let|var)\\s+nome', 'console\\.log\\s*\\(\\s*nome\\s*\\)'],
    motivo: 'Guarde o texto na variável `nome` e mostre a variável, não o texto direto.',
  },
  'js-var-02-e2': {
    exige: ['console\\.log\\s*\\([\\s\\S]*console\\.log\\s*\\('],
    proibe: ['105'],
    motivo: CALCULE,
  },
  'js-var-03-e1': {
    exige: ['Number\\s*\\(', 'prompt\\s*\\('],
    proibe: ['15'],
    motivo: 'O número tem de vir do prompt() convertido com Number(), e a soma ser feita pelo programa.',
  },
  'js-var-04-e1': {
    exige: ['`', '/'],
    proibe: ['A média de Ana é 8'],
    motivo: 'Use um template literal com ${} e deixe a divisão para o JavaScript calcular.',
  },

  /* =====================================================================
   * JAVASCRIPT - Condicionais
   * ================================================================== */
  'js-cond-01-e2': { exige: ['\\bif\\s*\\('], motivo: USE_A_ESTRUTURA('if') },
  'js-cond-02-e1': {
    exige: ['\\bif\\s*\\(', '\\belse\\b', 'prompt\\s*\\(', 'Number\\s*\\('],
    motivo: USE_A_ESTRUTURA('if / else com o valor lido do prompt()'),
  },
  'js-cond-02-e2': {
    exige: ['\\bif\\s*\\(', '\\belse\\b', 'prompt\\s*\\(', 'Number\\s*\\('],
    motivo: USE_A_ESTRUTURA('if / else com o valor lido do prompt()'),
  },
  'js-cond-03-e1': {
    exige: ['\\bif\\s*\\(', '\\belse\\s+if\\s*\\(', '\\belse\\s*\\{'],
    motivo: USE_A_ESTRUTURA('if / else if / else'),
  },
  'js-cond-04-e1': { exige: ['\\bif\\s*\\(', '&&'], motivo: USE_A_ESTRUTURA('if com &&') },

  /* =====================================================================
   * JAVASCRIPT - Repeticoes
   * ================================================================== */
  'js-rep-01-e1': { exige: ['\\bfor\\s*\\('], motivo: USE_A_ESTRUTURA('for') },
  'js-rep-02-e1': { exige: ['\\bwhile\\s*\\('], motivo: USE_A_ESTRUTURA('while') },
  'js-rep-03-e1': { exige: ['\\bfor\\s*\\('], proibe: ['5050'], motivo: CALCULE },
  'js-rep-03-e2': {
    exige: ['\\bfor\\s*\\(', '%'],
    proibe: ['console\\.log\\s*\\(\\s*6\\s*\\)'],
    motivo: CALCULE,
  },
  'js-rep-04-e1': {
    exige: ['\\bfor\\s*\\(', '\\bcontinue\\b'],
    motivo: USE_A_ESTRUTURA('continue para pular o 7'),
  },
  'js-rep-04-e2': {
    exige: ['\\bfor\\s*\\(', '\\bof\\b'],
    motivo: USE_A_ESTRUTURA('for...of percorrendo o array'),
  },

  /* =====================================================================
   * JAVASCRIPT - Funcoes
   * ================================================================== */
  'js-func-01-e1': { exige: ['\\bfunction\\b|=>'], motivo: USE_A_ESTRUTURA('uma função') },
  'js-func-02-e1': {
    exige: ['\\bfunction\\b|=>', '\\breturn\\b'],
    proibe: ['console\\.log\\s*\\(\\s*8\\s*\\)'],
    motivo: 'A função precisa calcular a média e devolvê-la com return.',
  },
  'js-func-03-e1': {
    exige: ['=>', '%'],
    proibe: ['console\\.log\\s*\\(\\s*true\\s*\\)'],
    motivo: 'Escreva uma arrow function que decide se o número é par.',
  },
  'js-func-04-e2': {
    exige: ['\\bfunction\\b|=>', 'contador'],
    proibe: ['console\\.log\\s*\\(\\s*1\\s*\\)'],
    motivo: 'O contador tem de subir dentro da função, não ser escrito à mão.',
  },

  /* =====================================================================
   * JAVASCRIPT - Desafios
   * ================================================================== */
  'js-des-01-e1': { exige: ['\\bfor\\s*\\(', '%'], motivo: USE_A_ESTRUTURA('um for com o operador %') },
  'js-des-02-e1': {
    exige: ['\\bfunction\\b|=>', '\\breturn\\b', '\\.length'],
    motivo: USE_A_ESTRUTURA('uma função com return e .length'),
  },
  'js-des-02-e2': {
    exige: ['\\.trim\\s*\\(', '\\.toLowerCase\\s*\\('],
    proibe: ['["\']ana@email\\.com["\']'],
    motivo: 'Encadeie os métodos no e-mail original em vez de escrever o resultado.',
  },
  'js-des-03-e1': {
    exige: ['\\.filter\\s*\\(', '\\.reduce\\s*\\('],
    proibe: ['7\\.25'],
    motivo: USE_A_ESTRUTURA('filter e reduce'),
  },
  'js-des-03-e2': {
    exige: ['\\.map\\s*\\(', '\\.join\\s*\\('],
    proibe: ['9, 18, 27'],
    motivo: USE_A_ESTRUTURA('map e join'),
  },

  /* =====================================================================
   * JAVASCRIPT - Projeto final
   * ================================================================== */
  'js-proj-01-e1': {
    exige: ['aluno\\s*=\\s*\\{', 'aluno\\.nome', 'aluno\\.nota'],
    motivo: 'Crie o objeto e acesse as propriedades com ponto, em vez de imprimir os valores.',
  },
  'js-proj-02-e1': {
    exige: ['\\bfunction\\b|=>', '\\breturn\\b', '\\bif\\s*\\('],
    motivo: USE_A_ESTRUTURA('uma função que devolve o texto com return'),
  },
  'js-proj-02-e2': {
    exige: ['\\bfor\\s*\\(', '\\bof\\b'],
    motivo: USE_A_ESTRUTURA('um for...of percorrendo a turma'),
  },
  'js-proj-02-e3': {
    exige: ['\\bfor\\s*\\(', 'Math\\.round'],
    proibe: ['6\\.17'],
    motivo: CALCULE,
  },
};

/** Requisitos de um exercicio, ou `undefined` se ele nao exige estrutura. */
export const requisitosDoExercicio = (id: string): RequisitosDeCodigo | undefined =>
  REQUISITOS[id];
