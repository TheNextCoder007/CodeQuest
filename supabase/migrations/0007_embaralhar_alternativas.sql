-- ===========================================================================
-- CodeQuest - embaralhar as alternativas do duelo e da ranqueada
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de 0001 a 0006.
--
-- ---------------------------------------------------------------------------
-- O BUG
--
-- As alternativas eram entregues na ordem em que estavam gravadas, e o banco
-- de perguntas foi escrito com a resposta certa SEMPRE na primeira posicao
-- (49 de 49 perguntas). Resultado: dava para vencer um duelo inteiro clicando
-- na primeira opcao cinco vezes, sem ler nada.
--
-- ---------------------------------------------------------------------------
-- A CORRECAO, E POR QUE ELA FICA AQUI
--
-- O embaralhamento acontece dentro de `pvp_pergunta`, no servidor. Fazer isso
-- no cliente nao resolveria nada: bastaria abrir a aba de rede do navegador e
-- ler a resposta da API ANTES de o JavaScript embaralhar - a primeira da lista
-- continuaria sendo a certa.
--
-- A ordem sorteada e GRAVADA em `match_answers.alternativas`, uma linha por
-- (partida, jogador, pergunta). Duas consequencias:
--
--   1. cada exibicao tem a sua propria ordem. A mesma pergunta caindo em duas
--      partidas diferentes (ou para os dois jogadores da mesma partida) e
--      embaralhada de novo, independentemente;
--   2. recarregar a pagina no meio da pergunta devolve a MESMA ordem. Sem
--      isso, com o cronometro correndo, as alternativas dancariam embaixo do
--      dedo de quem esta respondendo.
--
-- ---------------------------------------------------------------------------
-- POR QUE A CORRECAO DA RESPOSTA NAO PRECISOU MUDAR
--
-- Porque ela nunca dependeu de posicao. O cliente envia o TEXTO da alternativa
-- escolhida, e `pvp_responder` compara esse texto com `pvp_questions.answer`
-- (ver `pvp_normalizar`). Nao existe "indice da resposta certa" guardado em
-- lugar nenhum, entao nao ha como uma exibicao se confundir com outra: as duas
-- comparam contra o mesmo gabarito, e a ordem em que as opcoes apareceram e
-- irrelevante para a conferencia.
--
-- Isso e verificado em `npm run test:pvp`: a mesma pergunta e respondida em
-- varias partidas, com ordens diferentes, e o resultado tem de bater sempre.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Onde a ordem daquela exibicao fica guardada
-- ---------------------------------------------------------------------------

alter table public.match_answers
  -- Ordem em que as alternativas foram mostradas NESTA exibicao. Fica nula em
  -- pergunta de completar (`fill_blank`), que nao tem alternativas.
  add column if not exists alternativas jsonb;

-- ---------------------------------------------------------------------------
-- 2. Entrega da pergunta, agora embaralhando
--
-- A assinatura e o retorno sao os mesmos da 0005 - so o corpo muda -, entao
-- `create or replace` basta e o cliente nao precisa saber de nada.
-- ---------------------------------------------------------------------------

-- A 0011 troca o TIPO DE RETORNO desta funcao (passa a devolver `comecou_em`).
-- `create or replace` nao consegue trocar tipo de retorno, entao reaplicar a
-- cadeia inteira quebraria aqui sem este `drop`.
drop function if exists public.pvp_pergunta(uuid, int);
create or replace function public.pvp_pergunta(m uuid, n int)
returns table (num int, tipo text, enunciado text, alternativas jsonb, total int)
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

  -- Primeira entrega carimba o inicio; reentregas (recarregou a pagina) NAO
  -- reiniciam o cronometro.
  insert into public.match_answers (match_id, user_id, ordem, started_at)
  values (m, eu, n, now())
  on conflict (match_id, user_id, ordem) do nothing;

  select a.alternativas into mostradas
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

  return query select n, questao.kind, questao.prompt, mostradas, partida.total_perguntas;
end;
$$;

grant execute on function public.pvp_pergunta(uuid, int) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Partidas que ja estavam abertas
--
-- Quem estava no meio de uma pergunta quando este arquivo rodou tem a linha
-- sem `alternativas`. Nao ha nada a fazer: a proxima chamada de
-- `pvp_pergunta` preenche sozinha. Fica registrado so para nao parecer
-- esquecimento.
-- ---------------------------------------------------------------------------
