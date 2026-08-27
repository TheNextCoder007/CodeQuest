/**
 * Testes das duas regras que so aparecem em partida ao vivo:
 *
 *   1. **Entrar na partida** (`deveEntrarNaPartida`) - quando o evento do
 *      Realtime deve levar a pessoa para a tela do duelo, e - o que importa
 *      mais - quando ele NAO deve. Navegacao automatica errada e pior do que
 *      navegacao automatica ausente: tira a pessoa de onde ela escolheu estar.
 *
 *   2. **Troca de aba** (`@/lib/pvp/ausencia`) - o limite de tempo fora, a
 *      contagem que leva ao abandono e o texto que explica os dois.
 *
 * Rodar com: npm run test:entrada
 */

import { deveEntrarNaPartida, JANELA_DE_ENTRADA_MS } from '../src/lib/pvp/entrada';
import {
  AUSENCIAS_PARA_ABANDONO,
  LIMITE_AUSENCIA_MS,
  ausenciaPunivel,
  avisoDeAusencia,
  ehAbandono,
} from '../src/lib/pvp/ausencia';
import { TEMPO_LIMITE_MS } from '../src/lib/pvp/regras';
import type { MudancaDePartida } from '../src/lib/presenca';

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

const EU = 'aaaaaaaa-0000-0000-0000-000000000001';
const OUTRO = 'bbbbbbbb-0000-0000-0000-000000000002';
const AGORA = Date.parse('2026-08-26T12:00:00.000Z');

const partida = (extra: Partial<MudancaDePartida> = {}): MudancaDePartida => ({
  id: 'partida-1',
  status: 'ativa',
  modo: 'amistoso',
  host_id: EU,
  guest_id: OUTRO,
  started_at: new Date(AGORA - 1_000).toISOString(),
  ...extra,
});

const decidir = (
  mudanca: MudancaDePartida | undefined,
  extra: { meuId?: string; caminho?: string | null; jaLevou?: Set<string> } = {},
) =>
  deveEntrarNaPartida(mudanca, {
    // `?? EU` nao serve: o teste precisa poder passar `undefined` de proposito.
    meuId: 'meuId' in extra ? extra.meuId : EU,
    caminho: extra.caminho ?? '/dashboard',
    jaLevou: extra.jaLevou ?? new Set<string>(),
    agora: AGORA,
  });

/* =========================================================================
 * 1. Quando DEVE entrar
 * ====================================================================== */
secao('a partida acabou de comecar: os dois lados entram');

ok(decidir(partida()) === true, 'quem convidou (host) e levado para a partida');
ok(
  decidir(partida({ host_id: OUTRO, guest_id: EU })) === true,
  'quem aceitou (guest) tambem',
);
ok(
  decidir(partida({ modo: 'ranqueado' })) === true,
  'vale para ranqueada tambem, nao so para o duelo entre amigos',
);

for (const tela of ['/dashboard', '/perfil', '/trilha/python', '/ranking', '/amigos', '/desafio']) {
  ok(decidir(partida(), { caminho: tela }) === true, `funciona estando em ${tela}`);
}

/* =========================================================================
 * 2. Quando NAO deve entrar - a parte que importa
 * ====================================================================== */
secao('nao sequestra a navegacao de quem nao pediu');

ok(decidir(undefined) === false, 'evento sem linha nao leva a lugar nenhum');
ok(decidir(partida(), { meuId: undefined }) === false, 'sem usuario logado, nao navega');

for (const status of ['convite', 'encerrada', 'cancelada', 'recusada']) {
  ok(decidir(partida({ status })) === false, `status "${status}" nao e comeco de partida`);
}

ok(
  decidir(partida({ host_id: OUTRO, guest_id: 'cccccccc-0000-0000-0000-000000000003' })) === false,
  'partida de outras duas pessoas nunca leva ninguem',
);

ok(
  decidir(partida(), { caminho: '/duelo' }) === false,
  'quem ja esta no duelo nao e reposicionado',
);
ok(
  decidir(partida({ id: 'outra' }), { caminho: '/duelo/' }) === false,
  'e nem por causa de uma partida DIFERENTE, o que seria pior',
);

ok(
  decidir(partida(), { jaLevou: new Set(['partida-1']) }) === false,
  'quem saiu da partida de proposito nao e arrastado de volta',
);

secao('partida velha nao arrasta ninguem');

ok(
  decidir(partida({ started_at: new Date(AGORA - JANELA_DE_ENTRADA_MS - 1).toISOString() })) ===
    false,
  'passou da janela: um evento qualquer daquela partida nao navega',
);
ok(
  decidir(partida({ started_at: new Date(AGORA - JANELA_DE_ENTRADA_MS + 1_000).toISOString() })) ===
    true,
  'dentro da janela ainda navega (rede lenta, aba escondida)',
);
ok(
  decidir(partida({ started_at: null })) === true,
  'sem `started_at` a janela nao pode decidir nada, e o resto das travas basta',
);

/* =========================================================================
 * 3. Troca de aba
 * ====================================================================== */
secao('limite de tempo fora da aba');

ok(LIMITE_AUSENCIA_MS < TEMPO_LIMITE_MS, 'o limite e menor que a propria pergunta');
ok(
  LIMITE_AUSENCIA_MS >= 3_000,
  'e nao e tao curto a ponto de punir uma notificacao que rouba o foco',
);

ok(ausenciaPunivel(LIMITE_AUSENCIA_MS - 1) === false, 'sumir por menos que o limite nao custa nada');
ok(ausenciaPunivel(LIMITE_AUSENCIA_MS) === true, 'exatamente no limite ja custa a pergunta');
ok(ausenciaPunivel(60_000) === true, 'sumir um minuto tambem, claro');

secao('a terceira vez encerra a partida');

ok(ehAbandono(1) === false, 'a primeira ausencia so custa a pergunta');
ok(ehAbandono(2) === false, 'a segunda tambem');
ok(ehAbandono(AUSENCIAS_PARA_ABANDONO) === true, `a ${AUSENCIAS_PARA_ABANDONO}a encerra`);
ok(ehAbandono(9) === true, 'e daí em diante continua encerrando');

secao('o aviso explica o que aconteceu e o que vem depois');

const primeiro = avisoDeAusencia(8_000, 1);
ok(/8s/.test(primeiro), 'diz quanto tempo a pessoa ficou fora');
ok(/valeu 0/.test(primeiro), 'diz que a pergunta foi perdida');
ok(/derrota/.test(primeiro), 'e avisa o que acontece se repetir');
ok(/Mais 2 vezes/.test(primeiro), 'com a contagem certa depois da primeira');

const segundo = avisoDeAusencia(8_000, 2);
ok(/Mais 1 vez/.test(segundo), 'e no singular quando falta so uma');

const ultimo = avisoDeAusencia(8_000, AUSENCIAS_PARA_ABANDONO);
ok(
  /encerrado como derrota/.test(ultimo) && !/Mais/.test(ultimo),
  'na ultima o aviso deixa de ameacar e passa a informar',
);

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
