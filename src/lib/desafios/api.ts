'use client';

import { exerciseById } from '@/content/index';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  amigosNoDesafioLocal,
  concluirDesafioLocal,
  estadoDesafioLocal,
  totalDesafiosLocal,
} from './local';
import type { AmigoNoDesafio, EstadoDesafio, ResultadoDesafio } from './tipos';

/**
 * API do desafio diario.
 *
 * Com Supabase configurado, tudo passa por funcoes do banco
 * (`supabase/migrations/0008_desafios_diarios.sql`): qual e o exercicio de
 * hoje, que dia e hoje, se voce ja completou e o XP. Nenhuma dessas funcoes
 * aceita usuario ou data como parametro - nao ha o que o cliente possa
 * informar para mudar o resultado.
 *
 * Sem Supabase, cai no modo demonstracao (`local.ts`).
 */

const rpc = async <T,>(nome: string, argumentos: Record<string, unknown> = {}): Promise<T> => {
  const { data, error } = await getSupabase()!.rpc(nome, argumentos);
  if (error) throw new Error(error.message);
  return data as T;
};

/**
 * Erro que significa "a migração 0008 ainda não foi aplicada".
 *
 * Publicar o codigo antes de rodar o SQL nao pode derrubar o dashboard - o
 * desafio diario simplesmente ainda nao existe nesse banco.
 */
const migracaoPendente = (mensagem: string): boolean =>
  /does not exist|schema cache|could not find the function/i.test(mensagem);

interface LinhaEstado {
  dia: string;
  exercise_id: string;
  xp: number;
  ja_completou: boolean;
  total: number;
  expira_em: string;
}

/**
 * O desafio de hoje.
 *
 * Devolve `null` quando a migracao ainda nao foi aplicada, para a tela poder
 * apenas nao mostrar o cartao.
 */
export const buscarDesafioDeHoje = async (): Promise<EstadoDesafio | null> => {
  if (!isSupabaseConfigured) return estadoDesafioLocal();

  try {
    const linhas = await rpc<LinhaEstado[]>('desafio_estado');
    const linha = linhas?.[0];
    if (!linha) return null;

    // O enunciado, o codigo inicial e a saida esperada vem do curriculo
    // embarcado, nao do banco: assim o desafio abre offline, como as licoes.
    const exercicio = exerciseById(linha.exercise_id) ?? null;

    return {
      dia: String(linha.dia).slice(0, 10),
      exercicio,
      exercicioId: linha.exercise_id,
      xp: linha.xp,
      jaCompletou: linha.ja_completou,
      total: linha.total,
      expiraEm: new Date(linha.expira_em),
      desconhecido: exercicio === null,
    };
  } catch (falha) {
    const mensagem = falha instanceof Error ? falha.message : String(falha);
    if (migracaoPendente(mensagem)) return null;
    throw falha;
  }
};

interface LinhaResultado {
  xp_ganho: number;
  ja_tinha: boolean;
  total: number;
  novo_xp: number;
  novo_nivel: number;
}

/**
 * Marca o desafio de hoje como concluido.
 *
 * Quem decide se paga e quanto paga e o servidor. Chamar duas vezes devolve
 * `xpGanho: 0` e `jaTinha: true` - o XP nao dobra.
 */
export const concluirDesafioDeHoje = async (xpAtual: number): Promise<ResultadoDesafio> => {
  if (!isSupabaseConfigured) return concluirDesafioLocal(xpAtual);

  const linhas = await rpc<LinhaResultado[]>('desafio_concluir');
  const linha = linhas?.[0];
  if (!linha) throw new Error('Não foi possível registrar o desafio de hoje.');

  return {
    xpGanho: linha.xp_ganho,
    jaTinha: linha.ja_tinha,
    total: linha.total,
    novoXp: linha.novo_xp,
    novoNivel: linha.novo_nivel,
  };
};

/** Quantos desafios diarios uma conta ja concluiu. */
export const buscarTotalDeDesafios = async (userId?: string): Promise<number> => {
  if (!isSupabaseConfigured) return totalDesafiosLocal();

  try {
    return (await rpc<number>('desafio_total', { alvo: userId ?? null })) ?? 0;
  } catch (falha) {
    const mensagem = falha instanceof Error ? falha.message : String(falha);
    if (migracaoPendente(mensagem)) return 0;
    throw falha;
  }
};

interface LinhaAmigo {
  user_id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  concluido: boolean;
  total: number;
}

/** Quem entre os amigos ja fez o desafio de hoje. */
export const buscarAmigosNoDesafio = async (): Promise<AmigoNoDesafio[]> => {
  if (!isSupabaseConfigured) return amigosNoDesafioLocal();

  try {
    const linhas = await rpc<LinhaAmigo[]>('desafio_amigos');
    return (linhas ?? []).map((linha) => ({
      userId: linha.user_id,
      nome: linha.name,
      username: linha.username,
      avatarUrl: linha.avatar_url,
      concluido: linha.concluido,
      total: linha.total,
    }));
  } catch (falha) {
    const mensagem = falha instanceof Error ? falha.message : String(falha);
    if (migracaoPendente(mensagem)) return [];
    throw falha;
  }
};
