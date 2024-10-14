// ROTA PARA ASSOCIAR CLIENTES A VENDEDORES (SOMENTE USUÁRIO PRINCIPAL)
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { clientId } = await req.json(); // Recebe o ID do cliente existente

  if (!clientId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido.' }, { status: 400 });
  }

  try {
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
