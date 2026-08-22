-- ===========================================================================
-- CodeQuest - sistema de amigos + nome de usuario (@username)
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de `0001_init.sql` (tabela profiles ja criada).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. @username no perfil
--
-- E um campo NOVO e independente do `name` (nome de exibicao, que continua
-- livre e com espacos). O username identifica a pessoa na busca de amigos.
--
-- Fica NULO de proposito para quem ja tinha conta: o aplicativo detecta o
-- nulo e pede o username no proximo login (ver src/components/UsernameGate).
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists username text;

-- Minusculas, numeros e _ ; de 3 a 20 caracteres; sem espacos.
alter table public.profiles
  drop constraint if exists profiles_username_formato;

alter table public.profiles
  add constraint profiles_username_formato
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

-- Unicidade sem diferenciar maiuscula/minuscula.
-- (indices unicos ignoram nulos, entao varias contas podem ficar sem username)
create unique index if not exists profiles_username_key
  on public.profiles (lower(username));

-- ---------------------------------------------------------------------------
-- 2. Amizades
--
-- Uma linha por par de pessoas:
--   user_id   = quem enviou o pedido
--   friend_id = quem recebeu
--   status    = 'pending' ate ser aceito, depois 'accepted'
--
-- Recusar um pedido e desfazer uma amizade sao a mesma operacao: apagar a
-- linha. Assim a pessoa pode ser convidada de novo mais tarde.
-- ---------------------------------------------------------------------------

create table if not exists public.friendships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  friend_id   uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint friendships_sem_auto_amizade check (user_id <> friend_id)
);

-- Impede duas linhas para o mesmo par, inclusive em direcoes opostas
-- (A -> B e B -> A viram conflito).
create unique index if not exists friendships_par_key
  on public.friendships (least(user_id, friend_id), greatest(user_id, friend_id));

-- Consultas do app: "meus amigos" e "pedidos que recebi".
create index if not exists friendships_user_idx   on public.friendships (user_id, status);
create index if not exists friendships_friend_idx on public.friendships (friend_id, status);

-- Mantem o updated_at coerente quando o pedido e aceito.
create or replace function public.touch_friendship()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists friendships_touch on public.friendships;
create trigger friendships_touch
  before update on public.friendships
  for each row execute function public.touch_friendship();

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
--
-- Regra geral: a pessoa so enxerga e mexe nas linhas em que ela aparece -
-- seja como quem enviou, seja como quem recebeu o pedido.
-- ---------------------------------------------------------------------------

alter table public.friendships enable row level security;

-- Ver apenas os proprios pedidos/amizades.
drop policy if exists "ve as proprias amizades" on public.friendships;
create policy "ve as proprias amizades"
  on public.friendships for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- Enviar pedido: so em nome proprio e sempre como 'pending'.
drop policy if exists "envia pedido de amizade" on public.friendships;
create policy "envia pedido de amizade"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- Aceitar: apenas quem RECEBEU o pedido pode mudar o status, e so para
-- 'accepted'. Isso impede que o remetente aceite o proprio pedido.
drop policy if exists "aceita pedido recebido" on public.friendships;
create policy "aceita pedido recebido"
  on public.friendships for update
  to authenticated
  using (auth.uid() = friend_id)
  with check (auth.uid() = friend_id and status = 'accepted');

-- Recusar pedido / cancelar envio / desfazer amizade: qualquer um dos dois
-- lados pode apagar a linha.
drop policy if exists "remove a propria amizade" on public.friendships;
create policy "remove a propria amizade"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- ---------------------------------------------------------------------------
-- 4. Sugestao de username para contas que ja existiam (OPCIONAL)
--
-- Nao e necessario: o app pede o username no proximo login de quem estiver
-- com o campo nulo. Descomente apenas se preferir preencher tudo de uma vez.
-- ---------------------------------------------------------------------------

-- update public.profiles
--    set username = sugerido.novo
--   from (
--     select p.id,
--            left(
--              regexp_replace(lower(p.name), '[^a-z0-9_]', '', 'g') || p.id::text,
--              12
--            ) || right(p.id::text, 4) as novo
--       from public.profiles p
--      where p.username is null
--   ) as sugerido
--  where public.profiles.id = sugerido.id
--    and public.profiles.username is null;
