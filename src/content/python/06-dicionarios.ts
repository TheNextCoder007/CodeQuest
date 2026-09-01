import type { Module } from '@/types/content';

/** Modulo 6 - Dicionarios (chave/valor, consulta segura, percurso e contagem). */
export const dicionarios: Module = {
  id: 'py-dicionarios',
  languageId: 'python',
  title: 'Dicionários',
  description: 'Guardar dados por nome em vez de por posição — a estrutura mais usada no dia a dia.',
  icon: '🗂️',
  orderIndex: 6,
  lessons: [
    {
      id: 'py-dic-01',
      moduleId: 'py-dicionarios',
      title: 'Chave e valor',
      subtitle: 'Quando a posição não diz nada',
      orderIndex: 1,
      content: `## O limite da lista

Numa lista, cada valor é identificado pela **posição**. Para os dados de uma pessoa, isso fica ruim depressa:

~~~py
aluno = ["Ana", 20, 8.5]
print(aluno[2])
~~~

O que é \`aluno[2]\`? Você precisa lembrar. E se alguém acrescentar um campo no meio, todo o código que usa índices quebra em silêncio.

## O dicionário guarda por nome

~~~py
aluno = {"nome": "Ana", "idade": 20, "media": 8.5}
print(aluno["media"])
~~~

~~~text
8.5
~~~

Agora o código **se explica**. Chaves \`{ }\` criam o dicionário; cada item é um par \`"chave": valor\`, separado por vírgula.

| | Lista | Dicionário |
| --- | --- | --- |
| Identifica por | posição (\`0\`, \`1\`, \`2\`) | chave (\`"nome"\`, \`"idade"\`) |
| Boa para | uma coleção de coisas iguais | os campos de **uma** coisa |
| Sintaxe | \`[ ]\` | \`{ }\` |

## Escrever e acrescentar

A mesma sintaxe faz as duas coisas: se a chave existe, o valor é trocado; se não existe, ela é criada.

~~~py
aluno = {"nome": "Ana"}
aluno["idade"] = 20
aluno["nome"] = "Ana Paula"
print(aluno)
~~~

~~~text
{'nome': 'Ana Paula', 'idade': 20}
~~~

Repare que a ordem de inserção é mantida — o \`nome\` continua na frente porque entrou primeiro.

## Chave que não existe

~~~py
aluno = {"nome": "Ana"}
print(aluno["telefone"])
~~~

~~~text
KeyError: 'telefone'
~~~

Esse erro é tão comum que a próxima lição existe só para evitá-lo.`,
      polyglot: [
        { language: 'Python', code: 'aluno = {"nome": "Ana", "idade": 20}\nprint(aluno["nome"])' },
        {
          language: 'JavaScript',
          code: 'const aluno = { nome: "Ana", idade: 20 };\nconsole.log(aluno.nome);',
        },
        {
          language: 'Java',
          code: 'Map<String, Object> aluno = Map.of("nome", "Ana", "idade", 20);\nSystem.out.println(aluno.get("nome"));',
        },
      ],
      exercises: [
        {
          id: 'py-dic-01-e1',
          lessonId: 'py-dic-01',
          prompt:
            'Crie um dicionário chamado `livro` com a chave `titulo` valendo `Python Fluente` e a chave `paginas` valendo `800`. Mostre o título e depois as páginas, um por linha.\n\nSaída esperada:\n\n~~~text\nPython Fluente\n800\n~~~',
          starterCode: '# crie o dicionário livro e mostre o titulo e as paginas\n',
          validationType: 'output_match',
          expectedAnswer: 'Python Fluente\n800',
          hint: 'livro = {"titulo": "Python Fluente", "paginas": 800} e depois livro["titulo"].',
          explanation:
            'O acesso é por chave, entre colchetes — `livro["titulo"]`. As chaves aqui são textos, então vão entre aspas na criação e no acesso.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'py-dic-01-e2',
          lessonId: 'py-dic-01',
          prompt:
            'O dicionário `perfil` já existe. Acrescente a chave `cidade` com o valor `Recife`, troque o `nivel` para `5` e mostre o dicionário inteiro.\n\nSaída esperada:\n\n~~~text\n{\'usuario\': \'dev\', \'nivel\': 5, \'cidade\': \'Recife\'}\n~~~',
          starterCode: 'perfil = {"usuario": "dev", "nivel": 3}\n\n# acrescente cidade, troque o nivel e mostre o dicionário\n',
          validationType: 'output_match',
          expectedAnswer: "{'usuario': 'dev', 'nivel': 5, 'cidade': 'Recife'}",
          hint: 'perfil["cidade"] = "Recife" cria a chave nova; perfil["nivel"] = 5 troca a que já existe.',
          explanation:
            'A mesma sintaxe cria e atualiza: se a chave já existe o valor é trocado no lugar, se não existe ela entra no fim. Por isso `cidade` aparece por último.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-dic-02',
      moduleId: 'py-dicionarios',
      title: 'Consultar sem quebrar',
      subtitle: 'get(), in e del',
      orderIndex: 2,
      content: `## O problema

\`dados["chave"]\` derruba o programa quando a chave não existe. Em dados que vêm de fora — de um formulário, de um arquivo, de uma API — isso acontece o tempo todo.

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

O segundo argumento é o **valor padrão**. Este é o jeito de ler campo opcional sem encher o código de \`if\`.

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

> Atenção: \`in\` procura entre as **chaves**, não entre os valores. \`"Ana" in aluno\` é \`False\`.

## Quando usar cada um

| Situação | Escolha |
| --- | --- |
| A chave tem de existir; se não existir é um bug | \`dados["chave"]\` |
| Campo opcional, com um padrão razoável | \`dados.get("chave", padrao)\` |
| Preciso **decidir** algo a partir da presença | \`if "chave" in dados:\` |

Deixar o \`KeyError\` acontecer é a escolha certa quando a ausência da chave realmente indica um erro — o programa para perto do problema, em vez de seguir com dado errado.

## Remover

~~~py
aluno = {"nome": "Ana", "rascunho": True}
del aluno["rascunho"]
print(aluno)
~~~

~~~text
{'nome': 'Ana'}
~~~`,
      exercises: [
        {
          id: 'py-dic-02-e1',
          lessonId: 'py-dic-02',
          prompt:
            'O dicionário `config` não tem a chave `tema`. Mostre o valor de `tema` usando `escuro` como padrão, e depois o valor de `idioma`, que existe.\n\nSaída esperada:\n\n~~~text\nescuro\npt-BR\n~~~',
          starterCode: 'config = {"idioma": "pt-BR"}\n\n# mostre o tema (com padrão) e depois o idioma\n',
          validationType: 'output_match',
          expectedAnswer: 'escuro\npt-BR',
          hint: 'config.get("tema", "escuro") devolve o padrão quando a chave não existe.',
          explanation:
            'O segundo argumento de `get()` é o valor devolvido quando a chave falta. Sem ele viria `None`; com `config["tema"]` viria um `KeyError` e o programa pararia.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-dic-02-e2',
          lessonId: 'py-dic-02',
          prompt:
            'Verifique se a chave `email` existe em `cadastro` e mostre `Cadastro completo` se existir, ou `Falta o e-mail` se não existir.\n\nSaída esperada:\n\n~~~text\nFalta o e-mail\n~~~',
          starterCode: 'cadastro = {"nome": "Dev", "senha": "1234"}\n\n# decida a partir da presença da chave email\n',
          validationType: 'output_match',
          expectedAnswer: 'Falta o e-mail',
          hint: 'if "email" in cadastro: — o in procura entre as chaves.',
          explanation:
            'O `in` pergunta pelas **chaves** do dicionário. Como `email` não está lá, o `else` é executado.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-dic-03',
      moduleId: 'py-dicionarios',
      title: 'Percorrer um dicionário',
      subtitle: 'items(), keys() e values()',
      orderIndex: 3,
      content: `## O for sozinho dá as chaves

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

O \`for\` recebe **duas** variáveis porque \`items()\` entrega um par a cada volta. Os nomes são livres — \`for campo, conteudo in ...\` funciona igual.

## As três formas

| Escrita | O que o for recebe |
| --- | --- |
| \`for c in dados:\` | as chaves |
| \`for c in dados.keys():\` | as chaves (explícito) |
| \`for v in dados.values():\` | os valores |
| \`for c, v in dados.items():\` | os dois |

## Somando valores

\`values()\` combina direto com o \`sum()\` que você viu em listas:

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
~~~`,
      polyglot: [
        {
          language: 'Python',
          code: 'for chave, valor in dados.items():\n    print(chave, valor)',
        },
        {
          language: 'JavaScript',
          code: 'for (const [chave, valor] of Object.entries(dados)) {\n  console.log(chave, valor);\n}',
        },
      ],
      exercises: [
        {
          id: 'py-dic-03-e1',
          lessonId: 'py-dic-03',
          prompt:
            'Percorra o dicionário `estoque` e mostre uma linha por produto no formato `produto: quantidade`.\n\nSaída esperada:\n\n~~~text\ncaneta: 12\ncaderno: 3\nborracha: 7\n~~~',
          starterCode:
            'estoque = {"caneta": 12, "caderno": 3, "borracha": 7}\n\n# uma linha por produto, no formato produto: quantidade\n',
          validationType: 'output_match',
          expectedAnswer: 'caneta: 12\ncaderno: 3\nborracha: 7',
          hint: 'for produto, quantidade in estoque.items(): e um print com f-string.',
          explanation:
            '`items()` entrega a chave e o valor a cada volta, e a f-string monta a linha. Sem `items()`, o `for` daria só os nomes dos produtos.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'py-dic-03-e2',
          lessonId: 'py-dic-03',
          prompt:
            'Mostre o total vendido na semana, somando todos os valores de `vendas`.\n\nSaída esperada:\n\n~~~text\n340\n~~~',
          starterCode: 'vendas = {"seg": 100, "ter": 150, "qua": 90}\n\n# mostre o total\n',
          validationType: 'output_match',
          expectedAnswer: '340',
          hint: 'sum(vendas.values()) soma os valores — sum(vendas) tentaria somar as chaves.',
          explanation:
            '`values()` devolve só os valores, e `sum()` os soma. Passar o dicionário direto para `sum()` daria erro, porque ele tentaria somar os textos das chaves.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'py-dic-04',
      moduleId: 'py-dicionarios',
      title: 'Contar com dicionário',
      subtitle: 'O padrão que aparece em todo lugar',
      orderIndex: 4,
      content: `## O problema clássico

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
{'azul': 3, 'verde': 1, 'roxo': 1}
~~~

Leia devagar: a primeira vez que uma cor aparece, ela **não está** no dicionário, então entra com 1. Nas vezes seguintes, o valor que já existe é somado com 1.

## A versão curta

O \`get()\` da lição anterior encurta as quatro linhas para uma:

~~~py
votos = ["azul", "verde", "azul"]
contagem = {}

for cor in votos:
    contagem[cor] = contagem.get(cor, 0) + 1

print(contagem)
~~~

~~~text
{'azul': 2, 'verde': 1}
~~~

Quando a cor ainda não existe, \`get(cor, 0)\` devolve 0 e a soma dá 1. Quando existe, devolve a contagem atual. É a mesma lógica, sem o \`if\`.

> Este padrão — *ler com padrão, somar, guardar de volta* — resolve contagem, agrupamento, soma por categoria e totalização por chave. Vale reconhecê-lo.

## Achando o maior

Depois de contar, encontrar o campeão é um \`for\` guardando o melhor até agora:

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
~~~`,
      exercises: [
        {
          id: 'py-dic-04-e1',
          lessonId: 'py-dic-04',
          prompt:
            'Conte quantas vezes cada animal aparece na lista `bichos` e mostre o dicionário de contagem.\n\nSaída esperada:\n\n~~~text\n{\'gato\': 3, \'cão\': 2}\n~~~',
          starterCode:
            'bichos = ["gato", "cão", "gato", "gato", "cão"]\ncontagem = {}\n\n# conte cada animal e mostre a contagem\n',
          validationType: 'output_match',
          expectedAnswer: "{'gato': 3, 'cão': 2}",
          hint: 'Percorra a lista e faça contagem[bicho] = contagem.get(bicho, 0) + 1.',
          explanation:
            'O padrão *ler com padrão, somar, guardar de volta* resolve a contagem numa linha dentro do `for`. A ordem do resultado segue a ordem em que cada chave apareceu pela primeira vez.',
          xpReward: 45,
          orderIndex: 1,
        },
        {
          id: 'py-dic-04-e2',
          lessonId: 'py-dic-04',
          prompt:
            'A partir do dicionário `pontos`, mostre o nome de quem tem mais pontos e, na linha seguinte, quantos pontos são.\n\nSaída esperada:\n\n~~~text\nLuiz\n95\n~~~',
          starterCode:
            'pontos = {"Ana": 80, "Luiz": 95, "Davi": 60}\nlider = ""\nmaior = 0\n\n# descubra quem lidera e mostre o nome e os pontos\n',
          validationType: 'output_match',
          expectedAnswer: 'Luiz\n95',
          hint: 'Percorra com items() e guarde o melhor até agora sempre que achar um valor maior.',
          explanation:
            'Guardar "o melhor até agora" enquanto se percorre é o mesmo raciocínio do acumulador que você usou no módulo de repetições — só que aqui o que se guarda são dois valores: quem e quanto.',
          xpReward: 45,
          orderIndex: 2,
        },
      ],
    },
  ],
};
