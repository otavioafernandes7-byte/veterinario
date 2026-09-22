import { Router } from 'express';
import * as veterinarioController from '../controllers/veterinario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // RN04: todas as rotas exigem autenticação

router.post('/', veterinarioController.registrar);
router.get('/', veterinarioController.listar);
router.patch('/:id/concluir', veterinarioController.concluir);

export default router;