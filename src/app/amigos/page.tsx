'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Search, UserMinus, UserPlus, Users, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Avatar } from '@/components/social/Avatar';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardTitle, Label, Pill } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';
import { usePlayer } from '@/lib/player/PlayerProvider';
import {
  acceptFriendRequest,
  fetchFriends,
  removeFriendship,
  searchProfiles,
  sendFriendRequest,
} from '@/lib/friends';
import { displayUsername } from '@/lib/username';
import { levelTitle } from '@/lib/gamification';
import type { FriendsData, PublicProfile, SearchResult } from '@/types/db';
import { cn } from '@/lib/cn';

const vazio: FriendsData = { friends: [], incoming: [], outgoing: [] };

/** Linha de pessoa reutilizada nas quatro listas da tela. */
function PessoaRow({
  perfil,
  children,
  destaque,
}: {
  perfil: PublicProfile;
  children?: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 transition sm:flex-nowrap',
        destaque
          ? 'border-mint-500/40 bg-mint-500/[0.07]'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20',
      )}
    >
      <Avatar name={perfil.name} url={perfil.avatar_url} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{perfil.name}</p>
        <p className="truncate text-xs text-slate-500">
          <span className="font-mono text-aqua-300">{displayUsername(perfil.username)}</span>
          {' · '}
          Nível {perfil.level} · {perfil.xp_total} XP
        </p>
      </div>

      {children && (
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">{children}</div>
      )}
    </div>
  );
}

function AmigosContent() {
  const { user, demoMode } = useAuth();
  const { state } = usePlayer();

  const [data, setData] = useState<FriendsData>(vazio);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  /** Id da pessoa sobre a qual uma acao esta em andamento (trava o botao). */
  const [ocupado, setOcupado] = useState<string | null>(null);

  const meuId = user?.id ?? '';

  const recarregar = useCallback(async () => {
    if (!meuId) return;
    try {
      setData(await fetchFriends(meuId));
      setErro(null);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar seus amigos.');
    } finally {
      setCarregando(false);
    }
  }, [meuId]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  // Busca com pausa entre as teclas, para nao consultar a cada caractere.
  useEffect(() => {
    const busca = termo.trim().replace(/^@+/, '');
    if (busca.length < 2) {
      setResultados([]);
      setBuscou(false);
      return;
    }

    setBuscando(true);
    let ativo = true;

    const timer = window.setTimeout(async () => {
      try {
        const encontrados = await searchProfiles(busca, meuId, data);
        if (ativo) {
          setResultados(encontrados);
          setBuscou(true);
        }
      } catch (falha) {
        if (ativo) setErro(falha instanceof Error ? falha.message : 'Falha na busca.');
      } finally {
        if (ativo) setBuscando(false);
      }
    }, 400);

    return () => {
      ativo = false;
      window.clearTimeout(timer);
    };
  }, [termo, meuId, data]);

  /** Executa a acao e recarrega as listas, mantendo os botoes consistentes. */
  const executar = async (id: string, acao: () => Promise<void>) => {
    setOcupado(id);
    setErro(null);
    try {
      await acao();
      await recarregar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível concluir a ação.');
    } finally {
      setOcupado(null);
    }
  };

  const semUsername = state && !state.profile.username;

  const totalPedidos = data.incoming.length;
  const rotuloRelacao = useMemo(
    () => ({
      friends: 'Já são amigos',
      pending_out: 'Pedido enviado',
      pending_in: 'Te enviou um pedido',
      self: 'Você',
      none: '',
    }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Cabecalho ---------------------------------------------------- */}
      <section className="cq-card bg-gradient-to-br from-mint-600/15 via-night-900/60 to-electric-500/10 p-6">
        <Label>Estude junto</Label>
        <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-extrabold text-white sm:text-3xl">
          <Users className="h-7 w-7 text-mint-400" aria-hidden />
          Amigos
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Encontre seus colegas pelo nome de usuário, envie um pedido de amizade e compare o XP de
          vocês na aba <strong className="text-slate-200">Amigos</strong> do ranking.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="mint">
            {data.friends.length} {data.friends.length === 1 ? 'amigo' : 'amigos'}
          </Pill>
          {totalPedidos > 0 && (
            <Pill tone="amber">
              {totalPedidos} {totalPedidos === 1 ? 'pedido recebido' : 'pedidos recebidos'}
            </Pill>
          )}
          {state?.profile.username && (
            <Pill tone="blue">
              você é <span className="font-mono">{displayUsername(state.profile.username)}</span>
            </Pill>
          )}
        </div>
      </section>

      {erro && (
        <Card className="border-rose-500/40">
          <p className="text-sm text-rose-200">{erro}</p>
        </Card>
      )}

      {semUsername && (
        <Card className="border-amber-400/40 bg-amber-400/[0.05]">
          <CardTitle>Escolha seu nome de usuário</CardTitle>
          <p className="mt-2 text-sm text-slate-300">
            Sem um <span className="font-mono">@usuario</span>, seus colegas não conseguem te
            encontrar na busca.
          </p>
          <div className="mt-4">
            <LinkButton href="/perfil" size="sm">
              Definir no perfil
            </LinkButton>
          </div>
        </Card>
      )}

      {/* Busca --------------------------------------------------------- */}
      <Card>
        <CardTitle>Adicionar amigo</CardTitle>
        <p className="mt-1 text-sm text-slate-400">
          Busque pelo nome de usuário (ex.: <span className="font-mono text-aqua-300">@davi123</span>).
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-night-950/60 px-3 focus-within:border-mint-400/50">
          <Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <input
            value={termo}
            onChange={(evento) => setTermo(evento.target.value)}
            placeholder="digite um nome de usuário"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            aria-label="Buscar por nome de usuário"
            className="w-full bg-transparent py-3 font-mono text-base text-white placeholder:text-slate-600 focus:outline-none sm:text-sm"
          />
          {buscando && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-500" />}
        </div>

        {termo.trim().replace(/^@+/, '').length === 1 && (
          <p className="mt-3 text-xs text-slate-500">Digite pelo menos 2 caracteres.</p>
        )}

        {buscou && resultados.length === 0 && !buscando && (
          <p className="mt-4 text-sm text-slate-400">
            Ninguém encontrado com esse nome de usuário. Confira a escrita — a busca é pelo
            <span className="font-mono text-aqua-300"> @usuario</span>, não pelo nome de exibição.
          </p>
        )}

        {resultados.length > 0 && (
          <ul className="mt-4 space-y-2">
            {resultados.map((pessoa) => (
              <li key={pessoa.id}>
                <PessoaRow perfil={pessoa} destaque={pessoa.relationship === 'friends'}>
                  {pessoa.relationship === 'none' ? (
                    <Button
                      size="sm"
                      loading={ocupado === pessoa.id}
                      onClick={() =>
                        executar(pessoa.id, () => sendFriendRequest(meuId, pessoa.id, data))
                      }
                    >
                      <UserPlus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  ) : pessoa.relationship === 'pending_in' ? (
                    <Button
                      size="sm"
                      loading={ocupado === pessoa.id}
                      onClick={() =>
                        executar(pessoa.id, () => acceptFriendRequest(meuId, pessoa.id))
                      }
                    >
                      <Check className="h-4 w-4" />
                      Aceitar
                    </Button>
                  ) : (
                    <Pill tone={pessoa.relationship === 'friends' ? 'mint' : 'neutral'}>
                      {rotuloRelacao[pessoa.relationship]}
                    </Pill>
                  )}
                </PessoaRow>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Pedidos recebidos --------------------------------------------- */}
      {data.incoming.length > 0 && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Pedidos recebidos</CardTitle>
            <Pill tone="amber">{data.incoming.length}</Pill>
          </div>

          <ul className="mt-4 space-y-2">
            {data.incoming.map((pessoa) => (
              <li key={pessoa.id}>
                <PessoaRow perfil={pessoa}>
                  <Button
                    size="sm"
                    loading={ocupado === pessoa.id}
                    onClick={() => executar(pessoa.id, () => acceptFriendRequest(meuId, pessoa.id))}
                  >
                    <Check className="h-4 w-4" />
                    Aceitar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={ocupado === pessoa.id}
                    onClick={() => executar(pessoa.id, () => removeFriendship(meuId, pessoa.id))}
                  >
                    <X className="h-4 w-4" />
                    Recusar
                  </Button>
                </PessoaRow>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Pedidos enviados ---------------------------------------------- */}
      {data.outgoing.length > 0 && (
        <Card>
          <CardTitle>Pedidos enviados</CardTitle>
          <p className="mt-1 text-sm text-slate-400">Aguardando a resposta dessas pessoas.</p>

          <ul className="mt-4 space-y-2">
            {data.outgoing.map((pessoa) => (
              <li key={pessoa.id}>
                <PessoaRow perfil={pessoa}>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={ocupado === pessoa.id}
                    onClick={() => executar(pessoa.id, () => removeFriendship(meuId, pessoa.id))}
                  >
                    Cancelar
                  </Button>
                </PessoaRow>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Lista de amigos ------------------------------------------------ */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Meus amigos</CardTitle>
          {data.friends.length > 0 && <Pill tone="mint">{data.friends.length}</Pill>}
        </div>

        {carregando ? (
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((indice) => (
              <div key={indice} className="h-16 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : data.friends.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center">
            <span className="text-3xl" aria-hidden>
              🤝
            </span>
            <p className="mt-3 font-semibold text-white">Sua lista ainda está vazia</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
              Peça o <span className="font-mono text-aqua-300">@usuario</span> de um colega e use a
              busca acima. Depois que ele aceitar, vocês aparecem juntos no ranking de amigos.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {data.friends.map((pessoa) => (
              <li key={pessoa.id}>
                <PessoaRow perfil={pessoa}>
                  <span className="hidden text-xs text-slate-500 sm:block sm:self-center">
                    {levelTitle(pessoa.level)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={ocupado === pessoa.id}
                    aria-label={`Remover ${pessoa.name}`}
                    onClick={() => executar(pessoa.id, () => removeFriendship(meuId, pessoa.id))}
                  >
                    <UserMinus className="h-4 w-4" />
                    Remover
                  </Button>
                </PessoaRow>
              </li>
            ))}
          </ul>
        )}

        {data.friends.length > 0 && (
          <div className="mt-5">
            <LinkButton href="/ranking" variant="secondary" size="sm">
              Ver o ranking entre amigos
            </LinkButton>
          </div>
        )}
      </Card>

      {demoMode && (
        <p className="px-1 text-xs leading-relaxed text-slate-500">
          <strong className="text-amber-300">Modo demonstração:</strong> as amizades ficam salvas
          só neste dispositivo. Os perfis de exemplo (@ana_dev, @kauanfa, @luizjr) aceitam pedidos
          automaticamente, já que não há ninguém do outro lado para responder.
        </p>
      )}
    </div>
  );
}

export default function AmigosPage() {
  return (
    <AppShell>
      <AmigosContent />
    </AppShell>
  );
}
