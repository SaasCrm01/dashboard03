// src/app/api/sellers/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET); // Apenas validar o token

    const { id, name, email, password } = await req.json();

    const seller = await prisma.user.findUnique({
      where: { id: Number(id), role: 'SELLER' },
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado.' }, { status: 404 });
    }

    const updatedData: any = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedSeller = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    return NextResponse.json(updatedSeller, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar vendedor.' }, { status: 500 });
  }
}
