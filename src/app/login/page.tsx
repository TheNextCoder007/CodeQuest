'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthLayout, FormError, GoogleButton, TextField } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';

export default function LoginPage() {
  const { user, loading, demoMode, signInWithPassword, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithPassword(email, password);
      router.replace('/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : 'Falha no login com Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Entrar no CodeQuest"
      subtitle="Continue de onde você parou na sua trilha."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="font-semibold text-mint-300 hover:underline">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <TextField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Entrar
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500">ou</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />

      {demoMode && (
        <p className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3 text-xs leading-relaxed text-amber-200">
          <strong>Modo demonstração:</strong> o Supabase ainda não foi configurado. Qualquer e-mail
          e senha (mínimo 6 caracteres) cria uma conta local neste dispositivo, e todo o resto da
          plataforma funciona normalmente.
        </p>
      )}
    </AuthLayout>
  );
}
