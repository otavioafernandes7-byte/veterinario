import { Request, Response } from 'express';
import * as veterinarioService from '../services/veterinario.service';

export async function registrar(req: Request, res: Response): Promise<void> {
  const { nome, crmv, especialidade, email, senha } = req.body;
  const veterinario = await veterinarioService.registrarVeterinario({ nome, crmv, especialidade, email, senha });
  res.status(201).json(veterinario);
}


export async function listar(_req: Request, res: Response): Promise<void> {
  const veterinarios = await veterinarioService.listarVeterinarios();
  res.status(200).json(veterinarios);
}

export async function concluir(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const veterinario = await veterinarioService.concluirCadastro(id);
  res.status(200).json({ mensagem: 'Cadastro concluído, veterinário disponível para atendimentos.', veterinario });
}