import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Chave secreta usada para assinar o JWT (idealmente, deve ser armazenada em variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Email ou senha incorretos.' },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: 'Email ou senha incorretos.' },
      { status: 401 }
    );
  }

  // Gerar um token JWT para o usuário
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role }, // Inclui a role do usuário
    JWT_SECRET,
    { expiresIn: '1h' }  // Token expira em 1 hora
  );

  return NextResponse.json({
    token,  // Retorna o token para ser usado no frontend
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}
