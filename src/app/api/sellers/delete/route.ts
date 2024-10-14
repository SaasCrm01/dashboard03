// src/app/api/sellers/delete/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET); // Apenas validar o token

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID do vendedor não fornecido.' }, { status: 400 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: Number(id), role: 'SELLER' },
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado.' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: 'Vendedor excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir vendedor:', error);
    return NextResponse.json({ message: 'Erro ao excluir vendedor.' }, { status: 500 });
  }
}
