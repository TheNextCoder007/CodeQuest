-- ===========================================================================
-- CodeQuest - patamar Elite, sub-niveis do Mestre e contador de topo
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de 0001 a 0008.
--
-- ---------------------------------------------------------------------------
-- O QUE MUDA NA ESCADA
--
--   ANTES  19 divisoes: Bronze 1 ... Lendario 3 (17), Mestre (18, sem sub-nivel)
--   AGORA  22 divisoes: Bronze 1 ... Lendario 3 (17),
--                       Mestre 1/2/3 (18, 19, 20) e Elite (21, sem sub-nivel)
--
-- O Mestre volta a ter os tres sub-niveis que tinha antes, e o topo absoluto
-- passa a ser o **Elite**, unico e sem sub-nivel.
--
-- ---------------------------------------------------------------------------
-- POR QUE O ELITE E PERMANENTE - E POR QUE ISSO NAO EXIGE CODIGO NOVO
--
-- `ranked_piso` sempre devolveu o inicio do patamar atual, e `ranked_novo_elo`
-- nunca deixa a derrota passar desse piso. Era o que impedia cair de Ouro 1
-- para Prata 3; com o Elite virando um patamar como os outros, a MESMA regra
-- passa a impedir cair de Elite para Mestre. Nao ha excecao escrita em lugar
-- nenhum - o Elite e permanente porque e um patamar, e patamar conquistado nao
-- se perde neste jogo.
--
-- Dentro do Elite (e dentro do Mestre) o elo sobe e desce a vontade: e ele que
-- ordena o leaderboard entre quem ja chegou la.
--
-- ---------------------------------------------------------------------------
-- GANHO E PERDA NO TOPO
--
--   Mestre (qualquer sub-nivel):  vitoria +13   derrota -25
--   Elite:                        vitoria +10   derrota -30
--
-- A derrota pesa mais do que a vitoria compensa, de proposito: no topo, manter
-- a posicao precisa custar tanto quanto chegar nela. Um Elite que ganha duas e
-- perde uma termina no zero a zero (+20 / -30).
--
-- Nada disso muda o elo ja acumulado: quem estava com 1850 continua com 1850 -
-- so passa a se chamar "Mestre 1" em vez de "Mestre", e quem passar de 2100
-- entra no Elite.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. A escada
-- ---------------------------------------------------------------------------

/** Divisao 0 a 21. Acima de 2100 a divisao trava, mas o elo continua subindo. */
create or replace function public.ranked_divisao(elo int)
returns int language sql immutable as $$
  select least(21, greatest(0, coalesce(elo, 0)) / 100);
$$;

/** Indice do patamar: 0 = Bronze ... 6 = Mestre, 7 = Elite. */
create or replace function public.ranked_patamar(divisao int)
returns int language sql immutable as $$
  select least(21, greatest(0, coalesce(divisao, 0))) / 3;
$$;

/** 1, 2 ou 3 - e **0** no Elite, o unico patamar sem sub-nivel. */
create or replace function public.ranked_subnivel(divisao int)
returns int language sql immutable as $$
  select case when least(21, greatest(0, coalesce(divisao, 0))) >= 21
              then 0
              else (least(21, greatest(0, coalesce(divisao, 0))) % 3) + 1
         end;
$$;

/** Elo ganho por uma vitoria com esse elo. Diminui conforme o patamar sobe. */
create or replace function public.ranked_ganho(elo int)
returns int language sql immutable as $$
  select (array[40, 35, 30, 25, 20, 15, 13, 10])[
    public.ranked_patamar(public.ranked_divisao(elo)) + 1
  ];
$$;

/** Elo perdido por uma derrota com esse elo. Aumenta conforme o patamar sobe. */
create or replace function public.ranked_perda(elo int)
returns int language sql immutable as $$
  select (array[10, 12, 15, 18, 20, 22, 25, 30])[
    public.ranked_patamar(public.ranked_divisao(elo)) + 1
  ];
$$;

/*
 * `ranked_piso` nao muda de formula (patamar x 300), mas o comentario sim: e
 * ela que torna o Elite permanente, agora que o Elite e um patamar.
 */
create or replace function public.ranked_piso(elo int)
returns int language sql immutable as $$
  select public.ranked_patamar(public.ranked_divisao(elo)) * 300;
$$;

-- ---------------------------------------------------------------------------
-- 2. O bot do Elite
--
-- Mesma logica de dificuldade dos demais: um perfil por patamar, escolhido
-- pelo patamar de quem esta jogando. O do Elite e o mais duro da escada.
-- ---------------------------------------------------------------------------

create or replace function public.ranked_bot(patamar int)
returns table (nome text, acerto numeric, ms_min int, ms_max int)
language sql
immutable
as $$
  select (array['Bit', 'Loop', 'Nullptr', 'Kernel', 'Daemon', 'Overflow', 'Root', 'Singleton'])[p + 1],
         (array[0.45, 0.55, 0.65, 0.72, 0.80, 0.88, 0.94, 0.97]::numeric[])[p + 1],
         (array[5000, 4500, 4000, 3500, 3000, 2500, 1800, 1400])[p + 1],
         (array[14000, 12000, 11000, 9500, 8000, 6500, 5000, 4200])[p + 1]
    from (select least(7, greatest(0, coalesce(patamar, 0))) as p) escolha;
$$;

-- ---------------------------------------------------------------------------
-- 3. Quantas vezes o jogador alcancou o patamar mais alto dele
--
-- CAMINHO ESCOLHIDO: contar, e nao guardar um contador.
--
-- `ranked_stats` ja guarda `pico_elo` de CADA temporada. Entao "quantas vezes
-- ele chegou ao patamar mais alto dele" e uma pergunta que os dados ja
-- respondem: e o numero de temporadas cujo pico caiu naquele patamar.
--
-- A alternativa seria uma coluna incrementada a cada novo recorde. Ela foi
-- descartada por tres motivos:
--
--   1. daria numero errado retroativamente - as temporadas ja jogadas nao
--      teriam sido contadas;
--   2. um contador guardado pode divergir do historico (uma correcao de elo,
--      um recalculo), e ai passam a existir duas verdades;
--   3. exigiria escrever em mais um lugar dentro de `ranked_aplicar_resultado`,
--      que e justamente a funcao onde menos se quer mexer.
--
-- Contar sai de graca: sao poucas linhas por usuario e o indice de
-- `ranked_stats` ja e por (season_numero, user_id).
-- ---------------------------------------------------------------------------

create or replace function public.ranked_topo(alvo uuid default auth.uid())
returns table (
  /** Maior patamar ja alcancado, em qualquer temporada (0 = Bronze). */
  patamar        int,
  /** Maior divisao ja alcancada (para escrever "Mestre 2"). */
  divisao        int,
  /** Maior elo ja alcancado, em qualquer temporada. */
  pico_elo       int,
  /** Em quantas temporadas o pico chegou a esse mesmo patamar. */
  vezes          int,
  /** Quantas temporadas o jogador chegou a disputar. */
  temporadas     int
)
language sql
stable
security definer
set search_path = public
as $$
  with picos as (
    select r.pico_elo,
           public.ranked_patamar(public.ranked_divisao(r.pico_elo)) as patamar
      from public.ranked_stats r
     where r.user_id = alvo and r.partidas > 0
  ),
  topo as (
    select coalesce(max(patamar), 0) as patamar, coalesce(max(pico_elo), 0) as pico_elo
      from picos
  )
  select topo.patamar,
         public.ranked_divisao(topo.pico_elo),
         topo.pico_elo,
         (select count(*)::int from picos where picos.patamar = topo.patamar),
         (select count(*)::int from picos)
    from topo;
$$;

grant execute on function public.ranked_topo(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Conferencia rapida (aparece no resultado do SQL Editor)
-- ---------------------------------------------------------------------------

select public.ranked_divisao(1800)  as mestre_1_divisao,   -- 18
       public.ranked_subnivel(18)   as mestre_1_subnivel,  -- 1
       public.ranked_subnivel(20)   as mestre_3_subnivel,  -- 3
       public.ranked_divisao(2100)  as elite_divisao,      -- 21
       public.ranked_subnivel(21)   as elite_subnivel,     -- 0 (sem sub-nivel)
       public.ranked_ganho(1800)    as mestre_ganho,       -- 13
       public.ranked_perda(1800)    as mestre_perda,       -- 25
       public.ranked_ganho(2100)    as elite_ganho,        -- 10
       public.ranked_perda(2100)    as elite_perda,        -- 30
       public.ranked_novo_elo(2100, 'derrota') as elite_no_piso; -- 2100
