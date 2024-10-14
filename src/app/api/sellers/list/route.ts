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

    if (decodedToken.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    // Remova o filtro `createdBy` aqui, pois não é mais necessário
    const sellers = await prisma.user.findMany({
      where: {
        role: 'SELLER',
      },
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}
