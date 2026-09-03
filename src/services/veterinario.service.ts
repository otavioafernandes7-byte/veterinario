import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

export async function registrarVeterinario(dados: {
  nome: string;
  crmv: string;
  especialidade: string;
  email: string;
}) {
  const veterinario = await prisma.veterinario.create({
    data: dados,
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