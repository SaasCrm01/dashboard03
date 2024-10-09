// src/app/api/sellers/[id]/add-client/route.ts

// src/app/api/sellers/[id]/add-client/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { clientId } = await req.json(); // Recebe o ID do cliente existente

  if (!clientId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido.' }, { status: 400 });
  }

  try {
    // Verifique se o cliente existe
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado.' }, { status: 404 });
    }

    // Associa o cliente ao vendedor
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(clientId) },
      data: {
        sellerId: parseInt(params.id), // Vincula o cliente ao vendedor
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error('Erro ao associar cliente ao vendedor:', error);
    return NextResponse.json({ message: 'Erro ao associar cliente ao vendedor' }, { status: 500 });
  }
}
