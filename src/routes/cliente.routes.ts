import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', clienteController.criar); // PÚBLICA — cadastro
router.get('/', authMiddleware, clienteController.listar); // PROTEGIDA
router.get('/:id', authMiddleware, clienteController.buscarPorId); // PROTEGIDA

export default router;