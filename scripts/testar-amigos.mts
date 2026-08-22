/**
 * Testa o fluxo de amizades no modo demonstracao (sem Supabase), simulando o
 * localStorage do navegador. Cobre: busca, pedido, aceite, recusa, remocao,
 * ranking filtrado e as regras do @username.
 */

// --- ambiente de navegador falso, antes de qualquer import do app ---------
class FakeStorage {
  private dados = new Map<string, string>();
  getItem(k: string) {
    return this.dados.has(k) ? this.dados.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.dados.set(k, v);
  }
  removeItem(k: string) {
    this.dados.delete(k);
  }
  clear() {
    this.dados.clear();
  }
}

(globalThis as any).window = { localStorage: new FakeStorage() };

const { localAuth, localState, emptyState } = await import('@/lib/local-store');
const friends = await import('@/lib/friends');
const username = await import('@/lib/username');

let falhas = 0;
const checar = (nome: string, condicao: boolean, detalhe?: unknown) => {
  if (condicao) {
    console.log('ok     ' + nome);
  } else {
    falhas += 1;
    console.log('FALHA  ' + nome + (detalhe === undefined ? '' : ' -> ' + JSON.stringify(detalhe)));
  }
};

/* ------------------------------------------------------------------ */
console.log('--- regras do @username ---');

checar('normaliza acentos e espacos', username.normalizeUsername('Davi Tarquínio') === 'davitarquinio');
checar('remove maiusculas e simbolos', username.normalizeUsername('João@Silva!') === 'joaosilva');
checar('rejeita curto demais', username.validateUsername('ab') !== null);
checar('rejeita espaco', username.validateUsername('davi 123') !== null);
checar('rejeita maiuscula', username.validateUsername('Davi123') !== null);
checar('aceita valido', username.validateUsername('davi_123') === null);
checar('aceita 20 caracteres', username.validateUsername('a'.repeat(20)) === null);
checar('rejeita 21 caracteres', username.validateUsername('a'.repeat(21)) !== null);
checar('sugere a partir do nome', username.suggestUsername('Kauan Arruda', null) === 'kauanarruda');
checar(
  'sugere a partir do email quando o nome nao serve',
  username.suggestUsername('!!', 'luiz.jr@escola.com') === 'luizjr',
);
checar('exibe com arroba', username.displayUsername('davi123') === '@davi123');
checar('exibe vazio quando nulo', username.displayUsername(null) === '');

/* ------------------------------------------------------------------ */
console.log('\n--- duas contas locais no mesmo dispositivo ---');

const eu = localAuth.signIn('davi@escola.com', 'Davi Tarquinio');
let meuEstado = localState.load(eu.id, eu.name);
meuEstado.profile.username = 'davi123';
meuEstado.profile.xp_total = 300;
meuEstado.profile.level = 4;
localState.save(eu.id, meuEstado);

const colega = localAuth.signIn('kauan@escola.com', 'Kauan Arruda');
let estadoColega = localState.load(colega.id, colega.name);
estadoColega.profile.username = 'kauan_a';
estadoColega.profile.xp_total = 900;
estadoColega.profile.level = 10;
localState.save(colega.id, estadoColega);

checar('username livre', await friends.isUsernameAvailable('novonome', eu.id));
checar('username ocupado por outro', !(await friends.isUsernameAvailable('kauan_a', eu.id)));
checar('o proprio username nao conta como ocupado', await friends.isUsernameAvailable('davi123', eu.id));

/* ------------------------------------------------------------------ */
console.log('\n--- pedido, aceite e listas ---');

let dados = await friends.fetchFriends(eu.id);
checar('convite de exemplo aparece como pedido recebido', dados.incoming.length === 1, dados.incoming);
checar('sem amigos no inicio', dados.friends.length === 0);

// busca
const busca = await friends.searchProfiles('kauan', eu.id, dados);
checar('busca encontra pelo username', busca.some((p) => p.username === 'kauan_a'), busca.map((p) => p.username));
checar(
  'busca marca relacao inexistente',
  busca.find((p) => p.username === 'kauan_a')?.relationship === 'none',
);
checar('busca com 1 caractere nao retorna nada', (await friends.searchProfiles('k', eu.id, dados)).length === 0);
checar(
  'busca aceita @ na frente',
  (await friends.searchProfiles('@kauan', eu.id, dados)).some((p) => p.username === 'kauan_a'),
);

// pedido para uma conta real (fica pendente)
await friends.sendFriendRequest(eu.id, colega.id, dados);
dados = await friends.fetchFriends(eu.id);
checar('pedido enviado fica em outgoing', dados.outgoing.some((p) => p.id === colega.id));
checar('ainda nao e amigo', dados.friends.length === 0);

const dadosColega = await friends.fetchFriends(colega.id);
checar('o colega ve o pedido como recebido', dadosColega.incoming.some((p) => p.id === eu.id));
checar('o colega nao ve como enviado', !dadosColega.outgoing.some((p) => p.id === eu.id));

// aceite pelo lado certo
await friends.acceptFriendRequest(colega.id, eu.id);
dados = await friends.fetchFriends(eu.id);
checar('apos aceitar, vira amizade', dados.friends.some((p) => p.id === colega.id));
checar('sai da lista de enviados', dados.outgoing.length === 0);
checar(
  'relacao passa a ser friends na busca',
  (await friends.searchProfiles('kauan', eu.id, dados)).find((p) => p.id === colega.id)?.relationship ===
    'friends',
);

/* ------------------------------------------------------------------ */
console.log('\n--- perfis de exemplo e ranking ---');

await friends.sendFriendRequest(eu.id, 'demo-ana', dados);
dados = await friends.fetchFriends(eu.id);
checar('perfil de exemplo aceita na hora', dados.friends.some((p) => p.id === 'demo-ana'));

const rankingAmigos = await friends.fetchFriendsLeaderboard(eu.id);
const idsRanking = rankingAmigos.map((l) => l.id);
checar('ranking de amigos inclui voce', idsRanking.includes(eu.id));
checar('ranking de amigos inclui o colega', idsRanking.includes(colega.id));
checar('ranking de amigos inclui a Ana', idsRanking.includes('demo-ana'));
checar('ranking de amigos NAO inclui quem nao e amigo', !idsRanking.includes('demo-kauan'), idsRanking);
checar(
  'ranking de amigos ordenado por XP',
  rankingAmigos.every((linha, i) => i === 0 || rankingAmigos[i - 1].xp_total >= linha.xp_total),
  rankingAmigos.map((l) => [l.name, l.xp_total]),
);

/* ------------------------------------------------------------------ */
console.log('\n--- recusar, remover e pedido cruzado ---');

// recusar o convite de exemplo do Luiz
await friends.removeFriendship(eu.id, 'demo-luiz');
dados = await friends.fetchFriends(eu.id);
checar('pedido recusado some', dados.incoming.length === 0);

// e nao volta no proximo carregamento (bug do "semeia sempre")
dados = await friends.fetchFriends(eu.id);
checar('pedido recusado nao reaparece', dados.incoming.length === 0, dados.incoming);

// desfazer amizade
await friends.removeFriendship(eu.id, colega.id);
dados = await friends.fetchFriends(eu.id);
checar('amizade desfeita some da lista', !dados.friends.some((p) => p.id === colega.id));
checar(
  'e some tambem do outro lado',
  !(await friends.fetchFriends(colega.id)).friends.some((p) => p.id === eu.id),
);

// pedido cruzado: se o outro ja me convidou, enviar aceita direto
await friends.sendFriendRequest(colega.id, eu.id, await friends.fetchFriends(colega.id));
dados = await friends.fetchFriends(eu.id);
checar('recebi um novo pedido', dados.incoming.some((p) => p.id === colega.id));

await friends.sendFriendRequest(eu.id, colega.id, dados);
dados = await friends.fetchFriends(eu.id);
checar('enviar para quem ja me convidou vira amizade direto', dados.friends.some((p) => p.id === colega.id));
checar('sem pendencias duplicadas', dados.incoming.length === 0 && dados.outgoing.length === 0);

// nao dá para adicionar a si mesmo
let erroProprio = false;
try {
  await friends.sendFriendRequest(eu.id, eu.id, dados);
} catch {
  erroProprio = true;
}
checar('bloqueia adicionar a si mesmo', erroProprio);

checar(
  'a busca marca voce mesmo como self',
  (await friends.searchProfiles('davi', eu.id, dados)).find((p) => p.id === eu.id)?.relationship === 'self',
);

console.log(falhas === 0 ? '\nTODOS OS TESTES PASSARAM' : `\n${falhas} FALHA(S)`);
process.exit(falhas ? 1 : 0);

void emptyState;
