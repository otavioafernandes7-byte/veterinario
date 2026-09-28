// import 'express-async-errors'; // não precisa mais
/// <reference path="./@types/express.d.ts" />
// import 'express-async-errors'; // não precisa mais

import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export { app };

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// ... (depois de app.use(express.json())):

// Interface interativa da documentação (Swagger UI): abre em /api-docs.
// swaggerUi.serve entrega os arquivos estáticos da interface;
// swaggerUi.setup(swaggerSpec) injeta o NOSSO documento OpenAPI nela.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// O documento OpenAPI cru, em JSON — útil para importar no Insomnia/Postman.
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});