/**
 * Patamares e elo do modo ranqueado - versao TypeScript.
 *
 * ATENCAO: estas mesmas regras existem em SQL, dentro de
 * `supabase/migrations/0006_ranqueado.sql`, e o SQL e quem manda. Numa partida
 * de verdade o elo e calculado pelo banco; o cliente so pergunta quanto ficou.
 *
 * A copia em TypeScript existe pelos mesmos dois motivos da Fase 3:
 *
 *   1. o modo demonstracao (sem Supabase) precisa rodar tudo no dispositivo,
 *      senao o projeto nao pode ser apresentado offline;
 *   2. a tela precisa desenhar a barra de progresso do patamar sem ficar
 *      pedindo conta ao servidor a cada quadro.
 *
 * `npm run test:ranqueado` roda as duas versoes lado a lado, entrada por
 * entrada, e falha se elas discordarem em qualquer valor.
 */

/* -------------------------------------------------------------------------
 * A escada
 * ---------------------------------------------------------------------- */

/**
 * Os sete patamares, do mais baixo ao mais alto.
 *
 * Os seis primeiros tem 3 sub-niveis (Bronze 1, Bronze 2, Bronze 3, Prata 1...).
 * **Mestre nao tem sub-nivel**: e um patamar unico e o topo absoluto da escada.
 * Sao 6 x 3 + 1 = 19 divisoes.
 *
 * Chegar a Mestre nao para o elo: ele continua subindo e descendo, porque e
 * ele que ordena o leaderboard entre quem ja chegou la. O que acaba e a
 * progressao - nao existe "Mestre 2" para alcancar.
 */
export const PATAMARES = [
  'bronze',
  'prata',
  'ouro',
  'diamante',
  'mitico',
  'lendario',
  'mestre',
] as const;

export type Patamar = (typeof PATAMARES)[number];

export const SUBNIVEIS_POR_PATAMAR = 3;

/** Indice do Mestre (6). E o unico patamar sem sub-niveis. */
export const PATAMAR_MESTRE = PATAMARES.length - 1;

/** 19 divisoes: 0 = Bronze 1 ... 17 = Lendario 3, 18 = Mestre. */
export const TOTAL_DIVISOES = PATAMAR_MESTRE * SUBNIVEIS_POR_PATAMAR + 1;
export const DIVISAO_MAXIMA = TOTAL_DIVISOES - 1;

/**
 * Elo necessario para subir uma divisao.
 *
 * Fixo de proposito. Quem faz a subida ficar mais lenta la em cima nao e o
 * tamanho da divisao, e o `GANHO_POR_PATAMAR` abaixo: no Bronze uma vitoria
 * vale 40 (2,5 vitorias por divisao); no Mestre vale 10 (10 vitorias por
 * divisao). E a mesma curva do Brawl Stars, e fica muito mais facil de
 * explicar na tela: "faltam 60 de 100".
 */
export const ELO_POR_DIVISAO = 100;

/** Elo em que cada patamar comeca (Bronze 0, Prata 300, Ouro 600...). */
export const eloInicialDoPatamar = (patamar: number): number =>
  patamar * SUBNIVEIS_POR_PATAMAR * ELO_POR_DIVISAO;

/* -------------------------------------------------------------------------
 * Ganho e perda
 * ---------------------------------------------------------------------- */

/** Elo ganho por vitoria, por patamar. Diminui conforme sobe. */
export const GANHO_POR_PATAMAR = [40, 35, 30, 25, 20, 15, 10] as const;

/** Elo perdido por derrota, por patamar. Aumenta conforme sobe. */
export const PERDA_POR_PATAMAR = [10, 12, 15, 18, 20, 22, 25] as const;

/**
 * Empate nao mexe no elo.
 *
 * Num duelo de 5 perguntas cronometradas o empate e raro (precisa dar a mesma
 * pontuacao ate o bonus de velocidade), e premiar ou punir um resultado que
 * ninguem controla so geraria reclamacao.
 */
export const ELO_EMPATE = 0;

export type ResultadoRanqueada = 'vitoria' | 'derrota' | 'empate';

/* -------------------------------------------------------------------------
 * Contas
 * ---------------------------------------------------------------------- */

const limitar = (valor: number, minimo: number, maximo: number): number =>
  Math.max(minimo, Math.min(maximo, valor));

/**
 * Divisao (0 a 18) correspondente a um elo.
 *
 * O elo continua crescendo depois que a pessoa entra em Mestre - e ele que
 * ordena o leaderboard entre quem ja chegou ao teto -, mas a divisao trava
 * em 18.
 */
export const divisaoDoElo = (elo: number): number =>
  limitar(Math.floor(Math.max(0, elo) / ELO_POR_DIVISAO), 0, DIVISAO_MAXIMA);

/** Indice do patamar (0 a 6) de uma divisao. */
export const patamarDaDivisao = (divisao: number): number =>
  Math.floor(limitar(divisao, 0, DIVISAO_MAXIMA) / SUBNIVEIS_POR_PATAMAR);

/** Mestre e o unico patamar sem sub-niveis. */
export const temSubnivel = (divisao: number): boolean =>
  limitar(divisao, 0, DIVISAO_MAXIMA) < DIVISAO_MAXIMA;

/**
 * Sub-nivel dentro do patamar: 1, 2 ou 3.
 *
 * Devolve **0** no Mestre, que nao tem sub-nivel. Quem for escrever na tela
 * deve usar `nomeDaDivisao`, que ja trata isso.
 */
export const subnivelDaDivisao = (divisao: number): number => {
  const segura = limitar(divisao, 0, DIVISAO_MAXIMA);
  return temSubnivel(segura) ? (segura % SUBNIVEIS_POR_PATAMAR) + 1 : 0;
};

export const patamarDoElo = (elo: number): Patamar =>
  PATAMARES[patamarDaDivisao(divisaoDoElo(elo))];

/** Ganho por vitoria com o elo atual. */
export const ganhoDaVitoria = (elo: number): number =>
  GANHO_POR_PATAMAR[patamarDaDivisao(divisaoDoElo(elo))];

/** Perda por derrota com o elo atual. */
export const perdaDaDerrota = (elo: number): number =>
  PERDA_POR_PATAMAR[patamarDaDivisao(divisaoDoElo(elo))];

/**
 * Piso do patamar atual.
 *
 * Uma vez que a pessoa entra em Ouro 1, ela nao volta para Prata 3 por mais
 * que perca - so anda para tras dentro do proprio patamar. E o mesmo alivio
 * do Brawl Stars: uma noite ruim nao apaga a temporada inteira.
 */
export const pisoDoPatamar = (elo: number): number =>
  eloInicialDoPatamar(patamarDaDivisao(divisaoDoElo(elo)));

/**
 * Elo depois de uma partida.
 *
 * Nunca negativo e nunca abaixo do piso do patamar (ver `pisoDoPatamar`).
 */
export const novoElo = (elo: number, resultado: ResultadoRanqueada): number => {
  const atual = Math.max(0, elo);
  if (resultado === 'empate') return atual + ELO_EMPATE;
  if (resultado === 'vitoria') return atual + ganhoDaVitoria(atual);
  return Math.max(pisoDoPatamar(atual), atual - perdaDaDerrota(atual));
};

/** Quanto o elo mudou (positivo, negativo ou zero). */
export const deltaDaPartida = (elo: number, resultado: ResultadoRanqueada): number =>
  novoElo(elo, resultado) - Math.max(0, elo);

/* -------------------------------------------------------------------------
 * Progresso dentro da divisao (so para a tela)
 * ---------------------------------------------------------------------- */

export interface ProgressoDivisao {
  /** Elo acumulado dentro da divisao atual (0 a 99). */
  atual: number;
  /** Sempre `ELO_POR_DIVISAO`, exceto no Mestre, onde nao ha proximo. */
  alvo: number;
  /** 0 a 1, para a barra. No Mestre fica cheia. */
  fracao: number;
  /** Quanto falta para a proxima divisao (0 no Mestre). */
  faltam: number;
  /** true quando ja esta no teto da escada. */
  noTopo: boolean;
}

export const progressoNaDivisao = (elo: number): ProgressoDivisao => {
  const seguro = Math.max(0, elo);
  const noTopo = divisaoDoElo(seguro) >= DIVISAO_MAXIMA;
  if (noTopo) {
    return { atual: ELO_POR_DIVISAO, alvo: ELO_POR_DIVISAO, fracao: 1, faltam: 0, noTopo: true };
  }
  const atual = seguro % ELO_POR_DIVISAO;
  return {
    atual,
    alvo: ELO_POR_DIVISAO,
    fracao: atual / ELO_POR_DIVISAO,
    faltam: ELO_POR_DIVISAO - atual,
    noTopo: false,
  };
};

/* -------------------------------------------------------------------------
 * Aparencia e nomes
 * ---------------------------------------------------------------------- */

export interface EstiloPatamar {
  nome: string;
  emoji: string;
  /** Classe do "chip" (badge pequeno). */
  chip: string;
  /** Gradiente do cartao grande. */
  cartao: string;
  /** Cor de texto para numeros em destaque. */
  texto: string;
  /** Cor da barra de progresso. */
  barra: 'mint' | 'blue' | 'amber';
}

/**
 * Segue a paleta ja estabelecida no app: verde-agua e azul para os patamares
 * de baixo e do meio, violeta e rosa para os altos, gradiente cheio no Mestre
 * - a mesma logica de raridade das tags (ver `ESTILO_RARIDADE` em
 * `lib/tags.ts`), para o aluno reconhecer "isto e raro" sem precisar ler.
 */
export const ESTILO_PATAMAR: Record<Patamar, EstiloPatamar> = {
  bronze: {
    nome: 'Bronze',
    emoji: '🥉',
    chip: 'border-amber-700/50 bg-amber-800/20 text-amber-200',
    cartao: 'border-amber-700/40 from-amber-800/25 via-night-900/60 to-transparent',
    texto: 'text-amber-200',
    barra: 'amber',
  },
  prata: {
    nome: 'Prata',
    emoji: '🥈',
    chip: 'border-slate-300/40 bg-slate-300/10 text-slate-200',
    cartao: 'border-slate-300/30 from-slate-400/20 via-night-900/60 to-transparent',
    texto: 'text-slate-200',
    barra: 'blue',
  },
  ouro: {
    nome: 'Ouro',
    emoji: '🥇',
    chip: 'border-amber-300/50 bg-amber-400/15 text-amber-100',
    cartao: 'border-amber-300/40 from-amber-400/20 via-night-900/60 to-transparent',
    texto: 'text-amber-200',
    barra: 'amber',
  },
  diamante: {
    nome: 'Diamante',
    emoji: '💎',
    chip: 'border-aqua-400/50 bg-aqua-400/10 text-aqua-200',
    cartao: 'border-aqua-400/40 from-aqua-400/20 via-night-900/60 to-transparent',
    texto: 'text-aqua-200',
    barra: 'blue',
  },
  mitico: {
    nome: 'Mítico',
    emoji: '🔮',
    chip: 'border-violet-400/50 bg-violet-500/15 text-violet-200',
    cartao: 'border-violet-400/40 from-violet-500/20 via-night-900/60 to-transparent',
    texto: 'text-violet-200',
    barra: 'blue',
  },
  lendario: {
    nome: 'Lendário',
    emoji: '👑',
    chip: 'border-rose-400/50 bg-rose-500/15 text-rose-200',
    cartao: 'border-rose-400/40 from-rose-500/20 via-night-900/60 to-transparent',
    texto: 'text-rose-200',
    barra: 'amber',
  },
  mestre: {
    nome: 'Mestre',
    emoji: '🏅',
    chip: 'border-transparent bg-gradient-to-r from-mint-500 via-aqua-400 to-electric-500 text-night-950 font-extrabold shadow-glow',
    cartao: 'border-mint-400/50 from-mint-500/25 via-electric-500/10 to-transparent',
    texto: 'text-mint-200',
    barra: 'mint',
  },
};

/** Ex.: "Ouro 2" - e so "Mestre" no topo, que nao tem sub-nivel. */
export const nomeDaDivisao = (divisao: number): string => {
  const patamar = PATAMARES[patamarDaDivisao(divisao)];
  const nome = ESTILO_PATAMAR[patamar].nome;
  return temSubnivel(divisao) ? `${nome} ${subnivelDaDivisao(divisao)}` : nome;
};

/** Ex.: "Ouro 2" a partir do elo. */
export const nomeDoElo = (elo: number): string => nomeDaDivisao(divisaoDoElo(elo));
