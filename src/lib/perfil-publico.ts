'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localState } from '@/lib/local-store';
import type { PerfilPublico, PublicProfile } from '@/types/db';

/**
 * Perfil publico de outra pessoa.
 *
 * O que aparece aqui e exatamente o que a policy de SELECT em `profiles`
 * libera para qualquer conta autenticada: nome, @username, avatar, nivel, XP,
 * streak e a tag exibida. **E-mail nao esta nessa lista** - ele nem chega a
 * existir na tabela `profiles`, mora so em `auth.users`, que nenhum cliente
 * consegue ler.
 */

const CAMPOS =
  'id, name, username, avatar_url, xp_total, level, streak_count, equipped_tag_id, is_developer';

/** Posicao no ranking global: 1 = primeiro lugar. */
export const fetchPosicaoRanking = async (userId: string, xpTotal: number): Promise<number> => {
  if (!isSupabaseConfigured) return localState.posicao(userId);

  // Contar "quantos tem mais XP que eu" usa o indice `profiles_xp_idx` e nao
  // traz linha nenhuma para o cliente.
  const { count, error } = await getSupabase()!
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('xp_total', xpTotal);

  if (error) throw new Error(error.message);
  return (count ?? 0) + 1;
};

/** Dados publicos a partir do id (usado pelo aviso de convite de duelo). */
export const fetchPerfilPublicoPorId = async (id: string): Promise<PublicProfile | null> => {
  if (!id) return null;

  if (!isSupabaseConfigured) {
    return localState.directory().find((perfil) => perfil.id === id) ?? null;
  }

  const { data, error } = await getSupabase()!
    .from('profiles')
    .select(CAMPOS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PublicProfile | null) ?? null;
};

/** Perfil publico a partir do @username. `null` quando nao existe. */
export const fetchPerfilPublico = async (username: string): Promise<PerfilPublico | null> => {
  const alvo = username.trim().toLowerCase();
  if (!alvo) return null;

  if (!isSupabaseConfigured) {
    const estado = localState.byUsername(alvo);
    if (!estado) return null;
    return {
      id: estado.profile.id,
      name: estado.profile.name,
      username: estado.profile.username,
      avatar_url: estado.profile.avatar_url,
      xp_total: estado.profile.xp_total,
      level: estado.profile.level,
      streak_count: estado.profile.streak_count,
      equipped_tag_id: estado.profile.equipped_tag_id,
      is_developer: estado.profile.is_developer,
      posicao: localState.posicao(estado.profile.id),
      unlockedTagIds: estado.unlockedTagIds,
      unlockedAchievementIds: estado.unlockedAchievementIds,
      completedLessonIds: estado.completedLessonIds,
    };
  }

  const supabase = getSupabase()!;

  const { data: perfil, error } = await supabase
    .from('profiles')
    .select(CAMPOS)
    .eq('username', alvo)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!perfil) return null;

  const base = perfil as PublicProfile;

  // As tres consultas seguintes sao independentes entre si.
  const [tagsResposta, conquistasResposta, posicao] = await Promise.all([
    supabase.from('user_tags').select('tag_id').eq('user_id', base.id),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', base.id),
    fetchPosicaoRanking(base.id, base.xp_total),
  ]);

  if (tagsResposta.error) throw new Error(tagsResposta.error.message);
  if (conquistasResposta.error) throw new Error(conquistasResposta.error.message);

  return {
    ...base,
    posicao,
    unlockedTagIds: (tagsResposta.data ?? []).map((linha: { tag_id: string }) => linha.tag_id),
    unlockedAchievementIds: (conquistasResposta.data ?? []).map(
      (linha: { achievement_id: string }) => linha.achievement_id,
    ),
    // O progresso lição a lição e privado: a policy de `user_progress` so
    // devolve as proprias linhas. No perfil publico mostramos o nivel e o XP,
    // que ja contam a historia sem expor a rotina de estudo de ninguem.
    completedLessonIds: [],
  };
};
