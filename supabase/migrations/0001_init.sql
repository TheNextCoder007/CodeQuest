-- ===========================================================================
-- CodeQuest - schema inicial
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Depois rode `supabase/seed.sql` para popular o conteudo das trilhas.
--
-- Este script pode ser executado mais de uma vez sem quebrar nada.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. CONTEUDO (publico para leitura, escrita apenas pelo SQL Editor)
-- ---------------------------------------------------------------------------

create table if not exists public.languages (
  id           text primary key,
  name         text not null,
  slug         text not null unique,
  icon         text not null default '💻',
  description  text not null default '',
  available    boolean not null default false,
  order_index  int not null default 1
);

create table if not exists public.modules (
  id           text primary key,
  language_id  text not null references public.languages (id) on delete cascade,
  title        text not null,
  description  text not null default '',
  icon         text not null default '📘',
  order_index  int not null
);

create table if not exists public.lessons (
  id           text primary key,
  module_id    text not null references public.modules (id) on delete cascade,
  title        text not null,
  subtitle     text not null default '',
  content      text not null default '',
  polyglot     jsonb,
  order_index  int not null
);

create table if not exists public.exercises (
  id               text primary key,
  lesson_id        text not null references public.lessons (id) on delete cascade,
  prompt           text not null,
  starter_code     text,
  validation_type  text not null check (validation_type in ('output_match', 'multiple_choice', 'fill_blank')),
  expected_answer  text not null,
  options          jsonb,
  stdin            jsonb,
  hint             text,
  explanation      text not null default '',
  xp_reward        int not null default 20 check (xp_reward >= 0),
  order_index      int not null
);

create table if not exists public.achievements (
  id           text primary key,
  title        text not null,
  description  text not null default '',
  icon         text not null default '🏅',
  criteria     jsonb not null default '{}'::jsonb
);

create index if not exists modules_language_idx  on public.modules (language_id, order_index);
create index if not exists lessons_module_idx    on public.lessons (module_id, order_index);
create index if not exists exercises_lesson_idx  on public.exercises (lesson_id, order_index);

-- ---------------------------------------------------------------------------
-- 2. DADOS DO ALUNO
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  name              text not null default 'Estudante',
  avatar_url        text,
  xp_total          int not null default 0 check (xp_total >= 0),
  level             int not null default 1 check (level >= 1),
  streak_count      int not null default 0 check (streak_count >= 0),
  last_study_date   date,
  current_language  text default 'python',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  lesson_id     text not null references public.lessons (id) on delete cascade,
  completed_at  timestamptz not null default now(),
  xp_earned     int not null default 0 check (xp_earned >= 0),
  flawless      boolean not null default false,
  primary key (user_id, lesson_id)
);

create table if not exists public.user_achievements (
  user_id         uuid not null references public.profiles (id) on delete cascade,
  achievement_id  text not null references public.achievements (id) on delete cascade,
  unlocked_at     timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- Ordena o ranking sem varrer a tabela inteira.
create index if not exists profiles_xp_idx on public.profiles (xp_total desc);

-- ---------------------------------------------------------------------------
-- 3. GATILHOS
-- ---------------------------------------------------------------------------

-- Cria o perfil automaticamente quando alguem se cadastra (e-mail/senha ou
-- Google). O nome vem dos metadados enviados no cadastro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, 'estudante@codequest'), '@', 1)
    ),
    nullif(coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Como o app e 100% client-side, o proprio aluno escreve o XP no banco.
-- Este gatilho impede os abusos obvios: perder XP, dar um salto absurdo de
-- uma vez ou trocar o dono da linha.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
as $$
begin
  if new.id <> old.id then
    raise exception 'Nao e permitido alterar o id do perfil';
  end if;

  if new.xp_total < old.xp_total then
    raise exception 'O XP nao pode diminuir';
  end if;

  -- A licao mais valiosa da trilha vale 280 XP; 500 e uma folga segura.
  if new.xp_total - old.xp_total > 500 then
    raise exception 'Ganho de XP acima do permitido em uma unica atualizacao';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

alter table public.languages         enable row level security;
alter table public.modules           enable row level security;
alter table public.lessons           enable row level security;
alter table public.exercises         enable row level security;
alter table public.achievements      enable row level security;
alter table public.profiles          enable row level security;
alter table public.user_progress     enable row level security;
alter table public.user_achievements enable row level security;

-- Conteudo: leitura livre, escrita nenhuma (so pelo SQL Editor / service role).
drop policy if exists "conteudo legivel" on public.languages;
create policy "conteudo legivel" on public.languages for select using (true);

drop policy if exists "conteudo legivel" on public.modules;
create policy "conteudo legivel" on public.modules for select using (true);

drop policy if exists "conteudo legivel" on public.lessons;
create policy "conteudo legivel" on public.lessons for select using (true);

drop policy if exists "conteudo legivel" on public.exercises;
create policy "conteudo legivel" on public.exercises for select using (true);

drop policy if exists "conquistas legiveis" on public.achievements;
create policy "conquistas legiveis" on public.achievements for select using (true);

-- Perfis: todo usuario autenticado le (necessario para o ranking), mas cada
-- um so escreve na propria linha.
drop policy if exists "perfis visiveis para autenticados" on public.profiles;
create policy "perfis visiveis para autenticados"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "cria o proprio perfil" on public.profiles;
create policy "cria o proprio perfil"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "edita o proprio perfil" on public.profiles;
create policy "edita o proprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Progresso: cada aluno enxerga e altera apenas o proprio.
drop policy if exists "le o proprio progresso" on public.user_progress;
create policy "le o proprio progresso"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "grava o proprio progresso" on public.user_progress;
create policy "grava o proprio progresso"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "atualiza o proprio progresso" on public.user_progress;
create policy "atualiza o proprio progresso"
  on public.user_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Conquistas do aluno: mesma regra.
drop policy if exists "le as proprias conquistas" on public.user_achievements;
create policy "le as proprias conquistas"
  on public.user_achievements for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "grava as proprias conquistas" on public.user_achievements;
create policy "grava as proprias conquistas"
  on public.user_achievements for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "atualiza as proprias conquistas" on public.user_achievements;
create policy "atualiza as proprias conquistas"
  on public.user_achievements for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
