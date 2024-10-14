// src/app/api/clients/list/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

    // Filtro para buscar apenas os clientes criados pelo usuário logado (PRINCIPAL) ou seus vendedores
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { createdBy: decodedToken.id }, // Clientes criados pelo usuário principal
          { sellerId: decodedToken.id },  // Clientes associados a este vendedor (se for um vendedor logado)
        ]
      }
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}
