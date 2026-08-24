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
insert into public.languages (id, name, slug, icon, description, available, order_index) values ('javascript', 'JavaScript', 'javascript', '🟨', 'A linguagem da web. Trilha em produção.', false, 2)
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

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-funcoes', 'python', 'Funções', 'Dar nome a um pedaço de lógica, reaproveitar código e parar de repetir você mesmo.', '⚙️', 5)
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

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-desafios', 'python', 'Desafios', 'Problemas que combinam tudo que você aprendeu. Nada de conteúdo novo — só raciocínio.', '🧩', 6)
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

insert into public.modules (id, language_id, title, description, icon, order_index) values ('py-projeto-final', 'python', 'Projeto Final', 'Um sistema completo de boletim escolar, construído em três etapas — do zero ao funcionando.', '🏆', 7)
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

-- Conquistas ---------------------------------------------------------------
insert into public.achievements (id, title, description, icon, criteria) values ('primeiro-desafio', 'Primeiro desafio concluído', 'Você resolveu sua primeira lição no CodeQuest.', '🎯', '{"kind":"first_lesson"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('aquecendo', 'Aquecendo os motores', 'Cinco lições concluídas. A rotina começou.', '🚀', '{"kind":"lessons_completed","count":5}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('meia-trilha', 'Meia trilha', 'Doze lições concluídas — você passou da metade da trilha de Python.', '🧭', '{"kind":"lessons_completed","count":12}'::jsonb)
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
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-funcoes', 'Arquiteto de funções', 'Você concluiu todo o módulo ⚙️ Funções.', '⚙️', '{"kind":"module_completed","moduleId":"py-funcoes"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('modulo-desafios', 'Resolvedor de problemas', 'Você concluiu todo o módulo 🧩 Desafios, incluindo o FizzBuzz.', '🧩', '{"kind":"module_completed","moduleId":"py-desafios"}'::jsonb)
  on conflict (id) do update set title = excluded.title, description = excluded.description,
  icon = excluded.icon, criteria = excluded.criteria;
insert into public.achievements (id, title, description, icon, criteria) values ('trilha-python', 'Trilha de Python concluída', 'Você terminou os sete módulos da trilha de Python. Respeito.', '🏆', '{"kind":"language_completed","languageSlug":"python"}'::jsonb)
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
insert into public.achievements (id, title, description, icon, criteria) values ('ranqueada-mestre', 'Alcançou Mestre', 'Chegou ao Mestre — o patamar mais alto da ranqueada.', '🏅', '{"kind":"ranked_tier","patamar":6}'::jsonb)
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
