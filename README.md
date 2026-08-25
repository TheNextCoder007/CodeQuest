# 🎮 CodeQuest

**Uma plataforma gamificada para aprendizagem de programação.**
Projeto Integrador — Davi B. Tarquinio, Luiz A. S. P. Jr, Kauan F. Arruda.

O CodeQuest transforma o aprendizado introdutório de programação numa jornada estilo Duolingo: o
aluno escolhe uma linguagem, avança por módulos progressivos, resolve exercícios com feedback
imediato e acompanha sua evolução em XP, níveis, streak, conquistas e ranking.

A mesma base de código roda em **quatro formatos**:

| Formato | Tecnologia | Arquivo gerado |
| --- | --- | --- |
| 🌐 Site | Next.js na Vercel | — |
| 🤖 Android | Capacitor | `codequest.apk` |
| 🪟 Windows | Tauri | `CodeQuest_1.0.0_x64-setup.exe` |
| 🐧 Linux | Tauri | `.AppImage` e `.deb` |

Tudo **100% gratuito**: nenhum serviço usado exige cartão de crédito, e nada é publicado na Google
Play ou na Microsoft Store (que cobram taxa de desenvolvedor).

---

## 📑 Índice

1. [Rodando em 2 minutos](#1-rodando-em-2-minutos)
2. [Como o projeto está organizado](#2-como-o-projeto-está-organizado)
3. [Configurar o Supabase (banco + login)](#3-configurar-o-supabase-banco--login)
4. [Configurar o login com Google](#4-configurar-o-login-com-google)
5. [Publicar o site na Vercel](#5-publicar-o-site-na-vercel)
6. [Gerar o app Android (.apk)](#6-gerar-o-app-android-apk)
7. [Gerar o app Windows (.exe) e Linux](#7-gerar-o-app-windows-exe-e-linux)
8. [Builds automáticos com GitHub Actions](#8-builds-automáticos-com-github-actions)
9. [Como a gamificação funciona](#9-como-a-gamificação-funciona)
10. [Amigos e @username](#10-amigos-e-username)
11. [Tags, perfil público e foto](#11-tags-perfil-público-e-foto)
12. [Duelo 1v1 (PvP)](#12-duelo-1v1-pvp)
13. [Modo ranqueado (temporadas e patamares)](#13-modo-ranqueado-temporadas-e-patamares)
14. [Desafio diário](#14-desafio-diário)
15. [Aparecer no Google (SEO)](#15-aparecer-no-google-seo)
16. [Editar e criar conteúdo](#16-editar-e-criar-conteúdo)
17. [Decisões técnicas](#17-decisões-técnicas)
18. [Problemas comuns](#18-problemas-comuns)

---

## 1. Rodando em 2 minutos

Você precisa apenas do **Node.js 20 ou superior** ([nodejs.org](https://nodejs.org)).

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>.

> **Não precisa configurar nada para testar.** Sem as chaves do Supabase, o CodeQuest entra em
> **modo demonstração**: você cria uma conta com qualquer e-mail/senha e todo o progresso fica salvo
> no próprio navegador (`localStorage`). Trilhas, exercícios, XP, streak, conquistas e ranking
> funcionam normalmente. É o modo ideal para desenvolver e para apresentar o projeto sem internet.

Para ligar a nuvem (contas reais, progresso sincronizado entre celular/PC/site), siga a
[seção 3](#3-configurar-o-supabase-banco--login).

### Comandos disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção do site |
| `npm run build:static` | Gera a pasta `out/` (usada pelo `.apk` e pelo `.exe`) |
| `npm run typecheck` | Confere os tipos do TypeScript |
| `npm run content:check` | Valida a estrutura do currículo (ids, ordens, alternativas) |
| `npm run content:verify-python` | Roda as soluções de referência no Python real e compara com as saídas esperadas |
| `npm run content:verify-js` | O mesmo para JavaScript, usando o runtime de produção (`public/js-runtime.js`) |
| `npm run test:amigos` | Testa o fluxo de amizades (busca, pedido, aceite, remoção, ranking) |
| `npm run test:tags` | Testa as tags, os segredos e as regras do @username |
| `npm run test:pvp` | Joga uma partida 1v1 num Postgres real e testa as tentativas de trapaça |
| `npm run test:desafios` | Desafio diário: sorteio determinístico, XP pago uma vez só e RLS |
| `npm run test:ranqueado` | Testa a escada de patamares, o elo, as temporadas e os bots num Postgres real |
| `npm run test:seo` | Confere sitemap, robots.txt e as meta tags do build |
| `npm run og:gen` | Regera a imagem de prévia do link (`public/og.jpg`) |
| `npm run test:progresso` | Garante que falha de leitura nunca vira progresso zerado |
| `npm run test:migrations` | Aplica as migrations 3× num Postgres real e confere que nada é apagado |
| `npm run seed:gen` | Regera `supabase/seed.sql` a partir do currículo |
| `npm run cap:sync` | Prepara o projeto Android com a versão mais recente |
| `npm run android:apk` | Compila o `.apk` (Windows) |
| `npm run tauri:dev` | Abre o app de desktop em modo desenvolvimento |
| `npm run tauri:build` | Compila o `.exe` / `.AppImage` / `.deb` |

---

## 2. Como o projeto está organizado

```
CodeQuest/
├── src/
│   ├── app/                      # rotas (Next.js App Router)
│   │   ├── page.tsx              # / .............. landing page
│   │   ├── login/                # /login
│   │   ├── cadastro/             # /cadastro
│   │   ├── auth/callback/        # retorno do Google no navegador
│   │   ├── dashboard/            # /dashboard ..... visão geral do aluno
│   │   ├── trilha/[linguagem]/   # /trilha/python . mapa de módulos
│   │   ├── licao/[id]/           # /licao/py-cond-02 teoria + exercícios
│   │   ├── perfil/               # /perfil ........ dados, @username e conquistas
│   │   ├── amigos/               # /amigos ........ busca, pedidos e lista
│   │   ├── usuario/              # /usuario?u=... . perfil público de outra pessoa
│   │   ├── duelo/                # /duelo?m=...... a partida em si (1v1 e ranqueada)
│   │   ├── ranqueado/            # /ranqueado ..... patamar, temporada e início da partida
│   │   └── ranking/              # /ranking ....... leaderboard global e de amigos
│   ├── components/               # UI reutilizável (cards, editor, toasts…)
│   ├── content/                  # 📚 O CURRÍCULO (fonte da verdade)
│   │   ├── python/01-fundamentos.ts … 07-projeto-final.ts
│   │   ├── javascript/01-fundamentos.ts … 07-projeto-final.ts
│   │   └── achievements.ts
│   └── lib/                      # regras de negócio
│       ├── auth/                 # sessão, Google OAuth, deep link
│       ├── friends.ts            # amizades, busca e ranking entre amigos
│       ├── username.ts           # regras do @username
│       ├── player/               # XP, progresso, conquistas
│       ├── tags.ts               # regras das tags de perfil
│       ├── pvp/                  # duelo 1v1: regras, chamadas ao banco e modo demo
│       ├── ranked/               # ranqueada: patamares, elo, temporadas e bots
│       ├── runtime/              # gerenciador de worker (timeout, recriação)
│       ├── python/               # ponte com o Pyodide
│       ├── javascript/           # ponte com o worker de JavaScript
│       ├── exercises/            # validação das respostas e escolha do motor
│       ├── gamification.ts       # nível, streak, critérios de conquista
│       └── progression.ts        # regras de desbloqueio da trilha
├── public/pyodide-worker.js      # executa o Python do aluno (Web Worker)
├── public/js-worker.js           # executa o JavaScript do aluno (Web Worker)
├── public/js-runtime.js          # console.log, prompt e erros — usado pelo worker E pelos testes
├── supabase/
│   ├── migrations/0001_init.sql  # tabelas + RLS + gatilhos
│   ├── migrations/0002_amigos.sql # @username + amizades + RLS
│   ├── migrations/0003_protecao_progresso.sql # travas contra perda de XP
│   ├── migrations/0004_perfis_publicos.sql # tags, perfil público, avatar
│   ├── migrations/0005_pvp.sql   # duelo 1v1 (perguntas, partidas, placar)
│   ├── migrations/0006_ranqueado.sql # temporadas, elo, patamares, bots
│   ├── migrations/0007_embaralhar_alternativas.sql # ordem sorteada por exibição
│   ├── migrations/0008_desafios_diarios.sql # um exercício por dia, igual para todos
│   ├── diagnostico.sql           # consultas de conferência (só leitura)
│   └── seed.sql                  # conteúdo das trilhas (GERADO)
├── android/                      # projeto Android (Capacitor)
├── src-tauri/                    # projeto desktop (Tauri)
├── scripts/                      # geração de seed e verificação do conteúdo
└── .github/workflows/            # CI e geração dos instaladores
```

### Trilhas disponíveis

Duas trilhas completas, com a mesma estrutura de sete módulos.

**🐍 Python**

| # | Módulo | Lições | Exercícios |
| --- | --- | --- | --- |
| 01 | 🐣 Fundamentos | 5 | 10 |
| 02 | 📦 Variáveis | 4 | 8 |
| 03 | 🔀 Condicionais | 4 | 8 |
| 04 | 🔁 Repetições | 4 | 8 |
| 05 | ⚙️ Funções | 3 | 6 |
| 06 | 🧩 Desafios | 3 | 3 |
| 07 | 🏆 Projeto Final | 1 | 3 |
| | **Total** | **24** | **46** |

**🟨 JavaScript**

| # | Módulo | Lições | Exercícios | Assuntos próprios da linguagem |
| --- | --- | --- | --- | --- |
| 01 | 🐣 Fundamentos | 5 | 10 | ponto e vírgula automático, tipos de erro |
| 02 | 📦 Variáveis | 4 | 8 | `let`/`const`/`var`, template literals, `NaN` |
| 03 | 🔀 Condicionais | 4 | 9 | `switch`, **`==` vs `===`**, truthy/falsy |
| 04 | 🔁 Repetições | 4 | 8 | `for...of` vs `for...in`, arrays |
| 05 | 🧩 Funções | 4 | 8 | **arrow functions**, escopo de bloco |
| 06 | 🏆 Desafios | 3 | 6 | métodos de texto, **`map`/`filter`/`reduce`** |
| 07 | 🚀 Projeto Final | 2 | 5 | objetos e array de objetos |
| | **Total** | **26** | **54** | |

A teoria da trilha de JavaScript foi escrita do zero, não traduzida da de Python: o que ganha
espaço é justamente o que a linguagem tem de próprio (a coerção do `+`, os oito valores falsy, a
diferença entre `map` e um `for`). Onde o conceito é o mesmo, o bloco poliglota mostra as três
sintaxes lado a lado.

Java, C# e C++ já existem no catálogo e no banco, mas sem conteúdo populado — é só escrever os
módulos, sem mexer em código.

---

## 3. Configurar o Supabase (banco + login)

O Supabase dá um Postgres gerenciado + autenticação no plano gratuito, **sem cartão de crédito**.

### 3.1 Criar o projeto

1. Acesse <https://supabase.com> e clique em **Start your project**. Entre com sua conta do GitHub.
2. **New project**:
   - **Name**: `codequest`
   - **Database Password**: gere uma e guarde (você não vai precisar dela no dia a dia)
   - **Region**: `South America (São Paulo)` — mais perto, mais rápido
   - **Plan**: **Free**
3. Espere uns 2 minutos até o projeto ficar verde.

### 3.2 Criar as tabelas

1. No menu lateral, abra **SQL Editor** → **New query**.
2. Copie **todo** o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), cole e clique em **Run**.
3. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0002_amigos.sql`](supabase/migrations/0002_amigos.sql) e rode.
   Esse arquivo cria o campo `@username` e o sistema de amigos (ver [seção 10](#10-amigos-e-username)).
4. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0003_protecao_progresso.sql`](supabase/migrations/0003_protecao_progresso.sql) e rode.
   Esse arquivo adiciona as travas que impedem XP e progresso de serem rebaixados,
   além da função `reconciliar_xp()` que reconstrói o XP a partir das lições concluídas.
5. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0004_perfis_publicos.sql`](supabase/migrations/0004_perfis_publicos.sql) e rode.
   Esse arquivo cria as tags de perfil, o bucket de fotos e as regras do @username (ver [seção 11](#11-tags-perfil-público-e-foto)).
6. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0005_pvp.sql`](supabase/migrations/0005_pvp.sql) e rode.
   Esse arquivo cria o duelo 1v1 (ver [seção 12](#12-duelo-1v1-pvp)).
7. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0006_ranqueado.sql`](supabase/migrations/0006_ranqueado.sql) e rode.
   Esse arquivo cria o modo ranqueado — temporadas, elo e bots (ver [seção 13](#13-modo-ranqueado-temporadas-e-patamares)).
8. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0007_embaralhar_alternativas.sql`](supabase/migrations/0007_embaralhar_alternativas.sql) e rode.
   Esse arquivo faz o servidor **embaralhar as alternativas** de cada pergunta (ver [seção 12.6](#126-por-que-as-alternativas-são-embaralhadas-no-servidor)).
9. Abra outra query, cole **todo** o conteúdo de [`supabase/migrations/0008_desafios_diarios.sql`](supabase/migrations/0008_desafios_diarios.sql) e rode.
   Esse arquivo cria o **desafio diário** — um exercício por dia, igual para todo mundo (ver [seção 14](#14-desafio-diário)).
10. Abra mais uma query, cole **todo** o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) e rode também.
   Esse arquivo popula as 5 linguagens, 50 lições, 100 exercícios, 41 conquistas, 22 tags e 88 perguntas de duelo.

> Os nove scripts podem ser executados quantas vezes você quiser: eles usam
> `if not exists` / `on conflict do update` e não duplicam nem apagam nada.
> Isso não é só promessa: `npm run test:migrations` aplica todos eles **três vezes
> seguidas** num PostgreSQL de verdade e confere que o progresso de um aluno
> continua intacto.

Se em algum momento você desconfiar de que perdeu progresso, rode
[`supabase/diagnostico.sql`](supabase/diagnostico.sql) — ele só lê, e mostra
quantas lições e quanto XP cada conta tem registrado no banco.

Confira em **Table Editor** que apareceram as tabelas `profiles`, `languages`, `modules`,
`lessons`, `exercises`, `user_progress`, `achievements`, `user_achievements` e `friendships`.

### 3.3 Pegar as chaves

1. **Project Settings** (engrenagem) → **API Keys** (ou **Data API**).
2. Copie:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public** → uma chave longa começando com `eyJ...`
3. Na raiz do projeto, crie o arquivo `.env.local` (copie de `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEEP_LINK_SCHEME=codequest
```

4. Reinicie o `npm run dev`. O aviso amarelo de "modo demonstração" some — agora você está na nuvem.

> **A chave `anon` é pública de propósito** — ela vai para o navegador em qualquer app Supabase.
> A segurança vem das políticas de Row Level Security que o `0001_init.sql` cria: cada aluno só
> consegue escrever nas próprias linhas. **Nunca** use a chave `service_role` neste projeto.

### 3.4 (Opcional) Desativar a confirmação de e-mail

Por padrão o Supabase exige confirmar o e-mail antes do primeiro login. Para a apresentação do
projeto isso costuma atrapalhar. Para desligar:

**Authentication** → **Sign In / Providers** → **Email** → desmarque **Confirm email** → **Save**.

---

## 4. Configurar o login com Google

> **A boa notícia:** como o Supabase funciona como intermediário do OAuth, você precisa de
> **um único cliente OAuth do tipo "Aplicativo da Web"** — o mesmo serve para o site, para o `.apk`
> e para o `.exe`. Não é necessário criar clientes separados de Android/Desktop no Google Console
> (isso só seria preciso se usássemos o SDK nativo do Google Sign-In, com o SHA-1 do certificado).
> O que muda entre as plataformas é apenas **para onde o Supabase devolve o usuário no final**, e
> isso se configura dentro do próprio Supabase.

### 4.1 Criar o cliente OAuth no Google Cloud Console

1. Acesse <https://console.cloud.google.com> (é gratuito, não pede cartão).
2. No topo, **Selecionar projeto** → **Novo projeto** → nome `CodeQuest` → **Criar**.
3. Menu ☰ → **APIs e serviços** → **Tela de permissão OAuth**:
   - **Tipo de usuário**: `Externo` → **Criar**
   - **Nome do app**: `CodeQuest`
   - **E-mail de suporte** e **e-mail do desenvolvedor**: o seu
   - Avance até o fim e **Salvar**
   - Em **Público-alvo**, clique em **Adicionar usuários de teste** e inclua os e-mails do grupo
     (enquanto o app está em modo "Teste", só esses e-mails conseguem entrar — para a apresentação
     é suficiente e evita o processo de verificação do Google)
4. Menu ☰ → **APIs e serviços** → **Credenciais** → **Criar credenciais** → **ID do cliente OAuth**:
   - **Tipo de aplicativo**: **Aplicativo da Web**
   - **Nome**: `CodeQuest Web`
   - **URIs de redirecionamento autorizados** → **Adicionar URI**, e cole **exatamente** o endereço
     de callback do seu projeto Supabase:

     ```
     https://SEU-PROJETO.supabase.co/auth/v1/callback
     ```

     (Troque `SEU-PROJETO` pelo identificador do seu projeto. Esse endereço aparece pronto no
     próprio Supabase, na tela do provedor Google — veja o passo 4.2.)
   - **Criar**
5. Copie o **ID do cliente** e a **Chave secreta do cliente**.

### 4.2 Ligar o Google no Supabase

1. No Supabase: **Authentication** → **Sign In / Providers** → **Google**.
2. Ative **Enable Sign in with Google**.
3. Cole o **Client ID** e o **Client Secret** do passo anterior.
4. Repare no campo **Callback URL (for OAuth)** — é exatamente o endereço que você cadastrou no
   Google. Se estiver diferente, corrija no Google Console.
5. **Save**.

### 4.3 Autorizar os endereços de retorno (a parte que faz o app funcionar)

Ainda no Supabase: **Authentication** → **URL Configuration**.

- **Site URL**: `https://seu-projeto.vercel.app` (ou `http://localhost:3000` enquanto desenvolve)
- **Redirect URLs** → adicione **todas** estas linhas:

```
http://localhost:3000/auth/callback/
https://seu-projeto.vercel.app/auth/callback/
codequest://auth-callback
```

| Linha | Para que serve |
| --- | --- |
| `localhost` | login com Google durante o desenvolvimento |
| endereço da Vercel | login com Google no site publicado |
| `codequest://auth-callback` | **login com Google dentro do `.apk` e do `.exe`** |

### 4.4 Como o deep link funciona nos apps empacotados

Dentro de um app empacotado não existe uma URL `https` para onde voltar. A solução é registrar um
**esquema de URL próprio** no sistema operacional:

1. o aluno toca em "Continuar com Google";
2. o app **abre o navegador do sistema** (`@capacitor/browser` no Android, `plugin-opener` no
   desktop) na página de login do Google;
3. o Google autentica e devolve para o Supabase, que redireciona para `codequest://auth-callback?code=...`;
4. o sistema operacional reconhece o esquema `codequest://` e **traz o CodeQuest de volta para a
   frente**, entregando a URL ao app;
5. o app extrai o `code` e troca por uma sessão (`exchangeCodeForSession`).

O registro do esquema já está feito no repositório:

- **Android** — [`android/app/src/main/AndroidManifest.xml`](android/app/src/main/AndroidManifest.xml),
  no `<intent-filter>` com `android:scheme="codequest"`;
- **Desktop** — [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json), em `plugins.deep-link.desktop.schemes`.

O tratamento no lado JavaScript está em
[`src/lib/auth/AuthProvider.tsx`](src/lib/auth/AuthProvider.tsx) (função `handleDeepLink`).

> **Se o Google no `.apk`/`.exe` der problema na sua apresentação**, o login por **e-mail e senha
> funciona nas quatro plataformas sem nenhuma configuração extra** — é o caminho garantido.

---

## 5. Publicar o site na Vercel

O plano **Hobby** da Vercel é gratuito e não pede cartão.

### 5.1 Subir o código para o GitHub

```bash
git init
git add .
git commit -m "CodeQuest: versão inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/codequest.git
git push -u origin main
```

### 5.2 Importar na Vercel

1. Acesse <https://vercel.com> e entre com o GitHub.
2. **Add New…** → **Project** → **Import** no repositório `codequest`.
3. A Vercel detecta o Next.js sozinha — **não altere** Build Command nem Output Directory.
4. Abra **Environment Variables** e adicione:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://SEU-PROJETO.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
| `NEXT_PUBLIC_SITE_URL` | `https://seu-projeto.vercel.app` |

5. **Deploy**. Em ~2 minutos o site está no ar.
6. Volte ao Supabase (**URL Configuration**) e cadastre o endereço real da Vercel, conforme a
   [seção 4.3](#43-autorizar-os-endereços-de-retorno-a-parte-que-faz-o-app-funcionar).

Daqui em diante, **todo `git push` na branch `main` republica o site automaticamente**.

> Não é necessário criar `vercel.json`: o projeto usa a configuração padrão do Next.js.

---

## 6. Gerar o app Android (.apk)

### 6.1 O que instalar (uma vez só)

| Ferramenta | Onde | Custo |
| --- | --- | --- |
| **Android Studio** | <https://developer.android.com/studio> | gratuito |
| **JDK 17** | vem junto com o Android Studio | gratuito |

Depois de instalar o Android Studio, abra-o uma vez e aceite o download do **Android SDK
Platform 34** (ele oferece sozinho na primeira execução, em *More Actions → SDK Manager*).

Confirme que a variável de ambiente `ANDROID_HOME` aponta para o SDK — normalmente
`C:\Users\SEU-USUARIO\AppData\Local\Android\Sdk` no Windows.

### 6.2 Compilar o APK

```bash
npm install
npm run build:static        # gera a pasta out/
npx cap sync android        # copia out/ para dentro do projeto Android
cd android
gradlew.bat assembleDebug   # no Linux/macOS: ./gradlew assembleDebug
```

Ou, em um comando só:

```bash
npm run android:apk         # Windows
npm run android:apk:unix    # Linux / macOS
```

**O arquivo sai em:**

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Copie esse `.apk` para o celular (cabo, Google Drive, WhatsApp Web…), abra e autorize
**"Instalar de fontes desconhecidas"**. O Android mostra um aviso porque o app não veio da Play
Store — isso é normal em distribuição direta e não impede a instalação.

### 6.3 Abrir no Android Studio (opcional)

```bash
npm run cap:open
```

Útil para rodar em um emulador ou depurar com o celular ligado por USB.

### 6.4 Gerar um APK assinado (release)

O APK de debug funciona perfeitamente para a apresentação. Se quiser um `.apk` de release:

```bash
keytool -genkey -v -keystore codequest.keystore -alias codequest \
        -keyalg RSA -keysize 2048 -validity 10000
```

Depois adicione em `android/app/build.gradle`, dentro de `android { }`:

```gradle
signingConfigs {
    release {
        storeFile file("../../codequest.keystore")
        storePassword "SUA_SENHA"
        keyAlias "codequest"
        keyPassword "SUA_SENHA"
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

e rode `gradlew.bat assembleRelease`. **Não versione o `.keystore` nem as senhas.**

---

## 7. Gerar o app Windows (.exe) e Linux

O Tauri usa a WebView já instalada no sistema, então o instalador fica em torno de **5 MB** — um
Electron equivalente passaria de 100 MB.

### 7.1 O que instalar (uma vez só)

**Windows:**

1. **Rust** — <https://rustup.rs> (baixe `rustup-init.exe`, execute, opção `1`)
2. **Visual Studio Build Tools** — <https://aka.ms/vs/17/release/vs_BuildTools.exe>
   Na instalação, marque a carga de trabalho **"Desenvolvimento para desktop com C++"**.
3. O **WebView2** já vem no Windows 10/11.

**Linux (Ubuntu/Debian):**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev libappindicator3-dev \
     librsvg2-dev patchelf build-essential file libssl-dev libgtk-3-dev
```

Confira a instalação com:

```bash
npx tauri info
```

### 7.2 Compilar

```bash
npm install
npm run tauri:build
```

O comando já gera o `out/` automaticamente antes de compilar (`beforeBuildCommand`).

**Os arquivos saem em:**

| Sistema | Caminho |
| --- | --- |
| Windows (instalador) | `src-tauri/target/release/bundle/nsis/CodeQuest_1.0.0_x64-setup.exe` |
| Windows (MSI) | `src-tauri/target/release/bundle/msi/CodeQuest_1.0.0_x64_en-US.msi` |
| Linux (AppImage) | `src-tauri/target/release/bundle/appimage/CodeQuest_1.0.0_amd64.AppImage` |
| Linux (Debian) | `src-tauri/target/release/bundle/deb/CodeQuest_1.0.0_amd64.deb` |

> A primeira compilação demora bastante (o Rust compila todas as dependências do zero, 5–15 min).
> As seguintes levam menos de um minuto.

**Executar o AppImage no Linux:**

```bash
chmod +x CodeQuest_1.0.0_amd64.AppImage
./CodeQuest_1.0.0_amd64.AppImage
```

> ⚠️ **O Tauri compila para o sistema onde ele está rodando.** Não dá para gerar o `.AppImage` a
> partir do Windows nem o `.exe` a partir do Linux. Se o grupo não tem as duas máquinas, use o
> GitHub Actions da próxima seção — ele compila os dois de graça.

### 7.3 Desenvolvimento

```bash
npm run tauri:dev
```

Abre a janela do desktop apontando para o servidor de desenvolvimento, com recarregamento
automático a cada alteração.

---

## 8. Builds automáticos com GitHub Actions

O repositório traz dois fluxos prontos, gratuitos em repositórios públicos:

| Arquivo | Quando roda | O que faz |
| --- | --- | --- |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | todo push | valida o currículo, roda os exercícios no Python real, checa tipos e compila o site |
| [`.github/workflows/build-apps.yml`](.github/workflows/build-apps.yml) | tags `v*` ou manualmente | gera `.exe`, `.msi`, `.AppImage`, `.deb` e `.apk` |

### 8.1 Configurar as variáveis (opcional, mas recomendado)

Sem isso os apps saem em modo demonstração. No GitHub:
**Settings** → **Secrets and variables** → **Actions** → aba **Variables** → **New repository variable**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### 8.2 Gerar os instaladores

**Publicando uma versão** (recomendado — os arquivos vão para a aba *Releases*):

```bash
git tag v1.0.0
git push origin v1.0.0
```

**Ou sob demanda:** aba **Actions** → **Gerar instaladores (Windows, Linux e Android)** →
**Run workflow**. Os arquivos aparecem em **Artifacts**, no rodapé da execução.

Em ~15 minutos você tem os três aplicativos prontos para baixar — sem precisar ter Windows, Linux
e Android Studio nas máquinas do grupo.

---

## 9. Como a gamificação funciona

Toda a lógica está em [`src/lib/gamification.ts`](src/lib/gamification.ts), isolada da interface e
fácil de auditar.

### XP e níveis

- cada exercício vale de **20 a 120 XP** (o desafio "maior de idade" vale **100 XP**, como no pitch);
- concluir uma lição soma o XP de todos os seus exercícios;
- refazer uma lição **não** dá XP de novo, mas mantém o streak vivo;
- **nível = XP ÷ 100 + 1** — simples e previsível. Nível 1 com 0 XP, nível 2 com 100 XP, e assim por diante.

### Streak

Comparando a data local do aluno com o último dia estudado:

| Situação | Resultado |
| --- | --- |
| já estudou hoje | streak não muda |
| último estudo foi ontem | streak **+1** |
| pulou um ou mais dias | streak volta para **1** |

O perfil mostra `0` quando a sequência já está quebrada, mesmo antes de o aluno voltar a estudar.

### Progressão bloqueada

Em [`src/lib/progression.ts`](src/lib/progression.ts):

- o **módulo** N só abre quando **todas** as lições do módulo N−1 estão concluídas;
- dentro de um módulo aberto, a **lição** N só abre quando a N−1 está concluída;
- a rota `/licao/[id]` também valida o bloqueio — não adianta digitar a URL direto.

### Conquistas

16 medalhas em [`src/content/achievements.ts`](src/content/achievements.ts): primeira lição, cada
módulo concluído, trilha completa, streaks de 3/7/30 dias, marcos de 500 e 1000 XP, e "Impecável"
(concluir uma lição acertando tudo de primeira). Elas são avaliadas a cada conclusão de lição e o
desbloqueio aparece como um cartão animado na tela.

### Ranking

Leaderboard por XP lendo `profiles`, com duas abas: **Global** (todos os estudantes) e **Amigos**
(só quem está na sua lista confirmada — ver [seção 10](#10-amigos-e-username)). A política de RLS
libera a **leitura** dos campos públicos para qualquer usuário autenticado, mas a **escrita**
continua restrita ao dono da linha.

---

## 10. Amigos e @username

### 10.1 Os dois nomes do perfil

O CodeQuest tem **dois campos de identidade, independentes**:

| Campo | Para que serve | Regras |
| --- | --- | --- |
| **Nome de exibição** (`name`) | é o nome que aparece em destaque no perfil e no ranking | livre — pode ter espaços, acentos e maiúsculas (ex.: `TheNextOne`) |
| **Nome de usuário** (`username`) | identifica você na busca de amigos, mostrado como `@davi123` | único, sem espaços; de 3 a 20 caracteres, apenas `a-z`, `0-9` e `_` |

Os dois são editáveis a qualquer momento na tela de **Perfil**.

### 10.2 Quando o app pede o @username

O componente [`UsernameGate`](src/components/UsernameGate.tsx) envolve todas as telas autenticadas
e assume a tela inteira sempre que o perfil está sem `username`. Isso resolve os três casos com um
mecanismo só:

1. quem se cadastrou agora por e-mail e senha;
2. quem entrou pela primeira vez com o Google;
3. **quem já tinha conta antes deste recurso existir** — como a coluna nasce nula, essas contas
   caem na mesma tela no próximo login, sem precisar de nenhuma migração de dados.

A sugestão inicial vem do nome de exibição (`Davi Tarquinio` → `davitarquinio`), mas o campo fica
editável: a pessoa confirma o que quiser. Enquanto digita, o app consulta se o nome está livre e
mostra ✓ ou ✗ — e a garantia final é o índice único do banco, que devolve erro se duas pessoas
tentarem o mesmo nome ao mesmo tempo.

### 10.3 Como as amizades funcionam

A tabela `friendships` guarda **uma linha por par de pessoas**:

| Coluna | Significado |
| --- | --- |
| `user_id` | quem **enviou** o pedido |
| `friend_id` | quem **recebeu** o pedido |
| `status` | `pending` até ser aceito, depois `accepted` |

Um índice único sobre `(least(user_id, friend_id), greatest(user_id, friend_id))` impede duas
linhas para o mesmo par, inclusive em direções opostas.

O fluxo na tela **Amigos** (`/amigos`):

1. **buscar** pelo `@usuario` do colega (a busca ignora maiúsculas e o `@` inicial);
2. **enviar o pedido** — a amizade *não* é criada na hora, fica `pending`;
3. o colega vê o pedido em **Pedidos recebidos** e escolhe **Aceitar** ou **Recusar**;
4. depois de aceito, os dois aparecem em **Meus amigos**, com opção de **Remover**.

Detalhe de conveniência: se você enviar um pedido para alguém que **já tinha te convidado**, o app
aceita o pedido existente em vez de criar outro — como em qualquer rede social.

Recusar um pedido, cancelar um envio e desfazer uma amizade são a **mesma** operação: apagar a
linha. Assim a pessoa pode ser convidada de novo depois.

### 10.4 Ranking entre amigos

A tela de **Ranking** tem duas abas:

- **Global** — todos os estudantes da plataforma, por XP;
- **Amigos** — só você e seus amigos confirmados.

Quem ainda não tem amigos vê um convite para adicionar alguém, com atalho para `/amigos`, em vez de
uma lista vazia sem explicação.

### 10.5 Segurança (RLS)

As políticas estão em [`supabase/migrations/0002_amigos.sql`](supabase/migrations/0002_amigos.sql):

| Operação | Quem pode |
| --- | --- |
| `SELECT` | apenas as linhas em que você aparece (como remetente **ou** destinatário) |
| `INSERT` | só em nome próprio (`auth.uid() = user_id`) e sempre com `status = 'pending'` |
| `UPDATE` | **somente quem recebeu** o pedido, e apenas para `accepted` — o remetente não consegue aceitar o próprio pedido |
| `DELETE` | qualquer um dos dois lados |

Ou seja: ninguém enxerga nem mexe nas amizades alheias, mesmo chamando a API do Supabase por fora
do aplicativo.

### 10.6 No modo demonstração

Sem Supabase configurado, as amizades ficam no `localStorage` e funcionam entre as contas locais
criadas no mesmo dispositivo. Além delas existem três perfis de exemplo — `@ana_dev`, `@kauanfa` e
`@luizjr` — que **aceitam pedidos automaticamente** (não há ninguém do outro lado para responder),
e um deles envia um convite para a conta nova. Isso permite demonstrar os dois lados do fluxo na
apresentação, com um aparelho só.

O comando `npm run test:amigos` roda esse fluxo inteiro de forma automatizada.

---

## 11. Tags, perfil público e foto

### 11.1 Tags e raridade

Uma **tag** é um título exibido ao lado do nome. Diferente das conquistas (que são um checklist),
só uma tag fica visível por vez — e você escolhe qual, na tela de Perfil.

| Raridade | Cor | Vem de |
| --- | --- | --- |
| Comum | cinza | nível 5 |
| Raro | azul elétrico | nível 10, e duas secretas |
| Épico | violeta | nível 20, trilha de Python concluída, uma secreta |
| Mítico | rosa | nível 30, uma secreta |
| Lendário | dourado com brilho | nível 50 |
| **Desenvolvedor** | gradiente da marca | concedida à mão no banco |

As definições estão em [`src/content/tags.ts`](src/content/tags.ts) e vão para o banco pelo
`supabase/seed.sql` (gerado por `npm run seed:gen`).

### 11.2 Tags secretas — o que desbloqueia cada uma

Estão documentadas em código (constante `SEGREDOS`) e aqui, de propósito: segredo que ninguém
consegue descobrir vira bug, não surpresa. **Cada uma também concede uma conquista.**

| Tag | Raridade | Como desbloquear |
| --- | --- | --- |
| 🕵️ Curioso | Raro | Clicar **10 vezes no logo** do cabeçalho, com menos de 1,5 s entre um clique e outro |
| ⚡ Relâmpago | Épico | Concluir uma lição em **menos de 30 segundos** a partir do momento em que a tela de desafios abre — e sem errar nenhum exercício |
| 🦉 Coruja | Raro | Concluir uma lição **entre 00h00 e 04h59** no horário do próprio aparelho |
| 💎 Impecável | Mítico | Concluir **5 lições** sem errar nenhum exercício em nenhuma delas |

Enquanto não são descobertas, elas aparecem mascaradas na galeria ("Tag secreta") e as conquistas
correspondentes também — mostrar a descrição entregaria a solução.

### 11.3 A tag de Desenvolvedor

Ela **não pode ser conquistada jogando**: depende da coluna `profiles.is_developer`, e o gatilho
`guard_profile_update` recusa qualquer tentativa de ligá-la pelo aplicativo. Para conceder à sua
conta, rode no **SQL Editor** do Supabase:

```sql
select public.definir_desenvolvedor('seu_username', true);
```

Isso liga o selo e já entrega a tag. Para tirar, use `false`. A função tem `revoke` para `public` e
`authenticated`: só funciona pelo painel do Supabase.

### 11.4 Perfil público

Qualquer pessoa logada pode ver o perfil de outra, de duas formas:

- clicando no nome na tela de **Ranking**;
- pela busca da tela de **Amigos** (o nome no resultado leva ao perfil).

O endereço é `/usuario/?u=<username>`. A busca vai na *query string*, e não em `/u/<username>`,
porque o app é exportado como site estático para caber no `.apk` e no `.exe` — e nesse modo o Next
precisa conhecer todos os caminhos no build, o que é impossível com nome de usuário.

O perfil público mostra nome, @username, avatar, nível, XP, streak, a tag exibida, as tags
conquistadas, as conquistas e a posição no ranking global. **Não mostra e-mail** — ele nem existe na
tabela `profiles`, mora só em `auth.users`, que nenhum cliente consegue ler.

### 11.5 Pódio do ranking global

A posição é calculada na hora (`count(*) where xp_total > o meu`), então o pódio se ajusta sozinho
conforme entra gente nova — nada é fixado à mão. Quem está em 1º, 2º ou 3º ganha uma moldura no
avatar (ouro, prata, bronze) com a medalha correspondente.

### 11.6 Foto de perfil

A imagem é cortada em quadrado, reduzida para **256×256** e recomprimida em WebP **no navegador**,
antes de subir — uma foto de celular tem 3-6 MB e viraria poucos milhares de fotos no limite
gratuito de 1 GB do Supabase Storage; depois do tratamento cada uma fica em 20-40 KB.

O caminho no bucket é sempre `avatars/<seu-id>/avatar.webp`, e a policy do Storage exige que a
primeira pasta seja o id de quem está enviando — ninguém sobrescreve a foto de outra pessoa. Sem
foto, continua valendo a inicial do nome sobre o gradiente da marca.

### 11.7 Regras do @username

- **Troca a cada 24 horas.** A primeira escolha é livre e *não* inicia a contagem (dá para corrigir
  um erro de digitação na hora); o relógio começa na primeira troca de verdade.
- **A regra é do banco**, não da tela: o gatilho `guard_profile_update` recusa a troca antecipada
  mesmo que alguém chame a API do Supabase por fora.
- **Filtro de palavrão**, deliberadamente curto e direto
  ([`src/content/palavras-bloqueadas.ts`](src/content/palavras-bloqueadas.ts), espelhado na função
  `username_proibido` do banco). Palavra curta só bloqueia quando é o nome inteiro ou um pedaço
  separado — senão `cu` barraria `curioso`, `escuro` e `documento`, e `puta` barraria `disputa` e
  `reputacao`. Disfarce com número (`s3x0`) **passa de propósito**: filtro agressivo erra mais do
  que acerta. O teste `npm run test:tags` compara a lista do código com a do banco e falha se elas
  saírem de sincronia.

---

## 12. Duelo 1v1 (PvP)

Duelo cronometrado entre amigos: **5 perguntas**, quem acerta mais — e mais rápido — vence.

### 12.1 Formato das perguntas, e por quê

São **múltipla escolha** e **completar um trecho curto de código**. Os exercícios da trilha ficaram
de fora de propósito: quase todos são do tipo `output_match`, que exige rodar Python de verdade para
corrigir. Num duelo isso significaria carregar o Pyodide (uns 6 MB) antes de cada partida e — pior —
deixar a correção no cliente, onde ela pode ser burlada.

Os dois formatos escolhidos se conferem com uma comparação de texto, o que permite manter o gabarito
dentro do banco de dados e corrigir no servidor. São **88 perguntas** em
[`src/content/pvp-questions.ts`](src/content/pvp-questions.ts), divididas em 6 temas:

| Tema | Perguntas |
| --- | --- |
| 🟨 JavaScript | 40 |
| 🐍 Python | 12 |
| ☕ Java | 10 |
| 🧠 Lógica | 10 |
| 🎯 C# | 8 |
| ⚡ C++ | 8 |

O bloco de JavaScript cresceu de 12 para 40 junto com a trilha, cobrando o que ela ensina — `===`,
truthy/falsy, `map`/`filter`/`reduce`, escopo. `npm run content:check` recusa qualquer tema com
menos de 5 perguntas, que é o mínimo para uma partida não repetir.

### 12.2 Pontuação

| Situação | Pontos |
| --- | --- |
| Errou, ou estourou os 20 s | 0 |
| Acertou | 100 + bônus de velocidade |

O bônus começa em 100 e cai 1 ponto a cada 200 ms — responder na hora vale 200; aos 20 s, 0. O tempo
é medido **pelo banco** (do instante em que a pergunta é entregue até o instante da resposta): tempo
informado pelo cliente seria trivial de falsificar, então ele nem existe na API.

### 12.3 Como a validação no servidor funciona

O app é 100% client-side — não há um servidor nosso entre o navegador e o banco. Então "validar no
servidor" aqui significa **validar dentro do PostgreSQL**
([`0005_pvp.sql`](supabase/migrations/0005_pvp.sql)):

- `pvp_questions` **não tem policy nenhuma**. Com RLS ligado, nenhum cliente lê a tabela — nem o
  gabarito, nem o resto.
- As tabelas da partida não têm policy de INSERT/UPDATE. A única forma de escrever nelas é pelas
  funções `security definer`, que conferem quem está chamando.
- `pvp_pergunta()` devolve enunciado e alternativas, **nunca a resposta**. O gabarito só volta depois
  que a resposta chega, em `pvp_responder()`.
- O vencedor e o placar são calculados por `pvp_finalizar()`. O cliente não envia pontuação — ele
  pergunta qual foi o resultado.

`npm run test:pvp` joga uma partida inteira num PostgreSQL real e tenta trapacear de várias formas
(responder duas vezes, pular pergunta, aceitar o próprio convite, espiar partida alheia, escrever nas
estatísticas). Também compara a pontuação em SQL com a versão em TypeScript, entrada por entrada.

> **Limite honesto:** o banco de perguntas também existe em TypeScript, porque o modo demonstração
> precisa jogar offline dentro do `.apk`/`.exe`. Ele fica num *chunk* separado, que o app online
> nunca baixa — mas quem for atrás consegue lê-lo. Isso permite **saber** as respostas de antemão;
> não permite **forjar** vitória, placar ou estatística, que continuam sendo decididos pelo banco.

### 12.4 Amigos online e convite

A tela de **Amigos** mostra uma bolinha verde em quem está com o app aberto, usando o **Presence** do
Supabase Realtime — o estado vive só enquanto a aba existir e some sozinho quando ela fecha, sem
tabela, sem escrita no banco e sem faxina agendada.

Quem enviou o convite pode **cancelar** enquanto o outro não responde — o botão fica na lista
"Duelos em andamento". Depois que a partida começa o botão some: aí desistir seria fugir de uma
derrota, e quem recusa isso é o servidor (`pvp_cancelar`), não a tela.

Ao lado de cada amigo há o botão **Duelar**, que abre a escolha do tema e envia o convite. O convite
chega em tempo real numa faixa no topo (em qualquer tela) com **Aceitar** / **Recusar**. Só é
possível convidar **amigos confirmados**, e só há um convite por dupla de cada vez.

### 12.5 Estatísticas, tags e conquistas

O perfil (próprio e público) mostra vitórias, derrotas, empates, partidas, pontos somados,
aproveitamento e tema favorito. Os números vêm de `pvp_stats`, escrita **só** por `pvp_finalizar()`.

| Tag | Raridade | Critério |
| --- | --- | --- |
| 🗡️ Estreante | Comum | 1 vitória |
| ⚔️ Duelista | Raro | 10 vitórias |
| 🎓 Especialista | Épico | 10 vitórias no mesmo tema |
| 🛡️ Gladiador | Épico | 25 vitórias |
| 🔥 Implacável | Mítico | 50 vitórias |
| 💀 Imortal | Lendário | 100 vitórias |

E quatro conquistas acompanham os marcos (1, 10, 50 e 100 vitórias).

### 12.6 Por que as alternativas são embaralhadas no servidor

O banco de perguntas foi escrito com a resposta certa **sempre na primeira posição** — 49 de 49.
Enquanto as alternativas eram entregues na ordem gravada, dava para vencer um duelo inteiro
clicando cinco vezes na opção de cima, sem ler nada.

A correção está em [`0007_embaralhar_alternativas.sql`](supabase/migrations/0007_embaralhar_alternativas.sql),
dentro de `pvp_pergunta`. Embaralhar no cliente não resolveria: bastaria abrir a aba de rede do
navegador e ler a resposta da API **antes** de o JavaScript embaralhar — a primeira da lista
continuaria sendo a certa.

A ordem sorteada é gravada em `match_answers.alternativas`, uma linha por
**(partida, jogador, pergunta)**. Isso dá duas propriedades:

- **cada exibição tem a sua ordem** — a mesma pergunta caindo em outra partida, ou para o outro
  jogador da mesma partida, é embaralhada de novo, de forma independente;
- **recarregar a página devolve a mesma ordem** — sem isso, com o cronômetro correndo, as
  alternativas dançariam embaixo do dedo de quem está respondendo.

**A conferência da resposta não precisou mudar**, e vale entender por quê: ela nunca dependeu de
posição. O cliente envia o **texto** da alternativa escolhida, e `pvp_responder` compara esse texto
com o gabarito. Como não existe "índice da resposta certa" guardado em lugar nenhum, não há como
uma exibição se confundir com outra — as duas comparam contra o mesmo gabarito, e a ordem em que as
opções apareceram é irrelevante para a correção.

`npm run test:pvp` entrega a mesma pergunta 40 vezes e confere que o gabarito passa por **todas** as
posições, que nenhuma alternativa some ou apareça do nada, que reentregar a mesma exibição devolve a
mesma ordem, e que responder com o texto certo continua acertando em todas as 40.

> **Na trilha o problema era o mesmo** (15 de 15 exercícios com a resposta na primeira posição), mas
> a correção é de outra natureza: a lição roda 100% offline e o gabarito já viaja no pacote do app,
> então não há segredo a proteger — embaralhar ali é questão de ensino, e acontece no
> [`ExercisePlayer`](src/components/exercise/ExercisePlayer.tsx). A ordem sai de uma semente
> guardada em estado (e não de um `Math.random()` solto no render), para nunca reordenar as opções
> enquanto a pessoa responde.

### 12.7 No modo demonstração

Sem Supabase não existe ninguém do outro lado, então a partida roda contra um **adversário simulado**
com perfil configurável de acerto e velocidade ([`src/lib/pvp/local.ts`](src/lib/pvp/local.ts)) — que
usa exatamente a mesma pontuação do servidor. A tela avisa isso antes de começar.

---

## 13. Modo ranqueado (temporadas e patamares)

O duelo da [seção 12](#12-duelo-1v1-pvp) é contra um amigo, quando dá. O ranqueado é a versão
competitiva dele: sempre disponível, valendo **elo**, com uma escada de patamares no estilo
Brawl Stars e temporada que zera a cada 15 dias.

A partida em si é a mesma — 5 perguntas cronometradas, mesma pontuação, mesma tela. O que muda
é o que acontece **depois** dela.

### 13.1 A escada

São **7 patamares**, 19 divisões no total. Os seis primeiros têm 3 sub-níveis; **Mestre é um só**,
sem sub-níveis, e é o topo absoluto:

| Patamar | Divisões | Elo | Vitória | Derrota |
|---|---|---|---|---|
| 🥉 Bronze 1–3 | 0–2 | 0–299 | +40 | −10 |
| 🥈 Prata 1–3 | 3–5 | 300–599 | +35 | −12 |
| 🥇 Ouro 1–3 | 6–8 | 600–899 | +30 | −15 |
| 💎 Diamante 1–3 | 9–11 | 900–1199 | +25 | −18 |
| 🔮 Mítico 1–3 | 12–14 | 1200–1499 | +20 | −20 |
| 👑 Lendário 1–3 | 15–17 | 1500–1799 | +15 | −22 |
| 🏅 **Mestre** | 18 | 1800+ | +10 | −25 |

Cada divisão custa **100 de elo**, sempre. Quem faz a subida ficar mais lenta lá em cima não é o
tamanho da divisão — é o ganho por vitória, que cai de 40 para 10. Na prática: subir de Bronze 1
para Bronze 2 leva **3 vitórias**; de Lendário 2 para Lendário 3 leva **7**. É a mesma curva do
Brawl Stars, mas com uma vantagem: a tela consegue dizer "faltam 60 de 100", que é muito mais fácil
de entender do que "faltam 2 vitórias e meia".

Duas regras que existem para a coisa não ficar frustrante:

- **O patamar conquistado não se perde.** Uma vez em Ouro 1 (600 de elo), você não volta para
  Prata por mais que perca — o elo trava no piso do patamar. Você só anda para trás dentro do
  próprio patamar.
- **Empate não mexe no elo.** Num duelo de 5 perguntas cronometradas o empate é raro (precisa dar
  a mesma pontuação até o bônus de velocidade), e punir um resultado que ninguém controla só
  geraria reclamação.

**Mestre é o teto da escada, e não tem sub-níveis.** Chegar lá (1800 de elo) é o fim da
progressão: não existe "Mestre 2" para alcançar. O elo continua subindo e descendo dentro do
Mestre, porque é ele que define a sua posição no leaderboard — mas a divisão trava em 18.

### 13.2 O que cai em cada patamar

**O jogador não escolhe o assunto da partida ranqueada.** Escolher o assunto seria escolher a
dificuldade: todo mundo jogaria só no que já domina, e a escada deixaria de medir o que se propõe a
medir. Quem decide é o patamar:

| Patamar | Assuntos sorteados |
|---|---|
| Bronze 1 → Diamante 3 | 🐍 Python · 🧠 Lógica · 🟨 JavaScript |
| Mítico 1 → Mestre | as **seis** linguagens (+ ☕ Java, 🎯 C#, ⚡ C++) |

A ideia é que a ranqueada acompanhe a trilha. Python e JavaScript já estão prontas, então os
patamares de baixo cobram o que o aluno de fato estudou; do Mítico para cima o jogo passa a exigir
repertório além da trilha — e isso é parte da dificuldade.

Isso vive no servidor, em [`ranked_temas()`](supabase/migrations/0006_ranqueado.sql):
`ranked_iniciar()` **não aceita parâmetro de tema**, então nem chamando a função na mão dá para
pedir "só Python" quando se está no Mítico. O duelo com amigo continua com tema escolhido — lá a
graça é justamente combinar o assunto com a outra pessoa.

> **Nota:** o banco tem 88 perguntas, sendo 40 de JavaScript e 12 de Python. Java, C# e C++
> continuam pequenos, então a repetição hoje se concentra do Mítico para cima. Ele cresce junto
> com as trilhas novas.

### 13.3 Temporadas

A temporada dura **15 dias corridos**. No fim, todo mundo volta para Bronze 1 e uma nova começa.

Não existe tarefa agendada fazendo isso, de propósito: cron é um serviço que o plano gratuito não
garante. A virada é **preguiçosa** — a primeira pessoa que abre a tela de ranqueada depois do prazo
é quem cria a temporada seguinte (`ranked_temporada_atual()`). As temporadas se encaixam sem
buraco (a seguinte começa exatamente onde a anterior terminou), então ficar duas semanas sem abrir
o app não bagunça a contagem: quando alguém voltar, o sistema pula quantas temporadas forem
necessárias de uma vez.

O reset **não apaga nada**. O elo é guardado por `(temporada, jogador)`, então na temporada nova a
pessoa simplesmente ainda não tem linha — e quem não tem linha está em Bronze 1 com 0 de elo. As
linhas antigas ficam onde estão, e são elas o histórico: o perfil mostra "Temporadas passadas" com
o patamar mais alto que você alcançou em cada uma.

### 13.4 Os bots

Enquanto o CodeQuest não tiver gente ranqueada suficiente para formar dupla na hora, a partida é
contra um adversário da casa. Ele não tem inteligência nenhuma — responde com uma taxa de acerto e
uma faixa de tempo sorteadas —, mas **fica mais difícil a cada patamar**:

| Patamar | Bot | Acerta | Responde em |
|---|---|---|---|
| Bronze | Bit | 45% | 5,0s – 14,0s |
| Prata | Loop | 55% | 4,5s – 12,0s |
| Ouro | Nullptr | 65% | 4,0s – 11,0s |
| Diamante | Kernel | 72% | 3,5s – 9,5s |
| Mítico | Daemon | 80% | 3,0s – 8,0s |
| Lendário | Overflow | 88% | 2,5s – 6,5s |
| Mestre | Root | 94% | 1,8s – 5,0s |

Os nomes são termos de programação de propósito: deixa claro que é um adversário da casa, sem
fingir ser uma pessoa.

O bot **joga no servidor**. A dificuldade dele é escolhida pelo banco a partir do seu patamar e
fica gravada na partida; cada resposta é sorteada por um gatilho no PostgreSQL, no momento em que
você responde a mesma pergunta. O aplicativo não sorteia nada e não escolhe contra quem joga.

**Trocar bot por gente de verdade depois:** a conta de elo não sabe que existe bot. Ela recebe só
"venceu, perdeu ou empatou" (`ranked_aplicar_resultado`), e a partida ranqueada é uma linha comum
em `matches`, com `modo = 'ranqueado'`. Para trocar por duelo entre dois humanos ranqueados basta
preencher `guest_id` em vez de `bot_nome` na criação da partida — `pvp_finalizar` já aplica elo aos
dois lados quando os dois existem. Nada de patamar, temporada ou histórico precisa ser reescrito.

### 13.5 Como a validação no servidor funciona

Mesma regra da Fase 3: o app é 100% client-side, então "validar no servidor" quer dizer **validar
dentro do PostgreSQL** ([`0006_ranqueado.sql`](supabase/migrations/0006_ranqueado.sql)).

- **O elo nunca é enviado pelo cliente.** Ele nem tem por onde: `ranked_stats` não tem uma única
  policy de `INSERT`, `UPDATE` ou `DELETE`. A única coisa que escreve lá é
  `ranked_aplicar_resultado`, que é `security definer` e está **revogada** de `authenticated`.
- **Quem decide o resultado é `pvp_finalizar`**, somando as respostas gravadas — não um placar
  enviado pelo aparelho.
- **As jogadas do bot não são legíveis** pelo cliente (`match_bot_answers` tem RLS ligado e zero
  policies): lê-las antes do fim entregaria o placar do adversário.
- **Não dá para escolher o assunto.** `ranked_iniciar()` não tem parâmetro de tema; os assuntos
  saem de `ranked_temas(patamar)`, dentro do banco.
- **Não dá para fugir de uma derrota.** `pvp_cancelar` recusa partida ranqueada; só existe uma
  partida aberta por vez; e quem fecha o app ganhando leva a derrota assim mesmo — passados 5
  minutos a partida é encerrada com o placar parcial, e o bot completa as respostas dele.

Isso tudo é testado, não prometido: `npm run test:ranqueado` sobe um PostgreSQL de verdade
(PGlite), joga partidas inteiras pelas mesmas funções que o app chama, tenta cada uma dessas
fugas, e confere por introspecção que nenhuma tabela de elo aceita escrita direta.

### 13.6 Leaderboard da temporada

Em **`/ranking`** há um seletor entre **XP** e **Ranqueada**, e cada um mantém as abas
**Global** e **Amigos** — as mesmas do ranking de XP.

São duas listas diferentes de propósito: XP responde "quem mais estudou" (esforço acumulado, nunca
zera) e Ranqueada responde "quem está jogando melhor agora" (patamar e elo da temporada corrente,
zera a cada 15 dias). Juntar as duas numa lista só não faria sentido.

Só aparece quem já jogou pelo menos uma partida ranqueada: uma lista com dezenas de contas
empatadas em Bronze 1 com zero partidas não é um ranking, é ruído. O desempate é por vitórias e
depois por nome, para a ordem ficar estável entre duas leituras.

A consulta é `ranked_ranking(escopo, limite)`, `security definer` — a aba "Amigos" filtra pelas
amizades confirmadas no próprio banco, e não no aparelho.

### 13.7 Conquistas

Uma conquista por **patamar alcançado** — "Alcançou Prata", "Alcançou Ouro", até "Alcançou
Mestre". São 6 (Bronze fica de fora: é onde todo mundo começa).

A escolha foi por patamar inteiro e não por sub-nível porque 19 divisões dariam 19 medalhas quase
iguais, e a lista de conquistas viraria uma planilha. Chegar a Ouro 1 já conta como "alcançou
Ouro".

Elas valem para sempre: a comparação usa o maior elo de **todas** as temporadas (`pico_historico`),
então o reset de 15 dias não apaga a medalha.

**A ranqueada não conta no cartel de duelos 1v1.** Vencer o bot não entra em `pvp_stats`, e por
isso não conta para as tags de duelo — senão "Imortal — 100 vitórias" viraria uma tarde de farm.
Os dois cartéis são separados no perfil.

### 13.8 No modo demonstração

Sem Supabase, a temporada e o elo ficam guardados no próprio aparelho
([`src/lib/ranked/local.ts`](src/lib/ranked/local.ts)), com a mesma escada, os mesmos bots e a
mesma regra de uma partida por vez. As duas implementações da conta de elo (SQL e TypeScript) são
comparadas valor por valor por `npm run test:ranqueado` — se alguém mexer numa e esquecer da outra,
o teste quebra.

---

## 14. Desafio diário

Um exercício de código por dia, **o mesmo para todo mundo**, valendo **120 XP**. Não acumula: à
meia-noite ele é trocado e o de ontem não volta.

### 14.1 De onde vem o exercício

Não existe um banco separado de desafios: o exercício sai da própria trilha, do conjunto que
[`desafio_pool()`](supabase/migrations/0008_desafios_diarios.sql) define. Foi a escolha mais barata
e a mais sustentável — cada exercício novo entra no rodízio sozinho, e não há um segundo currículo
para manter em dia.

O pool tem duas regras, e as duas têm motivo:

- **só exercícios de código** (`output_match`), porque o desafio diário é para escrever programa,
  não para marcar alternativa;
- **sem o Projeto Final**, porque os exercícios dele são "Etapa 1", "Etapa 2", "Etapa 3" de um
  projeto único e não se sustentam soltos, fora da lição.

Hoje isso dá **54 exercícios**, entre Python e JavaScript.

> A alternativa seria sortear entre os exercícios que **aquele aluno** já desbloqueou. Ela foi
> descartada por contradizer o próprio pedido: se cada pessoa recebe um exercício diferente, não há
> como comparar com os amigos quem fez o desafio do dia.

### 14.2 Como o desafio troca de dia — sem cron

**Ninguém agenda nada.** A linha do dia é criada na primeira vez que alguém pergunta pelo desafio
naquele dia, dentro de `desafio_do_dia()`. É o mesmo padrão preguiçoso da virada de temporada da
ranqueada ([seção 13.3](#133-temporadas)), pelo mesmo motivo: o plano gratuito do Supabase não
garante execução agendada, e depender disso seria depender de algo que pode simplesmente não rodar.

A diferença é que aqui nem `while` é preciso. A temporada é uma sequência encadeada — a próxima
começa onde a anterior terminou —, então pular meses exige criar as do meio. O desafio diário não:
cada dia é independente, e a **data já diz qual é o exercício**.

~~~
posição = (dias desde 1970-01-01) × 7919  mod  (tamanho do pool)
~~~

7919 é primo e maior que o pool, então `mdc(7919, 54) = 1` e a sequência **percorre todos os 54
exercícios antes de repetir qualquer um**. Não há sorteio aleatório, e isso dá três propriedades:

1. duas pessoas que abrem o app no mesmo instante, com a linha do dia ainda não criada, calculam o
   **mesmo** exercício — a corrida entre elas não tem como produzir desafios diferentes (e o
   `on conflict do nothing` cuida da segunda inserção);
2. dá para saber qual foi o desafio de qualquer dia passado sem consultar o banco, o que ajuda a
   investigar um problema;
3. se o app ficar uma semana sem ser aberto, simplesmente não existem linhas daqueles dias — e não
   faz falta, porque um desafio que ninguém jogou não precisa existir.

**O dia vira à meia-noite de Brasília**, e não no fuso do aparelho. Se cada um virasse no próprio
fuso, "o desafio de hoje" seria coisas diferentes ao mesmo tempo e comparar com amigos perderia o
sentido. Quem decide é `desafio_hoje()`, no banco — a data nunca vem do cliente.

### 14.3 O que o cliente não consegue fazer

| Tentativa | Por que não funciona |
| --- | --- |
| marcar conclusão para outra pessoa | `desafio_concluir()` **não recebe usuário** — usa `auth.uid()` |
| marcar conclusão para outro dia | também **não recebe data** — usa `desafio_hoje()` |
| fazer o desafio de ontem hoje | a chave é `(dia, user_id)` e o dia é sempre o de hoje |
| ganhar XP duas vezes | `on conflict do nothing` + `row_count` decidem se paga |
| escrever direto na tabela | RLS ligada e **sem policy de INSERT/UPDATE/DELETE** |
| ler quem mais concluiu | a policy de SELECT compara com `auth.uid()` |

O XP também é concedido **pelo servidor**: `desafio_concluir()` atualiza `xp_total` e `level`
dentro do banco e devolve os números já calculados. O cliente não soma nada — ele copia. É mais
fechado do que a trilha, onde o XP ainda é escrito pelo aparelho (com o teto do
`guard_profile_update`, [seção 9](#9-como-a-gamificação-funciona)).

O que continua no cliente é decidir se a **resposta** do exercício está certa — isso é inerente ao
projeto, onde o código do aluno roda no aparelho dele.

### 14.4 Onde aparece

- **painel** — uma faixa mostrando se o desafio de hoje está disponível ou já foi feito;
- **`/desafio`** — a tela do desafio, com o contador regressivo, a lição de origem e a lista de
  **quais amigos já fizeram hoje**;
- **perfil** — o total histórico ("23 desafios diários concluídos").

A comparação com amigos passa por `desafio_amigos()`, uma função `security definer` que faz a
junção no servidor e devolve **só o booleano e o total** — nenhuma outra linha de conclusão é
exposta, e nada de e-mail.

### 14.5 Conquistas e tags

| Marco | Conquista | Tag | Raridade |
| --- | --- | --- | --- |
| 1 | Primeiro desafio do dia | Diarista | Comum |
| 10 | 10 desafios diários | Constante | Raro |
| 25 | — | Disciplinado | Épico |
| 50 | 50 desafios diários | Inabalável | Mítico |
| 100 | 100 desafios diários | Diarista Lendário | Lendário |

A escala é mais espaçada que a do duelo de propósito: **um desafio por dia é o teto**, então 100
desafios são no mínimo 100 dias. A tag lendária daqui custa mais tempo do que qualquer outra do
jogo — não dá para acelerar jogando a noite inteira.

### 14.6 No modo demonstração

Sem Supabase, a mesma regra roda no aparelho ([`src/lib/desafios/local.ts`](src/lib/desafios/local.ts)):
o exercício sai da data, o dia vira à meia-noite de Brasília e concluir paga uma vez só. O que não
dá para reproduzir é a **garantia** — sem banco, quem guarda a lista de dias concluídos é o próprio
`localStorage`. A lista de amigos vem vazia, porque não há com quem comparar.

`npm run test:desafios` compara as duas implementações **dia a dia ao longo de 400 dias**: se
alguém mexer no SQL e esquecer do TypeScript (ou o contrário), o teste quebra.

---

## 15. Aparecer no Google (SEO)

Tudo o que está aqui é gratuito e funciona no domínio da Vercel — não precisa de domínio próprio.

### 15.1 O endereço do site

Sitemap, robots.txt e as tags de prévia precisam de **URL absoluta**. Ela vem, nesta ordem:

1. `NEXT_PUBLIC_SITE_URL` — o que você configurar em **Vercel › Settings › Environment Variables**;
2. `VERCEL_PROJECT_PRODUCTION_URL` — o domínio **fixo** de produção, que a Vercel injeta sozinha;
3. `http://localhost:3000` — só em desenvolvimento.

Uma `NEXT_PUBLIC_SITE_URL` apontando para `localhost` **perde** para o domínio da Vercel de
propósito: sem essa regra, esquecer de trocar a variável publicaria um sitemap inteiro apontando
para a sua máquina. E não usamos `VERCEL_URL`, que muda a cada deploy
(`projeto-a1b2c3.vercel.app`) e colocaria um endereço descartável dentro do sitemap.

### 15.2 Sitemap e robots.txt

Gerados pelo Next a partir de [`src/app/sitemap.ts`](src/app/sitemap.ts) e
[`src/app/robots.ts`](src/app/robots.ts) — ficam em `/sitemap.xml` e `/robots.txt`.

O sitemap lista **só as páginas públicas**: `/`, `/cadastro/` e `/login/`. Todo o resto do
aplicativo vive atrás do login (sem sessão, o `AppShell` manda para `/login`), então indexar essas
telas colocaria no Google resultados que levam a uma tela de carregamento. Elas ficam de fora do
sitemap, barradas no `robots.txt` **e** marcadas com `noindex, nofollow` no próprio HTML — o robots
evita a visita, o meta evita a indexação caso o Google chegue por um link de fora.

> **Isto aqui é indexável de verdade?** Sim. Mesmo sendo um app client-side, o Next pré-renderiza a
> landing no build: o HTML entregue tem cerca de **9.800 caracteres de texto visível**, não uma
> casca vazia. Dá para conferir abrindo `out/index.html` depois de `npm run build:static`.

### 15.3 Título, descrição e prévia do link

O layout raiz ([`src/app/layout.tsx`](src/app/layout.tsx)) define o título e a descrição da landing
e serve de padrão para o site. Cada rota pública tem um `layout.tsx` próprio com o texto dela — as
páginas são componentes de cliente e componente de cliente **não pode** exportar `metadata`, então
esse layout de servidor de uma linha existe só para carregar as tags.

Também saem prontas: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`,
`twitter:card` e o `<link rel="canonical">`.

A imagem de prévia é [`public/og.jpg`](public/og.jpg) (1200×630). Ela é **gerada a partir de um
HTML** — [`scripts/og-image.html`](scripts/og-image.html) — para qualquer pessoa do grupo conseguir
ajustar sem ferramenta de design:

```bash
npm i -D playwright && npx playwright install chromium   # só na primeira vez
npm run og:gen
```

JPEG e não PNG de propósito: o mesmo desenho em PNG dava 440 KB por causa dos gradientes, e o
WhatsApp costuma desistir de gerar a prévia acima de ~300 KB. Em JPEG a 90% fica em **69 KB**.

### 15.4 Cadastrar no Google Search Console

1. Publique na Vercel e confirme o endereço em **Vercel › Project › Domains** (algo como
   `https://codequest.vercel.app`).
2. Configure `NEXT_PUBLIC_SITE_URL` com esse endereço e **faça um novo deploy** — o sitemap é
   gerado no build, então a variável precisa existir antes.
3. Abra <https://search.google.com/search-console>, escolha **Prefixo do URL** e cole o endereço.
4. Verifique a propriedade pela **tag HTML** (o método mais simples sem domínio próprio): o Google
   dá uma meta tag; adicione o conteúdo dela em `verification` no `metadata` do layout raiz e faça
   deploy.
5. Em **Sitemaps**, envie `sitemap.xml`.

> A indexação leva de alguns dias a algumas semanas. Use **Inspeção de URL › Solicitar indexação**
> para acelerar a landing.

### 15.5 Verificação automática

`npm run test:seo` cobre a resolução do endereço (inclusive o caso de esquecer a variável), e —
quando `out/` existe — confere no resultado do build: o sitemap é XML válido, só tem URL absoluta
terminada em barra, nenhuma rota privada vazou, o robots barra todas elas, cada página pública tem
title/description de bom tamanho e as tags sociais, cada página privada está com `noindex`, e a
imagem de prévia cabe no limite do WhatsApp.

---

## 16. Editar e criar conteúdo

O currículo é **TypeScript**, não banco de dados — por isso funciona offline no `.apk` e no `.exe`,
e por isso um erro de digitação aparece na hora, com autocompletar.

### Adicionar uma lição

1. Abra o módulo, por exemplo [`src/content/python/03-condicionais.ts`](src/content/python/03-condicionais.ts).
2. Acrescente um objeto ao array `lessons` seguindo o padrão dos existentes.
3. Rode as verificações e regere o seed:

```bash
npm run content:check           # ids, ordem, alternativas, banco de perguntas
npm run content:verify-python   # confere as saídas esperadas no Python real
npm run content:verify-js       # o mesmo para JavaScript
npm run seed:gen                # atualiza supabase/seed.sql
```

4. Se estiver usando Supabase, rode o `seed.sql` atualizado no SQL Editor.

### Tipos de exercício

| `validationType` | Como o aluno responde | Como é corrigido |
| --- | --- | --- |
| `output_match` | escrevendo código no editor | o código roda no dispositivo (Pyodide ou o motor do navegador, conforme a trilha) e a saída é comparada com `expectedAnswer` |
| `multiple_choice` | escolhendo uma alternativa | comparação com `expectedAnswer` (que precisa estar em `options`) |
| `fill_blank` | digitando uma palavra | comparação tolerante; aceite variações separando com `\|` |

Em `output_match` você pode simular respostas do usuário com `stdin: ['18']` — o `input()` (Python)
ou o `prompt()` (JavaScript) do exercício consome esses valores em ordem.

### Escrever a teoria

O campo `content` aceita um markdown reduzido: `##`/`###`, parágrafos, listas com `-`, destaques
com `>`, tabelas `|`, **negrito**, `código inline` e blocos de código delimitados por `~~~py` … `~~~`
(use `~~~text` para mostrar saída de terminal). O renderizador está em
[`src/components/content/MarkdownLite.tsx`](src/components/content/MarkdownLite.tsx).

O campo opcional `polyglot` gera as abas "o conceito é o mesmo, a sintaxe muda".

---

## 17. Decisões técnicas

### Por que esta stack

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Front + rotas | Next.js 15 + TypeScript + Tailwind | um código, quatro plataformas; tipos evitam erros bobos no conteúdo |
| Banco e login | Supabase | Postgres + OAuth do Google prontos, plano gratuito sem cartão |
| Hospedagem | Vercel Hobby | deploy automático a cada push, gratuito |
| Executar Python | **Pyodide** (WebAssembly) | roda no dispositivo do aluno: **custo zero por execução** e funciona sem servidor |
| Executar JavaScript | **Web Worker + o motor do próprio navegador** | já está instalado em todo aparelho: zero download, zero dependência, zero custo |
| Android | Capacitor | reaproveita o site inteiro dentro de um WebView nativo |
| Desktop | **Tauri** (e não Electron) | instalador de ~5 MB em vez de ~120 MB |

**Existe algo ainda mais simples?** Analisamos duas alternativas e descartamos as duas:

- **Firebase** no lugar do Supabase: o Firestore é NoSQL e o modelo do projeto é claramente
  relacional (linguagens → módulos → lições → exercícios). Além disso, várias funcionalidades do
  Firebase pedem o plano *Blaze*, que exige cartão de crédito. O Supabase entrega Postgres + RLS +
  Google OAuth no plano gratuito, sem cartão.
- **Só front-end, sem banco** (progresso apenas no `localStorage`): eliminaria o Supabase, mas
  mataria o **ranking** e a sincronização entre celular e computador, que são requisitos do
  projeto. Nós ficamos com o melhor dos dois mundos: o app **funciona sem banco nenhum** (modo
  demonstração) e **usa a nuvem quando configurado**.

### Arquitetura 100% client-side

Todas as páginas são componentes de cliente que falam direto com o Supabase pelo navegador. Isso
foi deliberado: é o que permite o **mesmo** build virar site, `.apk` e `.exe`. Um backend Next.js
com rotas de servidor não poderia ser empacotado estaticamente.

**Consequência assumida:** como o cliente escreve o próprio XP, um aluno com conhecimento técnico
poderia forjar pontos. Mitigamos com um gatilho no banco (`guard_profile_update`) que impede o XP
de diminuir e limita o ganho por atualização. Numa evolução futura, mover a concessão de XP para
uma *Edge Function* do Supabase resolveria isso de vez.

### Execução de código

Duas linguagens da trilha têm exercícios em que o aluno escreve código de verdade, e as duas
rodam **no dispositivo dele**, dentro de um **Web Worker**. Nenhuma linha é enviada para servidor
nenhum — o que atende ao requisito de custo zero e faz os exercícios funcionarem offline no `.apk`
e no `.exe`.

| Trilha | Quem executa | Arquivo | Tempo limite |
| --- | --- | --- | --- |
| 🐍 Python | Pyodide (CPython em WebAssembly) | [`public/pyodide-worker.js`](public/pyodide-worker.js) | 8 s |
| 🟨 JavaScript | o motor do próprio navegador | [`public/js-worker.js`](public/js-worker.js) | 4 s |

Os dois falam o mesmo protocolo de mensagens, então quem os controla é o mesmo gerenciador
([`src/lib/runtime/executor.ts`](src/lib/runtime/executor.ts)): ele sobe o worker uma vez, reaproveita
entre execuções e, quando um programa não termina, chama `terminate()` e recria. Quem escolhe o
motor de cada trilha é [`src/lib/exercises/runtime.ts`](src/lib/exercises/runtime.ts) — a lição
passa o slug da linguagem e o resto do app não precisa saber de nada.

#### Por que um Web Worker para JavaScript, se o navegador já é JavaScript

A pergunta é justa: o código poderia rodar direto na página. Duas razões decidiram:

1. **Laço infinito.** `while (true) {}` na thread principal congela a aba inteira — e não adianta
   agendar um timeout para interromper, porque o próprio timer nunca chega a rodar. É o problema
   que o módulo de Repetições provoca de propósito. Em um worker, basta encerrá-lo de fora.
2. **Isolamento.** O worker não alcança o DOM nem o `localStorage` (onde ficam a sessão e o
   progresso). Por cima disso, [`js-worker.js`](public/js-worker.js) apaga `fetch`,
   `XMLHttpRequest`, `WebSocket`, `indexedDB` e afins **antes** de qualquer código de aluno rodar.
   Isso é uma tranca contra acidente, não um sandbox de segurança — quem executa é a própria
   pessoa, no navegador dela.

**E por que não um interpretador em WebAssembly** (QuickJS, por exemplo), que seria um sandbox de
verdade? Porque custaria cerca de 1 MB de download para proteger o aluno dele mesmo, enquanto o
motor que já existe no aparelho custa zero e roda instantaneamente. O Pyodide só paga esse preço
porque não há Python nenhum no navegador.

#### O contrato de saída

`console.log` de verdade imprime objetos de um jeito em cada navegador, e os exercícios
`output_match` comparam a saída caractere por caractere. Por isso a formatação é nossa e
determinística, e vive em [`public/js-runtime.js`](public/js-runtime.js):

- `console.log(a, b)` vira uma linha com os valores separados por espaço;
- arrays saem como `[1, 2, 3]`, objetos como `{ nome: "Ana" }`, referência circular vira
  `[circular]` em vez de estourar a pilha;
- `prompt()` faz o papel do `input()`: escreve a pergunta **sem** quebrar linha e devolve sempre
  texto — preservando a pegadinha de `prompt() + 1` concatenar em vez de somar, que a lição de
  conversão de tipos usa;
- o código roda em `"use strict"`, de propósito: sem ele, `nome = "Ana"` sem `let` criaria uma
  variável global em silêncio, em vez do `ReferenceError` que a lição ensina a ler;
- erros saem como `Linha 2: ReferenceError: ...`, com o trecho da linha. O deslocamento de linhas
  introduzido pelo `new Function` é **medido** na carga com uma sonda, em vez de chutado — o valor
  muda entre motores.

Esse arquivo é carregado em dois lugares: pelo worker, no navegador, e pelo
[verificador de conteúdo](scripts/verificar-saidas-js.mjs), no Node. Sendo o mesmo arquivo nos
dois, o que `npm run content:verify-js` aprova é exatamente o que o aluno vê — não há espaço para
o teste passar e o app divergir.

#### Como o conteúdo é conferido

As 33 soluções de referência da trilha de JavaScript são executadas de verdade a cada
`npm run content:verify-js`, e comparadas com a saída esperada usando a mesma normalização do app.
Nenhum `expectedAnswer` foi escrito de cabeça.

### Consumo dos planos gratuitos

O conteúdo das lições vem do próprio aplicativo, não do banco. O Supabase só é consultado para
**perfil, progresso, conquistas e ranking** — pouquíssimas requisições por aluno, muito longe dos
limites do plano gratuito. A execução de código não custa nada porque acontece no dispositivo.

---

## 18. Problemas comuns

**O app mostra "modo demonstração" mesmo com o `.env.local` preenchido**
Reinicie o `npm run dev` — variáveis `NEXT_PUBLIC_*` são lidas na inicialização. Confira também se
o arquivo se chama exatamente `.env.local`, na raiz do projeto.

**"Unsupported provider: provider is not enabled" ao clicar em Google**
O provedor Google não foi ativado no Supabase. Veja a [seção 4.2](#42-ligar-o-google-no-supabase).

**O Google volta para a página inicial em vez de entrar**
O endereço de retorno não está autorizado. Confira que a **Redirect URLs** do Supabase tem a linha
com a barra no final: `http://localhost:3000/auth/callback/`.

**No `.apk`, o Google abre o navegador e não volta para o app**
Confirme que `codequest://auth-callback` está nas **Redirect URLs** do Supabase e que o
`<intent-filter>` continua no `AndroidManifest.xml` (ele é sobrescrito se você apagar a pasta
`android/` e rodar `npx cap add android` de novo).

**O terminal fica em "Preparando o Python..." para sempre**
O Pyodide está baixando da CDN — precisa de internet na primeira execução. Em uma rede que bloqueia
`cdn.jsdelivr.net`, os exercícios de múltipla escolha e de completar continuam funcionando.

**`gradlew` falha com erro de versão do Java**
Use o **JDK 17**. Versões muito novas (21+) ainda quebram em algumas versões do Android Gradle
Plugin. O JDK que vem com o Android Studio já é o correto:
`gradlew.bat -Dorg.gradle.java.home="C:\Program Files\Android\Android Studio\jbr" assembleDebug`.

**`npm run tauri:build` reclama de `link.exe` não encontrado (Windows)**
Faltam as Visual Studio Build Tools com a carga **"Desenvolvimento para desktop com C++"**.
Veja a [seção 7.1](#71-o-que-instalar-uma-vez-só).

**Já tinha conta e agora o app pede um nome de usuário**
É o esperado: o campo `username` nasce vazio para contas antigas, e a tela aparece uma única vez
para você escolher. Se ela não aparecer, confirme que rodou o `0002_amigos.sql` no SQL Editor.

**"column profiles.username does not exist"**
A migration `0002_amigos.sql` ainda não foi aplicada nesse projeto do Supabase. Rode-a e recarregue
a página.

**A busca não encontra meu colega**
A busca é pelo `@usuario`, não pelo nome de exibição — e só encontra quem já escolheu um. Peça para
o colega abrir o app uma vez e confirmar o nome de usuário dele.

**O pedido de amizade sumiu sozinho**
Recusar, cancelar e desfazer apagam a mesma linha. Se o colega recusou, o pedido desaparece dos
dois lados e você pode enviar de novo mais tarde.

**As lições não aparecem depois de configurar o Supabase**
As lições **não** vêm do banco — elas estão no aplicativo. Se a tela estiver vazia, o problema é
outro: abra o console do navegador (F12) e verifique erros de conexão.

---

## Licença e créditos

Projeto acadêmico desenvolvido como Projeto Integrador por **Davi B. Tarquinio**,
**Luiz A. S. P. Jr** e **Kauan F. Arruda**.

Ferramentas de terceiros usadas, todas gratuitas e de código aberto: Next.js, React, TailwindCSS,
Supabase, Pyodide, Capacitor, Tauri e Lucide Icons.
