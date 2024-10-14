import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number };

    // Substitua userId por sellerId
    const clients = await prisma.client.findMany({
      where: { sellerId: decodedToken.id }, // Retorna apenas os clientes associados ao vendedor logado
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}
