-- ===========================================================================
-- CodeQuest - tags de perfil, perfis publicos, foto e regras do @username
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de `0001_init.sql`, `0002_amigos.sql` e `0003_protecao_progresso.sql`.
--
-- Depois de rodar este arquivo, rode tambem `supabase/seed.sql` de novo: ele
-- passou a popular tambem o catalogo de tags.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Colunas novas no perfil
-- ---------------------------------------------------------------------------

alter table public.profiles
  -- Quando o @username foi trocado pela ultima vez (regra de 24h).
  add column if not exists username_changed_at timestamptz,
  -- Qual tag aparece no perfil. Precisa ser uma que a pessoa desbloqueou.
  add column if not exists equipped_tag_id text,
  -- Concedida A MAO (ver funcao `definir_desenvolvedor` no fim do arquivo).
  -- O gatilho impede que o proprio usuario ligue isso.
  add column if not exists is_developer boolean not null default false;

-- ---------------------------------------------------------------------------
-- 2. Catalogo de tags (conteudo: leitura livre, escrita so pelo SQL Editor)
-- ---------------------------------------------------------------------------

create table if not exists public.tags (
  id           text primary key,
  name         text not null,
  description  text not null default '',
  icon         text not null default '🏷️',
  rarity       text not null check (rarity in ('comum', 'raro', 'epico', 'mitico', 'lendario', 'dev')),
  criteria     jsonb not null default '{}'::jsonb,
  secret       boolean not null default false,
  order_index  int not null default 1
);

create table if not exists public.user_tags (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  tag_id       text not null references public.tags (id) on delete cascade,
  unlocked_at  timestamptz not null default now(),
  primary key (user_id, tag_id)
);

create index if not exists user_tags_user_idx on public.user_tags (user_id);

-- A tag exibida so pode ser uma que existe no catalogo.
alter table public.profiles
  drop constraint if exists profiles_equipped_tag_fk;
alter table public.profiles
  add constraint profiles_equipped_tag_fk
  foreign key (equipped_tag_id) references public.tags (id) on delete set null;

-- ---------------------------------------------------------------------------
-- 3. Palavras bloqueadas no @username
--
-- Lista curta e direta, de proposito. Nao tentamos pegar disfarce com numero
-- ou simbolo ("s3x0" passa): filtro agressivo barra nome inocente.
--
-- A MESMA lista existe em `src/content/palavras-bloqueadas.ts`; o teste
-- `npm run test:tags` compara as duas e falha se saírem de sincronia.
-- ---------------------------------------------------------------------------

create or replace function public.username_proibido(alvo text)
returns boolean
language plpgsql
immutable
as $$
declare
  palavras text[] := array[
    'boceta','boquete','bosta','buceta','caralho','cu','cuzao','cuzinho',
    'fdp','foda','fodase','foder','fuder','gozada','mamei','merda','penis',
    'piroca','porno','pornografia','porra','punheta','puta','putao','putaria',
    'sexo','siririca','tesao','vagina','viado','xereca','xoxota'
  ];
  limpo   text := lower(trim(coalesce(alvo, '')));
  base    text;
  partes  text[];
  palavra text;
begin
  if limpo = '' then
    return false;
  end if;

  -- `davi_puta2` -> base `daviputa`, partes {davi, puta}
  base   := regexp_replace(limpo, '[_0-9]+', '', 'g');
  partes := array_remove(regexp_split_to_array(limpo, '[_0-9]+'), '');

  foreach palavra in array palavras loop
    if base = palavra then
      return true;
    end if;
    if palavra = any (partes) then
      return true;
    end if;
    -- Palavra curta so bloqueia inteira ou como pedaco separado: senao "cu"
    -- barraria "curioso" e "puta" barraria "disputa".
    if length(palavra) >= 5 and position(palavra in base) > 0 then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Gatilho do perfil - agora tambem cuida de username, tag e is_developer
--
-- Mantem tudo que a 0003 ja garantia (XP nao cai, salto absurdo barrado,
-- id fixo) e acrescenta:
--   - troca de @username so a cada 24h;
--   - @username com palavrao e recusado;
--   - so da para exibir tag que a pessoa desbloqueou;
--   - `is_developer` nao pode ser ligado pelo proprio usuario.
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
as $$
declare
  reconciliando boolean := coalesce(current_setting('codequest.reconciliando', true), '') = 'on';
  admin         boolean := coalesce(current_setting('codequest.admin', true), '') = 'on';
  espera        interval := interval '24 hours';
begin
  if new.id <> old.id then
    raise exception 'Nao e permitido alterar o id do perfil';
  end if;

  if new.xp_total < old.xp_total then
    raise exception 'O XP nao pode diminuir';
  end if;

  -- A licao mais valiosa da trilha vale 280 XP; 500 e uma folga segura.
  if not reconciliando and new.xp_total - old.xp_total > 500 then
    raise exception 'Ganho de XP acima do permitido em uma unica atualizacao';
  end if;

  -- --- @username -----------------------------------------------------------
  if new.username is distinct from old.username then
    if new.username is not null and public.username_proibido(new.username) then
      raise exception 'Esse nome de usuario nao e permitido'
        using errcode = 'check_violation';
    end if;

    -- A primeira escolha e livre e NAO inicia a contagem: quem acabou de se
    -- cadastrar precisa poder corrigir um erro de digitacao na hora. O relogio
    -- so comeca na primeira troca de verdade.
    if old.username is not null then
      if not admin
         and old.username_changed_at is not null
         and old.username_changed_at > now() - espera then
        raise exception 'Voce so pode trocar o nome de usuario a cada 24 horas'
          using errcode = 'check_violation';
      end if;
      new.username_changed_at := now();
    end if;
  end if;

  -- --- tag exibida ---------------------------------------------------------
  if new.equipped_tag_id is distinct from old.equipped_tag_id
     and new.equipped_tag_id is not null then
    if not exists (
      select 1 from public.user_tags
       where user_id = new.id and tag_id = new.equipped_tag_id
    ) then
      raise exception 'Voce ainda nao desbloqueou essa tag'
        using errcode = 'check_violation';
    end if;
  end if;

  -- --- selo de desenvolvedor ----------------------------------------------
  if new.is_developer is distinct from old.is_developer and not admin then
    raise exception 'O selo de desenvolvedor nao pode ser alterado por aqui';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- Nome de usuario proibido tambem nao entra em perfil novo.
alter table public.profiles drop constraint if exists profiles_username_limpo;
alter table public.profiles
  add constraint profiles_username_limpo
  check (username is null or not public.username_proibido(username));

-- ---------------------------------------------------------------------------
-- 5. Row Level Security das tabelas novas
--
-- Perfil publico = leitura para qualquer pessoa autenticada, escrita so do
-- dono. As tags que alguem desbloqueou sao parte do perfil publico (todo
-- mundo pode ver), mas so o proprio dono grava as suas.
-- ---------------------------------------------------------------------------

alter table public.tags      enable row level security;
alter table public.user_tags enable row level security;

drop policy if exists "tags legiveis" on public.tags;
create policy "tags legiveis" on public.tags for select using (true);

drop policy if exists "tags de todos sao visiveis" on public.user_tags;
create policy "tags de todos sao visiveis"
  on public.user_tags for select
  to authenticated
  using (true);

drop policy if exists "grava as proprias tags" on public.user_tags;
create policy "grava as proprias tags"
  on public.user_tags for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Nao existe policy de UPDATE nem de DELETE em user_tags de proposito:
-- tag desbloqueada nao se perde.

-- ---------------------------------------------------------------------------
-- 6. Foto de perfil (Supabase Storage)
--
-- Bucket publico para leitura, mas cada pessoa so escreve dentro da pasta com
-- o proprio id: `avatars/<uid>/<arquivo>`.
--
-- O bloco abaixo e ignorado em bancos sem o schema `storage` (por exemplo o
-- Postgres usado nos testes automatizados).
-- ---------------------------------------------------------------------------

do $$
begin
  if to_regclass('storage.buckets') is null then
    raise notice 'schema storage ausente - parte de avatares ignorada';
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('avatars', 'avatars', true, 2097152,
          array['image/jpeg', 'image/png', 'image/webp'])
  on conflict (id) do update
    set public = true,
        file_size_limit = 2097152,
        allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

  execute 'drop policy if exists "avatares sao publicos" on storage.objects';
  execute $p$
    create policy "avatares sao publicos" on storage.objects
      for select using (bucket_id = 'avatars')
  $p$;

  execute 'drop policy if exists "envia o proprio avatar" on storage.objects';
  execute $p$
    create policy "envia o proprio avatar" on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
  $p$;

  execute 'drop policy if exists "troca o proprio avatar" on storage.objects';
  execute $p$
    create policy "troca o proprio avatar" on storage.objects
      for update to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
  $p$;

  execute 'drop policy if exists "apaga o proprio avatar" on storage.objects';
  execute $p$
    create policy "apaga o proprio avatar" on storage.objects
      for delete to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
  $p$;
end
$$;

-- ---------------------------------------------------------------------------
-- 7. Posicao no ranking global
--
-- Contar "quantos tem mais XP que eu" e barato com o indice `profiles_xp_idx`
-- que ja existe desde a 0001.
-- ---------------------------------------------------------------------------

create or replace function public.posicao_no_ranking(alvo uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select 1 + count(*)::int
    from public.profiles outros
   where outros.xp_total > (select xp_total from public.profiles where id = alvo);
$$;

grant execute on function public.posicao_no_ranking(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Conceder (ou tirar) o selo de desenvolvedor
--
-- Uso, no SQL Editor do Supabase:
--
--     select public.definir_desenvolvedor('seu_username', true);
--
-- Isso liga `is_developer` e ja entrega a tag "Desenvolvedor" para a conta.
-- Nenhum usuario comum consegue chamar esta funcao (o grant e so para quem
-- roda pelo painel / service role).
-- ---------------------------------------------------------------------------

create or replace function public.definir_desenvolvedor(alvo_username text, valor boolean default true)
returns table (id uuid, username text, is_developer boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  alvo uuid;
begin
  select p.id into alvo from public.profiles p where lower(p.username) = lower(alvo_username);
  if alvo is null then
    raise exception 'Nenhum perfil com o username %', alvo_username;
  end if;

  perform set_config('codequest.admin', 'on', true);

  update public.profiles set is_developer = valor where public.profiles.id = alvo;

  if valor then
    insert into public.user_tags (user_id, tag_id)
    values (alvo, 'dev')
    on conflict do nothing;
  end if;

  perform set_config('codequest.admin', 'off', true);

  return query
    select p.id, p.username, p.is_developer from public.profiles p where p.id = alvo;
end;
$$;

revoke all on function public.definir_desenvolvedor(text, boolean) from public;
revoke all on function public.definir_desenvolvedor(text, boolean) from authenticated;
