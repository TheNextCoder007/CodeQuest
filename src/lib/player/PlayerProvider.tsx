'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localState } from '@/lib/local-store';
import { lerEstadoDoServidor } from './loadPlayerState';
import { esperaRestanteMs, formatarEspera, validateUsername } from '@/lib/username';
import type { AchievementDefinition } from '@/content/achievements';
import type { SegredoId, TagDefinition } from '@/content/tags';
import { evaluateTags, tagPendenteDoSegredo } from '@/lib/tags';
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
  newTags: TagDefinition[];
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
  completeLesson: (
    lessonId: string,
    xp: number,
    flawless: boolean,
    /** Tempo entre abrir os desafios e concluir (para a tag secreta). */
    duracaoMs?: number,
  ) => Promise<CompletionResult>;
  /** Escolhe qual tag aparece no perfil. Lanca erro se nao estiver liberada. */
  equipTag: (tagId: string | null) => Promise<void>;
  /**
   * Registra uma acao secreta. Devolve a tag desbloqueada, ou `null` se o
   * segredo ja tinha sido descoberto antes.
   */
  registrarSegredo: (segredo: SegredoId) => Promise<TagDefinition | null>;
  /**
   * Concede as tags e conquistas que dependem do duelo 1v1.
   *
   * As estatisticas de PvP vivem numa tabela propria, escrita SO pelo
   * servidor. Quem chama isto passa o que leu de la; aqui so avaliamos os
   * criterios e gravamos o que faltar.
   */
  sincronizarPvp: (
    vitorias: number,
    vitoriasPorTema: Record<string, number>,
    empates?: number,
  ) => Promise<TagDefinition[]>;
  /**
   * Concede as conquistas de patamar da ranqueada.
   *
   * Recebe o maior patamar ja alcancado (0 = Bronze ... 6 = Mestre), que vem
   * de `ranked_estado` - tabela que so o servidor escreve. Devolve as
   * conquistas novas, para a tela poder comemorar.
   */
  sincronizarRanqueada: (patamarMax: number) => Promise<AchievementDefinition[]>;
  /**
   * Concede as tags e conquistas de desafio diario e, quando o desafio acabou
   * de ser concluido, espelha o XP que o servidor pagou.
   *
   * `total` vem de `desafio_estado()` - tabela que so o servidor escreve, e
   * cuja unica porta de escrita (`desafio_concluir`) nao aceita usuario nem
   * data. Aqui so avaliamos os criterios e gravamos o que faltar.
   *
   * `xp` e opcional: o perfil chama isto so para conferir premios pendentes
   * (sem mexer no XP), enquanto a tela do desafio passa os numeros que
   * `desafio_concluir()` devolveu. O cliente NAO soma nada - ele apenas copia
   * o que o servidor ja gravou.
   *
   * As duas coisas ficam na MESMA funcao de proposito: sao uma unica escrita
   * de estado. Separadas, a segunda gravaria por cima da primeira no modo
   * demonstracao, desfazendo o XP.
   */
  sincronizarDesafios: (
    total: number,
    xp?: { total: number; nivel: number },
  ) => Promise<{
    tags: TagDefinition[];
    conquistas: AchievementDefinition[];
  }>;
  setCurrentLanguage: (slug: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  /** Troca a foto de perfil (ja redimensionada e enviada por `enviarAvatar`). */
  updateAvatar: (url: string | null) => Promise<void>;
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
function pendencias(state: PlayerState): {
  conquistas: AchievementDefinition[];
  tags: TagDefinition[];
} {
  const tagsFaltando = evaluateTags(
    {
      level: state.profile.level,
      completedLessonIds: state.completedLessonIds,
      isDeveloper: state.profile.is_developer,
    },
    state.unlockedTagIds,
  );

  const conquistas = evaluateAchievements(
    {
      completedLessonIds: state.completedLessonIds,
      xpTotal: state.profile.xp_total,
      streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
      flawlessLesson: state.flawlessLessonIds.length > 0,
      unlockedTagIds: [...state.unlockedTagIds, ...tagsFaltando.map((tag) => tag.id)],
    },
    state.unlockedAchievementIds,
  );

  return { conquistas, tags: tagsFaltando };
}

/** Aplica as pendencias ao estado (sem tocar no servidor). */
function comPendencias(
  state: PlayerState,
  faltando: { conquistas: AchievementDefinition[]; tags: TagDefinition[] },
): PlayerState {
  if (faltando.conquistas.length === 0 && faltando.tags.length === 0) return state;
  return {
    ...state,
    unlockedAchievementIds: [
      ...state.unlockedAchievementIds,
      ...faltando.conquistas.map((conquista) => conquista.id),
    ],
    unlockedTagIds: [...state.unlockedTagIds, ...faltando.tags.map((tag) => tag.id)],
  };
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
      const faltando = pendencias(local);
      const ajustado = comPendencias(local, faltando);
      if (ajustado !== local) localState.save(user.id, ajustado);
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
        const faltando = pendencias(resultado.state);

        setState(comPendencias(resultado.state, faltando));
        setOrigem('servidor');
        setError(null);
        setLoading(false);

        if (faltando.conquistas.length > 0 || faltando.tags.length > 0) {
          void comRetentativas(async () => {
            if (faltando.conquistas.length > 0) {
              await supabase.from('user_achievements').upsert(
                faltando.conquistas.map((conquista) => ({
                  user_id: user.id,
                  achievement_id: conquista.id,
                  unlocked_at: new Date().toISOString(),
                })),
                { onConflict: 'user_id,achievement_id' },
              );
            }
            if (faltando.tags.length > 0) {
              await supabase.from('user_tags').upsert(
                faltando.tags.map((tag) => ({
                  user_id: user.id,
                  tag_id: tag.id,
                  unlocked_at: new Date().toISOString(),
                })),
                { onConflict: 'user_id,tag_id' },
              );
            }
          }).catch((falha) =>
            console.error('[CodeQuest] falha ao gravar conquistas/tags atrasadas', falha),
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
    async (
      lessonId: string,
      xp: number,
      flawless: boolean,
      duracaoMs?: number,
    ): Promise<CompletionResult> => {
      if (!user || !state) {
        return {
          xpEarned: 0,
          alreadyCompleted: false,
          leveledUp: false,
          newLevel: 1,
          streak: 0,
          newAchievements: [],
          newTags: [],
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

      /* --- tags -----------------------------------------------------------
       * Tres tipos entram aqui:
       *   1. as de nivel/trilha, por avaliacao;
       *   2. as secretas que dependem de COMO a licao foi concluida
       *      (velocidade, horario, serie sem erros);
       * A do logo e registrada de outro lugar (`registrarSegredo`).
       * ------------------------------------------------------------------ */
      const novasTags: TagDefinition[] = [
        ...evaluateTags(
          {
            level: newLevel,
            completedLessonIds,
            isDeveloper: state.profile.is_developer,
          },
          state.unlockedTagIds,
        ),
      ];

      const registrarSecreta = (segredo: SegredoId) => {
        const tag = tagPendenteDoSegredo(segredo, [
          ...state.unlockedTagIds,
          ...novasTags.map((item) => item.id),
        ]);
        if (tag) novasTags.push(tag);
      };

      // Relampago: menos de 30 segundos, e sem errar nada.
      if (!alreadyCompleted && flawless && typeof duracaoMs === 'number' && duracaoMs < 30_000) {
        registrarSecreta('licao-relampago');
      }
      // Coruja: concluiu entre 00h e 04h59 no horario do proprio aparelho.
      const hora = new Date().getHours();
      if (!alreadyCompleted && hora < 5) registrarSecreta('madrugada');
      // Serie impecavel: 5 licoes diferentes sem nenhum erro.
      if (flawlessLessonIds.length >= 5) registrarSecreta('serie-impecavel');

      const unlockedTagIds = [...state.unlockedTagIds, ...novasTags.map((tag) => tag.id)];

      const newAchievements = evaluateAchievements(
        {
          completedLessonIds,
          xpTotal,
          streak,
          flawlessLesson: flawlessLessonIds.length > 0,
          unlockedTagIds,
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
        unlockedTagIds,
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
            novasTags.length > 0
              ? supabase.from('user_tags').upsert(
                  novasTags.map((tag) => ({
                    user_id: user.id,
                    tag_id: tag.id,
                    unlocked_at: new Date().toISOString(),
                  })),
                  { onConflict: 'user_id,tag_id' },
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
        newTags: novasTags,
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

      const erroFormato = validateUsername(clean);
      if (erroFormato) throw new Error(erroFormato);

      // A primeira escolha e livre e nao inicia a contagem (quem acabou de se
      // cadastrar precisa poder corrigir um erro de digitacao). O relogio so
      // comeca na primeira troca de verdade.
      // Quem manda e o gatilho no banco - isto aqui so evita a ida ate o
      // servidor para receber a mesma negativa.
      const primeiraEscolha = !state.profile.username;
      if (!primeiraEscolha) {
        const restante = esperaRestanteMs(state.profile.username_changed_at);
        if (restante > 0) {
          throw new Error(
            `Você só pode trocar o nome de usuário a cada 24 horas. Faltam ${formatarEspera(restante)}.`,
          );
        }
      }

      if (!isSupabaseConfigured) {
        if (localState.usernameTaken(clean, user.id)) {
          throw new Error('Esse nome de usuário já está em uso.');
        }
        const nextState: PlayerState = {
          ...state,
          profile: {
            ...state.profile,
            username: clean,
            username_changed_at: primeiraEscolha
              ? state.profile.username_changed_at
              : new Date().toISOString(),
          },
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
        if (duplicado) throw new Error('Esse nome de usuário já está em uso. Tente outro.');

        // Mensagens que o gatilho `guard_profile_update` levanta.
        if (/24 horas/i.test(saveError.message)) {
          throw new Error('Você só pode trocar o nome de usuário a cada 24 horas.');
        }
        if (/nao e permitido|não é permitido|username_limpo/i.test(saveError.message)) {
          throw new Error('Esse nome de usuário não é permitido. Escolha outro.');
        }
        throw new Error(saveError.message);
      }

      setState({
        ...state,
        profile: {
          ...state.profile,
          username: clean,
          username_changed_at: primeiraEscolha
            ? state.profile.username_changed_at
            : new Date().toISOString(),
        },
      });
    },
    [user, state],
  );

  const updateAvatar = useCallback(
    async (url: string | null) => {
      if (!user || !state) return;

      const nextState: PlayerState = {
        ...state,
        profile: { ...state.profile, avatar_url: url },
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return;
      }

      const { error: falha } = await getSupabase()!
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (falha) {
        setState(state);
        throw new Error(falha.message);
      }
    },
    [user, state],
  );

  /**
   * Escolhe a tag exibida no perfil.
   *
   * O banco tambem confere (gatilho `guard_profile_update`): so passa tag que
   * esta em `user_tags`. A checagem daqui e para dar erro imediato.
   */
  const equipTag = useCallback(
    async (tagId: string | null) => {
      if (!user || !state) return;
      if (tagId && !state.unlockedTagIds.includes(tagId)) {
        throw new Error('Você ainda não desbloqueou essa tag.');
      }

      const nextState: PlayerState = {
        ...state,
        profile: { ...state.profile, equipped_tag_id: tagId },
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return;
      }

      const { error: falha } = await getSupabase()!
        .from('profiles')
        .update({ equipped_tag_id: tagId })
        .eq('id', user.id);

      if (falha) {
        setState(state); // desfaz
        throw new Error(falha.message);
      }
    },
    [user, state],
  );

  /**
   * Registra uma acao secreta (ver `SEGREDOS` em src/content/tags.ts).
   * Idempotente: chamar de novo depois de descoberto nao faz nada.
   */
  const registrarSegredo = useCallback(
    async (segredo: SegredoId): Promise<TagDefinition | null> => {
      if (!user || !state) return null;

      const tag = tagPendenteDoSegredo(segredo, state.unlockedTagIds);
      if (!tag) return null;

      const unlockedTagIds = [...state.unlockedTagIds, tag.id];
      const novasConquistas = evaluateAchievements(
        {
          completedLessonIds: state.completedLessonIds,
          xpTotal: state.profile.xp_total,
          streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
          flawlessLesson: state.flawlessLessonIds.length > 0,
          unlockedTagIds,
        },
        state.unlockedAchievementIds,
      );

      const nextState: PlayerState = {
        ...state,
        unlockedTagIds,
        unlockedAchievementIds: [
          ...state.unlockedAchievementIds,
          ...novasConquistas.map((conquista) => conquista.id),
        ],
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return tag;
      }

      const supabase = getSupabase()!;
      try {
        await comRetentativas(async () => {
          await supabase
            .from('user_tags')
            .upsert(
              { user_id: user.id, tag_id: tag.id, unlocked_at: new Date().toISOString() },
              { onConflict: 'user_id,tag_id' },
            );
          if (novasConquistas.length > 0) {
            await supabase.from('user_achievements').upsert(
              novasConquistas.map((conquista) => ({
                user_id: user.id,
                achievement_id: conquista.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,achievement_id' },
            );
          }
        });
      } catch (falha) {
        console.error('[CodeQuest] falha ao gravar tag secreta', falha);
      }

      return tag;
    },
    [user, state],
  );

  const sincronizarPvp = useCallback(
    async (
      vitorias: number,
      vitoriasPorTema: Record<string, number>,
      empates = 0,
    ): Promise<TagDefinition[]> => {
      if (!user || !state) return [];

      const novasTags = evaluateTags(
        {
          level: state.profile.level,
          completedLessonIds: state.completedLessonIds,
          isDeveloper: state.profile.is_developer,
          pvpVitorias: vitorias,
          pvpVitoriasPorTema: vitoriasPorTema,
        },
        state.unlockedTagIds,
      );

      const unlockedTagIds = [...state.unlockedTagIds, ...novasTags.map((tag) => tag.id)];
      const novasConquistas = evaluateAchievements(
        {
          completedLessonIds: state.completedLessonIds,
          xpTotal: state.profile.xp_total,
          streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
          flawlessLesson: state.flawlessLessonIds.length > 0,
          unlockedTagIds,
          pvpVitorias: vitorias,
          pvpEmpates: empates,
        },
        state.unlockedAchievementIds,
      );

      if (novasTags.length === 0 && novasConquistas.length === 0) return [];

      const nextState: PlayerState = {
        ...state,
        unlockedTagIds,
        unlockedAchievementIds: [
          ...state.unlockedAchievementIds,
          ...novasConquistas.map((conquista) => conquista.id),
        ],
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return novasTags;
      }

      const supabase = getSupabase()!;
      try {
        await comRetentativas(async () => {
          if (novasTags.length > 0) {
            await supabase.from('user_tags').upsert(
              novasTags.map((tag) => ({
                user_id: user.id,
                tag_id: tag.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,tag_id' },
            );
          }
          if (novasConquistas.length > 0) {
            await supabase.from('user_achievements').upsert(
              novasConquistas.map((conquista) => ({
                user_id: user.id,
                achievement_id: conquista.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,achievement_id' },
            );
          }
        });
      } catch (falha) {
        console.error('[CodeQuest] falha ao gravar tags de duelo', falha);
      }

      return novasTags;
    },
    [user, state],
  );

  const sincronizarDesafios = useCallback(
    async (
      total: number,
      xp?: { total: number; nivel: number },
    ): Promise<{ tags: TagDefinition[]; conquistas: AchievementDefinition[] }> => {
      const vazio = { tags: [] as TagDefinition[], conquistas: [] as AchievementDefinition[] };
      if (!user || !state) return vazio;

      const perfil = xp
        ? { ...state.profile, xp_total: xp.total, level: xp.nivel }
        : state.profile;

      const novasTags = evaluateTags(
        {
          level: state.profile.level,
          completedLessonIds: state.completedLessonIds,
          isDeveloper: state.profile.is_developer,
          desafiosDiarios: total,
        },
        state.unlockedTagIds,
      );

      const unlockedTagIds = [...state.unlockedTagIds, ...novasTags.map((tag) => tag.id)];
      const novasConquistas = evaluateAchievements(
        {
          completedLessonIds: state.completedLessonIds,
          xpTotal: state.profile.xp_total,
          streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
          flawlessLesson: state.flawlessLessonIds.length > 0,
          unlockedTagIds,
          desafiosDiarios: total,
        },
        state.unlockedAchievementIds,
      );

      const mudouOPerfil = perfil !== state.profile;
      if (novasTags.length === 0 && novasConquistas.length === 0 && !mudouOPerfil) return vazio;

      const nextState: PlayerState = {
        ...state,
        profile: perfil,
        unlockedTagIds,
        unlockedAchievementIds: [
          ...state.unlockedAchievementIds,
          ...novasConquistas.map((conquista) => conquista.id),
        ],
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return { tags: novasTags, conquistas: novasConquistas };
      }

      const supabase = getSupabase()!;
      try {
        await comRetentativas(async () => {
          if (novasTags.length > 0) {
            await supabase.from('user_tags').upsert(
              novasTags.map((tag) => ({
                user_id: user.id,
                tag_id: tag.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,tag_id' },
            );
          }
          if (novasConquistas.length > 0) {
            await supabase.from('user_achievements').upsert(
              novasConquistas.map((conquista) => ({
                user_id: user.id,
                achievement_id: conquista.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,achievement_id' },
            );
          }
        });
      } catch (falha) {
        console.error('[CodeQuest] falha ao gravar premios do desafio diario', falha);
      }

      // Repare que o XP nao e enviado ao Supabase aqui: quem gravou
      // `xp_total` e `level` foi `desafio_concluir()`, dentro do banco. O que
      // este bloco escreve sao apenas as tags e conquistas.
      return { tags: novasTags, conquistas: novasConquistas };
    },
    [user, state],
  );

  const sincronizarRanqueada = useCallback(
    async (patamarMax: number): Promise<AchievementDefinition[]> => {
      if (!user || !state) return [];

      const novasConquistas = evaluateAchievements(
        {
          completedLessonIds: state.completedLessonIds,
          xpTotal: state.profile.xp_total,
          streak: displayStreak(state.profile.last_study_date, state.profile.streak_count),
          flawlessLesson: state.flawlessLessonIds.length > 0,
          unlockedTagIds: state.unlockedTagIds,
          rankedPatamarMax: patamarMax,
        },
        state.unlockedAchievementIds,
      );

      if (novasConquistas.length === 0) return [];

      const nextState: PlayerState = {
        ...state,
        unlockedAchievementIds: [
          ...state.unlockedAchievementIds,
          ...novasConquistas.map((conquista) => conquista.id),
        ],
      };
      setState(nextState);

      if (!isSupabaseConfigured) {
        localState.save(user.id, nextState);
        return novasConquistas;
      }

      try {
        await comRetentativas(async () => {
          await getSupabase()!
            .from('user_achievements')
            .upsert(
              novasConquistas.map((conquista) => ({
                user_id: user.id,
                achievement_id: conquista.id,
                unlocked_at: new Date().toISOString(),
              })),
              { onConflict: 'user_id,achievement_id' },
            );
        });
      } catch (falha) {
        console.error('[CodeQuest] falha ao gravar conquistas de ranqueada', falha);
      }

      return novasConquistas;
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
      equipTag,
      registrarSegredo,
      sincronizarPvp,
      sincronizarRanqueada,
      sincronizarDesafios,
      setCurrentLanguage,
      updateName,
      updateAvatar,
      updateUsername,
    }),
    [
      state,
      loading,
      error,
      origem,
      load,
      completeLesson,
      equipTag,
      registrarSegredo,
      sincronizarPvp,
      sincronizarRanqueada,
      sincronizarDesafios,
      setCurrentLanguage,
      updateName,
      updateAvatar,
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
