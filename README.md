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
11. [Editar e criar conteúdo](#11-editar-e-criar-conteúdo)
12. [Decisões técnicas](#12-decisões-técnicas)
13. [Problemas comuns](#13-problemas-comuns)

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
| `npm run test:amigos` | Testa o fluxo de amizades (busca, pedido, aceite, remoção, ranking) |
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
│   │   └── ranking/              # /ranking ....... leaderboard global e de amigos
│   ├── components/               # UI reutilizável (cards, editor, toasts…)
│   ├── content/                  # 📚 O CURRÍCULO (fonte da verdade)
│   │   ├── python/01-fundamentos.ts … 07-projeto-final.ts
│   │   └── achievements.ts
│   └── lib/                      # regras de negócio
│       ├── auth/                 # sessão, Google OAuth, deep link
│       ├── friends.ts            # amizades, busca e ranking entre amigos
│       ├── username.ts           # regras do @username
│       ├── player/               # XP, progresso, conquistas
│       ├── python/               # ponte com o Pyodide
│       ├── exercises/            # validação das respostas
│       ├── gamification.ts       # nível, streak, critérios de conquista
│       └── progression.ts        # regras de desbloqueio da trilha
├── public/pyodide-worker.js      # executa o Python do aluno (Web Worker)
├── supabase/
│   ├── migrations/0001_init.sql  # tabelas + RLS + gatilhos
│   ├── migrations/0002_amigos.sql # @username + amizades + RLS
│   ├── migrations/0003_protecao_progresso.sql # travas contra perda de XP
│   ├── diagnostico.sql           # consultas de conferência (só leitura)
│   └── seed.sql                  # conteúdo das trilhas (GERADO)
├── android/                      # projeto Android (Capacitor)
├── src-tauri/                    # projeto desktop (Tauri)
├── scripts/                      # geração de seed e verificação do conteúdo
└── .github/workflows/            # CI e geração dos instaladores
```

### Trilha de Python incluída no MVP

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

JavaScript, Java, C# e C++ já existem no catálogo e no banco, mas sem conteúdo populado — é só
escrever os módulos, sem mexer em código.

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
5. Abra mais uma query, cole **todo** o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) e rode também.
   Esse arquivo popula as 5 linguagens, 24 lições, 46 exercícios e 16 conquistas.

> Os quatro scripts podem ser executados quantas vezes você quiser: eles usam
> `if not exists` / `on conflict do update` e não duplicam nem apagam nada.
> Isso não é só promessa: `npm run test:migrations` aplica os quatro **três vezes
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

## 11. Editar e criar conteúdo

O currículo é **TypeScript**, não banco de dados — por isso funciona offline no `.apk` e no `.exe`,
e por isso um erro de digitação aparece na hora, com autocompletar.

### Adicionar uma lição

1. Abra o módulo, por exemplo [`src/content/python/03-condicionais.ts`](src/content/python/03-condicionais.ts).
2. Acrescente um objeto ao array `lessons` seguindo o padrão dos existentes.
3. Rode as verificações e regere o seed:

```bash
npm run content:check           # ids, ordem, alternativas
npm run content:verify-python   # confere as saídas esperadas no Python real
npm run seed:gen                # atualiza supabase/seed.sql
```

4. Se estiver usando Supabase, rode o `seed.sql` atualizado no SQL Editor.

### Tipos de exercício

| `validationType` | Como o aluno responde | Como é corrigido |
| --- | --- | --- |
| `output_match` | escrevendo código no editor | o Python roda no dispositivo (Pyodide) e a saída é comparada com `expectedAnswer` |
| `multiple_choice` | escolhendo uma alternativa | comparação com `expectedAnswer` (que precisa estar em `options`) |
| `fill_blank` | digitando uma palavra | comparação tolerante; aceite variações separando com `\|` |

Em `output_match` você pode simular respostas do usuário com `stdin: ['18']` — o `input()` do
exercício consome esses valores em ordem.

### Escrever a teoria

O campo `content` aceita um markdown reduzido: `##`/`###`, parágrafos, listas com `-`, destaques
com `>`, tabelas `|`, **negrito**, `código inline` e blocos de código delimitados por `~~~py` … `~~~`
(use `~~~text` para mostrar saída de terminal). O renderizador está em
[`src/components/content/MarkdownLite.tsx`](src/components/content/MarkdownLite.tsx).

O campo opcional `polyglot` gera as abas "o conceito é o mesmo, a sintaxe muda".

---

## 12. Decisões técnicas

### Por que esta stack

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Front + rotas | Next.js 15 + TypeScript + Tailwind | um código, quatro plataformas; tipos evitam erros bobos no conteúdo |
| Banco e login | Supabase | Postgres + OAuth do Google prontos, plano gratuito sem cartão |
| Hospedagem | Vercel Hobby | deploy automático a cada push, gratuito |
| Executar Python | **Pyodide** (WebAssembly) | roda no dispositivo do aluno: **custo zero por execução** e funciona sem servidor |
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

O Python roda dentro de um **Web Worker** ([`public/pyodide-worker.js`](public/pyodide-worker.js)):

- laços infinitos não travam a interface — o worker é encerrado após **8 segundos**;
- o Pyodide (~10 MB) baixa da CDN jsDelivr apenas na primeira execução e fica em cache;
- `input()` é substituído por uma versão que consome as entradas simuladas do exercício,
  imprimindo o prompt exatamente como um terminal faria.

### Consumo dos planos gratuitos

O conteúdo das lições vem do próprio aplicativo, não do banco. O Supabase só é consultado para
**perfil, progresso, conquistas e ranking** — pouquíssimas requisições por aluno, muito longe dos
limites do plano gratuito. A execução de código não custa nada porque acontece no dispositivo.

---

## 13. Problemas comuns

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
