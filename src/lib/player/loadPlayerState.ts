/**
 * Leitura do estado do aluno no Supabase.
 *
 * Este arquivo existe separado do PlayerProvider por um motivo: aqui mora a
 * regra que ja causou perda aparente de progresso, e regra assim precisa de
 * teste automatizado (ver `scripts/testar-progresso.mts`).
 *
 * A armadilha original:
 *
 *   const { data } = await supabase.from('profiles').select('*')...
 *   if (!data) { criar perfil zerado }
 *
 * `data` vem nulo em DOIS casos completamente diferentes:
 *
 *   1. a conta e nova e realmente nao tem perfil;
 *   2. a consulta falhou (rede caiu, token expirou) OU o RLS barrou a
 *      leitura - e o PostgREST devolve **conjunto vazio, sem erro**, quando
 *      o token nao esta valendo.
 *
 * Tratar o caso 2 como se fosse o caso 1 monta um perfil com 0 XP, nenhuma
 * licao e `username: null`. Para quem esta olhando a tela, isso e
 * indistinguivel de "o app apagou meu progresso" - e ainda faz a tela de
 * escolher @username aparecer de novo para quem ja tinha escolhido.
 *
 * A regra aqui e: **na duvida, nao invente estado**. So devolvemos "conta
 * nova" quando o proprio servidor confirma que a sessao esta valida e mesmo
 * assim nao existe linha em `profiles`.
 */

import type { PlayerState, ProfileRow } from '@/types/db';

/** O minimo do supabase-js que esta leitura usa (facilita testar com um dublê). */
export interface ClienteLeitura {
  from: (tabela: string) => any;
  auth: { getUser: () => Promise<{ data: { user: unknown } | null; error: unknown }> };
}

export interface DadosDoUsuario {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export type ResultadoLeitura =
  | { tipo: 'ok'; state: PlayerState }
  /** Nao deu para saber o estado real. Quem chama deve MANTER o que ja tinha. */
  | { tipo: 'erro'; motivo: string };

const perfilNovo = (user: DadosDoUsuario): ProfileRow => ({
  id: user.id,
  name: user.name,
  username: null,
  avatar_url: user.avatarUrl,
  xp_total: 0,
  level: 1,
  streak_count: 0,
  last_study_date: null,
  current_language: 'python',
  equipped_tag_id: null,
  username_changed_at: null,
  is_developer: false,
});

/** Erro de "essa tabela nao existe" (migration ainda nao aplicada). */
const tabelaAusente = (erro: unknown): boolean => {
  if (!erro || typeof erro !== 'object') return false;
  const codigo = String((erro as { code?: unknown }).code ?? '');
  const texto = String((erro as { message?: unknown }).message ?? '');
  // 42P01 = undefined_table no Postgres; PGRST205 = tabela fora do cache do PostgREST.
  return codigo === '42P01' || codigo === 'PGRST205' || /does not exist|schema cache/i.test(texto);
};

const mensagem = (erro: unknown, padrao: string): string => {
  if (erro && typeof erro === 'object' && 'message' in erro) {
    return String((erro as { message: unknown }).message);
  }
  return padrao;
};

/**
 * Le perfil, progresso e conquistas.
 *
 * Nunca devolve estado zerado por causa de falha: se qualquer uma das tres
 * consultas falhar, o retorno e `{ tipo: 'erro' }`.
 */
export async function lerEstadoDoServidor(
  supabase: ClienteLeitura,
  user: DadosDoUsuario,
): Promise<ResultadoLeitura> {
  let perfilResposta;
  let progressoResposta;
  let conquistasResposta;
  let tagsResposta;

  try {
    [perfilResposta, progressoResposta, conquistasResposta, tagsResposta] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_progress').select('lesson_id, flawless').eq('user_id', user.id),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
      supabase.from('user_tags').select('tag_id').eq('user_id', user.id),
    ]);
  } catch (falha) {
    return { tipo: 'erro', motivo: mensagem(falha, 'falha de rede') };
  }

  // O supabase-js NAO lanca excecao: o erro vem dentro da resposta. Ignorar
  // isso era exatamente o que transformava uma falha de rede em "0 XP".
  const falha = perfilResposta?.error ?? progressoResposta?.error ?? conquistasResposta?.error;
  if (falha) return { tipo: 'erro', motivo: mensagem(falha, 'falha ao ler o progresso') };

  // `user_tags` nasceu na migration 0004. Se o codigo subir antes de a SQL ser
  // aplicada, a tabela ainda nao existe - e isso nao pode derrubar o app
  // inteiro: seguimos sem tags ate a migration rodar.
  if (tagsResposta?.error && !tabelaAusente(tagsResposta.error)) {
    return { tipo: 'erro', motivo: mensagem(tagsResposta.error, 'falha ao ler as tags') };
  }
  const tagsIndisponiveis = Boolean(tagsResposta?.error);

  let profile = (perfilResposta?.data ?? null) as ProfileRow | null;

  if (!profile) {
    const confirmada = await sessaoConfirmada(supabase);
    if (!confirmada) {
      // Sem perfil E sem sessao confirmada = quase sempre token expirado ou
      // ainda nao gravado (acontece logo depois do retorno do Google).
      // Inventar um perfil aqui e o bug; devolver erro e o certo.
      return { tipo: 'erro', motivo: 'sessão ainda não confirmada pelo servidor' };
    }

    const criado = await criarPerfil(supabase, user);
    if (criado.tipo === 'erro') return criado;
    profile = criado.profile;
  }

  const linhas = (progressoResposta?.data ?? []) as { lesson_id: string; flawless: boolean }[];

  return {
    tipo: 'ok',
    state: {
      profile,
      completedLessonIds: linhas.map((linha) => linha.lesson_id),
      flawlessLessonIds: linhas.filter((linha) => linha.flawless).map((linha) => linha.lesson_id),
      unlockedAchievementIds: ((conquistasResposta?.data ?? []) as {
        achievement_id: string;
      }[]).map((linha) => linha.achievement_id),
      unlockedTagIds: tagsIndisponiveis
        ? []
        : ((tagsResposta?.data ?? []) as { tag_id: string }[]).map((linha) => linha.tag_id),
    },
  };
}

/** O servidor reconhece a sessao atual? (RLS barrado devolve lista vazia, nao erro.) */
async function sessaoConfirmada(supabase: ClienteLeitura): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return !error && Boolean(data?.user);
  } catch {
    return false;
  }
}

type ResultadoCriacao = { tipo: 'ok'; profile: ProfileRow } | { tipo: 'erro'; motivo: string };

/**
 * Cria a linha em `profiles` de uma conta realmente nova.
 *
 * Usa INSERT, nunca UPSERT: um upsert com valores zerados sobrescreveria o
 * perfil de quem ja tem progresso. Se der conflito (o gatilho
 * `handle_new_user` costuma criar a linha antes), lemos a linha existente em
 * vez de sobrescrever.
 */
async function criarPerfil(
  supabase: ClienteLeitura,
  user: DadosDoUsuario,
): Promise<ResultadoCriacao> {
  const seed = perfilNovo(user);

  // O INSERT manda so as colunas do schema original: as que vieram depois
  // (equipped_tag_id, is_developer...) tem valor padrao no banco, e omiti-las
  // faz o cadastro continuar funcionando mesmo antes de a 0004 ser aplicada.
  const { equipped_tag_id, username_changed_at, is_developer, ...colunasBase } = seed;
  void equipped_tag_id;
  void username_changed_at;
  void is_developer;

  const { data, error } = await supabase
    .from('profiles')
    .insert(colunasBase)
    .select()
    .maybeSingle();

  if (!error && data) return { tipo: 'ok', profile: data as ProfileRow };

  // Conflito de chave = a linha ja existe. Le a linha de verdade.
  const relido = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!relido?.error && relido?.data) return { tipo: 'ok', profile: relido.data as ProfileRow };

  if (error) return { tipo: 'erro', motivo: mensagem(error, 'falha ao criar o perfil') };
  return { tipo: 'ok', profile: seed };
}
