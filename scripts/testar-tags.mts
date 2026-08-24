/**
 * Testes das tags de perfil e das regras do @username.
 *
 * Rodar com: npm run test:tags
 */

import { readFileSync } from 'node:fs';
import { achievements } from '../src/content/achievements';
import { RARIDADES, SEGREDOS, tagById, tagDoSegredo, tags } from '../src/content/tags';
import { PALAVRAS_BLOQUEADAS, usernameProibido } from '../src/content/palavras-bloqueadas';
import { evaluateTags, tagPendenteDoSegredo, tagsComEstado, ESTILO_RARIDADE } from '../src/lib/tags';
import { achievementsWithStatus, evaluateAchievements } from '../src/lib/gamification';
import { languageLessonSequence } from '../src/content/index';
import { esperaRestanteMs, validateUsername } from '../src/lib/username';

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

/* -------------------------------------------------------------------------
 * Catalogo
 * ---------------------------------------------------------------------- */
secao('catalogo de tags');
{
  const ids = tags.map((tag) => tag.id);
  ok(new Set(ids).size === ids.length, 'nenhum id de tag repetido');
  ok(
    tags.every((tag) => RARIDADES.includes(tag.rarity)),
    'toda tag tem uma raridade valida',
  );
  ok(
    tags.every((tag) => Boolean(ESTILO_RARIDADE[tag.rarity])),
    'toda raridade tem estilo visual definido',
  );

  const porNivel = tags
    .filter((tag) => tag.criteria.kind === 'level')
    .sort((a, b) => (a.criteria as { level: number }).level - (b.criteria as { level: number }).level);

  ok(porNivel.length >= 5, `existem tags por nivel (${porNivel.length})`);
  ok(
    porNivel.every(
      (tag, indice) =>
        indice === 0 ||
        RARIDADES.indexOf(tag.rarity) >= RARIDADES.indexOf(porNivel[indice - 1].rarity),
    ),
    'a raridade das tags de nivel nunca desce conforme o nivel sobe',
  );

  const secretas = tags.filter((tag) => tag.secret);
  ok(secretas.length >= 3, `existem pelo menos 3 tags secretas (${secretas.length})`);
  ok(
    secretas.every((tag) => tag.criteria.kind === 'secret'),
    'toda tag secreta tem criterio do tipo secret',
  );

  ok(tagById('dev')?.rarity === 'dev', 'a tag de desenvolvedor tem raridade propria');
  ok(tagById('dev')?.criteria.kind === 'manual', 'a tag de desenvolvedor e concedida a mao');
}

/* -------------------------------------------------------------------------
 * Segredos documentados + conquista espelho
 * ---------------------------------------------------------------------- */
secao('segredos');
{
  const idsDosSegredos = Object.keys(SEGREDOS) as (keyof typeof SEGREDOS)[];

  idsDosSegredos.forEach((id) => {
    const tag = tagDoSegredo(id);
    ok(Boolean(tag), `o segredo "${id}" tem uma tag`);
    ok(
      SEGREDOS[id].comoDesbloquear.length > 30,
      `o segredo "${id}" documenta exatamente como desbloquear`,
    );

    const conquista = achievements.find(
      (item) => item.criteria.kind === 'secret' && item.criteria.segredo === id,
    );
    ok(Boolean(conquista), `o segredo "${id}" tem conquista correspondente`);
  });

  // A conquista secreta so aparece quando a tag ja foi desbloqueada.
  const tagCuriosa = tagDoSegredo('logo-10-cliques')!;
  const semTag = evaluateAchievements(
    { completedLessonIds: [], xpTotal: 0, streak: 0, unlockedTagIds: [] },
    [],
  );
  ok(
    !semTag.some((item) => item.id === 'segredo-curioso'),
    'a conquista secreta nao vem antes da tag',
  );

  const comTag = evaluateAchievements(
    { completedLessonIds: [], xpTotal: 0, streak: 0, unlockedTagIds: [tagCuriosa.id] },
    [],
  );
  ok(
    comTag.some((item) => item.id === 'segredo-curioso'),
    'a conquista secreta vem junto com a tag',
  );
}

/* -------------------------------------------------------------------------
 * Desbloqueio
 * ---------------------------------------------------------------------- */
secao('desbloqueio de tags');
{
  const nada = { level: 1, completedLessonIds: [], isDeveloper: false };
  ok(evaluateTags(nada, []).length === 0, 'conta nova nao tem tag nenhuma');

  const nivel5 = evaluateTags({ ...nada, level: 5 }, []);
  ok(nivel5.some((tag) => tag.id === 'nivel-05'), 'nivel 5 desbloqueia a primeira tag');
  ok(!nivel5.some((tag) => tag.id === 'nivel-10'), 'nivel 5 nao desbloqueia a de nivel 10');

  const nivel30 = evaluateTags({ ...nada, level: 30 }, []);
  ok(
    ['nivel-05', 'nivel-10', 'nivel-20', 'nivel-30'].every((id) =>
      nivel30.some((tag) => tag.id === id),
    ),
    'nivel 30 entrega todas as tags de nivel anteriores',
  );
  ok(!nivel30.some((tag) => tag.id === 'nivel-50'), 'mas nao a de nivel 50');

  const jaTinha = evaluateTags({ ...nada, level: 30 }, ['nivel-05', 'nivel-10']);
  ok(
    !jaTinha.some((tag) => ['nivel-05', 'nivel-10'].includes(tag.id)),
    'tag ja desbloqueada nao volta na lista',
  );

  const trilhaToda = languageLessonSequence('python').map((licao) => licao.id);
  const pythonista = evaluateTags({ ...nada, completedLessonIds: trilhaToda }, []);
  ok(
    pythonista.some((tag) => tag.id === 'pythonista'),
    'concluir a trilha de Python desbloqueia a tag Pythonista',
  );
  const quaseLa = evaluateTags({ ...nada, completedLessonIds: trilhaToda.slice(0, -1) }, []);
  ok(
    !quaseLa.some((tag) => tag.id === 'pythonista'),
    'faltando uma licao a tag Pythonista nao vem',
  );

  ok(
    !evaluateTags({ ...nada, level: 99 }, []).some((tag) => tag.secret),
    'tag secreta NUNCA sai por avaliacao (so pela acao)',
  );

  ok(
    !evaluateTags({ ...nada, level: 99 }, []).some((tag) => tag.id === 'dev'),
    'a tag de desenvolvedor nao sai sem o selo no banco',
  );
  ok(
    evaluateTags({ ...nada, isDeveloper: true }, []).some((tag) => tag.id === 'dev'),
    'com o selo no banco a tag de desenvolvedor aparece',
  );
}

secao('conquistas secretas na tela');
{
  const travadas = achievementsWithStatus([]);
  const secretas = travadas.filter((item) => item.secreta);
  ok(secretas.length >= 4, `as conquistas secretas aparecem mascaradas (${secretas.length})`);
  ok(
    secretas.every((item) => item.title === 'Conquista secreta'),
    'o titulo nao entrega o segredo',
  );
  ok(
    !travadas.some((item) => /meia-noite|logo|30 segundos/i.test(item.description) && !item.unlocked),
    'nenhuma descricao travada entrega como desbloquear',
  );

  const desbloqueada = achievementsWithStatus(['segredo-madrugada']).find(
    (item) => item.id === 'segredo-madrugada',
  );
  ok(desbloqueada?.title === 'Turno da madrugada', 'depois de conquistada, o nome real aparece');
  ok(desbloqueada?.secreta === false, 'e ela deixa de ser mascarada');

  const comum = travadas.find((item) => item.id === 'primeiro-desafio');
  ok(comum?.secreta === false, 'conquista normal travada continua visivel');
}

secao('registro de segredo');
{
  const tag = tagPendenteDoSegredo('madrugada', []);
  ok(tag?.id === 'secreta-madrugada', 'o segredo pendente devolve a tag certa');
  ok(
    tagPendenteDoSegredo('madrugada', ['secreta-madrugada']) === null,
    'segredo ja descoberto nao devolve nada (e idempotente)',
  );
}

secao('galeria do perfil');
{
  const semNada = tagsComEstado([], false);
  ok(
    semNada.every((tag) => !tag.unlocked),
    'nada aparece como desbloqueado numa conta nova',
  );
  ok(
    semNada.filter((tag) => tag.secret).every((tag) => tag.escondida),
    'as secretas aparecem mascaradas ate serem descobertas',
  );
  ok(
    !semNada.some((tag) => tag.id === 'dev'),
    'a tag de desenvolvedor nem aparece na galeria de quem nao tem o selo',
  );
  ok(
    tagsComEstado([], true).some((tag) => tag.id === 'dev'),
    'com o selo, ela aparece',
  );

  const comSecreta = tagsComEstado(['secreta-madrugada'], false);
  const madrugada = comSecreta.find((tag) => tag.id === 'secreta-madrugada');
  ok(madrugada?.unlocked === true && madrugada?.escondida === false, 'secreta descoberta deixa de ser mascarada');
  ok(comSecreta[0]?.unlocked === true, 'as desbloqueadas vem primeiro na galeria');
}

/* -------------------------------------------------------------------------
 * @username: filtro de palavras
 * ---------------------------------------------------------------------- */
secao('filtro de palavras no @username');
{
  // `c_u` entra aqui por consequencia da mesma regra que faz `cu_123` cair:
  // separadores sao removidos antes da comparacao. E consistente e nao pega
  // nome inocente, entao fica.
  const bloqueia = [
    'cu', 'cu_123', 'cu2', 'c_u', 'puta', 'puta_99', 'sexo', 'pornolandia', 'xxpornoxx',
  ];
  bloqueia.forEach((alvo) => ok(usernameProibido(alvo), `bloqueia "${alvo}"`));

  const permite = [
    'curioso', 'escuro', 'documento', 'circuito', 'disputa', 'reputacao',
    'thenextone', 'davi123', 'ana_dev', 'sextafeira', 'putin',
    's3x0', 'p0rn0',
  ];
  permite.forEach((alvo) => ok(!usernameProibido(alvo), `NAO bloqueia "${alvo}"`));

  ok(
    validateUsername('curioso') === null,
    'validateUsername aceita um nome inocente que contem palavra curta',
  );
  ok(
    validateUsername('putaria') !== null,
    'validateUsername recusa palavrao',
  );
}

secao('lista de palavras em sincronia com o banco');
{
  const migration = readFileSync('supabase/migrations/0004_perfis_publicos.sql', 'utf8');
  const bloco = migration.match(/palavras text\[\] := array\[([\s\S]*?)\];/);
  ok(Boolean(bloco), 'achei a lista de palavras dentro da migration');

  const noBanco = (bloco?.[1] ?? '')
    .split(',')
    .map((item) => item.trim().replace(/^'|'$/g, '').replace(/\n/g, '').trim())
    .filter(Boolean)
    .sort();
  const noCodigo = [...PALAVRAS_BLOQUEADAS].sort();

  ok(
    JSON.stringify(noBanco) === JSON.stringify(noCodigo),
    `a lista do banco (${noBanco.length}) e a do codigo (${noCodigo.length}) sao iguais`,
  );
}

/* -------------------------------------------------------------------------
 * @username: espera de 24 horas
 * ---------------------------------------------------------------------- */
secao('espera de 24h para trocar o @username');
{
  const agora = new Date('2026-08-23T12:00:00Z');
  ok(esperaRestanteMs(null, agora) === 0, 'quem nunca trocou pode trocar');
  ok(
    esperaRestanteMs('2026-08-22T11:00:00Z', agora) === 0,
    'depois de 25 horas esta liberado',
  );
  const restante = esperaRestanteMs('2026-08-23T06:00:00Z', agora);
  ok(restante > 0, 'seis horas depois ainda esta bloqueado');
  ok(Math.round(restante / 3_600_000) === 18, 'e faltam 18 horas');
  ok(esperaRestanteMs('data-invalida', agora) === 0, 'data invalida nao trava a pessoa');
}

/* ---------------------------------------------------------------------- */
console.log(`\n${passaram} passaram, ${falharam} falharam`);
if (falharam > 0) {
  console.error('\nALGUM TESTE FALHOU');
  process.exit(1);
}
console.log('\nTODOS OS TESTES PASSARAM');
