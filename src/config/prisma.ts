import { PrismaClient } from '@prisma/client';

// Instância ÚNICA (singleton) do Prisma Client, reutilizada em todo o projeto.
// Se cada arquivo criasse o seu próprio "new PrismaClient()", esgotaríamos
// rapidamente o número de conexões simultâneas permitidas pelo banco de dados.
export const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],
});