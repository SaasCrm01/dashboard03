// src/app/api/sellers/create/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

  if (decodedToken.role !== 'PRINCIPAL') {
    return NextResponse.json({ message: 'Apenas usuários principais podem adicionar vendedores.' }, { status: 403 });
  }

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Nome, email e senha são obrigatórios' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ message: 'Email já cadastrado' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const seller = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'SELLER',
      createdBy: decodedToken.id, // Links to the Principal User
    },
  });

  return NextResponse.json(seller, { status: 201 });
}
