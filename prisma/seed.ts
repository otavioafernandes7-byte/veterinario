const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed da base de dados da VetClinic...');

  // ===== VETERINÁRIOS =====
  const vetAna = await prisma.veterinario.create({
    data: { nome: 'Ana Souza', crmv: 'CRMV-RJ 12345', especialidade: 'Clínica Geral', email: 'ana.souza@vetclinic.com' },
  });
  const vetCarlos = await prisma.veterinario.create({
    data: { nome: 'Carlos Lima', crmv: 'CRMV-RJ 67890', especialidade: 'Cirurgia', email: 'carlos.lima@vetclinic.com' },
  });
  console.log('Veterinários criados: Ana Souza (Clínica Geral), Carlos Lima (Cirurgia).');

  // ===== CLIENTE =====
  const senhaHash = await bcrypt.hash('123456', 10);
  const cliente = await prisma.cliente.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: senhaHash,
      telefone: '11999999999',
    },
  });
  console.log('Cliente de teste criado (email: cliente@teste.com, senha: 123456).');

  // ===== ANIMAIS =====
  const animais = await prisma.animal.createMany({
    data: [
      { clienteId: cliente.id, nome: 'Rex', especie: 'Cachorro', raca: 'Labrador', dataNascimento: new Date('2020-05-10') },
      { clienteId: cliente.id, nome: 'Mimi', especie: 'Gato', raca: 'Siamês', dataNascimento: new Date('2021-08-22') },
      { clienteId: cliente.id, nome: 'Thor', especie: 'Cachorro', raca: 'Bulldog', dataNascimento: new Date('2019-01-15') },
    ],
  });
  console.log(`${animais.count} animais cadastrados para o cliente teste.`);

  // Recupera os animais para usar os IDs gerados
  const animalRex = await prisma.animal.findFirst({ where: { nome: 'Rex', clienteId: cliente.id } });
  const animalMimi = await prisma.animal.findFirst({ where: { nome: 'Mimi', clienteId: cliente.id } });

  // ===== CONSULTAS =====
  const consultaRex = await prisma.consulta.create({
    data: {
      animalId: animalRex.id,
      veterinarioId: vetAna.id,
      dataHorario: new Date('2026-09-10T14:00:00'),
      status: 'Agendada',
    },
  });
  const consultaMimi = await prisma.consulta.create({
    data: {
      animalId: animalMimi.id,
      veterinarioId: vetCarlos.id,
      dataHorario: new Date('2026-09-12T10:30:00'),
      status: 'Concluida',
    },
  });
  console.log('2 consultas criadas (1 agendada, 1 concluída).');

  // ===== PRONTUÁRIO =====
  await prisma.prontuario.create({
    data: {
      consultaId: consultaMimi.id,
      diagnostico: 'Otite leve no ouvido esquerdo',
      prescricao: 'Limpeza auricular e antibiótico por 7 dias',
      dataRetorno: new Date('2026-09-19'),
    },
  });
  console.log('Prontuário criado para a consulta concluída da Mimi.');

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((erro) => {
    console.error('Erro ao executar o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });