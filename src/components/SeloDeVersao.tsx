import { VERSAO } from '@/lib/versao';

/**
 * Selo de versao no canto inferior esquerdo.
 *
 * Fica fora do cabecalho de proposito: la o espaco ja e disputado (logo, XP,
 * streak, sair) e num celular de 320px com a fonte ampliada o botao de sair
 * chega a ser empurrado para fora. No canto de baixo ele nao concorre com
 * nada.
 *
 * `bottom-20` no celular para nao cair atras da barra de navegacao inferior;
 * `lg:bottom-3` no desktop, onde essa barra nao existe.
 *
 * `pointer-events-none` porque e informacao, nao controle: nunca deve roubar
 * um toque destinado ao que esta embaixo.
 */
export function SeloDeVersao() {
  return (
    <span
      className="pointer-events-none fixed bottom-20 left-3 z-30 select-none rounded-full border border-white/10 bg-night-950/70 px-2 py-0.5 font-mono text-[10px] leading-none text-slate-600 backdrop-blur-sm lg:bottom-3"
      aria-label={`Versão ${VERSAO} do CodeQuest`}
    >
      {VERSAO}
    </span>
  );
}
