import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

    if (decodedToken.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
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

    // Remova a referência ao campo `createdBy`
    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SELLER', // Criando o vendedor sem `createdBy`
      },
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao cadastrar vendedor' }, { status: 500 });
  }
}
