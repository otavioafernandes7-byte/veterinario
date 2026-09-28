import * as bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

export async function registrarVeterinario(dados: {
  nome: string;
  crmv: string;
  especialidade: string;
  email: string;
  senha: string;
}) {
  const { nome, senha, ...dadosVeterinario } = dados;

  const senhaHash = await bcrypt.hash(senha, 10);

  // nome, senha e tipo pertencem ao Usuario; o Veterinario guarda crmv,
  // especialidade e email. O create aninhado cria os dois de uma vez e o
  // Prisma preenche usuarioId sozinho.
  const veterinario = await prisma.veterinario.create({
    data: {
      ...dadosVeterinario,
      usuario: {
        create: { nome, email: dados.email, senha: senhaHash, tipo: 'VETERINARIO' },
      },
    },
  });
  return veterinario;
}

export async function listarVeterinarios() {
  return await prisma.veterinario.findMany();
}

export async function concluirCadastro(id: number) {
  const veterinario = await prisma.veterinario.findUnique({
    where: { id },
  });

  if (!veterinario) {
    throw new AppError('Veterinário não encontrado.', 404);
  }

  await prisma.veterinario.update({
    where: { id },
    data: { cadastroConcluido: true },
  });

  return { mensagem: 'Cadastro concluído com sucesso!', veterinario };
}