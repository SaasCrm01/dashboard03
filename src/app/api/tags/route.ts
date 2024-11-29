//src/app/api/tags/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Função para verificar e decodificar o token JWT
function verifyToken(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Token não fornecido');

  try {
    return jwt.verify(token, JWT_SECRET); // Decodifica o token JWT
  } catch (error) {
    throw new Error('Token inválido');
  }
}

// GET: Lista apenas as tags criadas pelo usuário autenticado
export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request) as { id: number; role: string }; // Decodifica e obtém o ID do usuário

    const tags = await prisma.tag.findMany({
      where: { createdBy: decoded.id }, // Filtra as tags pelo criador
    });

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar tags';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Cria uma nova tag vinculada ao usuário autenticado
export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request) as { id: number }; // Verifica o token e obtém o ID do usuário
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'O nome é obrigatório' }, { status: 400 });
    }

    const newTag = await prisma.tag.create({
      data: { 
        name,
        createdBy: decoded.id, // Associa a tag ao usuário autenticado
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
