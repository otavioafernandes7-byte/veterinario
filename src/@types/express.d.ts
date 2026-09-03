// Arquivo de DECLARAÇÃO de tipos (não gera código em tempo de execução).
// Ensina o TypeScript que req.user pode existir no objeto Request do Express.
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}