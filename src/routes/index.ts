import { Router } from 'express';
import authRoutes from './auth.routes';
import clienteRoutes from './cliente.routes';
import consultaRoutes from './consulta.routes';
import animalRoutes from './animal.routes';
import veterinarioRoutes from './veterinario.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/consultas', consultaRoutes);
routes.use('/animal', animalRoutes);
routes.use('/veterinario', veterinarioRoutes);

export { routes };