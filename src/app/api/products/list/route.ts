// src/app/api/products/list/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number };

    // Filtrar os produtos criados pelo usuário logado
    const products = await prisma.product.findMany({
      where: {
        createdBy: decodedToken.id, // Apenas produtos do criador logado
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar produtos';
    return NextResponse.json({ message }, { status: 500 });
  }
}
