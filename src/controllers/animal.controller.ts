import { Request, Response } from 'express';
import * as animalService from '../services/animal.service';

// Todas as rotas de animal passam pelo authMiddleware antes de chegar aqui
// (ver animal.routes.ts), por isso "req.user!.id" é seguro: se não houvesse
// um cliente autenticado, o próprio authMiddleware já teria barrado com 401.

export async function cadastrar(req: Request, res: Response): Promise<void> {
  const clienteId = req.user!.id;
  const { nome, especie, raca, dataNascimento } = req.body;

  const novoAnimal = await animalService.cadastrarAnimal(clienteId, { nome, especie, raca, dataNascimento });
  res.status(201).json(novoAnimal);
}

export async function listar(req: Request, res: Response): Promise<void> {
  const clienteId = req.user!.id;
  const animais = await animalService.listarAnimaisDoCliente(clienteId);
  res.status(200).json(animais);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;
  const animal = await animalService.buscarAnimalPorId(id, clienteId);
  res.status(200).json(animal);
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;
  const { nome, especie, raca, dataNascimento } = req.body;

  const resultado = await animalService.atualizarAnimal(id, clienteId, { nome, especie, raca, dataNascimento });
  res.status(200).json({ mensagem: 'Animal atualizado com sucesso.', animal: resultado });
}

export async function deletar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;

  const resultado = await animalService.removerAnimal(id, clienteId);
  res.status(200).json({ mensagem: 'Animal removido com sucesso.', animal: resultado });
}

export async function obterIdade(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const clienteId = req.user!.id;

  const idade = await animalService.obterIdadeAnimal(id, clienteId);
  res.status(200).json({ idade });
}