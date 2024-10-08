import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Busca todos os vendedores (com role SELLER)
    const sellers = await prisma.user.findMany({
      where: { role: 'SELLER' },
      select: { id: true, name: true, email: true }, // Retorna apenas os dados relevantes
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar vendedores:', error);
    return NextResponse.json({ message: 'Erro ao listar vendedores' }, { status: 500 });
  }
}
