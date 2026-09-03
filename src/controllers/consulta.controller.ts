import { Request, Response } from 'express';
import * as consultaService from '../services/consulta.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { animalId, veterinarioId, dataHorario } = req.body;

  const consultaCriada = await consultaService.criarConsulta({ animalId, veterinarioId, dataHorario });
  res.status(201).json(consultaCriada);
}

export async function listar(req: Request, res: Response): Promise<void> {
  // req.query: parâmetros de query string (o que vem depois do "?" na URL),
  // ex.: /consultas?status=Agendada.
  const status = req.query.status as string | undefined;

  const consultas = await consultaService.listarConsultas(status);
  res.status(200).json(consultas);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  const consulta = await consultaService.buscarConsultaPorId(id);
  res.status(200).json(consulta);
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  const consultaAtualizada = await consultaService.atualizarConsulta(id, req.body);
  res.status(200).json(consultaAtualizada);
}