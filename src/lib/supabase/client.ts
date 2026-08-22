'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do navegador.
 *
 * Toda a aplicacao e client-side, o que permite gerar o mesmo bundle para o
 * site (Vercel), para o .apk (Capacitor) e para o .exe (Tauri). Nao ha
 * `service_role` em lugar nenhum: a chave anonima e publica por design e a
 * seguranca vem das policies de Row Level Security.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const looksConfigured = (value: string | undefined): value is string =>
  Boolean(value) && !value!.includes('xxxxxxxx') && !value!.includes('exemplo');

/**
 * Quando as chaves nao estao preenchidas, o CodeQuest entra em **modo
 * demonstracao**: tudo funciona, mas o progresso e salvo apenas no
 * dispositivo (localStorage). Isso permite rodar o projeto e apresentar o
 * app sem depender de conta nenhuma.
 */
export const isSupabaseConfigured = looksConfigured(url) && looksConfigured(anonKey);

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) return null;
  if (client) return client;

  client = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Faz o proprio supabase-js trocar o `code` do OAuth por uma sessao
      // assim que a pagina de callback abre - funciona igual no navegador e
      // dentro dos apps empacotados.
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });

  return client;
};
