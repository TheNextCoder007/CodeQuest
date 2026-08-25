-- ===========================================================================
-- CodeQuest - desafios diarios
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de 0001 (exercicios e perfis), 0002 (amizades) e do seed.sql.
--
-- ---------------------------------------------------------------------------
-- O QUE E
--
-- Um exercicio de codigo por dia, o MESMO para todo mundo, que expira a meia
-- noite. Completar paga XP uma unica vez.
--
-- ---------------------------------------------------------------------------
-- DE ONDE VEM O EXERCICIO
--
-- Nao ha banco separado: o desafio sai dos exercicios que ja existem na
-- trilha (`desafio_pool`). Isso evita escrever e manter um segundo curriculo,
-- e todo exercicio novo entra no rodizio sozinho.
--
-- O sorteio e DETERMINISTICO a partir da data:
--
--     posicao = (dias desde 1970-01-01) * 7919 mod (tamanho do pool)
--
-- 7919 e primo e maior que qualquer tamanho realista do pool, entao
-- gcd(7919, total) = 1: a sequencia percorre TODOS os exercicios antes de
-- repetir qualquer um. Nao ha aleatoriedade, o que traz duas propriedades:
--
--   1. dois usuarios que abrem o app ao mesmo tempo, com a linha do dia ainda
--      nao criada, calculam o MESMO exercicio - entao a corrida entre eles nao
--      tem como dar desafios diferentes;
--   2. da para saber qual foi o desafio de qualquer dia passado sem consultar
--      o banco, o que facilita conferir um bug.
--
-- ---------------------------------------------------------------------------
-- COMO O DESAFIO TROCA DE DIA (sem cron)
--
-- Mesmo padrao preguicoso da virada de temporada da ranqueada
-- (`ranked_temporada_atual`): nada roda no relogio. A linha do dia e criada na
-- primeira vez que alguem pergunta pelo desafio naquele dia, dentro de
-- `desafio_do_dia()`. Se ninguem abrir o app durante uma semana, simplesmente
-- nao existem linhas daqueles dias - e nao faz falta, porque um desafio que
-- ninguem jogou nao precisa existir.
--
-- E por que nao precisa de `while` como a temporada: a temporada e uma
-- sequencia encadeada (a proxima comeca onde a anterior terminou), entao pular
-- meses exige criar as do meio. Aqui cada dia e independente e a data ja diz
-- qual e o exercicio.
--
-- ---------------------------------------------------------------------------
-- QUE HORAS VIRA O DIA
--
-- Meia-noite em **America/Sao_Paulo**, e nao no fuso do aparelho. Se cada um
-- virasse no proprio fuso, "o desafio de hoje" seria coisas diferentes ao
-- mesmo tempo e comparar com amigos perderia o sentido. A data nunca vem do
-- cliente: quem decide e `desafio_hoje()`, no banco.
--
-- ---------------------------------------------------------------------------
-- O QUE O CLIENTE NAO CONSEGUE FAZER
--
--   - marcar conclusao para outra pessoa: `desafio_concluir()` nao recebe
--     usuario, usa `auth.uid()`;
--   - marcar conclusao para outro dia: tambem nao recebe data, usa
--     `desafio_hoje()`;
--   - fazer o desafio de ontem hoje: a chave e (dia, user_id) e o dia e sempre
--     o de hoje - nao ha por onde inserir uma data velha;
--   - ganhar XP duas vezes: o `on conflict do nothing` e o `row_count` que
--     decide se paga;
--   - escrever na tabela direto: RLS ligada e SEM policy de INSERT/UPDATE/
--     DELETE, entao so as funcoes SECURITY DEFINER escrevem.
--
-- O que o cliente ainda decide e se a resposta do exercicio esta certa - isso
-- e inerente ao projeto, onde o codigo do aluno roda no aparelho dele
-- (Pyodide / worker de JavaScript). O `guard_profile_update` da 0003 continua
-- sendo o teto de quanto XP pode entrar de uma vez.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Que dia e hoje
-- ---------------------------------------------------------------------------

create or replace function public.desafio_hoje()
returns date
language sql
stable
set search_path = public
as $$
  select (now() at time zone 'America/Sao_Paulo')::date;
$$;

/** Quando o desafio de hoje expira, para o cronometro da tela. */
create or replace function public.desafio_expira_em()
returns timestamptz
language sql
stable
set search_path = public
as $$
  select ((public.desafio_hoje() + 1)::timestamp at time zone 'America/Sao_Paulo');
$$;

-- ---------------------------------------------------------------------------
-- 2. Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.daily_challenges (
  dia          date primary key,
  exercise_id  text not null references public.exercises (id) on delete cascade,
  -- Guardado por linha, e nao lido de uma constante: se um dia o valor mudar,
  -- os desafios ja jogados continuam valendo o que valiam.
  xp           int  not null default 120 check (xp > 0),
  criado_em    timestamptz not null default now()
);

create table if not exists public.daily_challenge_completions (
  dia           date not null references public.daily_challenges (dia) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  concluido_em  timestamptz not null default now(),
  xp_ganho      int not null default 0 check (xp_ganho >= 0),

  -- A chave e o que impede jogar duas vezes o mesmo dia.
  primary key (dia, user_id)
);

create index if not exists daily_completions_user_idx
  on public.daily_challenge_completions (user_id);

-- ---------------------------------------------------------------------------
-- 3. De onde sai o exercicio do dia
--
-- So exercicios de CODIGO (`output_match`) - o desafio diario e para escrever
-- programa, nao para marcar alternativa.
--
-- O Projeto Final fica de fora de proposito: os exercicios dele sao "Etapa 1",
-- "Etapa 2", "Etapa 3" de um projeto unico e nao se sustentam soltos, fora da
-- licao. Todos os demais sao autocontidos.
-- ---------------------------------------------------------------------------

create or replace function public.desafio_pool()
returns table (exercise_id text)
language sql
stable
set search_path = public
as $$
  select e.id
    from public.exercises e
    join public.lessons l on l.id = e.lesson_id
    join public.modules m on m.id = l.module_id
   where e.validation_type = 'output_match'
     and m.id not like '%projeto-final'
   -- `collate "C"` e proposital: ordem de bytes, igual em qualquer instalacao
   -- do Postgres e igual ao `.sort()` do JavaScript, que e o que o modo
   -- demonstracao usa. Sem isso, a collation do banco poderia mudar a ordem e
   -- com ela o desafio do dia.
   order by e.id collate "C";
$$;

create or replace function public.desafio_sortear(alvo date)
returns text
language plpgsql
stable
set search_path = public
as $$
declare
  total     int;
  posicao   int;
  escolhido text;
begin
  select count(*) into total from public.desafio_pool();
  if total = 0 then
    return null;
  end if;

  posicao := ((alvo - date '1970-01-01') * 7919) % total;

  -- `row_number` explicito em vez de `offset`: a ordenacao de dentro de uma
  -- funcao que devolve conjunto nao e garantida por fora dela.
  select ordenado.exercise_id into escolhido
    from (
      select p.exercise_id,
             row_number() over (order by p.exercise_id collate "C") as n
        from public.desafio_pool() p
    ) ordenado
   where ordenado.n = posicao + 1;

  return escolhido;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. O desafio de hoje (criado na primeira pergunta do dia)
-- ---------------------------------------------------------------------------

create or replace function public.desafio_do_dia()
returns public.daily_challenges
language plpgsql
security definer
set search_path = public
as $$
declare
  hoje      date := public.desafio_hoje();
  atual     public.daily_challenges;
  escolhido text;
begin
  select d.* into atual from public.daily_challenges d where d.dia = hoje;
  if atual.dia is not null then
    return atual;
  end if;

  escolhido := public.desafio_sortear(hoje);
  if escolhido is null then
    raise exception 'Nao ha exercicios elegiveis para o desafio diario (rode o seed.sql)';
  end if;

  -- `on conflict do nothing` cobre a corrida: se duas pessoas abrirem o app no
  -- mesmo instante, as duas calculam o mesmo exercicio e a segunda so nao
  -- insere.
  insert into public.daily_challenges (dia, exercise_id)
  values (hoje, escolhido)
  on conflict (dia) do nothing;

  select d.* into atual from public.daily_challenges d where d.dia = hoje;
  return atual;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Estado para a tela
-- ---------------------------------------------------------------------------

create or replace function public.desafio_estado()
returns table (
  dia          date,
  exercise_id  text,
  xp           int,
  ja_completou boolean,
  total        int,
  expira_em    timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu      uuid := auth.uid();
  desafio public.daily_challenges;
begin
  desafio := public.desafio_do_dia();

  return query
    select desafio.dia,
           desafio.exercise_id,
           desafio.xp,
           exists (
             select 1
               from public.daily_challenge_completions c
              where c.dia = desafio.dia and c.user_id = eu
           ),
           (select count(*)::int
              from public.daily_challenge_completions c
             where c.user_id = eu),
           public.desafio_expira_em();
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Concluir o desafio de hoje
--
-- Sem parametros de proposito: nem usuario, nem data, nem XP. Tudo vem do
-- servidor.
-- ---------------------------------------------------------------------------

create or replace function public.desafio_concluir()
returns table (
  xp_ganho   int,
  ja_tinha   boolean,
  total      int,
  novo_xp    int,
  novo_nivel int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu       uuid := auth.uid();
  desafio  public.daily_challenges;
  inseriu  int;
  quantos  int;
  xp_final int;
  nivel    int;
begin
  if eu is null then
    raise exception 'Entre na sua conta para jogar o desafio diario';
  end if;

  desafio := public.desafio_do_dia();

  insert into public.daily_challenge_completions (dia, user_id, xp_ganho)
  values (desafio.dia, eu, desafio.xp)
  on conflict (dia, user_id) do nothing;

  get diagnostics inseriu = row_count;

  select count(*)::int into quantos
    from public.daily_challenge_completions c
   where c.user_id = eu;

  if inseriu = 0 then
    -- Ja tinha feito hoje: devolve o estado, sem pagar de novo.
    select p.xp_total, p.level into xp_final, nivel
      from public.profiles p where p.id = eu;
    return query select 0, true, quantos, coalesce(xp_final, 0), coalesce(nivel, 1);
    return;
  end if;

  -- Nivel = xp / 100 + 1, a mesma conta de `levelFromXp` em
  -- `src/lib/gamification.ts`.
  update public.profiles p
     set xp_total = p.xp_total + desafio.xp,
         level    = ((p.xp_total + desafio.xp) / 100) + 1
   where p.id = eu
   returning p.xp_total, p.level into xp_final, nivel;

  return query select desafio.xp, false, quantos, coalesce(xp_final, 0), coalesce(nivel, 1);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Contador do perfil e comparacao com amigos
-- ---------------------------------------------------------------------------

create or replace function public.desafio_total(alvo uuid default auth.uid())
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
    from public.daily_challenge_completions c
   where c.user_id = alvo;
$$;

/**
 * Quem entre os meus amigos ja fez o desafio de hoje.
 *
 * SECURITY DEFINER porque a policy de SELECT so deixa cada um ver as proprias
 * conclusoes - aqui o servidor faz a juncao e devolve so o booleano, sem expor
 * nenhuma outra linha. Nada de e-mail: so o que ja e publico no perfil.
 */
create or replace function public.desafio_amigos()
returns table (
  user_id    uuid,
  name       text,
  username   text,
  avatar_url text,
  concluido  boolean,
  total      int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  eu   uuid := auth.uid();
  hoje date := public.desafio_hoje();
begin
  if eu is null then
    return;
  end if;

  return query
    select p.id,
           p.name,
           p.username,
           p.avatar_url,
           exists (
             select 1
               from public.daily_challenge_completions c
              where c.dia = hoje and c.user_id = p.id
           ),
           (select count(*)::int
              from public.daily_challenge_completions c
             where c.user_id = p.id)
      from public.profiles p
     where exists (
             select 1
               from public.friendships f
              where f.status = 'accepted'
                and ((f.user_id = eu and f.friend_id = p.id)
                  or (f.friend_id = eu and f.user_id = p.id))
           )
     order by 5 desc, 6 desc, p.name;
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. RLS
-- ---------------------------------------------------------------------------

alter table public.daily_challenges            enable row level security;
alter table public.daily_challenge_completions enable row level security;

-- O desafio do dia e publico: e o mesmo para todo mundo.
drop policy if exists "desafio do dia e publico" on public.daily_challenges;
create policy "desafio do dia e publico"
  on public.daily_challenges for select using (true);
-- Sem policy de escrita: quem cria a linha do dia e `desafio_do_dia()`.

-- Cada um enxerga apenas as proprias conclusoes. A comparacao com amigos passa
-- por `desafio_amigos()`, que devolve so o booleano.
drop policy if exists "vejo minhas conclusoes" on public.daily_challenge_completions;
create policy "vejo minhas conclusoes"
  on public.daily_challenge_completions for select using (user_id = auth.uid());
-- Sem policy de INSERT/UPDATE/DELETE: so `desafio_concluir()` escreve, e ela
-- nao aceita nem usuario nem data.

-- ---------------------------------------------------------------------------
-- 9. Permissoes
-- ---------------------------------------------------------------------------

grant execute on function public.desafio_hoje()            to authenticated;
grant execute on function public.desafio_expira_em()       to authenticated;
grant execute on function public.desafio_do_dia()          to authenticated;
grant execute on function public.desafio_estado()          to authenticated;
grant execute on function public.desafio_concluir()        to authenticated;
grant execute on function public.desafio_total(uuid)       to authenticated;
grant execute on function public.desafio_amigos()          to authenticated;

-- Internas: nao ha motivo para o cliente perguntar qual sera o desafio de
-- amanha.
revoke execute on function public.desafio_pool()      from public, anon, authenticated;
revoke execute on function public.desafio_sortear(date) from public, anon, authenticated;
