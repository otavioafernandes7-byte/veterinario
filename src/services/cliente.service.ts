import * as bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

// Lista de campos "públicos" de um Cliente — usada em toda consulta, para o
// campo "senha" nunca sequer sair da base de dados. Preferimos isto a buscar
// o registo inteiro e "desestruturar para remover a senha", porque essa
// segunda abordagem criaria uma variável nunca usada (e o tsconfig deste
// projeto tem "noUnusedLocals": true, o que quebraria a compilação).
const SELECT_CLIENTE_PUBLICO = {
  id: true,
  nome: true,
  cpf: true,
  email: true,
  telefone: true,
  criadoEm: true,
} as const;

interface CriarClienteInput {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
}

export async function criarCliente(dados: CriarClienteInput) {
  // bcrypt.hash(senha, 10) gera um hash irreversível. O "10" é o número de
  // "salt rounds": quanto maior, mais lento e mais seguro contra força bruta.
  const senhaHash = await bcrypt.hash(dados.senha, 10);

  const clienteCriado = await prisma.cliente.create({
    data: { ...dados, senha: senhaHash },
    select: SELECT_CLIENTE_PUBLICO,
  });

  return clienteCriado;
}

export async function listarClientes() {
  return prisma.cliente.findMany({
    select: SELECT_CLIENTE_PUBLICO,
    orderBy: { id: 'asc' },
  });
}

export async function buscarClientePorId(id: number) {
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    select: SELECT_CLIENTE_PUBLICO,
  });

  if (!cliente) {
    throw new AppError('Cliente não encontrado.', 404);
  }

  return cliente;
}