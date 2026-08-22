'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localState } from '@/lib/local-store';
import type { LeaderboardRow } from '@/types/db';

/**
 * Ranking por XP.
 *
 * A consulta le apenas as colunas publicas de `profiles` (nome, avatar, XP,
 * nivel e streak) - a policy de SELECT no Supabase permite que qualquer
 * usuario autenticado leia esses campos, enquanto o UPDATE continua restrito
 * ao dono da linha.
 */
export const fetchLeaderboard = async (limit = 50): Promise<LeaderboardRow[]> => {
  if (!isSupabaseConfigured) return localState.leaderboard().slice(0, limit);

  const { data, error } = await getSupabase()!
    .from('profiles')
    .select('id, name, avatar_url, xp_total, level, streak_count')
    .order('xp_total', { ascending: false })
    .order('name', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as LeaderboardRow[];
};
