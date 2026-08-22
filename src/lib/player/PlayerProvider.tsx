'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { emptyState, localState } from '@/lib/local-store';
import type { AchievementDefinition } from '@/content/achievements';
import type { PlayerState, ProfileRow } from '@/types/db';
import {
  advanceStreak,
  evaluateAchievements,
  levelFromXp,
  todayISO,
} from '@/lib/gamification';

export interface CompletionResult {
  xpEarned: number;
  alreadyCompleted: boolean;
  leveledUp: boolean;
  newLevel: number;
  streak: number;
  newAchievements: AchievementDefinition[];
}

interface PlayerContextValue {
  state: PlayerState | null;
  loading: boolean;
  /** Erro de rede/permissao ao falar com o Supabase, se houver. */
  error: string | null;
  refresh: () => Promise<void>;
  completeLesson: (lessonId: string, xp: number, flawless: boolean) => Promise<CompletionResult>;
  setCurrentLanguage: (slug: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------------------------------------------
   * Carregamento do estado do aluno
   * ------------------------------------------------------------------ */
  const load = useCallback(async () => {
    if (!user) {
      setState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setState(localState.load(user.id, user.name));
      setLoading(false);
      return;
    }

    const supabase = getSupabase()!;

    try {
      const [profileResult, progressResult, achievementsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('user_progress').select('lesson_id, flawless').eq('user_id', user.id),
        supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
      ]);

      let profile = profileResult.data as ProfileRow | null;

      // Rede de seguranca: o trigger `handle_new_user` cria o perfil no
      // cadastro, mas se por algum motivo ele nao existir, criamos aqui.
      if (!profile) {
        const seed: ProfileRow = {
          id: user.id,
          name: user.name,
          avatar_url: user.avatarUrl,
          xp_total: 0,
          level: 1,
          streak_count: 0,
          last_study_date: null,
          current_language: 'python',
        };
        const { data: inserted } = await supabase
          .from('profiles')
          .upsert(seed, { onConflict: 'id' })
          .select()
          .maybeSingle();
        profile = (inserted as ProfileRow | null) ?? seed;
      }

      const progressRows = (progressResult.data ?? []) as { lesson_id: string; flawless: boolean }[];

      setState({
        profile,
        completedLessonIds: progressRows.map((row) => row.lesson_id),
        flawlessLessonIds: progressRows.filter((row) => row.flawless).map((row) => row.lesson_id),
        unlockedAchievementIds: (achievementsResult.data ?? []).map(
          (row: { achievement_id: string }) => row.achievement_id,
        ),
      });
    } catch (loadError) {
      console.error('[CodeQuest] falha ao carregar o progresso', loadError);
      setError('Não foi possível carregar seu progresso. Verifique sua conexão.');
      setState(emptyState(user.id, user.name));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  /* --------------------------------------------------------------------
   * Conclusao de licao: XP, nivel, streak e conquistas
   * ------------------------------------------------------------------ */
  const completeLesson = useCallback(
    async (lessonId: string, xp: number, flawless: boolean): Promise<CompletionResult> => {
      if (!user || !state) {
        return {
          xpEarned: 0,
          alreadyCompleted: false,
          leveledUp: false,
          newLevel: 1,
          streak: 0,
          newAchievements: [],
        };
      }

      const alreadyCompleted = state.completedLessonIds.includes(lessonId);
      // Refazer uma licao nao concede XP de novo, mas mantem o streak vivo.
      const xpEarned = alreadyCompleted ? 0 : xp;

      const today = todayISO();
      const { streak } = advanceStreak(
        state.profile.last_study_date,
        state.profile.streak_count,
        today,
      );

      const xpTotal = state.profile.xp_total + xpEarned;
      const previousLevel = state.profile.level;
      const newLevel = levelFromXp(xpTotal);

      const completedLessonIds = alreadyCompleted
        ? state.completedLessonIds
        : [...state.completedLessonIds, lessonId];
      const flawlessLessonIds =
        flawless && !state.flawlessLessonIds.includes(lessonId)
          ? [...state.flawlessLessonIds, lessonId]
          : state.flawlessLessonIds;

      const newAchievements = evaluateAchievements(
        {
          completedLessonIds,
          xpTotal,
          streak,
          flawlessLesson: flawlessLessonIds.length > 0,
        },
        state.unlockedAchievementIds,
      );

      const profile: ProfileRow = {
        ...state.profile,
        xp_total: xpTotal,
        level: newLevel,
        streak_count: streak,
        last_study_date: today,
      };

      const nextState: PlayerState = {
        profile,
        completedLessonIds,
        flawlessLessonIds,
        unlockedAchievementIds: [
          ...state.unlockedAchievementIds,
          ...newAchievements.map((achievement) => achievement.id),
        ],
      };

      // Atualiza a interface imediatamente e persiste em seguida.
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
      } else {
        const supabase = getSupabase()!;
        try {
          await Promise.all([
            supabase
              .from('profiles')
              .update({
                xp_total: profile.xp_total,
                level: profile.level,
                streak_count: profile.streak_count,
                last_study_date: profile.last_study_date,
                name: profile.name,
                avatar_url: profile.avatar_url,
              })
              .eq('id', user.id),
            supabase.from('user_progress').upsert(
              {
                user_id: user.id,
                lesson_id: lessonId,
                completed_at: new Date().toISOString(),
                xp_earned: xpEarned,
                flawless,
              },
              { onConflict: 'user_id,lesson_id' },
            ),
            newAchievements.length > 0
              ? supabase.from('user_achievements').upsert(
                  newAchievements.map((achievement) => ({
                    user_id: user.id,
                    achievement_id: achievement.id,
                    unlocked_at: new Date().toISOString(),
                  })),
                  { onConflict: 'user_id,achievement_id' },
                )
              : Promise.resolve(),
          ]);
        } catch (saveError) {
          console.error('[CodeQuest] falha ao salvar progresso', saveError);
          setError('Seu progresso foi registrado localmente, mas não chegou ao servidor.');
        }
      }

      return {
        xpEarned,
        alreadyCompleted,
        leveledUp: newLevel > previousLevel,
        newLevel,
        streak,
        newAchievements,
      };
    },
    [user, state],
  );

  const setCurrentLanguage = useCallback(
    async (slug: string) => {
      if (!user || !state || state.profile.current_language === slug) return;

      const nextState: PlayerState = {
        ...state,
        profile: { ...state.profile, current_language: slug },
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return;
      }
      await getSupabase()!.from('profiles').update({ current_language: slug }).eq('id', user.id);
    },
    [user, state],
  );

  const updateName = useCallback(
    async (name: string) => {
      const clean = name.trim();
      if (!user || !state || !clean || clean === state.profile.name) return;

      const nextState: PlayerState = {
        ...state,
        profile: { ...state.profile, name: clean },
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return;
      }
      await getSupabase()!.from('profiles').update({ name: clean }).eq('id', user.id);
    },
    [user, state],
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      state,
      loading,
      error,
      refresh: load,
      completeLesson,
      setCurrentLanguage,
      updateName,
    }),
    [state, loading, error, load, completeLesson, setCurrentLanguage, updateName],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer precisa estar dentro de <PlayerProvider>');
  return context;
};
