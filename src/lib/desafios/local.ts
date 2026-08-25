'use client';

import { XP_DESAFIO_DIARIO, desafioDaData, diaDoDesafio, expiraEm } from './regras';
import type { AmigoNoDesafio, EstadoDesafio, ResultadoDesafio } from './tipos';

/**
 * Desafio diario no modo demonstracao (sem Supabase).
 *
 * Mesma regra do servidor rodando no aparelho: o exercicio sai da data, o dia
 * vira a meia-noite de Sao Paulo e concluir paga uma vez so.
 *
 * O que NAO da para reproduzir aqui e a garantia: sem banco, o proprio
 * aparelho e quem guarda a lista de dias concluidos, e quem quiser editar o
 * `localStorage` consegue. Com Supabase configurado quem decide e
 * `desafio_concluir()`, que nao aceita nem usuario nem data. Esta copia existe
 * para o projeto poder ser apresentado offline, que e um requisito do
 * trabalho.
 */

const CHAVE = 'cq:demo:desafios';

const lerDias = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    const lista = bruto ? (JSON.parse(bruto) as unknown) : [];
    return Array.isArray(lista) ? lista.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const gravarDias = (dias: string[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CHAVE, JSON.stringify(dias));
};

export const estadoDesafioLocal = (): EstadoDesafio => {
  const dia = diaDoDesafio();
  const exercicio = desafioDaData(dia);
  const dias = lerDias();

  return {
    dia,
    exercicio,
    exercicioId: exercicio?.id ?? '',
    xp: XP_DESAFIO_DIARIO,
    jaCompletou: dias.includes(dia),
    total: dias.length,
    expiraEm: expiraEm(),
    desconhecido: exercicio === null,
  };
};

/**
 * Marca o desafio de hoje como concluido.
 *
 * Devolve `xpGanho: 0` quando ja tinha sido feito - o mesmo contrato de
 * `desafio_concluir()` no banco, para a tela nao precisar saber em qual modo
 * esta rodando.
 */
export const concluirDesafioLocal = (xpAtual: number): ResultadoDesafio => {
  const dia = diaDoDesafio();
  const dias = lerDias();

  if (dias.includes(dia)) {
    return {
      xpGanho: 0,
      jaTinha: true,
      total: dias.length,
      novoXp: xpAtual,
      novoNivel: Math.floor(xpAtual / 100) + 1,
    };
  }

  const atualizados = [...dias, dia];
  gravarDias(atualizados);

  const novoXp = xpAtual + XP_DESAFIO_DIARIO;
  return {
    xpGanho: XP_DESAFIO_DIARIO,
    jaTinha: false,
    total: atualizados.length,
    novoXp,
    novoNivel: Math.floor(novoXp / 100) + 1,
  };
};

/** Quantos desafios esta conta ja concluiu (modo demonstracao). */
export const totalDesafiosLocal = (): number => lerDias().length;

/** Sem servidor nao ha com quem comparar - a lista vem vazia. */
export const amigosNoDesafioLocal = (): AmigoNoDesafio[] => [];
