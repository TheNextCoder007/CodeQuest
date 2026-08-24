/**
 * Regras do @username.
 *
 * O username e diferente do nome de exibicao: ele identifica a pessoa na
 * busca de amigos, entao precisa ser unico, curto e sem espacos. As mesmas
 * regras estao no banco, na constraint `profiles_username_formato`
 * (`supabase/migrations/0002_amigos.sql`), para que nada invalido entre
 * mesmo se alguem chamar a API por fora.
 */

import { usernameProibido } from '@/content/palavras-bloqueadas';

/** Quanto tempo e preciso esperar entre uma troca de username e a proxima. */
export const USERNAME_COOLDOWN_HORAS = 24;

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

/** Remove acentos, espacos e maiusculas: "Davi Tarquinio" -> "davitarquinio". */
export const normalizeUsername = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, USERNAME_MAX);

/** Devolve a mensagem de erro, ou `null` se estiver tudo certo. */
export const validateUsername = (value: string): string | null => {
  const clean = value.trim();

  if (!clean) return 'Escolha um nome de usuário.';
  if (clean.length < USERNAME_MIN) return `Use pelo menos ${USERNAME_MIN} caracteres.`;
  if (clean.length > USERNAME_MAX) return `Use no máximo ${USERNAME_MAX} caracteres.`;
  if (/\s/.test(clean)) return 'O nome de usuário não pode ter espaços.';
  if (/[A-Z]/.test(clean)) return 'Use apenas letras minúsculas.';
  if (!USERNAME_PATTERN.test(clean)) {
    return 'Use apenas letras minúsculas, números e _ (underline).';
  }
  if (usernameProibido(clean)) {
    return 'Esse nome de usuário não é permitido. Escolha outro.';
  }
  return null;
};

/**
 * Quanto falta do periodo de espera de 24h, em milissegundos (0 = liberado).
 *
 * Isto e so para a interface avisar antes. Quem manda de verdade e o gatilho
 * `guard_profile_update` no banco - a checagem aqui pode ser burlada, a do
 * servidor nao.
 */
export const esperaRestanteMs = (
  trocadoEm: string | null | undefined,
  agora: Date = new Date(),
): number => {
  if (!trocadoEm) return 0;
  const quando = new Date(trocadoEm).getTime();
  if (Number.isNaN(quando)) return 0;
  const liberaEm = quando + USERNAME_COOLDOWN_HORAS * 3_600_000;
  return Math.max(0, liberaEm - agora.getTime());
};

/** "faltam 3 h" / "faltam 12 min" - texto curto para a tela de perfil. */
export const formatarEspera = (restanteMs: number): string => {
  if (restanteMs <= 0) return '';
  const minutos = Math.ceil(restanteMs / 60_000);
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.ceil(minutos / 60);
  return `${horas} h`;
};

/**
 * Sugestao inicial a partir do nome de exibicao (ou do e-mail, se o nome nao
 * render caracteres validos). A pessoa sempre pode editar antes de confirmar.
 */
export const suggestUsername = (name: string, email?: string | null): string => {
  const doNome = normalizeUsername(name);
  if (doNome.length >= USERNAME_MIN) return doNome;

  const doEmail = normalizeUsername((email ?? '').split('@')[0] ?? '');
  if (doEmail.length >= USERNAME_MIN) return doEmail;

  // Ultimo recurso: completa com numeros para atingir o tamanho minimo.
  const base = doNome || doEmail || 'aluno';
  return normalizeUsername(base + Math.floor(100 + Math.random() * 900));
};

/** Gera uma variacao livre quando a sugestao ja estiver em uso. */
export const nextUsernameCandidate = (base: string, tentativa: number): string => {
  const sufixo = String(tentativa);
  const raiz = normalizeUsername(base).slice(0, USERNAME_MAX - sufixo.length) || 'aluno';
  return `${raiz}${sufixo}`;
};

/** Formata para exibicao: "davi123" -> "@davi123". */
export const displayUsername = (username: string | null | undefined): string =>
  username ? `@${username}` : '';
