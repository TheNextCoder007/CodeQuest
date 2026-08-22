'use client';

import type { LeaderboardRow, PlayerState, ProfileRow } from '@/types/db';

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

export const emptyProfile = (id: string, name: string): ProfileRow => ({
  id,
  name,
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
    return safeParse<PlayerState>(
      window.localStorage.getItem(STATE_PREFIX + userId),
      emptyState(userId, fallbackName),
    );
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

  /**
   * Ranking do modo demonstracao. Alem das contas locais reais, inclui alguns
   * perfis de exemplo para que a tela de ranking nao fique vazia na
   * apresentacao do projeto.
   */
  leaderboard(): LeaderboardRow[] {
    if (typeof window === 'undefined') return [];
    const roster = safeParse<string[]>(window.localStorage.getItem(ROSTER_KEY), []);
    const real = roster
      .map((id) => localState.load(id))
      .map(({ profile }) => ({
        id: profile.id,
        name: profile.name,
        avatar_url: profile.avatar_url,
        xp_total: profile.xp_total,
        level: profile.level,
        streak_count: profile.streak_count,
      }));

    const exemplos: LeaderboardRow[] = [
      { id: 'demo-ana', name: 'Ana (exemplo)', avatar_url: null, xp_total: 640, level: 7, streak_count: 5 },
      { id: 'demo-kauan', name: 'Kauan (exemplo)', avatar_url: null, xp_total: 420, level: 5, streak_count: 3 },
      { id: 'demo-luiz', name: 'Luiz (exemplo)', avatar_url: null, xp_total: 180, level: 2, streak_count: 1 },
    ];

    return [...real, ...exemplos].sort((a, b) => b.xp_total - a.xp_total);
  },
};
