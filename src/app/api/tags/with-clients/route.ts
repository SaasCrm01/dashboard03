// src/app/api/tags/with-clients/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Busca todas as tags com seus clientes associados
    const tags = await prisma.tag.findMany({
      include: {
        clients: true, // Inclui os clientes associados a cada tag
      },
    });

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar tags com clientes';
    return NextResponse.json({ message }, { status: 500 });
  }
}
