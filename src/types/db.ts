/** Espelho TypeScript das tabelas criadas em `supabase/migrations`. */

export interface ProfileRow {
  id: string;
  name: string;
  avatar_url: string | null;
  xp_total: number;
  level: number;
  streak_count: number;
  last_study_date: string | null;
  current_language: string | null;
  created_at?: string;
  updated_at?: string;
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
  avatar_url: string | null;
  xp_total: number;
  level: number;
  streak_count: number;
}

/** Estado completo do aluno, montado a partir das tabelas acima. */
export interface PlayerState {
  profile: ProfileRow;
  completedLessonIds: string[];
  flawlessLessonIds: string[];
  unlockedAchievementIds: string[];
}
