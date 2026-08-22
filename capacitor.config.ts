import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuracao do app Android (.apk).
 *
 * O Capacitor embala a pasta `out/` (gerada por `npm run build:static`) dentro
 * de um WebView nativo. Nao ha servidor: o app funciona offline, e so precisa
 * de rede para sincronizar o progresso com o Supabase e baixar o Pyodide na
 * primeira execucao de codigo.
 */
const config: CapacitorConfig = {
  appId: 'br.com.codequest.app',
  appName: 'CodeQuest',
  webDir: 'out',

  android: {
    // Fundo enquanto o WebView carrega - evita o "flash branco".
    backgroundColor: '#04070F',
    allowMixedContent: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#04070F',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },

  // O deep link `codequest://auth-callback` e registrado no
  // AndroidManifest.xml (ver README, secao "Google OAuth no .apk").
};

export default config;
