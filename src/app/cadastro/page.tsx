'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AuthLayout,
  FormError,
  FormNotice,
  GoogleButton,
  TextField,
} from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';

export default function CadastroPage() {
  const { user, loading, demoMode, signUpWithPassword, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && user && !notice) router.replace('/dashboard');
  }, [loading, user, notice, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      const { needsConfirmation } = await signUpWithPassword(name, email, password);
      if (needsConfirmation) {
        setNotice(
          'Conta criada! Enviamos um e-mail de confirmação para ' +
            email +
            '. Confirme o endereço e volte para entrar.',
        );
      } else {
        router.replace('/dashboard');
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Não foi possível criar a conta.',
      );
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
      title="Criar conta"
      subtitle="Leva menos de um minuto. Sua primeira lição já está esperando."
      footer={
        <>
          Já tem conta?{' '}
          <Link href="/login" className="cq-tap font-semibold text-mint-300 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        <FormNotice message={notice} />

        <TextField
          id="name"
          label="Como quer ser chamado?"
          type="text"
          autoComplete="name"
          required
          placeholder="Seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="mínimo 6 caracteres"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Criar minha conta
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
          <strong>Modo demonstração:</strong> sem Supabase configurado, a conta é criada localmente
          neste dispositivo — perfeito para testar ou apresentar o projeto offline.
        </p>
      )}
    </AuthLayout>
  );
}
