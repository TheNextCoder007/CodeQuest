import type { Module } from '@/types/content';

/** Modulo 6 - HashMap: guardar por chave, consultar com seguranca e contar. */
export const mapas: Module = {
  id: 'java-mapas',
  languageId: 'java',
  title: 'Mapas',
  description: 'HashMap: guardar dados por nome em vez de por posição.',
  icon: '🗂️',
  orderIndex: 6,
  lessons: [
    {
      id: 'ja-map-01',
      moduleId: 'java-mapas',
      title: 'Chave e valor',
      subtitle: 'HashMap',
      orderIndex: 1,
      content: `## O limite da lista

Numa lista, cada valor é identificado pela **posição**. Para os dados de uma pessoa, isso envelhece mal:

~~~java
String[] aluno = {"Ana", "20", "8.5"};
System.out.println(aluno[2]);
~~~

O que é \`aluno[2]\`? Você precisa lembrar. E note o outro problema: como o array tem um tipo só, a idade e a nota viraram texto.

## O mapa guarda por nome

~~~java
import java.util.HashMap;

HashMap<String, Integer> idades = new HashMap<>();
idades.put("Ana", 20);
idades.put("Luiz", 25);

System.out.println(idades.get("Ana"));
~~~

~~~text
20
~~~

Agora são **dois** tipos genéricos: \`<String, Integer>\` é "chave texto, valor inteiro".

| | ArrayList | HashMap |
| --- | --- | --- |
| Identifica por | posição (\`0\`, \`1\`) | chave (\`"Ana"\`) |
| Boa para | uma coleção de coisas iguais | os campos de **uma** coisa, ou pares nome→valor |
| Acrescentar | \`add(x)\` | \`put(chave, valor)\` |
| Ler | \`get(i)\` | \`get(chave)\` |

## put cria e atualiza

~~~java
idades.put("Ana", 20);
idades.put("Ana", 21);
System.out.println(idades);
~~~

~~~text
{Ana=21}
~~~

Se a chave já existe, o valor é substituído. Não há erro nem aviso: é assim que se atualiza.

## A ordem não é garantida

\`HashMap\` **não** guarda a ordem de inserção. Imprimir pode sair em qualquer ordem, e ela pode até mudar entre execuções.

> Isso surpreende quem vem do Python, onde o dicionário mantém a ordem de inserção desde a versão 3.7. Se a ordem importar, use \`LinkedHashMap\` (ordem de inserção) ou \`TreeMap\` (ordenado pela chave) — os dois têm exatamente os mesmos métodos.

## Chave que não existe

~~~java
System.out.println(idades.get("Kauan"));
~~~

~~~text
null
~~~

Diferente do Python, que lança \`KeyError\`, o Java devolve \`null\` em silêncio. É mais educado e mais perigoso: o programa segue com \`null\` na mão e quebra mais adiante, longe da causa.`,
      polyglot: [
        { language: 'Java', code: 'HashMap<String, Integer> idades = new HashMap<>();\nidades.put("Ana", 20);' },
        { language: 'Python', code: 'idades = {}\nidades["Ana"] = 20' },
        { language: 'JavaScript', code: 'const idades = {};\nidades.Ana = 20;' },
      ],
      exercises: [
        {
          id: 'ja-map-01-e1',
          lessonId: 'ja-map-01',
          prompt:
            'Complete para guardar o valor `20` sob a chave `"Ana"`:\n\n~~~java\nHashMap<String, Integer> idades = new HashMap<>();\nidades.______("Ana", 20);\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'put',
          hint: 'É o método de guardar num mapa — o equivalente ao `add` da lista.',
          explanation:
            '`put(chave, valor)` insere ou atualiza. Se a chave já existir, o valor anterior é substituído sem nenhum aviso.',
          xpReward: 30,
          orderIndex: 1,
        },
        {
          id: 'ja-map-01-e2',
          lessonId: 'ja-map-01',
          prompt:
            'O que `idades.get("Kauan")` devolve, se a chave `"Kauan"` não existe no mapa?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: ['null', '0', 'Lança KeyError', 'Lança NullPointerException'],
          expectedAnswer: 'null',
          explanation:
            'O Java devolve `null` em silêncio, ao contrário do Python, que lança `KeyError`. O risco é o programa seguir com `null` na mão e só quebrar bem mais adiante, longe da causa.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-map-02',
      moduleId: 'java-mapas',
      title: 'Consultar sem quebrar',
      subtitle: 'containsKey e getOrDefault',
      orderIndex: 2,
      content: `## O problema do null

\`get()\` devolvendo \`null\` só adia o erro:

~~~java
HashMap<String, Integer> estoque = new HashMap<>();
int quantidade = estoque.get("caneta");
~~~

~~~text
Exception in thread "main" java.lang.NullPointerException
~~~

O \`null\` não cabe num \`int\`, e a conversão automática de \`Integer\` para \`int\` estoura. O erro aparece nesta linha, mas a causa é a chave que não existia.

## getOrDefault: um valor de reserva

~~~java
int quantidade = estoque.getOrDefault("caneta", 0);
System.out.println(quantidade);
~~~

~~~text
0
~~~

Este é o jeito de ler um campo opcional sem encher o código de \`if\`. É também a peça central da contagem, na última lição do módulo.

## containsKey: a chave existe?

~~~java
if (estoque.containsKey("caneta")) {
    System.out.println("Temos caneta");
} else {
    System.out.println("Acabou a caneta");
}
~~~

~~~text
Acabou a caneta
~~~

| Situação | Escolha |
| --- | --- |
| A chave tem de existir; faltar é bug | \`get(chave)\` |
| Campo opcional, com padrão razoável | \`getOrDefault(chave, padrao)\` |
| Preciso **decidir** algo pela presença | \`if (containsKey(chave))\` |

Deixar o \`null\` acontecer é a escolha certa quando a ausência realmente indica um defeito: o programa para perto do problema, em vez de seguir com dado errado.

> \`containsKey\` procura entre as **chaves**. Para procurar entre os valores existe \`containsValue\`, que é bem mais lento — ele varre o mapa inteiro, enquanto \`containsKey\` vai direto.

## Remover

~~~java
estoque.remove("caneta");
~~~

Remover uma chave que não existe não dá erro: simplesmente não faz nada.`,
      exercises: [
        {
          id: 'ja-map-02-e1',
          lessonId: 'ja-map-02',
          prompt:
            'Complete para ler a quantidade usando `0` quando a chave não existir:\n\n~~~java\nint quantidade = estoque.______("caneta", 0);\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'getOrDefault',
          hint: 'O nome do método diz o que ele faz: pega, ou usa o padrão.',
          explanation:
            '`getOrDefault(chave, padrao)` devolve o padrão quando a chave falta. Com `get()` viria `null`, e atribuir `null` a um `int` lança `NullPointerException`.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-map-02-e2',
          lessonId: 'ja-map-02',
          prompt:
            'Por que `int quantidade = estoque.get("caneta");` lança `NullPointerException` quando a chave não existe?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'get devolve null, e null não pode ser convertido para o primitivo int',
            'O HashMap não aceita ser lido antes de ter itens',
            'Falta declarar a variável como Integer',
            'Porque o mapa está vazio, e mapa vazio não pode ser consultado',
          ],
          expectedAnswer:
            'get devolve null, e null não pode ser convertido para o primitivo int',
          explanation:
            'O mapa guarda `Integer` (objeto), e a atribuição a um `int` exige a conversão automática. Converter `null` estoura. `getOrDefault` resolve dando um valor de verdade.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-map-03',
      moduleId: 'java-mapas',
      title: 'Percorrer um mapa',
      subtitle: 'entrySet, keySet e values',
      orderIndex: 3,
      content: `## Chave e valor de uma vez

~~~java
HashMap<String, Integer> estoque = new HashMap<>();
estoque.put("caneta", 12);
estoque.put("caderno", 3);

for (Map.Entry<String, Integer> item : estoque.entrySet()) {
    System.out.println(item.getKey() + ": " + item.getValue());
}
~~~

~~~text
caneta: 12
caderno: 3
~~~

\`entrySet()\` devolve os pares. Cada \`Map.Entry\` tem \`getKey()\` e \`getValue()\`.

É mais verboso que o \`for chave, valor in dados.items()\` do Python — em Java, um par precisa de um tipo com nome, e esse tipo é o \`Map.Entry\`.

> Precisa do \`import java.util.Map;\` para escrever \`Map.Entry\`, além do import do \`HashMap\`.

## As três formas

| Escrita | O que o for recebe |
| --- | --- |
| \`for (String c : mapa.keySet())\` | as chaves |
| \`for (Integer v : mapa.values())\` | os valores |
| \`for (Map.Entry<K,V> e : mapa.entrySet())\` | os dois |

## Só as chaves

~~~java
for (String produto : estoque.keySet()) {
    System.out.println(produto);
}
~~~

~~~text
caneta
caderno
~~~

Usar \`keySet()\` e depois chamar \`get(produto)\` dentro do laço funciona, mas faz duas buscas por item. Quando você precisa dos dois, \`entrySet()\` é a forma certa.

## Somando os valores

~~~java
int total = 0;
for (int quantidade : estoque.values()) {
    total += quantidade;
}
System.out.println(total);
~~~

~~~text
15
~~~

## A versão curta

A partir do Java 8 dá para escrever assim:

~~~java
estoque.forEach((produto, quantidade) ->
    System.out.println(produto + ": " + quantidade));
~~~

Aquela seta é uma **expressão lambda** — uma função escrita ali mesmo, sem nome. Você vai encontrar isso em código Java moderno o tempo todo.`,
      exercises: [
        {
          id: 'ja-map-03-e1',
          lessonId: 'ja-map-03',
          prompt:
            'Complete o método que devolve os pares chave/valor para percorrer:\n\n~~~java\nfor (Map.Entry<String, Integer> item : estoque.______) {\n    System.out.println(item.getKey());\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'entrySet()',
          hint: 'O nome fala em "entradas" — os pares do mapa. Não esqueça os parênteses.',
          explanation:
            '`entrySet()` devolve os pares. `keySet()` daria só as chaves e `values()` só os valores — e aí você não teria os dois de uma vez.',
          xpReward: 35,
          orderIndex: 1,
        },
        {
          id: 'ja-map-03-e2',
          lessonId: 'ja-map-03',
          prompt:
            'Você precisa da chave **e** do valor de cada item. Por que `entrySet()` é melhor que `keySet()` com `get()` dentro do laço?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'Com keySet + get você faz duas buscas por item; o entrySet já traz o par',
            'keySet não funciona dentro de um for-each',
            'get() não pode ser chamado dentro de um laço',
            'Não há diferença: as duas formas são idênticas',
          ],
          expectedAnswer:
            'Com keySet + get você faz duas buscas por item; o entrySet já traz o par',
          explanation:
            'As duas funcionam, mas `keySet()` seguido de `get(chave)` procura no mapa de novo a cada volta. `entrySet()` entrega chave e valor juntos, numa passagem só.',
          xpReward: 35,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'ja-map-04',
      moduleId: 'java-mapas',
      title: 'Contar com mapa',
      subtitle: 'O padrão que aparece em todo lugar',
      orderIndex: 4,
      content: `## O problema clássico

Quantas vezes cada palavra aparece numa lista? Com listas isso é trabalhoso; com mapa é o uso mais natural que existe: a **chave** é o que se conta, o **valor** é a contagem.

~~~java
String[] votos = {"azul", "verde", "azul", "roxo", "azul"};
HashMap<String, Integer> contagem = new HashMap<>();

for (String cor : votos) {
    if (contagem.containsKey(cor)) {
        contagem.put(cor, contagem.get(cor) + 1);
    } else {
        contagem.put(cor, 1);
    }
}

System.out.println(contagem);
~~~

~~~text
{azul=3, roxo=1, verde=1}
~~~

Leia devagar: na primeira vez que uma cor aparece ela **não está** no mapa, então entra com 1. Nas vezes seguintes, o valor que já existe é somado com 1.

## A versão curta

O \`getOrDefault\` da segunda lição encurta as quatro linhas para uma:

~~~java
for (String cor : votos) {
    contagem.put(cor, contagem.getOrDefault(cor, 0) + 1);
}
~~~

Quando a cor ainda não existe, \`getOrDefault(cor, 0)\` devolve 0 e a soma dá 1. Quando existe, devolve a contagem atual. Mesma lógica, sem o \`if\`.

> Este padrão — *ler com padrão, somar, guardar de volta* — resolve contagem, agrupamento, soma por categoria e totalização por chave. Vale reconhecê-lo: ele aparece em praticamente todo sistema que produz relatório.

## Achando o campeão

Depois de contar, encontrar o maior é o "melhor até agora" do módulo de repetições, agora sobre um mapa:

~~~java
String campea = "";
int maior = 0;

for (Map.Entry<String, Integer> item : contagem.entrySet()) {
    if (item.getValue() > maior) {
        maior = item.getValue();
        campea = item.getKey();
    }
}

System.out.println(campea + " com " + maior);
~~~

~~~text
azul com 3
~~~

## E se houver empate?

Este código fica com o **primeiro** que atingiu o valor máximo — e como \`HashMap\` não garante ordem, "o primeiro" pode mudar entre execuções. Se o empate importar para a sua regra de negócio, trate explicitamente: guarde uma lista de campeões em vez de um só.`,
      exercises: [
        {
          id: 'ja-map-04-e1',
          lessonId: 'ja-map-04',
          prompt:
            'Complete a contagem em uma linha:\n\n~~~java\nfor (String cor : votos) {\n    contagem.put(cor, contagem.______(cor, 0) + 1);\n}\n~~~',
          starterCode: null,
          validationType: 'fill_blank',
          expectedAnswer: 'getOrDefault',
          hint: 'Precisa devolver 0 na primeira vez que a cor aparecer.',
          explanation:
            'Na primeira ocorrência, `getOrDefault(cor, 0)` devolve 0 e a soma grava 1. Nas seguintes devolve a contagem atual. É o padrão *ler com padrão, somar, guardar de volta*.',
          xpReward: 40,
          orderIndex: 1,
        },
        {
          id: 'ja-map-04-e2',
          lessonId: 'ja-map-04',
          prompt:
            'Ao procurar a chave de maior valor num `HashMap`, por que o resultado pode variar entre execuções em caso de empate?',
          starterCode: null,
          validationType: 'multiple_choice',
          options: [
            'HashMap não garante ordem, então "o primeiro a atingir o máximo" pode mudar',
            'Porque getValue() devolve valores aleatórios',
            'Porque o laço precisa ser um while',
            'Não varia: o HashMap sempre percorre em ordem alfabética',
          ],
          expectedAnswer:
            'HashMap não garante ordem, então "o primeiro a atingir o máximo" pode mudar',
          explanation:
            'Como a comparação é `>` estrita, quem chega primeiro fica com o posto — e a ordem de percurso de um `HashMap` não é garantida. Se o empate importa, guarde uma lista de campeões, ou use `LinkedHashMap`/`TreeMap` para ter ordem previsível.',
          xpReward: 40,
          orderIndex: 2,
        },
      ],
    },
  ],
};
