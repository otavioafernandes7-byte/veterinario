import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarConsultaInput {
  animalId: number;
  veterinarioId: number;
  dataHorario: Date;
}

interface AtualizarConsultaInput {
  animalId?: number;
  veterinarioId?: number;
  dataHorario?: Date;
  status?: string;
}

export async function criarConsulta(dados: CriarConsultaInput) {
  const consulta = await prisma.consulta.create({
    data: { ...dados, status: 'AGENDADA' },
    include: { animal: true, veterinario: true }
  });
  return consulta;
}

export async function listarConsultas(status?: string) {
  return await prisma.consulta.findMany({
    where: status ? { status } : {},
    include: { animal: true, veterinario: true },
    orderBy: { dataHorario: 'asc' }
  });
}

export async function buscarConsultaPorId(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
    include: { animal: true, veterinario: true }
  });

  if (!consulta) {
    throw new AppError('Consulta não encontrada.', 404);
  }

  return consulta;
}

export async function atualizarConsulta(id: number, dados: AtualizarConsultaInput) {
  await buscarConsultaPorId(id);

  const consultaAtualizada = await prisma.consulta.update({
    where: { id },
    data: dados,
    include: { animal: true, veterinario: true }
  });

  return consultaAtualizada;
}

export async function deletarConsulta(id: number) {
  await buscarConsultaPorId(id);
  await prisma.consulta.delete({ where: { id } });
}