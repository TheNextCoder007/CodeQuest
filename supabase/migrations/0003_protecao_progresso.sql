-- ===========================================================================
-- CodeQuest - protecao extra do progresso do aluno
--
-- Como aplicar:
--   Supabase Studio > SQL Editor > New query > cole este arquivo > Run.
--   Rodar mais de uma vez e seguro.
--
-- Depende de `0001_init.sql`.
--
-- Por que existe: um perfil apareceu zerado na tela (0 XP, 0 licoes). A causa
-- estava no aplicativo, nao no banco - mas estas travas garantem que, mesmo
-- que um bug do cliente volte a acontecer, o banco recuse rebaixar dado de
-- aluno em vez de aceitar calado.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. xp_earned de uma licao nunca diminui
--
-- Refazer uma licao ja concluida nao concede XP de novo; se o cliente
-- regravar a linha com `xp_earned = 0`, o historico de quanto cada licao
-- rendeu se perde - e com ele a chance de reconstruir o XP total.
-- ---------------------------------------------------------------------------

create or replace function public.guard_progress_update()
returns trigger
language plpgsql
as $$
begin
  if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then
    raise exception 'Nao e permitido trocar o dono ou a licao de um progresso';
  end if;

  -- Mantem sempre o maior valor ja registrado.
  if new.xp_earned < old.xp_earned then
    new.xp_earned := old.xp_earned;
  end if;

  -- "Sem nenhum erro" e uma conquista: uma vez verdadeiro, continua verdadeiro.
  if old.flawless and not new.flawless then
    new.flawless := true;
  end if;

  return new;
end;
$$;

drop trigger if exists user_progress_guard_update on public.user_progress;
create trigger user_progress_guard_update
  before update on public.user_progress
  for each row execute function public.guard_progress_update();

-- ---------------------------------------------------------------------------
-- 2. Gatilho do perfil, agora com uma porta para reconciliacao
--
-- Mesmas protecoes de antes (XP nao cai, salto absurdo barrado, id fixo),
-- mas `public.reconciliar_xp()` pode ultrapassar o limite de salto - porque
-- ele so soma o que ja esta registrado em user_progress.
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
as $$
declare
  reconciliando boolean := coalesce(
    current_setting('codequest.reconciliando', true), ''
  ) = 'on';
begin
  if new.id <> old.id then
    raise exception 'Nao e permitido alterar o id do perfil';
  end if;

  if new.xp_total < old.xp_total then
    raise exception 'O XP nao pode diminuir';
  end if;

  -- A licao mais valiosa da trilha vale 280 XP; 500 e uma folga segura.
  if not reconciliando and new.xp_total - old.xp_total > 500 then
    raise exception 'Ganho de XP acima do permitido em uma unica atualizacao';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- 3. Reconstruir o XP a partir do progresso registrado
--
-- Uso (no SQL Editor, para uma conta especifica):
--     select * from public.reconciliar_xp('cole-o-uuid-aqui');
--
-- Uso pelo proprio aluno dentro do app (se um dia for chamado de la):
--     select * from public.reconciliar_xp();
--
-- So AUMENTA o XP: se o perfil ja tem mais do que a soma das licoes (por
-- causa de XP de exercicios avulsos), nada muda.
-- ---------------------------------------------------------------------------

create or replace function public.reconciliar_xp(alvo uuid default auth.uid())
returns table (xp_anterior int, xp_atual int, licoes int)
language plpgsql
security definer
set search_path = public
as $$
declare
  soma int;
  antes int;
begin
  if alvo is null then
    raise exception 'Informe o id do usuario';
  end if;

  select coalesce(sum(xp_earned), 0)::int, count(*)::int
    into soma, licoes
    from public.user_progress
   where user_id = alvo;

  select p.xp_total into antes from public.profiles p where p.id = alvo;
  if antes is null then
    raise exception 'Perfil % nao encontrado', alvo;
  end if;

  if soma > antes then
    perform set_config('codequest.reconciliando', 'on', true);
    update public.profiles
       set xp_total = soma,
           level = greatest(1, (soma / 100) + 1)
     where id = alvo;
    perform set_config('codequest.reconciliando', 'off', true);
  end if;

  xp_anterior := antes;
  select p.xp_total into xp_atual from public.profiles p where p.id = alvo;
  return next;
end;
$$;

revoke all on function public.reconciliar_xp(uuid) from public;
grant execute on function public.reconciliar_xp(uuid) to authenticated;
