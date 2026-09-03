import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// AppError representa um erro "esperado" da aplicação
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// Middleware de erro do Express
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Caso 1: erro "esperado", lançado por nós mesmos com "throw new AppError(...)"
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Caso 2: erro conhecido do Prisma (P2002 = violação @unique)
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Já existe um registro com um valor único em conflito (ex.: CPF, e-mail ou placa duplicados).',
      });
      return;
    }
    // Caso 3: erro de "registro não encontrado" (P2025)
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }
  }


  // Caso 4: qualquer outro erro (servidor, banco, etc.)
  console.error('Erro inesperado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
}