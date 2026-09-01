-- ---------------------------------------------------------------------------
-- 0014 - A trilha de Python ganhou Listas e Dicionarios
--
-- Rodar DEPOIS da 0013, e DEPOIS de aplicar o `seed.sql` novo.
--
-- ---------------------------------------------------------------------------
-- O QUE MUDOU NA TRILHA
--
-- Dois modulos entraram no MEIO da trilha de Python, entre Repeticoes e
-- Funcoes:
--
--   Fundamentos > Variaveis > Condicionais > Repeticoes >
--   [Listas] > [Dicionarios] > Funcoes > Desafios > Projeto Final
--
-- Sao 8 licoes e 16 exercicios novos. O conteudo em si vem do `seed.sql`
-- (gerado por `npm run seed:gen` a partir de `src/content`) - esta migracao
-- nao cria licao nenhuma. Ela existe para o que o seed NAO consegue resolver.
--
-- ---------------------------------------------------------------------------
-- O PROBLEMA QUE ELA RESOLVE
--
-- "Trilha de Python concluida" e a tag "Pythonista" sao concedidas por
-- `language_completed`: todas as licoes da linguagem feitas. Quem terminou a
-- trilha ANTES desta mudanca cumpriu esse criterio com 24 licoes - e agora sao
-- 32. Essas pessoas continuariam ostentando "trilha concluida" faltando dois
-- modulos inteiros, e nunca mais seriam conferidas: a avaliacao so acontece no
-- instante do feito, e para elas esse instante ja passou.
--
-- Entao a medalha e a tag sao devolvidas - e SO elas. O progresso das licoes,
-- o XP, o nivel, o streak e todas as outras conquistas ficam exatamente como
-- estao: quem fez Fundamentos ate Funcoes fez de verdade, e nada disso mudou.
--
-- Assim que a pessoa concluir Listas e Dicionarios, a medalha e a tag voltam
-- sozinhas - pela avaliacao normal na tela, ou por `conquistas_reavaliar()`,
-- que confere o criterio contra as licoes que existem HOJE no banco.
--
-- Rodar esta migracao mais de uma vez e inofensivo: na segunda vez nao ha mais
-- ninguem para devolver.
-- ---------------------------------------------------------------------------

-- Sem as licoes novas no banco, a limpeza tiraria a medalha de quem esta com
-- ela por direito - e a devolucao so viria quando o seed fosse aplicado.
-- Melhor recusar do que deixar a base num estado intermediario.
do $$
declare
  faltando int;
begin
  select count(*) into faltando
    from (values ('py-lis-01'), ('py-lis-02'), ('py-lis-03'), ('py-lis-04'),
                 ('py-dic-01'), ('py-dic-02'), ('py-dic-03'), ('py-dic-04')) as esperadas(id)
   where not exists (select 1 from public.lessons l where l.id = esperadas.id);

  if faltando > 0 then
    raise exception
      'Aplique o seed.sql novo antes desta migracao: faltam % licoes de Listas/Dicionarios',
      faltando;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- A devolucao
--
-- Note o `not exists`: so perde quem REALMENTE nao completou mais a trilha.
-- Quem ja tiver feito os modulos novos (ninguem, hoje, mas a migracao precisa
-- ser correta em qualquer ordem de aplicacao) fica com o que tem.
-- ---------------------------------------------------------------------------

/**
 * As licoes que faltam a um jogador para concluir uma linguagem.
 *
 * `user_progress` nao tem coluna "completed": a EXISTENCIA da linha ja quer
 * dizer que a licao foi concluida. E a mesma leitura de
 * `conquistas_criterio_bate` (migracao 0010), de proposito - se as duas
 * discordassem, a medalha ficaria indo e voltando.
 */
create or replace function public.licoes_faltando(jogador uuid, linguagem text)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
    from public.lessons l
    join public.modules m  on m.id = l.module_id
    join public.languages la on la.id = m.language_id
   where la.slug = linguagem
     and not exists (
       select 1 from public.user_progress up
        where up.user_id = jogador and up.lesson_id = l.id
     );
$$;

delete from public.user_achievements ua
 where ua.achievement_id = 'trilha-python'
   and public.licoes_faltando(ua.user_id, 'python') > 0;

delete from public.user_tags ut
 where ut.tag_id = 'pythonista'
   and public.licoes_faltando(ut.user_id, 'python') > 0;

-- ---------------------------------------------------------------------------
-- Conferencia (aparece no resultado do SQL Editor)
-- ---------------------------------------------------------------------------
select
  (select count(*) from public.lessons l
     join public.modules m on m.id = l.module_id
     join public.languages la on la.id = m.language_id
    where la.slug = 'python')                                as licoes_de_python,
  (select count(*) from public.user_achievements
    where achievement_id = 'trilha-python')                  as ainda_com_a_medalha,
  (select count(*) from public.user_tags where tag_id = 'pythonista') as ainda_com_a_tag;
