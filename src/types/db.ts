/** Espelho TypeScript das tabelas criadas em `supabase/migrations`. */

export interface ProfileRow {
  id: string;
  name: string;
  /**
   * Identificador publico (@davi123), separado do nome de exibicao.
   * Fica `null` enquanto a pessoa nao escolheu - o app pede no proximo login.
   */
  username: string | null;
  avatar_url: string | null;
  xp_total: number;
  level: number;
  streak_count: number;
  last_study_date: string | null;
  current_language: string | null;
  /** Tag exibida no perfil (precisa estar em `user_tags`). */
  equipped_tag_id: string | null;
  /** Quando o @username foi trocado pela ultima vez (regra de 24h). */
  username_changed_at: string | null;
  /** Selo concedido a mao no banco. Ver `definir_desenvolvedor()`. */
  is_developer: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TagRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  criteria: Record<string, unknown>;
  secret: boolean;
  order_index: number;
}

export interface UserTagRow {
  user_id: string;
  tag_id: string;
  unlocked_at: string;
}

export interface UserProgressRow {
  user_id: string;
  lesson_id: string;
  completed_at: string;
  xp_earned: number;
  flawless: boolean;
}

export interface UserAchievementRow {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface LeaderboardRow {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  xp_total: number;
  level: number;
  streak_count: number;
  equipped_tag_id?: string | null;
  is_developer?: boolean;
}

/* -------------------------------------------------------------------------
 * Amizades
 * ---------------------------------------------------------------------- */

export type FriendshipStatus = 'pending' | 'accepted';

export interface FriendshipRow {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at?: string;
}

/** Dados publicos de outra pessoa, usados na busca e nas listas de amigos. */
export interface PublicProfile {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  xp_total: number;
  level: number;
  streak_count: number;
  equipped_tag_id?: string | null;
  is_developer?: boolean;
}

/**
 * Tudo que a tela de perfil publico mostra de outra pessoa.
 *
 * Repare no que NAO esta aqui: e-mail, data de cadastro e qualquer coisa que
 * so interesse ao dono da conta.
 */
export interface PerfilPublico extends PublicProfile {
  /** Posicao no ranking global (1 = primeiro lugar). */
  posicao: number;
  unlockedTagIds: string[];
  unlockedAchievementIds: string[];
  completedLessonIds: string[];
}

/**
 * Como eu me relaciono com alguem que apareceu na busca.
 *  - none      : nenhuma ligacao
 *  - pending_out: eu enviei o pedido e aguardo resposta
 *  - pending_in : essa pessoa me enviou um pedido
 *  - friends   : amizade confirmada
 *  - self      : sou eu mesmo
 */
export type RelationshipStatus = 'none' | 'pending_out' | 'pending_in' | 'friends' | 'self';

export interface SearchResult extends PublicProfile {
  relationship: RelationshipStatus;
}

/** Tudo que a tela de amigos precisa, em uma unica carga. */
export interface FriendsData {
  friends: PublicProfile[];
  incoming: PublicProfile[];
  outgoing: PublicProfile[];
}

/** Estado completo do aluno, montado a partir das tabelas acima. */
export interface PlayerState {
  profile: ProfileRow;
  completedLessonIds: string[];
  flawlessLessonIds: string[];
  unlockedAchievementIds: string[];
  unlockedTagIds: string[];
}
