'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Retorno do Google OAuth **no navegador**.
 *
 * O supabase-js esta configurado com `detectSessionInUrl: true`, entao ele
 * mesmo troca o `code` da URL por uma sessao assim que esta pagina carrega.
 * Aqui so aguardamos o resultado e encaminhamos o aluno.
 *
 * Nos apps empacotados (.apk / .exe) o retorno nao passa por esta pagina: ele
 * chega pelo deep link `codequest://auth-callback`, tratado no AuthProvider.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finish = async () => {
      if (!isSupabaseConfigured) {
        router.replace('/login');
        return;
      }

      const supabase = getSupabase()!;
      const params = new URLSearchParams(window.location.search);

      const oauthError = params.get('error_description') ?? params.get('error');
      if (oauthError) {
        setError(decodeURIComponent(oauthError));
        return;
      }

      // Damos algumas tentativas: o supabase-js processa a URL de forma
      // assincrona logo depois da montagem.
      for (let attempt = 0; attempt < 20 && !cancelled; attempt += 1) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace('/dashboard');
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (!cancelled) {
        setError('Não conseguimos concluir o login. Tente novamente pela tela de entrada.');
      }
    };

    void finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      {error ? (
        <>
          <p className="max-w-sm text-sm text-rose-300">{error}</p>
          <Link href="/login" className="text-sm font-semibold text-mint-300 hover:underline">
            Voltar para o login
          </Link>
        </>
      ) : (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-mint-400" />
          <p className="text-sm text-slate-400">Concluindo seu login...</p>
        </>
      )}
    </div>
  );
}
