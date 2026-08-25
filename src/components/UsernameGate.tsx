'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AtSign, Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import { isUsernameAvailable } from '@/lib/friends';
import {
  USERNAME_MAX,
  nextUsernameCandidate,
  normalizeUsername,
  suggestUsername,
  validateUsername,
} from '@/lib/username';
import { cn } from '@/lib/cn';

type Disponibilidade = 'idle' | 'checking' | 'free' | 'taken' | 'error';

/**
 * Tela de escolha do @username.
 *
 * Aparece sempre que o perfil esta sem username - o que cobre os tres casos
 * de uma vez:
 *   1. quem acabou de se cadastrar por e-mail/senha;
 *   2. quem entrou pela primeira vez com o Google;
 *   3. **contas antigas**, criadas antes de o campo existir, que caem aqui no
 *      proximo login sem precisar de nenhuma migracao de dados.
 *
 * A sugestao vem do nome de exibicao, mas o campo continua editavel: a pessoa
 * confirma o que quiser antes de salvar.
 */
export function UsernameGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { state, loading, origem, updateUsername } = usePlayer();

  const [valor, setValor] = useState('');
  const [tocado, setTocado] = useState(false);
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade>('idle');
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const preenchido = useRef(false);

  // `origem !== 'nenhum'` e o que impede o loop relatado: sem essa checagem,
  // qualquer leitura que falhasse virava um perfil com `username: null` e
  // esta tela reaparecia para quem ja tinha escolhido um nome ha semanas.
  const precisaEscolher =
    Boolean(user) && !loading && origem !== 'nenhum' && Boolean(state) && !state?.profile.username;

  // Sugestao inicial, so na primeira vez que a tela aparece.
  useEffect(() => {
    if (!precisaEscolher || preenchido.current || !state) return;
    preenchido.current = true;
    setValor(suggestUsername(state.profile.name, user?.email));
  }, [precisaEscolher, state, user?.email]);

  const erroFormato = useMemo(() => (valor ? validateUsername(valor) : null), [valor]);

  // Consulta o banco enquanto a pessoa digita (com uma pausa, para nao fazer
  // uma requisicao por tecla).
  useEffect(() => {
    if (!precisaEscolher || !user || erroFormato || !valor) {
      setDisponibilidade('idle');
      return;
    }

    setDisponibilidade('checking');
    let ativo = true;

    const timer = window.setTimeout(async () => {
      try {
        const livre = await isUsernameAvailable(valor, user.id);
        if (ativo) setDisponibilidade(livre ? 'free' : 'taken');
      } catch {
        if (ativo) setDisponibilidade('error');
      }
    }, 450);

    return () => {
      ativo = false;
      window.clearTimeout(timer);
    };
  }, [valor, user, erroFormato, precisaEscolher]);

  if (!precisaEscolher) return <>{children}</>;

  const sugerirOutro = async () => {
    if (!user || !state) return;
    const base = suggestUsername(state.profile.name, user.email);

    for (let tentativa = 1; tentativa <= 20; tentativa += 1) {
      const candidato = nextUsernameCandidate(base, tentativa);
      try {
        if (await isUsernameAvailable(candidato, user.id)) {
          setValor(candidato);
          setTocado(true);
          return;
        }
      } catch {
        break;
      }
    }
    setValor(nextUsernameCandidate(base, Math.floor(1000 + Math.random() * 9000)));
    setTocado(true);
  };

  const salvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setTocado(true);
    setErroSalvar(null);

    if (erroFormato || disponibilidade === 'taken') return;

    setSalvando(true);
    try {
      await updateUsername(valor);
    } catch (falha) {
      setErroSalvar(falha instanceof Error ? falha.message : 'Não foi possível salvar.');
      setDisponibilidade('taken');
    } finally {
      setSalvando(false);
    }
  };

  const mostrarErro = tocado && erroFormato;
  const podeSalvar = !erroFormato && disponibilidade === 'free' && !salvando;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10 cq-safe-top cq-safe-bottom">
      <Logo className="mb-8" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="cq-card bg-gradient-to-br from-mint-600/15 via-night-900/70 to-electric-500/10 p-6 sm:p-8">
          <Label>Falta só um passo</Label>
          <h1 className="mt-2 cq-h1">Escolha seu nome de usuário</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            É por ele que seus colegas vão te encontrar na busca de amigos. Ele é diferente do seu
            nome de exibição, que continua sendo{' '}
            <strong className="text-slate-200">{state?.profile.name}</strong>.
          </p>

          <form onSubmit={salvar} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-300">
                Nome de usuário
              </label>

              <div
                className={cn(
                  'flex items-center gap-2 rounded-xl border bg-night-950/60 px-3 transition',
                  mostrarErro || disponibilidade === 'taken'
                    ? 'border-rose-500/50'
                    : disponibilidade === 'free'
                      ? 'border-mint-400/50'
                      : 'border-white/10',
                )}
              >
                <AtSign className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                <input
                  id="username"
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={USERNAME_MAX}
                  value={valor}
                  onChange={(evento) => {
                    setValor(normalizeUsername(evento.target.value));
                    setTocado(true);
                    setErroSalvar(null);
                  }}
                  placeholder="davi123"
                  className="cq-input-bare font-mono"
                />

                <span className="shrink-0">
                  {disponibilidade === 'checking' && (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  )}
                  {disponibilidade === 'free' && !erroFormato && (
                    <Check className="h-4 w-4 text-mint-400" />
                  )}
                  {disponibilidade === 'taken' && <X className="h-4 w-4 text-rose-400" />}
                </span>
              </div>

              <p
                className={cn(
                  'mt-2 text-xs',
                  mostrarErro || disponibilidade === 'taken' ? 'text-rose-300' : 'text-slate-500',
                )}
              >
                {mostrarErro
                  ? erroFormato
                  : erroSalvar
                    ? erroSalvar
                    : disponibilidade === 'taken'
                      ? 'Esse nome já está em uso. Tente outro.'
                      : disponibilidade === 'free'
                        ? `@${valor} está disponível!`
                        : disponibilidade === 'error'
                          ? 'Não foi possível verificar agora. Você pode tentar salvar mesmo assim.'
                          : 'Letras minúsculas, números e _ — de 3 a 20 caracteres, sem espaços.'}
              </p>
            </div>

            <Button type="submit" className="w-full" loading={salvando} disabled={!podeSalvar}>
              Confirmar e continuar
            </Button>

            <button
              type="button"
              onClick={sugerirOutro}
              className="min-h-[44px] w-full text-center cq-muted transition hover:text-mint-300"
            >
              sugerir outro nome para mim
            </button>
          </form>
        </div>

        <p className="mt-5 text-center cq-muted">
          Você pode mudar seu nome de usuário depois, na tela de Perfil.
        </p>
      </div>
    </div>
  );
}
