/**
 * Como uma resposta digitada e comparada com o gabarito na trilha.
 *
 * Fica num modulo separado (e nao dentro de `validate.ts`) para o verificador
 * de conteudo poder importar a MESMA funcao sem carregar junto os
 * executores de codigo, que so existem no navegador.
 *
 * Duas alternativas que normalizam para o mesmo texto sao, na pratica, a
 * mesma alternativa: as duas seriam aceitas como certas. `npm run
 * content:check` usa esta funcao justamente para recusar esse caso.
 */
export const normalizarRespostaDaTrilha = (valor: string): string =>
  valor
    .trim()
    .replace(/^[`\'"]+|[`\'"]+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
