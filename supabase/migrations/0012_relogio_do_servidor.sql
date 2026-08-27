-- ---------------------------------------------------------------------------
-- 0012 - A pergunta devolve tambem o "agora" do servidor
--
-- Rodar DEPOIS da 0011.
--
-- ---------------------------------------------------------------------------
-- O QUE DEU ERRADO NA 0011
--
-- A 0011 passou a devolver `comecou_em` (o carimbo da primeira entrega) e a
-- tela calculava o tempo restante assim:
--
--     restante = 20s - (Date.now() do NAVEGADOR - comecou_em do SERVIDOR)
--
-- Dois relogios diferentes na mesma subtracao. Enquanto eles concordam, o
-- resultado esta certo; quando o relogio do computador esta adiantado (coisa
-- comum num PC que nao sincroniza a hora), a conta da um numero maior do que
-- o real. Adiantado 20 segundos, a pergunta ja nascia com o tempo esgotado: a
-- tela mandava resposta em branco sozinha, e a partida inteira passava com 0
-- ponto sem a pessoa conseguir responder nada. No celular nao acontecia,
-- porque celular acerta a hora pela rede.
--
-- A CORRECAO
--
-- A funcao passa a devolver tambem o `agora` do servidor. Com os dois valores
-- vindos do MESMO relogio, a tela calcula o tempo ja decorrido sem envolver o
-- relogio do aparelho:
--
--     decorrido = agora - comecou_em          (so relogio do servidor)
--     restante  = 20s - decorrido
--
-- A diferenca entre os dois relogios deixa de importar - e, de quebra, um erro
-- de fuso ou de formato na leitura da data tambem some, porque afetaria os
-- dois carimbos igualmente e se cancela na subtracao.
-- ---------------------------------------------------------------------------

drop function if exists public.pvp_pergunta(uuid, int);

create function public.pvp_pergunta(m uuid, n int)
returns table (
  num          int,
  tipo         text,
  enunciado    text,
  alternativas jsonb,
  total        int,
  -- Quando ESTA pergunta foi entregue pela primeira vez. Reentregar (recarregar
  -- a pagina, sair da tela e voltar) nao muda este valor.
  comecou_em   timestamptz,
  -- O relogio do servidor no instante da resposta. So faz sentido junto com o
  -- de cima: e a dupla que permite medir o tempo sem consultar o aparelho.
  agora        timestamptz
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

  -- Primeira entrega carimba o inicio; reentregas NAO reiniciam o cronometro.
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

  -- `clock_timestamp()` e nao `now()`: `now()` congela no inicio da transacao,
  -- e aqui queremos a hora do instante da resposta.
  return query
    select n,
           questao.kind,
           questao.prompt,
           mostradas,
           partida.total_perguntas,
           inicio,
           clock_timestamp();
end;
$$;

grant execute on function public.pvp_pergunta(uuid, int) to authenticated;
