-- ===========================================================================
-- CodeQuest - modo ranqueado (temporadas, patamares, elo, bots)
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de 0001 a 0005. Nao precisa rodar o seed de novo por causa deste
-- arquivo, mas rode se voce ainda nao rodou depois da Fase 4 (as conquistas
-- de patamar sao conteudo e entram por la).
--
-- ---------------------------------------------------------------------------
-- COMO A SEGURANCA FUNCIONA AQUI
--
-- Mesma regra da Fase 3: o aplicativo e 100% client-side, entao "validar no
-- servidor" quer dizer **dentro do PostgreSQL**.
--
--   * O elo NUNCA e enviado pelo cliente. Ele nem tem por onde: nao existe
--     policy de INSERT/UPDATE em `ranked_stats`. A unica coisa que escreve la
--     e `ranked_aplicar_resultado`, que e `security definer` e esta revogada
--     de `authenticated`.
--   * Quem decide o resultado da partida continua sendo `pvp_finalizar`, que
--     soma as respostas gravadas - nao um placar enviado pelo aparelho.
--   * O bot tambem joga no servidor. A taxa de acerto e a faixa de tempo dele
--     ficam gravadas na partida (escolhidas pelo servidor a partir do patamar
--     do jogador) e cada resposta dele e sorteada por um gatilho, quando o
--     humano responde a mesma pergunta. O cliente nao sorteia nada.
--   * `pvp_cancelar` passa a recusar partida ranqueada: sem isso daria para
--     cancelar toda partida que estivesse perdendo.
--   * A ranqueada NAO deixa escolher o tema (ver `ranked_iniciar`). Isso e uma
--     regra de servidor, e nao um seletor escondido na tela: `ranked_iniciar`
--     nem aceita o parametro, entao nao adianta chamar a funcao na mao.
--
-- ---------------------------------------------------------------------------
-- O QUE ESTE ARQUIVO SUBSTITUI DA 0005
--
-- Duas funcoes da Fase 3 ganharam versao nova aqui (o adversario pode ser um
-- bot agora, e a 0005 so sabia lidar com duas pessoas):
--
--   * `pvp_estado`     - passa a devolver `modo`, `adversario` e `meu_desfecho`
--   * `pvp_finalizar`  - passa a contar os pontos do bot e a aplicar elo
--   * `pvp_cancelar`   - passa a barrar cancelamento de ranqueada
--
-- `pvp_pergunta` e `pvp_responder` continuam EXATAMENTE como estao na 0005 -
-- de proposito. O caminho de duelo entre dois amigos e literalmente o mesmo
-- codigo de antes, entao a ranqueada nao tem como quebrar o modo amistoso.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Temporadas
--
-- Duram 15 dias corridos e viram sozinhas. Nao existe tarefa agendada aqui de
-- proposito: cron e um servico que o plano gratuito nao garante. Em vez disso
-- a virada e preguicosa - a primeira pessoa que abre a tela de ranqueada
-- depois do prazo e quem cria a temporada seguinte.
--
-- O "reset para Bronze 1" acontece sem apagar nada: como o elo e guardado por
-- (temporada, jogador), na temporada nova a pessoa simplesmente ainda nao tem
-- linha - e quem nao tem linha esta em Bronze 1 com 0 de elo. As linhas
-- antigas ficam onde estao, e sao elas o historico.
-- ---------------------------------------------------------------------------

create table if not exists public.seasons (
  numero      int primary key,
  comeca_em   timestamptz not null,
  termina_em  timestamptz not null,

  constraint seasons_intervalo check (termina_em > comeca_em)
);

/** Duracao de uma temporada, em dias. Espelhado em `src/lib/ranked/api.ts`. */
create or replace function public.ranked_dias_da_temporada()
returns int language sql immutable as $$ select 15; $$;

/**
 * A temporada de agora, criando o que faltar.
 *
 * Chamar isto e barato e idempotente: no caso normal e um `select ... limit 1`
 * e nada mais.
 */
create or replace function public.ranked_temporada_atual()
returns public.seasons
language plpgsql
security definer
set search_path = public
as $$
declare
  atual  public.seasons;
  giros  int := 0;
  dias   interval := (public.ranked_dias_da_temporada() || ' days')::interval;
begin
  select s.* into atual from public.seasons s order by s.numero desc limit 1;

  if atual.numero is null then
    insert into public.seasons (numero, comeca_em, termina_em)
    values (1, date_trunc('day', now()), date_trunc('day', now()) + dias)
    on conflict do nothing;
    select s.* into atual from public.seasons s order by s.numero desc limit 1;
    return atual;
  end if;

  -- Um `while` e nao um `if`: o aplicativo pode ficar meses parado (ferias da
  -- escola), e ai a virada precisa pular varias temporadas de uma vez. As
  -- temporadas se encaixam sem buraco - a seguinte comeca onde a anterior
  -- terminou -, entao a contagem de 15 dias nao depende de alguem ter aberto
  -- o app no dia certo.
  while now() >= atual.termina_em and giros < 500 loop
    insert into public.seasons (numero, comeca_em, termina_em)
    values (atual.numero + 1, atual.termina_em, atual.termina_em + dias)
    on conflict do nothing;

    select s.* into atual from public.seasons s order by s.numero desc limit 1;
    giros := giros + 1;
  end loop;

  return atual;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Elo do jogador, por temporada
-- ---------------------------------------------------------------------------

create table if not exists public.ranked_stats (
  season_numero  int  not null references public.seasons (numero) on delete cascade,
  user_id        uuid not null references public.profiles (id) on delete cascade,
  elo            int  not null default 0 check (elo >= 0),
  -- Maior elo alcancado NESTA temporada. E ele que vira "patamar mais alto
  -- atingido" no perfil, e o `max()` dele em todas as temporadas e o que
  -- libera as conquistas de patamar (que nao zeram junto com a temporada).
  pico_elo       int  not null default 0 check (pico_elo >= 0),
  vitorias       int  not null default 0,
  derrotas       int  not null default 0,
  empates        int  not null default 0,
  partidas       int  not null default 0,
  updated_at     timestamptz not null default now(),

  primary key (season_numero, user_id)
);

create index if not exists ranked_stats_ladder_idx
  on public.ranked_stats (season_numero, elo desc);

-- Quanto elo cada partida ranqueada mexeu, para a tela de resultado.
create table if not exists public.ranked_match_results (
  match_id    uuid not null references public.matches (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  elo_antes   int  not null,
  elo_depois  int  not null,
  criado_em   timestamptz not null default now(),

  primary key (match_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 3. A partida ranqueada e o bot
--
-- Reaproveita `matches` de proposito. Uma partida ranqueada e uma partida
-- normal com `modo = 'ranqueado'`; o adversario e um bot enquanto `guest_id`
-- for nulo. Quando houver gente ranqueada suficiente, basta preencher
-- `guest_id` em vez de `bot_nome`: nada de patamar, elo ou temporada muda.
-- ---------------------------------------------------------------------------

alter table public.matches
  add column if not exists modo text not null default 'amistoso',
  add column if not exists season_numero int,
  add column if not exists bot_nome text,
  add column if not exists bot_acerto numeric,
  add column if not exists bot_ms_min int,
  add column if not exists bot_ms_max int,
  -- Preenchido por `pvp_finalizar`: 'vitoria' | 'derrota' | 'empate', do ponto
  -- de vista do anfitriao. Existe porque `winner_id` nao consegue dizer "o bot
  -- ganhou" - o bot nao tem perfil, entao `winner_id` ficaria nulo e a partida
  -- pareceria empate.
  add column if not exists desfecho_host text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'matches_modo_valido') then
    alter table public.matches
      add constraint matches_modo_valido check (modo in ('amistoso', 'ranqueado'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_desfecho_valido') then
    alter table public.matches
      add constraint matches_desfecho_valido
      check (desfecho_host is null or desfecho_host in ('vitoria', 'derrota', 'empate'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'matches_bot_acerto_valido') then
    alter table public.matches
      add constraint matches_bot_acerto_valido
      check (bot_acerto is null or (bot_acerto >= 0 and bot_acerto <= 1));
  end if;
end
$$;

alter table public.matches
  drop constraint if exists matches_season_fk;
alter table public.matches
  add constraint matches_season_fk
  foreign key (season_numero) references public.seasons (numero) on delete set null;

-- O adversario passa a poder ser um bot, entao `guest_id` deixa de ser
-- obrigatorio - mas toda partida continua precisando de um dos dois.
alter table public.matches alter column guest_id drop not null;

alter table public.matches drop constraint if exists matches_tem_adversario;
alter table public.matches
  add constraint matches_tem_adversario
  check (guest_id is not null or bot_nome is not null);

create index if not exists matches_ranqueada_idx
  on public.matches (host_id, modo, status);

-- As jogadas do bot. Tabela separada de `match_answers` porque aquela exige um
-- `user_id` que exista em `profiles`, e o bot nao e uma conta.
create table if not exists public.match_bot_answers (
  match_id  uuid not null references public.matches (id) on delete cascade,
  ordem     int  not null check (ordem >= 1),
  correta   boolean not null,
  ms        int  not null,
  pontos    int  not null default 0,

  primary key (match_id, ordem)
);

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.seasons              enable row level security;
alter table public.ranked_stats         enable row level security;
alter table public.ranked_match_results enable row level security;
alter table public.match_bot_answers    enable row level security;

-- Calendario da temporada: publico (a tela mostra "temporada 3 · termina em
-- 6 dias" para todo mundo).
drop policy if exists "temporadas sao publicas" on public.seasons;
create policy "temporadas sao publicas"
  on public.seasons for select
  to authenticated
  using (true);

-- Elo e patamar aparecem no perfil publico, entao leitura e livre. Escrita
-- nao tem policy nenhuma: so `ranked_aplicar_resultado` escreve aqui.
drop policy if exists "elo de ranqueada e publico" on public.ranked_stats;
create policy "elo de ranqueada e publico"
  on public.ranked_stats for select
  to authenticated
  using (true);

-- `ranked_match_results` e `match_bot_answers` ficam SEM policy de proposito:
-- ninguem le direto. O resultado sai por `ranked_resultado()`, ja conferido, e
-- as jogadas do bot so interessam ao servidor (ler antes do fim entregaria o
-- placar do adversario).

-- ---------------------------------------------------------------------------
-- 5. A escada: divisoes, patamares e elo
--
-- ESPELHO de `src/lib/ranked/patamares.ts`. `npm run test:ranqueado` roda as
-- duas versoes lado a lado e falha se elas discordarem em qualquer valor.
--
-- 7 patamares x 3 sub-niveis = 21 divisoes (0 = Bronze 1 ... 20 = Mestre 3).
-- Cada divisao custa 100 de elo. O que faz a subida ficar mais lenta la em
-- cima nao e o tamanho da divisao, e o ganho por vitoria: 40 no Bronze (2,5
-- vitorias por divisao) contra 10 no Mestre (10 vitorias por divisao).
-- ---------------------------------------------------------------------------

create or replace function public.ranked_divisao(elo int)
returns int language sql immutable as $$
  select least(20, greatest(0, coalesce(elo, 0)) / 100);
$$;

create or replace function public.ranked_patamar(divisao int)
returns int language sql immutable as $$
  select least(20, greatest(0, coalesce(divisao, 0))) / 3;
$$;

create or replace function public.ranked_subnivel(divisao int)
returns int language sql immutable as $$
  select (least(20, greatest(0, coalesce(divisao, 0))) % 3) + 1;
$$;

/** Elo ganho por uma vitoria com esse elo. Diminui conforme o patamar sobe. */
create or replace function public.ranked_ganho(elo int)
returns int language sql immutable as $$
  select (array[40, 35, 30, 25, 20, 15, 10])[public.ranked_patamar(public.ranked_divisao(elo)) + 1];
$$;

/** Elo perdido por uma derrota com esse elo. Aumenta conforme o patamar sobe. */
create or replace function public.ranked_perda(elo int)
returns int language sql immutable as $$
  select (array[10, 12, 15, 18, 20, 22, 25])[public.ranked_patamar(public.ranked_divisao(elo)) + 1];
$$;

/**
 * Piso do patamar atual.
 *
 * Quem entrou em Ouro 1 nao volta para Prata 3 por mais que perca - so anda
 * para tras dentro do proprio patamar.
 */
create or replace function public.ranked_piso(elo int)
returns int language sql immutable as $$
  select public.ranked_patamar(public.ranked_divisao(elo)) * 300;
$$;

/** Elo depois de uma partida. Empate nao mexe. */
create or replace function public.ranked_novo_elo(elo int, resultado text)
returns int
language plpgsql
immutable
as $$
declare
  atual int := greatest(0, coalesce(elo, 0));
begin
  if resultado = 'vitoria' then
    return atual + public.ranked_ganho(atual);
  end if;
  if resultado = 'derrota' then
    return greatest(public.ranked_piso(atual), atual - public.ranked_perda(atual));
  end if;
  return atual;
end;
$$;

/** 'vitoria' <-> 'derrota'. Usado para dar o resultado ao outro lado. */
create or replace function public.ranked_inverso(resultado text)
returns text language sql immutable as $$
  select case resultado
           when 'vitoria' then 'derrota'
           when 'derrota' then 'vitoria'
           else 'empate'
         end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Os bots
--
-- ESPELHO de `src/lib/ranked/bots.ts`. Um bot por patamar: no Bronze erra mais
-- da metade e demora ate 14 segundos; no Mestre acerta 94% em ate 5 segundos.
-- ---------------------------------------------------------------------------

create or replace function public.ranked_bot(patamar int)
returns table (nome text, acerto numeric, ms_min int, ms_max int)
language sql
immutable
as $$
  select (array['Bit', 'Loop', 'Nullptr', 'Kernel', 'Daemon', 'Overflow', 'Root'])[p + 1],
         (array[0.45, 0.55, 0.65, 0.72, 0.80, 0.88, 0.94]::numeric[])[p + 1],
         (array[5000, 4500, 4000, 3500, 3000, 2500, 1800])[p + 1],
         (array[14000, 12000, 11000, 9500, 8000, 6500, 5000])[p + 1]
    from (select least(6, greatest(0, coalesce(patamar, 0))) as p) escolha;
$$;

/** Sorteia UMA jogada do bot da partida e grava. Nao faz nada se ja existir. */
create or replace function public.ranked_bot_jogar(m uuid, n int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  partida  public.matches;
  acertou  boolean;
  gasto    int;
  piso     int;
  teto     int;
begin
  select p.* into partida from public.matches p where p.id = m;
  if partida.id is null or partida.bot_nome is null then
    return;
  end if;

  piso    := coalesce(partida.bot_ms_min, 3000);
  teto    := greatest(piso, coalesce(partida.bot_ms_max, 9000));
  acertou := random() < coalesce(partida.bot_acerto, 0.5);
  gasto   := piso + floor(random() * (teto - piso))::int;

  insert into public.match_bot_answers (match_id, ordem, correta, ms, pontos)
  values (m, n, acertou, gasto, public.pvp_pontuar(acertou, gasto))
  on conflict do nothing;
end;
$$;

/**
 * O bot responde na mesma hora em que o humano responde.
 *
 * E um gatilho, e nao uma linha dentro de `pvp_responder`, para que
 * `pvp_responder` continue sendo exatamente o mesmo codigo da Fase 3: assim a
 * ranqueada nao tem como estragar o duelo entre amigos.
 */
create or replace function public.ranked_bot_acompanha()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ranked_bot_jogar(new.match_id, new.ordem);
  return new;
end;
$$;

drop trigger if exists ranked_bot_acompanha on public.match_answers;
create trigger ranked_bot_acompanha
  after update on public.match_answers
  for each row
  when (new.answered_at is not null and old.answered_at is null)
  execute function public.ranked_bot_acompanha();

/** Completa as jogadas que faltam do bot (partida abandonada no meio). */
create or replace function public.ranked_bot_completar(m uuid, total int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  for n in 1..total loop
    perform public.ranked_bot_jogar(m, n);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Aplicacao do elo
--
-- Esta funcao e o coracao do modo ranqueado - e repare no que ela NAO recebe:
-- nenhum numero vindo do cliente. So "venceu, perdeu ou empatou". Por isso ela
-- serve igual para partida contra bot e para partida contra gente de verdade.
-- ---------------------------------------------------------------------------

create or replace function public.ranked_aplicar_resultado(
  jogador uuid, resultado text, temporada int
)
returns table (elo_antes int, elo_depois int)
language plpgsql
security definer
set search_path = public
as $$
declare
  antes  int;
  depois int;
begin
  if resultado not in ('vitoria', 'derrota', 'empate') then
    raise exception 'Resultado invalido: %', resultado;
  end if;

  insert into public.ranked_stats (season_numero, user_id)
  values (temporada, jogador)
  on conflict do nothing;

  select r.elo into antes
    from public.ranked_stats r
   where r.season_numero = temporada and r.user_id = jogador;

  depois := public.ranked_novo_elo(antes, resultado);

  update public.ranked_stats r
     set elo        = depois,
         pico_elo   = greatest(r.pico_elo, depois),
         vitorias   = r.vitorias + case when resultado = 'vitoria' then 1 else 0 end,
         derrotas   = r.derrotas + case when resultado = 'derrota' then 1 else 0 end,
         empates    = r.empates  + case when resultado = 'empate'  then 1 else 0 end,
         partidas   = r.partidas + 1,
         updated_at = now()
   where r.season_numero = temporada and r.user_id = jogador;

  return query select antes, depois;
end;
$$;

/** Aplica o elo e guarda quanto mudou, para a tela de resultado. */
create or replace function public.ranked_registrar(
  m uuid, jogador uuid, resultado text, temporada int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  mudanca record;
begin
  if temporada is null then
    return;
  end if;

  select * into mudanca
    from public.ranked_aplicar_resultado(jogador, resultado, temporada);

  insert into public.ranked_match_results (match_id, user_id, elo_antes, elo_depois)
  values (m, jogador, mudanca.elo_antes, mudanca.elo_depois)
  on conflict do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Comecar uma partida ranqueada
-- ---------------------------------------------------------------------------

-- Versao antiga aceitava o tema; a de agora nao. O `drop` deixa a troca segura
-- para quem chegou a rodar a versao anterior deste arquivo.
drop function if exists public.ranked_iniciar(text);

/**
 * Comeca (ou retoma) uma partida ranqueada.
 *
 * Repare que NAO ha parametro de tema. Na ranqueada as perguntas vem de todas
 * as linguagens misturadas, sempre - e isso e decidido aqui, no servidor, e
 * nao escondendo o seletor na tela. Escolher o assunto seria escolher a
 * dificuldade: todo mundo jogaria no que ja domina, e a escada de patamares
 * deixaria de medir o que se propoe a medir.
 *
 * O duelo com amigo (`pvp_convidar`) continua com tema escolhido - la a graca
 * e combinar o assunto com a outra pessoa.
 */
create or replace function public.ranked_iniciar()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  eu           uuid := auth.uid();
  temporada    public.seasons;
  meu_elo      int;
  aberta       public.matches;
  adversario   record;
  nova         uuid;
  quantidade   int := 5;
  disponiveis  int;
begin
  if eu is null then
    raise exception 'Precisa estar autenticado';
  end if;

  temporada := public.ranked_temporada_atual();

  insert into public.ranked_stats (season_numero, user_id)
  values (temporada.numero, eu)
  on conflict do nothing;

  select r.elo into meu_elo
    from public.ranked_stats r
   where r.season_numero = temporada.numero and r.user_id = eu;

  -- Uma partida ranqueada por vez.
  --
  -- Quem fecha o aplicativo perdendo nao escapa: a partida velha e encerrada
  -- com o placar parcial (e o bot completa as respostas dele) antes de comecar
  -- outra. Enquanto os 5 minutos nao passam, pedir partida nova devolve a
  -- mesma partida - o jogador volta para onde parou.
  select p.* into aberta
    from public.matches p
   where p.modo = 'ranqueado' and p.host_id = eu and p.status = 'ativa'
   order by p.created_at desc
   limit 1;

  if aberta.id is not null then
    if aberta.started_at > now() - interval '5 minutes' then
      return aberta.id;
    end if;
    perform public.pvp_finalizar(aberta.id);
  end if;

  select count(*) into disponiveis from public.pvp_questions q;

  if disponiveis < quantidade then
    raise exception 'Nao ha perguntas suficientes para uma partida ranqueada';
  end if;

  -- A dificuldade do bot sai do patamar do jogador, decidida AQUI. O cliente
  -- nao escolhe contra quem joga.
  select * into adversario
    from public.ranked_bot(public.ranked_patamar(public.ranked_divisao(meu_elo)));

  insert into public.matches (
    tema, status, modo, host_id, guest_id, total_perguntas, season_numero,
    bot_nome, bot_acerto, bot_ms_min, bot_ms_max, started_at
  )
  values (
    'todas', 'ativa', 'ranqueado', eu, null, quantidade, temporada.numero,
    adversario.nome, adversario.acerto, adversario.ms_min, adversario.ms_max, now()
  )
  returning id into nova;

  insert into public.match_questions (match_id, ordem, question_id)
  select nova, row_number() over (), q.id
    from (
      select id from public.pvp_questions
       order by random()
       limit quantidade
    ) q;

  return nova;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Leitura: onde estou, e como foi
-- ---------------------------------------------------------------------------

/**
 * Situacao de alguem na temporada atual.
 *
 * Sem argumento devolve a de quem chamou. Com `alvo`, a de outra pessoa - o
 * perfil publico mostra patamar, e isso ja e leitura livre em `ranked_stats`.
 */
create or replace function public.ranked_estado(alvo uuid default null)
returns table (
  season_numero   int,
  comeca_em       timestamptz,
  termina_em      timestamptz,
  elo             int,
  divisao         int,
  pico_elo        int,
  pico_divisao    int,
  pico_historico  int,
  vitorias        int,
  derrotas        int,
  empates         int,
  partidas        int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quem       uuid := coalesce(alvo, auth.uid());
  t          public.seasons;
  linha      public.ranked_stats;
  historico  int;
begin
  if quem is null then
    raise exception 'Precisa estar autenticado';
  end if;

  t := public.ranked_temporada_atual();

  select r.* into linha
    from public.ranked_stats r
   where r.season_numero = t.numero and r.user_id = quem;

  -- O maior elo de TODAS as temporadas. A temporada zera; a conquista de
  -- patamar, nao.
  select coalesce(max(r.pico_elo), 0) into historico
    from public.ranked_stats r
   where r.user_id = quem;

  return query
    select t.numero,
           t.comeca_em,
           t.termina_em,
           coalesce(linha.elo, 0),
           public.ranked_divisao(coalesce(linha.elo, 0)),
           coalesce(linha.pico_elo, 0),
           public.ranked_divisao(coalesce(linha.pico_elo, 0)),
           historico,
           coalesce(linha.vitorias, 0),
           coalesce(linha.derrotas, 0),
           coalesce(linha.empates, 0),
           coalesce(linha.partidas, 0);
end;
$$;

/** Temporadas ja encerradas, da mais recente para a mais antiga. */
create or replace function public.ranked_historico(alvo uuid default null, limite int default 12)
returns table (
  season_numero  int,
  comeca_em      timestamptz,
  termina_em     timestamptz,
  elo_final      int,
  pico_elo       int,
  pico_divisao   int,
  vitorias       int,
  derrotas       int,
  partidas       int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quem uuid := coalesce(alvo, auth.uid());
  t    public.seasons;
begin
  if quem is null then
    raise exception 'Precisa estar autenticado';
  end if;

  t := public.ranked_temporada_atual();

  return query
    select s.numero,
           s.comeca_em,
           s.termina_em,
           r.elo,
           r.pico_elo,
           public.ranked_divisao(r.pico_elo),
           r.vitorias,
           r.derrotas,
           r.partidas
      from public.ranked_stats r
      join public.seasons s on s.numero = r.season_numero
     where r.user_id = quem
       and s.numero < t.numero
     order by s.numero desc
     limit greatest(1, least(50, coalesce(limite, 12)));
end;
$$;

/** Quanto elo a partida `m` mexeu para quem esta chamando. */
create or replace function public.ranked_resultado(m uuid)
returns table (
  elo_antes      int,
  elo_depois     int,
  delta          int,
  divisao_antes  int,
  divisao_depois int,
  adversario     text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida  public.matches;
  linha    public.ranked_match_results;
begin
  partida := public.pvp_partida_do_usuario(m);

  select r.* into linha
    from public.ranked_match_results r
   where r.match_id = m and r.user_id = auth.uid();

  if linha.match_id is null then
    return;
  end if;

  return query
    select linha.elo_antes,
           linha.elo_depois,
           linha.elo_depois - linha.elo_antes,
           public.ranked_divisao(linha.elo_antes),
           public.ranked_divisao(linha.elo_depois),
           coalesce(partida.bot_nome, 'Adversário');
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Versoes novas das funcoes da 0005
-- ---------------------------------------------------------------------------

/**
 * Placar ao vivo - agora sabendo que o adversario pode ser um bot.
 *
 * Precisou de `drop` antes do `create`: o PostgreSQL nao deixa trocar o tipo
 * de retorno de uma funcao existente, e esta ganhou tres colunas (`modo`,
 * `adversario` e `meu_desfecho`).
 */
drop function if exists public.pvp_estado(uuid);
create function public.pvp_estado(m uuid)
returns table (
  status             text,
  total              int,
  tema               text,
  modo               text,
  host_id            uuid,
  guest_id           uuid,
  winner_id          uuid,
  adversario         text,
  meu_desfecho       text,
  host_respondidas   int,
  guest_respondidas  int,
  host_pontos        int,
  guest_pontos       int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida     public.matches;
  contra_bot  boolean;
  sou_host    boolean;
  fim         boolean;
begin
  partida    := public.pvp_partida_do_usuario(m);
  contra_bot := partida.guest_id is null;
  sou_host   := auth.uid() = partida.host_id;
  fim        := partida.status = 'encerrada';

  return query
    select partida.status,
           partida.total_perguntas,
           partida.tema,
           partida.modo,
           partida.host_id,
           partida.guest_id,
           partida.winner_id,
           partida.bot_nome,
           -- Resultado do ponto de vista de quem esta perguntando.
           case
             when partida.desfecho_host is null then null
             when sou_host then partida.desfecho_host
             else public.ranked_inverso(partida.desfecho_host)
           end,
           (select count(*)::int from public.match_answers a
             where a.match_id = m and a.user_id = partida.host_id
               and a.answered_at is not null),
           case when contra_bot
                then (select count(*)::int from public.match_bot_answers b where b.match_id = m)
                else (select count(*)::int from public.match_answers a
                       where a.match_id = m and a.user_id = partida.guest_id
                         and a.answered_at is not null)
           end,
           -- Enquanto a partida corre, cada um so ve o proprio placar.
           case when fim or sou_host
                then (select coalesce(sum(a.pontos), 0)::int from public.match_answers a
                       where a.match_id = m and a.user_id = partida.host_id)
                else 0 end,
           case
             when contra_bot then
               case when fim
                    then (select coalesce(sum(b.pontos), 0)::int
                            from public.match_bot_answers b where b.match_id = m)
                    else 0 end
             when fim or auth.uid() = partida.guest_id then
               (select coalesce(sum(a.pontos), 0)::int from public.match_answers a
                 where a.match_id = m and a.user_id = partida.guest_id)
             else 0
           end;
end;
$$;

/**
 * Fecha a partida - agora contando os pontos do bot e aplicando elo.
 *
 * A assinatura e a mesma da 0005, entao `create or replace` basta.
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
  pgs         int;
  respondeu_h int;
  respondeu_g int;
  vencedor    uuid;
  desf        text;
  expirou     boolean;
  contra_bot  boolean;
begin
  partida := public.pvp_partida_do_usuario(m);

  if partida.status = 'encerrada' then
    return query select partida.status, partida.winner_id, partida.pontos_host, partida.pontos_guest;
    return;
  end if;

  if partida.status <> 'ativa' then
    raise exception 'A partida nao esta em andamento';
  end if;

  contra_bot := partida.guest_id is null;
  expirou    := partida.started_at < now() - interval '5 minutes';

  -- Abandonou no meio? O bot termina as perguntas dele. Sem isto, largar a
  -- partida enquanto se esta na frente seria uma vitoria de graca: o bot so
  -- responde acompanhando o humano.
  if expirou and contra_bot then
    perform public.ranked_bot_completar(m, partida.total_perguntas);
  end if;

  select count(*)::int into respondeu_h
    from public.match_answers a
   where a.match_id = m and a.user_id = partida.host_id and a.answered_at is not null;

  if contra_bot then
    select count(*)::int into respondeu_g
      from public.match_bot_answers b where b.match_id = m;
  else
    select count(*)::int into respondeu_g
      from public.match_answers a
     where a.match_id = m and a.user_id = partida.guest_id and a.answered_at is not null;
  end if;

  if not expirou
     and (respondeu_h < partida.total_perguntas or respondeu_g < partida.total_perguntas) then
    -- Ainda tem gente jogando.
    return query select partida.status, null::uuid, 0, 0;
    return;
  end if;

  select coalesce(sum(a.pontos), 0)::int into ph
    from public.match_answers a where a.match_id = m and a.user_id = partida.host_id;

  if contra_bot then
    select coalesce(sum(b.pontos), 0)::int into pgs
      from public.match_bot_answers b where b.match_id = m;
  else
    select coalesce(sum(a.pontos), 0)::int into pgs
      from public.match_answers a where a.match_id = m and a.user_id = partida.guest_id;
  end if;

  if ph > pgs then
    desf     := 'vitoria';
    vencedor := partida.host_id;
  elsif pgs > ph then
    desf     := 'derrota';
    -- Nulo quando o adversario e um bot: nao ha perfil para apontar. Quem
    -- guarda a verdade nesse caso e `desfecho_host`.
    vencedor := partida.guest_id;
  else
    desf     := 'empate';
    vencedor := null;
  end if;

  update public.matches
     set status        = 'encerrada',
         winner_id     = vencedor,
         desfecho_host = desf,
         pontos_host   = ph,
         pontos_guest  = pgs,
         ended_at      = now()
   where id = m;

  if partida.modo = 'ranqueado' then
    -- Ranqueada mexe em elo e SO em elo.
    --
    -- Nao entra em `pvp_stats` de proposito: aquele cartel (e as tags de
    -- duelo que dependem dele) e de partida contra amigo. Se vitoria contra
    -- bot contasse la, "Imortal - 100 vitorias" viraria uma tarde de farm.
    perform public.ranked_registrar(m, partida.host_id, desf, partida.season_numero);
    if partida.guest_id is not null then
      perform public.ranked_registrar(
        m, partida.guest_id, public.ranked_inverso(desf), partida.season_numero
      );
    end if;
  else
    perform public.pvp_registrar_stats(partida.host_id, vencedor, ph, partida.tema);
    if partida.guest_id is not null then
      perform public.pvp_registrar_stats(partida.guest_id, vencedor, pgs, partida.tema);
    end if;
  end if;

  return query select 'encerrada'::text, vencedor, ph, pgs;
end;
$$;

/**
 * Cancelar continua valendo para o duelo entre amigos - e passa a ser recusado
 * na ranqueada.
 *
 * Sem isto, bastaria cancelar toda partida em que se estivesse perdendo.
 */
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

  if partida.modo = 'ranqueado' and partida.status = 'ativa' then
    raise exception 'Partida ranqueada nao pode ser cancelada';
  end if;

  if partida.status not in ('convite', 'ativa') then
    return partida.status;
  end if;

  update public.matches set status = 'cancelada', ended_at = now() where id = m;
  return 'cancelada';
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Permissoes
--
-- Tudo que escreve elo fica FORA do alcance do cliente.
-- ---------------------------------------------------------------------------

revoke all on function public.ranked_aplicar_resultado(uuid, text, int) from public;
revoke all on function public.ranked_aplicar_resultado(uuid, text, int) from authenticated;
revoke all on function public.ranked_registrar(uuid, uuid, text, int)   from public;
revoke all on function public.ranked_registrar(uuid, uuid, text, int)   from authenticated;
revoke all on function public.ranked_bot_jogar(uuid, int)               from public;
revoke all on function public.ranked_bot_jogar(uuid, int)               from authenticated;
revoke all on function public.ranked_bot_completar(uuid, int)           from public;
revoke all on function public.ranked_bot_completar(uuid, int)           from authenticated;

grant execute on function public.ranked_temporada_atual()          to authenticated;
grant execute on function public.ranked_iniciar()                  to authenticated;
grant execute on function public.ranked_estado(uuid)               to authenticated;
grant execute on function public.ranked_historico(uuid, int)       to authenticated;
grant execute on function public.ranked_resultado(uuid)            to authenticated;
grant execute on function public.pvp_estado(uuid)                  to authenticated;
grant execute on function public.pvp_finalizar(uuid)               to authenticated;
grant execute on function public.pvp_cancelar(uuid)                to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Realtime
--
-- `matches` ja esta publicada pela 0005 e e por ela que a tela sabe que a
-- partida encerrou. As jogadas do bot NAO entram na publicacao: elas revelam
-- o placar do adversario antes da hora.
-- ---------------------------------------------------------------------------
