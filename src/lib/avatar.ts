'use client';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Foto de perfil.
 *
 * A imagem e reduzida e recomprimida **no navegador**, antes de subir: uma
 * foto de celular tem 3-6 MB e viraria 4 mil fotos no limite gratuito de 1 GB
 * do Supabase Storage. Depois do corte quadrado de 256px em WebP, cada foto
 * fica em torno de 20-40 KB.
 */

/** Lado do quadrado final, em pixels. */
export const LADO_AVATAR = 256;

/** Tamanho maximo aceito do arquivo original (o bucket tambem limita em 2 MB). */
export const TAMANHO_MAXIMO_MB = 8;

export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const carregarImagem = (arquivo: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não consegui abrir essa imagem.'));
    };
    img.src = url;
  });

/**
 * Corta no centro, reduz para 256x256 e comprime.
 *
 * Tenta WebP (bem menor); se o navegador nao suportar, cai para JPEG.
 */
export async function prepararImagem(arquivo: File): Promise<{ blob: Blob; extensao: string }> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    throw new Error('Use uma imagem JPG, PNG ou WebP.');
  }
  if (arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
    throw new Error(`A imagem precisa ter no máximo ${TAMANHO_MAXIMO_MB} MB.`);
  }

  const img = await carregarImagem(arquivo);

  // Corte quadrado pelo centro, para nao distorcer a foto.
  const lado = Math.min(img.width, img.height);
  const origemX = (img.width - lado) / 2;
  const origemY = (img.height - lado) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = LADO_AVATAR;
  canvas.height = LADO_AVATAR;

  const contexto = canvas.getContext('2d');
  if (!contexto) throw new Error('Seu navegador não conseguiu processar a imagem.');
  contexto.imageSmoothingQuality = 'high';
  contexto.drawImage(img, origemX, origemY, lado, lado, 0, 0, LADO_AVATAR, LADO_AVATAR);

  const paraBlob = (tipo: string, qualidade: number): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob(resolve, tipo, qualidade));

  const webp = await paraBlob('image/webp', 0.82);
  if (webp && webp.type === 'image/webp') return { blob: webp, extensao: 'webp' };

  const jpeg = await paraBlob('image/jpeg', 0.85);
  if (jpeg) return { blob: jpeg, extensao: 'jpg' };

  throw new Error('Não consegui comprimir a imagem.');
}

const paraDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error('Falha ao ler a imagem.'));
    leitor.readAsDataURL(blob);
  });

/**
 * Envia a foto e devolve a URL publica.
 *
 * O caminho e sempre `<uid>/avatar.<ext>` porque a policy do Storage exige
 * que a primeira pasta seja o id de quem esta enviando - assim ninguem
 * sobrescreve a foto de outra pessoa. O `?v=` no fim quebra o cache do
 * navegador quando a pessoa troca a foto.
 *
 * Sem Supabase configurado (modo demonstracao), a imagem vira um data: URL
 * guardado junto do perfil local.
 */
export async function enviarAvatar(userId: string, arquivo: File): Promise<string> {
  const { blob, extensao } = await prepararImagem(arquivo);

  if (!isSupabaseConfigured) return paraDataUrl(blob);

  const supabase = getSupabase()!;
  const caminho = `${userId}/avatar.${extensao}`;

  const { error: falha } = await supabase.storage.from('avatars').upload(caminho, blob, {
    upsert: true,
    contentType: blob.type,
    cacheControl: '3600',
  });

  if (falha) {
    if (/bucket/i.test(falha.message)) {
      throw new Error(
        'O bucket "avatars" ainda não existe no Supabase. Rode a migration 0004 e tente de novo.',
      );
    }
    throw new Error(falha.message);
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(caminho);
  return `${data.publicUrl}?v=${Date.now()}`;
}
