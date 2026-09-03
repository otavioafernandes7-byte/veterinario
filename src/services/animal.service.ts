import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface AnimalInput {
  nome: string;
  especie: string;
  raca: string;
  dataNascimento: Date;
}

export async function cadastrarAnimal(clienteId: number, dados: AnimalInput) {
  const novoAnimal = await prisma.animal.create({
    data: {
      nome: dados.nome,
      especie: dados.especie,
      raca: dados.raca,
      dataNascimento: dados.dataNascimento,
      clienteId,
    },
  });

  return novoAnimal;
}

export async function listarAnimaisDoCliente(clienteId: number) {
  return prisma.animal.findMany({
    where: { clienteId },
    orderBy: { id: 'desc' },
  });
}

export async function buscarAnimalPorId(id: number, clienteId: number) {
  const animal = await prisma.animal.findUnique({ where: { id } });

  if (!animal || animal.clienteId !== clienteId) {
    throw new AppError('Animal não encontrado.', 404);
  }

  return animal;
}

export async function atualizarAnimal(id: number, clienteId: number, dados: AnimalInput) {
  // Reaproveita buscarAnimalPorId para garantir que o animal existe e
  // pertence ao cliente antes de atualizar.
  await buscarAnimalPorId(id, clienteId);

  return prisma.animal.update({
    where: { id },
    data: {
      nome: dados.nome,
      especie: dados.especie,
      raca: dados.raca,
      dataNascimento: dados.dataNascimento,
    },
  });
}

export async function removerAnimal(id: number, clienteId: number) {
  await buscarAnimalPorId(id, clienteId);

  return prisma.animal.delete({ where: { id } });
}

export async function obterIdadeAnimal(id: number, clienteId: number) {
  const animal = await buscarAnimalPorId(id, clienteId);

  const hoje = new Date();
  let idade = hoje.getFullYear() - animal.dataNascimento.getFullYear();

  const aniversarioJaOcorreuEsteAno =
    hoje.getMonth() > animal.dataNascimento.getMonth() ||
    (hoje.getMonth() === animal.dataNascimento.getMonth() && hoje.getDate() >= animal.dataNascimento.getDate());

  if (!aniversarioJaOcorreuEsteAno) {
    idade -= 1;
  }

  return idade;
}