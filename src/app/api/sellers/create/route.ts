// src/app/api/sellers/create/route.ts

// This API route registers a seller in the User table with the role SELLER.
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

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
        role: 'SELLER', // Setting role as SELLER
      },
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao cadastrar vendedor' }, { status: 500 });
  }
}
