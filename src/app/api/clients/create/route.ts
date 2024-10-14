// src/app/api/clients/create/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req: Request) {
  const { name, email, phone, sellerId } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

  if (!name || !email || !phone) {
    return NextResponse.json({ message: 'Nome, email, e telefone são obrigatórios' }, { status: 400 });
  }

  let createdBy = decodedToken.id;
  if (decodedToken.role === 'SELLER' && sellerId && sellerId !== decodedToken.id) {
    return NextResponse.json({ message: 'Você não pode criar clientes para outro vendedor.' }, { status: 403 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone,
      sellerId: sellerId || null,
      createdBy, // Tracks the Principal User who created the client
    },
  });

  return NextResponse.json(client, { status: 201 });
}
