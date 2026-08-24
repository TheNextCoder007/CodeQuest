/**
 * Testes do modo ranqueado, num PostgreSQL real (PGlite/WASM).
 *
 * Quatro coisas sao verificadas aqui:
 *
 *   1. **A paridade das regras.** A escada de patamares e a conta de elo
 *      existem em SQL (que manda) e em TypeScript (modo demonstracao e
 *      desenho da barra de progresso). As duas sao comparadas valor por
 *      valor; se alguem mexer numa e esquecer da outra, este teste quebra.
 *   2. **A temporada.** Os 15 dias, a virada automatica sem cron e o reset
 *      para Bronze 1 sem apagar o historico.
 *   3. **A partida ranqueada inteira**, jogada pelas mesmas funcoes que o
 *      aplicativo chama - inclusive as tentativas de escapar da derrota
 *      (cancelar a partida, abrir outra por cima, largar no meio).
 *   4. **O fechamento do banco.** Nenhuma tabela de elo aceita escrita
 *      direta; a unica porta sao as funcoes `security definer`.
 *
 * Rodar com: npm run test:ranqueado
 */

import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import {
  DIVISAO_MAXIMA,
  divisaoDoElo,
  ganhoDaVitoria,
  novoElo,
  patamarDaDivisao,
  perdaDaDerrota,
  pisoDoPatamar,
  subnivelDaDivisao,
  type ResultadoRanqueada,
} from '../src/lib/ranked/patamares';
import { BOTS_POR_PATAMAR } from '../src/lib/ranked/bots';

let passaram = 0;
let falharam = 0;

const ok = (condicao: boolean, titulo: string) => {
  if (condicao) {
    passaram += 1;
    console.log(`ok     ${titulo}`);
  } else {
    falharam += 1;
    console.error(`FALHOU ${titulo}`);
  }
};

const secao = (titulo: string) => console.log(`\n--- ${titulo} ---`);
const ler = (caminho: string) => readFileSync(caminho, 'utf8');

const BASE_SUPABASE = `
  create schema if not exists auth;
  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  end $$;
  create table if not exists auth.users (
    id uuid primary key default gen_random_uuid(),
    email text,
    raw_user_meta_data jsonb not null default '{}'::jsonb
  );
  create or replace function auth.uid() returns uuid
    language sql stable
    as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
`;

const JOGADOR = '11111111-1111-1111-1111-111111111111';
const OUTRO = '22222222-2222-2222-2222-222222222222';

const db = await PGlite.create();
await db.exec(BASE_SUPABASE);
for (const arquivo of [
  'supabase/migrations/0001_init.sql',
  'supabase/migrations/0002_amigos.sql',
  'supabase/migrations/0003_protecao_progresso.sql',
  'supabase/migrations/0004_perfis_publicos.sql',
  'supabase/migrations/0005_pvp.sql',
  'supabase/migrations/0006_ranqueado.sql',
  'supabase/seed.sql',
]) {
  await db.exec(ler(arquivo));
}

const como = async (id: string | null) => {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
};

const criarConta = async (id: string, nome: string, username: string) => {
  await db.query(
    `insert into auth.users (id, email, raw_user_meta_data)
     values ($1, $2, jsonb_build_object('name', $3::text))`,
    [id, `${username}@codequest.dev`, nome],
  );
  await db.query('update public.profiles set username = $2 where id = $1', [id, username]);
};

const erroDe = async (fn: () => Promise<unknown>): Promise<string | null> => {
  try {
    await fn();
    return null;
  } catch (falha) {
    return falha instanceof Error ? falha.message : String(falha);
  }
};

const um = async <T,>(sql: string, params: unknown[] = []): Promise<T> =>
  (await db.query<T>(sql, params)).rows[0];

/* =========================================================================
 * 1. Paridade entre o SQL e o TypeScript
 * ====================================================================== */
secao('paridade da escada (SQL x TypeScript)');

// Cobre as bordas de cada divisao e de cada patamar, mais valores acima do
// teto (o elo continua subindo depois de Mestre 3; a divisao trava).
const ELOS = [
  0, 1, 39, 40, 99, 100, 101, 250, 299, 300, 301, 599, 600, 899, 900, 1199, 1200, 1499, 1500,
  1799, 1800, 1999, 2000, 2001, 2500, 5000,
];

let divergencias = 0;
for (const elo of ELOS) {
  const linha = await um<{
    divisao: number;
    patamar: number;
    subnivel: number;
    ganho: number;
    perda: number;
    piso: number;
  }>(
    `select public.ranked_divisao($1)::int as divisao,
            public.ranked_patamar(public.ranked_divisao($1))::int as patamar,
            public.ranked_subnivel(public.ranked_divisao($1))::int as subnivel,
            public.ranked_ganho($1)::int as ganho,
            public.ranked_perda($1)::int as perda,
            public.ranked_piso($1)::int as piso`,
    [elo],
  );

  const esperado = {
    divisao: divisaoDoElo(elo),
    patamar: patamarDaDivisao(divisaoDoElo(elo)),
    subnivel: subnivelDaDivisao(divisaoDoElo(elo)),
    ganho: ganhoDaVitoria(elo),
    perda: perdaDaDerrota(elo),
    piso: pisoDoPatamar(elo),
  };

  for (const chave of Object.keys(esperado) as (keyof typeof esperado)[]) {
    if (linha[chave] !== esperado[chave]) {
      divergencias += 1;
      console.error(
        `       elo ${elo}: ${chave} SQL=${linha[chave]} TS=${esperado[chave]}`,
      );
    }
  }
}
ok(divergencias === 0, `divisao, patamar, sub-nivel, ganho, perda e piso batem em ${ELOS.length} elos`);

let divergenciasElo = 0;
for (const elo of ELOS) {
  for (const resultado of ['vitoria', 'derrota', 'empate'] as ResultadoRanqueada[]) {
    const linha = await um<{ novo: number }>(
      'select public.ranked_novo_elo($1, $2::text)::int as novo',
      [elo, resultado],
    );
    if (linha.novo !== novoElo(elo, resultado)) {
      divergenciasElo += 1;
      console.error(
        `       elo ${elo} ${resultado}: SQL=${linha.novo} TS=${novoElo(elo, resultado)}`,
      );
    }
  }
}
ok(divergenciasElo === 0, `o elo depois da partida bate em ${ELOS.length * 3} combinacoes`);

secao('a curva de progressao');
{
  const ganhos = await db.query<{ ganho: number }>(
    `select public.ranked_ganho(g * 300)::int as ganho from generate_series(0, 6) g`,
  );
  const lista = ganhos.rows.map((linha) => linha.ganho);
  ok(
    lista.every((valor, i) => i === 0 || valor < lista[i - 1]),
    `o ganho por vitoria diminui a cada patamar (${lista.join(' > ')})`,
  );

  const perdas = await db.query<{ perda: number }>(
    `select public.ranked_perda(g * 300)::int as perda from generate_series(0, 6) g`,
  );
  const listaPerdas = perdas.rows.map((linha) => linha.perda);
  ok(
    listaPerdas.every((valor, i) => i === 0 || valor > listaPerdas[i - 1]),
    `e a perda por derrota aumenta (${listaPerdas.join(' < ')})`,
  );

  ok(divisaoDoElo(2100) === DIVISAO_MAXIMA, 'Mestre 3 e a divisao 20 (7 patamares x 3)');
  const acimaDoTeto = await um<{ divisao: number }>(
    'select public.ranked_divisao(99999)::int as divisao',
  );
  ok(acimaDoTeto.divisao === DIVISAO_MAXIMA, 'elo acima do teto continua em Mestre 3');
}

secao('paridade dos bots');
{
  let diferentes = 0;
  for (let patamar = 0; patamar < BOTS_POR_PATAMAR.length; patamar += 1) {
    const linha = await um<{ nome: string; acerto: string; ms_min: number; ms_max: number }>(
      'select * from public.ranked_bot($1)',
      [patamar],
    );
    const esperado = BOTS_POR_PATAMAR[patamar];
    if (
      linha.nome !== esperado.nome ||
      Number(linha.acerto) !== esperado.acerto ||
      linha.ms_min !== esperado.msMin ||
      linha.ms_max !== esperado.msMax
    ) {
      diferentes += 1;
      console.error(`       patamar ${patamar}: SQL=${JSON.stringify(linha)}`);
    }
  }
  ok(diferentes === 0, `os 7 bots sao iguais em SQL e TypeScript`);

  const curva = await db.query<{ acerto: string; ms_max: number }>(
    `select b.acerto, b.ms_max from generate_series(0, 6) g, lateral public.ranked_bot(g) b`,
  );
  const acertos = curva.rows.map((linha) => Number(linha.acerto));
  ok(
    acertos.every((valor, i) => i === 0 || valor > acertos[i - 1]),
    `o bot acerta mais a cada patamar (${acertos.map((a) => `${Math.round(a * 100)}%`).join(' < ')})`,
  );
  const lentidao = curva.rows.map((linha) => linha.ms_max);
  ok(
    lentidao.every((valor, i) => i === 0 || valor < lentidao[i - 1]),
    'e responde mais rapido a cada patamar',
  );
}

/* =========================================================================
 * 2. Temporadas
 * ====================================================================== */
secao('temporada');
await criarConta(JOGADOR, 'Jogador', 'jogador');
await criarConta(OUTRO, 'Outro', 'outro');
await como(JOGADOR);

const primeira = await um<{ numero: number; comeca_em: string; termina_em: string }>(
  'select * from public.ranked_temporada_atual()',
);
ok(primeira.numero === 1, 'a primeira temporada e criada na primeira visita');

const duracao = await um<{ dias: number }>(
  `select extract(day from (termina_em - comeca_em))::int as dias
     from public.seasons where numero = 1`,
);
ok(duracao.dias === 15, `a temporada dura 15 dias (${duracao.dias})`);

const denovo = await um<{ numero: number }>('select * from public.ranked_temporada_atual()');
ok(denovo.numero === 1, 'chamar de novo no mesmo dia nao cria temporada nova');

/* =========================================================================
 * 3. Uma partida ranqueada inteira
 * ====================================================================== */
secao('partida ranqueada');

const partida = (
  await um<{ ranked_iniciar: string }>("select public.ranked_iniciar('python') as ranked_iniciar")
).ranked_iniciar;
ok(Boolean(partida), 'a partida comeca sem precisar de convite');

const linhaPartida = await um<{
  modo: string;
  status: string;
  guest_id: string | null;
  bot_nome: string;
  bot_acerto: string;
  season_numero: number;
}>('select modo, status, guest_id, bot_nome, bot_acerto, season_numero from public.matches where id = $1', [
  partida,
]);
ok(linhaPartida.modo === 'ranqueado', 'a partida nasce marcada como ranqueada');
ok(linhaPartida.status === 'ativa', 'e ja comeca ativa');
ok(linhaPartida.guest_id === null, 'sem `guest_id`: o adversario e um bot');
ok(linhaPartida.bot_nome === 'Bit', `o bot e o do Bronze (${linhaPartida.bot_nome})`);
ok(linhaPartida.season_numero === 1, 'a partida fica presa a temporada atual');

const perguntasDaPartida = await um<{ n: number; temas: number }>(
  `select count(*)::int as n, count(distinct q.language_slug)::int as temas
     from public.match_questions mq
     join public.pvp_questions q on q.id = mq.question_id
    where mq.match_id = $1`,
  [partida],
);
ok(perguntasDaPartida.n === 5, 'sorteou 5 perguntas');
ok(perguntasDaPartida.temas === 1, 'todas do tema escolhido');

const estadoInicial = await um<{ modo: string; adversario: string; meu_desfecho: string | null }>(
  'select * from public.pvp_estado($1)',
  [partida],
);
ok(estadoInicial.modo === 'ranqueado', '`pvp_estado` avisa que a partida e ranqueada');
ok(estadoInicial.adversario === 'Bit', 'e diz o nome do adversario');
ok(estadoInicial.meu_desfecho === null, 'sem desfecho enquanto a partida corre');

/** Responde a pergunta `n` da partida `m` com o gabarito (ou errado). */
const responder = async (m: string, n: number, acertando: boolean) => {
  await db.query('select * from public.pvp_pergunta($1, $2)', [m, n]);
  const gabarito = await um<{ answer: string }>(
    `select q.answer from public.match_questions mq
       join public.pvp_questions q on q.id = mq.question_id
      where mq.match_id = $1 and mq.ordem = $2`,
    [m, n],
  );
  await db.query('select * from public.pvp_responder($1, $2, $3::text)', [
    m,
    n,
    acertando ? gabarito.answer : 'resposta claramente errada',
  ]);
};

await responder(partida, 1, true);
const botDepoisDeUma = await um<{ n: number }>(
  'select count(*)::int as n from public.match_bot_answers where match_id = $1',
  [partida],
);
ok(botDepoisDeUma.n === 1, 'o bot responde a mesma pergunta na hora em que o humano responde');

const naoTerminou = await um<{ status: string }>('select * from public.pvp_finalizar($1)', [partida]);
ok(naoTerminou.status === 'ativa', 'finalizar no meio da partida nao encerra nada');

for (let n = 2; n <= 5; n += 1) await responder(partida, n, true);

const jogadasDoBot = await db.query<{ pontos: number; ms: number; correta: boolean }>(
  'select pontos, ms, correta from public.match_bot_answers where match_id = $1 order by ordem',
  [partida],
);
ok(jogadasDoBot.rows.length === 5, 'o bot jogou as 5 perguntas');
ok(
  jogadasDoBot.rows.every((linha) => linha.ms >= 5000 && linha.ms <= 14000),
  'e respondeu dentro da faixa de tempo do bot de Bronze',
);
ok(
  jogadasDoBot.rows.every((linha) => (linha.correta ? linha.pontos > 0 : linha.pontos === 0)),
  'as jogadas do bot sao pontuadas pela mesma regra do humano',
);

const fim = await um<{ status: string; winner_id: string; pontos_host: number; pontos_guest: number }>(
  'select * from public.pvp_finalizar($1)',
  [partida],
);
ok(fim.status === 'encerrada', 'com os dois lados prontos, a partida encerra');
ok(fim.winner_id === JOGADOR, 'quem acertou tudo venceu');
ok(
  fim.pontos_host > fim.pontos_guest,
  `o placar bate (${fim.pontos_host} x ${fim.pontos_guest})`,
);

const somaReal = await um<{ soma: number }>(
  'select coalesce(sum(pontos),0)::int as soma from public.match_answers where match_id = $1 and user_id = $2',
  [partida, JOGADOR],
);
ok(
  somaReal.soma === fim.pontos_host,
  'o placar gravado e a soma real das respostas (nada veio do cliente)',
);

secao('elo');
const resultado = await um<{
  elo_antes: number;
  elo_depois: number;
  delta: number;
  adversario: string;
}>('select * from public.ranked_resultado($1)', [partida]);
ok(resultado.elo_antes === 0, 'todo mundo comeca a temporada com 0 de elo');
ok(resultado.delta === 40, `a vitoria no Bronze rendeu +40 (${resultado.delta})`);
ok(resultado.adversario === 'Bit', 'a tela de resultado sabe contra quem foi');

const estadoAposVitoria = await um<{ elo: number; divisao: number; vitorias: number; partidas: number }>(
  'select * from public.ranked_estado()',
);
ok(estadoAposVitoria.elo === 40, 'o elo foi gravado');
ok(estadoAposVitoria.vitorias === 1 && estadoAposVitoria.partidas === 1, 'o cartel foi contado');

const finalizarDeNovo = await um<{ status: string }>('select * from public.pvp_finalizar($1)', [
  partida,
]);
ok(finalizarDeNovo.status === 'encerrada', 'finalizar de novo nao quebra nada');
const eloDepoisDeRefinalizar = await um<{ elo: number }>('select * from public.ranked_estado()');
ok(eloDepoisDeRefinalizar.elo === 40, 'e NAO aplica o elo duas vezes');

secao('ranqueada nao infla o cartel de duelos com amigos');
const semPvpStats = await um<{ n: number }>(
  'select count(*)::int as n from public.pvp_stats where user_id = $1',
  [JOGADOR],
);
ok(
  semPvpStats.n === 0,
  'vencer o bot nao conta em `pvp_stats` (senao as tags de 1v1 virariam farm)',
);

/* =========================================================================
 * 4. Tentativas de escapar da derrota
 * ====================================================================== */
secao('nao da para fugir da partida');

const segunda = (
  await um<{ ranked_iniciar: string }>("select public.ranked_iniciar('todas') as ranked_iniciar")
).ranked_iniciar;

const cancelando = await erroDe(() => db.query('select public.pvp_cancelar($1)', [segunda]));
ok(
  cancelando !== null && /ranqueada/i.test(cancelando),
  'partida ranqueada nao pode ser cancelada',
);

const mesmaPartida = await um<{ ranked_iniciar: string }>(
  "select public.ranked_iniciar('todas') as ranked_iniciar",
);
ok(
  mesmaPartida.ranked_iniciar === segunda,
  'pedir outra partida com uma em andamento devolve a mesma (nao da para trocar de pergunta)',
);

// Abandona no meio, ganhando: responde 2 certas e some.
await responder(segunda, 1, true);
await responder(segunda, 2, true);
await db.query(
  "update public.matches set started_at = now() - interval '6 minutes' where id = $1",
  [segunda],
);

const terceira = (
  await um<{ ranked_iniciar: string }>("select public.ranked_iniciar('todas') as ranked_iniciar")
).ranked_iniciar;
ok(terceira !== segunda, 'passados os 5 minutos, a partida velha sai da frente');

const abandonada = await um<{ status: string; desfecho_host: string }>(
  'select status, desfecho_host from public.matches where id = $1',
  [segunda],
);
ok(abandonada.status === 'encerrada', 'a partida abandonada foi encerrada');

const botCompletou = await um<{ n: number }>(
  'select count(*)::int as n from public.match_bot_answers where match_id = $1',
  [segunda],
);
ok(
  botCompletou.n === 5,
  'o bot completou as respostas dele (largar na frente nao vira vitoria de graca)',
);

/* =========================================================================
 * 5. A escada, subindo e caindo
 *
 * Aqui usamos a funcao de elo direto, e nao partidas inteiras: o que esta
 * sendo testado e a regra, e uma partida de verdade tem sorteio no meio.
 * ====================================================================== */
secao('subir e cair de patamar');

const eloDe = async (jogador: string): Promise<number> =>
  (
    await um<{ elo: number }>(
      'select elo from public.ranked_stats where season_numero = 1 and user_id = $1',
      [jogador],
    )
  ).elo;

const aplicar = async (jogador: string, resultado: ResultadoRanqueada) => {
  await db.query('select * from public.ranked_aplicar_resultado($1, $2::text, 1)', [
    jogador,
    resultado,
  ]);
};

await db.query('update public.ranked_stats set elo = 0, pico_elo = 0 where user_id = $1', [OUTRO]);
await db.query(
  'insert into public.ranked_stats (season_numero, user_id) values (1, $1) on conflict do nothing',
  [OUTRO],
);

// 3 vitorias no Bronze (40 cada) passam de Bronze 1 para Bronze 2.
for (let i = 0; i < 3; i += 1) await aplicar(OUTRO, 'vitoria');
const bronze2 = await um<{ divisao: number; elo: number }>('select * from public.ranked_estado($1)', [
  OUTRO,
]);
ok(bronze2.elo === 120 && bronze2.divisao === 1, '3 vitorias no Bronze levam a Bronze 2');

// Sobe ate Ouro para conferir o piso do patamar.
while ((await eloDe(OUTRO)) < 600) await aplicar(OUTRO, 'vitoria');
const chegouAoOuro = await um<{ divisao: number; elo: number }>(
  'select * from public.ranked_estado($1)',
  [OUTRO],
);
ok(chegouAoOuro.divisao === 6, `chegou ao Ouro 1 (divisao ${chegouAoOuro.divisao})`);

// Duas vitorias a mais para ficar ACIMA do piso do Ouro - senao nao ha de
// onde cair, e o teste do piso nao provaria nada.
await aplicar(OUTRO, 'vitoria');
await aplicar(OUTRO, 'vitoria');
const eloNoOuro = await eloDe(OUTRO);
ok(eloNoOuro > 600, `subiu acima do piso do Ouro (${eloNoOuro})`);

for (let i = 0; i < 30; i += 1) await aplicar(OUTRO, 'derrota');
const depoisDeApanhar = await um<{ divisao: number; elo: number }>(
  'select * from public.ranked_estado($1)',
  [OUTRO],
);
ok(
  depoisDeApanhar.elo === 600 && depoisDeApanhar.divisao === 6,
  `30 derrotas seguidas nao tiram ninguem do Ouro (parou em ${depoisDeApanhar.elo})`,
);
ok(
  depoisDeApanhar.elo === 600 && eloNoOuro > 600,
  'o piso e o inicio do PATAMAR (600), nao o inicio da divisao em que se estava',
);

const picoGuardado = await um<{ pico_elo: number; pico_divisao: number }>(
  'select * from public.ranked_estado($1)',
  [OUTRO],
);
ok(
  picoGuardado.pico_elo > depoisDeApanhar.elo,
  `o pico da temporada nao cai junto (${picoGuardado.pico_elo})`,
);

const empateNaoMexe = await eloDe(OUTRO);
await aplicar(OUTRO, 'empate');
ok((await eloDe(OUTRO)) === empateNaoMexe, 'empate nao mexe no elo');

/* =========================================================================
 * 6. Virada de temporada
 * ====================================================================== */
secao('virada de temporada');

const picoDaPrimeira = (
  await um<{ pico_elo: number }>('select * from public.ranked_estado($1)', [OUTRO])
).pico_elo;

// Empurra a temporada 1 para o passado, mas so por UM dia: assim a virada
// acontece exatamente uma vez e da para conferir o numero.
await db.query(
  `update public.seasons
      set comeca_em = now() - interval '16 days', termina_em = now() - interval '1 day'
    where numero = 1`,
);

const virou = await um<{ numero: number; comeca_em: string }>(
  'select * from public.ranked_temporada_atual()',
);
ok(virou.numero === 2, 'passado o prazo, a temporada seguinte e criada sozinha');

const encaixa = await um<{ encaixa: boolean }>(
  `select (select termina_em from public.seasons where numero = 1)
        = (select comeca_em from public.seasons where numero = 2) as encaixa`,
);
ok(encaixa.encaixa, 'a temporada 2 comeca exatamente onde a 1 terminou (sem buraco no calendario)');

await como(OUTRO);
const naTemporadaNova = await um<{
  season_numero: number;
  elo: number;
  divisao: number;
  pico_elo: number;
  pico_historico: number;
  partidas: number;
}>('select * from public.ranked_estado()');
ok(naTemporadaNova.season_numero === 2, 'a leitura ja aponta para a temporada nova');
ok(
  naTemporadaNova.elo === 0 && naTemporadaNova.divisao === 0,
  'todo mundo volta para Bronze 1 com 0 de elo',
);
ok(naTemporadaNova.partidas === 0, 'e o cartel da temporada recomeca zerado');
ok(naTemporadaNova.pico_elo === 0, 'o pico da temporada nova comeca do zero');
ok(
  naTemporadaNova.pico_historico === picoDaPrimeira,
  `mas o pico historico continua (${naTemporadaNova.pico_historico}) - e ele que sustenta as conquistas de patamar`,
);

const historico = await db.query<{ season_numero: number; pico_elo: number; pico_divisao: number }>(
  'select * from public.ranked_historico()',
);
ok(historico.rows.length === 1, 'a temporada 1 virou historico');
ok(
  historico.rows[0].season_numero === 1 && historico.rows[0].pico_elo === picoDaPrimeira,
  'com o patamar maximo que a pessoa alcancou nela',
);

const semTemporadaAtual = historico.rows.every((linha) => linha.season_numero < 2);
ok(semTemporadaAtual, 'a temporada em andamento nao aparece no historico');

// Nada foi apagado: as linhas antigas continuam la.
const linhasGuardadas = await um<{ n: number }>(
  'select count(*)::int as n from public.ranked_stats where user_id = $1',
  [OUTRO],
);
ok(linhasGuardadas.n >= 1, 'o reset nao apaga nada - a temporada nova e so uma linha nova');

// O app pode ficar meses parado (ferias da escola). Como nao existe cron no
// plano gratuito, a virada precisa pular varias temporadas de uma vez.
//
// Empurra as duas temporadas existentes 60 dias para tras, MANTENDO o encaixe
// entre elas - senao o buraco seria do teste, nao do codigo.
await db.query(
  `update public.seasons
      set comeca_em = comeca_em - interval '60 days',
          termina_em = termina_em - interval '60 days'`,
);

// A temporada 2 passa a terminar 61 dias atras. Faltam 3 temporadas inteiras
// (45 dias) para chegar perto de hoje, e mais uma para cobrir o resto: 3, 4, 5
// e 6. A corrente vira a 6.
const depoisDeFerias = await um<{ numero: number }>('select * from public.ranked_temporada_atual()');
ok(
  depoisDeFerias.numero === 6,
  `dois meses parado viram 4 temporadas de uma vez (chegou na ${depoisDeFerias.numero})`,
);

const calendarioInteiro = await um<{ buracos: number }>(
  `select count(*)::int as buracos
     from public.seasons a
     join public.seasons b on b.numero = a.numero + 1
    where b.comeca_em <> a.termina_em`,
);
ok(calendarioInteiro.buracos === 0, 'e o calendario continua sem buraco nenhum');

const cobreAgora = await um<{ cobre: boolean }>(
  `select (now() >= comeca_em and now() < termina_em) as cobre
     from public.seasons order by numero desc limit 1`,
);
ok(cobreAgora.cobre, 'a temporada corrente cobre o dia de hoje');

/* =========================================================================
 * 7. O banco esta fechado
 * ====================================================================== */
secao('nenhuma tabela de elo aceita escrita direta');

const rls = await db.query<{ tabela: string; ligado: boolean }>(
  `select relname as tabela, relrowsecurity as ligado
     from pg_class
    where relname in ('seasons', 'ranked_stats', 'ranked_match_results', 'match_bot_answers')
    order by relname`,
);
ok(rls.rows.length === 4, 'as quatro tabelas novas existem');
ok(
  rls.rows.every((linha) => linha.ligado),
  'e todas estao com Row Level Security ligado',
);

const policies = await db.query<{ tabela: string; cmd: string; n: number }>(
  `select tablename as tabela, cmd, count(*)::int as n
     from pg_policies
    where schemaname = 'public'
      and tablename in ('seasons', 'ranked_stats', 'ranked_match_results', 'match_bot_answers')
    group by 1, 2`,
);
const escrita = policies.rows.filter((linha) => linha.cmd !== 'SELECT');
ok(
  escrita.length === 0,
  'nao existe UMA policy de INSERT, UPDATE ou DELETE - so as funcoes escrevem elo',
);

const leitura = policies.rows.filter((linha) => linha.cmd === 'SELECT').map((l) => l.tabela);
ok(
  leitura.includes('seasons') && leitura.includes('ranked_stats'),
  'temporada e elo sao de leitura livre (aparecem no perfil publico)',
);
ok(
  !leitura.includes('match_bot_answers'),
  'as jogadas do bot NAO sao legiveis (revelariam o placar antes do fim)',
);
ok(
  !leitura.includes('ranked_match_results'),
  'o registro de elo por partida so sai por `ranked_resultado`',
);

const revogadas = await db.query<{ nome: string; publico: boolean }>(
  `select p.proname as nome,
          has_function_privilege('authenticated', p.oid, 'execute') as publico
     from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('ranked_aplicar_resultado', 'ranked_registrar', 'ranked_bot_jogar',
                        'ranked_bot_completar', 'ranked_iniciar', 'ranked_estado')`,
);
const fechadas = revogadas.rows.filter((linha) =>
  ['ranked_aplicar_resultado', 'ranked_registrar', 'ranked_bot_jogar', 'ranked_bot_completar'].includes(
    linha.nome,
  ),
);
ok(
  fechadas.length === 4 && fechadas.every((linha) => !linha.publico),
  'as funcoes que escrevem elo estao revogadas de `authenticated`',
);
const abertas = revogadas.rows.filter((linha) =>
  ['ranked_iniciar', 'ranked_estado'].includes(linha.nome),
);
ok(
  abertas.length === 2 && abertas.every((linha) => linha.publico),
  'e as que o aplicativo precisa continuam liberadas',
);

secao('ninguem mexe na partida dos outros');
await como(JOGADOR);
const partidaAlheia = await erroDe(() =>
  db.query('select * from public.ranked_resultado($1)', [partida]),
);
ok(partidaAlheia === null, 'o dono da partida le o proprio resultado');

await como(OUTRO);
const bisbilhotando = await erroDe(() => db.query('select * from public.pvp_estado($1)', [partida]));
ok(
  bisbilhotando !== null && /nao participa/i.test(bisbilhotando),
  'quem nao esta na partida nao consegue nem ver o estado',
);

await como(null);
const semLogin = await erroDe(() => db.query("select public.ranked_iniciar('todas')"));
ok(semLogin !== null, 'sem sessao nao da para comecar partida ranqueada');

console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
