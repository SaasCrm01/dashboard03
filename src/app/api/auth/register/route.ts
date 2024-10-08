import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // Verifica se o email já está em uso
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Este email já está cadastrado.' },
      { status: 400 }
    );
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria um novo usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  });
}
