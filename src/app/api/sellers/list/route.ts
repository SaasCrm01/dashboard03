// src/app/api/clients/list/route.ts

// This API route lists clients by sellerId. If no sellerId is provided, it returns all clients.
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url); 
    const sellerId = searchParams.get('sellerId'); 

    const clients = sellerId
      ? await prisma.client.findMany({
          where: { sellerId: parseInt(sellerId) }, // Filter by sellerId
        })
      : await prisma.client.findMany(); // Return all clients if no sellerId is provided

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}
