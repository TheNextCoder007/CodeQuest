/**
 * Adversarios controlados pelo computador, por patamar.
 *
 * Enquanto o CodeQuest nao tiver gente ranqueada suficiente para formar dupla
 * na hora, a partida ranqueada e contra um bot. Ele nao tem inteligencia
 * nenhuma: responde com uma taxa de acerto e uma faixa de tempo sorteadas -
 * exatamente o que a Fase 3 ja usava no modo demonstracao (`PerfilDeBot` em
 * `src/lib/pvp/local.ts`).
 *
 * O que muda aqui e que o perfil do bot depende do patamar do jogador: bot de
 * Bronze erra mais da metade e demora; bot de Mestre acerta quase tudo e
 * responde em poucos segundos.
 *
 * ATENCAO: esta tabela existe tambem em SQL (`ranked_bot()` em
 * `supabase/migrations/0006_ranqueado.sql`), e la e que ela vale numa partida
 * de verdade - o cliente NAO escolhe contra quem joga nem com que dificuldade.
 * `npm run test:ranqueado` compara as duas linha por linha.
 *
 * ------------------------------------------------------------------------
 * TROCAR BOT POR GENTE DE VERDADE
 *
 * A conta de elo nao sabe que existe bot. Ela recebe so
 * "venceu/perdeu/empatou" (`ranked_aplicar_resultado`), e a partida ranqueada
 * e uma linha comum em `matches`, com `modo = 'ranqueado'`. Para trocar por
 * duelo entre dois humanos ranqueados basta preencher `guest_id` em vez de
 * `bot_nome` na criacao da partida: `pvp_finalizar` ja aplica elo aos dois
 * lados quando os dois existem. Nada de patamar, temporada ou historico
 * precisa ser reescrito.
 * ------------------------------------------------------------------------
 */

import type { PerfilDeBot } from '@/lib/pvp/local';
import { PATAMARES, patamarDaDivisao, divisaoDoElo, type Patamar } from './patamares';

export interface PerfilDeBotRanqueado extends PerfilDeBot {
  patamar: Patamar;
}

/**
 * Um bot por patamar.
 *
 * Os nomes sao termos de programacao de proposito: deixa claro que e um
 * adversario da casa, sem fingir ser uma pessoa (nenhum aluno vai achar que
 * perdeu para um colega chamado "Segmentation Fault").
 */
export const BOTS_POR_PATAMAR: readonly PerfilDeBotRanqueado[] = [
  { patamar: 'bronze', nome: 'Bit', acerto: 0.45, msMin: 5000, msMax: 14000 },
  { patamar: 'prata', nome: 'Loop', acerto: 0.55, msMin: 4500, msMax: 12000 },
  { patamar: 'ouro', nome: 'Nullptr', acerto: 0.65, msMin: 4000, msMax: 11000 },
  { patamar: 'diamante', nome: 'Kernel', acerto: 0.72, msMin: 3500, msMax: 9500 },
  { patamar: 'mitico', nome: 'Daemon', acerto: 0.8, msMin: 3000, msMax: 8000 },
  { patamar: 'lendario', nome: 'Overflow', acerto: 0.88, msMin: 2500, msMax: 6500 },
  { patamar: 'mestre', nome: 'Root', acerto: 0.94, msMin: 1800, msMax: 5000 },
] as const;

/** O bot do patamar (0 a 6). */
export const botDoPatamar = (patamar: number): PerfilDeBotRanqueado =>
  BOTS_POR_PATAMAR[Math.max(0, Math.min(PATAMARES.length - 1, patamar))];

/** O bot que enfrenta quem esta com esse elo. */
export const botDoElo = (elo: number): PerfilDeBotRanqueado =>
  botDoPatamar(patamarDaDivisao(divisaoDoElo(elo)));
