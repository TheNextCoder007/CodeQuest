-- ===========================================================================
-- CodeQuest - modo 1v1 (PvP)
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de 0001 a 0004.
--
-- Depois, rode `supabase/seed.sql` de novo: ele passou a popular tambem o
-- banco de perguntas do duelo.
--
-- ---------------------------------------------------------------------------
-- COMO A SEGURANCA FUNCIONA AQUI
--
-- O aplicativo e 100% client-side: nao existe servidor nosso entre o navegador
-- e o banco. Entao "validar no servidor" quer dizer **validar dentro do
-- PostgreSQL**, e e isso que este arquivo faz:
--
--   * `pvp_questions` nao tem policy de SELECT nenhuma. Com RLS ligado, isso
--     significa que NENHUM cliente le a tabela - nem o gabarito, nem nada.
--   * As tabelas da partida tambem nao tem policy de INSERT/UPDATE. A unica
--     forma de escrever nelas e pelas funcoes abaixo, que sao
--     `security definer` e conferem quem esta chamando.
--   * O tempo de resposta e medido pelo banco (`now()` na entrega da pergunta
--     contra `now()` na resposta). Tempo enviado pelo cliente seria trivial de
--     falsificar, entao ele simplesmente nao existe na API.
--   * A pontuacao e o vencedor sao calculados por `pvp_finalizar`. O cliente
--     nao envia placar - ele so pergunta qual foi o resultado.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Banco de perguntas (privado)
-- ---------------------------------------------------------------------------

create table if not exists public.pvp_questions (
  id             text primary key,
  language_slug  text not null,
  kind           text not null check (kind in ('multiple_choice', 'fill_blank')),
  prompt         text not null,
  options        jsonb,
  answer         text not null,
  explanation    text not null default '',
  difficulty     int not null default 1 check (difficulty between 1 and 3)
);

create index if not exists pvp_questions_tema_idx on public.pvp_questions (language_slug);

alter table public.pvp_questions enable row level security;
-- Sem policy de propósito: ninguem le esta tabela direto. O gabarito so sai
-- daqui pelas funcoes, e ja corrigido.

-- ---------------------------------------------------------------------------
-- 2. Partidas
-- ---------------------------------------------------------------------------

create table if not exists public.matches (
  id               uuid primary key default gen_random_uuid(),
  tema             text not null default 'todas',
  status           text not null default 'convite'
                   check (status in ('convite', 'ativa', 'encerrada', 'recusada', 'cancelada')),
  host_id          uuid not null references public.profiles (id) on delete cascade,
  guest_id         uuid not null references public.profiles (id) on delete cascade,
  total_perguntas  int not null default 5 check (total_perguntas between 1 and 20),
  -- Preenchidos SO por `pvp_finalizar`.
  winner_id        uuid references public.profiles (id) on delete set null,
  pontos_host      int not null default 0,
  pontos_guest     int not null default 0,
  created_at       timestamptz not null default now(),
  started_at       timestamptz,
  ended_at         timestamptz,

  constraint matches_sem_auto_duelo check (host_id <> guest_id)
);

create index if not exists matches_host_idx  on public.matches (host_id, status);
create index if not exists matches_guest_idx on public.matches (guest_id, status);

-- As perguntas sorteadas, na ordem.
create table if not exists public.match_questions (
  match_id     uuid not null references public.matches (id) on delete cascade,
  ordem        int  not null check (ordem >= 1),
  question_id  text not null references public.pvp_questions (id) on delete restrict,
  primary key (match_id, ordem)
);

-- Uma linha por jogador por pergunta. Nasce quando a pergunta e entregue
-- (`started_at`) e fecha quando a resposta chega (`answered_at`).
create table if not exists public.match_answers (
  match_id     uuid not null references public.matches (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  ordem        int  not null,
  resposta     text,
  correta      boolean,
  pontos       int not null default 0,
  ms           int,
  started_at   timestamptz not null default now(),
  answered_at  timestamptz,
  primary key (match_id, user_id, ordem)
);

create index if not exists match_answers_match_idx on public.match_answers (match_id);

-- Estatisticas acumuladas. Escritas SO por `pvp_finalizar`.
create table if not exists public.pvp_stats (
  user_id            uuid primary key references public.profiles (id) on delete cascade,
  vitorias           int not null default 0,
  derrotas           int not null default 0,
  empates            int not null default 0,
  partidas           int not null default 0,
  pontos_totais      int not null default 0,
  vitorias_por_tema  jsonb not null default '{}'::jsonb,
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
--
-- Leitura: so quem esta na partida. Escrita: ninguem direto - so pelas
-- funcoes `security definer` da secao 5.
-- ---------------------------------------------------------------------------

alter table public.matches         enable row level security;
alter table public.match_questions enable row level security;
alter table public.match_answers   enable row level security;
alter table public.pvp_stats       enable row level security;

drop policy if exists "ve as proprias partidas" on public.matches;
create policy "ve as proprias partidas"
  on public.matches for select
  to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id);

drop policy if exists "ve as respostas da propria partida" on public.match_answers;
create policy "ve as respostas da propria partida"
  on public.match_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.matches m
       where m.id = match_answers.match_id
         and (auth.uid() = m.host_id or auth.uid() = m.guest_id)
    )
  );

-- `match_questions` nao tem policy de leitura: o id da pergunta so interessa
-- ao servidor. O cliente recebe o enunciado ja preparado pela funcao.

-- Estatisticas de PvP sao publicas (aparecem no perfil de qualquer um).
drop policy if exists "estatisticas de pvp sao publicas" on public.pvp_stats;
create policy "estatisticas de pvp sao publicas"
  on public.pvp_stats for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 4. Regras de pontuacao
--
-- ESPELHO de `src/lib/pvp/regras.ts`. O teste `npm run test:pvp` roda as duas
-- versoes lado a lado e falha se elas discordarem em qualquer entrada.
-- ---------------------------------------------------------------------------

create or replace function public.pvp_normalizar(valor text)
returns text
language sql
immutable
as $$
  select regexp_replace(
           regexp_replace(lower(btrim(coalesce(valor, ''))), '\s+', ' ', 'g'),
           ';+$', ''
         );
$$;

create or replace function public.pvp_pontuar(correta boolean, ms int)
returns int
language plpgsql
immutable
as $$
declare
  limite   int := 20000;  -- TEMPO_LIMITE_MS
  gasto    int;
  bonus    int;
begin
  if correta is not true then
    return 0;
  end if;

  gasto := greatest(0, least(coalesce(ms, limite), limite));
  if gasto >= limite then
    return 0;
  end if;

  bonus := greatest(0, 100 - (gasto / 200));
  return 100 + bonus;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. API da partida
-- ---------------------------------------------------------------------------

/** Confere que quem chamou participa da partida e devolve a linha. */
create or replace function public.pvp_partida_do_usuario(m uuid)
returns public.matches
language plpgsql
security definer
set search_path = public
as $$
declare
  partida public.matches;
begin
  select * into partida from public.matches where id = m;
  if partida.id is null then
    raise exception 'Partida nao encontrada';
  end if;
  if auth.uid() is distinct from partida.host_id
     and auth.uid() is distinct from partida.guest_id then
    raise exception 'Voce nao participa dessa partida';
  end if;
  return partida;
end;
$$;

/**
 * Cria o convite e ja sorteia as perguntas.
 *
 * O sorteio acontece aqui, no servidor: se ficasse no cliente, daria para
 * escolher as perguntas mais faceis.
 */
create or replace function public.pvp_convidar(alvo_username text, tema_escolhido text default 'todas')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  eu           uuid := auth.uid();
  alvo         uuid;
  nova         uuid;
  quantidade   int := 5;
  disponiveis  int;
begin
  if eu is null then
    raise exception 'Precisa estar autenticado';
  end if;

  select id into alvo from public.profiles where lower(username) = lower(alvo_username);
  if alvo is null then
    raise exception 'Nao achei ninguem com o nome de usuario %', alvo_username;
  end if;
  if alvo = eu then
    raise exception 'Nao da para duelar consigo mesmo';
  end if;

  -- So amigos confirmados podem ser convidados.
  if not exists (
    select 1 from public.friendships f
     where f.status = 'accepted'
       and ((f.user_id = eu and f.friend_id = alvo) or (f.user_id = alvo and f.friend_id = eu))
  ) then
    raise exception 'Voce so pode duelar com amigos confirmados';
  end if;

  -- Um convite pendente por dupla, para nao encher a tela do outro.
  if exists (
    select 1 from public.matches
     where status in ('convite', 'ativa')
       and ((host_id = eu and guest_id = alvo) or (host_id = alvo and guest_id = eu))
  ) then
    raise exception 'Ja existe um convite ou partida em andamento com essa pessoa';
  end if;

  select count(*) into disponiveis
    from public.pvp_questions
   where tema_escolhido = 'todas' or language_slug = tema_escolhido;

  if disponiveis < quantidade then
    raise exception 'Nao ha perguntas suficientes para o tema %', tema_escolhido;
  end if;

  insert into public.matches (tema, status, host_id, guest_id, total_perguntas)
  values (tema_escolhido, 'convite', eu, alvo, quantidade)
  returning id into nova;

  insert into public.match_questions (match_id, ordem, question_id)
  select nova, row_number() over (), q.id
    from (
      select id from public.pvp_questions
       where tema_escolhido = 'todas' or language_slug = tema_escolhido
       order by random()
       limit quantidade
    ) q;

  return nova;
end;
$$;

/** O convidado aceita ou recusa. */
create or replace function public.pvp_responder_convite(m uuid, aceitar boolean)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  partida public.matches;
begin
  partida := public.pvp_partida_do_usuario(m);

  if partida.guest_id is distinct from auth.uid() then
    raise exception 'So quem foi convidado pode responder ao convite';
  end if;
  if partida.status <> 'convite' then
    raise exception 'Esse convite ja foi respondido';
  end if;

  if aceitar then
    update public.matches
       set status = 'ativa', started_at = now()
     where id = m;
    return 'ativa';
  end if;

  update public.matches set status = 'recusada', ended_at = now() where id = m;
  return 'recusada';
end;
$$;

/** O anfitriao desiste antes de o convite ser respondido. */
create or replace function public.pvp_cancelar(m uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  partida public.matches;
begin
  partida := public.pvp_partida_do_usuario(m);
  if partida.status not in ('convite', 'ativa') then
    return partida.status;
  end if;

  update public.matches set status = 'cancelada', ended_at = now() where id = m;
  return 'cancelada';
end;
$$;

/**
 * Entrega a pergunta `n` e comeca a contar o tempo DESSE jogador.
 *
 * Repare no que NAO volta daqui: `answer`. O gabarito nunca sai do banco
 * antes da resposta chegar.
 */
-- Os nomes de saida (`num`, `tipo`, ...) evitam de proposito colidir com as
-- colunas das tabelas usadas dentro da funcao: em plpgsql, um parametro de
-- saida chamado `ordem` deixa `on conflict (..., ordem)` ambiguo.
create or replace function public.pvp_pergunta(m uuid, n int)
returns table (num int, tipo text, enunciado text, alternativas jsonb, total int)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida  public.matches;
  eu       uuid := auth.uid();
  qid      text;
  anterior int;
begin
  partida := public.pvp_partida_do_usuario(m);

  if partida.status <> 'ativa' then
    raise exception 'A partida nao esta em andamento';
  end if;
  if n < 1 or n > partida.total_perguntas then
    raise exception 'Pergunta fora do intervalo';
  end if;

  -- Nao da para pular: a pergunta n so sai depois de a n-1 ter sido respondida.
  if n > 1 then
    select count(*) into anterior
      from public.match_answers
     where match_id = m and user_id = eu and ordem = n - 1 and answered_at is not null;
    if anterior = 0 then
      raise exception 'Responda a pergunta anterior primeiro';
    end if;
  end if;

  select question_id into qid
    from public.match_questions where match_id = m and match_questions.ordem = n;
  if qid is null then
    raise exception 'Pergunta nao encontrada';
  end if;

  -- Primeira entrega carimba o inicio; reentregas (recarregou a pagina) NAO
  -- reiniciam o cronometro.
  insert into public.match_answers (match_id, user_id, ordem, started_at)
  values (m, eu, n, now())
  on conflict (match_id, user_id, ordem) do nothing;

  return query
    select n,
           q.kind,
           q.prompt,
           q.options,
           partida.total_perguntas
      from public.pvp_questions q
     where q.id = qid;
end;
$$;

/**
 * Corrige e pontua a resposta.
 *
 * O tempo vem da diferenca entre `started_at` (gravado quando a pergunta foi
 * entregue) e `now()`. O cliente nao tem como opinar sobre isso.
 */
create or replace function public.pvp_responder(m uuid, n int, resposta_dada text)
returns table (correta boolean, pontos int, ms int, gabarito text, explicacao text)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida  public.matches;
  eu       uuid := auth.uid();
  linha    public.match_answers;
  questao  public.pvp_questions;
  qid      text;
  gasto    int;
  acertou  boolean;
  ganhou   int;
begin
  partida := public.pvp_partida_do_usuario(m);
  if partida.status <> 'ativa' then
    raise exception 'A partida nao esta em andamento';
  end if;

  select * into linha
    from public.match_answers
   where match_id = m and user_id = eu and match_answers.ordem = n;

  if linha.match_id is null then
    raise exception 'Peca a pergunta antes de responder';
  end if;
  if linha.answered_at is not null then
    raise exception 'Essa pergunta ja foi respondida';
  end if;

  select question_id into qid
    from public.match_questions where match_id = m and match_questions.ordem = n;
  select * into questao from public.pvp_questions where id = qid;

  gasto   := greatest(0, floor(extract(epoch from (now() - linha.started_at)) * 1000))::int;
  acertou := public.pvp_normalizar(resposta_dada) = public.pvp_normalizar(questao.answer);
  ganhou  := public.pvp_pontuar(acertou, gasto);

  update public.match_answers
     set resposta = resposta_dada,
         correta = acertou,
         pontos = ganhou,
         ms = gasto,
         answered_at = now()
   where match_id = m and user_id = eu and match_answers.ordem = n;

  return query select acertou, ganhou, gasto, questao.answer, questao.explanation;
end;
$$;

/**
 * Placar ao vivo dos dois lados.
 *
 * Serve para a tela mostrar "o adversario esta na pergunta 3" sem revelar
 * o que ele respondeu.
 */
create or replace function public.pvp_estado(m uuid)
returns table (
  status text, total int, tema text,
  host_id uuid, guest_id uuid, winner_id uuid,
  host_respondidas int, guest_respondidas int,
  host_pontos int, guest_pontos int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida public.matches;
begin
  partida := public.pvp_partida_do_usuario(m);

  return query
    select partida.status,
           partida.total_perguntas,
           partida.tema,
           partida.host_id,
           partida.guest_id,
           partida.winner_id,
           (select count(*)::int from public.match_answers
             where match_id = m and user_id = partida.host_id and answered_at is not null),
           (select count(*)::int from public.match_answers
             where match_id = m and user_id = partida.guest_id and answered_at is not null),
           -- Enquanto a partida corre, cada um so ve o proprio placar; no fim,
           -- os dois aparecem.
           case when partida.status = 'encerrada' or auth.uid() = partida.host_id
                then (select coalesce(sum(pontos), 0)::int from public.match_answers
                       where match_id = m and user_id = partida.host_id)
                else 0 end,
           case when partida.status = 'encerrada' or auth.uid() = partida.guest_id
                then (select coalesce(sum(pontos), 0)::int from public.match_answers
                       where match_id = m and user_id = partida.guest_id)
                else 0 end;
end;
$$;

/**
 * Fecha a partida, define o vencedor e atualiza as estatisticas.
 *
 * Pode ser chamada pelos dois lados, quantas vezes for: so faz efeito uma vez.
 * Se um dos jogadores sumir, a partida fecha sozinha depois de 5 minutos e as
 * perguntas nao respondidas valem zero.
 */
create or replace function public.pvp_finalizar(m uuid)
returns table (status text, winner_id uuid, pontos_host int, pontos_guest int)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida     public.matches;
  ph          int;
  pg          int;
  respondeu_h int;
  respondeu_g int;
  vencedor    uuid;
  expirou     boolean;
begin
  partida := public.pvp_partida_do_usuario(m);

  if partida.status = 'encerrada' then
    return query select partida.status, partida.winner_id, partida.pontos_host, partida.pontos_guest;
    return;
  end if;

  if partida.status <> 'ativa' then
    raise exception 'A partida nao esta em andamento';
  end if;

  select count(*)::int into respondeu_h
    from public.match_answers
   where match_id = m and user_id = partida.host_id and answered_at is not null;
  select count(*)::int into respondeu_g
    from public.match_answers
   where match_id = m and user_id = partida.guest_id and answered_at is not null;

  expirou := partida.started_at < now() - interval '5 minutes';

  if not expirou
     and (respondeu_h < partida.total_perguntas or respondeu_g < partida.total_perguntas) then
    -- Ainda tem gente jogando.
    return query select partida.status, null::uuid, 0, 0;
    return;
  end if;

  select coalesce(sum(pontos), 0)::int into ph
    from public.match_answers where match_id = m and user_id = partida.host_id;
  select coalesce(sum(pontos), 0)::int into pg
    from public.match_answers where match_id = m and user_id = partida.guest_id;

  if ph > pg then
    vencedor := partida.host_id;
  elsif pg > ph then
    vencedor := partida.guest_id;
  else
    vencedor := null;  -- empate
  end if;

  update public.matches
     set status = 'encerrada',
         winner_id = vencedor,
         pontos_host = ph,
         pontos_guest = pg,
         ended_at = now()
   where id = m;

  perform public.pvp_registrar_stats(partida.host_id,  vencedor, ph, partida.tema);
  perform public.pvp_registrar_stats(partida.guest_id, vencedor, pg, partida.tema);

  return query select 'encerrada'::text, vencedor, ph, pg;
end;
$$;

/** Soma o resultado de uma partida nas estatisticas de um jogador. */
create or replace function public.pvp_registrar_stats(
  jogador uuid, vencedor uuid, pontos int, tema text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  venceu  boolean := vencedor is not null and vencedor = jogador;
  empatou boolean := vencedor is null;
begin
  insert into public.pvp_stats (user_id, vitorias, derrotas, empates, partidas, pontos_totais, vitorias_por_tema)
  values (
    jogador,
    case when venceu then 1 else 0 end,
    case when not venceu and not empatou then 1 else 0 end,
    case when empatou then 1 else 0 end,
    1,
    pontos,
    case when venceu then jsonb_build_object(tema, 1) else '{}'::jsonb end
  )
  on conflict (user_id) do update set
    vitorias      = public.pvp_stats.vitorias      + excluded.vitorias,
    derrotas      = public.pvp_stats.derrotas      + excluded.derrotas,
    empates       = public.pvp_stats.empates       + excluded.empates,
    partidas      = public.pvp_stats.partidas      + excluded.partidas,
    pontos_totais = public.pvp_stats.pontos_totais + excluded.pontos_totais,
    vitorias_por_tema = case
      when venceu then
        jsonb_set(
          public.pvp_stats.vitorias_por_tema,
          array[tema],
          to_jsonb(coalesce((public.pvp_stats.vitorias_por_tema ->> tema)::int, 0) + 1),
          true
        )
      else public.pvp_stats.vitorias_por_tema
    end,
    updated_at = now();
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Permissoes
--
-- As funcoes sao a unica porta de entrada. `pvp_registrar_stats` fica de fora
-- de proposito: ela e chamada por `pvp_finalizar`, nunca pelo cliente.
-- ---------------------------------------------------------------------------

revoke all on function public.pvp_registrar_stats(uuid, uuid, int, text) from public;
revoke all on function public.pvp_registrar_stats(uuid, uuid, int, text) from authenticated;
revoke all on function public.pvp_partida_do_usuario(uuid) from public;
revoke all on function public.pvp_partida_do_usuario(uuid) from authenticated;

grant execute on function public.pvp_convidar(text, text)            to authenticated;
grant execute on function public.pvp_responder_convite(uuid, boolean) to authenticated;
grant execute on function public.pvp_cancelar(uuid)                   to authenticated;
grant execute on function public.pvp_pergunta(uuid, int)              to authenticated;
grant execute on function public.pvp_responder(uuid, int, text)       to authenticated;
grant execute on function public.pvp_estado(uuid)                     to authenticated;
grant execute on function public.pvp_finalizar(uuid)                  to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Realtime
--
-- O aplicativo escuta `matches` para saber de convite novo e de mudanca de
-- status, e `match_answers` para acompanhar o avanco do adversario. O RLS
-- continua valendo: cada um so recebe evento das proprias partidas.
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches'
    ) then
      alter publication supabase_realtime add table public.matches;
    end if;

    if not exists (
      select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'match_answers'
    ) then
      alter publication supabase_realtime add table public.match_answers;
    end if;
  else
    raise notice 'publicacao supabase_realtime ausente - parte de tempo real ignorada';
  end if;
end
$$;
