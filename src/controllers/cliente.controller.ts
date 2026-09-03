import { Request, Response } from 'express';
import * as clienteService from '../services/cliente.service';

// req.body: dados enviados no CORPO da requisição (já convertido de JSON para
// objeto JS pelo middleware express.json(), registado em app.ts).
export async function criar(req: Request, res: Response): Promise<void> {
  const { nome, cpf, email, senha, telefone } = req.body;

  const cliente = await clienteService.criarCliente({ nome, cpf, email, senha, telefone });

  // res.status(codigo).json(objeto): define o status HTTP da resposta e a
  // serializa como JSON. 201 = "Created", um novo recurso foi criado.
  res.status(201).json(cliente);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  const clientes = await clienteService.listarClientes();
  res.status(200).json(clientes);
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  // req.params: parâmetros dinâmicos da URL (ex.: a rota "/clientes/:id" faz
  // o Express popular req.params.id). Chega sempre como string — por isso o
  // Number(...) explícito.
  const id = Number(req.params.id);

  const cliente = await clienteService.buscarClientePorId(id);

  res.status(200).json(cliente);
}