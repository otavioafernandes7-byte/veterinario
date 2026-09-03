import { Router } from 'express';
import * as manutencaoController from '../controllers/veterinario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // RN04: todas as rotas exigem autenticação

router.post('/', manutencaoController.registrar);
router.get('/', manutencaoController.listar);
router.patch('/:id/concluir', manutencaoController.concluir);

export default router;