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

    // Filtra apenas os vendedores criados pelo usuário principal logado
    const sellers = await prisma.user.findMany({
      where: {
        role: 'SELLER',
        createdBy: decodedToken.id, // Mostra apenas os vendedores criados por este principal
      },
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}
