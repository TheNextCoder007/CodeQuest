'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { localAuth, type LocalUser } from '@/lib/local-store';
import {
  DEEP_LINK_CALLBACK,
  isCapacitor,
  isNativeApp,
  isTauri,
  oauthRedirectUrl,
} from '@/lib/platform';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** true quando nao ha Supabase configurado e o app roda com dados locais. */
  demoMode: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (name: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const fromLocal = (user: LocalUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: null,
});

const fromSession = (session: Session): AuthUser => {
  const metadata = session.user.user_metadata ?? {};
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name:
      (metadata.name as string) ||
      (metadata.full_name as string) ||
      session.user.email?.split('@')[0] ||
      'Estudante',
    avatarUrl: (metadata.avatar_url as string) ?? (metadata.picture as string) ?? null,
  };
};

/** Dois usuarios sao "o mesmo" quando nada que o app usa mudou. */
const mesmoUsuario = (a: AuthUser | null, b: AuthUser | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id && a.email === b.email && a.name === b.name && a.avatarUrl === b.avatarUrl
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * `onAuthStateChange` dispara a cada renovacao de token (e ao voltar para a
   * aba). Se cada disparo criasse um objeto novo, o PlayerProvider recarregaria
   * o progresso inteiro toda vez - multiplicando as chances de pegar uma
   * leitura ruim e, com ela, a tela zerada. Por isso trocamos o objeto so
   * quando algum campo realmente mudou.
   */
  const [user, setUserState] = useState<AuthUser | null>(null);
  const setUser = useCallback((proximo: AuthUser | null) => {
    setUserState((atual) => (mesmoUsuario(atual, proximo) ? atual : proximo));
  }, []);
  const [loading, setLoading] = useState(true);
  const deepLinkReady = useRef(false);

  /* --------------------------------------------------------------------
   * Sessao inicial + escuta de mudancas
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(localAuth.current() ? fromLocal(localAuth.current()!) : null);
      setLoading(false);
      return;
    }

    const supabase = getSupabase()!;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session ? fromSession(data.session) : null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? fromSession(session) : null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  /* --------------------------------------------------------------------
   * Deep link do OAuth nos apps empacotados
   *
   * No navegador o Google devolve o usuario para /auth/callback e o
   * supabase-js resolve sozinho. Dentro do .apk/.exe nao existe URL http, e
   * por isso registramos o schema `codequest://` no sistema operacional: o
   * SO reabre o app com a URL, nos extraimos o `code` e trocamos por sessao.
   * ------------------------------------------------------------------ */
  const handleDeepLink = useCallback(async (url: string) => {
    if (!url || !isSupabaseConfigured) return;
    const supabase = getSupabase()!;

    try {
      // O parametro pode vir na query (`?code=`) ou no fragmento (`#access_token=`).
      const parsed = new URL(url.replace(/^([a-z][a-z0-9+.-]*):\/\//i, 'https://'));
      const code = parsed.searchParams.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        return;
      }

      const hash = new URLSearchParams(parsed.hash.replace(/^#/, ''));
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('[CodeQuest] falha ao processar deep link', error);
    }
  }, []);

  useEffect(() => {
    if (!isNativeApp() || deepLinkReady.current) return;
    deepLinkReady.current = true;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        if (isCapacitor()) {
          const { App } = await import('@capacitor/app');
          const listener = await App.addListener('appUrlOpen', ({ url }) => {
            void handleDeepLink(url);
            void (async () => {
              // Fecha a aba do navegador in-app depois do retorno.
              try {
                const { Browser } = await import('@capacitor/browser');
                await Browser.close();
              } catch {
                /* o navegador pode ja ter sido fechado pelo sistema */
              }
            })();
          });
          cleanup = () => void listener.remove();
        } else if (isTauri()) {
          const { onOpenUrl, getCurrent } = await import('@tauri-apps/plugin-deep-link');
          const pending = await getCurrent();
          pending?.forEach((url) => void handleDeepLink(url));
          const unlisten = await onOpenUrl((urls) => urls.forEach((url) => void handleDeepLink(url)));
          cleanup = () => unlisten();
        }
      } catch (error) {
        console.warn('[CodeQuest] deep link indisponivel nesta plataforma', error);
      }
    })();

    return () => cleanup?.();
  }, [handleDeepLink]);

  /* --------------------------------------------------------------------
   * Acoes
   * ------------------------------------------------------------------ */

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
      setUser(fromLocal(localAuth.signIn(email)));
      return;
    }
    const supabase = getSupabase()!;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(traduzErro(error.message));
  }, []);

  const signUpWithPassword = useCallback(async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
      setUser(fromLocal(localAuth.signIn(email, name)));
      return { needsConfirmation: false };
    }

    const supabase = getSupabase()!;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: oauthRedirectUrl(),
      },
    });
    if (error) throw new Error(traduzErro(error.message));

    // Sem sessao imediata = o projeto exige confirmacao de e-mail.
    return { needsConfirmation: !data.session };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'O login com Google precisa do Supabase configurado. No modo demonstração, use e-mail e senha.',
      );
    }

    const supabase = getSupabase()!;
    const native = isNativeApp();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: native ? DEEP_LINK_CALLBACK : oauthRedirectUrl(),
        // Nos apps empacotados nos mesmos abrimos o navegador do sistema.
        skipBrowserRedirect: native,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) throw new Error(traduzErro(error.message));
    if (!native || !data?.url) return;

    if (isCapacitor()) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: data.url, presentationStyle: 'popover' });
    } else if (isTauri()) {
      const { openUrl } = await import('@tauri-apps/plugin-opener');
      await openUrl(data.url);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      localAuth.signOut();
      setUser(null);
      return;
    }
    await getSupabase()!.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      demoMode: !isSupabaseConfigured,
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, signInWithPassword, signUpWithPassword, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return context;
};

/** Mensagens do Supabase Auth em portugues. */
function traduzErro(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar (verifique a caixa de entrada).',
    'User already registered': 'Esse e-mail já está cadastrado. Tente entrar.',
    'Password should be at least 6 characters.':
      'A senha precisa ter pelo menos 6 caracteres.',
    'Unsupported provider: provider is not enabled':
      'O login com Google ainda não foi habilitado no painel do Supabase.',
  };
  return map[message] ?? message;
}
