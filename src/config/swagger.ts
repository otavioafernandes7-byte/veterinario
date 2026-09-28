import swaggerJSDoc from 'swagger-jsdoc';

// Este arquivo monta o DOCUMENTO OpenAPI da API inteira.
//
// A "definition" abaixo é a parte central e fixa do documento (título, versão,
// servidores, segurança e schemas reutilizáveis). A documentação de cada
// endpoint fica escrita em comentários "@openapi" dentro dos próprios arquivos
// de rota (src/routes/*.ts) — o swagger-jsdoc varre esses arquivos (campo
// "apis" lá no final) e junta tudo num único JSON.
export const swaggerSpec = swaggerJSDoc({
  definition: {
    // Versão da ESPECIFICAÇÃO OpenAPI (a "gramática" do documento),
    // não confundir com a versão da nossa API (que fica em info.version).
    openapi: '3.0.3',

    info: {
      title: 'VetCare API',
      version: '1.0.0',
      description:
        'API RESTful do sistema de gestão de clínica veterinária VetCare. ' +
        'Fluxo típico: cadastre um cliente e seu animal, faça login para obter um token JWT ' +
        'e use o botão **Authorize** acima para testar as rotas protegidas.',
    },

    servers: [
      { url: 'http://localhost:3333', description: 'Ambiente de desenvolvimento' },
    ],

    // As tags agrupam os endpoints em "seções" na interface do Swagger.
    tags: [
      { name: 'Autenticação', description: 'Login e emissão de token JWT' },
      { name: 'Clientes', description: 'Cadastro e consulta de tutores (clientes)' },
      { name: 'Animais', description: 'Cadastro e gestão dos animais dos clientes' },
      { name: 'Veterinários', description: 'Cadastro e autenticação dos veterinários' },
      { name: 'Consultas', description: 'Agendamento, cancelamento e conclusão de consultas' },
      { name: 'Prontuários', description: 'Registro do diagnóstico e prescrição de cada consulta' },
    ],

    components: {
      // Declara COMO a API autentica. "bearerAuth" é o nome que as rotas
      // protegidas vão referenciar com "security: [{ bearerAuth: [] }]".
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Cole aqui o token devolvido pelo POST /api/auth/login (sem o prefixo "Bearer").',
        },
      },

      // Schemas reutilizáveis: cada um descreve o FORMATO de um objeto que a
      // API recebe ou devolve. As rotas referenciam com:
      //   $ref: '#/components/schemas/NomeDoSchema'
      schemas: {
        RespostaErro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Mensagem explicando o que deu errado.' },
          },
        },

        Cliente: {
          type: 'object',
          description: 'Cliente (tutor) SEM o campo senha (a senha nunca sai do banco).',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Roberto Santos' },
            cpf: { type: 'string', example: '987.654.321-11' },
            email: { type: 'string', format: 'email', example: 'roberto.santos@email.com' },
            telefone: { type: 'string', example: '(11) 97777-6666' },
          },
        },

        Animal: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            clienteId: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Rex' },
            especie: { type: 'string', example: 'Cachorro' },
            raca: { type: 'string', example: 'Labrador' },
            dataNascimento: { type: 'string', format: 'date' },
            cliente: { $ref: '#/components/schemas/Cliente' },
          },
        },

        Veterinario: {
          type: 'object',
          description: 'Veterinário SEM o campo senha (a senha nunca sai do banco).',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Dra. Ana Paula' },
            crmv: { type: 'string', example: 'CRMV-SP 12345' },
            especialidade: { type: 'string', example: 'Clínica Geral' },
            email: { type: 'string', format: 'email', example: 'ana.paula@vetcare.com' },
          },
        },

        Consulta: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            animalId: { type: 'integer', example: 1 },
            veterinarioId: { type: 'integer', example: 1 },
            dataHorario: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['Agendada', 'Concluida', 'Cancelada'],
              example: 'Agendada',
            },
            animal: { $ref: '#/components/schemas/Animal' },
            veterinario: { $ref: '#/components/schemas/Veterinario' },
          },
        },

        Prontuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            consultaId: { type: 'integer', example: 1 },
            diagnostico: { type: 'string', example: 'Otite leve no ouvido direito' },
            prescricao: { type: 'string', example: 'Limpeza diária + pomada por 7 dias' },
            dataRetorno: { type: 'string', format: 'date', nullable: true },
          },
        },
      },
    },
  },

  // Onde o swagger-jsdoc procura os comentários "@openapi".
  // O segundo padrão cobre a versão COMPILADA (npm run build + npm start):
  // o tsc mantém os comentários no .js gerado, então a documentação
  // continua funcionando em produção.
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
});