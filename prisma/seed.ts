/// <reference types="node" />

import bcrypt from 'bcryptjs'; 
import { prisma } from '../src/config/prisma';

async function main() {

    console.log('Iniciando o seed da base de dados Clinica Veterinaria....');
    
    
    const senhaCriptografada = await bcrypt.hash('senha123456789', 10);

    console.log('Cadastrando funcionarios...');

    await prisma.usuario.create({
        data: {
            nome: 'Luíza Gazzoni Tagliabui',
            email: 'luiza.recepcao@clinica.com',
            senha: senhaCriptografada,
            tipo: 'RECEPCIONISTA',
        },
    });

    const usuarioVet1 = await prisma.usuario.create({
        data: {
            nome: 'Dr Tiago Gazzoni Tagliabui',
            email: 'tiago.tagliabui@clinica.com',
            senha: senhaCriptografada,
            tipo: "VETERINARIO",
            veterinario: {
                create: {
                    crmv: 'CRMV - RJ12345',
                    email: 'tiago.tagliabui@clinica.com', 
                    especialidade: 'Clinico Geral'
                },
            },
        },
    });

    const vet1 = await prisma.veterinario.findUnique({
        where: {
            usuarioId: usuarioVet1.id
        },
    });

    const usuarioVet2 = await prisma.usuario.create({
        data: {
            nome: 'Dra Fernanda Silva',
            email: 'fer.vet@clinica.com',
            senha: senhaCriptografada,
            tipo: 'VETERINARIO',   
            veterinario: {
                create: {
                    crmv: 'CRMV-RJ2222',
                    email: 'fer.vet@clinica.com', 
                    especialidade: 'Ortopedia',
                },
            },
        },
    });

    const vet2 = await prisma.veterinario.findUnique({
        where: { usuarioId: usuarioVet2.id }, 
    });

    console.log('Cadastrando clientes...');

   
    const cliente1 = await prisma.cliente.create({
        data: {
            nome: 'Mariana Oliveira',
            cpf: '123.456.789-00',
            email: 'mariana.oliveira@email.com',
            telefone: '(11) 98888-7777',
        },
    });

    const cliente2 = await prisma.cliente.create({
        data: {
            nome: 'Roberto Santos',
            cpf: '987.654.321-11',
            email: 'roberto.santos@email.com',
            telefone: '(11) 97777-6666',
        },
    });

    console.log('Cadastrando animais...');

    const animal1 = await prisma.animal.create({
        data: {
            clienteId: cliente1.id,
            nome: 'Thor',
            especie: 'Cão',
            raca: 'Golden Retriever',
            dataNascimento: new Date('2022-03-15'),
        },
    });

    const animal2 = await prisma.animal.create({
        data: {
            clienteId: cliente2.id,
            nome: 'Mingau',
            especie: 'Gato',
            raca: 'Siamês',
            dataNascimento: new Date('2023-08-20'),
        },
    });

    const animal3 = await prisma.animal.create({
        data: {
            clienteId: cliente2.id,
            nome: 'Luna',
            especie: 'Cão',
            raca: 'Poodle',
            dataNascimento: new Date('2021-01-10'),
        },
    });

    
    console.log('Agendando consultas e gerando prontuários de exemplo...');

    if (vet1) {
        await prisma.consulta.create({
            data: {
                animalId: animal1.id,
                veterinarioId: vet1.id,
                dataHorario: new Date('2026-09-01T14:00:00Z'),
                status: 'CONCLUIDA',
                prontuario: {
                    create: {
                        diagnostico: 'Dermatite leve na região do dorso.',
                        prescricao: 'Shampoo antisséptico 2x por semana durante 15 dias.',
                        dataRetorno: new Date('2026-09-16T14:00:00Z'),
                    },
                },
            },
        });
    }

    if (vet2) {
        await prisma.consulta.create({
            data: {
                animalId: animal2.id,
                veterinarioId: vet2.id,
                dataHorario: new Date('2026-09-12T10:30:00Z'),
                status: 'AGENDADA',
            },
        });
    }

    console.log('Seed finalizado com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro ao executar o seed:', e);
        process.exit(1);
    }) 
    .finally(async () => {
        await prisma.$disconnect();
    });