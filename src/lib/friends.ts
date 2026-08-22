'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localFriends, localState } from '@/lib/local-store';
import type {
  FriendsData,
  FriendshipRow,
  LeaderboardRow,
  PublicProfile,
  RelationshipStatus,
  SearchResult,
} from '@/types/db';

/**
 * Sistema de amigos.
 *
 * A tabela `friendships` guarda **uma linha por par de pessoas**:
 * `user_id` e quem enviou, `friend_id` e quem recebeu, e `status` vai de
 * 'pending' para 'accepted'. Recusar, cancelar e desfazer sao a mesma coisa:
 * apagar a linha.
 *
 * O RLS (ver `supabase/migrations/0002_amigos.sql`) ja limita tudo que o
 * cliente enxerga as linhas em que ele aparece - os filtros repetidos aqui
 * sao apenas para deixar a intencao explicita na consulta.
 */

const CAMPOS_PUBLICOS = 'id, name, username, avatar_url, xp_total, level, streak_count';

/* -------------------------------------------------------------------------
 * Username
 * ---------------------------------------------------------------------- */

/**
 * Confere se o @username esta livre. Devolve `true` quando ninguem mais o
 * usa (a unicidade de verdade e garantida pelo indice unico no banco - esta
 * checagem existe para avisar a pessoa antes de ela clicar em salvar).
 */
export const isUsernameAvailable = async (
  username: string,
  myId: string,
): Promise<boolean> => {
  const alvo = username.trim().toLowerCase();
  if (!alvo) return false;

  if (!isSupabaseConfigured) return !localState.usernameTaken(alvo, myId);

  // Comparacao exata, e nao `ilike`: no LIKE o "_" e curinga de um caractere,
  // entao procurar por "davi_1" daria falso positivo com "davi91". Como o
  // username e sempre gravado em minusculas, o `eq` ja cobre o caso.
  const { data, error } = await getSupabase()!
    .from('profiles')
    .select('id')
    .eq('username', alvo)
    .limit(1);

  if (error) throw new Error(error.message);
  return (data ?? []).every((linha: { id: string }) => linha.id === myId);
};

/* -------------------------------------------------------------------------
 * Listas de amigos e pedidos
 * ---------------------------------------------------------------------- */

const vazio: FriendsData = { friends: [], incoming: [], outgoing: [] };

const montarListas = (
  edges: Pick<FriendshipRow, 'user_id' | 'friend_id' | 'status'>[],
  perfis: Map<string, PublicProfile>,
  myId: string,
): FriendsData => {
  const resultado: FriendsData = { friends: [], incoming: [], outgoing: [] };

  edges.forEach((edge) => {
    const outroId = edge.user_id === myId ? edge.friend_id : edge.user_id;
    const perfil = perfis.get(outroId);
    if (!perfil) return;

    if (edge.status === 'accepted') resultado.friends.push(perfil);
    else if (edge.friend_id === myId) resultado.incoming.push(perfil);
    else resultado.outgoing.push(perfil);
  });

  resultado.friends.sort((a, b) => b.xp_total - a.xp_total);
  return resultado;
};

export const fetchFriends = async (myId: string): Promise<FriendsData> => {
  if (!myId) return vazio;

  if (!isSupabaseConfigured) {
    const edges = localFriends.edgesFor(myId);
    const perfis = new Map(localState.directory().map((perfil) => [perfil.id, perfil]));
    return montarListas(edges, perfis, myId);
  }

  const supabase = getSupabase()!;
  const { data: edges, error } = await supabase
    .from('friendships')
    .select('user_id, friend_id, status')
    .or(`user_id.eq.${myId},friend_id.eq.${myId}`);

  if (error) throw new Error(error.message);
  if (!edges || edges.length === 0) return vazio;

  const outrosIds = edges.map((edge: { user_id: string; friend_id: string }) =>
    edge.user_id === myId ? edge.friend_id : edge.user_id,
  );

  const { data: perfis, error: erroPerfis } = await supabase
    .from('profiles')
    .select(CAMPOS_PUBLICOS)
    .in('id', outrosIds);

  if (erroPerfis) throw new Error(erroPerfis.message);

  const mapa = new Map<string, PublicProfile>(
    ((perfis ?? []) as PublicProfile[]).map((perfil) => [perfil.id, perfil]),
  );

  return montarListas(
    edges as Pick<FriendshipRow, 'user_id' | 'friend_id' | 'status'>[],
    mapa,
    myId,
  );
};

/* -------------------------------------------------------------------------
 * Busca
 * ---------------------------------------------------------------------- */

/** Descobre a relacao atual com alguem, a partir das listas ja carregadas. */
export const relationshipWith = (
  outroId: string,
  data: FriendsData,
  myId: string,
): RelationshipStatus => {
  if (outroId === myId) return 'self';
  if (data.friends.some((perfil) => perfil.id === outroId)) return 'friends';
  if (data.incoming.some((perfil) => perfil.id === outroId)) return 'pending_in';
  if (data.outgoing.some((perfil) => perfil.id === outroId)) return 'pending_out';
  return 'none';
};

/**
 * Busca por @username. Aceita o texto com ou sem "@" e ignora maiusculas.
 * Perfis que ainda nao escolheram username nao aparecem.
 */
export const searchProfiles = async (
  termo: string,
  myId: string,
  data: FriendsData,
): Promise<SearchResult[]> => {
  // Alem de tirar o "@" e as maiusculas, descartamos qualquer caractere fora
  // do alfabeto permitido nos usernames - isso evita que um "%" digitado por
  // acidente vire curinga do LIKE e liste a plataforma inteira.
  const busca = termo
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  if (busca.length < 2) return [];

  const comRelacao = (perfis: PublicProfile[]): SearchResult[] =>
    perfis.map((perfil) => ({ ...perfil, relationship: relationshipWith(perfil.id, data, myId) }));

  if (!isSupabaseConfigured) {
    return comRelacao(
      localState
        .directory()
        .filter((perfil) => (perfil.username ?? '').toLowerCase().includes(busca))
        .slice(0, 20),
    );
  }

  const { data: perfis, error } = await getSupabase()!
    .from('profiles')
    .select(CAMPOS_PUBLICOS)
    .not('username', 'is', null)
    .ilike('username', `%${busca}%`)
    .order('username', { ascending: true })
    .limit(20);

  if (error) throw new Error(error.message);
  return comRelacao((perfis ?? []) as PublicProfile[]);
};

/* -------------------------------------------------------------------------
 * Acoes
 * ---------------------------------------------------------------------- */

const traduzErro = (mensagem: string): string => {
  if (mensagem.includes('friendships_par_key') || mensagem.includes('duplicate key')) {
    return 'Vocês já têm um pedido ou uma amizade em andamento.';
  }
  if (mensagem.includes('friendships_sem_auto_amizade')) {
    return 'Você não pode adicionar a si mesmo.';
  }
  if (mensagem.includes('row-level security')) {
    return 'Você não tem permissão para essa ação.';
  }
  return mensagem;
};

/**
 * Envia o pedido. Se a outra pessoa **ja tinha me convidado**, o pedido dela
 * e aceito na hora - e o que qualquer rede social faz, e evita o conflito com
 * o indice que garante uma linha por par.
 */
export const sendFriendRequest = async (
  myId: string,
  targetId: string,
  data: FriendsData,
): Promise<void> => {
  if (myId === targetId) throw new Error('Você não pode adicionar a si mesmo.');

  if (data.incoming.some((perfil) => perfil.id === targetId)) {
    await acceptFriendRequest(myId, targetId);
    return;
  }

  if (!isSupabaseConfigured) {
    localFriends.sendRequest(myId, targetId);
    return;
  }

  const { error } = await getSupabase()!
    .from('friendships')
    .insert({ user_id: myId, friend_id: targetId, status: 'pending' });

  if (error) throw new Error(traduzErro(error.message));
};

/** Aceitar: so quem recebeu o pedido consegue (garantido tambem pelo RLS). */
export const acceptFriendRequest = async (myId: string, requesterId: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    localFriends.accept(myId, requesterId);
    return;
  }

  const { error } = await getSupabase()!
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('user_id', requesterId)
    .eq('friend_id', myId);

  if (error) throw new Error(traduzErro(error.message));
};

/**
 * Apaga a linha do par. Serve para recusar um pedido recebido, cancelar um
 * pedido enviado e desfazer uma amizade - os tres casos sao a mesma operacao.
 */
export const removeFriendship = async (myId: string, otherId: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    localFriends.remove(myId, otherId);
    return;
  }

  const { error } = await getSupabase()!
    .from('friendships')
    .delete()
    .or(
      `and(user_id.eq.${myId},friend_id.eq.${otherId}),and(user_id.eq.${otherId},friend_id.eq.${myId})`,
    );

  if (error) throw new Error(traduzErro(error.message));
};

/* -------------------------------------------------------------------------
 * Ranking entre amigos
 * ---------------------------------------------------------------------- */

/**
 * Ranking por XP considerando apenas amizades confirmadas - e o proprio
 * usuario, que sempre aparece na sua lista.
 */
export const fetchFriendsLeaderboard = async (myId: string): Promise<LeaderboardRow[]> => {
  const data = await fetchFriends(myId);
  const ids = [myId, ...data.friends.map((perfil) => perfil.id)];

  if (!isSupabaseConfigured) {
    return localState
      .leaderboard()
      .filter((linha) => ids.includes(linha.id))
      .sort((a, b) => b.xp_total - a.xp_total);
  }

  const { data: perfis, error } = await getSupabase()!
    .from('profiles')
    .select(CAMPOS_PUBLICOS)
    .in('id', ids)
    .order('xp_total', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (perfis ?? []) as LeaderboardRow[];
};
