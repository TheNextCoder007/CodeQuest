-- ===========================================================================
-- CodeQuest - conteudo das trilhas (ARQUIVO GERADO)
--
-- Nao edite este arquivo a mao: ele e produzido por `npm run seed:gen` a
-- partir de `src/content`. Para mudar uma licao, edite o TypeScript e gere
-- de novo.
--
-- Como aplicar: Supabase Studio > SQL Editor > cole > Run.
-- Rodar mais de uma vez e seguro (usa ON CONFLICT DO UPDATE).
-- ===========================================================================

begin;

-- Linguagens ---------------------------------------------------------------
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('python', 'Python', 'python', '🐍', 'A linguagem mais amigável para começar. Trilha completa disponível.', true, 1)
  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,
  description = excluded.description, available = excluded.available, order_index = excluded.order_index;
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('javascript', 'JavaScript', 'javascript', '🟨', 'A linguagem da web, presente em todo navegador. Trilha completa disponível.', true, 2)
  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,
  description = excluded.description, available = excluded.available, order_index = excluded.order_index;
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('java', 'Java', 'java', '☕', 'Forte no mercado corporativo. Trilha em produção.', false, 3)
  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,
  description = excluded.description, available = excluded.available, order_index = excluded.order_index;
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('csharp', 'C#', 'csharp', '🎯', 'Ecossistema .NET e desenvolvimento de jogos. Trilha em produção.', false, 4)
  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,
  description = excluded.description, available = excluded.available, order_index = excluded.order_index;
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('cpp', 'C++', 'cpp', '⚡', 'Performance e proximidade com o hardware. Trilha em produção.', false, 5)
  on conflict (id) do update set name = excluded.name, slug = excluded.slug, icon = excluded.icon,
  description = excluded.description, available = excluded.available, order_index = excluded.order_index;

-- Trilha de Python ----------------------------------------------------
insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-fundamentos', 'python', 'Fundamentos', 'O que é programar, como o computador lê o seu código e como fazer a primeira coisa aparecer na tela.', '🐣', 1)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-fund-01', 'py-fundamentos', 'O que é programar?', 'Instruções, ordem e previsibilidade', '## Programar é dar instruções

Um computador não adivinha nada. Ele faz **exatamente** o que você mandou, **na ordem em que você mandou**.

Pense em uma receita de bolo: se você inverter "colocar no forno" com "misturar os ingredientes", o resultado muda. Um programa funciona igual — ele é uma lista de instruções executadas de cima para baixo, uma por vez.

## As três ideias que sustentam tudo

- **Sequência** — as instruções acontecem em ordem, uma depois da outra.
- **Decisão** — o programa escolhe caminhos diferentes dependendo de uma condição (você vai ver isso no módulo 🔀 Condicionais).
- **Repetição** — o programa repete um trecho várias vezes sem você reescrever (módulo 🔁 Repetições).

Toda linguagem de programação — Python, JavaScript, Java, C#, C++ — implementa essas três ideias. **O conceito é o mesmo, só a sintaxe muda.** É por isso que aqui a gente ensina o conceito primeiro.

## Por que Python primeiro?

Porque a sintaxe do Python é a mais próxima do português/inglês comum. Compare a instrução "mostre a palavra Olá na tela":

~~~py
print("Olá")
~~~

Sem ponto e vírgula, sem chaves, sem declarar classe nenhuma. Você gasta sua energia entendendo a **lógica**, não decorando pontuação.', '[{"language":"Python","code":"print(\"Olá\")"},{"language":"JavaScript","code":"console.log(\"Olá\");"},{"language":"Java","code":"System.out.println(\"Olá\");"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-01-e1', 'py-fund-01', 'Um programa executa suas instruções em qual ordem?',
  null, 'multiple_choice', 'De cima para baixo, uma instrução por vez',
  '["De cima para baixo, uma instrução por vez","Em ordem alfabética das palavras","Todas ao mesmo tempo, instantaneamente","Da última linha para a primeira"]'::jsonb, null, null,
  'Isso mesmo. O interpretador do Python lê o arquivo de cima para baixo e executa cada linha na sequência. Essa previsibilidade é o que permite você raciocinar sobre o que o programa vai fazer antes de rodar.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-01-e2', 'py-fund-01', 'O mesmo conceito muda de sintaxe em cada linguagem. Qual destas linhas mostra um texto na tela **em Python**?',
  null, 'multiple_choice', 'print("Olá")',
  '["print(\"Olá\")","console.log(\"Olá\");","System.out.println(\"Olá\");","cout << \"Olá\";"]'::jsonb, null, null,
  'As quatro linhas fazem a mesma coisa — cada uma na sua linguagem. `console.log` é JavaScript, `System.out.println` é Java e `cout <<` é C++. Em Python, é `print()`.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-fund-02', 'py-fundamentos', 'Sua primeira linha de código', 'A função print()', '## print(): a janela do seu programa

`print()` é a instrução que mostra alguma coisa na tela. Tudo que estiver **dentro dos parênteses** é exibido.

~~~py
print("Bem-vindo ao CodeQuest")
~~~

Saída:

~~~text
Bem-vindo ao CodeQuest
~~~

## Aspas importam

Texto (o que chamamos de **string**) precisa estar entre aspas. Aspas simples ou duplas, tanto faz — desde que você abra e feche com a mesma.

~~~py
print("funciona")
print(''também funciona'')
~~~

Se você esquecer as aspas, o Python vai achar que você está falando de uma **variável** com aquele nome e vai reclamar que ela não existe.

## Vários prints, várias linhas

Cada `print()` termina pulando para a linha seguinte:

~~~py
print("Linha 1")
print("Linha 2")
~~~

~~~text
Linha 1
Linha 2
~~~

> Dica: no CodeQuest, o botão **Executar** roda o seu código de verdade — é o Python rodando dentro do seu navegador, via Pyodide. O que aparecer no terminal é a saída real.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-02-e1', 'py-fund-02', 'Escreva um programa que mostre exatamente o texto:

~~~text
Olá, CodeQuest!
~~~',
  '# Escreva seu código abaixo
', 'output_match', 'Olá, CodeQuest!',
  null, null, 'Use print() com o texto entre aspas, exatamente como pedido (inclusive a vírgula e a exclamação).',
  'A saída precisa bater caractere por caractere. `print("Olá, CodeQuest!")` produz exatamente a linha esperada.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-02-e2', 'py-fund-02', 'Agora duas linhas. Faça o programa mostrar:

~~~text
Meu nome é Dev
Estou aprendendo Python
~~~',
  'print("Meu nome é Dev")
# falta a segunda linha
', 'output_match', 'Meu nome é Dev
Estou aprendendo Python',
  null, null, 'Cada print() já pula de linha sozinho. Você só precisa de um segundo print().',
  'Dois `print()` em sequência geram duas linhas, porque cada um adiciona uma quebra de linha ao final automaticamente.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-fund-03', 'py-fundamentos', 'Comentários', 'Escrevendo para humanos, não só para a máquina', '## Código também é leitura

Um **comentário** é um trecho que o Python ignora completamente ao executar. Ele existe para explicar o *porquê* de alguma coisa — para você daqui a duas semanas, ou para o colega de grupo.

Em Python, o comentário começa com `#` e vale até o fim da linha:

~~~py
# calcula o preço final já com o desconto de 10%
preco = 100
print(preco)
~~~

## O que comentar (e o que não comentar)

Comentário bom explica **por que**, não **o que**:

~~~py
# ruim: repete o óbvio
print("Olá")  # mostra Olá

# bom: explica a decisão
# a nota mínima é 6.0 por regra da instituição
nota_minima = 6.0
~~~

## Comentário no meio do código

Você também pode comentar temporariamente uma linha para testar sem ela — isso se chama "comentar código" e é uma técnica de depuração que você vai usar muito:

~~~py
print("essa roda")
# print("essa não roda")
~~~

O conceito existe em todas as linguagens; só o símbolo muda.', '[{"language":"Python","code":"# um comentário"},{"language":"JavaScript","code":"// um comentário"},{"language":"Java","code":"// um comentário"},{"language":"C++","code":"// um comentário"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-03-e1', 'py-fund-03', 'Qual símbolo inicia um comentário de uma linha em Python?',
  null, 'fill_blank', '#|hashtag|cerquilha|jogo da velha',
  null, null, 'É o mesmo símbolo usado em hashtags nas redes sociais.',
  'Em Python o comentário de linha começa com `#`. Em JavaScript, Java, C# e C++ o equivalente é `//`.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-03-e2', 'py-fund-03', 'O código abaixo deveria mostrar **apenas** a linha `Relatório final`. Comente a linha que não deve aparecer.',
  'print("teste temporário")
print("Relatório final")
', 'output_match', 'Relatório final',
  null, null, 'Coloque um # no começo da primeira linha.',
  'Ao colocar `#` no início da linha, o Python ignora aquele `print()` inteiro — sobra só a saída desejada.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-fund-04', 'py-fundamentos', 'Quando dá erro', 'Ler a mensagem é metade da solução', '## Errar faz parte (sério)

Todo programador erra o tempo todo. A diferença entre quem trava e quem resolve é **ler a mensagem de erro** em vez de fechar os olhos para ela.

## Os dois erros mais comuns no começo

**1. SyntaxError** — você escreveu algo que o Python não consegue nem interpretar. Geralmente é um parêntese ou aspa faltando:

~~~py
print("Olá"
~~~

~~~text
SyntaxError: ''('' was never closed
~~~

**2. NameError** — você usou um nome que não existe. Quase sempre é aspas esquecidas ou um erro de digitação:

~~~py
print(Olá)
~~~

~~~text
NameError: name ''Olá'' is not defined
~~~

## Como ler o erro

A mensagem tem três partes úteis:

- **a linha** onde o Python travou (às vezes o problema está na linha *anterior*);
- **o tipo** do erro (SyntaxError, NameError, TypeError...);
- **a descrição** do que ele esperava encontrar.

> No CodeQuest, quando seu código dá erro, a mensagem original do Python aparece no terminal. Leia sempre a **última linha** dela primeiro: é ali que está o resumo.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-04-e1', 'py-fund-04', 'O programa `print(Olá)` gera `NameError: name ''Olá'' is not defined`. Qual é a causa?',
  null, 'multiple_choice', 'Faltaram as aspas: sem elas o Python procura uma variável chamada Olá',
  '["Faltaram as aspas: sem elas o Python procura uma variável chamada Olá","O Python não aceita acentos em nenhum lugar do código","A função print() não existe em Python","Faltou ponto e vírgula no final da linha"]'::jsonb, null, null,
  'Sem aspas, `Olá` deixa de ser texto e vira o nome de uma variável. Como nenhuma variável com esse nome foi criada, o Python levanta `NameError`. Python aceita acentos normalmente dentro de strings.', 25, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-04-e2', 'py-fund-04', 'Conserte o código abaixo para que ele mostre `Tudo certo!` sem erro nenhum.',
  'print("Tudo certo!"
', 'output_match', 'Tudo certo!',
  null, null, 'Conte os parênteses: quantos abrem e quantos fecham?',
  'Faltava fechar o parêntese do `print()`. Erros de sintaxe assim são detectados antes mesmo do programa começar a rodar.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-fund-05', 'py-fundamentos', 'Conversando com o usuário', 'A função input()', '## Programas que perguntam

Até agora seus programas só falavam. Com `input()` eles passam a **ouvir**:

~~~py
nome = input("Qual é o seu nome? ")
print("Olá,", nome)
~~~

O que acontece aqui, em ordem:

1. o texto `"Qual é o seu nome? "` aparece na tela;
2. o programa **para** e espera a pessoa digitar algo e apertar Enter;
3. o que foi digitado é guardado na caixinha `nome`;
4. o `print()` usa esse valor.

## print() com vírgula

Quando você separa valores por vírgula dentro do `print()`, o Python junta tudo colocando **um espaço** entre eles:

~~~py
print("Olá,", "mundo")
~~~

~~~text
Olá, mundo
~~~

## Atenção: input() sempre devolve texto

Mesmo que a pessoa digite `18`, o que chega no seu programa é o **texto** `"18"`, não o número 18. Isso vai importar muito no módulo 📦 Variáveis — e é a origem de um dos erros mais clássicos de quem está começando.

> No CodeQuest os exercícios com `input()` já vêm com as respostas simuladas, então o programa roda direto sem você precisar digitar nada.', null, 5)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-05-e1', 'py-fund-05', 'Complete o programa para que ele pergunte a cidade e mostre `Boa viagem para Recife`.

A resposta simulada do usuário é **Recife**.',
  'cidade = input("De qual cidade você é? ")
# mostre a mensagem final aqui
', 'output_match', 'De qual cidade você é? Boa viagem para Recife',
  null, '["Recife"]'::jsonb, 'Use print("Boa viagem para", cidade) — a vírgula coloca o espaço automaticamente.',
  'Repare que a pergunta do `input()` também aparece na saída: ela é impressa na mesma linha, e por isso o resultado esperado começa com o texto da pergunta.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-fund-05-e2', 'py-fund-05', 'O que `input()` sempre devolve, independente do que a pessoa digitar?',
  null, 'multiple_choice', 'Uma string (texto)',
  '["Uma string (texto)","Um número inteiro","O tipo mais adequado, detectado automaticamente","Um valor verdadeiro ou falso"]'::jsonb, null, null,
  'Sempre texto. Para fazer contas com o que foi digitado, você precisa converter com `int()` ou `float()` — assunto do próximo módulo.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-variaveis', 'python', 'Variáveis', 'Guardar informação na memória, dar nome a ela e entender que todo valor tem um tipo.', '📦', 2)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-var-01', 'py-variaveis', 'O que é uma variável', 'Uma caixa com etiqueta', '## Guardando um valor

Uma **variável** é um espaço na memória que guarda um valor e recebe um nome. Você cria uma variável simplesmente atribuindo um valor a um nome:

~~~py
idade = 18
~~~

Leia isso como "**idade recebe 18**", nunca como "idade é igual a 18". O sinal `=` aqui é **atribuição**: ele coloca o valor da direita na caixa da esquerda.

## O valor pode mudar

É por isso que se chama *variável*:

~~~py
pontos = 0
print(pontos)
pontos = 50
print(pontos)
~~~

~~~text
0
50
~~~

A segunda atribuição substitui a primeira. A caixa é a mesma; o conteúdo mudou.

## Nomes de variáveis

Regras do Python:

- podem ter letras, números e `_`, mas **não podem começar com número**;
- não podem ter espaço nem traço (`-`);
- diferenciam maiúsculas de minúsculas: `idade` e `Idade` são variáveis diferentes.

E uma regra de bom senso que vale mais que todas: **o nome deve dizer o que a variável guarda**. `x` não diz nada; `nota_final` diz tudo.

~~~py
# ruim
a = 7.5

# bom
nota_final = 7.5
~~~', '[{"language":"Python","code":"idade = 18"},{"language":"JavaScript","code":"let idade = 18;"},{"language":"Java","code":"int idade = 18;"},{"language":"C#","code":"int idade = 18;"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-01-e1', 'py-var-01', 'Crie uma variável chamada `nome` com o valor `Ana` e mostre-a na tela.

Saída esperada:

~~~text
Ana
~~~',
  '# crie a variável e mostre o valor
', 'output_match', 'Ana',
  null, null, 'Primeiro nome = "Ana", depois print(nome) — sem aspas no print, senão você mostra a palavra "nome".',
  '`nome = "Ana"` guarda o texto na variável e `print(nome)` mostra o **conteúdo** dela. Se você escrevesse `print("nome")`, apareceria a palavra nome.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-01-e2', 'py-var-01', 'Qual destes nomes de variável é **inválido** em Python?',
  null, 'multiple_choice', '2nota',
  '["2nota","nota_2","segunda_nota","_nota"]'::jsonb, null, null,
  'Nomes de variável não podem começar com número. `nota_2`, `segunda_nota` e `_nota` são todos válidos.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-var-02', 'py-variaveis', 'Tipos de dados', 'int, float, str e bool', '## Todo valor tem um tipo

O tipo define **o que dá para fazer** com aquele valor. Os quatro tipos básicos do Python:

| Tipo | O que guarda | Exemplo |
| --- | --- | --- |
| `int` | número inteiro | `18`, `-3`, `0` |
| `float` | número com casas decimais | `7.5`, `3.14` |
| `str` | texto (string) | `"Ana"`, `''oi''` |
| `bool` | verdadeiro ou falso | `True`, `False` |

Repare: em Python, decimal usa **ponto**, não vírgula. E `True`/`False` começam com maiúscula.

## Descobrindo o tipo

A função `type()` responde qual é o tipo de um valor:

~~~py
print(type(18))
print(type(7.5))
print(type("Ana"))
print(type(True))
~~~

~~~text
<class ''int''>
<class ''float''>
<class ''str''>
<class ''bool''>
~~~

## O mesmo símbolo, comportamentos diferentes

O tipo muda o significado da operação. Compare:

~~~py
print(2 + 3)
print("2" + "3")
~~~

~~~text
5
23
~~~

Com números, `+` **soma**. Com strings, `+` **junta** (concatena). Não é o Python sendo confuso — é o mesmo operador se comportando de acordo com o tipo dos valores.

E se você misturar os dois, dá erro:

~~~py
print("2" + 3)
~~~

~~~text
TypeError: can only concatenate str (not "int") to str
~~~', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-02-e1', 'py-var-02', 'Qual é o tipo do valor `7.5` em Python?',
  null, 'multiple_choice', 'float',
  '["float","int","str","bool"]'::jsonb, null, null,
  'Números com casas decimais são `float`. Se fosse `7`, sem o ponto, seria `int`.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-02-e2', 'py-var-02', 'Sem rodar mentalmente nada difícil: escreva um programa que mostre o resultado de `"10" + "5"` e depois de `10 + 5`, nessa ordem.

Saída esperada:

~~~text
105
15
~~~',
  '# dois prints: um com strings, outro com números
', 'output_match', '105
15',
  null, null, 'print("10" + "5") junta os textos; print(10 + 5) soma os números.',
  'Esse é o exercício que fixa a ideia central do módulo: o **tipo** decide o comportamento do operador. Concatenação com strings, soma com números.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-var-03', 'py-variaveis', 'Convertendo tipos', 'int(), float() e str()', '## O problema clássico

Lembra que `input()` sempre devolve texto? Então este programa **não funciona**:

~~~py
idade = input("Idade: ")
print(idade + 1)
~~~

~~~text
TypeError: can only concatenate str (not "int") to str
~~~

O Python está certo: você pediu para juntar o texto `"18"` com o número `1`, e isso não faz sentido.

## Convertendo

As funções de conversão transformam um valor em outro tipo:

- `int(valor)` → número inteiro
- `float(valor)` → número decimal
- `str(valor)` → texto

~~~py
idade = int(input("Idade: "))
print(idade + 1)
~~~

Agora `idade` guarda o número 18 e a conta funciona.

## Lendo de dentro para fora

`int(input("Idade: "))` parece confuso, mas leia **de dentro para fora**:

1. `input("Idade: ")` → pergunta e devolve o texto `"18"`;
2. `int("18")` → converte esse texto no número `18`;
3. `idade = ...` → guarda o resultado.

## Cuidado

Se o texto não representar um número, a conversão falha:

~~~py
int("abc")
~~~

~~~text
ValueError: invalid literal for int() with base 10: ''abc''
~~~', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-03-e1', 'py-var-03', 'Complete o código para que o programa some 10 ao número digitado.

O usuário digita **32**. Saída esperada:

~~~text
Digite um número: 42
~~~',
  'numero = input("Digite um número: ")
print(numero + 10)
', 'output_match', 'Digite um número: 42',
  null, '["32"]'::jsonb, 'Envolva o input() com int(...) para transformar o texto em número.',
  '`int(input(...))` é o padrão que você vai repetir centenas de vezes: ler texto e converter na hora para número.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-03-e2', 'py-var-03', 'Qual função converte um texto como `"3.5"` em um número com casas decimais?',
  null, 'fill_blank', 'float|float()|float(x)',
  null, null, 'É o nome do próprio tipo decimal.',
  '`float("3.5")` devolve o número 3.5. Se você usasse `int("3.5")` daria erro, porque o texto não representa um inteiro.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-var-04', 'py-variaveis', 'Contas e f-strings', 'Operadores e texto formatado', '## Operadores aritméticos

~~~py
a = 7
b = 2

print(a + b)   # soma
print(a - b)   # subtração
print(a * b)   # multiplicação
print(a / b)   # divisão (sempre float)
print(a // b)  # divisão inteira
print(a % b)   # resto da divisão
print(a ** b)  # potência
~~~

~~~text
9
5
14
3.5
3
1
49
~~~

Dois merecem atenção especial, porque você vai usá-los muito:

- `//` devolve só a parte inteira da divisão — é assim que o CodeQuest calcula o seu **nível** a partir do XP;
- `%` devolve o resto — é assim que se descobre se um número é par (`n % 2 == 0`).

## f-strings: juntando texto e valores

Concatenar com `+` é chato porque exige converter tudo para texto. A **f-string** resolve isso: coloque `f` antes das aspas e use `{}` para inserir valores.

~~~py
nome = "Ana"
nota = 9.5

print("Aluno: " + nome + " nota: " + str(nota))
print(f"Aluno: {nome} nota: {nota}")
~~~

As duas linhas produzem o mesmo resultado, mas a segunda é muito mais legível:

~~~text
Aluno: Ana nota: 9.5
Aluno: Ana nota: 9.5
~~~

Dentro das chaves você pode até fazer contas:

~~~py
print(f"O dobro de {nota} é {nota * 2}")
~~~', '[{"language":"Python","code":"print(f\"Olá, {nome}\")"},{"language":"JavaScript","code":"console.log(`Olá, ${nome}`);"},{"language":"Java","code":"System.out.printf(\"Olá, %s%n\", nome);"}]'::jsonb, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-04-e1', 'py-var-04', 'Use uma f-string para mostrar a média das duas notas.

Saída esperada:

~~~text
A média de Ana é 8.0
~~~',
  'nome = "Ana"
nota1 = 7.0
nota2 = 9.0
# mostre a média usando f-string
', 'output_match', 'A média de Ana é 8.0',
  null, null, 'print(f"A média de {nome} é {(nota1 + nota2) / 2}") — repare nos parênteses da conta.',
  'A divisão em Python sempre devolve `float`, por isso a média aparece como `8.0` e não `8`. Dá para fazer a conta direto dentro das chaves da f-string.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-var-04-e2', 'py-var-04', 'Qual operador devolve o **resto** de uma divisão?',
  null, 'multiple_choice', '%',
  '["%","//","/","**"]'::jsonb, null, null,
  '`%` é o resto (módulo): `7 % 2` vale 1. Já `//` é a divisão inteira: `7 // 2` vale 3.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-condicionais', 'python', 'Condicionais', 'Fazer o programa tomar decisões: caminhos diferentes para situações diferentes.', '🔀', 3)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-cond-01', 'py-condicionais', 'A ideia de decisão', 'O comando if', '## Nem todo código roda sempre

Até aqui, todas as linhas dos seus programas sempre executavam. Com a **condicional**, um trecho só roda **se** uma condição for verdadeira.

~~~py
nota = 8

if nota >= 6:
    print("Aprovado")
~~~

Leia em português: "**se** nota for maior ou igual a 6, mostre Aprovado".

## Os operadores de comparação

| Operador | Significado |
| --- | --- |
| `==` | é igual a |
| `!=` | é diferente de |
| `>` | maior que |
| `<` | menor que |
| `>=` | maior ou igual a |
| `<=` | menor ou igual a |

Atenção ao `==` de comparação contra o `=` de atribuição. `idade = 18` **guarda** 18 na variável; `idade == 18` **pergunta** se ela vale 18 e devolve `True` ou `False`.

## A indentação é obrigatória

Em Python, o que pertence ao `if` é definido pelos **espaços no começo da linha** (indentação, por convenção 4 espaços):

~~~py
if nota >= 6:
    print("Aprovado")      # dentro do if
    print("Parabéns!")     # dentro do if
print("Fim do boletim")    # fora do if, sempre roda
~~~

Em Java, C# e C++ esse agrupamento é feito com chaves `{ }` — o conceito é idêntico, muda só a forma de marcar o bloco. Em Python, esquecer a indentação gera `IndentationError`.', '[{"language":"Python","code":"if idade >= 18:\n    print(\"Maior de idade\")"},{"language":"JavaScript","code":"if (idade >= 18) {\n  console.log(\"Maior de idade\");\n}"},{"language":"Java","code":"if (idade >= 18) {\n  System.out.println(\"Maior de idade\");\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-01-e1', 'py-cond-01', 'Qual operador **compara** se dois valores são iguais?',
  null, 'multiple_choice', '==',
  '["==","=","!=","=>"]'::jsonb, null, null,
  '`==` compara e devolve True/False. `=` atribui um valor a uma variável. Confundir os dois é um dos erros mais comuns de quem está começando.', 25, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-01-e2', 'py-cond-01', 'Complete o `if` para que o programa mostre `Tem desconto` quando o valor da compra passar de 100.

Saída esperada:

~~~text
Tem desconto
~~~',
  'compra = 150

# escreva o if aqui
print("Tem desconto")
', 'output_match', 'Tem desconto',
  null, null, 'if compra > 100: e na linha seguinte o print com 4 espaços de indentação.',
  'A estrutura é `if condição:` seguida do bloco indentado. Como `compra` vale 150, a condição é verdadeira e o print executa.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-cond-02', 'py-condicionais', 'Maior de idade', 'O desafio clássico do CodeQuest', '## O desafio

Este é o exercício que deu origem ao CodeQuest. Ele é simples de enunciar e junta tudo que você viu até agora: entrada, conversão, comparação e saída.

> **Crie um programa que informe se uma pessoa é maior de idade.**

## Quebrando o problema em partes

Antes de escrever qualquer linha, descreva a solução em português:

1. perguntar a idade da pessoa;
2. transformar o que foi digitado em número;
3. se a idade for 18 ou mais → "Maior de idade";
4. senão → "Menor de idade".

Essa tradução do problema para passos é **a** habilidade central da programação. A sintaxe vem depois.

## O comando else

O `else` cobre todos os casos em que a condição do `if` deu falso:

~~~py
idade = 20

if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")
~~~

Exatamente um dos dois blocos vai executar — nunca os dois, nunca nenhum.

## Por que 18 e não 19?

Porque a condição é "**18 ou mais**", então o operador é `>=`. Se você usasse `>`, quem tem exatamente 18 anos seria classificado como menor — um erro de lógica que o programa não acusa, porque para o computador ele está funcionando perfeitamente. Esse tipo de detalhe é o que separa código que roda de código que está correto.', '[{"language":"Python","code":"idade = int(input(\"Digite sua idade: \"))\nif idade >= 18:\n    print(\"Maior de idade\")\nelse:\n    print(\"Menor de idade\")"},{"language":"JavaScript","code":"const idade = Number(prompt(\"Digite sua idade: \"));\nif (idade >= 18) {\n  console.log(\"Maior de idade\");\n} else {\n  console.log(\"Menor de idade\");\n}"},{"language":"Java","code":"int idade = sc.nextInt();\nif (idade >= 18) {\n  System.out.println(\"Maior de idade\");\n} else {\n  System.out.println(\"Menor de idade\");\n}"}]'::jsonb, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-02-e1', 'py-cond-02', '**Crie um programa que informe se uma pessoa é maior de idade.**

Pergunte a idade com `input("Digite sua idade: ")`, converta para número e mostre `Maior de idade` ou `Menor de idade`.

A idade simulada é **18**. Saída esperada:

~~~text
Digite sua idade: Maior de idade
~~~',
  'idade = int(input("Digite sua idade: "))

# escreva aqui a decisão
', 'output_match', 'Digite sua idade: Maior de idade',
  null, '["18"]'::jsonb, 'if idade >= 18: print("Maior de idade") / else: print("Menor de idade"). Lembre da indentação de 4 espaços.',
  'Você acabou de escrever o programa que ilustra o CodeQuest inteiro: entrada do usuário, conversão de tipo, decisão e saída. Repare que com idade exatamente 18 o `>=` é essencial — com `>` a resposta sairia errada.', 100, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-02-e2', 'py-cond-02', 'Testando o mesmo programa com outra entrada. Agora a idade simulada é **15**.

Saída esperada:

~~~text
Digite sua idade: Menor de idade
~~~',
  'idade = int(input("Digite sua idade: "))

# o mesmo programa da questão anterior
', 'output_match', 'Digite sua idade: Menor de idade',
  null, '["15"]'::jsonb, 'É exatamente o mesmo código do exercício anterior — o que muda é só a entrada.',
  'Testar o mesmo código com entradas diferentes é o que chamamos de **teste de caso**. Um programa só está pronto quando você verificou os dois caminhos da condicional.', 50, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-cond-03', 'py-condicionais', 'Mais de dois caminhos', 'if / elif / else', '## Quando duas opções não bastam

Para classificar uma nota em conceitos A, B, C e D, você precisa de mais de dois caminhos. É aí que entra o `elif` (contração de "else if"):

~~~py
nota = 8.5

if nota >= 9:
    print("Conceito A")
elif nota >= 7:
    print("Conceito B")
elif nota >= 5:
    print("Conceito C")
else:
    print("Conceito D")
~~~

~~~text
Conceito B
~~~

## A ordem é tudo

O Python testa as condições **de cima para baixo** e para na primeira que der verdadeira. Todas as outras são ignoradas, mesmo que também fossem verdadeiras.

Foi por isso que `8.5` virou B: ele não é `>= 9`, mas é `>= 7`, então parou ali — sem nem testar o `>= 5`.

Agora veja o mesmo código com a ordem invertida:

~~~py
nota = 8.5

if nota >= 5:
    print("Conceito C")
elif nota >= 7:
    print("Conceito B")
~~~

Aqui **todo mundo** com nota acima de 5 vira C, e o `elif` nunca é alcançado. O código roda sem erro e produz resultados errados — de novo, um bug de lógica, não de sintaxe.

## Regrinha prática

Quando as faixas são numéricas, escreva as condições **da mais restritiva para a mais ampla**.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-03-e1', 'py-cond-03', 'Classifique a temperatura: acima de 30 → `Calor`, entre 15 e 30 → `Ameno`, abaixo de 15 → `Frio`.

A temperatura é **12**. Saída esperada:

~~~text
Frio
~~~',
  'temperatura = 12

# use if / elif / else
', 'output_match', 'Frio',
  null, null, 'if temperatura > 30: ... elif temperatura >= 15: ... else: print("Frio")',
  'Com 12 graus as duas primeiras condições dão falso, então o `else` assume. O `else` é a rede de segurança: ele cobre tudo que não se encaixou antes.', 45, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-03-e2', 'py-cond-03', 'Com `nota = 9.5`, o que este código mostra?

~~~py
if nota >= 5:
    print("C")
elif nota >= 9:
    print("A")
~~~',
  null, 'multiple_choice', 'C',
  '["C","A","C e A","Nada, dá erro"]'::jsonb, null, null,
  'A primeira condição já é verdadeira (9.5 >= 5), então o Python executa aquele bloco e **pula todo o resto** da cadeia. O `elif` nunca é avaliado. Por isso a ordem das faixas importa tanto.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-cond-04', 'py-condicionais', 'Combinando condições', 'and, or e not', '## Duas perguntas de uma vez

Às vezes uma decisão depende de mais de um fator. Os **operadores lógicos** combinam condições:

- `and` → verdadeiro só se **as duas** forem verdadeiras;
- `or` → verdadeiro se **pelo menos uma** for verdadeira;
- `not` → inverte o resultado.

~~~py
idade = 20
tem_documento = True

if idade >= 18 and tem_documento:
    print("Pode entrar")
else:
    print("Entrada negada")
~~~

## Tabela mental rápida

| Condição | Resultado |
| --- | --- |
| `True and True` | True |
| `True and False` | False |
| `True or False` | True |
| `False or False` | False |
| `not True` | False |

## Intervalos

Para testar se um número está **entre** dois valores, combine com `and`:

~~~py
if nota >= 7 and nota <= 10:
    print("Aprovado")
~~~

Python ainda aceita a forma encadeada, mais próxima da matemática — e isso é uma particularidade dele, que não existe em Java ou C++:

~~~py
if 7 <= nota <= 10:
    print("Aprovado")
~~~

## Erro clássico

Isto **não** faz o que parece:

~~~py
if cor == "azul" or "verde":
~~~

O Python lê como "(cor == "azul") ou ("verde")", e uma string não vazia sempre vale True — logo a condição é sempre verdadeira. O jeito certo é repetir a comparação inteira:

~~~py
if cor == "azul" or cor == "verde":
~~~', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-04-e1', 'py-cond-04', 'Uma pessoa só pode dirigir se tiver 18 anos ou mais **e** possuir habilitação.

Com `idade = 22` e `tem_habilitacao = False`, escreva a condição que mostra `Não pode dirigir`.

Saída esperada:

~~~text
Não pode dirigir
~~~',
  'idade = 22
tem_habilitacao = False

# use and na condição
', 'output_match', 'Não pode dirigir',
  null, null, 'if idade >= 18 and tem_habilitacao: print("Pode dirigir") / else: print("Não pode dirigir")',
  'Com `and`, basta uma das partes ser falsa para a condição inteira ser falsa. A idade passa, mas a habilitação não — então cai no `else`.', 45, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-cond-04-e2', 'py-cond-04', 'Qual o resultado de `True and False or True`?',
  null, 'multiple_choice', 'True',
  '["True","False","Erro de sintaxe","Depende das variáveis"]'::jsonb, null, null,
  '`and` é avaliado antes de `or`. Então vira `(True and False) or True` → `False or True` → `True`. Na dúvida, use parênteses: eles deixam a intenção explícita para quem lê.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-repeticoes', 'python', 'Repetições', 'Fazer o computador repetir trabalho por você — sem copiar e colar código.', '🔁', 4)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-rep-01', 'py-repeticoes', 'Repetir com for', 'for e range()', '## O problema do copia-e-cola

Para mostrar os números de 1 a 5, você poderia escrever cinco `print()`. E para ir até 1000? A repetição existe justamente para isso:

~~~py
for numero in range(1, 6):
    print(numero)
~~~

~~~text
1
2
3
4
5
~~~

## Entendendo o range()

`range(inicio, fim)` gera os números **do início até o fim menos 1**. O fim é exclusivo — isso é intencional e você se acostuma rápido.

| Chamada | Números gerados |
| --- | --- |
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 |

O terceiro argumento é o **passo**.

## Anatomia do for

~~~py
for numero in range(1, 6):
    print(numero)
~~~

- `numero` é a **variável de controle** — a cada volta ela recebe o próximo valor;
- o bloco indentado é o **corpo** do laço, e roda uma vez por valor;
- quando os valores acabam, o laço termina sozinho.

Você não precisa incrementar nada manualmente: o `for` do Python cuida disso, diferente do `for (int i = 0; i < 5; i++)` de Java, C# e C++.', '[{"language":"Python","code":"for i in range(5):\n    print(i)"},{"language":"JavaScript","code":"for (let i = 0; i < 5; i++) {\n  console.log(i);\n}"},{"language":"Java","code":"for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-01-e1', 'py-rep-01', 'Mostre os números de 1 a 5, um por linha.

Saída esperada:

~~~text
1
2
3
4
5
~~~',
  '# use for com range
', 'output_match', '1
2
3
4
5',
  null, null, 'for numero in range(1, 6): — lembre que o fim do range é exclusivo.',
  'Para chegar até 5, o `range` precisa ir até 6. Esse "fim exclusivo" é a pegadinha mais comum do `range()`.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-01-e2', 'py-rep-01', 'Quantos números `range(3)` gera, e quais são?',
  null, 'multiple_choice', '3 números: 0, 1, 2',
  '["3 números: 0, 1, 2","3 números: 1, 2, 3","4 números: 0, 1, 2, 3","1 número: 3"]'::jsonb, null, null,
  'Com um único argumento, o `range` começa em 0 e para antes do valor informado. Por isso `range(3)` dá exatamente 3 voltas.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-rep-02', 'py-repeticoes', 'Repetir com while', 'Quando você não sabe quantas voltas serão', '## for x while

- `for` → você **sabe** quantas repetições (percorrer 1 a 10, percorrer uma lista);
- `while` → repete **enquanto** uma condição for verdadeira, sem número definido.

~~~py
senha = ""

while senha != "1234":
    senha = input("Senha: ")

print("Acesso liberado")
~~~

O laço roda quantas vezes for preciso até a pessoa acertar.

## As três partes de um while seguro

~~~py
contador = 1              # 1. inicializar

while contador <= 3:      # 2. condição de parada
    print(contador)
    contador = contador + 1   # 3. atualizar (senão trava!)
~~~

~~~text
1
2
3
~~~

## Loop infinito

Se você esquecer o passo 3, a condição nunca fica falsa e o programa **trava**:

~~~py
contador = 1
while contador <= 3:
    print(contador)   # contador nunca muda -> laço infinito
~~~

> O CodeQuest interrompe automaticamente qualquer código que passe de alguns segundos, então você pode testar sem medo de travar o navegador.

## Atalho útil

`contador = contador + 1` pode ser escrito como `contador += 1`. O mesmo vale para `-=`, `*=` e `/=`.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-02-e1', 'py-rep-02', 'Use um `while` para fazer uma contagem regressiva de 3 até 1 e depois mostrar `Fim`.

Saída esperada:

~~~text
3
2
1
Fim
~~~',
  'contador = 3

# escreva o while aqui

print("Fim")
', 'output_match', '3
2
1
Fim',
  null, null, 'while contador >= 1: print(contador) e depois contador -= 1',
  'Como a contagem é decrescente, a atualização precisa **diminuir** o contador. Se você usasse `+=`, a condição nunca ficaria falsa e o laço seria infinito.', 45, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-02-e2', 'py-rep-02', 'O que acontece se você esquecer de atualizar a variável de controle dentro de um `while`?',
  null, 'multiple_choice', 'O laço roda para sempre (loop infinito)',
  '["O laço roda para sempre (loop infinito)","O laço roda exatamente uma vez","O Python atualiza a variável automaticamente","O programa acusa erro de sintaxe"]'::jsonb, null, null,
  'Diferente do `for`, o `while` não avança nada sozinho. Manter a condição sempre verdadeira é um erro de lógica: o Python não reclama, o programa simplesmente nunca termina.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-rep-03', 'py-repeticoes', 'Acumuladores e contadores', 'Somando dentro do laço', '## O padrão acumulador

Este é provavelmente o padrão mais reutilizado da programação: uma variável **fora** do laço que vai crescendo **dentro** dele.

~~~py
soma = 0

for numero in range(1, 6):
    soma += numero

print(soma)
~~~

~~~text
15
~~~

Acompanhe volta a volta:

| Volta | numero | soma antes | soma depois |
| --- | --- | --- | --- |
| 1 | 1 | 0 | 1 |
| 2 | 2 | 1 | 3 |
| 3 | 3 | 3 | 6 |
| 4 | 4 | 6 | 10 |
| 5 | 5 | 10 | 15 |

## Por que fora do laço?

Se `soma = 0` estivesse dentro do `for`, ela seria zerada a cada volta e o resultado final seria só o último número. Inicializar fora e acumular dentro é a essência do padrão.

## Contador

A mesma ideia serve para **contar** ocorrências — some 1 sempre que a condição acontecer:

~~~py
pares = 0

for numero in range(1, 11):
    if numero % 2 == 0:
        pares += 1

print(f"Encontrei {pares} números pares")
~~~

Repare que aqui tem um `if` **dentro** de um `for`: os conceitos se combinam livremente. É assim que programas de verdade são construídos.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-03-e1', 'py-rep-03', 'Calcule a soma de todos os números de 1 a 100.

Saída esperada:

~~~text
5050
~~~',
  'soma = 0

# percorra de 1 a 100 acumulando em soma

print(soma)
', 'output_match', '5050',
  null, null, 'for numero in range(1, 101): soma += numero',
  'Esse é o famoso problema de Gauss. O computador resolve por força bruta em microssegundos — e o padrão acumulador é a ferramenta.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-03-e2', 'py-rep-03', 'Conte quantos números de 1 a 20 são múltiplos de 3.

Saída esperada:

~~~text
6
~~~',
  'quantidade = 0

# use for + if com o operador %

print(quantidade)
', 'output_match', '6',
  null, null, 'Dentro do for, teste if numero % 3 == 0: e some 1 no contador.',
  'São 3, 6, 9, 12, 15 e 18 — seis números. O teste `% 3 == 0` significa "o resto da divisão por 3 é zero", ou seja, divisão exata.', 50, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-rep-04', 'py-repeticoes', 'Controlando o laço', 'break e continue', '## Saindo mais cedo: break

`break` interrompe o laço na hora, mesmo que ainda houvesse voltas a fazer:

~~~py
for numero in range(1, 11):
    if numero == 4:
        break
    print(numero)
~~~

~~~text
1
2
3
~~~

Uso típico: você está procurando algo e já encontrou — não faz sentido continuar varrendo.

## Pulando uma volta: continue

`continue` pula **só a volta atual** e vai para a próxima:

~~~py
for numero in range(1, 6):
    if numero == 3:
        continue
    print(numero)
~~~

~~~text
1
2
4
5
~~~

## Usando com moderação

Os dois comandos existem em praticamente todas as linguagens, mas atrapalham a leitura quando usados demais. Regra prática: se dá para expressar a mesma coisa com uma condição clara no `while` ou num `if`, prefira a condição.

~~~py
# com break
while True:
    resposta = input("Continuar? ")
    if resposta == "não":
        break

# mais legível
resposta = ""
while resposta != "não":
    resposta = input("Continuar? ")
~~~', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-04-e1', 'py-rep-04', 'Mostre os números de 1 a 10, **pulando** o número 7.

Saída esperada:

~~~text
1
2
3
4
5
6
8
9
10
~~~',
  'for numero in range(1, 11):
    # pule o 7 e mostre o resto
    print(numero)
', 'output_match', '1
2
3
4
5
6
8
9
10',
  null, null, 'if numero == 7: continue — colocado antes do print.',
  'O `continue` precisa vir **antes** do `print()`: ele aborta o restante do corpo do laço naquela volta e segue para o próximo número.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-rep-04-e2', 'py-rep-04', 'Qual a diferença entre `break` e `continue`?',
  null, 'multiple_choice', 'break encerra o laço inteiro; continue pula só a volta atual',
  '["break encerra o laço inteiro; continue pula só a volta atual","break pula a volta atual; continue encerra o laço inteiro","Os dois encerram o laço, mas break é mais rápido","continue só funciona em while e break só em for"]'::jsonb, null, null,
  'Os dois funcionam tanto em `for` quanto em `while`. `break` sai do laço de vez; `continue` só abandona a iteração corrente.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-listas', 'python', 'Listas', 'Guardar muitos valores num nome só — e trabalhar com todos eles de uma vez.', '📋', 5)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-lis-01', 'py-listas', 'Vários valores, um nome', 'Criar, acessar e contar', '## O problema de uma variável por valor

Guardar três notas ainda dá para fazer com três variáveis:

~~~py
nota1 = 7.0
nota2 = 9.5
nota3 = 4.0
~~~

E trinta notas? E se você não souber quantas serão? A **lista** resolve isso: um nome só, guardando muitos valores em ordem.

~~~py
notas = [7.0, 9.5, 4.0]
print(notas)
~~~

~~~text
[7.0, 9.5, 4.0]
~~~

Colchetes `[ ]` criam a lista; as vírgulas separam os itens.

## Cada item tem uma posição

A posição chama-se **índice**, e a contagem começa em **zero** — não em um:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(linguagens[0])
print(linguagens[2])
~~~

~~~text
Python
Java
~~~

| Item | `"Python"` | `"JavaScript"` | `"Java"` |
| --- | --- | --- | --- |
| Índice | 0 | 1 | 2 |

Começar em zero parece estranho por uns dias e depois vira natural. Java, JavaScript, C# e C++ fazem igual.

## Índice negativo: contando do fim

Este aqui o Python tem e a maioria das linguagens não:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(linguagens[-1])
~~~

~~~text
Java
~~~

`-1` é o último, `-2` o penúltimo. É bem mais legível que `linguagens[len(linguagens) - 1]`.

## Quantos itens tem?

`len()` responde — a mesma função que conta letras de um texto:

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print(len(linguagens))
~~~

~~~text
3
~~~

> Cuidado com o índice que não existe: numa lista de 3 itens, o último índice válido é 2. Pedir `linguagens[3]` levanta `IndexError: list index out of range`.', '[{"language":"Python","code":"notas = [7, 9, 4]\nprint(notas[0])\nprint(len(notas))"},{"language":"JavaScript","code":"const notas = [7, 9, 4];\nconsole.log(notas[0]);\nconsole.log(notas.length);"},{"language":"Java","code":"int[] notas = {7, 9, 4};\nSystem.out.println(notas[0]);\nSystem.out.println(notas.length);"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-01-e1', 'py-lis-01', 'Crie uma lista chamada `cores` com `azul`, `verde` e `roxo`, nessa ordem, e mostre o **primeiro** e o **último** item, um por linha.

Saída esperada:

~~~text
azul
roxo
~~~',
  '# crie a lista cores e mostre o primeiro e o último item
', 'output_match', 'azul
roxo',
  null, null, 'cores[0] é o primeiro. Para o último, cores[-1] evita ter de contar.',
  'O índice `0` é o primeiro item e `-1` é o último — sem precisar saber o tamanho da lista.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-01-e2', 'py-lis-01', 'A lista `compras` já existe. Mostre quantos itens ela tem.

Saída esperada:

~~~text
4
~~~',
  'compras = ["arroz", "feijão", "café", "sal"]

# mostre a quantidade de itens
', 'output_match', '4',
  null, null, 'len(compras) devolve a quantidade — deixe o Python contar por você.',
  '`len()` conta os itens da lista. Escrever `print(4)` daria a mesma saída hoje e a saída errada assim que a lista mudasse.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-lis-02', 'py-listas', 'Listas mudam', 'append, remove e alterar por índice', '## Diferente de um número

Quando você faz `idade = 25` e depois `idade = 26`, o valor antigo simplesmente some. Uma lista é diferente: ela pode **crescer, encolher e mudar por dentro**, continuando a ser a mesma lista.

## Acrescentar no fim: append()

~~~py
tarefas = ["estudar"]
tarefas.append("treinar")
print(tarefas)
~~~

~~~text
[''estudar'', ''treinar'']
~~~

Repare na forma: `tarefas.append(...)`. O ponto quer dizer "peça isto **à lista**". É um **método** — uma função que pertence a um valor.

> `append()` não devolve a lista nova, ele altera a que já existe. Por isso `lista = lista.append(x)` é um erro clássico: você acaba com `None` no lugar da lista.

## Trocar um item

Basta atribuir na posição:

~~~py
tarefas = ["estudar", "treinar"]
tarefas[0] = "dormir"
print(tarefas)
~~~

~~~text
[''dormir'', ''treinar'']
~~~

## Remover

Duas formas, com propósitos diferentes:

~~~py
tarefas = ["dormir", "treinar", "ler"]
tarefas.remove("treinar")
print(tarefas)

ultimo = tarefas.pop()
print(ultimo)
print(tarefas)
~~~

~~~text
[''dormir'', ''ler'']
ler
[''dormir'']
~~~

| Método | O que faz |
| --- | --- |
| `append(x)` | põe `x` no fim |
| `remove(x)` | tira a **primeira** ocorrência do valor `x` |
| `pop()` | tira o último item **e devolve ele** |
| `insert(i, x)` | põe `x` na posição `i` |

Use `remove()` quando souber o **valor**; `pop()` quando quiser o item de volta.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-02-e1', 'py-lis-02', 'A lista `time` já tem três nomes. Acrescente `Kauan` ao final e mostre a lista.

Saída esperada:

~~~text
[''Ana'', ''Luiz'', ''Davi'', ''Kauan'']
~~~',
  'time = ["Ana", "Luiz", "Davi"]

# acrescente Kauan e mostre a lista
', 'output_match', '[''Ana'', ''Luiz'', ''Davi'', ''Kauan'']',
  null, null, 'time.append("Kauan") altera a lista; depois basta um print(time).',
  '`append()` acrescenta no fim e não devolve nada — ele mexe na lista que já existe. Por isso o `print()` vem depois, em outra linha.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-02-e2', 'py-lis-02', 'Na lista `fila`, troque o primeiro item por `Bruna`, remova `Carlos` e mostre a lista final.

Saída esperada:

~~~text
[''Bruna'', ''Dora'']
~~~',
  'fila = ["Alan", "Carlos", "Dora"]

# troque o primeiro por Bruna, remova Carlos e mostre
', 'output_match', '[''Bruna'', ''Dora'']',
  null, null, 'fila[0] = "Bruna" troca por posição; fila.remove("Carlos") tira pelo valor.',
  'Atribuir em `fila[0]` troca o item daquela posição. `remove()` procura pelo **valor** e tira a primeira ocorrência dele.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-lis-03', 'py-listas', 'Percorrer a lista', 'for direto nos itens, in e fatias', '## O for que você já conhece, melhor

No módulo anterior o `for` andava sobre números do `range()`. Ele também anda **direto sobre os itens** de uma lista:

~~~py
linguagens = ["Python", "JavaScript", "Java"]

for linguagem in linguagens:
    print(linguagem)
~~~

~~~text
Python
JavaScript
Java
~~~

Sem índice, sem `len()`, sem risco de errar o limite. Este é o jeito Python de percorrer uma lista — e é o que se espera de você numa revisão de código.

> Precisa da posição junto com o valor? `for i, item in enumerate(lista):` entrega os dois.

## Está na lista? O operador in

~~~py
linguagens = ["Python", "JavaScript", "Java"]
print("Java" in linguagens)
print("Rust" in linguagens)
~~~

~~~text
True
False
~~~

`in` devolve `True` ou `False` — combina naturalmente com o `if` do módulo de condicionais.

## Fatias: pedaços da lista

`lista[inicio:fim]` devolve uma **lista nova** com o pedaço pedido. Como no `range()`, o fim é exclusivo:

~~~py
numeros = [10, 20, 30, 40, 50]
print(numeros[1:3])
print(numeros[:2])
print(numeros[3:])
~~~

~~~text
[20, 30]
[10, 20]
[40, 50]
~~~

Omitir o início quer dizer "desde o começo"; omitir o fim, "até o final".', '[{"language":"Python","code":"for cor in cores:\n    print(cor)"},{"language":"JavaScript","code":"for (const cor of cores) {\n  console.log(cor);\n}"},{"language":"Java","code":"for (String cor : cores) {\n  System.out.println(cor);\n}"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-03-e1', 'py-lis-03', 'Percorra a lista `frutas` e mostre cada fruta em uma linha.

Saída esperada:

~~~text
uva
pera
manga
~~~',
  'frutas = ["uva", "pera", "manga"]

# percorra a lista e mostre uma por linha
', 'output_match', 'uva
pera
manga',
  null, null, 'for fruta in frutas: — o for anda direto nos itens, sem índice.',
  'Percorrer direto nos itens é mais legível que usar índice, e não há como errar o limite da lista.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-03-e2', 'py-lis-03', 'Percorra a lista `numeros` e mostre **apenas** os números maiores que 20, um por linha.

Saída esperada:

~~~text
30
45
~~~',
  'numeros = [10, 30, 8, 45, 20]

# mostre só os maiores que 20
', 'output_match', '30
45',
  null, null, 'Um for percorrendo a lista, e dentro dele um if decidindo se mostra.',
  'O `if` dentro do `for` é a combinação mais comum em programação: percorrer tudo e agir só no que interessa. Repare que 20 não entra — a condição é **maior que** 20, não maior ou igual.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-lis-04', 'py-listas', 'Resumir uma lista', 'sum, max, min e ordenação', '## O Python já sabe fazer as contas comuns

No módulo de repetições você somou números com um acumulador. Para uma lista, o Python já traz isso pronto:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]

print(sum(notas))
print(max(notas))
print(min(notas))
print(len(notas))
~~~

~~~text
29.0
9.5
4.0
4
~~~

A média sai da combinação de duas delas:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]
print(sum(notas) / len(notas))
~~~

~~~text
7.25
~~~

> Escrever o acumulador à mão continua valendo como aprendizado — mas em código de verdade, use `sum()`: é mais curto, mais rápido e não tem como errar.

## Ordenar

Há duas formas, e a diferença entre elas importa:

~~~py
notas = [7.0, 9.5, 4.0]

print(sorted(notas))
print(notas)

notas.sort()
print(notas)
~~~

~~~text
[4.0, 7.0, 9.5]
[7.0, 9.5, 4.0]
[4.0, 7.0, 9.5]
~~~

| Forma | O que faz com a lista original |
| --- | --- |
| `sorted(lista)` | não mexe — devolve uma **lista nova** ordenada |
| `lista.sort()` | ordena **a própria lista** e devolve `None` |

Para ordem decrescente, `sorted(lista, reverse=True)`.

## Juntar numa frase

`join()` cola os itens de uma lista de textos usando um separador:

~~~py
cores = ["azul", "verde", "roxo"]
print(", ".join(cores))
~~~

~~~text
azul, verde, roxo
~~~

Repare na ordem: quem faz o `join` é o **separador**, e a lista vai dentro dos parênteses.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-04-e1', 'py-lis-04', 'Mostre a soma e a média da lista `valores`, nessa ordem.

Saída esperada:

~~~text
40
10.0
~~~',
  'valores = [10, 5, 20, 5]

# mostre a soma e depois a média
', 'output_match', '40
10.0',
  null, null, 'sum(valores) soma; a média é sum(valores) / len(valores).',
  'A média sai da soma dividida pela quantidade. A divisão com `/` sempre devolve um número com casa decimal — por isso `10.0` e não `10`.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-lis-04-e2', 'py-lis-04', 'Mostre a lista `pontos` ordenada do menor para o maior, **sem alterar** a lista original — e depois a original, para provar que ela continua como estava.

Saída esperada:

~~~text
[3, 7, 12]
[7, 3, 12]
~~~',
  'pontos = [7, 3, 12]

# mostre a versão ordenada e depois a lista original
', 'output_match', '[3, 7, 12]
[7, 3, 12]',
  null, null, 'sorted(pontos) devolve uma lista nova; pontos.sort() mudaria a original.',
  '`sorted()` devolve uma cópia ordenada e deixa a original intacta — que é exatamente o que o exercício pede. `pontos.sort()` teria alterado a lista e a segunda linha sairia ordenada também.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-dicionarios', 'python', 'Dicionários', 'Guardar dados por nome em vez de por posição — a estrutura mais usada no dia a dia.', '🗂️', 6)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-dic-01', 'py-dicionarios', 'Chave e valor', 'Quando a posição não diz nada', '## O limite da lista

Numa lista, cada valor é identificado pela **posição**. Para os dados de uma pessoa, isso fica ruim depressa:

~~~py
aluno = ["Ana", 20, 8.5]
print(aluno[2])
~~~

O que é `aluno[2]`? Você precisa lembrar. E se alguém acrescentar um campo no meio, todo o código que usa índices quebra em silêncio.

## O dicionário guarda por nome

~~~py
aluno = {"nome": "Ana", "idade": 20, "media": 8.5}
print(aluno["media"])
~~~

~~~text
8.5
~~~

Agora o código **se explica**. Chaves `{ }` criam o dicionário; cada item é um par `"chave": valor`, separado por vírgula.

| | Lista | Dicionário |
| --- | --- | --- |
| Identifica por | posição (`0`, `1`, `2`) | chave (`"nome"`, `"idade"`) |
| Boa para | uma coleção de coisas iguais | os campos de **uma** coisa |
| Sintaxe | `[ ]` | `{ }` |

## Escrever e acrescentar

A mesma sintaxe faz as duas coisas: se a chave existe, o valor é trocado; se não existe, ela é criada.

~~~py
aluno = {"nome": "Ana"}
aluno["idade"] = 20
aluno["nome"] = "Ana Paula"
print(aluno)
~~~

~~~text
{''nome'': ''Ana Paula'', ''idade'': 20}
~~~

Repare que a ordem de inserção é mantida — o `nome` continua na frente porque entrou primeiro.

## Chave que não existe

~~~py
aluno = {"nome": "Ana"}
print(aluno["telefone"])
~~~

~~~text
KeyError: ''telefone''
~~~

Esse erro é tão comum que a próxima lição existe só para evitá-lo.', '[{"language":"Python","code":"aluno = {\"nome\": \"Ana\", \"idade\": 20}\nprint(aluno[\"nome\"])"},{"language":"JavaScript","code":"const aluno = { nome: \"Ana\", idade: 20 };\nconsole.log(aluno.nome);"},{"language":"Java","code":"Map<String, Object> aluno = Map.of(\"nome\", \"Ana\", \"idade\", 20);\nSystem.out.println(aluno.get(\"nome\"));"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-01-e1', 'py-dic-01', 'Crie um dicionário chamado `livro` com a chave `titulo` valendo `Python Fluente` e a chave `paginas` valendo `800`. Mostre o título e depois as páginas, um por linha.

Saída esperada:

~~~text
Python Fluente
800
~~~',
  '# crie o dicionário livro e mostre o titulo e as paginas
', 'output_match', 'Python Fluente
800',
  null, null, 'livro = {"titulo": "Python Fluente", "paginas": 800} e depois livro["titulo"].',
  'O acesso é por chave, entre colchetes — `livro["titulo"]`. As chaves aqui são textos, então vão entre aspas na criação e no acesso.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-01-e2', 'py-dic-01', 'O dicionário `perfil` já existe. Acrescente a chave `cidade` com o valor `Recife`, troque o `nivel` para `5` e mostre o dicionário inteiro.

Saída esperada:

~~~text
{''usuario'': ''dev'', ''nivel'': 5, ''cidade'': ''Recife''}
~~~',
  'perfil = {"usuario": "dev", "nivel": 3}

# acrescente cidade, troque o nivel e mostre o dicionário
', 'output_match', '{''usuario'': ''dev'', ''nivel'': 5, ''cidade'': ''Recife''}',
  null, null, 'perfil["cidade"] = "Recife" cria a chave nova; perfil["nivel"] = 5 troca a que já existe.',
  'A mesma sintaxe cria e atualiza: se a chave já existe o valor é trocado no lugar, se não existe ela entra no fim. Por isso `cidade` aparece por último.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-dic-02', 'py-dicionarios', 'Consultar sem quebrar', 'get(), in e del', '## O problema

`dados["chave"]` derruba o programa quando a chave não existe. Em dados que vêm de fora — de um formulário, de um arquivo, de uma API — isso acontece o tempo todo.

## get(): devolve None em vez de quebrar

~~~py
aluno = {"nome": "Ana"}
print(aluno.get("telefone"))
~~~

~~~text
None
~~~

E dá para escolher o que aparece no lugar:

~~~py
aluno = {"nome": "Ana"}
print(aluno.get("telefone", "não informado"))
~~~

~~~text
não informado
~~~

O segundo argumento é o **valor padrão**. Este é o jeito de ler campo opcional sem encher o código de `if`.

## in: a chave existe?

~~~py
aluno = {"nome": "Ana", "idade": 20}
print("idade" in aluno)
print("media" in aluno)
~~~

~~~text
True
False
~~~

> Atenção: `in` procura entre as **chaves**, não entre os valores. `"Ana" in aluno` é `False`.

## Quando usar cada um

| Situação | Escolha |
| --- | --- |
| A chave tem de existir; se não existir é um bug | `dados["chave"]` |
| Campo opcional, com um padrão razoável | `dados.get("chave", padrao)` |
| Preciso **decidir** algo a partir da presença | `if "chave" in dados:` |

Deixar o `KeyError` acontecer é a escolha certa quando a ausência da chave realmente indica um erro — o programa para perto do problema, em vez de seguir com dado errado.

## Remover

~~~py
aluno = {"nome": "Ana", "rascunho": True}
del aluno["rascunho"]
print(aluno)
~~~

~~~text
{''nome'': ''Ana''}
~~~', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-02-e1', 'py-dic-02', 'O dicionário `config` não tem a chave `tema`. Mostre o valor de `tema` usando `escuro` como padrão, e depois o valor de `idioma`, que existe.

Saída esperada:

~~~text
escuro
pt-BR
~~~',
  'config = {"idioma": "pt-BR"}

# mostre o tema (com padrão) e depois o idioma
', 'output_match', 'escuro
pt-BR',
  null, null, 'config.get("tema", "escuro") devolve o padrão quando a chave não existe.',
  'O segundo argumento de `get()` é o valor devolvido quando a chave falta. Sem ele viria `None`; com `config["tema"]` viria um `KeyError` e o programa pararia.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-02-e2', 'py-dic-02', 'Verifique se a chave `email` existe em `cadastro` e mostre `Cadastro completo` se existir, ou `Falta o e-mail` se não existir.

Saída esperada:

~~~text
Falta o e-mail
~~~',
  'cadastro = {"nome": "Dev", "senha": "1234"}

# decida a partir da presença da chave email
', 'output_match', 'Falta o e-mail',
  null, null, 'if "email" in cadastro: — o in procura entre as chaves.',
  'O `in` pergunta pelas **chaves** do dicionário. Como `email` não está lá, o `else` é executado.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-dic-03', 'py-dicionarios', 'Percorrer um dicionário', 'items(), keys() e values()', '## O for sozinho dá as chaves

~~~py
aluno = {"nome": "Ana", "idade": 20}

for chave in aluno:
    print(chave)
~~~

~~~text
nome
idade
~~~

É o comportamento padrão, e ele engana quem está começando: você esperava os valores e recebeu as chaves.

## items(): chave e valor de uma vez

Quase sempre é isto que você quer:

~~~py
aluno = {"nome": "Ana", "idade": 20}

for chave, valor in aluno.items():
    print(chave, "->", valor)
~~~

~~~text
nome -> Ana
idade -> 20
~~~

O `for` recebe **duas** variáveis porque `items()` entrega um par a cada volta. Os nomes são livres — `for campo, conteudo in ...` funciona igual.

## As três formas

| Escrita | O que o for recebe |
| --- | --- |
| `for c in dados:` | as chaves |
| `for c in dados.keys():` | as chaves (explícito) |
| `for v in dados.values():` | os valores |
| `for c, v in dados.items():` | os dois |

## Somando valores

`values()` combina direto com o `sum()` que você viu em listas:

~~~py
vendas = {"seg": 100, "ter": 150, "qua": 90}
print(sum(vendas.values()))
~~~

~~~text
340
~~~

## Formatando a saída

Junto com a f-string do módulo de variáveis, sai um relatório legível em duas linhas:

~~~py
estoque = {"caneta": 12, "caderno": 3}

for produto, quantidade in estoque.items():
    print(f"{produto}: {quantidade}")
~~~

~~~text
caneta: 12
caderno: 3
~~~', '[{"language":"Python","code":"for chave, valor in dados.items():\n    print(chave, valor)"},{"language":"JavaScript","code":"for (const [chave, valor] of Object.entries(dados)) {\n  console.log(chave, valor);\n}"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-03-e1', 'py-dic-03', 'Percorra o dicionário `estoque` e mostre uma linha por produto no formato `produto: quantidade`.

Saída esperada:

~~~text
caneta: 12
caderno: 3
borracha: 7
~~~',
  'estoque = {"caneta": 12, "caderno": 3, "borracha": 7}

# uma linha por produto, no formato produto: quantidade
', 'output_match', 'caneta: 12
caderno: 3
borracha: 7',
  null, null, 'for produto, quantidade in estoque.items(): e um print com f-string.',
  '`items()` entrega a chave e o valor a cada volta, e a f-string monta a linha. Sem `items()`, o `for` daria só os nomes dos produtos.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-03-e2', 'py-dic-03', 'Mostre o total vendido na semana, somando todos os valores de `vendas`.

Saída esperada:

~~~text
340
~~~',
  'vendas = {"seg": 100, "ter": 150, "qua": 90}

# mostre o total
', 'output_match', '340',
  null, null, 'sum(vendas.values()) soma os valores — sum(vendas) tentaria somar as chaves.',
  '`values()` devolve só os valores, e `sum()` os soma. Passar o dicionário direto para `sum()` daria erro, porque ele tentaria somar os textos das chaves.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-dic-04', 'py-dicionarios', 'Contar com dicionário', 'O padrão que aparece em todo lugar', '## O problema clássico

Quantas vezes cada palavra aparece numa lista? Com listas isso é trabalhoso. Com dicionário é o uso mais natural que existe: a **chave** é o que se conta, o **valor** é a contagem.

~~~py
votos = ["azul", "verde", "azul", "roxo", "azul"]
contagem = {}

for cor in votos:
    if cor in contagem:
        contagem[cor] = contagem[cor] + 1
    else:
        contagem[cor] = 1

print(contagem)
~~~

~~~text
{''azul'': 3, ''verde'': 1, ''roxo'': 1}
~~~

Leia devagar: a primeira vez que uma cor aparece, ela **não está** no dicionário, então entra com 1. Nas vezes seguintes, o valor que já existe é somado com 1.

## A versão curta

O `get()` da lição anterior encurta as quatro linhas para uma:

~~~py
votos = ["azul", "verde", "azul"]
contagem = {}

for cor in votos:
    contagem[cor] = contagem.get(cor, 0) + 1

print(contagem)
~~~

~~~text
{''azul'': 2, ''verde'': 1}
~~~

Quando a cor ainda não existe, `get(cor, 0)` devolve 0 e a soma dá 1. Quando existe, devolve a contagem atual. É a mesma lógica, sem o `if`.

> Este padrão — *ler com padrão, somar, guardar de volta* — resolve contagem, agrupamento, soma por categoria e totalização por chave. Vale reconhecê-lo.

## Achando o maior

Depois de contar, encontrar o campeão é um `for` guardando o melhor até agora:

~~~py
contagem = {"azul": 3, "verde": 1}
campea = ""
maior = 0

for cor, quantidade in contagem.items():
    if quantidade > maior:
        maior = quantidade
        campea = cor

print(campea)
~~~

~~~text
azul
~~~', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-04-e1', 'py-dic-04', 'Conte quantas vezes cada animal aparece na lista `bichos` e mostre o dicionário de contagem.

Saída esperada:

~~~text
{''gato'': 3, ''cão'': 2}
~~~',
  'bichos = ["gato", "cão", "gato", "gato", "cão"]
contagem = {}

# conte cada animal e mostre a contagem
', 'output_match', '{''gato'': 3, ''cão'': 2}',
  null, null, 'Percorra a lista e faça contagem[bicho] = contagem.get(bicho, 0) + 1.',
  'O padrão *ler com padrão, somar, guardar de volta* resolve a contagem numa linha dentro do `for`. A ordem do resultado segue a ordem em que cada chave apareceu pela primeira vez.', 45, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-dic-04-e2', 'py-dic-04', 'A partir do dicionário `pontos`, mostre o nome de quem tem mais pontos e, na linha seguinte, quantos pontos são.

Saída esperada:

~~~text
Luiz
95
~~~',
  'pontos = {"Ana": 80, "Luiz": 95, "Davi": 60}
lider = ""
maior = 0

# descubra quem lidera e mostre o nome e os pontos
', 'output_match', 'Luiz
95',
  null, null, 'Percorra com items() e guarde o melhor até agora sempre que achar um valor maior.',
  'Guardar "o melhor até agora" enquanto se percorre é o mesmo raciocínio do acumulador que você usou no módulo de repetições — só que aqui o que se guarda são dois valores: quem e quanto.', 45, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-funcoes', 'python', 'Funções', 'Dar nome a um pedaço de lógica, reaproveitar código e parar de repetir você mesmo.', '⚙️', 7)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-func-01', 'py-funcoes', 'Criando uma função', 'def e chamada', '## Dando nome a um bloco de código

Uma **função** é um trecho de código que ganha nome e só roda quando você chama:

~~~py
def saudacao():
    print("Bem-vindo ao CodeQuest!")

saudacao()
saudacao()
~~~

~~~text
Bem-vindo ao CodeQuest!
Bem-vindo ao CodeQuest!
~~~

Duas coisas acontecem aqui:

1. `def saudacao():` **define** a função — nada é executado ainda, o Python só guarda a receita;
2. `saudacao()` **chama** a função — agora sim o bloco roda.

Definir sem chamar não produz saída nenhuma. É o erro mais comum da primeira aula sobre funções.

## Você já usa funções desde a primeira lição

`print()`, `input()`, `int()`, `range()`, `len()` — todas são funções prontas do Python. A diferença é que agora **você** escreve as suas.

## Por que isso importa

- **Não se repete**: a lógica existe em um lugar só; corrigiu ali, corrigiu em todo lugar.
- **Fica legível**: `calcular_media(notas)` conta a história melhor que dez linhas soltas.
- **Fica testável**: dá para verificar uma função isolada do resto do programa.', '[{"language":"Python","code":"def saudacao():\n    print(\"Olá\")"},{"language":"JavaScript","code":"function saudacao() {\n  console.log(\"Olá\");\n}"},{"language":"Java","code":"static void saudacao() {\n  System.out.println(\"Olá\");\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-01-e1', 'py-func-01', 'Crie uma função chamada `abrir_jogo` que mostre `Partida iniciada` e chame-a duas vezes.

Saída esperada:

~~~text
Partida iniciada
Partida iniciada
~~~',
  '# defina a função e chame duas vezes
', 'output_match', 'Partida iniciada
Partida iniciada',
  null, null, 'def abrir_jogo(): com o print indentado dentro, e depois duas linhas abrir_jogo()',
  'A definição não executa nada — quem executa são as duas chamadas. Escrever a lógica uma vez e usar quantas vezes quiser é justamente o ganho da função.', 45, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-01-e2', 'py-func-01', 'Qual palavra-chave define uma função em Python?',
  null, 'fill_blank', 'def',
  null, null, 'São três letras, abreviação de "define".',
  '`def` vem de *define*. Em JavaScript o equivalente é `function`; em Java e C# você declara o tipo de retorno antes do nome.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-func-02', 'py-funcoes', 'Parâmetros e retorno', 'Entrada e saída de uma função', '## Funções que recebem dados

Um **parâmetro** é uma variável que a função recebe de quem a chamou:

~~~py
def saudacao(nome):
    print(f"Olá, {nome}!")

saudacao("Ana")
saudacao("Kauan")
~~~

~~~text
Olá, Ana!
Olá, Kauan!
~~~

A mesma função, resultados diferentes — porque o **argumento** mudou.

## Funções que devolvem dados

`return` devolve um valor para quem chamou, permitindo guardar o resultado:

~~~py
def dobro(numero):
    return numero * 2

resultado = dobro(5)
print(resultado)
print(dobro(10) + dobro(3))
~~~

~~~text
10
26
~~~

## print não é return

Essa distinção derruba muita gente:

~~~py
def soma_errada(a, b):
    print(a + b)      # mostra na tela, mas devolve None

def soma_certa(a, b):
    return a + b      # devolve o valor para ser usado

x = soma_errada(2, 3)   # x fica valendo None
y = soma_certa(2, 3)    # y fica valendo 5
~~~

**`print` fala com o usuário. `return` fala com o resto do programa.** Se o valor vai ser reaproveitado em outra conta, você precisa de `return`.

## O return encerra a função

Qualquer linha depois de um `return` executado é ignorada:

~~~py
def teste():
    return 1
    print("nunca aparece")
~~~', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-02-e1', 'py-func-02', 'Escreva a função `calcular_media(a, b)` que **retorna** a média de dois números, e mostre a média de 7 e 9.

Saída esperada:

~~~text
8.0
~~~',
  '# defina calcular_media e mostre o resultado
', 'output_match', '8.0',
  null, null, 'def calcular_media(a, b): return (a + b) / 2 — depois print(calcular_media(7, 9))',
  'Como a função **retorna**, o valor pode ser impresso, guardado numa variável ou usado em outra conta. Se ela apenas imprimisse, você não teria como reaproveitar o resultado.', 55, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-02-e2', 'py-func-02', 'Uma função que só faz `print(a + b)`, sem `return`, devolve o quê para quem a chamou?',
  null, 'multiple_choice', 'None',
  '["None","A soma de a e b","Uma string com o resultado","Zero"]'::jsonb, null, null,
  'Toda função sem `return` devolve `None`, o valor que representa "nada" em Python. Por isso `x = soma_errada(2, 3)` deixa `x` valendo None, mesmo tendo aparecido 5 na tela.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-func-03', 'py-funcoes', 'Organizando um programa', 'Escopo e composição de funções', '## Cada função tem seu mundo

Variáveis criadas dentro de uma função só existem lá dentro. Isso se chama **escopo local**:

~~~py
def calcular():
    total = 10
    return total

calcular()
print(total)
~~~

~~~text
NameError: name ''total'' is not defined
~~~

Isso é uma proteção, não uma limitação: você pode usar o nome `total` em várias funções sem que uma atrapalhe a outra.

## Compondo funções

Programas reais são funções pequenas que chamam outras funções pequenas:

~~~py
def eh_aprovado(media):
    return media >= 6

def calcular_media(a, b):
    return (a + b) / 2

def boletim(nome, n1, n2):
    media = calcular_media(n1, n2)
    if eh_aprovado(media):
        situacao = "Aprovado"
    else:
        situacao = "Reprovado"
    print(f"{nome}: média {media} - {situacao}")

boletim("Ana", 7, 9)
boletim("Luiz", 4, 5)
~~~

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
~~~

Repare que `eh_aprovado` retorna diretamente o resultado da comparação — que já é `True` ou `False`. Não é preciso escrever `if media >= 6: return True else: return False`.

## Uma função, uma responsabilidade

Se você precisa usar "e" para explicar o que a função faz ("ela calcula a média **e** imprime **e** salva"), provavelmente são três funções.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-03-e1', 'py-func-03', 'Complete a função `eh_par(numero)` para que ela **retorne** True quando o número for par.

Saída esperada:

~~~text
True
False
~~~',
  'def eh_par(numero):
    # complete aqui

print(eh_par(4))
print(eh_par(7))
', 'output_match', 'True
False',
  null, null, 'return numero % 2 == 0 — a própria comparação já vale True ou False.',
  'A expressão `numero % 2 == 0` já é um booleano, então dá para retorná-la direto. Envolvê-la num `if` que retorna True/False seria código redundante.', 55, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-func-03-e2', 'py-func-03', 'Por que uma variável criada dentro de uma função não pode ser lida fora dela?',
  null, 'multiple_choice', 'Porque ela existe apenas no escopo local da função',
  '["Porque ela existe apenas no escopo local da função","Porque o Python apaga todas as variáveis a cada linha","Porque faltou usar return na variável","Porque variáveis dentro de funções precisam começar com _"]'::jsonb, null, null,
  'A variável nasce quando a função começa e é descartada quando ela termina. Para levar um valor para fora, use `return`.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-desafios', 'python', 'Desafios', 'Problemas que combinam tudo que você aprendeu. Nada de conteúdo novo — só raciocínio.', '🧩', 8)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-des-01', 'py-desafios', 'FizzBuzz', 'O desafio de entrevista mais famoso do mundo', '## O problema

FizzBuzz é usado em entrevistas de emprego há décadas. O enunciado:

> Para os números de 1 a 15, mostre o próprio número. Mas: múltiplos de 3 viram **Fizz**, múltiplos de 5 viram **Buzz**, e múltiplos de 3 **e** 5 ao mesmo tempo viram **FizzBuzz**.

## Pensando antes de escrever

Você já tem todas as peças: `for`, `if/elif/else` e o operador `%`.

O detalhe que derruba a maioria das pessoas é a **ordem dos testes**. Se você testar "múltiplo de 3" primeiro, o número 15 vira "Fizz" e nunca chega a ser "FizzBuzz".

A regra que você aprendeu em Condicionais resolve: **do caso mais restritivo para o mais amplo**. E o caso mais restritivo é ser múltiplo dos dois.

~~~py
if numero % 3 == 0 and numero % 5 == 0:
    # FizzBuzz
elif numero % 3 == 0:
    # Fizz
elif numero % 5 == 0:
    # Buzz
else:
    # o próprio número
~~~

## Por que isso é um bom teste

Não é sobre dificuldade técnica — é sobre traduzir um enunciado em português para uma cadeia de decisões sem se perder. Exatamente o que você treinou nos módulos anteriores.', null, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-des-01-e1', 'py-des-01', 'Implemente o FizzBuzz de 1 a 15.

Saída esperada:

~~~text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
~~~',
  'for numero in range(1, 16):
    # teste primeiro o caso mais restritivo
', 'output_match', '1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz',
  null, null, 'Comece com if numero % 3 == 0 and numero % 5 == 0: print("FizzBuzz") e vá afunilando com elif.',
  'Você resolveu o FizzBuzz — um problema que já eliminou muita gente em processo seletivo. A chave foi a ordem das condições, não a sintaxe.', 80, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-des-02', 'py-desafios', 'Validação de dados', 'Um programa que não confia na entrada', '## Todo dado de fora é suspeito

Programas reais nunca assumem que a pessoa vai digitar o que foi pedido. **Validar** é verificar se a entrada faz sentido antes de usá-la.

## Regras compostas

Imagine validar uma senha com três exigências: pelo menos 8 caracteres, não pode ser igual ao nome de usuário, e não pode ser `12345678`.

Duas ferramentas novas aqui, ambas simples:

- `len(texto)` devolve o número de caracteres;
- `in` verifica se algo está contido em outra coisa.

~~~py
senha = "abc"
print(len(senha))
print("b" in senha)
~~~

~~~text
3
True
~~~

## Estruturando a validação

O padrão mais legível é testar cada regra e sair na primeira falha:

~~~py
def validar(senha):
    if len(senha) < 8:
        return "Senha muito curta"
    if senha == "12345678":
        return "Senha óbvia demais"
    return "Senha aceita"

print(validar("abc"))
print(validar("codequest2026"))
~~~

Isso se chama **retorno antecipado** (*early return*) e evita aquelas escadas de `if` aninhado que ficam impossíveis de ler.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-des-02-e1', 'py-des-02', 'Complete a função `validar_senha` seguindo as regras:

- menos de 8 caracteres → `Senha muito curta`
- igual a `12345678` → `Senha óbvia demais`
- caso contrário → `Senha aceita`

Saída esperada:

~~~text
Senha muito curta
Senha óbvia demais
Senha aceita
~~~',
  'def validar_senha(senha):
    # use retorno antecipado

print(validar_senha("abc"))
print(validar_senha("12345678"))
print(validar_senha("codequest2026"))
', 'output_match', 'Senha muito curta
Senha óbvia demais
Senha aceita',
  null, null, 'Três returns em sequência: o primeiro que for atingido encerra a função.',
  'Repare que a ordem das regras importa de novo: `"12345678"` tem 8 caracteres, então passa pela primeira regra e é pega pela segunda.', 80, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-des-03', 'py-desafios', 'Processando uma sequência', 'Maior, menor e média em uma passada', '## Listas, em três minutos

Uma **lista** guarda vários valores em uma variável só:

~~~py
notas = [7.0, 9.5, 4.0, 8.5]

print(notas[0])      # primeiro item (a contagem começa em 0)
print(len(notas))    # quantos itens
~~~

~~~text
7.0
4
~~~

## Percorrendo com for

O `for` percorre listas diretamente, sem precisar de `range`:

~~~py
for nota in notas:
    print(nota)
~~~

## O padrão "maior valor"

Como descobrir a maior nota sem usar funções prontas? Guarde um "campeão provisório" e vá comparando:

~~~py
maior = notas[0]

for nota in notas:
    if nota > maior:
        maior = nota

print(maior)
~~~

É o padrão acumulador de novo, com uma comparação no lugar da soma. Inicializar `maior` com o **primeiro item** (e não com zero) é importante: se todas as notas fossem negativas, começar em zero daria resposta errada.

## Combinando tudo

Na mesma passada dá para acumular a soma e achar o maior — e no fim calcular a média dividindo pela quantidade.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-des-03-e1', 'py-des-03', 'Percorra a lista de notas e mostre a maior nota e a média, nessa ordem.

Saída esperada:

~~~text
Maior: 9.5
Média: 7.25
~~~',
  'notas = [7.0, 9.5, 4.0, 8.5]
maior = notas[0]
soma = 0

# percorra a lista acumulando soma e comparando o maior

print(f"Maior: {maior}")
print(f"Média: {soma / len(notas)}")
', 'output_match', 'Maior: 9.5
Média: 7.25',
  null, null, 'Dentro do for: soma += nota e um if nota > maior: maior = nota',
  'Duas responsabilidades resolvidas em uma única passagem pela lista. Em programas grandes, evitar percorrer os mesmos dados várias vezes é o que mantém tudo rápido.', 90, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-projeto-final', 'python', 'Projeto Final', 'Um sistema completo de boletim escolar, construído em três etapas — do zero ao funcionando.', '🏆', 9)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('py-proj-01', 'py-projeto-final', 'Sistema de Boletim', 'Juntando os sete módulos em um programa só', '## O que você vai construir

Um programa que recebe as notas de vários alunos, calcula a média de cada um, decide a situação (Aprovado, Recuperação ou Reprovado) e apresenta um relatório com a média geral da turma.

Nada aqui é conteúdo novo. Tudo que você precisa já foi visto:

- 📦 **Variáveis e tipos** para guardar notas e nomes;
- 🔀 **Condicionais** para decidir a situação de cada aluno;
- 🔁 **Repetições** para percorrer a turma e acumular a média geral;
- ⚙️ **Funções** para separar cada responsabilidade.

## As regras do sistema

| Média | Situação |
| --- | --- |
| 7.0 ou mais | Aprovado |
| entre 5.0 e 6.9 | Recuperação |
| abaixo de 5.0 | Reprovado |

## Os dados

Cada aluno é uma lista com nome e duas notas, e a turma é uma lista dessas listas:

~~~py
turma = [
    ["Ana", 7.0, 9.0],
    ["Luiz", 4.0, 5.0],
    ["Kauan", 6.0, 6.0],
]
~~~

Percorrendo, cada `aluno` é uma lista de 3 posições — `aluno[0]` é o nome, `aluno[1]` e `aluno[2]` são as notas:

~~~py
for aluno in turma:
    print(aluno[0])
~~~

## Como atacar o problema

Construa **em etapas** e teste cada uma antes de seguir. É assim que se escreve software de verdade: nunca tudo de uma vez, sempre um pedaço funcionando por vez. Os três exercícios abaixo seguem exatamente essa ordem.', '[{"language":"Python","code":"def situacao(media):\n    if media >= 7:\n        return \"Aprovado\"\n    elif media >= 5:\n        return \"Recuperação\"\n    return \"Reprovado\""},{"language":"JavaScript","code":"function situacao(media) {\n  if (media >= 7) return \"Aprovado\";\n  if (media >= 5) return \"Recuperação\";\n  return \"Reprovado\";\n}"},{"language":"Java","code":"static String situacao(double media) {\n  if (media >= 7) return \"Aprovado\";\n  if (media >= 5) return \"Recuperação\";\n  return \"Reprovado\";\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-proj-01-e1', 'py-proj-01', '**Etapa 1 — a regra de negócio.**

Complete a função `situacao(media)` seguindo a tabela do enunciado.

Saída esperada:

~~~text
Aprovado
Recuperação
Reprovado
~~~',
  'def situacao(media):
    # complete usando if / elif / else

print(situacao(8.0))
print(situacao(6.0))
print(situacao(3.0))
', 'output_match', 'Aprovado
Recuperação
Reprovado',
  null, null, 'if media >= 7: return "Aprovado" / elif media >= 5: return "Recuperação" / else: return "Reprovado"',
  'Isolar a regra de negócio numa função é a decisão de projeto mais importante aqui: se a escola mudar a nota de corte, você altera **um** lugar.', 70, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-proj-01-e2', 'py-proj-01', '**Etapa 2 — o relatório por aluno.**

Percorra a turma e mostre uma linha por aluno no formato `Nome: média X.X - Situação`.

Saída esperada:

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação
~~~',
  'def situacao(media):
    if media >= 7:
        return "Aprovado"
    elif media >= 5:
        return "Recuperação"
    return "Reprovado"

turma = [
    ["Ana", 7.0, 9.0],
    ["Luiz", 4.0, 5.0],
    ["Kauan", 6.0, 6.0],
]

# percorra a turma e mostre uma linha por aluno
', 'output_match', 'Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação',
  null, null, 'for aluno in turma: media = (aluno[1] + aluno[2]) / 2 e depois print(f"{aluno[0]}: média {media} - {situacao(media)}")',
  'Repare como a f-string aceita a chamada `{situacao(media)}` diretamente. A função da etapa 1 foi reaproveitada sem nenhuma alteração.', 90, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'py-proj-01-e3', 'py-proj-01', '**Etapa 3 — o fechamento da turma.**

Além das linhas por aluno, acumule as médias e mostre no final a média geral e quantos alunos foram aprovados.

Saída esperada:

~~~text
Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação
---
Média da turma: 6.17
Aprovados: 1 de 3
~~~',
  'def situacao(media):
    if media >= 7:
        return "Aprovado"
    elif media >= 5:
        return "Recuperação"
    return "Reprovado"

turma = [
    ["Ana", 7.0, 9.0],
    ["Luiz", 4.0, 5.0],
    ["Kauan", 6.0, 6.0],
]

soma_medias = 0
aprovados = 0

# percorra, mostre cada aluno e acumule os totais

print("---")
print(f"Média da turma: {round(soma_medias / len(turma), 2)}")
print(f"Aprovados: {aprovados} de {len(turma)}")
', 'output_match', 'Ana: média 8.0 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6.0 - Recuperação
---
Média da turma: 6.17
Aprovados: 1 de 3',
  null, null, 'Dentro do for: soma_medias += media e um if situacao(media) == "Aprovado": aprovados += 1',
  'Você terminou a trilha de Python do CodeQuest. Este último programa tem entrada de dados, regra de negócio isolada em função, laço, condicional, dois acumuladores e saída formatada — a estrutura de qualquer sistema real, em miniatura. `round(valor, 2)` arredonda para duas casas.', 120, 3)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

-- Trilha de JavaScript ------------------------------------------------
insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-fundamentos', 'javascript', 'Fundamentos', 'Onde o JavaScript roda, como fazer a primeira coisa aparecer na tela e como ler um erro sem entrar em pânico.', '🐣', 1)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-fund-01', 'js-fundamentos', 'Onde o JavaScript roda', 'A linguagem que já está em todo lugar', '## A linguagem que veio junto

Para rodar Python, Java ou C++ você precisa instalar alguma coisa. Para rodar JavaScript, **não**. Todo navegador — Chrome, Firefox, Safari, Edge — já vem com um motor de JavaScript embutido.

É por isso que o JavaScript está em praticamente tudo:

- **páginas web** — o botão que abre um menu, o formulário que avisa "senha muito curta" antes de enviar;
- **servidores** — com o Node.js, a mesma linguagem passou a rodar fora do navegador;
- **aplicativos de celular e de computador** — o próprio CodeQuest que você está usando agora é escrito em JavaScript.

## Um programa é uma lista de instruções

Um computador não adivinha nada. Ele faz **exatamente** o que você mandou, **na ordem em que você mandou** — de cima para baixo, uma linha por vez.

Sobre essa base existem três ideias, e elas aparecem em qualquer linguagem:

- **Sequência** — as instruções acontecem em ordem.
- **Decisão** — o programa escolhe caminhos diferentes dependendo de uma condição (módulo 🔀 Condicionais).
- **Repetição** — o programa repete um trecho sem você reescrever (módulo 🔁 Repetições).

**O conceito é o mesmo em toda linguagem; só a sintaxe muda.** Veja "mostre Olá na tela" em três delas:', '[{"language":"JavaScript","code":"console.log(\"Olá\");"},{"language":"Python","code":"print(\"Olá\")"},{"language":"Java","code":"System.out.println(\"Olá\");"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-01-e1', 'js-fund-01', 'O que é preciso instalar para rodar JavaScript em uma página da web?',
  null, 'multiple_choice', 'Nada: todo navegador já traz um motor de JavaScript',
  '["Nada: todo navegador já traz um motor de JavaScript","O Node.js, obrigatoriamente","Um compilador oficial da linguagem","Uma extensão paga do navegador"]'::jsonb, null, null,
  'Essa é a grande vantagem prática do JavaScript: o interpretador já está no navegador de quem visita a página. O Node.js só entra quando você quer rodar JavaScript **fora** do navegador, como em um servidor.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-01-e2', 'js-fund-01', 'O mesmo conceito muda de sintaxe em cada linguagem. Qual destas linhas mostra um texto na tela **em JavaScript**?',
  null, 'multiple_choice', 'console.log("Olá");',
  '["console.log(\"Olá\");","print(\"Olá\")","System.out.println(\"Olá\");","cout << \"Olá\";"]'::jsonb, null, null,
  'As quatro linhas fazem a mesma coisa, cada uma na sua linguagem. `print` é Python, `System.out.println` é Java e `cout <<` é C++. Em JavaScript, é `console.log()`.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-fund-02', 'js-fundamentos', 'Sua primeira linha de código', 'console.log() e os três tipos de aspas', '## console.log(): a janela do seu programa

`console.log()` mostra alguma coisa no console. Tudo que estiver **dentro dos parênteses** é exibido.

~~~js
console.log("Bem-vindo ao CodeQuest");
~~~

Saída:

~~~text
Bem-vindo ao CodeQuest
~~~

O nome é literal: *console* é aquele painel que você abre no navegador com F12, onde as pessoas que programam acompanham o que o código está fazendo. Aqui no CodeQuest ele aparece como o terminal preto embaixo do editor.

## Três tipos de aspas

Texto (o que chamamos de **string**) precisa estar entre aspas. Em JavaScript existem três formas, e as duas primeiras são equivalentes:

~~~js
console.log("aspas duplas");
console.log(''aspas simples'');
console.log(`crase`);
~~~

Abra e feche com o mesmo símbolo. A crase tem um superpoder que você vai ver no módulo de Variáveis — por enquanto, use aspas duplas ou simples.

## Vários valores de uma vez

Se você passar mais de um valor separado por vírgula, todos aparecem na mesma linha, separados por um espaço:

~~~js
console.log("Nota:", 10);
~~~

~~~text
Nota: 10
~~~

E cada `console.log()` termina pulando para a linha seguinte:

~~~js
console.log("Linha 1");
console.log("Linha 2");
~~~

~~~text
Linha 1
Linha 2
~~~

> No CodeQuest o botão **Executar** roda o seu código de verdade — é o motor de JavaScript do seu próprio navegador. O que aparecer no terminal é a saída real.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-02-e1', 'js-fund-02', 'Escreva um programa que mostre exatamente o texto:

~~~text
Olá, CodeQuest!
~~~',
  '// Escreva seu código abaixo
', 'output_match', 'Olá, CodeQuest!',
  null, null, 'Use console.log() com o texto entre aspas, exatamente como pedido (inclusive a vírgula e a exclamação).',
  'A saída precisa bater caractere por caractere. `console.log("Olá, CodeQuest!");` produz exatamente a linha esperada.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-02-e2', 'js-fund-02', 'Agora duas linhas. Faça o programa mostrar:

~~~text
Meu nome é Dev
Estou aprendendo JavaScript
~~~',
  'console.log("Meu nome é Dev");
// falta a segunda linha
', 'output_match', 'Meu nome é Dev
Estou aprendendo JavaScript',
  null, null, 'Cada console.log() já pula de linha sozinho. Você só precisa de um segundo console.log().',
  'Dois `console.log()` em sequência geram duas linhas, porque cada um adiciona uma quebra de linha ao final automaticamente.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-fund-03', 'js-fundamentos', 'Comentários e ponto e vírgula', 'Notas para humanos — e uma pegadinha clássica', '## Comentários: o computador ignora, você agradece

Comentário é texto que o JavaScript **não executa**. Serve para explicar uma decisão, marcar um pendência ou desligar temporariamente uma linha.

~~~js
// uma linha inteira ignorada

console.log("isto roda"); // ignorado a partir daqui

/*
  Várias linhas de uma vez.
  Útil para explicações mais longas.
*/
~~~

Desligar uma linha para testar é uma das táticas mais usadas por quem programa:

~~~js
console.log("versão nova");
// console.log("versão antiga");
~~~

## O ponto e vírgula

Em JavaScript, o `;` marca o fim de uma instrução. Só que a linguagem tem um mecanismo chamado **inserção automática de ponto e vírgula**: quando você esquece, na maioria das vezes ele é colocado sozinho e o código funciona mesmo assim.

~~~js
console.log("funciona")
console.log("isto também")
~~~

Parece ótimo — e é justamente aí que mora a pegadinha. Em alguns casos o ponto e vírgula é inserido em um lugar que você não queria, e o programa passa a fazer outra coisa **sem dar erro**, que é o tipo de problema mais difícil de encontrar.

> A recomendação deste curso: **sempre escreva o ponto e vírgula**. É um caractere, e você elimina uma categoria inteira de bug silencioso.

## Nomes que o JavaScript diferencia

`Nome`, `nome` e `NOME` são três coisas diferentes. A linguagem diferencia maiúsculas de minúsculas — inclusive em `console.log`, que não funciona escrito `Console.Log`.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-03-e1', 'js-fund-03', 'Qual destas linhas é um comentário de **uma linha** em JavaScript?',
  null, 'multiple_choice', '// isto é um comentário',
  '["// isto é um comentário","# isto é um comentário","<!-- isto é um comentário -->","** isto é um comentário"]'::jsonb, null, null,
  'Em JavaScript o comentário de uma linha é `//`. O `#` é de Python e o `<!-- -->` é do HTML. Para várias linhas, o JavaScript usa `/* ... */`.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-03-e2', 'js-fund-03', 'O código abaixo mostra duas linhas, mas a primeira era só um teste. **Comente** a linha do teste e acrescente a linha que falta, para a saída ficar exatamente:

~~~text
Relatório final
~~~',
  'console.log("teste temporário");
', 'output_match', 'Relatório final',
  null, null, 'Coloque // no começo da linha do teste e escreva um novo console.log() com o texto pedido.',
  'Com `//` na frente, a linha vira comentário e deixa de ser executada — sem precisar apagá-la. É assim que se testa uma alteração sem perder a versão anterior.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-fund-04', 'js-fundamentos', 'Quando o código quebra', 'Ler o erro é metade da solução', '## Errar é o estado normal

Ninguém escreve código sem errar. A diferença entre quem está começando e quem já tem prática não é errar menos — é **ler o erro** em vez de fechar os olhos.

Uma mensagem de erro em JavaScript tem três partes úteis: o **tipo**, a **descrição** e a **linha**.

~~~text
Linha 2: ReferenceError: nomes is not defined
~~~

## Os três erros que você mais vai ver

**ReferenceError** — você usou um nome que não existe. Quase sempre é erro de digitação:

~~~js
let nome = "Ana";
console.log(nomes); // ReferenceError: nomes is not defined
~~~

**TypeError** — o valor existe, mas não faz o que você pediu:

~~~js
let idade = 20;
idade.toUpperCase(); // TypeError: idade.toUpperCase is not a function
~~~

Faz sentido: `toUpperCase` transforma texto em maiúsculas, e `20` não é texto.

**SyntaxError** — a frase está mal escrita e o JavaScript nem consegue começar:

~~~js
console.log("faltou fechar";
~~~

Repare na diferença: no SyntaxError **nada** roda, nem as linhas anteriores. Nos outros dois, o programa roda até o ponto do erro e para ali.

## A rotina que resolve

1. Leia a **linha** indicada.
2. Leia o **tipo** — ele já diz a categoria do problema.
3. Compare o nome que você escreveu com o nome que você declarou, letra por letra.

> Um erro não é uma reprovação. É o JavaScript dizendo, com precisão, onde ele se perdeu.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-04-e1', 'js-fund-04', 'Qual erro este código produz?

~~~js
let nome = "Ana";
console.log(nomes);
~~~',
  null, 'multiple_choice', 'ReferenceError: nomes is not defined',
  '["ReferenceError: nomes is not defined","TypeError: nomes is not a function","SyntaxError: unexpected token","Nenhum: o programa mostra \"Ana\""]'::jsonb, null, null,
  'A variável declarada é `nome`, no singular. Ao pedir `nomes`, o JavaScript procura um nome que nunca foi criado e levanta um **ReferenceError**. Erro de digitação é a causa número um desse erro.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-04-e2', 'js-fund-04', 'O código abaixo quebra com `ReferenceError`. Corrija para que a saída seja:

~~~text
Tudo certo!
~~~',
  'let mensagem = "Tudo certo!";
console.log(menssagem);
', 'output_match', 'Tudo certo!',
  null, null, 'Compare letra por letra o nome usado no console.log() com o nome declarado no let.',
  'A variável foi declarada como `mensagem` e usada como `menssagem`, com dois "s". Para o JavaScript são dois nomes completamente diferentes — e só o primeiro existe.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-fund-05', 'js-fundamentos', 'Conversando com quem usa', 'A função prompt()', '## Programas que perguntam

Até agora seus programas só falavam. Com `prompt()` eles passam a **ouvir**:

~~~js
const nome = prompt("Qual é o seu nome? ");
console.log("Prazer, " + nome);
~~~

O que acontece, em ordem:

1. o texto entre parênteses aparece como pergunta;
2. o programa **para** e espera a resposta;
3. o que foi digitado é guardado na variável `nome`;
4. a execução continua.

## No navegador de verdade

`prompt()` abre uma caixinha no topo da página. Aqui no CodeQuest as respostas são **simuladas**: cada exercício traz uma lista de entradas prontas, mostrada logo abaixo do editor, e cada `prompt()` consome a próxima da fila. Assim seu programa é sempre testado com os mesmos valores.

## O detalhe que derruba todo mundo

`prompt()` devolve **sempre texto**, mesmo quando a pessoa digita um número:

~~~js
const idade = prompt("Sua idade: ");
console.log(idade + 1);
~~~

Se a pessoa digitar `20`, isso mostra `201` — e não `21`. O JavaScript entendeu `"20" + 1` como "junte o texto 20 com o texto 1".

Guarde essa cena: a lição **Conversão de tipos**, no próximo módulo, existe por causa dela.', null, 5)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-05-e1', 'js-fund-05', 'Pergunte a cidade da pessoa e mostre uma mensagem de despedida. Com a entrada simulada `Recife`, a saída deve ser exatamente:

~~~text
De qual cidade você é? Boa viagem para Recife
~~~',
  'const cidade = prompt("De qual cidade você é? ");
', 'output_match', 'De qual cidade você é? Boa viagem para Recife',
  null, '["Recife"]'::jsonb, 'A pergunta do prompt() já aparece no terminal. Falta só um console.log() juntando "Boa viagem para " com a variável cidade.',
  'O texto do `prompt()` é escrito sem pular linha, então a resposta do `console.log()` continua na mesma linha. Juntar textos com `+` é chamado de **concatenação**.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-fund-05-e2', 'js-fund-05', 'Que tipo de valor `prompt()` devolve quando a pessoa digita `42`?',
  null, 'multiple_choice', 'Texto (string), sempre — mesmo parecendo número',
  '["Texto (string), sempre — mesmo parecendo número","Número (number), porque 42 é um número","Depende: número se for dígito, texto se tiver letra","Booleano (true ou false)"]'::jsonb, null, null,
  '`prompt()` devolve string em qualquer situação. É por isso que `prompt() + 1` gruda os valores em vez de somar. Para fazer conta, é preciso converter antes — assunto da próxima lição.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-variaveis', 'javascript', 'Variáveis', 'Guardar valores com let e const, os tipos do JavaScript e a conversão que evita o bug mais comum de quem começa.', '📦', 2)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-var-01', 'js-variaveis', 'let, const e o var que você vai encontrar por aí', 'Três formas de declarar — e por que só duas importam', '## Uma variável é uma caixa com etiqueta

Você guarda um valor, dá um nome a ele e passa a usar o nome:

~~~js
let pontos = 10;
console.log(pontos);
~~~

~~~text
10
~~~

O `=` aqui **não** é "igual" da matemática. Ele significa "guarde o valor da direita na variável da esquerda".

## let: muda quando precisar

~~~js
let pontos = 10;
pontos = 25;
console.log(pontos);
~~~

~~~text
25
~~~

Repare que `let` aparece **só na primeira vez**. Depois disso a variável já existe e você só atribui um valor novo.

## const: não muda mais

`const` é para valores que não devem ser trocados depois de definidos:

~~~js
const PI = 3.14;
PI = 3.15; // TypeError: Assignment to constant variable.
~~~

Isso não é uma limitação chata — é uma proteção. Se o valor não deveria mudar, o JavaScript avisa quando alguém tenta.

> **Regra prática deste curso:** comece sempre com `const`. Só troque para `let` quando você perceber que precisa mesmo reatribuir. Assim o próprio código documenta o que muda e o que não muda.

## E o var?

`var` é a forma antiga, de antes de 2015. Você vai encontrá-la em código mais velho e em vídeos antigos, e ela tem comportamentos que confundem (a lição de **escopo**, no módulo de Funções, mostra um deles). Reconheça quando vir — mas escreva `let` e `const`.

## Nomes que ajudam

| Bom | Ruim | Por quê |
| --- | --- | --- |
| `quantidadeDeAlunos` | `q` | o nome explica sozinho |
| `precoFinal` | `x2` | você entende daqui a um mês |
| `estaLogado` | `flag` | diz o que representa |

Em JavaScript o costume é o **camelCase**: primeira palavra minúscula, as seguintes com inicial maiúscula, sem espaços nem acentos.', '[{"language":"JavaScript","code":"let pontos = 10;\nconst nome = \"Ana\";"},{"language":"Python","code":"pontos = 10\nnome = \"Ana\""},{"language":"Java","code":"int pontos = 10;\nfinal String nome = \"Ana\";"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-01-e1', 'js-var-01', 'Crie uma variável chamada `nome` guardando o texto `Ana` e mostre o conteúdo dela. A saída deve ser:

~~~text
Ana
~~~',
  '// declare a variável e mostre o valor
', 'output_match', 'Ana',
  null, null, 'Duas linhas: uma com const nome = "Ana"; e outra com console.log(nome);',
  'Dentro do `console.log()` vai o **nome da variável, sem aspas**. Com aspas (`console.log("nome")`) você mostraria a palavra "nome", e não o valor guardado nela.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-01-e2', 'js-var-01', 'O que acontece ao executar isto?

~~~js
const limite = 100;
limite = 200;
~~~',
  null, 'multiple_choice', 'TypeError: Assignment to constant variable.',
  '["TypeError: Assignment to constant variable.","O valor muda para 200 normalmente","ReferenceError: limite is not defined","O programa mostra um aviso, mas continua com 100"]'::jsonb, null, null,
  'Uma variável declarada com `const` não aceita nova atribuição. O JavaScript interrompe o programa com um **TypeError** — que é justamente o ponto: se o valor não deveria mudar, o erro aparece na hora, e não como um comportamento estranho lá na frente.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-var-02', 'js-variaveis', 'Tipos de valor', 'string, number, boolean e o typeof', '## Nem todo valor é da mesma natureza

Os três tipos que você vai usar o tempo todo:

| Tipo | O que guarda | Exemplo |
| --- | --- | --- |
| `string` | texto | `"Ana"`, `''oi''` |
| `number` | número | `7`, `3.5`, `-2` |
| `boolean` | verdadeiro ou falso | `true`, `false` |

E dois que representam "vazio", com uma diferença importante:

- `undefined` — a variável existe, mas **nunca recebeu valor**;
- `null` — alguém **colocou** o vazio ali, de propósito.

## Um detalhe: número é número

Ao contrário de outras linguagens, o JavaScript não separa inteiro de decimal. `7` e `3.5` são os dois `number`. Isso simplifica — e explica por que `10 / 2` mostra `5`, e não `5.0`.

## typeof: perguntando o tipo

~~~js
console.log(typeof "Ana");
console.log(typeof 7);
console.log(typeof true);
~~~

~~~text
string
number
boolean
~~~

## O + faz duas coisas diferentes

Esta é **a** confusão do JavaScript, e vale parar aqui:

~~~js
console.log(10 + 5);
console.log("10" + 5);
~~~

~~~text
15
105
~~~

Na primeira linha os dois lados são números, então o `+` **soma**. Na segunda, um dos lados é texto — e aí o `+` **junta** (concatena), transformando o `5` em `"5"`.

Não é um bug: é uma regra da linguagem. O problema é que ela é silenciosa, e um `105` inesperado costuma custar horas a quem não conhece a regra.

> Quando aparecer um resultado grudado em vez de somado, a primeira pergunta é sempre: **algum desses valores é texto?**', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-02-e1', 'js-var-02', 'O que `console.log(typeof "10");` mostra?',
  null, 'multiple_choice', 'string',
  '["string","number","text","undefined"]'::jsonb, null, null,
  'O que está entre aspas é texto, mesmo parecendo número. `typeof "10"` é `string`; sem as aspas, `typeof 10` seria `number`.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-02-e2', 'js-var-02', 'Mostre, nesta ordem, o resultado de juntar o texto `"10"` com o número `5` e o resultado de somar os números `10` e `5`. A saída deve ser:

~~~text
105
15
~~~',
  '// primeiro a concatenação, depois a soma
', 'output_match', '105
15',
  null, null, 'Na primeira linha, um dos valores precisa estar entre aspas: console.log("10" + 5);',
  'Com `"10" + 5` o JavaScript trata tudo como texto e devolve `"105"`. Com `10 + 5` os dois lados são números e o resultado é `15`. O mesmo símbolo, duas operações — decididas pelo tipo dos valores.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-var-03', 'js-variaveis', 'Conversão de tipos', 'Number(), String() e o NaN', '## O problema, de novo

`prompt()` devolve texto. Sempre. Então isto está errado:

~~~js
const idade = prompt("Sua idade: ");
console.log(idade + 1);
~~~

Com a resposta `20`, a saída é `201`. O JavaScript juntou os textos.

## Number(): texto vira número

~~~js
const idade = Number(prompt("Sua idade: "));
console.log(idade + 1);
~~~

Agora, com `20`, a saída é `21`. A conversão acontece **antes** de a conta ser feita.

## As conversões que você vai usar

| Função | Faz | Exemplo |
| --- | --- | --- |
| `Number(x)` | texto → número | `Number("7")` → `7` |
| `String(x)` | número → texto | `String(7)` → `"7"` |
| `parseInt(x)` | texto → inteiro | `parseInt("3.9")` → `3` |
| `Boolean(x)` | qualquer → true/false | `Boolean("")` → `false` |

## Quando a conversão não dá certo: NaN

Se o texto não representa um número, `Number()` devolve `NaN` — *Not a Number*:

~~~js
console.log(Number("abc"));
~~~

~~~text
NaN
~~~

`NaN` é contagioso: qualquer conta com ele também dá `NaN`. Se um resultado seu virou `NaN`, procure a **primeira** conversão que falhou — o resto é consequência.

## Onde converter

Converta **na entrada**, na mesma linha do `prompt()`. Assim a variável já nasce com o tipo certo e você não precisa lembrar disso em nenhum outro lugar do programa:

~~~js
const nota = Number(prompt("Nota: "));
const peso = Number(prompt("Peso: "));
console.log(nota * peso);
~~~', '[{"language":"JavaScript","code":"const idade = Number(prompt(\"Idade: \"));"},{"language":"Python","code":"idade = int(input(\"Idade: \"))"},{"language":"Java","code":"int idade = Integer.parseInt(entrada.nextLine());"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-03-e1', 'js-var-03', 'Peça um número e mostre esse número somado a 10. Com a entrada simulada `5`, a saída deve ser exatamente:

~~~text
Digite um número: 15
~~~',
  'const numero = prompt("Digite um número: ");
', 'output_match', 'Digite um número: 15',
  null, '["5"]'::jsonb, 'Envolva o prompt() com Number(...) antes de guardar. Sem isso a saída seria 510.',
  'Sem `Number()`, `"5" + 10` produz `"510"`. Convertendo na entrada, a variável já nasce como número e a soma funciona como você espera.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-03-e2', 'js-var-03', 'O que `Number("abc")` devolve?',
  null, 'multiple_choice', 'NaN',
  '["NaN","0","null","Um erro que para o programa"]'::jsonb, null, null,
  '`NaN` significa *Not a Number*. Repare que o programa **não para** — ele continua com um valor inválido, e qualquer conta feita a partir dali também vira `NaN`. Por isso vale checar a conversão logo na entrada.', 20, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-var-04', 'js-variaveis', 'Template literals', 'A crase que acabou com a concatenação', '## Juntando texto e variável

Do jeito antigo, com `+`:

~~~js
const nome = "Ana";
const idade = 17;
console.log("Olá, " + nome + "! Você tem " + idade + " anos.");
~~~

Funciona, mas conte os espaços, as aspas e os `+`. É fácil errar — e difícil de ler.

## Do jeito moderno: crase e ${}

~~~js
const nome = "Ana";
const idade = 17;
console.log(`Olá, ${nome}! Você tem ${idade} anos.`);
~~~

~~~text
Olá, Ana! Você tem 17 anos.
~~~

O texto fica entre **crases** (` ` `), e tudo que estiver dentro de `${...}` é calculado e encaixado no lugar. Isso se chama **template literal**.

## Dá para colocar contas dentro

Não precisa ser só uma variável — qualquer expressão funciona:

~~~js
const nota1 = 7;
const nota2 = 9;
console.log(`Média: ${(nota1 + nota2) / 2}`);
~~~

~~~text
Média: 8
~~~

## E várias linhas de uma vez

Com crase, o texto pode ocupar várias linhas sem nenhum truque:

~~~js
console.log(`Relatório
--------
Aluna: Ana`);
~~~

~~~text
Relatório
--------
Aluna: Ana
~~~

> A partir daqui, este curso usa template literal sempre que houver variável no meio do texto. É mais curto, mais legível e evita o erro clássico de esquecer um espaço antes do `+`.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-04-e1', 'js-var-04', 'Usando **template literal**, mostre a média de duas notas. Com `nome` valendo `Ana`, `nota1` valendo `7` e `nota2` valendo `9`, a saída deve ser:

~~~text
A média de Ana é 8
~~~',
  'const nome = "Ana";
const nota1 = 7;
const nota2 = 9;
', 'output_match', 'A média de Ana é 8',
  null, null, 'console.log(`A média de ${nome} é ${(nota1 + nota2) / 2}`); — atenção aos parênteses da conta.',
  'Os parênteses em `(nota1 + nota2) / 2` são obrigatórios: sem eles o JavaScript faria primeiro `nota2 / 2` e o resultado sairia errado. Repare também que `16 / 2` mostra `8`, e não `8.0` — em JavaScript não existe distinção entre inteiro e decimal.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-var-04-e2', 'js-var-04', 'Qual destas linhas mostra `Oi, Ana` usando template literal, com a variável `nome` valendo `"Ana"`?',
  null, 'multiple_choice', 'console.log(`Oi, ${nome}`);',
  '["console.log(`Oi, ${nome}`);","console.log(''Oi, ${nome}'');","console.log(`Oi, {nome}`);","console.log(`Oi, $nome`);"]'::jsonb, null, null,
  'São duas exigências ao mesmo tempo: o texto entre **crases** e a variável dentro de `${...}`. Com aspas simples nada é substituído — sai literalmente `Oi, ${nome}`. E sem o cifrão, `{nome}` também é apenas texto.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-condicionais', 'javascript', 'Condicionais', 'Fazer o programa decidir: if, else, else if, switch e a diferença entre == e === que separa quem entende JavaScript de quem decora.', '🔀', 3)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-cond-01', 'js-condicionais', 'A primeira decisão', 'if, parênteses e chaves', '## Executar só às vezes

Até agora todas as linhas rodavam sempre. Com `if`, um trecho só roda **se** uma condição for verdadeira:

~~~js
const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
}
~~~

~~~text
Aprovado
~~~

Se `nota` fosse `5`, o programa simplesmente não mostraria nada e seguiria em frente.

## A anatomia da linha

~~~js
if (condição) {
  // o que acontece quando for verdadeira
}
~~~

Três exigências:

1. a condição vai entre **parênteses**;
2. o bloco vai entre **chaves**;
3. tudo que estiver dentro das chaves pertence ao `if`.

Em JavaScript **as chaves é que delimitam o bloco** — a indentação é só para humanos lerem. (Em Python é o contrário: lá a indentação é obrigatória e não existem chaves.) Ainda assim, indente: código sem indentação é legal para o computador e ilegível para você.

## Os operadores de comparação

| Operador | Significa | Exemplo verdadeiro |
| --- | --- | --- |
| `>` | maior que | `10 > 5` |
| `<` | menor que | `3 < 7` |
| `>=` | maior ou igual | `7 >= 7` |
| `<=` | menor ou igual | `4 <= 9` |
| `===` | igual a | `5 === 5` |
| `!==` | diferente de | `5 !== 3` |

## Um erro que quase todo mundo comete

~~~js
if (nota = 7) {   // ERRADO
if (nota === 7) { // certo
~~~

Um `=` **atribui**; três `===` **comparam**. Trocar um pelo outro não dá erro de sintaxe — o programa roda e faz a coisa errada em silêncio. Se um `if` seu está sempre entrando, confira isso primeiro.

## Uma condição é verdadeira ou falsa

Toda condição resulta em `true` ou `false`. Dá para ver isso:

~~~js
console.log(10 > 5);
console.log(10 === 5);
~~~

~~~text
true
false
~~~', '[{"language":"JavaScript","code":"if (nota >= 7) {\n  console.log(\"Aprovado\");\n}"},{"language":"Python","code":"if nota >= 7:\n    print(\"Aprovado\")"},{"language":"Java","code":"if (nota >= 7) {\n  System.out.println(\"Aprovado\");\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-01-e1', 'js-cond-01', 'Em JavaScript, o que delimita o bloco de código de um `if`?',
  null, 'multiple_choice', 'As chaves { }',
  '["As chaves { }","A indentação com espaços","Os dois-pontos no fim da linha","A palavra end"]'::jsonb, null, null,
  'Em JavaScript quem define o bloco são as chaves `{ }`. A indentação não muda nada para o interpretador — mas continua sendo essencial para quem lê. Python usa indentação e Ruby usa `end`; é o mesmo conceito com sintaxes diferentes.', 20, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-01-e2', 'js-cond-01', 'A variável `compra` já vale 150. Mostre `Tem desconto` **apenas se** a compra for maior que 100.

~~~text
Tem desconto
~~~',
  'const compra = 150;

// escreva o if abaixo
', 'output_match', 'Tem desconto',
  null, null, 'if (compra > 100) { ... } — a condição entre parênteses e o console.log() dentro das chaves.',
  'Como `150 > 100` é verdadeiro, o bloco roda. Troque o valor de `compra` para 50 e execute de novo: o programa não mostra nada, porque não existe um caminho alternativo — isso é assunto da próxima lição.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-cond-02', 'js-condicionais', 'O caminho alternativo', 'if / else', '## Quando existem dois caminhos

O `else` cobre todos os casos em que a condição do `if` foi falsa:

~~~js
const idade = 20;

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}
~~~

~~~text
Maior de idade
~~~

Três garantias que o `else` te dá:

- **sempre** um dos dois blocos roda;
- **nunca** os dois rodam;
- o `else` não tem condição própria — ele é o "em todos os outros casos".

## O else anda colado

O `else` vem logo depois da chave que fecha o `if`, na mesma linha:

~~~js
if (condição) {
  // ...
} else {
  // ...
}
~~~

## Cuidado com o ponto e vírgula sobrando

~~~js
if (idade >= 18); {   // ERRADO
  console.log("Maior de idade");
}
~~~

Esse `;` depois do parêntese encerra o `if` ali mesmo. O bloco seguinte passa a rodar **sempre**, independentemente da condição — e o JavaScript não reclama. É outro erro silencioso para a sua coleção.

## Testando com dados reais

Junte com o que você aprendeu no módulo anterior:

~~~js
const idade = Number(prompt("Digite sua idade: "));

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}
~~~

Repare no `Number()`: sem ele a comparação seria entre **texto** e número, e o resultado ficaria imprevisível.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-02-e1', 'js-cond-02', 'Pergunte a idade e classifique a pessoa. Com a entrada simulada `20`, a saída deve ser exatamente:

~~~text
Digite sua idade: Maior de idade
~~~',
  'const idade = Number(prompt("Digite sua idade: "));

// escreva o if / else abaixo
', 'output_match', 'Digite sua idade: Maior de idade',
  null, '["20"]'::jsonb, 'if (idade >= 18) { console.log("Maior de idade"); } else { console.log("Menor de idade"); }',
  'Como a pergunta do `prompt()` não pula linha, a resposta aparece logo em seguida, na mesma linha. Com `20`, a condição `idade >= 18` é verdadeira e só o primeiro bloco roda.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-02-e2', 'js-cond-02', 'O **mesmo programa** da questão anterior, agora com a entrada simulada `15`. A saída deve ser:

~~~text
Digite sua idade: Menor de idade
~~~',
  'const idade = Number(prompt("Digite sua idade: "));

// escreva o if / else abaixo
', 'output_match', 'Digite sua idade: Menor de idade',
  null, '["15"]'::jsonb, 'É exatamente o mesmo código do exercício anterior — quem muda é só a entrada.',
  'O código é idêntico; só a entrada mudou. É assim que se testa um `if / else` de verdade: um valor para cada caminho. Um programa que você só testou com um caso é um programa meio testado.', 35, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-cond-03', 'js-condicionais', 'Vários caminhos', 'else if e switch', '## Mais de duas possibilidades

Quando existem várias faixas, encadeie com `else if`:

~~~js
const temperatura = 25;

if (temperatura > 30) {
  console.log("Calor");
} else if (temperatura >= 15) {
  console.log("Ameno");
} else {
  console.log("Frio");
}
~~~

~~~text
Ameno
~~~

## A ordem é tudo

O JavaScript testa **de cima para baixo** e para no primeiro verdadeiro. Os demais nem são avaliados.

Por isso este código está errado:

~~~js
if (nota >= 5) {
  console.log("Recuperação");
} else if (nota >= 7) {   // nunca alcançado
  console.log("Aprovado");
}
~~~

Com `nota = 9`, a primeira condição já é verdadeira e o programa imprime "Recuperação". A regra prática: **do mais específico para o mais geral**, ou seja, das faixas mais altas para as mais baixas.

## switch: quando é igualdade exata

Quando você compara **a mesma variável** com **vários valores exatos**, o `switch` fica mais legível:

~~~js
const dia = 3;

switch (dia) {
  case 1:
    console.log("Domingo");
    break;
  case 2:
    console.log("Segunda");
    break;
  case 3:
    console.log("Terça");
    break;
  default:
    console.log("Dia inválido");
}
~~~

~~~text
Terça
~~~

O `break` **não é opcional**: sem ele a execução continua caindo nos casos seguintes (o chamado *fall-through*), e o programa mostra vários dias de uma vez. O `default` faz o papel do `else`.

> Use `switch` para igualdade exata contra uma lista de valores. Para faixas (`>`, `<=`), use `else if` — `switch` não sabe fazer isso.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-03-e1', 'js-cond-03', 'A variável `temperatura` vale 12. Classifique em três faixas: acima de 30 é `Calor`, de 15 a 30 é `Ameno`, abaixo de 15 é `Frio`. A saída deve ser:

~~~text
Frio
~~~',
  'const temperatura = 12;

// escreva o if / else if / else abaixo
', 'output_match', 'Frio',
  null, null, 'Comece pela faixa mais alta: if (temperatura > 30) ... else if (temperatura >= 15) ... else ...',
  'Com 12, as duas primeiras condições falham e o `else` assume. Começar pela faixa mais alta é o que garante que cada valor caia em um único caminho — testando de baixo para cima, a faixa larga engoliria as estreitas.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-03-e2', 'js-cond-03', 'O que acontece em um `switch` se você esquecer o `break` no fim de um `case` que foi escolhido?',
  null, 'multiple_choice', 'A execução continua nos cases seguintes',
  '["A execução continua nos cases seguintes","O programa para com um erro de sintaxe","Nada: o break é opcional","O switch volta para o primeiro case"]'::jsonb, null, null,
  'Isso se chama *fall-through*: sem o `break`, o JavaScript segue executando os `case` de baixo, mesmo sem eles baterem com o valor. É a origem de bugs em que "aparecem coisas demais" na tela.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-cond-04', 'js-condicionais', 'Combinando condições', '&&, ||, ! e o famoso === ', '## Duas condições ao mesmo tempo

- `&&` (**E**) — verdadeiro quando **as duas** condições são verdadeiras.
- `||` (**OU**) — verdadeiro quando **pelo menos uma** é verdadeira.
- `!` (**NÃO**) — inverte o valor: `!true` vira `false`.

~~~js
const idade = 22;
const temHabilitacao = true;

if (idade >= 18 && temHabilitacao) {
  console.log("Pode dirigir");
} else {
  console.log("Não pode dirigir");
}
~~~

~~~text
Pode dirigir
~~~

Basta uma das duas falhar para o `&&` inteiro virar falso.

## == e ===: a diferença que define o JavaScript

Esta é a lição mais importante do módulo.

~~~js
console.log("5" == 5);
console.log("5" === 5);
~~~

~~~text
true
false
~~~

- `==` compara **depois de converter** os tipos. Ele vê o texto `"5"`, converte para número e conclui que são iguais.
- `===` compara **valor e tipo**. Texto nunca é igual a número, então dá `false`.

O `==` parece amigável, mas produz resultados que ninguém consegue prever de cabeça:

~~~js
console.log(0 == "");      // true
console.log(null == undefined); // true
console.log("0" == false); // true
~~~

> **Regra deste curso, sem exceção: use sempre `===` e `!==`.** Se você precisa comparar tipos diferentes, converta explicitamente com `Number()` — assim a intenção fica escrita no código, em vez de escondida numa regra de conversão automática.

## Truthy e falsy

Um `if` aceita qualquer valor, não só `true` e `false`. Quando o valor não é booleano, o JavaScript pergunta se ele é **falsy**. São exatamente oito:

`false`, `0`, `-0`, `0n`, `""` (texto vazio), `null`, `undefined` e `NaN`.

**Todo o resto é truthy** — incluindo `"0"`, `"false"`, `[]` e `{}`, que enganam bastante.

Na prática isso é muito útil:

~~~js
const nome = "";

if (nome) {
  console.log(`Olá, ${nome}`);
} else {
  console.log("Nome não informado");
}
~~~

~~~text
Nome não informado
~~~

Texto vazio é falsy, então o `else` assume — sem precisar escrever `nome !== ""`.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-04-e1', 'js-cond-04', 'Só pode dirigir quem tem 18 anos **ou mais** **e** possui habilitação. Com `idade` valendo 22 e `temHabilitacao` valendo `false`, a saída deve ser:

~~~text
Não pode dirigir
~~~',
  'const idade = 22;
const temHabilitacao = false;

// escreva o if / else abaixo
', 'output_match', 'Não pode dirigir',
  null, null, 'A condição junta as duas exigências: idade >= 18 && temHabilitacao',
  'A idade passa, mas a habilitação não — e no `&&` basta um lado falhar para tudo virar falso. Repare que `temHabilitacao` já é booleano, então não precisa de `=== true`: escrever `if (temHabilitacao)` é mais direto e mais legível.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-04-e2', 'js-cond-04', 'O que este código mostra?

~~~js
console.log("5" === 5);
~~~',
  null, 'multiple_choice', 'false',
  '["false","true","undefined","Um erro de tipo"]'::jsonb, null, null,
  'O `===` compara **valor e tipo**. `"5"` é string e `5` é number, então o resultado é `false`. Com `==` daria `true`, porque ele converte antes de comparar — e é justamente essa conversão invisível que torna o `==` perigoso.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-cond-04-e3', 'js-cond-04', 'Qual destes valores é **truthy** (ou seja, faz o `if` entrar)?',
  null, 'multiple_choice', 'O texto "0"',
  '["O texto \"0\"","O número 0","O texto vazio","NaN"]'::jsonb, null, null,
  'O texto `"0"` não está vazio, então é truthy — mesmo parecendo o número zero. Já `0`, `""` e `NaN` estão na lista dos oito valores falsy. É por isso que checar entrada de usuário com `if (valor)` engana: o texto `"0"` passa.', 25, 3)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-repeticoes', 'javascript', 'Repetições', 'Fazer o computador repetir sem você reescrever: for, while, acumuladores e a travessia de listas com for...of.', '🔁', 4)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-rep-01', 'js-repeticoes', 'O laço for', 'Quando você sabe quantas vezes', '## Repetir sem copiar e colar

Para mostrar os números de 1 a 5, você poderia escrever cinco `console.log()`. Para 1 a 1000, não poderia. É para isso que existe o `for`:

~~~js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
~~~

~~~text
1
2
3
4
5
~~~

## As três partes dentro dos parênteses

~~~js
for (início; condição; passo) {
~~~

Elas são separadas por **ponto e vírgula** e cada uma tem um papel:

1. **início** — `let i = 1` roda **uma única vez**, antes de tudo;
2. **condição** — `i <= 5` é testada **antes de cada volta**. Enquanto for verdadeira, o bloco roda;
3. **passo** — `i++` roda **no fim de cada volta**.

Acompanhe a mecânica: começa com `i` valendo 1 → testa `1 <= 5` → mostra 1 → `i` vira 2 → testa de novo... até `i` virar 6, quando `6 <= 5` é falso e o laço termina.

## i++ e as outras formas de somar

`i++` é uma abreviação de `i = i + 1`. Existem três formas de escrever a mesma coisa, e você vai ver todas:

~~~js
i = i + 1;
i += 1;
i++;
~~~

Para somar de 2 em 2, use `i += 2`. Para contar de trás para frente, `i--`.

## Contando de trás para frente

~~~js
for (let i = 3; i >= 1; i--) {
  console.log(i);
}
~~~

~~~text
3
2
1
~~~

## Por que let e não var

Escreva sempre `let i` no início do `for`. Com `let`, a variável **só existe dentro do laço** e cada volta tem a sua própria cópia — o que evita uma classe inteira de bugs que o `var` causa. A lição de **escopo**, no módulo de Funções, mostra o problema em detalhe.', '[{"language":"JavaScript","code":"for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}"},{"language":"Python","code":"for i in range(1, 6):\n    print(i)"},{"language":"Java","code":"for (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-01-e1', 'js-rep-01', 'Mostre os números de 1 a 5, um por linha:

~~~text
1
2
3
4
5
~~~',
  '// escreva o for abaixo
', 'output_match', '1
2
3
4
5',
  null, null, 'for (let i = 1; i <= 5; i++) { console.log(i); }',
  'A condição é `i <= 5` (menor **ou igual**). Com `i < 5` o laço pararia no 4 — esse deslize de um número a mais ou a menos é tão comum que tem nome: *erro de um*.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-01-e2', 'js-rep-01', 'No `for` abaixo, quantas vezes a parte `let i = 0` é executada?

~~~js
for (let i = 0; i < 10; i++) {
  console.log(i);
}
~~~',
  null, 'multiple_choice', '1 vez',
  '["1 vez","10 vezes","11 vezes","Nenhuma vez"]'::jsonb, null, null,
  'A inicialização roda **uma única vez**, antes da primeira volta. Quem roda a cada volta é a condição (11 vezes, contando a que falha) e o passo (10 vezes).', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-rep-02', 'js-repeticoes', 'O laço while', 'Quando você não sabe quantas vezes', '## Repetir enquanto algo for verdade

O `while` repete **enquanto** a condição for verdadeira. Use quando o número de voltas não é conhecido de antemão:

~~~js
let contador = 3;

while (contador >= 1) {
  console.log(contador);
  contador--;
}

console.log("Fim");
~~~

~~~text
3
2
1
Fim
~~~

## As três peças que não podem faltar

Todo `while` correto tem:

1. uma variável **iniciada antes** do laço;
2. uma **condição** que depende dela;
3. uma **atualização** dessa variável dentro do bloco.

Esquecer a terceira é o erro clássico:

~~~js
let contador = 3;

while (contador >= 1) {
  console.log(contador);
  // faltou contador--
}
~~~

`contador` fica valendo 3 para sempre, a condição nunca fica falsa e o programa não para. Isso se chama **laço infinito**.

> No CodeQuest você pode testar sem medo: o código roda em um espaço separado do resto do aplicativo e é interrompido automaticamente depois de 4 segundos. Fora daqui, um laço infinito trava a página inteira.

## Como escolher entre for e while

| Situação | Use |
| --- | --- |
| "repita 10 vezes" | `for` |
| "para cada item da lista" | `for...of` |
| "até a pessoa digitar sair" | `while` |
| "enquanto houver saldo" | `while` |

A regra curta: **número de voltas conhecido → `for`; condição aberta → `while`**.

## do...while: pelo menos uma vez

Existe uma variação que testa a condição **no fim**, garantindo ao menos uma execução:

~~~js
let tentativas = 0;

do {
  console.log("rodou pelo menos uma vez");
  tentativas++;
} while (tentativas < 1);
~~~

É bem menos comum, mas útil em menus — onde você precisa mostrar as opções antes de perguntar se a pessoa quer sair.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-02-e1', 'js-rep-02', 'Usando `while`, faça uma contagem regressiva de 3 até 1 e depois mostre `Fim`:

~~~text
3
2
1
Fim
~~~',
  'let contador = 3;

// escreva o while abaixo
', 'output_match', '3
2
1
Fim',
  null, null, 'Dentro do while: mostre o contador e depois diminua com contador--. O console.log("Fim") fica FORA das chaves.',
  'O `contador--` é o que faz o laço terminar. E repare onde fica o `console.log("Fim")`: fora das chaves, para rodar uma vez só, depois que o laço acabar. Dentro, ele apareceria três vezes.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-02-e2', 'js-rep-02', 'O que faz um `while` virar um laço infinito?',
  null, 'multiple_choice', 'A variável da condição nunca é atualizada dentro do laço',
  '["A variável da condição nunca é atualizada dentro do laço","Usar while em vez de for","Colocar mais de uma instrução dentro das chaves","Iniciar a variável com zero"]'::jsonb, null, null,
  'Se nada dentro do bloco muda o valor testado na condição, ela continua verdadeira para sempre. Ao escrever um `while`, procure imediatamente a linha que aproxima a condição do fim — se ela não existe, o laço não termina.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-rep-03', 'js-repeticoes', 'Acumuladores e contadores', 'O padrão que aparece em todo lugar', '## Guardar um resultado que cresce

Somar todos os números de 1 a 100 na mão é inviável. Com um **acumulador**, são quatro linhas:

~~~js
let soma = 0;

for (let i = 1; i <= 100; i++) {
  soma += i;
}

console.log(soma);
~~~

~~~text
5050
~~~

A ideia: uma variável começa em 0 **fora** do laço, e a cada volta recebe mais um pedaço. No fim, ela tem o total.

## O erro de declarar dentro

~~~js
for (let i = 1; i <= 100; i++) {
  let soma = 0;   // ERRADO
  soma += i;
}
~~~

Aqui `soma` é recriada do zero a cada volta e some no fim dela — o total nunca se forma. **Acumulador se declara fora do laço.** Sempre.

## Contador: quantas vezes aconteceu

Mesma ideia, mas somando 1 quando uma condição bate:

~~~js
let quantidade = 0;

for (let i = 1; i <= 20; i++) {
  if (i % 5 === 0) {
    quantidade++;
  }
}

console.log(quantidade);
~~~

~~~text
4
~~~

## O operador %

O `%` (módulo) devolve o **resto** da divisão, e é a ferramenta padrão para "é múltiplo de?":

~~~js
console.log(10 % 3);
console.log(10 % 5);
~~~

~~~text
1
0
~~~

Resto zero significa divisão exata. Daí saem os dois testes que você mais vai usar:

- `numero % 2 === 0` → é par;
- `numero % 3 === 0` → é múltiplo de 3.

## Os quatro passos, sempre iguais

1. crie a variável **antes** do laço;
2. inicie em `0` (soma/contagem) ou no primeiro elemento (maior/menor);
3. atualize **dentro** do laço;
4. use **depois** que ele terminar.', null, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-03-e1', 'js-rep-03', 'Some todos os números de 1 a 100 e mostre o total:

~~~text
5050
~~~',
  'let soma = 0;

// escreva o for abaixo e mostre a soma no final
', 'output_match', '5050',
  null, null, 'Dentro do laço: soma += i. Depois do laço (fora das chaves): console.log(soma).',
  'O acumulador `soma` vive fora do laço, recebe um pedaço por volta e só é mostrado no fim. Se o `console.log()` estivesse dentro das chaves, você veria 100 linhas em vez de uma.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-03-e2', 'js-rep-03', 'Conte quantos números de 1 a 20 são múltiplos de 3 e mostre a quantidade:

~~~text
6
~~~',
  'let quantidade = 0;

// escreva o for e o if abaixo
', 'output_match', '6',
  null, null, 'Dentro do for, um if com numero % 3 === 0. Dentro do if, quantidade++.',
  'São 3, 6, 9, 12, 15 e 18 — seis números. O contador só sobe quando o resto da divisão por 3 é zero. Repare no `===`: comparar o resto com `0`, e não atribuir.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-rep-04', 'js-repeticoes', 'Controlando o laço e percorrendo listas', 'break, continue e for...of', '## Sair antes da hora: break

`break` interrompe o laço na hora, sem terminar as voltas restantes:

~~~js
for (let i = 1; i <= 10; i++) {
  if (i === 4) {
    break;
  }
  console.log(i);
}
~~~

~~~text
1
2
3
~~~

É o que você usa ao **procurar** algo: assim que encontra, não há motivo para continuar.

## Pular uma volta: continue

`continue` abandona só a volta atual e segue para a próxima:

~~~js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log(i);
}
~~~

~~~text
1
2
4
5
~~~

O 3 foi pulado, mas o laço continuou até o fim. **`break` sai do laço; `continue` sai da volta.**

## Listas: o array

Um **array** guarda vários valores em ordem, dentro de colchetes:

~~~js
const linguagens = ["Python", "JavaScript", "Java"];

console.log(linguagens[0]);
console.log(linguagens.length);
~~~

~~~text
Python
3
~~~

Duas coisas para gravar: a contagem **começa em 0** (por isso `linguagens[0]` é o primeiro) e `.length` diz quantos itens existem. Como o último índice é `length - 1`, o índice `3` desse array não existe — pedir por ele devolve `undefined`.

## for...of: percorrer sem pensar em índice

~~~js
const linguagens = ["Python", "JavaScript", "Java"];

for (const linguagem of linguagens) {
  console.log(linguagem);
}
~~~

~~~text
Python
JavaScript
Java
~~~

Não há `i`, não há `length`, não há como errar o limite. Quando você só precisa dos **valores**, `for...of` é a forma mais legível.

## Um aviso: for...in é outra coisa

~~~js
for (const i in linguagens) {
  console.log(i);
}
~~~

~~~text
0
1
2
~~~

`for...in` percorre os **índices** (e, em objetos, as chaves), não os valores. A troca de um pelo outro é um erro comum de quem está começando.

> Regra prática: **`of` para valores, `in` para chaves.** Em arrays, quase sempre você quer `of`.', '[{"language":"JavaScript","code":"for (const item of lista) {\n  console.log(item);\n}"},{"language":"Python","code":"for item in lista:\n    print(item)"},{"language":"Java","code":"for (String item : lista) {\n  System.out.println(item);\n}"}]'::jsonb, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-04-e1', 'js-rep-04', 'Mostre os números de 1 a 10, **pulando o 7**:

~~~text
1
2
3
4
5
6
8
9
10
~~~',
  '// use continue para pular o 7
', 'output_match', '1
2
3
4
5
6
8
9
10',
  null, null, 'Dentro do for: if (i === 7) { continue; } antes do console.log(i).',
  'O `continue` precisa vir **antes** do `console.log()` — se viesse depois, o 7 já teria sido mostrado. Com `break` no lugar dele, a saída pararia no 6.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-rep-04-e2', 'js-rep-04', 'Percorra o array `linguagens` com `for...of` e mostre cada nome em uma linha:

~~~text
Python
JavaScript
Java
~~~',
  'const linguagens = ["Python", "JavaScript", "Java"];

// escreva o for...of abaixo
', 'output_match', 'Python
JavaScript
Java',
  null, null, 'for (const linguagem of linguagens) { console.log(linguagem); }',
  'Com `for...of` você recebe direto o **valor** de cada posição, sem lidar com índices. Se tivesse usado `for...in`, a saída seria `0 1 2` — os índices, não os nomes.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-funcoes', 'javascript', 'Funções', 'Dar nome a um pedaço de código e reutilizá-lo: parâmetros, return, arrow functions e escopo.', '🧩', 5)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-func-01', 'js-funcoes', 'Criando uma função', 'Dar nome a um pedaço de código', '## O problema

Se o mesmo trecho aparece em três lugares do seu programa e você precisa corrigi-lo, são três correções — e basta esquecer uma para o programa ficar inconsistente.

Uma **função** resolve isso: você escreve o trecho **uma vez**, dá um nome a ele e passa a usar o nome.

## Declarar e chamar

~~~js
function saudar() {
  console.log("Bem-vindo ao CodeQuest");
}

saudar();
saudar();
~~~

~~~text
Bem-vindo ao CodeQuest
Bem-vindo ao CodeQuest
~~~

São duas etapas bem diferentes:

- **declarar** (`function saudar() { ... }`) apenas ensina o que fazer. Nada acontece;
- **chamar** (`saudar();`) é o que executa.

Declarar sem chamar é o esquecimento mais comum de quem está começando: o programa roda, não dá erro nenhum e não mostra nada.

## Os parênteses fazem parte do nome

~~~js
saudar;    // apenas menciona a função, não executa
saudar();  // executa
~~~

Sem os parênteses você está falando **sobre** a função, não pedindo que ela rode.

## Como escolher o nome

Funções fazem coisas, então o nome começa com um **verbo**, em camelCase:

- `calcularMedia`, `validarSenha`, `mostrarRelatorio` — bons;
- `media`, `senha`, `x` — ruins: parecem variáveis.

## Uma função por responsabilidade

Se você precisa usar "e" para explicar o que a função faz ("calcula a média **e** mostra na tela **e** salva"), provavelmente são três funções. Funções pequenas são mais fáceis de testar, de reaproveitar e de corrigir.', '[{"language":"JavaScript","code":"function saudar() {\n  console.log(\"Olá\");\n}\n\nsaudar();"},{"language":"Python","code":"def saudar():\n    print(\"Olá\")\n\nsaudar()"},{"language":"Java","code":"static void saudar() {\n  System.out.println(\"Olá\");\n}\n\nsaudar();"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-01-e1', 'js-func-01', 'Crie uma função chamada `abrirJogo` que mostre `Partida iniciada` e chame-a **duas vezes**:

~~~text
Partida iniciada
Partida iniciada
~~~',
  '// declare a função e chame duas vezes
', 'output_match', 'Partida iniciada
Partida iniciada',
  null, null, 'function abrirJogo() { console.log("Partida iniciada"); } e depois duas linhas com abrirJogo();',
  'O texto foi escrito uma vez só e apareceu duas — esse é o ganho. As chamadas ficam **fora** das chaves da função: dentro, elas fariam a função chamar a si mesma sem parar.', 35, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-01-e2', 'js-func-01', 'O que este programa mostra?

~~~js
function avisar() {
  console.log("Atenção");
}
~~~',
  null, 'multiple_choice', 'Nada: a função foi declarada, mas nunca chamada',
  '["Nada: a função foi declarada, mas nunca chamada","Atenção, uma vez","Um erro dizendo que falta chamar a função","Atenção, infinitamente"]'::jsonb, null, null,
  'Declarar só ensina o que fazer; executar é a chamada `avisar();`. E note que o JavaScript **não** avisa que você esqueceu — o programa termina normalmente, sem saída. Quando "não aparece nada", verifique se a chamada existe.', 25, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-func-02', 'js-funcoes', 'Parâmetros e return', 'Funções que recebem e devolvem', '## Funções que recebem dados

Um **parâmetro** é uma variável que a função recebe de fora:

~~~js
function saudar(nome) {
  console.log(`Olá, ${nome}!`);
}

saudar("Ana");
saudar("Luiz");
~~~

~~~text
Olá, Ana!
Olá, Luiz!
~~~

A mesma função, resultados diferentes. Pode ter quantos parâmetros você precisar, separados por vírgula.

## Funções que devolvem: return

`console.log()` **mostra**. `return` **devolve** — e essa diferença é maior do que parece:

~~~js
function calcularMedia(a, b) {
  return (a + b) / 2;
}

const resultado = calcularMedia(7, 9);
console.log(resultado);
console.log(calcularMedia(10, 6) > 7);
~~~

~~~text
8
true
~~~

Como a função **devolve** um valor, ele pode ser guardado, comparado, somado, passado adiante. Se ela apenas mostrasse na tela, o valor se perderia ali.

> Regra prática: uma função que **calcula** deve usar `return`. Deixe a exibição para quem chamou. Assim a mesma função serve para mostrar na tela hoje e para salvar num arquivo amanhã.

## return encerra a função na hora

~~~js
function testar() {
  return "primeiro";
  console.log("nunca chego aqui");
}
~~~

Nenhuma linha depois do `return` executa. Isso é útil para sair mais cedo:

~~~js
function dividir(a, b) {
  if (b === 0) {
    return "Não dá para dividir por zero";
  }
  return a / b;
}
~~~

## Função sem return devolve undefined

~~~js
function semRetorno() {
  console.log("oi");
}

const valor = semRetorno();
console.log(valor);
~~~

~~~text
oi
undefined
~~~

Se um resultado seu apareceu como `undefined`, a primeira suspeita é uma função que esqueceu o `return`.

## Valores padrão

Um parâmetro pode ter valor padrão, usado quando o argumento não é passado:

~~~js
function saudar(nome = "visitante") {
  console.log(`Olá, ${nome}!`);
}

saudar();
~~~

~~~text
Olá, visitante!
~~~', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-02-e1', 'js-func-02', 'Crie uma função `calcularMedia` que receba dois números e **devolva** a média. Mostre o resultado de `calcularMedia(7, 9)`:

~~~text
8
~~~',
  '// a função deve usar return, não console.log
', 'output_match', '8',
  null, null, 'function calcularMedia(a, b) { return (a + b) / 2; } e depois console.log(calcularMedia(7, 9));',
  'Os parênteses em `(a + b) / 2` são obrigatórios: sem eles o JavaScript dividiria só o `b`. E como `16 / 2` dá exatamente 8, a saída é `8` — em JavaScript não existe `8.0`, porque inteiro e decimal são o mesmo tipo.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-02-e2', 'js-func-02', 'O que este programa mostra?

~~~js
function dobrar(n) {
  console.log(n * 2);
}

const resultado = dobrar(5);
console.log(resultado);
~~~',
  null, 'multiple_choice', '10 e depois undefined',
  '["10 e depois undefined","10 e depois 10","undefined e depois 10","Apenas 10"]'::jsonb, null, null,
  'A função **mostra** 10, mas não **devolve** nada — e toda função sem `return` devolve `undefined`. Por isso `resultado` fica `undefined`. Trocando o `console.log(n * 2)` por `return n * 2`, as duas linhas mostrariam 10.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-func-03', 'js-funcoes', 'Arrow functions', 'A sintaxe curta que você vai ver em todo código moderno', '## A mesma função, escrita de outro jeito

Desde 2015 o JavaScript tem uma segunda forma de escrever funções, chamada **arrow function** (função seta). As duas abaixo fazem exatamente a mesma coisa:

~~~js
function dobrar(n) {
  return n * 2;
}

const dobrarSeta = (n) => {
  return n * 2;
};
~~~

Repare na estrutura: a arrow function é um **valor**, guardado numa variável com `const`. Some a palavra `function` e aparece o `=>` entre os parâmetros e o corpo.

## O retorno implícito

Quando o corpo é uma **única expressão**, você pode remover as chaves e o `return`:

~~~js
const dobrar = (n) => n * 2;

console.log(dobrar(5));
~~~

~~~text
10
~~~

Foi de quatro linhas para uma, sem perder clareza. Esse é o formato que você mais vai encontrar.

> Cuidado: as chaves e o `return` andam **juntos**. `(n) => { n * 2 }` calcula e joga fora o resultado, devolvendo `undefined`. Ou tira os dois, ou mantém os dois.

## Variações da sintaxe

~~~js
const semParametro = () => "oi";
const umParametro = (n) => n * 2;
const semParenteses = n => n * 2;
const doisParametros = (a, b) => a + b;

const comCorpo = (a, b) => {
  const soma = a + b;
  return soma / 2;
};
~~~

Com **um** parâmetro os parênteses são opcionais; com zero ou dois ou mais, obrigatórios. Este curso mantém os parênteses sempre, porque a linha fica igual em todos os casos.

## Quando usar cada uma

Na prática, ambas resolvem. A escolha do dia a dia:

- **arrow function** para funções curtas, principalmente quando ela é passada como argumento para outra (é o que você vai fazer no módulo de Desafios, com `map` e `filter`);
- **`function`** para funções maiores e nomeadas, onde a palavra na frente ajuda a localizar a declaração no arquivo.

Há também uma diferença técnica no comportamento do `this` dentro de cada uma. Isso só aparece em programação orientada a objetos, que está além desta trilha — por ora, guarde que **elas não são 100% intercambiáveis**.', '[{"language":"JavaScript","code":"const dobrar = (n) => n * 2;"},{"language":"Python","code":"dobrar = lambda n: n * 2"},{"language":"Java","code":"Function<Integer, Integer> dobrar = n -> n * 2;"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-03-e1', 'js-func-03', 'Escreva uma **arrow function** chamada `ehPar` que devolva `true` se o número for par. Mostre o resultado para 4 e para 7:

~~~text
true
false
~~~',
  '// use const ehPar = (numero) => ...
', 'output_match', 'true
false',
  null, null, 'const ehPar = (numero) => numero % 2 === 0; e depois console.log(ehPar(4)); console.log(ehPar(7));',
  'A comparação `numero % 2 === 0` já **é** um booleano, então ela pode ser devolvida direto — não precisa de `if (...) return true; else return false;`. Devolver a comparação em vez de ramificar é um hábito que deixa o código bem mais limpo.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-03-e2', 'js-func-03', 'Qual destas arrow functions devolve a soma de `a` e `b`?',
  null, 'multiple_choice', 'const somar = (a, b) => a + b;',
  '["const somar = (a, b) => a + b;","const somar = (a, b) => { a + b };","const somar = (a, b) -> a + b;","const somar = => (a, b) a + b;"]'::jsonb, null, null,
  'Sem chaves, o valor da expressão é devolvido automaticamente. A segunda opção é a pegadinha: com chaves e **sem** `return`, a soma é calculada e descartada, e a função devolve `undefined`. A seta do JavaScript é `=>`; `->` é de outras linguagens.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-func-04', 'js-funcoes', 'Escopo', 'Onde cada variável existe', '## Variável tem endereço

**Escopo** é a região do programa onde uma variável existe. Fora dela, é como se nunca tivesse sido criada:

~~~js
function calcular() {
  const interno = 10;
  console.log(interno);
}

calcular();
console.log(interno); // ReferenceError: interno is not defined
~~~

Isso é uma qualidade, não um obstáculo: como as variáveis de uma função morrem com ela, você pode usar `i` em vinte funções diferentes sem que uma atrapalhe a outra.

## let e const respeitam qualquer bloco

Em JavaScript, `let` e `const` valem **dentro do bloco em que foram declarados** — e bloco é qualquer par de chaves, não só o de uma função:

~~~js
if (true) {
  let dentro = "existo só aqui";
  console.log(dentro);
}

console.log(dentro); // ReferenceError
~~~

## O var e o problema que ele causa

`var` ignora blocos. Ele vale na função inteira, mesmo declarado dentro de um `if` ou de um `for`:

~~~js
for (var i = 0; i < 3; i++) {
  // ...
}
console.log(i);
~~~

~~~text
3
~~~

Com `var`, o `i` **vazou** do laço e continua valendo 3 depois dele. Com `let`, essa última linha daria `ReferenceError` — que é o comportamento desejável: o contador do laço não tem por que existir fora dele.

Este é o motivo concreto da recomendação do módulo 2: **use `let` e `const`, nunca `var`.**

## Lendo de fora para dentro

Uma função **enxerga** as variáveis declaradas fora dela:

~~~js
const taxa = 0.1;

function calcularTotal(valor) {
  return valor + valor * taxa;
}

console.log(calcularTotal(100));
~~~

~~~text
110
~~~

> Já que estamos em decimais, guarde uma armadilha que existe em **qualquer** linguagem, não só no JavaScript: `console.log(0.1 + 0.2)` mostra `0.30000000000000004`. Números com casas decimais são guardados em binário, e nem todos cabem exatamente. Quando o resultado é dinheiro, arredonde na hora de mostrar — `Math.round(valor * 100) / 100` deixa duas casas.

## O que passar por parâmetro

Depender de variáveis de fora funciona, mas amarra a função ao resto do arquivo. Uma função que recebe tudo de que precisa por **parâmetro** pode ser levada para qualquer lugar — e testada isoladamente.', null, 4)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-04-e1', 'js-func-04', 'O que acontece ao executar isto?

~~~js
if (true) {
  let mensagem = "oi";
}

console.log(mensagem);
~~~',
  null, 'multiple_choice', 'ReferenceError: mensagem is not defined',
  '["ReferenceError: mensagem is not defined","Mostra \"oi\" normalmente","Mostra undefined","SyntaxError na linha do if"]'::jsonb, null, null,
  '`let` existe apenas dentro do bloco em que foi declarado — e o `if` tem o seu próprio bloco. Se ali estivesse `var mensagem`, o programa mostraria `oi`, porque `var` ignora blocos. É essa inconsistência que faz o `var` ser evitado hoje.', 30, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-func-04-e2', 'js-func-04', 'A variável `contador` precisa sobreviver entre as chamadas da função. Complete o programa para a saída ser:

~~~text
1
2
3
~~~',
  'let contador = 0;

function registrar() {
  // aumente o contador e mostre o valor
}

registrar();
registrar();
registrar();
', 'output_match', '1
2
3',
  null, null, 'Dentro da função: contador++; e depois console.log(contador);',
  'Como `contador` foi declarado **fora**, ele sobrevive a cada chamada e vai acumulando. Se a declaração estivesse dentro da função, ela seria recriada com zero toda vez e a saída seria `1 1 1`.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-desafios', 'javascript', 'Desafios', 'Problemas clássicos que juntam tudo: FizzBuzz, validação de senha e os métodos de array que substituem metade dos seus laços.', '🏆', 6)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-des-01', 'js-desafios', 'FizzBuzz', 'O exercício mais famoso das entrevistas', '## O enunciado

Para os números de 1 a 15:

- múltiplo de **3 e de 5** → escreva `FizzBuzz`;
- múltiplo de **3** → escreva `Fizz`;
- múltiplo de **5** → escreva `Buzz`;
- nenhum dos casos → escreva o próprio número.

Parece trivial, e é justamente por isso que ele é usado em entrevistas: quem não pensa na ordem das condições erra.

## A armadilha

Esta é a tentativa mais comum — e está **errada**:

~~~js
if (i % 3 === 0) {
  console.log("Fizz");
} else if (i % 5 === 0) {
  console.log("Buzz");
} else if (i % 3 === 0 && i % 5 === 0) {
  console.log("FizzBuzz");
}
~~~

O 15 é múltiplo de 3 **e** de 5, mas a primeira condição já é verdadeira e o `else if` interrompe a cadeia ali. `FizzBuzz` nunca aparece.

## A regra geral

**Do caso mais específico para o mais geral.** "Múltiplo de 3 e de 5" é mais restrito do que "múltiplo de 3", então vem primeiro:

~~~js
if (i % 3 === 0 && i % 5 === 0) {
  // ...
} else if (i % 3 === 0) {
  // ...
}
~~~

Essa ordem já apareceu na lição de `else if`, com as faixas de temperatura. É o mesmo raciocínio — e ele volta em quase todo programa que classifica alguma coisa.

## Como atacar um problema desses

1. **releia** o enunciado e liste os casos possíveis;
2. **ordene** do mais específico para o mais geral;
3. **escreva** um caminho de cada vez;
4. **teste** com um valor de cada categoria — aqui: 3, 5, 15 e 7.

O passo 4 é o que separa "funcionou" de "está certo". Se você testou FizzBuzz só até 10, não testou nada.', null, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-01-e1', 'js-des-01', 'Escreva o FizzBuzz de 1 a 15. A saída deve ser exatamente:

~~~text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
~~~',
  '// lembre da ordem: o caso mais específico vem primeiro
', 'output_match', '1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz',
  null, null, 'for de 1 a 15. Dentro dele: if (i % 3 === 0 && i % 5 === 0) primeiro, depois os casos de 3 e de 5, e um else final com o próprio número.',
  'A condição dupla precisa ser testada antes das simples. Repare também no `else` final: sem ele, os números comuns não apareceriam. E `console.log(i)` mostra o número — nem tudo que sai do laço precisa ser texto.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-01-e2', 'js-des-01', 'No FizzBuzz, por que testar `i % 3 === 0 && i % 5 === 0` **por último** não funciona?',
  null, 'multiple_choice', 'Porque o else if para na primeira condição verdadeira, e a de múltiplo de 3 já pegou o 15',
  '["Porque o else if para na primeira condição verdadeira, e a de múltiplo de 3 já pegou o 15","Porque o operador && não funciona dentro de else if","Porque 15 não é múltiplo de 3","Porque o % só funciona com um número por vez"]'::jsonb, null, null,
  'Uma cadeia de `else if` é avaliada de cima para baixo e para no primeiro acerto. Como 15 satisfaz "múltiplo de 3", a execução nunca chega à condição dupla lá embaixo. Por isso o caso mais específico tem de vir primeiro.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-des-02', 'js-desafios', 'Validador de senha', 'Retorno antecipado e métodos de texto', '## O padrão de validação

Validar é responder "isto está aceitável?" e, se não estiver, dizer **por quê**. A forma mais legível de escrever isso é com **retornos antecipados**: cada problema tem um `return` próprio, e o "tudo certo" fica no fim.

~~~js
function validarSenha(senha) {
  if (senha.length < 8) {
    return "Senha muito curta";
  }
  if (senha === "12345678") {
    return "Senha óbvia demais";
  }
  return "Senha aceita";
}

console.log(validarSenha("abc"));
console.log(validarSenha("codequest2026"));
~~~

~~~text
Senha muito curta
Senha aceita
~~~

Compare com a alternativa aninhada:

~~~js
if (senha.length >= 8) {
  if (senha !== "12345678") {
    return "Senha aceita";
  } else {
    return "Senha óbvia demais";
  }
} else {
  return "Senha muito curta";
}
~~~

Mesmo resultado, muito mais difícil de ler — e cada regra nova empurra tudo um nível para a direita. **Trate os casos ruins primeiro e saia cedo.**

## Métodos de texto

Todo texto em JavaScript vem com funções embutidas, chamadas com um ponto:

| Método | Faz | Exemplo |
| --- | --- | --- |
| `.length` | tamanho (sem parênteses!) | `"abc".length` → `3` |
| `.toUpperCase()` | tudo maiúsculo | `"ana".toUpperCase()` → `"ANA"` |
| `.toLowerCase()` | tudo minúsculo | `"ANA".toLowerCase()` → `"ana"` |
| `.trim()` | remove espaços das pontas | `" oi ".trim()` → `"oi"` |
| `.includes(x)` | contém? | `"codequest".includes("quest")` → `true` |
| `.replace(a, b)` | troca | `"a-b".replace("-", " ")` → `"a b"` |

Repare que `.length` é o único **sem** parênteses: é uma propriedade, não uma função.

## Encadeando

Como cada método devolve um texto novo, dá para chamar o próximo em seguida:

~~~js
const email = "  ANA@Email.COM  ";
console.log(email.trim().toLowerCase());
~~~

~~~text
ana@email.com
~~~

A leitura é da esquerda para a direita: tira os espaços, depois passa para minúsculas. E o original não muda — textos em JavaScript são **imutáveis**, todo método devolve uma cópia.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-02-e1', 'js-des-02', 'Escreva `validarSenha(senha)` com as regras: menos de 8 caracteres → `Senha muito curta`; exatamente `12345678` → `Senha óbvia demais`; caso contrário → `Senha aceita`. Teste com `abc`, `12345678` e `codequest2026`:

~~~text
Senha muito curta
Senha óbvia demais
Senha aceita
~~~',
  '// use return antecipado para cada caso ruim
', 'output_match', 'Senha muito curta
Senha óbvia demais
Senha aceita',
  null, null, 'Dentro da função: primeiro if (senha.length < 8), depois if (senha === "12345678"), e no fim return "Senha aceita". Depois, três console.log() chamando a função.',
  'A ordem importa: `12345678` tem 8 caracteres, então passa pela primeira regra e é pega pela segunda. Se o teste de tamanho exigisse 10, essa senha nunca chegaria à segunda regra — e a mensagem seria outra.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-02-e2', 'js-des-02', 'Normalize o e-mail guardado em `email`: remova os espaços das pontas e deixe tudo minúsculo, **encadeando** os métodos.

~~~text
ana@email.com
~~~',
  'const email = "  ANA@Email.COM  ";

// mostre o e-mail normalizado
', 'output_match', 'ana@email.com',
  null, null, 'console.log(email.trim().toLowerCase());',
  'Cada método devolve um texto novo, então o seguinte já opera sobre o resultado do anterior. A variável `email` continua com os espaços e as maiúsculas: textos são imutáveis em JavaScript, e é por isso que você precisa **usar** o valor devolvido.', 40, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-des-03', 'js-desafios', 'Métodos de array', 'map, filter e reduce', '## Laços que você não precisa escrever

Percorrer array com `for` funciona. Mas o JavaScript oferece métodos que dizem **o que** você quer, em vez de **como** percorrer — e é assim que se escreve na prática.

Os três recebem uma função (geralmente uma arrow function) que será aplicada a cada item.

## map: transformar cada item

~~~js
const precos = [10, 20, 30];
const comDesconto = precos.map((preco) => preco * 0.9);

console.log(comDesconto);
~~~

~~~text
[9, 18, 27]
~~~

`map` devolve um array **do mesmo tamanho**, com cada item transformado. O original fica intacto.

## filter: escolher alguns

~~~js
const notas = [7, 9.5, 4, 8.5];
const aprovadas = notas.filter((nota) => nota >= 7);

console.log(aprovadas.length);
~~~

~~~text
3
~~~

A função passada para `filter` responde uma pergunta de sim ou não. Quem devolve `true` fica; quem devolve `false` sai. O array resultante é **menor ou igual** ao original.

## reduce: juntar tudo em um valor

~~~js
const notas = [7, 9.5, 4, 8.5];
const soma = notas.reduce((total, nota) => total + nota, 0);

console.log(soma);
~~~

~~~text
29
~~~

`reduce` é o acumulador do módulo de Repetições, embutido na linguagem. Ele recebe duas coisas:

- a função `(total, item) => ...`, cujo retorno vira o `total` da próxima volta;
- o **valor inicial** (`0`), que é o `total` da primeira.

Esqueça o `0` e o primeiro item vira o valor inicial — o que quebra feio quando o array está vazio.

## Comparando com o for

~~~js
// com for
let soma = 0;
for (const nota of notas) {
  soma += nota;
}

// com reduce
const soma = notas.reduce((total, nota) => total + nota, 0);
~~~

Mesma coisa. A segunda é uma linha, não precisa de `let` e não dá espaço para você errar o índice.

## Encadeando os três

Como `map` e `filter` devolvem arrays, eles se encaixam:

~~~js
const notas = [7, 9.5, 4, 8.5];

const media = notas
  .filter((nota) => nota >= 7)
  .reduce((total, nota) => total + nota, 0) / 3;

console.log(media);
~~~

~~~text
8.333333333333334
~~~

> Quando usar `for` então? Quando precisar parar no meio (`break`) ou quando o corpo do laço fizer várias coisas. Para "transformar", "filtrar" e "somar", os métodos deixam a intenção explícita já no nome.

## Um utilitário a mais: join

`join` transforma um array em texto, com o separador que você escolher:

~~~js
console.log([9, 18, 27].join(", "));
~~~

~~~text
9, 18, 27
~~~', '[{"language":"JavaScript","code":"const pares = numeros.filter((n) => n % 2 === 0);"},{"language":"Python","code":"pares = [n for n in numeros if n % 2 == 0]"},{"language":"Java","code":"var pares = numeros.stream()\n  .filter(n -> n % 2 == 0)\n  .toList();"}]'::jsonb, 3)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-03-e1', 'js-des-03', 'Com o array `notas`, use `filter` para contar quantas notas são maiores ou iguais a 7 e `reduce` para calcular a média de todas. A saída deve ser:

~~~text
Aprovadas: 3
Média: 7.25
~~~',
  'const notas = [7, 9.5, 4, 8.5];

// use filter e reduce, e mostre com template literal
', 'output_match', 'Aprovadas: 3
Média: 7.25',
  null, null, 'const aprovadas = notas.filter((nota) => nota >= 7); const soma = notas.reduce((total, nota) => total + nota, 0); depois use aprovadas.length e soma / notas.length.',
  'As três notas aprovadas são 7, 9.5 e 8.5 — o `>=` inclui o 7 exato. A soma total é 29 e dividida por `notas.length` (4) dá 7.25. Usar `notas.length` em vez de escrever `4` é o que faz o programa continuar certo se você acrescentar uma nota.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-des-03-e2', 'js-des-03', 'Aplique 10% de desconto em cada preço com `map` e mostre o resultado separado por vírgula e espaço, usando `join`:

~~~text
9, 18, 27
~~~',
  'const precos = [10, 20, 30];

// use map e depois join
', 'output_match', '9, 18, 27',
  null, null, 'const comDesconto = precos.map((preco) => preco * 0.9); e depois console.log(comDesconto.join(", "));',
  '`map` devolve um array novo do mesmo tamanho, com cada item transformado — `precos` continua `[10, 20, 30]`. O `join(", ")` junta tudo num único texto, que é como se costuma mostrar uma lista para quem usa o programa.', 50, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

insert into public.modules (id, language_id, title, description, icon, order_index) values ('js-projeto-final', 'javascript', 'Projeto Final', 'Objetos para organizar dados e um boletim completo que junta variáveis, condicionais, repetições e funções.', '🚀', 7)
  on conflict (id) do update set language_id = excluded.language_id, title = excluded.title,
  description = excluded.description, icon = excluded.icon, order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-proj-01', 'js-projeto-final', 'Objetos', 'Agrupando dados que andam juntos', '## O problema das variáveis soltas

Para representar uma aluna, você poderia escrever:

~~~js
const nome = "Ana";
const nota1 = 7;
const nota2 = 9;
~~~

Funciona para **uma**. Para trinta, vira caos: nada indica que essas três variáveis pertencem à mesma pessoa.

## O objeto

Um **objeto** agrupa valores relacionados, cada um com o seu nome:

~~~js
const aluna = {
  nome: "Ana",
  nota1: 7,
  nota2: 9,
};

console.log(aluna.nome);
console.log(aluna.nota1);
~~~

~~~text
Ana
7
~~~

A estrutura é `chave: valor`, separados por vírgula, tudo entre chaves. Cada chave é chamada de **propriedade**.

## Acessando e mudando

~~~js
const aluna = { nome: "Ana", nota1: 7 };

console.log(aluna.nome);
console.log(aluna["nome"]);

aluna.nota1 = 10;
aluna.turma = "3B";
~~~

Duas formas de acessar: o **ponto** (mais comum) e os **colchetes** (necessários quando o nome da propriedade está numa variável).

Repare que `aluna` foi declarada com `const` e mesmo assim as propriedades mudaram. `const` impede trocar **o objeto inteiro** por outro, não impede mexer no conteúdo dele.

## Propriedade que não existe

~~~js
const aluna = { nome: "Ana" };
console.log(aluna.idade);
~~~

~~~text
undefined
~~~

Não é erro: JavaScript devolve `undefined` e segue. Isso torna erros de digitação em nomes de propriedade especialmente traiçoeiros — `aluna.Nome` (com maiúscula) também dá `undefined`, calado.

## Array de objetos: o formato dos dados reais

É assim que praticamente todo dado chega do mundo real — de um banco de dados, de um formulário, de uma API:

~~~js
const turma = [
  { nome: "Ana", nota: 9 },
  { nome: "Luiz", nota: 4 },
];

for (const aluno of turma) {
  console.log(`${aluno.nome}: ${aluno.nota}`);
}
~~~

~~~text
Ana: 9
Luiz: 4
~~~

Junte com os métodos do módulo anterior e você já consegue responder perguntas de verdade:

~~~js
const aprovados = turma.filter((aluno) => aluno.nota >= 7);
console.log(aprovados.length);
~~~

~~~text
1
~~~', '[{"language":"JavaScript","code":"const aluna = { nome: \"Ana\", nota: 9 };\nconsole.log(aluna.nome);"},{"language":"Python","code":"aluna = {\"nome\": \"Ana\", \"nota\": 9}\nprint(aluna[\"nome\"])"},{"language":"Java","code":"record Aluna(String nome, int nota) {}\n\nvar aluna = new Aluna(\"Ana\", 9);\nSystem.out.println(aluna.nome());"}]'::jsonb, 1)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-proj-01-e1', 'js-proj-01', 'Crie um objeto `aluno` com as propriedades `nome` valendo `Ana` e `nota` valendo `9`, e mostre as duas:

~~~text
Ana
9
~~~',
  '// crie o objeto e mostre nome e nota
', 'output_match', 'Ana
9',
  null, null, 'const aluno = { nome: "Ana", nota: 9 }; e depois console.log(aluno.nome); console.log(aluno.nota);',
  'Dentro do objeto a chave é escrita **sem aspas** (`nome:`), e o acesso usa ponto (`aluno.nome`). Um objeto guarda dados que descrevem a mesma coisa — o que evita ficar carregando três variáveis soltas por aí.', 40, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-proj-01-e2', 'js-proj-01', 'O que este código mostra?

~~~js
const aluno = { nome: "Ana" };
console.log(aluno.idade);
~~~',
  null, 'multiple_choice', 'undefined',
  '["undefined","null","ReferenceError: idade is not defined","Uma string vazia"]'::jsonb, null, null,
  'Pedir uma propriedade que não existe devolve `undefined`, sem erro nenhum. É por isso que um `nome` escrito com maiúscula errada não estoura — ele apenas devolve `undefined` e o problema aparece bem mais tarde.', 30, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.lessons (id, module_id, title, subtitle, content, polyglot, order_index) values ('js-proj-02', 'js-projeto-final', 'Boletim da turma', 'Tudo o que você aprendeu, num programa só', '## O projeto

Você vai montar um boletim que:

1. calcula a **média** de cada aluno;
2. classifica a situação (**Aprovado**, **Recuperação** ou **Reprovado**);
3. mostra uma linha por aluno;
4. fecha com a **média da turma** e a **quantidade de aprovados**.

Ele usa, ao mesmo tempo, tudo o que veio antes:

| Módulo | Onde aparece |
| --- | --- |
| Variáveis | acumuladores e template literals |
| Condicionais | a classificação por faixa |
| Repetições | percorrer a turma |
| Funções | a regra da situação, isolada |
| Objetos | os dados de cada aluno |

## As regras

- média **≥ 7** → `Aprovado`
- média **≥ 5** e < 7 → `Recuperação`
- abaixo de 5 → `Reprovado`

## Construa em três etapas

Este é o hábito mais valioso que você leva desta trilha: **não escreva o programa inteiro de uma vez.** Faça uma parte, execute, confirme que está certa, e só então acrescente a próxima.

Os três exercícios a seguir são exatamente essas etapas — a função da situação, depois o laço, depois o resumo.

## Arredondando a média da turma

A média das médias raramente é um número redondo. Para mostrar com duas casas:

~~~js
console.log(Math.round(6.166666 * 100) / 100);
~~~

~~~text
6.17
~~~

A ideia: multiplica por 100, arredonda para o inteiro mais próximo e divide de novo. É o truque padrão de "duas casas decimais" em JavaScript.

> Quando terminar, você terá escrito um programa completo — com entrada de dados, regra de negócio, repetição e relatório. É exatamente a estrutura de um sistema de verdade, só que menor.', null, 2)
  on conflict (id) do update set module_id = excluded.module_id, title = excluded.title,
  subtitle = excluded.subtitle, content = excluded.content, polyglot = excluded.polyglot,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-proj-02-e1', 'js-proj-02', '**Etapa 1.** Escreva a função `situacao(media)` que devolve `Aprovado` (≥ 7), `Recuperação` (≥ 5) ou `Reprovado`. Teste com 8, 6 e 3:

~~~text
Aprovado
Recuperação
Reprovado
~~~',
  '// a função devolve o texto; quem mostra é o console.log de fora
', 'output_match', 'Aprovado
Recuperação
Reprovado',
  null, null, 'function situacao(media) { if (media >= 7) return "Aprovado"; if (media >= 5) return "Recuperação"; return "Reprovado"; }',
  'A ordem das faixas é o que faz funcionar: 8 é maior que 7 **e** que 5, e o primeiro `return` encerra a função ali. Devolver texto em vez de mostrar é o que permite reaproveitar a função no próximo exercício.', 50, 1)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-proj-02-e2', 'js-proj-02', '**Etapa 2.** Percorra a `turma`, calcule a média de cada aluno e mostre uma linha por pessoa no formato `nome: média X - Situação`:

~~~text
Ana: média 8 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6 - Recuperação
~~~',
  'function situacao(media) {
  if (media >= 7) return "Aprovado";
  if (media >= 5) return "Recuperação";
  return "Reprovado";
}

const turma = [
  { nome: "Ana", nota1: 7, nota2: 9 },
  { nome: "Luiz", nota1: 4, nota2: 5 },
  { nome: "Kauan", nota1: 6, nota2: 6 },
];

// percorra a turma com for...of
', 'output_match', 'Ana: média 8 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6 - Recuperação',
  null, null, 'for (const aluno of turma) { const media = (aluno.nota1 + aluno.nota2) / 2; console.log(`${aluno.nome}: média ${media} - ${situacao(media)}`); }',
  'A média é calculada dentro do laço, para cada aluno, e passada para a função — que não sabe nem precisa saber de onde o número veio. Repare que 4.5 aparece assim mesmo: em JavaScript o resultado de uma divisão não ganha casas decimais extras.', 60, 2)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;
insert into public.exercises (id, lesson_id, prompt, starter_code, validation_type,
  expected_answer, options, stdin, hint, explanation, xp_reward, order_index) values (
  'js-proj-02-e3', 'js-proj-02', '**Etapa 3.** Acrescente o resumo ao final: a média da turma (com duas casas) e quantos foram aprovados.

~~~text
Ana: média 8 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6 - Recuperação
---
Média da turma: 6.17
Aprovados: 1 de 3
~~~',
  'function situacao(media) {
  if (media >= 7) return "Aprovado";
  if (media >= 5) return "Recuperação";
  return "Reprovado";
}

const turma = [
  { nome: "Ana", nota1: 7, nota2: 9 },
  { nome: "Luiz", nota1: 4, nota2: 5 },
  { nome: "Kauan", nota1: 6, nota2: 6 },
];

let somaDasMedias = 0;
let aprovados = 0;

// percorra a turma, acumule e mostre o resumo no final
', 'output_match', 'Ana: média 8 - Aprovado
Luiz: média 4.5 - Reprovado
Kauan: média 6 - Recuperação
---
Média da turma: 6.17
Aprovados: 1 de 3',
  null, null, 'Dentro do laço, além do console.log: somaDasMedias += media; e um if (situacao(media) === "Aprovado") { aprovados++; }. Depois do laço, mostre "---", a média arredondada e a contagem.',
  'Os dois acumuladores são declarados **antes** do laço e usados **depois** dele — o padrão do módulo de Repetições. A média da turma é 18.5 / 3 = 6.1666..., que `Math.round(x * 100) / 100` transforma em 6.17. Parabéns: você acaba de escrever um programa completo em JavaScript.', 80, 3)
  on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt,
  starter_code = excluded.starter_code, validation_type = excluded.validation_type,
  expected_answer = excluded.expected_answer, options = excluded.options, stdin = excluded.stdin,
  hint = excluded.hint, explanation = excluded.explanation, xp_reward = excluded.xp_reward,
  order_index = excluded.order_index;

-- Conquistas ---------------------------------------------------------------
insert into public.achievements (id, title, description, icon, criteria) values ('primeiro-desafio', 'Primeiro desafio concluído', 'Você resolveu sua primeira lição no CodeQuest.', '🎯', '{"kind":"first_lesson"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('aquecendo', 'Aquecendo os motores', 'Cinco lições concluídas. A rotina começou.', '🚀', '{"kind":"lessons_completed","count":5}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('meia-trilha', 'Meia trilha', 'Doze lições concluídas — a trilha de Python pegou ritmo.', '🧭', '{"kind":"lessons_completed","count":12}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-fundamentos', 'Fundamentos dominados', 'Você concluiu todo o módulo 🐣 Fundamentos.', '🐣', '{"kind":"module_completed","moduleId":"py-fundamentos"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-variaveis', 'Mestre das variáveis', 'Você concluiu todo o módulo 📦 Variáveis.', '📦', '{"kind":"module_completed","moduleId":"py-variaveis"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-condicionais', 'Módulo Condicionais completo', 'Você concluiu todo o módulo 🔀 Condicionais.', '🔀', '{"kind":"module_completed","moduleId":"py-condicionais"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-repeticoes', 'Domador de laços', 'Você concluiu todo o módulo 🔁 Repetições.', '🔁', '{"kind":"module_completed","moduleId":"py-repeticoes"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-listas', 'Colecionador', 'Você concluiu todo o módulo 📋 Listas.', '📋', '{"kind":"module_completed","moduleId":"py-listas"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-dicionarios', 'Guardião das chaves', 'Você concluiu todo o módulo 🗂️ Dicionários.', '🗂️', '{"kind":"module_completed","moduleId":"py-dicionarios"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-funcoes', 'Arquiteto de funções', 'Você concluiu todo o módulo ⚙️ Funções.', '⚙️', '{"kind":"module_completed","moduleId":"py-funcoes"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-desafios', 'Resolvedor de problemas', 'Você concluiu todo o módulo 🧩 Desafios, incluindo o FizzBuzz.', '🧩', '{"kind":"module_completed","moduleId":"py-desafios"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('trilha-python', 'Trilha de Python concluída', 'Você terminou os nove módulos da trilha de Python. Respeito.', '🏆', '{"kind":"language_completed","languageSlug":"python"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-fundamentos', 'Primeiros passos no JavaScript', 'Você concluiu todo o módulo 🐣 Fundamentos da trilha de JavaScript.', '🐣', '{"kind":"module_completed","moduleId":"js-fundamentos"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-variaveis', 'let, const e você', 'Você concluiu todo o módulo 📦 Variáveis da trilha de JavaScript.', '📦', '{"kind":"module_completed","moduleId":"js-variaveis"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-condicionais', 'Time do ===', 'Você concluiu todo o módulo 🔀 Condicionais e sabe por que não usar ==.', '🔀', '{"kind":"module_completed","moduleId":"js-condicionais"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-repeticoes', 'Laços sob controle', 'Você concluiu todo o módulo 🔁 Repetições da trilha de JavaScript.', '🔁', '{"kind":"module_completed","moduleId":"js-repeticoes"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-funcoes', 'Arqueiro das arrow functions', 'Você concluiu todo o módulo 🧩 Funções e domina o =>.', '🏹', '{"kind":"module_completed","moduleId":"js-funcoes"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('js-modulo-desafios', 'map, filter, reduce', 'Você concluiu todo o módulo 🏆 Desafios da trilha de JavaScript.', '🧮', '{"kind":"module_completed","moduleId":"js-desafios"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('trilha-javascript', 'Trilha de JavaScript concluída', 'Você terminou os sete módulos da trilha de JavaScript. A web é sua.', '🟨', '{"kind":"language_completed","languageSlug":"javascript"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('desafio-primeiro', 'Primeiro desafio do dia', 'Você concluiu o seu primeiro desafio diário.', '📅', '{"kind":"daily_challenges","count":1}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('desafio-10', '10 desafios diários', 'Dez desafios do dia concluídos. Virou hábito.', '🗓️', '{"kind":"daily_challenges","count":10}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('desafio-50', '50 desafios diários', 'Cinquenta desafios do dia. Isso é constância de verdade.', '⏳', '{"kind":"daily_challenges","count":50}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('desafio-100', '100 desafios diários', 'Cem desafios do dia concluídos. Poucas pessoas chegam aqui.', '🌠', '{"kind":"daily_challenges","count":100}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('streak-3', '3 dias de streak', 'Três dias seguidos estudando.', '🔥', '{"kind":"streak","days":3}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('streak-7', '7 dias de streak', 'Uma semana inteira sem falhar um dia.', '🔥', '{"kind":"streak","days":7}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('streak-30', '30 dias de streak', 'Um mês de constância. Isso é hábito, não sorte.', '💎', '{"kind":"streak","days":30}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('xp-500', '500 XP', 'Meio milhar de pontos de experiência acumulados.', '⭐', '{"kind":"xp","amount":500}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('xp-1000', '1000 XP', 'Mil pontos de experiência. Você é veterano por aqui.', '🌟', '{"kind":"xp","amount":1000}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('sem-erros', 'Impecável', 'Você concluiu uma lição acertando todos os exercícios de primeira.', '🥇', '{"kind":"flawless"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('pvp-primeira-vitoria', 'Primeira vitória', 'Venceu seu primeiro duelo 1v1.', '🗡️', '{"kind":"pvp_wins","count":1}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('pvp-10-vitorias', '10 duelos vencidos', 'Dez vitórias no 1v1 — isso já é constância.', '⚔️', '{"kind":"pvp_wins","count":10}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('pvp-50-vitorias', '50 duelos vencidos', 'Cinquenta vitórias. Virou referência entre os amigos.', '🔥', '{"kind":"pvp_wins","count":50}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('pvp-100-vitorias', '100 duelos vencidos', 'Cem vitórias no 1v1.', '💀', '{"kind":"pvp_wins","count":100}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('duelo-empate', 'Empate técnico', 'Terminou um duelo empatado com placar — mesmo número de acertos e o mesmo bônus de velocidade. É o resultado mais raro do jogo. Empate em 0 a 0 não conta: errar tudo dos dois lados não é feito nenhum.', '🤝', '{"kind":"pvp_draws","count":1}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-prata', 'Alcançou Prata', 'Saiu do Bronze na temporada ranqueada.', '🥈', '{"kind":"ranked_tier","patamar":1}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-ouro', 'Alcançou Ouro', 'Chegou ao Ouro na ranqueada. Daqui as vitórias valem menos elo.', '🥇', '{"kind":"ranked_tier","patamar":2}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-diamante', 'Alcançou Diamante', 'Chegou ao Diamante na ranqueada.', '💠', '{"kind":"ranked_tier","patamar":3}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-mitico', 'Alcançou Mítico', 'Chegou ao Mítico. Os bots daqui pra cima erram pouco.', '🔮', '{"kind":"ranked_tier","patamar":4}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-lendario', 'Alcançou Lendário', 'Chegou ao Lendário na ranqueada.', '👑', '{"kind":"ranked_tier","patamar":5}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-mestre', 'Alcançou Mestre', 'Chegou ao Mestre, com os três sub-níveis pela frente.', '🏅', '{"kind":"ranked_tier","patamar":6}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-elite', 'Alcançou Elite', 'Chegou ao Elite — o topo absoluto da escada, de onde não se cai mais.', '⭐', '{"kind":"ranked_tier","patamar":7}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('segredo-curioso', 'Achou o botão secreto', 'Dez cliques no logo depois, algo apareceu.', '🕵️', '{"kind":"secret","segredo":"logo-10-cliques"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('segredo-relampago', 'Rápido no gatilho', 'Uma lição inteira em menos de 30 segundos, sem errar nada.', '⚡', '{"kind":"secret","segredo":"licao-relampago"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('segredo-madrugada', 'Turno da madrugada', 'Concluiu uma lição entre meia-noite e cinco da manhã.', '🦉', '{"kind":"secret","segredo":"madrugada"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('segredo-impecavel', 'Série impecável', 'Cinco lições sem errar um único exercício.', '💎', '{"kind":"secret","segredo":"serie-impecavel"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;

-- Tags de perfil -----------------------------------------------------------
do $seed$
begin
  if to_regclass('public.tags') is null then
    raise notice 'tabela public.tags ausente - rode a migration 0004 antes';
    return;
  end if;

  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('nivel-05', 'Primeiros Passos', 'Chegou ao nível 5. O começo de tudo.', '🌱', 'comum', '{"kind":"level","level":5}'::jsonb, false, 1)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('nivel-10', 'Codificador', 'Chegou ao nível 10. Código já não assusta mais.', '⌨️', 'raro', '{"kind":"level","level":10}'::jsonb, false, 2)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('nivel-20', 'Arquiteto', 'Chegou ao nível 20. Agora você desenha a solução antes de escrever.', '📐', 'epico', '{"kind":"level","level":20}'::jsonb, false, 3)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('nivel-30', 'Mestre do Código', 'Chegou ao nível 30. Pouca gente chega aqui.', '🔮', 'mitico', '{"kind":"level","level":30}'::jsonb, false, 4)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('nivel-50', 'Lenda do CodeQuest', 'Chegou ao nível 50. Isso é 5.000 XP.', '👑', 'lendario', '{"kind":"level","level":50}'::jsonb, false, 5)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pythonista', 'Pythonista', 'Concluiu a trilha de Python inteira, do primeiro print ao projeto final.', '🐍', 'epico', '{"kind":"language_completed","languageSlug":"python"}'::jsonb, false, 6)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-estreante', 'Estreante', 'Venceu o primeiro duelo 1v1.', '🗡️', 'comum', '{"kind":"pvp_wins","count":1}'::jsonb, false, 10)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-duelista', 'Duelista', '10 vitórias em duelos. Já sabe o que está fazendo.', '⚔️', 'raro', '{"kind":"pvp_wins","count":10}'::jsonb, false, 11)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-especialista', 'Especialista', '10 vitórias no mesmo tema. Escolheu um assunto e dominou.', '🎓', 'epico', '{"kind":"pvp_tema","count":10}'::jsonb, false, 12)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-gladiador', 'Gladiador', '25 vitórias em duelos.', '🛡️', 'epico', '{"kind":"pvp_wins","count":25}'::jsonb, false, 13)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-implacavel', 'Implacável', '50 vitórias em duelos. Pouca gente aceita o convite.', '🔥', 'mitico', '{"kind":"pvp_wins","count":50}'::jsonb, false, 14)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('pvp-imortal', 'Imortal', '100 vitórias em duelos.', '💀', 'lendario', '{"kind":"pvp_wins","count":100}'::jsonb, false, 15)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('diarista', 'Diarista', 'Concluiu o primeiro desafio diário.', '📅', 'comum', '{"kind":"daily_challenges","count":1}'::jsonb, false, 30)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('diarista-constante', 'Constante', '10 desafios diários concluídos. Aparecer todo dia é meio caminho.', '🗓️', 'raro', '{"kind":"daily_challenges","count":10}'::jsonb, false, 31)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('diarista-disciplinado', 'Disciplinado', '25 desafios diários. Mais de três semanas sem falhar um dia sequer.', '⏳', 'epico', '{"kind":"daily_challenges","count":25}'::jsonb, false, 32)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('diarista-inabalavel', 'Inabalável', '50 desafios diários concluídos.', '🧱', 'mitico', '{"kind":"daily_challenges","count":50}'::jsonb, false, 33)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('diarista-lendario', 'Diarista Lendário', '100 desafios diários. São no mínimo 100 dias de CodeQuest.', '🌠', 'lendario', '{"kind":"daily_challenges","count":100}'::jsonb, false, 34)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('secreta-curioso', 'Curioso', 'Você ficou clicando no logo até algo acontecer. Respeito.', '🕵️', 'raro', '{"kind":"secret","segredo":"logo-10-cliques"}'::jsonb, true, 20)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('secreta-relampago', 'Relâmpago', 'Resolveu uma lição inteira em menos de 30 segundos, sem errar nada.', '⚡', 'epico', '{"kind":"secret","segredo":"licao-relampago"}'::jsonb, true, 21)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('secreta-madrugada', 'Coruja', 'Estudou de madrugada. O código não dorme.', '🦉', 'raro', '{"kind":"secret","segredo":"madrugada"}'::jsonb, true, 22)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('secreta-impecavel', 'Impecável', 'Cinco lições seguidas sem errar um único exercício.', '💎', 'mitico', '{"kind":"secret","segredo":"serie-impecavel"}'::jsonb, true, 23)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
  insert into public.tags (id, name, description, icon, rarity, criteria, secret, order_index) values ('dev', 'Desenvolvedor', 'Quem construiu o CodeQuest.', '🛠️', 'dev', '{"kind":"manual"}'::jsonb, false, 99)
    on conflict (id) do update set name = excluded.name, description = excluded.description,
    icon = excluded.icon, rarity = excluded.rarity, criteria = excluded.criteria,
    secret = excluded.secret, order_index = excluded.order_index;
end
$seed$;

-- Perguntas do duelo 1v1 ---------------------------------------------------
do $seed$
begin
  if to_regclass('public.pvp_questions') is null then
    raise notice 'tabela public.pvp_questions ausente - rode a migration 0005 antes';
    return;
  end if;

  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-01', 'python', 'multiple_choice', 'O que `print(type(3 / 1))` mostra em Python 3?', '["<class ''float''>","<class ''int''>","<class ''number''>","<class ''double''>"]'::jsonb, '<class ''float''>', 'Em Python 3 a divisão com `/` sempre devolve float, mesmo quando o resto é zero.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-02', 'python', 'multiple_choice', 'Qual é a saída de `print(len("CodeQuest"))`?', '["9","8","10","erro"]'::jsonb, '9', '"CodeQuest" tem 9 caracteres — `len` conta todos, inclusive as maiúsculas.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-03', 'python', 'fill_blank', 'Complete para transformar o texto digitado em número inteiro:

`idade = ____(input("Idade: "))`', null, 'int', '`input()` sempre devolve texto; `int()` converte para número inteiro.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-04', 'python', 'multiple_choice', 'O que `print(10 // 3)` mostra?', '["3","3.333","4","1"]'::jsonb, '3', '`//` é a divisão inteira: descarta a parte decimal do resultado.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-05', 'python', 'multiple_choice', 'Qual estrutura o Python usa para agrupar comandos dentro de um `if`?', '["Indentação","Chaves { }","Palavra `end`","Parênteses ( )"]'::jsonb, 'Indentação', 'Python usa o recuo do código (indentação) para delimitar blocos.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-06', 'python', 'multiple_choice', 'O que `print("5" + "5")` mostra?', '["55","10","erro","\"55\""]'::jsonb, '55', 'Com dois textos, o `+` concatena em vez de somar.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-07', 'python', 'fill_blank', 'Complete para repetir 5 vezes:

`for i in ____(5):`', null, 'range', '`range(5)` gera os números de 0 a 4 — cinco repetições.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-08', 'python', 'multiple_choice', 'Qual comando define uma função em Python?', '["def","function","fun","func"]'::jsonb, 'def', 'Em Python a palavra-chave é `def`, seguida do nome e dos parênteses.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-09', 'python', 'multiple_choice', 'O que `print([1, 2, 3][-1])` mostra?', '["3","1","2","erro"]'::jsonb, '3', 'Índice negativo conta de trás para frente: `-1` é o último item.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-10', 'python', 'multiple_choice', 'Qual destes é o operador de igualdade (comparação) em Python?', '["==","=","===","eq"]'::jsonb, '==', '`=` atribui valor; `==` compara. Trocar os dois é o erro mais comum de quem começa.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-11', 'python', 'multiple_choice', 'O que acontece com `print(bool(""))`?', '["False","True","erro","None"]'::jsonb, 'False', 'Texto vazio é considerado falso em Python — assim como 0 e listas vazias.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-py-12', 'python', 'fill_blank', 'Complete para mostrar o nome dentro do texto:

`print(f"Olá, {____}")`  (a variável se chama `nome`)', null, 'nome', 'Dentro de uma f-string, o que está entre chaves é avaliado como código.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-01', 'javascript', 'multiple_choice', 'Qual comando mostra algo no console do navegador?', '["console.log()","print()","echo()","System.out.println()"]'::jsonb, 'console.log()', 'Em JavaScript a saída padrão de depuração é `console.log()`.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-02', 'javascript', 'multiple_choice', 'O que `console.log(typeof [])` mostra?', '["object","array","list","undefined"]'::jsonb, 'object', 'Em JavaScript arrays são objetos — por isso existe `Array.isArray()`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-03', 'javascript', 'multiple_choice', 'O que `console.log("5" + 3)` mostra?', '["53","8","erro","NaN"]'::jsonb, '53', 'Com um texto de um lado, o `+` concatena: o número 3 vira "3".', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-04', 'javascript', 'multiple_choice', 'O que `console.log("5" - 3)` mostra?', '["2","53","NaN","erro"]'::jsonb, '2', 'O `-` não existe para textos, então o JavaScript converte "5" para número.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-05', 'javascript', 'fill_blank', 'Complete para declarar uma variável que NÃO pode ser reatribuída:

`____ PI = 3.14;`', null, 'const', '`const` cria uma ligação que não pode receber outro valor depois.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-06', 'javascript', 'multiple_choice', 'Qual comparação é estrita (compara valor E tipo)?', '["===","==","=","eq"]'::jsonb, '===', '`==` converte tipos antes de comparar; `===` não converte nada.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-07', 'javascript', 'multiple_choice', 'O que `console.log(0.1 + 0.2 === 0.3)` mostra?', '["false","true","NaN","erro"]'::jsonb, 'false', 'Números decimais em ponto flutuante têm imprecisão: a soma dá 0.30000000000000004.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-08', 'javascript', 'multiple_choice', 'Qual método adiciona um item ao FIM de um array?', '["push","pop","shift","append"]'::jsonb, 'push', '`push` acrescenta ao fim; `pop` remove do fim; `shift` remove do início.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-09', 'javascript', 'fill_blank', 'Complete a função em formato de seta:

`const dobro = (n) ____ n * 2;`', null, '=>', 'A arrow function usa `=>` entre os parâmetros e o corpo.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-10', 'javascript', 'multiple_choice', 'O que `console.log([1, 2, 3].length)` mostra?', '["3","2","4","undefined"]'::jsonb, '3', '`length` devolve a quantidade de itens do array.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-11', 'javascript', 'multiple_choice', 'Qual valor é considerado "falso" (falsy) em JavaScript?', '["0","\"0\"","[]","{}"]'::jsonb, '0', 'Os falsy são: `false`, `0`, `""`, `null`, `undefined` e `NaN`. Array e objeto vazios são verdadeiros.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-12', 'javascript', 'multiple_choice', 'Qual declaração tem escopo de bloco?', '["let","var","function","global"]'::jsonb, 'let', '`let` e `const` respeitam blocos `{}`; `var` vaza para a função inteira.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-13', 'javascript', 'multiple_choice', 'O que `console.log(typeof null)` mostra?', '["null","object","undefined","NaN"]'::jsonb, 'object', 'É um defeito histórico da linguagem, mantido por compatibilidade: `typeof null` devolve `"object"`. Para testar nulo mesmo, use `valor === null`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-14', 'javascript', 'multiple_choice', 'O que `console.log(typeof NaN)` mostra?', '["NaN","undefined","number","object"]'::jsonb, 'number', '`NaN` significa "não é um número", mas o tipo dele é `number`. Para detectá-lo use `Number.isNaN(valor)` — a comparação `NaN === NaN` é `false`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-15', 'javascript', 'multiple_choice', 'O que `console.log([1, 2, 10].sort())` mostra?', '["[1, 2, 10]","[1, 10, 2]","[10, 2, 1]","erro"]'::jsonb, '[1, 10, 2]', 'Sem argumento, `sort` converte tudo para texto e ordena alfabeticamente — e `"10"` vem antes de `"2"`. Para números use `sort((a, b) => a - b)`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-16', 'javascript', 'multiple_choice', 'Qual é o valor devolvido por `prompt()` quando a pessoa digita 42?', '["O número 42","O texto \"42\"","true","undefined"]'::jsonb, 'O texto "42"', '`prompt()` sempre devolve string. Sem `Number()` antes, `prompt() + 1` concatena em vez de somar.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-17', 'javascript', 'multiple_choice', 'O que `console.log(Number("abc"))` mostra?', '["0","null","NaN","undefined"]'::jsonb, 'NaN', 'Texto que não representa número vira `NaN`. O programa não para — ele segue com um valor inválido, e toda conta a partir dali também dá `NaN`.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-18', 'javascript', 'multiple_choice', 'O que `console.log(Number(""))` mostra?', '["NaN","0","undefined","erro"]'::jsonb, '0', 'Texto vazio converte para `0`, não para `NaN`. É por isso que um campo de formulário em branco pode passar despercebido por uma validação numérica.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-19', 'javascript', 'fill_blank', 'Complete para interpolar a variável dentro do texto:

`` console.log(`Olá, ____{nome}`); ``', null, '$', 'Dentro de crases, `${...}` insere o valor da expressão. Sem o cifrão, `{nome}` seria apenas texto.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-20', 'javascript', 'multiple_choice', 'O que `console.log(10 % 3)` mostra?', '["3.33","1","3","0"]'::jsonb, '1', 'O `%` devolve o **resto** da divisão, não o quociente. É a ferramenta padrão para testar múltiplos: `n % 2 === 0` é par.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-21', 'javascript', 'multiple_choice', 'Dentro de um laço, qual a diferença entre `break` e `continue`?', '["break encerra o laço; continue pula só a volta atual","break pula a volta atual; continue encerra o laço","os dois encerram o laço","os dois pulam a volta atual"]'::jsonb, 'break encerra o laço; continue pula só a volta atual', '`break` sai do laço inteiro — útil ao encontrar o que procurava. `continue` abandona apenas a iteração atual e segue para a próxima.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-22', 'javascript', 'multiple_choice', 'O que uma função sem `return` devolve?', '["undefined","null","0","Um erro"]'::jsonb, 'undefined', 'Toda função sem `return` explícito devolve `undefined`. Se um resultado seu apareceu como `undefined`, a primeira suspeita é um `return` esquecido.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-23', 'javascript', 'multiple_choice', 'O que `console.log(((n) => { n * 2 })(5))` mostra?', '["10","undefined","NaN","erro de sintaxe"]'::jsonb, 'undefined', 'Com chaves, a arrow function precisa de `return` explícito. Aqui a multiplicação é calculada e descartada. Sem as chaves, `(n) => n * 2` devolveria 10.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-24', 'javascript', 'multiple_choice', 'Qual método percorre um array **transformando** cada item e devolve um array novo?', '["filter","reduce","map","forEach"]'::jsonb, 'map', '`map` devolve um array do mesmo tamanho com cada item transformado. `filter` seleciona, `reduce` junta tudo num valor e `forEach` não devolve nada.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-25', 'javascript', 'multiple_choice', 'O que `console.log([1, 2, 3].reduce((total, n) => total + n, 0))` mostra?', '["6","[1, 2, 3]","3","0"]'::jsonb, '6', '`reduce` acumula: o retorno de cada volta vira o `total` da próxima. O `0` no final é o valor inicial — omiti-lo quebra quando o array está vazio.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-26', 'javascript', 'fill_blank', 'Complete para percorrer os **valores** de um array:

`for (const item ____ lista) { }`', null, 'of', '`for...of` entrega os valores; `for...in` entrega os índices. Em arrays você quase sempre quer `of`.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-27', 'javascript', 'multiple_choice', 'O que `console.log(["a", "b", "c"].join("-"))` mostra?', '["a-b-c","[\"a\",\"b\",\"c\"]","abc","a,b,c"]'::jsonb, 'a-b-c', '`join` transforma o array em um único texto, colocando o separador entre os itens. Sem argumento, o separador padrão é a vírgula.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-28', 'javascript', 'multiple_choice', 'O que `console.log("  Ana  ".trim().length)` mostra?', '["3","7","5","4"]'::jsonb, '3', '`trim` remove os espaços das duas pontas, sobrando `"Ana"` — 3 caracteres. O texto original tinha 7. O original não muda: `trim` devolve um texto novo.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-29', 'javascript', 'multiple_choice', 'O que `console.log("CodeQuest".slice(0, 4))` mostra?', '["Code","CodeQ","Quest","odeQ"]'::jsonb, 'Code', '`slice(início, fim)` vai do índice inicial até **antes** do final. Começando em 0 e parando antes do 4, saem os caracteres 0, 1, 2 e 3.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-30', 'javascript', 'multiple_choice', 'O que acontece com `const aluno = { nome: "Ana" }; aluno.nome = "Luiz";`?', '["Funciona: const impede trocar o objeto, não mudar propriedades","TypeError: Assignment to constant variable","A propriedade fica undefined","SyntaxError"]'::jsonb, 'Funciona: const impede trocar o objeto, não mudar propriedades', '`const` protege a **ligação** entre o nome e o objeto. O conteúdo continua editável. `aluno = {}` daria TypeError; `aluno.nome = "Luiz"` não.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-31', 'javascript', 'multiple_choice', 'O que `console.log({ nome: "Ana" }.idade)` mostra?', '["undefined","null","ReferenceError","Uma string vazia"]'::jsonb, 'undefined', 'Propriedade inexistente devolve `undefined`, sem erro. Por isso um nome de propriedade digitado errado passa despercebido até o problema aparecer bem depois.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-32', 'javascript', 'multiple_choice', 'Em um `switch`, o que acontece se faltar o `break` no `case` escolhido?', '["A execução continua nos cases seguintes","O programa para com erro","Nada: o break é opcional","O switch reinicia"]'::jsonb, 'A execução continua nos cases seguintes', 'É o *fall-through*: sem `break`, o JavaScript segue executando os `case` de baixo mesmo sem eles baterem com o valor.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-33', 'javascript', 'multiple_choice', 'O que `console.log("7" * "2")` mostra?', '["14","72","NaN","erro"]'::jsonb, '14', 'Diferente do `+`, o `*` não tem versão para texto — então o JavaScript converte os dois lados para número. Só o `+` concatena.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-34', 'javascript', 'multiple_choice', 'O que `console.log(parseInt("3.9"))` mostra?', '["4","3.9","3","NaN"]'::jsonb, '3', '`parseInt` corta na parte inteira, sem arredondar. Para arredondar use `Math.round("3.9")`; para manter as casas, `Number("3.9")`.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-35', 'javascript', 'multiple_choice', 'O que `console.log(Boolean("false"))` mostra?', '["true","false","undefined","NaN"]'::jsonb, 'true', 'Qualquer texto não vazio é truthy — inclusive `"false"` e `"0"`. Os falsy são apenas `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` e `NaN`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-36', 'javascript', 'fill_blank', 'Complete para selecionar só os números pares:

`const pares = numeros.______((n) => n % 2 === 0);`', null, 'filter', '`filter` mantém os itens cuja função devolve `true` e descarta o resto, gerando um array menor ou igual ao original.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-37', 'javascript', 'multiple_choice', 'Qual método remove e devolve o **último** item de um array?', '["shift","pop","slice","splice"]'::jsonb, 'pop', '`pop` tira do fim e `shift` tira do começo. `push` e `unshift` são os que acrescentam, nas mesmas pontas.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-38', 'javascript', 'multiple_choice', 'O que `console.log([1, 2, 3].indexOf(2))` mostra?', '["1","2","true","-1"]'::jsonb, '1', '`indexOf` devolve a **posição**, e a contagem começa em 0 — o número 2 está no índice 1. Quando não encontra, devolve `-1`.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-39', 'javascript', 'multiple_choice', 'O que `console.log(2 ** 3)` mostra?', '["6","8","9","23"]'::jsonb, '8', 'O `**` é o operador de potência: 2 elevado a 3. Ele substitui o antigo `Math.pow(2, 3)`.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-js-40', 'javascript', 'multiple_choice', 'Qual palavra-chave declara uma variável que **vaza** do bloco onde foi criada?', '["var","let","const","block"]'::jsonb, 'var', '`var` tem escopo de função e ignora `{}` — um `var` declarado dentro de um `for` continua existindo depois dele. É o motivo de `let` e `const` terem substituído seu uso.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-01', 'java', 'multiple_choice', 'Qual comando imprime uma linha no console em Java?', '["System.out.println()","console.log()","print()","echo()"]'::jsonb, 'System.out.println()', '`System.out.println()` escreve no console e quebra a linha.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-02', 'java', 'fill_blank', 'Complete a declaração de um número inteiro:

`____ idade = 18;`', null, 'int', 'Java é de tipagem estática: o tipo vem antes do nome da variável.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-03', 'java', 'multiple_choice', 'Qual é a assinatura do método onde um programa Java começa?', '["public static void main(String[] args)","public void main()","static main(String args)","void start(String[] args)"]'::jsonb, 'public static void main(String[] args)', 'A JVM procura exatamente esse método para iniciar o programa.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-04', 'java', 'multiple_choice', 'O que `System.out.println(7 / 2);` mostra?', '["3","3.5","4","erro"]'::jsonb, '3', 'Divisão entre dois `int` em Java é inteira: a parte decimal é descartada.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-05', 'java', 'multiple_choice', 'Qual tipo guarda um único caractere?', '["char","String","text","byte"]'::jsonb, 'char', '`char` guarda um caractere e usa aspas simples: `char letra = ''A'';`', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-06', 'java', 'multiple_choice', 'Como se compara o CONTEÚDO de duas Strings em Java?', '["a.equals(b)","a == b","a.compare(b)","a === b"]'::jsonb, 'a.equals(b)', '`==` compara se são o mesmo objeto na memória; `equals` compara o texto.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-07', 'java', 'fill_blank', 'Complete para criar um laço que repete 10 vezes:

`for (int i = 0; i ____ 10; i++)`', null, '<', 'Com `i < 10` e começando em 0, o laço roda exatamente 10 vezes.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-08', 'java', 'multiple_choice', 'O que significa a palavra-chave `final` em uma variável?', '["O valor não pode ser alterado depois","A variável é global","A variável é apagada ao fim do método","A variável é pública"]'::jsonb, 'O valor não pode ser alterado depois', '`final` é o equivalente Java de uma constante.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-09', 'java', 'multiple_choice', 'Qual tipo representa verdadeiro ou falso?', '["boolean","bool","bit","logic"]'::jsonb, 'boolean', 'Em Java o tipo se chama `boolean` por extenso (em C# e C++ é `bool`).', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-java-10', 'java', 'multiple_choice', 'O que é preciso para usar `Scanner` e ler do teclado?', '["import java.util.Scanner;","import java.io.Console;","include <scanner>","nada, já vem pronto"]'::jsonb, 'import java.util.Scanner;', '`Scanner` está no pacote `java.util`, então precisa ser importado.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-01', 'csharp', 'multiple_choice', 'Qual comando imprime uma linha no console em C#?', '["Console.WriteLine()","System.out.println()","print()","echo()"]'::jsonb, 'Console.WriteLine()', '`Console.WriteLine()` escreve e quebra a linha; `Console.Write()` não quebra.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-02', 'csharp', 'fill_blank', 'Complete para declarar uma variável deixando o compilador deduzir o tipo:

`____ nome = "Davi";`', null, 'var', '`var` mantém a tipagem estática — o tipo é deduzido do valor, não some.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-03', 'csharp', 'multiple_choice', 'Qual tipo guarda texto em C#?', '["string","String[]","text","char[]"]'::jsonb, 'string', 'Em C# o tipo se escreve com `s` minúsculo — é um apelido para `System.String`.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-04', 'csharp', 'multiple_choice', 'O que faz o `?` em `int? idade;`?', '["Permite que a variável seja nula","Torna a variável opcional no método","Marca a variável como constante","Nada, é erro de sintaxe"]'::jsonb, 'Permite que a variável seja nula', 'O `?` cria um tipo anulável: `int?` aceita um número ou `null`.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-05', 'csharp', 'multiple_choice', 'Como se escreve uma string interpolada em C#?', '["$\"Olá, {nome}\"","f\"Olá, {nome}\"","`Olá, ${nome}`","\"Olá, \" . nome"]'::jsonb, '$"Olá, {nome}"', 'O `$` antes das aspas liga a interpolação; as variáveis vão entre chaves.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-06', 'csharp', 'multiple_choice', 'Qual palavra-chave declara uma constante em C#?', '["const","final","readonly var","static"]'::jsonb, 'const', '`const` exige valor no momento da declaração e nunca muda.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-07', 'csharp', 'fill_blank', 'Complete para ler uma linha digitada pelo usuário:

`string nome = Console.____();`', null, 'ReadLine', '`Console.ReadLine()` devolve o que foi digitado, como texto.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cs-08', 'csharp', 'multiple_choice', 'O que `Console.WriteLine(7 / 2);` mostra?', '["3","3.5","4","erro"]'::jsonb, '3', 'Divisão entre inteiros é inteira. Para ter 3.5, algum lado precisa ser decimal.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-01', 'cpp', 'multiple_choice', 'Qual comando imprime no console em C++?', '["std::cout","System.out","print","Console.Write"]'::jsonb, 'std::cout', '`std::cout << "texto";` envia o texto para a saída padrão.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-02', 'cpp', 'fill_blank', 'Complete para poder usar `cout`:

`#include <____>`', null, 'iostream', '`iostream` traz `cout`, `cin` e `endl`.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-03', 'cpp', 'multiple_choice', 'Qual operador é usado para ENVIAR dados ao `cout`?', '["<<",">>","->","::"]'::jsonb, '<<', 'A "seta" aponta para onde o dado vai: `cout << x` escreve; `cin >> x` lê.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-04', 'cpp', 'multiple_choice', 'O que o programa devolve ao sistema quando termina bem?', '["return 0;","return 1;","exit();","nada"]'::jsonb, 'return 0;', 'Por convenção, 0 significa "terminou sem erro".', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-05', 'cpp', 'multiple_choice', 'O que `int* p;` declara?', '["Um ponteiro para inteiro","Um inteiro multiplicado","Um array de inteiros","Uma referência a inteiro"]'::jsonb, 'Um ponteiro para inteiro', 'O `*` na declaração cria um ponteiro: uma variável que guarda um endereço.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-06', 'cpp', 'multiple_choice', 'Qual tipo guarda um número com casas decimais e mais precisão?', '["double","float","int","decimal"]'::jsonb, 'double', '`double` usa o dobro de bits do `float`, então guarda mais casas com precisão.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-07', 'cpp', 'fill_blank', 'Complete para quebrar a linha depois de imprimir:

`std::cout << "Oi" << std::____;`', null, 'endl', '`std::endl` quebra a linha e descarrega o buffer de saída.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-cpp-08', 'cpp', 'multiple_choice', 'Qual é o índice do PRIMEIRO elemento de um array em C++?', '["0","1","-1","depende do tipo"]'::jsonb, '0', 'Como na maioria das linguagens, a contagem começa do zero.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-01', 'geral', 'multiple_choice', 'O que é uma variável?', '["Um espaço nomeado que guarda um valor","Um comando que repete instruções","Um erro do programa","Um tipo de comentário"]'::jsonb, 'Um espaço nomeado que guarda um valor', 'Variável é um nome que aponta para um valor guardado na memória.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-02', 'geral', 'multiple_choice', 'Um laço que nunca para de repetir é chamado de:', '["Laço infinito","Recursão","Deadlock","Overflow"]'::jsonb, 'Laço infinito', 'Acontece quando a condição de parada nunca se torna falsa.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-03', 'geral', 'multiple_choice', 'Quantos bits tem 1 byte?', '["8","4","16","1024"]'::jsonb, '8', 'Um byte são 8 bits — o suficiente para 256 valores diferentes.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-04', 'geral', 'multiple_choice', 'O que é um "bug"?', '["Um comportamento errado do programa","Um tipo de variável","Um comando de repetição","Uma linguagem de programação"]'::jsonb, 'Um comportamento errado do programa', 'O termo vem de uma mariposa presa num computador em 1947 — mas hoje significa qualquer defeito.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-05', 'geral', 'multiple_choice', 'Se `a = 5` e `b = 2`, quanto vale `a % b`?', '["1","2","2.5","0"]'::jsonb, '1', 'O operador `%` devolve o RESTO da divisão: 5 dividido por 2 dá 2 e sobra 1.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-06', 'geral', 'multiple_choice', 'Qual condição é verdadeira quando `x` está entre 10 e 20 (exclusive)?', '["x > 10 e x < 20","x > 10 ou x < 20","x >= 10 e x <= 20","x != 10 e x != 20"]'::jsonb, 'x > 10 e x < 20', 'Com "ou", qualquer número satisfaria uma das partes — precisa ser "e".', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-07', 'geral', 'multiple_choice', 'O que faz um compilador?', '["Traduz o código para uma linguagem que a máquina entende","Executa o código linha por linha em tempo real","Corrige os erros do programador","Guarda o código na nuvem"]'::jsonb, 'Traduz o código para uma linguagem que a máquina entende', 'Compilador traduz tudo antes de rodar; interpretador traduz enquanto roda.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-08', 'geral', 'multiple_choice', 'Uma função que chama a si mesma é um caso de:', '["Recursão","Iteração","Herança","Sobrecarga"]'::jsonb, 'Recursão', 'Toda recursão precisa de um caso base, senão vira laço infinito.', 2)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-09', 'geral', 'multiple_choice', 'Em binário, quanto vale 1010?', '["10","8","12","1010"]'::jsonb, '10', '1×8 + 0×4 + 1×2 + 0×1 = 10.', 3)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
  insert into public.pvp_questions (id, language_slug, kind, prompt, options, answer, explanation, difficulty) values ('pvp-ger-10', 'geral', 'multiple_choice', 'Para que serve um comentário no código?', '["Explicar o código para quem lê — a máquina ignora","Deixar o programa mais rápido","Guardar valores temporários","Criar uma nova função"]'::jsonb, 'Explicar o código para quem lê — a máquina ignora', 'Comentário é para gente. O interpretador ou compilador pula essas linhas.', 1)
    on conflict (id) do update set language_slug = excluded.language_slug, kind = excluded.kind,
    prompt = excluded.prompt, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, difficulty = excluded.difficulty;
end
$seed$;

commit;
