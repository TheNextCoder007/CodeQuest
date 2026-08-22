'use client';

import type {
  FriendshipRow,
  FriendshipStatus,
  LeaderboardRow,
  PlayerState,
  ProfileRow,
  PublicProfile,
} from '@/types/db';

/**
 * Armazenamento local usado no **modo demonstracao** (quando as chaves do
 * Supabase nao estao configuradas) e como conta offline nos apps empacotados.
 *
 * Tudo fica em `localStorage`, no mesmo formato das tabelas do Supabase, para
 * que o restante do app nao precise saber qual das duas fontes esta ativa.
 */

const USER_KEY = 'cq:demo:user';
const STATE_PREFIX = 'cq:demo:state:';
const ROSTER_KEY = 'cq:demo:roster';
const FRIENDS_KEY = 'cq:demo:friendships';
const FRIENDS_SEED_PREFIX = 'cq:demo:friends-seeded:';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
}

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const idFromEmail = (email: string): string => {
  // id estavel e deterministico para o mesmo e-mail, sem depender de crypto.
  let hash = 0;
  for (let index = 0; index < email.length; index += 1) {
    hash = (hash * 31 + email.charCodeAt(index)) | 0;
  }
  return `demo-${Math.abs(hash).toString(16)}`;
};

/**
 * Perfis ficticios do modo demonstracao.
 *
 * Servem para que o ranking e a busca de amigos tenham conteudo durante a
 * apresentacao, mesmo com uma conta recem-criada. Eles se comportam como
 * "robos": aceitam pedidos de amizade na hora (ver `localFriends.sendRequest`).
 */
export const DEMO_PROFILES: PublicProfile[] = [
  {
    id: 'demo-ana',
    name: 'Ana (exemplo)',
    username: 'ana_dev',
    avatar_url: null,
    xp_total: 640,
    level: 7,
    streak_count: 5,
  },
  {
    id: 'demo-kauan',
    name: 'Kauan (exemplo)',
    username: 'kauanfa',
    avatar_url: null,
    xp_total: 420,
    level: 5,
    streak_count: 3,
  },
  {
    id: 'demo-luiz',
    name: 'Luiz (exemplo)',
    username: 'luizjr',
    avatar_url: null,
    xp_total: 180,
    level: 2,
    streak_count: 1,
  },
];

export const isDemoProfile = (id: string): boolean =>
  DEMO_PROFILES.some((profile) => profile.id === id);

export const emptyProfile = (id: string, name: string): ProfileRow => ({
  id,
  name,
  username: null,
  avatar_url: null,
  xp_total: 0,
  level: 1,
  streak_count: 0,
  last_study_date: null,
  current_language: 'python',
});

export const emptyState = (id: string, name: string): PlayerState => ({
  profile: emptyProfile(id, name),
  completedLessonIds: [],
  flawlessLessonIds: [],
  unlockedAchievementIds: [],
});

export const localAuth = {
  current(): LocalUser | null {
    if (typeof window === 'undefined') return null;
    return safeParse<LocalUser | null>(window.localStorage.getItem(USER_KEY), null);
  },

  signIn(email: string, name?: string): LocalUser {
    const cleanEmail = email.trim().toLowerCase();
    const user: LocalUser = {
      id: idFromEmail(cleanEmail),
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0] || 'Estudante',
    };
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Garante que o estado exista e que o aluno apareca no ranking local.
    if (!window.localStorage.getItem(STATE_PREFIX + user.id)) {
      localState.save(user.id, emptyState(user.id, user.name));
    }
    return user;
  },

  signOut(): void {
    window.localStorage.removeItem(USER_KEY);
  },
};

export const localState = {
  load(userId: string, fallbackName = 'Estudante'): PlayerState {
    if (typeof window === 'undefined') return emptyState(userId, fallbackName);

    const carregado = safeParse<PlayerState>(
      window.localStorage.getItem(STATE_PREFIX + userId),
      emptyState(userId, fallbackName),
    );

    // Contas locais criadas antes de o campo existir nao tem `username`.
    if (carregado.profile && carregado.profile.username === undefined) {
      carregado.profile.username = null;
    }
    return carregado;
  },

  save(userId: string, state: PlayerState): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STATE_PREFIX + userId, JSON.stringify(state));

    // Mantem uma lista de ids conhecidos para montar o ranking local.
    const roster = safeParse<string[]>(window.localStorage.getItem(ROSTER_KEY), []);
    if (!roster.includes(userId)) {
      window.localStorage.setItem(ROSTER_KEY, JSON.stringify([...roster, userId]));
    }
  },

  /** Ids de todas as contas locais ja criadas neste dispositivo. */
  roster(): string[] {
    if (typeof window === 'undefined') return [];
    return safeParse<string[]>(window.localStorage.getItem(ROSTER_KEY), []);
  },

  /** Perfis publicos das contas locais reais + os perfis de exemplo. */
  directory(): PublicProfile[] {
    const reais = localState.roster().map((id) => {
      const { profile } = localState.load(id);
      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        xp_total: profile.xp_total,
        level: profile.level,
        streak_count: profile.streak_count,
      };
    });
    return [...reais, ...DEMO_PROFILES];
  },

  profileById(id: string): PublicProfile | undefined {
    return localState.directory().find((profile) => profile.id === id);
  },

  /** True se o username ja pertence a outra conta local. */
  usernameTaken(username: string, exceptUserId: string): boolean {
    const alvo = username.toLowerCase();
    return localState
      .directory()
      .some(
        (profile) =>
          profile.id !== exceptUserId && (profile.username ?? '').toLowerCase() === alvo,
      );
  },

  /**
   * Ranking do modo demonstracao: contas locais reais + perfis de exemplo,
   * para que a tela nao fique vazia na apresentacao do projeto.
   */
  leaderboard(): LeaderboardRow[] {
    if (typeof window === 'undefined') return [];
    return localState
      .directory()
      .map((profile) => ({
        id: profile.id,
        name: profile.name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        xp_total: profile.xp_total,
        level: profile.level,
        streak_count: profile.streak_count,
      }))
      .sort((a, b) => b.xp_total - a.xp_total);
  },
};

/* -------------------------------------------------------------------------
 * Amizades no modo demonstracao
 *
 * Guardamos as mesmas arestas da tabela `friendships`, num array unico. Como
 * tudo acontece no mesmo dispositivo, os perfis de exemplo se comportam como
 * robos: aceitam o pedido na hora, e um deles envia um convite para a conta
 * nova - assim da para demonstrar os dois lados do fluxo sem dois aparelhos.
 * ---------------------------------------------------------------------- */

type LocalEdge = Pick<FriendshipRow, 'user_id' | 'friend_id' | 'status' | 'created_at'>;

const readEdges = (): LocalEdge[] => {
  if (typeof window === 'undefined') return [];
  return safeParse<LocalEdge[]>(window.localStorage.getItem(FRIENDS_KEY), []);
};

const writeEdges = (edges: LocalEdge[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FRIENDS_KEY, JSON.stringify(edges));
};

const involves = (edge: LocalEdge, userId: string): boolean =>
  edge.user_id === userId || edge.friend_id === userId;

export const localFriends = {
  /** Arestas em que o usuario aparece, criando o convite inicial de exemplo. */
  edgesFor(userId: string): LocalEdge[] {
    let edges = readEdges();

    // Primeira visita: um perfil de exemplo manda um pedido, para que a secao
    // de "pedidos recebidos" tenha o que mostrar na apresentacao.
    //
    // A marca de "ja semeado" fica numa chave propria: sem ela, recusar o
    // convite de exemplo faria ele reaparecer no proximo carregamento.
    const chaveSemeado = FRIENDS_SEED_PREFIX + userId;
    const jaSemeado =
      typeof window === 'undefined' || window.localStorage.getItem(chaveSemeado) === '1';

    if (!jaSemeado && !isDemoProfile(userId)) {
      window.localStorage.setItem(chaveSemeado, '1');
      edges = [
        ...edges,
        {
          user_id: 'demo-luiz',
          friend_id: userId,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ];
      writeEdges(edges);
    }

    return edges.filter((edge) => involves(edge, userId));
  },

  sendRequest(userId: string, targetId: string): void {
    const edges = readEdges().filter(
      (edge) => !(involves(edge, userId) && involves(edge, targetId)),
    );

    // Perfis de exemplo aceitam na hora (nao ha ninguem do outro lado).
    const status: FriendshipStatus = isDemoProfile(targetId) ? 'accepted' : 'pending';

    writeEdges([
      ...edges,
      { user_id: userId, friend_id: targetId, status, created_at: new Date().toISOString() },
    ]);
  },

  accept(userId: string, requesterId: string): void {
    writeEdges(
      readEdges().map((edge) =>
        edge.user_id === requesterId && edge.friend_id === userId
          ? { ...edge, status: 'accepted' as FriendshipStatus }
          : edge,
      ),
    );
  },

  /** Recusar, cancelar ou desfazer: em todos os casos a aresta some. */
  remove(userId: string, otherId: string): void {
    writeEdges(readEdges().filter((edge) => !(involves(edge, userId) && involves(edge, otherId))));
  },
};
