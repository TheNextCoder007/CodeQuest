import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <p className="font-mono text-6xl font-extrabold cq-gradient-text">404</p>
        <h1 className="mt-3 text-xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-2 text-sm text-slate-400">
          O endereço que você tentou abrir não existe no CodeQuest.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-xl bg-gradient-to-r from-mint-500 to-aqua-400 px-6 py-3 text-sm font-semibold text-night-950 shadow-glow"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
