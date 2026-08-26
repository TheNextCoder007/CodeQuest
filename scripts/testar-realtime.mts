/**
 * Testes do Realtime: dois assinantes nao podem brigar pelo mesmo canal.
 *
 * ---------------------------------------------------------------------------
 * O BUG QUE ISTO FECHA
 *
 * A aba Amigos passou a cair com "Application error: a client-side exception"
 * assim que ganhou um segundo assinante de `matches`.
 *
 * A causa esta em duas regras do `@supabase/realtime-js` que se combinam mal:
 *
 *   1. `supabase.channel(topico)` NAO cria um canal novo se o topico ja
 *      existe - devolve o mesmo objeto (ver `RealtimeClient.channel`);
 *   2. `canal.on('postgres_changes', ...)` LANCA EXCECAO se o canal ja passou
 *      por `subscribe()`.
 *
 * Como o `AvisoDeConvite` fica montado no AppShell em todas as telas, o topico
 * `partidas-<meuId>` ja estava assinado. A aba Amigos pedia o mesmo topico,
 * recebia aquele canal e tentava registrar o ouvinte - excecao durante o
 * efeito, e o React derruba a arvore inteira.
 *
 * Nao e preciso rede para reproduzir: `subscribe()` marca o canal como
 * "entrando" na hora, antes de qualquer resposta do servidor.
 *
 * Rodar com: npm run test:realtime
 */

import { createClient } from '@supabase/supabase-js';
import { topicoDePartidas, topicoDeRespostas } from '../src/lib/presenca';

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

// Nenhuma requisicao sai daqui: o erro acontece no cliente, antes da rede.
const supabase = createClient('https://exemplo.supabase.co', 'chave-de-teste');

const escutar = (topico: string) =>
  supabase.channel(topico).on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'matches', filter: 'guest_id=eq.abc' },
    () => {},
  );

/* =========================================================================
 * 1. O comportamento da biblioteca que causou o problema
 * ====================================================================== */
secao('a biblioteca devolve o MESMO canal para o mesmo topico');

const primeiro = supabase.channel('mesmo-topico');
const segundo = supabase.channel('mesmo-topico');
ok(primeiro === segundo, 'channel() com topico repetido devolve o mesmo objeto');

const outro = supabase.channel('topico-diferente');
ok(primeiro !== outro, 'e topicos diferentes dao objetos diferentes');

secao('registrar ouvinte depois de subscribe() lanca excecao');

escutar('ja-assinado').subscribe();

let lancou: string | null = null;
try {
  escutar('ja-assinado');
} catch (falha) {
  lancou = falha instanceof Error ? falha.message : String(falha);
}
ok(lancou !== null, 'o segundo assinante do MESMO topico realmente quebra');
ok(
  lancou !== null && /after `subscribe\(\)`/.test(lancou),
  `e a mensagem e a esperada (${lancou?.slice(0, 70)})`,
);

/* =========================================================================
 * 2. A correcao: cada assinante tem o proprio topico
 * ====================================================================== */
secao('cada assinante monta um topico proprio');

const MEU_ID = '11111111-1111-1111-1111-111111111111';

// `useId()` do React da algo como ":r0:" / ":r1:" - dois componentes montados
// nunca recebem o mesmo.
const doAppShell = topicoDePartidas(MEU_ID, ':r0:');
const daTelaAmigos = topicoDePartidas(MEU_ID, ':r1:');

ok(doAppShell !== daTelaAmigos, `dois assinantes com o mesmo usuario nao colidem`);
ok(doAppShell.includes(MEU_ID), 'o topico continua identificando o usuario');

// E o que importa: assinar os dois nao lanca mais.
let lancouDepois: string | null = null;
try {
  escutar(doAppShell).subscribe();
  escutar(daTelaAmigos).subscribe();
} catch (falha) {
  lancouDepois = falha instanceof Error ? falha.message : String(falha);
}
ok(lancouDepois === null, 'assinar os dois topicos ao mesmo tempo nao lanca excecao');

secao('o mesmo vale para o canal da partida');

const respostasA = topicoDeRespostas('partida-1', ':r0:');
const respostasB = topicoDeRespostas('partida-1', ':r1:');
ok(respostasA !== respostasB, 'dois assinantes da mesma partida nao colidem');
ok(respostasA.includes('partida-1'), 'e o topico continua identificando a partida');

/* =========================================================================
 * 3. Um mesmo componente, remontado, pode reusar o proprio topico
 * ====================================================================== */
secao('o topico e estavel para o mesmo componente');

ok(
  topicoDePartidas(MEU_ID, ':r0:') === doAppShell,
  'mesmo id de componente devolve sempre o mesmo topico (o efeito nao reassina a toa)',
);

console.log(`\n${passaram} passaram, ${falharam} falharam\n`);
console.log(falharam === 0 ? 'TODOS OS TESTES PASSARAM' : 'ALGUM TESTE FALHOU');
process.exit(falharam === 0 ? 0 : 1);
