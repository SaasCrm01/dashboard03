// src/app/api/clients/list/route.ts

// src/app/api/sellers/list/route.ts
// src/app/api/sellers/list/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: 'SELLER' }, // Retorna apenas usuários com o papel de vendedor
    });
    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}
