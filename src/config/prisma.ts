import { PrismaClient } from '@prisma/client';

// ----------------------------------------------------------------------------
// Por que este código ficou mais complicado?
// ----------------------------------------------------------------------------
// Na Vercel, a API não roda como um servidor ligado 24h. Ela roda em "funções
// serverless": a plataforma acorda uma instância quando chega uma requisição e a
// desliga depois de um tempo sem uso. Enquanto a instância está "morna", ela é
// reaproveitada para novas requisições.
//
// Guardamos a instância do PrismaClient numa variável global para que, ao ser
// reaproveitada, ela use o pool de conexões que JÁ está aberto — em vez de abrir
// um novo a cada requisição e esgotar o limite de conexões do banco.
// ----------------------------------------------------------------------------

const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalParaPrisma.prisma ??
  new PrismaClient({
    // Em produção registramos apenas erros. O log de 'query' imprime TODA
    // consulta SQL executada: ótimo para aprender localmente, mas em produção
    // enche os logs da Vercel e deixa cada requisição mais lenta.
    log:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'warn', 'error'],
  });

globalParaPrisma.prisma = prisma;