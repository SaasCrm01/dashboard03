// src/app/api/clients/list/route.ts

// src/app/api/sellers/list/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Busca apenas os vendedores com role SELLER na tabela User
    const sellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}

