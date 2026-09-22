// ============================================================================
// api/index.ts — Ponto de entrada da aplicação na VERCEL
// ============================================================================
// Este arquivo é o equivalente ao src/server.ts, porém para o ambiente
// serverless da Vercel. A diferença fundamental:
//
//   src/server.ts   ->  chama app.listen() e OUVE uma porta para sempre.
//                       Usado na sua máquina, com "npm run dev".
//
//   api/index.ts    ->  apenas EXPORTA o app. A Vercel o chama passando
//                       (req, res) a cada requisição que chega.
//
// Os dois convivem sem conflito: cada ambiente usa o seu. Toda a lógica da
// API continua vivendo em src/app.ts e sendo compartilhada pelos dois.
// ============================================================================

import { app } from '../src/app';

// "export default" é o que a Vercel procura neste arquivo.
export default app;