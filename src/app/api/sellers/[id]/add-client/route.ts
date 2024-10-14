// src/app/api/sellers/[id]/add-client/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req: Request) {
  const { clientId } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string, createdBy: number };

    if (decodedToken.role !== 'PRINCIPAL' && decodedToken.role !== 'SELLER') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    // Verificar se o vendedor foi criado pelo usuário principal logado
    const seller = await prisma.user.findFirst({
      where: { id: decodedToken.id, role: 'SELLER', createdBy: decodedToken.createdBy }
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado ou você não tem permissão para adicionar clientes.' }, { status: 403 });
    }

    // Associar cliente ao vendedor
    const client = await prisma.client.update({
      where: { id: clientId },
      data: { sellerId: decodedToken.id },
    });

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao associar cliente' }, { status: 500 });
  }
}
