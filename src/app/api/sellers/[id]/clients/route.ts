// ROTA PARA LISTAR CLIENTES ASSOCIADOS A UM VENDEDOR (PARA USO NO DASHBOARD DE VENDEDORES)
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

    if (decodedToken.role !== 'SELLER' || decodedToken.id !== parseInt(params.id)) {
      return NextResponse.json({ message: 'Acesso não autorizado' }, { status: 403 });
    }

    // Busca os clientes associados ao vendedor pelo sellerId
    const clients = await prisma.client.findMany({
      where: { sellerId: parseInt(params.id) },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar clientes' }, { status: 500 });
  }
}

