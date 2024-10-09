// src/app/api/sellers/[id]/clients/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Busca os clientes associados ao vendedor pelo sellerId
    const clients = await prisma.client.findMany({
      where: { sellerId: parseInt(params.id) }, // Filtra por vendedor
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar clientes do vendedor:', error);
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}
