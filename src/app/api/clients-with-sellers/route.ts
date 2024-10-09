// src/app/api/clients-with-sellers/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Busca todos os clientes com seus respectivos vendedores
    const clients = await prisma.client.findMany({
      include: {
        seller: true, // Inclui os dados do vendedor associado
      },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar clientes com vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar clientes com vendedores' }, { status: 500 });
  }
}
