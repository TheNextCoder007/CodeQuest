-- ---------------------------------------------------------------------------
-- 0011 - O cronometro e o abandono passam a ser contados pelo servidor
--
-- Rodar DEPOIS da 0010.
--
-- ---------------------------------------------------------------------------
-- OS DOIS PROBLEMAS
--
-- 1. **O relogio voltava cheio.** Sair da tela da partida e voltar mostrava os
--    20 segundos de novo. O placar nunca foi enganado - `pvp_pergunta` ja
--    carimbava `started_at` na PRIMEIRA entrega e nao reiniciava nas
--    seguintes, entao o servidor sempre soube quanto tempo tinha passado. Quem
--    mentia era so a tela, que reiniciava a contagem no `Date.now()` do
--    navegador. Resultado pior do que um bug de placar: a pessoa via 20 s,
--    respondia com calma, e levava 0 sem entender.
--
--    A funcao passa a devolver esse carimbo. Assim a tela mostra o tempo que
--    REALMENTE resta, e nao ha para onde o cliente escapar - ele nao escolhe o
--    numero, ele o recebe.
--
-- 2. **"Voce saiu da aba 3 vezes" aparecia em partida ganha.** A mensagem
--    saia de um contador que vivia no navegador. Contador de tela nao e
--    verdade: ele sobrevive entre partidas, some ao recarregar, e nao tem como
--    saber se o abandono chegou a ser aplicado. Agora a tela pergunta ao
--    banco: `abandonada_por` (coluna criada na 0010) passa a sair no
--    `pvp_estado`, e a mensagem so aparece quando o servidor diz que aquela
--    partida acabou por abandono - e que foi VOCE quem abandonou.
--
-- As duas funcoes mudam de assinatura, entao precisam de `drop` antes do
-- `create` - `create or replace` nao troca o tipo de retorno.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. A pergunta devolve quando o cronometro dela comecou
-- ---------------------------------------------------------------------------

drop function if exists public.pvp_pergunta(uuid, int);

/*
 * Esta e a versao da 0007 (que sorteia a ordem das alternativas UMA vez por
 * exibicao e guarda), com o carimbo de inicio no retorno. Reescrever a partir
 * da 0005 apagaria o embaralhamento - o teste `npm run test:pvp` pegou
 * exatamente isso, com a resposta certa voltando a cair sempre na primeira
 * posicao, 40 vezes em 40.
 */
create function public.pvp_pergunta(m uuid, n int)
returns table (
  num          int,
  tipo         text,
  enunciado    text,
  alternativas jsonb,
  total        int,
  -- Quando ESTA pergunta foi entregue pela primeira vez. E daqui que a tela
  -- calcula o tempo restante; recarregar a pagina nao muda este valor.
  comecou_em   timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  partida   public.matches;
  eu        uuid := auth.uid();
  qid       text;
  anterior  int;
  questao   public.pvp_questions;
  mostradas jsonb;
  inicio    timestamptz;
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
      from public.match_answers a
     where a.match_id = m and a.user_id = eu and a.ordem = n - 1 and a.answered_at is not null;
    if anterior = 0 then
      raise exception 'Responda a pergunta anterior primeiro';
    end if;
  end if;

  select mq.question_id into qid
    from public.match_questions mq
   where mq.match_id = m and mq.ordem = n;
  if qid is null then
    raise exception 'Pergunta nao encontrada';
  end if;

  select q.* into questao from public.pvp_questions q where q.id = qid;

  -- Primeira entrega carimba o inicio; reentregas (recarregou a pagina, trocou
  -- de tela e voltou) NAO reiniciam o cronometro.
  insert into public.match_answers (match_id, user_id, ordem, started_at)
  values (m, eu, n, now())
  on conflict (match_id, user_id, ordem) do nothing;

  select a.alternativas, a.started_at into mostradas, inicio
    from public.match_answers a
   where a.match_id = m and a.user_id = eu and a.ordem = n;

  -- Sorteia a ordem UMA vez por exibicao e guarda. Reentrega devolve a mesma
  -- ordem; outra partida (ou o outro jogador) sorteia a dela.
  if mostradas is null and questao.options is not null then
    select jsonb_agg(opcao order by random())
      into mostradas
      from jsonb_array_elements(questao.options) as opcao;

    update public.match_answers a
       set alternativas = mostradas
     where a.match_id = m and a.user_id = eu and a.ordem = n;
  end if;

  return query
    select n, questao.kind, questao.prompt, mostradas, partida.total_perguntas, inicio;
end;
$$;

grant execute on function public.pvp_pergunta(uuid, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. O estado da partida diz quem abandonou
-- ---------------------------------------------------------------------------

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
  guest_pontos       int,
  -- Quem largou a partida no meio, quando foi o caso. A tela de resultado usa
  -- isto (e nao um contador do navegador) para dizer "encerrada por abandono".
  abandonada_por     uuid
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
           end,
           partida.abandonada_por;
end;
$$;

grant execute on function public.pvp_estado(uuid) to authenticated;
