-- ---------------------------------------------------------------------------
-- 0013 - Empate 0 a 0 nao vale a medalha de empate
--
-- Rodar DEPOIS da 0012.
--
-- ---------------------------------------------------------------------------
-- O PROBLEMA
--
-- "Empate tecnico" foi criada como a medalha mais rara do jogo: exige placar
-- identico ate o bonus de velocidade, que e contado em milesimos de segundo.
-- Duas pessoas acertarem o mesmo tanto E gastarem o mesmo tempo praticamente
-- nao acontece.
--
-- So que ha um empate que acontece o tempo todo: 0 a 0. Basta errar tudo (ou
-- deixar as cinco perguntas estourarem) dos dois lados. Contra o bot da
-- ranqueada da para conseguir de proposito em menos de dois minutos, sem
-- responder nada. A medalha mais rara do jogo era, na pratica, a mais facil.
--
-- A REGRA NOVA
--
-- Empate so vale medalha se ALGUEM pontuou. `pontos_host > 0` basta como
-- teste: num empate os dois placares sao iguais por definicao, entao o do
-- anfitriao ja diz se a partida teve placar ou nao.
--
-- ---------------------------------------------------------------------------
-- POR QUE CONTAR O HISTORICO EM VEZ DE LER O CONTADOR
--
-- `pvp_stats.empates` e `ranked_stats.empates` sao somadores: eles guardam
-- quantos empates houve, nunca com que placar. Nao da para descontar o 0 a 0
-- de um numero que ja foi somado.
--
-- Entao a conta passa a sair de `matches`, que guarda o placar de cada partida
-- ate hoje. Isso tem tres consequencias boas:
--
--   * vale retroativo sem migracao de dados - o historico ja esta la;
--   * os contadores continuam contando TODOS os empates, que e o certo para
--     o cartel do perfil (0 a 0 e um empate, so nao e um feito);
--   * se um dia a regra mudar de novo, muda so esta funcao.
-- ---------------------------------------------------------------------------

create or replace function public.conquistas_empates(jogador uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
    from public.matches m
   where m.status = 'encerrada'
     and (m.host_id = jogador or m.guest_id = jogador)
     -- O empate que vale: alguem pontuou.
     and m.pontos_host > 0
     and coalesce(
           m.desfecho_host,
           -- `desfecho_host` so existe a partir da 0006. Antes dela toda
           -- partida era amistosa, e ai `winner_id` nulo ja quer dizer empate
           -- (na ranqueada nao quer: contra bot ele e sempre nulo, e quem
           -- guarda a verdade e o proprio `desfecho_host`).
           case when m.winner_id is null then 'empate' else 'vitoria' end
         ) = 'empate';
$$;

/**
 * O mesmo numero, para a propria pessoa.
 *
 * A tela avalia as conquistas no aparelho, no instante do feito, e para isso
 * precisa do numero certo - se ela usasse o contador de empates, concederia a
 * medalha por um 0 a 0 e a reavaliacao do servidor nao tiraria (ela so
 * concede). Esta funcao e o que a tela consulta.
 *
 * Sem argumento de proposito: ninguem pede o numero de outra pessoa.
 */
create or replace function public.conquistas_empates_meus()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select public.conquistas_empates(auth.uid());
$$;

grant execute on function public.conquistas_empates_meus() to authenticated;

-- ---------------------------------------------------------------------------
-- Quem ganhou a medalha pela regra antiga
--
-- `conquistas_reavaliar` so CONCEDE - de proposito, porque quase todo criterio
-- e "ja fez alguma vez" e o banco nem sempre guarda o historico inteiro (o
-- streak, por exemplo, so tem o valor corrente: reavaliar tirando medalha
-- puniria quem so deixou a sequencia morrer).
--
-- Aqui e diferente, e por isso a remocao e feita a mao e SO para este
-- criterio: o historico de partidas esta completo em `matches`, entao da para
-- afirmar com certeza quem nunca empatou com placar. Quem tirou a medalha de
-- um 0 a 0 a perde; quem empatou de verdade nem percebe.
-- ---------------------------------------------------------------------------

delete from public.user_achievements ua
 using public.achievements a
 where a.id = ua.achievement_id
   and a.criteria ->> 'kind' = 'pvp_draws'
   and public.conquistas_empates(ua.user_id)
       < coalesce((a.criteria ->> 'count')::int, 1);
