// src/app/api/clients-with-sellers/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

    let clients;

    // Se for um PRINCIPAL, exiba todos os clientes que ele criou e seus vendedores associados
    if (decodedToken.role === 'PRINCIPAL') {
      clients = await prisma.client.findMany({
        where: { createdBy: decodedToken.id },  // Filtrar clientes criados por este PRINCIPAL
        include: { seller: true },              // Inclui o vendedor associado
      });
    } else if (decodedToken.role === 'SELLER') {
      // Se for um SELLER, exiba apenas os clientes que ele gerencia
      clients = await prisma.client.findMany({
        where: { sellerId: decodedToken.id },   // Filtra clientes gerenciados por este SELLER
        include: { seller: true },              // Inclui o vendedor (self)
      });
    } else {
      return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
    }

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    return NextResponse.json({ message: 'Erro ao carregar clientes' }, { status: 500 });
  }
}
