'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localState } from '@/lib/local-store';
import { lerEstadoDoServidor } from './loadPlayerState';
import type { AchievementDefinition } from '@/content/achievements';
import type { PlayerState, ProfileRow } from '@/types/db';
import {
  advanceStreak,
  displayStreak,
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

/**
 * De onde veio o estado que esta na tela.
 *  - 'nenhum'   : ainda nao conseguimos ler nada (nao confie em nada dele)
 *  - 'servidor' : lido do Supabase com sucesso
 *  - 'local'    : modo demonstracao (localStorage)
 */
export type OrigemDoEstado = 'nenhum' | 'servidor' | 'local';

interface PlayerContextValue {
  state: PlayerState | null;
  loading: boolean;
  /** Erro de rede/permissao ao falar com o Supabase, se houver. */
  error: string | null;
  /**
   * So confie em `state.profile` para decisoes importantes (como pedir o
   * @username) quando isto for diferente de 'nenhum'.
   */
  origem: OrigemDoEstado;
  refresh: () => Promise<void>;
  completeLesson: (lessonId: string, xp: number, flawless: boolean) => Promise<CompletionResult>;
  setCurrentLanguage: (slug: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  /** Grava o @username. Lanca erro se ja estiver em uso. */
  updateUsername: (username: string) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

/**
 * Conquistas que o aluno ja merece mas que nao chegaram a ser gravadas.
 *
 * Antes, elas so eram avaliadas no momento em que a licao terminava: se a
 * gravacao falhasse ali (rede caiu), a medalha ficava perdida para sempre.
 * Reavaliar a cada carregamento fecha esse buraco.
 */
function conquistasFaltando(state: PlayerState): AchievementDefinition[] {
  return evaluateAchievements(
    {
      completedLessonIds: state.completedLessonIds,
      xpTotal: state.profile.xp_total,
      streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
      flawlessLesson: state.flawlessLessonIds.length > 0,
    },
    state.unlockedAchievementIds,
  );
}

/** Repete uma operacao de rede algumas vezes antes de desistir. */
async function comRetentativas<T>(acao: () => Promise<T>, tentativas = 3): Promise<T> {
  let ultimoErro: unknown;
  for (let i = 0; i < tentativas; i += 1) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, 400 * i));
    try {
      return await acao();
    } catch (falha) {
      ultimoErro = falha;
    }
  }
  throw ultimoErro;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origem, setOrigem] = useState<OrigemDoEstado>('nenhum');

  /* --------------------------------------------------------------------
   * Carregamento do estado do aluno
   *
   * Regra central: falha de leitura NUNCA vira estado zerado. Se o servidor
   * nao responde, o que ja estava na tela continua, e a pessoa ve um aviso
   * com botao de tentar de novo - em vez de ver "0 XP, 0 licoes" e achar
   * que perdeu tudo.
   * ------------------------------------------------------------------ */
  const load = useCallback(async () => {
    if (!user) {
      setState(null);
      setOrigem('nenhum');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      const local = localState.load(user.id, user.name);
      const faltando = conquistasFaltando(local);
      const ajustado =
        faltando.length === 0
          ? local
          : {
              ...local,
              unlockedAchievementIds: [
                ...local.unlockedAchievementIds,
                ...faltando.map((conquista) => conquista.id),
              ],
            };
      if (faltando.length > 0) localState.save(user.id, ajustado);
      setState(ajustado);
      setOrigem('local');
      setLoading(false);
      return;
    }

    const supabase = getSupabase()!;
    const dados = { id: user.id, name: user.name, avatarUrl: user.avatarUrl };

    // Falha logo depois do login com Google costuma ser passageira (o token
    // ainda esta sendo gravado). Tres tentativas curtas resolvem sem que a
    // pessoa perceba.
    let ultimoMotivo = '';
    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      if (tentativa > 0) {
        await new Promise((resolve) => setTimeout(resolve, 400 * tentativa));
      }

      const resultado = await lerEstadoDoServidor(supabase, dados);
      if (resultado.tipo === 'ok') {
        const faltando = conquistasFaltando(resultado.state);

        setState(
          faltando.length === 0
            ? resultado.state
            : {
                ...resultado.state,
                unlockedAchievementIds: [
                  ...resultado.state.unlockedAchievementIds,
                  ...faltando.map((conquista) => conquista.id),
                ],
              },
        );
        setOrigem('servidor');
        setError(null);
        setLoading(false);

        if (faltando.length > 0) {
          void comRetentativas(async () => {
            await supabase.from('user_achievements').upsert(
              faltando.map((conquista) => ({
                user_id: user.id,
                achievement_id: conquista.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,achievement_id' },
            );
          }).catch((falha) =>
            console.error('[CodeQuest] falha ao gravar conquistas atrasadas', falha),
          );
        }
        return;
      }
      ultimoMotivo = resultado.motivo;
    }

    console.error('[CodeQuest] falha ao carregar o progresso:', ultimoMotivo);
    setError(
      'Não foi possível falar com o servidor agora. Seu progresso está salvo — toque em tentar de novo.',
    );
    // Nao mexe em `state` de proposito: se ja havia algo carregado, continua.
    setLoading(false);
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
          // Gravar tambem merece retentativa: no celular a rede cai no meio
          // com frequencia, e sem isso a licao concluida sumiria no proximo
          // carregamento (o XP local subia, o do servidor nao).
          await comRetentativas(() => Promise.all([
            supabase
              .from('profiles')
              // `name` e `avatar_url` ficam de fora de proposito: quem manda
              // neles sao `updateName` / o perfil. Incluir aqui ja significou
              // sobrescrever o nome escolhido com o nome vindo do login.
              .update({
                xp_total: profile.xp_total,
                level: profile.level,
                streak_count: profile.streak_count,
                last_study_date: profile.last_study_date,
              })
              .eq('id', user.id),
            // Refazer uma licao nao pode rebaixar o `xp_earned` ja registrado
            // (senao o historico de quanto cada licao rendeu vai zerando, e
            // com ele a possibilidade de reconstruir o XP a partir dele).
            alreadyCompleted
              ? supabase
                  .from('user_progress')
                  .update({ completed_at: new Date().toISOString(), ...(flawless ? { flawless: true } : {}) })
                  .eq('user_id', user.id)
                  .eq('lesson_id', lessonId)
              : supabase.from('user_progress').upsert(
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
          ]));
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

  /**
   * Define o @username.
   *
   * A unicidade real e do banco (indice unico em lower(username)); se dois
   * alunos escolherem o mesmo nome ao mesmo tempo, o segundo recebe o erro
   * 23505 e a interface pede outro. Por isso o estado local so e atualizado
   * depois que o banco confirma.
   */
  const updateUsername = useCallback(
    async (username: string) => {
      const clean = username.trim().toLowerCase();
      if (!user || !state || !clean || clean === state.profile.username) return;

      if (!isSupabaseConfigured) {
        if (localState.usernameTaken(clean, user.id)) {
          throw new Error('Esse nome de usuário já está em uso.');
        }
        const nextState: PlayerState = {
          ...state,
          profile: { ...state.profile, username: clean },
        };
        setState(nextState);
        localState.save(user.id, nextState);
        return;
      }

      const { error: saveError } = await getSupabase()!
        .from('profiles')
        .update({ username: clean })
        .eq('id', user.id);

      if (saveError) {
        const duplicado =
          saveError.code === '23505' || saveError.message.includes('profiles_username_key');
        throw new Error(
          duplicado
            ? 'Esse nome de usuário já está em uso. Tente outro.'
            : saveError.message,
        );
      }

      setState({ ...state, profile: { ...state.profile, username: clean } });
    },
    [user, state],
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      state,
      loading,
      error,
      origem,
      refresh: load,
      completeLesson,
      setCurrentLanguage,
      updateName,
      updateUsername,
    }),
    [
      state,
      loading,
      error,
      origem,
      load,
      completeLesson,
      setCurrentLanguage,
      updateName,
      updateUsername,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer precisa estar dentro de <PlayerProvider>');
  return context;
};
