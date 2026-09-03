import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

interface TokenPayload {
  id: number;
  email: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Cabeçalho no formato: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido.', 401);
  }

  // "Bearer eyJhbGci..." -> ["Bearer", "eyJhbGci..."]
  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    throw new AppError('Token mal formatado. Utilize o formato: Bearer <token>.', 401);
  }

  const token = partes[1];

  try {
    // jwt.verify confere a assinatura (usando o mesmo segredo do login) e a
    // validade do token. Se passar, devolve o payload assinado no login.
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    req.user = { id: payload.id, email: payload.email };
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }

  next();
}