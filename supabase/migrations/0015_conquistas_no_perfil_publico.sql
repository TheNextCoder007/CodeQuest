-- ---------------------------------------------------------------------------
-- 0015 - As conquistas aparecem no perfil publico
--
-- Rodar DEPOIS da 0014.
--
-- ---------------------------------------------------------------------------
-- O BUG
--
-- No perfil de outra pessoa, a secao "🏆 Conquistas" sempre mostrava
-- "0 de 45" e "Nenhuma conquista desbloqueada ainda" - mesmo para quem tinha
-- dezenas delas. As tags, logo acima, apareciam normalmente.
--
-- A CAUSA
--
-- `user_tags` ganhou leitura publica na 0004, quando o perfil publico foi
-- criado. `user_achievements` ficou com a policy da 0001:
--
--     using (auth.uid() = user_id)      -- so as minhas
--
-- Ou seja: a tela sempre pediu as conquistas do outro, e o banco sempre
-- devolveu zero linhas.
--
-- O que fez isso passar despercebido por tanto tempo: RLS **filtra linhas, nao
-- levanta erro**. A consulta volta com sucesso e uma lista vazia, e "lista
-- vazia" e indistinguivel de "essa pessoa nao tem conquista nenhuma". Nao ha
-- mensagem de erro em lugar nenhum - nem na tela, nem no console.
--
-- A CORRECAO
--
-- Leitura publica, igual a de `user_tags`. E o mesmo tipo de dado e o mesmo
-- proposito: sao os dois feitos que o perfil publico existe para mostrar.
--
-- O QUE **NAO** MUDA
--
--   * escrita continua restrita ao dono (`auth.uid() = user_id`) - ninguem
--     concede conquista para outra pessoa;
--   * `user_progress` continua privado. O progresso licao a licao nao e da
--     conta de ninguem, e por isso `completedLessonIds` chega vazio no perfil
--     publico (ver `fetchPerfilPublico`);
--   * e-mail continua fora de alcance: ele nem existe em `profiles`, mora em
--     `auth.users`, que nenhum cliente le.
--
-- A linha de `user_achievements` tem `user_id`, `achievement_id` e
-- `unlocked_at` - nada mais. Nenhum dado sensivel.
-- ---------------------------------------------------------------------------

drop policy if exists "le as proprias conquistas" on public.user_achievements;
drop policy if exists "conquistas de todos sao visiveis" on public.user_achievements;

create policy "conquistas de todos sao visiveis"
  on public.user_achievements for select
  to authenticated
  using (true);

-- As policies de escrita da 0001 continuam valendo e sao repetidas aqui para
-- esta migracao poder ser lida sozinha - e para o `drop` acima nunca deixar a
-- tabela sem regra de insercao, caso alguem rode so este arquivo.
drop policy if exists "grava as proprias conquistas" on public.user_achievements;
create policy "grava as proprias conquistas"
  on public.user_achievements for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "atualiza as proprias conquistas" on public.user_achievements;
create policy "atualiza as proprias conquistas"
  on public.user_achievements for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Conferencia (aparece no resultado do SQL Editor)
-- ---------------------------------------------------------------------------
select policyname, cmd, qual::text as condicao
  from pg_policies
 where schemaname = 'public' and tablename = 'user_achievements'
 order by cmd, policyname;
