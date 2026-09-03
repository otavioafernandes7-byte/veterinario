import { Router } from 'express';
import * as animalController from '../controllers/animal.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// RN04: TODAS as rotas de animal exigem autenticação. Em vez de repetir
// authMiddleware em cada rota, aplicamos uma única vez com router.use(...).
router.use(authMiddleware);

router.post('/', animalController.cadastrar);
router.get('/', animalController.listar);
router.get('/:id', animalController.buscarPorId);
router.get('/:id/idade', animalController.obterIdade);
router.patch('/:id', animalController.atualizar);
router.delete('/:id', animalController.deletar);

export default router;