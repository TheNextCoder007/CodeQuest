import type { Config } from 'tailwindcss';

// Paleta retirada do pitch do CodeQuest: fundo quase preto/azul-marinho,
// destaques em verde-agua (mint) e azul eletrico.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#04070f',
          900: '#070d1b',
          850: '#0a1223',
          800: '#0e1a2f',
          700: '#152441',
          600: '#1d3155',
        },
        mint: {
          300: '#7dfcd0',
          400: '#3ff0b2',
          500: '#00e394',
          600: '#00b878',
        },
        aqua: {
          300: '#7de7ff',
          400: '#38d6f5',
          500: '#12b6dd',
        },
        electric: {
          400: '#4d8dff',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      /*
       * `transition` sem duracao explicita cai aqui. O padrao do Tailwind e
       * 150ms, que no escuro fica seco demais - a mudanca de cor "pisca" em
       * vez de deslizar. 200ms e o ponto em que o movimento fica perceptivel
       * sem parecer lento, e definir no tema conserta os 38 lugares que usam
       * `transition` cru de uma vez.
       */
      transitionDuration: {
        DEFAULT: '200ms',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0, 227, 148, 0.25), 0 12px 40px -12px rgba(0, 227, 148, 0.35)',
        'glow-blue': '0 0 0 1px rgba(77, 141, 255, 0.25), 0 12px 40px -12px rgba(77, 141, 255, 0.35)',
        // Duas camadas: um contorno curto que define a borda do card contra o
        // fundo escuro, e uma sombra longa e difusa que da profundidade sem
        // virar mancha.
        card: '0 1px 2px -1px rgba(0, 0, 0, 0.6), 0 18px 50px -24px rgba(0, 0, 0, 0.9)',
        // Elevacao do card clicavel sob o cursor: mesma sombra, mais alta, com
        // um fio de mint no lugar da borda.
        'card-hover':
          '0 1px 2px -1px rgba(0, 0, 0, 0.6), 0 26px 60px -22px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(0, 227, 148, 0.14)',
      },
      backgroundImage: {
        'grid-mesh':
          'radial-gradient(circle at 15% 12%, rgba(0,227,148,0.16), transparent 45%), radial-gradient(circle at 85% 8%, rgba(56,214,245,0.14), transparent 42%), radial-gradient(circle at 60% 92%, rgba(37,99,235,0.18), transparent 48%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'xp-pop': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.85)' },
          '35%': { opacity: '1', transform: 'translateY(-6px) scale(1.06)' },
          '100%': { opacity: '0', transform: 'translateY(-52px) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(0,227,148,0.45)' },
          '70%': { boxShadow: '0 0 0 14px rgba(0,227,148,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0,227,148,0)' },
        },
        /* Troca de tela: so opacidade e 4px de deslocamento. Mais que isso a
           cada navegacao vira enjoo, principalmente no celular. */
        'page-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        /* Entrada dos toasts: vem de baixo e de leve, sem escala. */
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'page-in': 'page-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'xp-pop': 'xp-pop 1.6s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
