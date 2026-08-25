import type { Exercise } from '@/types/content';
import { allLessons } from '@/content/index';

/**
 * Regras do desafio diario - espelho em TypeScript do que a migracao
 * `0008_desafios_diarios.sql` faz no banco.
 *
 * Quem manda e o SQL: com Supabase configurado, e o servidor que escolhe o
 * exercicio, decide que dia e hoje e diz se voce ja completou. Este arquivo
 * existe por dois motivos:
 *
 *   1. o modo demonstracao (sem Supabase) precisa da mesma logica rodando no
 *      aparelho;
 *   2. `npm run test:desafios` compara as duas implementacoes dia a dia - se
 *      alguem mexer numa e esquecer da outra, o teste quebra.
 */

/**
 * XP de um desafio diario.
 *
 * O exercicio mais valioso da trilha paga 80 XP e uma licao inteira vai de 50
 * a 280. 120 fica acima de qualquer exercicio avulso (que e o que o desafio e)
 * sem chegar perto de uma licao completa - o desafio diario complementa a
 * trilha, nao substitui.
 */
export const XP_DESAFIO_DIARIO = 120;

/**
 * Primo usado para espalhar os dias pelo pool.
 *
 * Como e primo e maior que o pool, `gcd(7919, total) = 1` e a sequencia
 * percorre TODOS os exercicios antes de repetir qualquer um.
 */
export const MULTIPLICADOR_DO_SORTEIO = 7919;

/** Modulos que ficam de fora do rodizio (ver `desafio_pool()` no SQL). */
const ehProjetoFinal = (moduleId: string): boolean => moduleId.endsWith('projeto-final');

/**
 * Exercicios que podem cair no desafio do dia.
 *
 * Somente os de codigo (`output_match`): o desafio diario e para escrever
 * programa, nao para marcar alternativa. O Projeto Final fica de fora porque
 * seus exercicios sao etapas encadeadas de um projeto unico e nao se sustentam
 * soltos.
 *
 * A ordenacao por id e a mesma do banco (`order by e.id collate "C"`): ordem
 * de bytes, que para ids ASCII e exatamente o `.sort()` padrao do JavaScript.
 */
export const poolDeDesafios = (): Exercise[] =>
  allLessons()
    .filter((licao) => !ehProjetoFinal(licao.moduleId))
    .flatMap((licao) => licao.exercises)
    .filter((exercicio) => exercicio.validationType === 'output_match')
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

/** Data de hoje em America/Sao_Paulo, no formato `YYYY-MM-DD`. */
export const diaDoDesafio = (agora: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora);

const MS_POR_DIA = 86_400_000;

/** Dias inteiros desde 1970-01-01 - o mesmo `alvo - date '1970-01-01'` do SQL. */
export const diasDesdeEpoca = (dia: string): number =>
  Math.floor(Date.parse(`${dia}T00:00:00Z`) / MS_POR_DIA);

/** Posicao do exercicio dentro do pool, para uma data. */
export const posicaoDoDia = (dia: string, tamanhoDoPool: number): number => {
  if (tamanhoDoPool <= 0) return 0;
  return ((diasDesdeEpoca(dia) * MULTIPLICADOR_DO_SORTEIO) % tamanhoDoPool + tamanhoDoPool)
    % tamanhoDoPool;
};

/** O exercicio daquele dia. Deterministico: mesma data, mesmo exercicio. */
export const desafioDaData = (dia: string): Exercise | null => {
  const pool = poolDeDesafios();
  if (pool.length === 0) return null;
  return pool[posicaoDoDia(dia, pool.length)];
};

/** Quando o desafio de hoje expira (meia-noite seguinte em Sao Paulo). */
export const expiraEm = (agora: Date = new Date()): Date => {
  const hoje = diaDoDesafio(agora);
  // O deslocamento de Sao Paulo em relacao ao UTC, medido na propria data -
  // assim continua certo se o horario de verao voltar um dia.
  const meioDia = new Date(`${hoje}T12:00:00Z`);
  const local = new Date(meioDia.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const deslocamentoMs = meioDia.getTime() - local.getTime();
  return new Date(Date.parse(`${hoje}T00:00:00Z`) + MS_POR_DIA + deslocamentoMs);
};
