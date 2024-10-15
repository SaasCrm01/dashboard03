// src/app/api/sellers/[id]/add-client/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { clientId } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

    const sellerId = parseInt(params.id); // Converte o ID do vendedor para Int
    const parsedClientId = parseInt(clientId); // Converte o ID do cliente para Int

    if (isNaN(sellerId) || isNaN(parsedClientId)) {
      return NextResponse.json({ message: 'IDs inválidos.' }, { status: 400 });
    }

    // Verificar se o usuário é PRINCIPAL ou SELLER
    if (decodedToken.role !== 'PRINCIPAL' && decodedToken.role !== 'SELLER') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    // Validar se o vendedor existe e, se for PRINCIPAL, verificar se ele o criou
    const seller = await prisma.user.findFirst({
      where: {
        id: sellerId,
        role: 'SELLER',
        ...(decodedToken.role === 'PRINCIPAL' ? { createdBy: decodedToken.id } : {}),
      },
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado ou sem permissão.' }, { status: 403 });
    }

    // Associar o cliente ao vendedor
    const client = await prisma.client.update({
      where: { id: parsedClientId },
      data: { sellerId: sellerId },
    });

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error('Erro ao associar cliente:', error);
    return NextResponse.json({ message: 'Erro ao associar cliente' }, { status: 500 });
  }
}
