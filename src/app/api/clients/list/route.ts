//src/app/api/clints/list/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url); 
    const sellerId = searchParams.get('sellerId'); 

    const clients = sellerId
      ? await prisma.client.findMany({
          where: { sellerId: parseInt(sellerId) }, // Filtra por sellerId se fornecido
        })
      : await prisma.client.findMany(); // Retorna todos os clientes se sellerId não for fornecido

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}
