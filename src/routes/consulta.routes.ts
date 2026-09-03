import { Router } from 'express';
import * as consultaController from '../controllers/consulta.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', consultaController.listar); // PÚBLICA — catálogo
router.get('/:id', consultaController.buscarPorId); // PÚBLICA — catálogo
router.post('/', authMiddleware, consultaController.criar); // PROTEGIDA
router.put('/:id', authMiddleware, consultaController.atualizar); // PROTEGIDA

export default router;