// src/app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from '@/lib/auth';

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
  }

  const decoded = getToken(token);  // Função que decodifica o JWT

  if (!decoded || !decoded.id) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },  // Busca o usuário no banco de dados
    select: { id: true, name: true, email: true },  // Retorna apenas os campos que precisamos
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(user);
}
