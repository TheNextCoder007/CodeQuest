-- ---------------------------------------------------------------------------
-- 0010 - Empates da ranqueada, leaderboard historico, abandono e boas-vindas
--
-- Rodar DEPOIS da 0009. Tudo aqui e `create or replace` / `add column if not
-- exists`, entao rodar duas vezes nao quebra nada.
--
-- O que esta migracao traz:
--
--   1. `profiles.boas_vindas_em` - marca quando a pessoa viu o painel pela
--      primeira vez, para a saudacao de conta nova (item 5).
--   2. `ranked_ranking_topo()` - leaderboard de TODAS as temporadas, ao lado
--      do que ja existia para a temporada corrente (item 4).
--   3. `conquistas_reavaliar()` - reconfere as conquistas de um jogador (ou de
--      todos) contra o historico real dele no banco, e concede o que faltou.
--      E o conserto retroativo de quem cumpriu o requisito antes de o criterio
--      existir - o caso dos empates de ranqueada (item 3).
--   4. `pvp_abandonar()` - encerra a partida como derrota de quem saiu,
--      aplicando o elo normalmente (item 6).
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Primeira visita ao painel
--
-- Nao da para descobrir "primeiro login" olhando `auth.users`: o
-- `last_sign_in_at` muda a cada renovacao de sessao, e comparar com o
-- `created_at` erra sempre que a pessoa cria a conta e so entra no dia
-- seguinte. Guardar o instante da primeira visita e explicito, sobrevive a
-- troca de aparelho (o que o `localStorage` nao faz) e responde exatamente a
-- pergunta que a tela precisa fazer.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists boas_vindas_em timestamptz;

-- Quem largou a partida no meio. Serve para a tela de resultado poder dizer
-- "encerrada por abandono" em vez de mostrar um placar que nao foi disputado.
alter table public.matches
  add column if not exists abandonada_por uuid references public.profiles (id) on delete set null;

comment on column public.profiles.boas_vindas_em is
  'Quando a pessoa viu o painel pela primeira vez. Nulo = ainda nao viu, e a '
  'saudacao e "Bem-vindo" em vez de "Bem-vindo de volta".';

/**
 * Carimba a primeira visita e diz se ESTA chamada foi a primeira.
 *
 * A resposta vem do banco e nao do cliente: quem chama nao consegue pedir
 * "me trate como novato de novo", porque a funcao so escreve quando a coluna
 * ainda esta nula.
 */
create or replace function public.marcar_boas_vindas()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  eu       uuid := auth.uid();
  primeira boolean;
begin
  if eu is null then
    raise exception 'Precisa estar autenticado';
  end if;

  select p.boas_vindas_em is null into primeira
    from public.profiles p where p.id = eu;

  if primeira is null then
    return false;
  end if;

  if primeira then
    update public.profiles set boas_vindas_em = now() where id = eu;
  end if;

  return primeira;
end;
$$;

grant execute on function public.marcar_boas_vindas() to authenticated;

/**
 * O carimbo nunca volta a ser nulo.
 *
 * A politica de RLS deixa a pessoa atualizar a propria linha de `profiles`, e
 * sem isto bastaria um update para virar "conta nova" de novo. O gatilho nao
 * levanta erro: ele simplesmente ignora a mudanca, para nao quebrar os updates
 * legitimos que mandam a linha inteira.
 */
create or replace function public.guard_boas_vindas()
returns trigger
language plpgsql
as $$
begin
  if old.boas_vindas_em is not null then
    new.boas_vindas_em := old.boas_vindas_em;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_boas_vindas_guard on public.profiles;
create trigger profiles_boas_vindas_guard
  before update on public.profiles
  for each row execute function public.guard_boas_vindas();

-- ---------------------------------------------------------------------------
-- 2. Leaderboard de todas as temporadas
--
-- O `ranked_ranking` existente ordena pelo elo da temporada corrente. Este
-- ordena pelo MAIOR pico de elo que a pessoa ja alcancou em qualquer
-- temporada - e o hall da fama, e nao zera a cada 15 dias.
--
-- Repare que a divisao mostrada sai do pico, nao do elo de agora: a linha diz
-- "chegou a Mestre 2", que e o feito que o quadro esta registrando.
-- ---------------------------------------------------------------------------

create or replace function public.ranked_ranking_topo(
  escopo text default 'global',
  limite int default 50
)
returns table (
  posicao          int,
  user_id          uuid,
  name             text,
  username         text,
  avatar_url       text,
  elo              int,
  divisao          int,
  vitorias         int,
  derrotas         int,
  partidas         int,
  temporadas       int,
  equipped_tag_id  text,
  is_developer     boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu uuid := auth.uid();
begin
  if eu is null then
    raise exception 'Precisa estar autenticado';
  end if;

  return query
    with somado as (
      select r.user_id                     as id,
             max(r.pico_elo)::int          as pico,
             sum(r.vitorias)::int          as v,
             sum(r.derrotas)::int          as d,
             sum(r.partidas)::int          as p,
             count(*)::int                 as temps
        from public.ranked_stats r
       where r.partidas > 0
       group by r.user_id
    )
    select (row_number() over (order by s.pico desc, s.v desc, pr.name asc))::int,
           pr.id,
           pr.name,
           pr.username,
           pr.avatar_url,
           s.pico,
           public.ranked_divisao(s.pico),
           s.v,
           s.d,
           s.p,
           s.temps,
           pr.equipped_tag_id,
           pr.is_developer
      from somado s
      join public.profiles pr on pr.id = s.id
     where escopo is distinct from 'amigos'
        or pr.id = eu
        or exists (
             select 1
               from public.friendships f
              where f.status = 'accepted'
                and ((f.user_id = eu and f.friend_id = pr.id)
                  or (f.user_id = pr.id and f.friend_id = eu))
           )
     order by s.pico desc, s.v desc, pr.name asc
     limit greatest(1, least(200, coalesce(limite, 50)));
end;
$$;

grant execute on function public.ranked_ranking_topo(text, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Reavaliacao retroativa das conquistas
--
-- O PROBLEMA QUE ISTO RESOLVE
--
-- As conquistas sao avaliadas no aplicativo, no momento em que o feito
-- acontece. Quem cumpriu o requisito ANTES de o criterio existir - ou enquanto
-- o criterio estava errado - nunca recebe a medalha, porque o momento ja
-- passou e ninguem confere de novo.
--
-- Foi o que houve com o empate da ranqueada: `pvp_finalizar` manda o resultado
-- da ranqueada para `ranked_stats` e NAO para `pvp_stats` (de proposito: se
-- vitoria contra bot entrasse no cartel 1v1, a tag "Imortal" viraria uma tarde
-- de farm). Como a conquista de empate lia so `pvp_stats.empates`, empate em
-- ranqueada nao contava.
--
-- Esta funcao confere cada conquista contra o historico REAL do jogador e
-- concede o que faltou. Como ela le o criterio do proprio banco
-- (`achievements.criteria`, o mesmo JSON de `src/content/achievements.ts`),
-- criterio novo passa a ser reavaliado sem precisar de outra migracao.
--
-- SEGURANCA: e `security definer`, mas nao aceita conceder conquista escolhida
-- a dedo - so recalcula. Sem argumento, mexe apenas em quem chamou. Passar
-- `alvo` (para varrer a base inteira) exige a flag `is_developer`.
-- ---------------------------------------------------------------------------

/** Empates do jogador nos DOIS modos - a conta que faltava. */
create or replace function public.conquistas_empates(jogador uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select s.empates from public.pvp_stats s where s.user_id = jogador), 0)
       + coalesce((select sum(r.empates)::int from public.ranked_stats r
                    where r.user_id = jogador), 0);
$$;

/** Maior patamar ja alcancado, em qualquer temporada (0 = Bronze). */
create or replace function public.conquistas_patamar_max(jogador uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select public.ranked_patamar(
           public.ranked_divisao(
             coalesce((select max(r.pico_elo)::int from public.ranked_stats r
                        where r.user_id = jogador), 0)));
$$;

/**
 * Um criterio bate com o historico do jogador?
 *
 * Espelha `avaliarCriterio` em `src/lib/gamification.ts`. Os dois precisam
 * concordar - `npm run test:conquistas` compara os dois lado a lado.
 *
 * `secret` fica sempre falso: conquista secreta acompanha a tag secreta, que
 * e concedida no momento exato do feito (entrar de madrugada, terminar uma
 * licao em menos de X). Nao ha historico no banco para reconstruir isso, e
 * inventar o desbloqueio seria dar de graca o que ninguem fez.
 */
create or replace function public.conquistas_criterio_bate(jogador uuid, criterio jsonb)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  tipo   text := criterio ->> 'kind';
  quanto int  := coalesce((criterio ->> 'count')::int, 0);
  feitas int;
begin
  case tipo

    when 'first_lesson' then
      return exists (select 1 from public.user_progress up where up.user_id = jogador);

    when 'lessons_completed' then
      select count(*)::int into feitas
        from public.user_progress up where up.user_id = jogador;
      return feitas >= quanto;

    when 'module_completed' then
      return not exists (
        select 1
          from public.lessons l
         where l.module_id = criterio ->> 'moduleId'
           and not exists (
             select 1 from public.user_progress up
              where up.user_id = jogador and up.lesson_id = l.id
           )
      ) and exists (
        select 1 from public.lessons l where l.module_id = criterio ->> 'moduleId'
      );

    when 'language_completed' then
      return not exists (
        select 1
          from public.lessons l
          join public.modules mo on mo.id = l.module_id
          join public.languages la on la.id = mo.language_id
         where la.slug = criterio ->> 'languageSlug'
           and not exists (
             select 1 from public.user_progress up
              where up.user_id = jogador and up.lesson_id = l.id
           )
      ) and exists (
        select 1
          from public.lessons l
          join public.modules mo on mo.id = l.module_id
          join public.languages la on la.id = mo.language_id
         where la.slug = criterio ->> 'languageSlug'
      );

    when 'xp' then
      return coalesce((select p.xp_total from public.profiles p where p.id = jogador), 0)
             >= coalesce((criterio ->> 'amount')::int, 0);

    when 'streak' then
      -- O banco guarda o streak CORRENTE, nao o maior de todos os tempos.
      -- Entao esta reavaliacao so confirma quem esta com a sequencia viva -
      -- ela nunca TIRA a medalha de quem ja tinha (a funcao so insere).
      return coalesce((select p.streak_count from public.profiles p where p.id = jogador), 0)
             >= coalesce((criterio ->> 'days')::int, 0);

    when 'flawless' then
      return exists (
        select 1 from public.user_progress up
         where up.user_id = jogador and up.flawless
      );

    when 'daily_challenges' then
      select count(*)::int into feitas
        from public.daily_challenge_completions dc where dc.user_id = jogador;
      return feitas >= quanto;

    when 'pvp_wins' then
      -- So o duelo entre amigos, como sempre foi: vitoria contra bot da
      -- ranqueada nao entra no cartel 1v1.
      return coalesce((select s.vitorias from public.pvp_stats s
                        where s.user_id = jogador), 0) >= quanto;

    when 'pvp_draws' then
      -- Aqui SIM os dois modos somam. Empate nao tem como ser farmado: exige
      -- placar identico ate o bonus de velocidade, em milesimos de segundo.
      return public.conquistas_empates(jogador) >= quanto;

    when 'ranked_tier' then
      return public.conquistas_patamar_max(jogador)
             >= coalesce((criterio ->> 'patamar')::int, 0);

    else
      -- 'secret' e qualquer criterio que o banco ainda nao conheca.
      return false;
  end case;
end;
$$;

/**
 * Reconfere as conquistas e concede o que faltou.
 *
 * Devolve uma linha por conquista concedida agora. Sem `alvo`, trabalha em
 * quem chamou.
 */
create or replace function public.conquistas_reavaliar(alvo uuid default null)
-- Os nomes de saida sao em portugues de proposito: `user_id` / `achievement_id`
-- colidiriam com as colunas de `user_achievements` dentro da propria consulta,
-- e o plpgsql recusa a ambiguidade.
returns table (jogador uuid, conquista text, titulo text)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu     uuid := auth.uid();
  sou_dev boolean;
begin
  if eu is null then
    raise exception 'Precisa estar autenticado';
  end if;

  select p.is_developer into sou_dev from public.profiles p where p.id = eu;

  -- Reavaliar a base inteira e operacao de manutencao, nao de jogador.
  if alvo is not null and alvo <> eu and not coalesce(sou_dev, false) then
    raise exception 'Sem permissao para reavaliar outro jogador';
  end if;

  return query
    with alvos as (
      select p.id as quem
        from public.profiles p
       where (alvo is not null and p.id = alvo)
          or (alvo is null and p.id = eu)
    ),
    faltando as (
      select t.quem as quem, a.id as medalha
        from alvos t
        cross join public.achievements a
       where not exists (
               select 1 from public.user_achievements ua
                where ua.user_id = t.quem and ua.achievement_id = a.id
             )
         and public.conquistas_criterio_bate(t.quem, a.criteria)
    ),
    concedidas as (
      insert into public.user_achievements (user_id, achievement_id, unlocked_at)
      select f.quem, f.medalha, now() from faltando f
      on conflict (user_id, achievement_id) do nothing
      returning public.user_achievements.user_id    as quem,
                public.user_achievements.achievement_id as medalha
    )
    select c.quem, c.medalha, a.title
      from concedidas c
      join public.achievements a on a.id = c.medalha;
end;
$$;

grant execute on function public.conquistas_reavaliar(uuid) to authenticated;
revoke all on function public.conquistas_criterio_bate(uuid, jsonb) from public;
revoke all on function public.conquistas_criterio_bate(uuid, jsonb) from authenticated;

/**
 * Varre TODOS os jogadores. So o dono roda isto (e pelo SQL Editor).
 *
 * Existe separada de `conquistas_reavaliar` porque varrer a base e caro e nao
 * deve ficar a um argumento de distancia de qualquer chamada do aplicativo.
 */
create or replace function public.conquistas_reavaliar_todos()
returns table (jogador uuid, conquista text, titulo text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    with faltando as (
      select p.id as quem, a.id as medalha
        from public.profiles p
        cross join public.achievements a
       where not exists (
               select 1 from public.user_achievements ua
                where ua.user_id = p.id and ua.achievement_id = a.id
             )
         and public.conquistas_criterio_bate(p.id, a.criteria)
    ),
    concedidas as (
      insert into public.user_achievements (user_id, achievement_id, unlocked_at)
      select f.quem, f.medalha, now() from faltando f
      on conflict (user_id, achievement_id) do nothing
      returning public.user_achievements.user_id    as quem,
                public.user_achievements.achievement_id as medalha
    )
    select c.quem, c.medalha, a.title
      from concedidas c
      join public.achievements a on a.id = c.medalha;
end;
$$;

revoke all on function public.conquistas_reavaliar_todos() from public;
revoke all on function public.conquistas_reavaliar_todos() from authenticated;

-- ---------------------------------------------------------------------------
-- 4. Abandono
--
-- Trocar de aba no meio da partida nao da para impedir - nenhum site impede.
-- O que da para fazer e cobrar o preco: quem sai por tempo demais, repetidas
-- vezes, perde a partida.
--
-- POR QUE E SEGURO O CLIENTE CHAMAR ISTO
--
-- A funcao so serve para a pessoa se penalizar. Nao ha parametro dizendo quem
-- perdeu: quem perde e sempre `auth.uid()`. Chamar isto para prejudicar
-- outra pessoa e impossivel, e chamar para si mesmo e... perder.
--
-- O elo sai pelo caminho de sempre (`ranked_registrar` -> `ranked_aplicar_
-- resultado`), entao a derrota por abandono custa exatamente o mesmo que a
-- derrota jogada, inclusive o piso do patamar.
-- ---------------------------------------------------------------------------

create or replace function public.pvp_abandonar(m uuid)
returns table (status text, winner_id uuid, pontos_host int, pontos_guest int)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu        uuid := auth.uid();
  partida   public.matches;
  ph        int;
  pgs       int;
  vencedor  uuid;
  desf      text;
  sou_host  boolean;
begin
  partida := public.pvp_partida_do_usuario(m);

  if partida.status = 'encerrada' then
    return query select partida.status, partida.winner_id,
                        partida.pontos_host, partida.pontos_guest;
    return;
  end if;

  if partida.status <> 'ativa' then
    raise exception 'A partida nao esta em andamento';
  end if;

  sou_host := partida.host_id = eu;

  -- Pontuacao real de quem ficou; quem saiu leva o que ja tinha somado.
  select coalesce(sum(a.pontos), 0)::int into ph
    from public.match_answers a
   where a.match_id = m and a.user_id = partida.host_id;

  if partida.guest_id is null then
    -- Contra bot: ele termina as perguntas dele, para o placar do outro lado
    -- nao ficar zerado numa partida que a pessoa abandonou perdendo.
    perform public.ranked_bot_completar(m, partida.total_perguntas);
    select coalesce(sum(b.pontos), 0)::int into pgs
      from public.match_bot_answers b where b.match_id = m;
  else
    select coalesce(sum(a.pontos), 0)::int into pgs
      from public.match_answers a
     where a.match_id = m and a.user_id = partida.guest_id;
  end if;

  -- O placar nao decide nada aqui: quem saiu perdeu, mesmo que estivesse na
  -- frente. E justamente o caso que a regra precisa cobrir.
  if sou_host then
    desf     := 'derrota';
    vencedor := partida.guest_id;
  else
    desf     := 'vitoria';
    vencedor := partida.host_id;
  end if;

  update public.matches
     set status        = 'encerrada',
         winner_id     = vencedor,
         desfecho_host = desf,
         pontos_host   = ph,
         pontos_guest  = pgs,
         abandonada_por = eu,
         ended_at      = now()
   where id = m;

  if partida.modo = 'ranqueado' then
    perform public.ranked_registrar(m, partida.host_id, desf, partida.season_numero);
    if partida.guest_id is not null then
      perform public.ranked_registrar(
        m, partida.guest_id, public.ranked_inverso(desf), partida.season_numero
      );
    end if;
  else
    perform public.pvp_registrar_stats(partida.host_id,  vencedor, ph,  partida.tema);
    if partida.guest_id is not null then
      perform public.pvp_registrar_stats(partida.guest_id, vencedor, pgs, partida.tema);
    end if;
  end if;

  return query select 'encerrada'::text, vencedor, ph, pgs;
end;
$$;

grant execute on function public.pvp_abandonar(uuid) to authenticated;
