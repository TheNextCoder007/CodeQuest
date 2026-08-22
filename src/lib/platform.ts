/**
 * Deteccao de plataforma.
 *
 * O mesmo bundle roda no navegador, dentro do Capacitor (.apk) e dentro do
 * Tauri (.exe / .AppImage / .deb). Algumas decisoes mudam conforme o alvo -
 * principalmente o redirecionamento do login com Google, que no navegador
 * volta por uma URL https e nos apps empacotados volta por um deep link
 * `codequest://auth-callback`.
 */

export type Platform = 'web' | 'android' | 'desktop';

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const isCapacitor = (): boolean =>
  isBrowser() && Boolean((window as unknown as { Capacitor?: unknown }).Capacitor);

export const isTauri = (): boolean =>
  isBrowser() &&
  Boolean(
    (window as unknown as { __TAURI_INTERNALS__?: unknown; __TAURI__?: unknown })
      .__TAURI_INTERNALS__ ??
      (window as unknown as { __TAURI__?: unknown }).__TAURI__,
  );

/** true quando o app roda empacotado (apk/exe), e nao numa aba do navegador. */
export const isNativeApp = (): boolean => isCapacitor() || isTauri();

export const currentPlatform = (): Platform => {
  if (isCapacitor()) return 'android';
  if (isTauri()) return 'desktop';
  return 'web';
};

export const DEEP_LINK_SCHEME =
  process.env.NEXT_PUBLIC_DEEP_LINK_SCHEME?.trim() || 'codequest';

/** Deep link para onde o Google devolve o usuario nos apps empacotados. */
export const DEEP_LINK_CALLBACK = `${DEEP_LINK_SCHEME}://auth-callback`;

/**
 * URL de redirect do OAuth conforme a plataforma.
 *
 *  - navegador: <site>/auth/callback/
 *  - apk/exe:   codequest://auth-callback
 */
export const oauthRedirectUrl = (): string => {
  if (isNativeApp()) return DEEP_LINK_CALLBACK;

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  const origin = isBrowser() ? window.location.origin : configured || '';
  // Em producao preferimos a URL configurada; em dev, o origin real.
  const base = origin || configured || '';
  return `${base}/auth/callback/`;
};
