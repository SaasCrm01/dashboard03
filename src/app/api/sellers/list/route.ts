// src/app/api/sellers/list/route.ts

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

    if (decodedToken.role !== 'PRINCIPAL') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    // Filtrar apenas os vendedores criados pelo usuário principal logado
    const sellers = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        createdBy: decodedToken.id, // Somente vendedores criados por este PRINCIPAL
      },
      include: {
        managedClients: true,  // Inclui os clientes gerenciados por cada vendedor
      },
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}
