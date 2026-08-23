-- ===========================================================================
-- CodeQuest - diagnostico de progresso (SOMENTE LEITURA)
--
-- Nao altera nada. Serve para responder uma pergunta: "meu progresso foi
-- apagado do banco, ou apenas nao apareceu na tela?".
--
-- Como usar: Supabase Studio > SQL Editor > New query > cole > Run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Todas as contas, com XP e quantas licoes cada uma tem registradas
-- ---------------------------------------------------------------------------
select
  p.id,
  p.name                                as nome,
  p.username,
  p.xp_total                            as xp_no_perfil,
  p.level                               as nivel,
  p.streak_count                        as streak,
  p.last_study_date                     as ultimo_estudo,
  (select count(*)  from public.user_progress     up where up.user_id = p.id) as licoes_concluidas,
  (select coalesce(sum(up.xp_earned), 0)
     from public.user_progress up where up.user_id = p.id)                    as xp_somado_das_licoes,
  (select count(*)  from public.user_achievements ua where ua.user_id = p.id) as conquistas,
  p.created_at                          as conta_criada_em,
  p.updated_at                          as perfil_alterado_em
from public.profiles p
order by p.xp_total desc;

-- ---------------------------------------------------------------------------
-- 2. Contas onde o XP do perfil nao bate com a soma das licoes
--
-- Se aparecer alguma linha aqui com `xp_no_perfil` MENOR que
-- `xp_somado_das_licoes`, o progresso existe e o XP pode ser reconstruido
-- com:  select * from public.reconciliar_xp('<id da linha>');
-- (precisa ter aplicado a migration 0003 antes)
-- ---------------------------------------------------------------------------
select
  p.id,
  p.name as nome,
  p.xp_total as xp_no_perfil,
  coalesce(sum(up.xp_earned), 0) as xp_somado_das_licoes,
  count(up.lesson_id) as licoes_concluidas
from public.profiles p
left join public.user_progress up on up.user_id = p.id
group by p.id, p.name, p.xp_total
having p.xp_total <> coalesce(sum(up.xp_earned), 0)
order by p.xp_total desc;

-- ---------------------------------------------------------------------------
-- 3. As licoes concluidas, uma a uma, da conta com mais XP
-- ---------------------------------------------------------------------------
select
  up.user_id,
  up.lesson_id,
  l.title as licao,
  up.xp_earned,
  up.flawless as sem_erros,
  up.completed_at as concluida_em
from public.user_progress up
left join public.lessons l on l.id = up.lesson_id
where up.user_id = (select id from public.profiles order by xp_total desc limit 1)
order by up.completed_at;

-- ---------------------------------------------------------------------------
-- 4. As protecoes estao no lugar?
--
-- Esperado: as tres linhas abaixo devolvem valores "true"/quantidade > 0.
-- ---------------------------------------------------------------------------
select
  (select count(*) from pg_trigger
     where tgname = 'profiles_guard_update' and not tgisinternal)          as gatilho_xp_nao_diminui,
  (select count(*) from pg_trigger
     where tgname = 'on_auth_user_created' and not tgisinternal)           as gatilho_cria_perfil,
  (select relrowsecurity from pg_class
     where oid = 'public.user_progress'::regclass)                         as rls_ligado_no_progresso,
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'user_progress'
       and cmd = 'DELETE')                                                 as policies_de_delete_no_progresso;

-- ---------------------------------------------------------------------------
-- 5. Quantas linhas de conteudo existem (se der 0, falta rodar o seed.sql)
-- ---------------------------------------------------------------------------
select
  (select count(*) from public.languages)    as linguagens,
  (select count(*) from public.modules)      as modulos,
  (select count(*) from public.lessons)      as licoes,
  (select count(*) from public.exercises)    as exercicios,
  (select count(*) from public.achievements) as conquistas_disponiveis;
