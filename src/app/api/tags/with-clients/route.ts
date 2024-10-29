// src/app/api/tags/with-clients/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { id: number, role: string };

  try {
    let tags;

    if (decoded.role === 'PRINCIPAL') {
      // Retorna todas as tags para o usuário principal
      tags = await prisma.tag.findMany({ include: { clients: true } });
    } else if (decoded.role === 'SELLER') {
      // Retorna apenas as tags criadas pelo vendedor ou associadas aos seus clientes
      tags = await prisma.tag.findMany({
        where: {
          OR: [
            { createdBy: decoded.id }, // Tags criadas pelo vendedor
            {
              clients: {
                some: { sellerId: decoded.id } // Tags associadas a clientes do vendedor
              }
            }
          ]
        },
        include: { clients: true }
      });
    }

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar tags';
    return NextResponse.json({ message }, { status: 500 });
  }
}
