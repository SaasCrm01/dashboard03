// src/app/api/sellers/update/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const { id, name, email, password } = await req.json();

    // Logando os dados recebidos
    console.log('Atualizando vendedor:', { id, name, email, password });

    // Log do ID recebido
    console.log("ID recebido:", id);

    if (!id || !name || !email) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }

    // Verificando se o vendedor existe
    const existingSeller = await prisma.seller.findUnique({
      where: { id: Number(id) },
    });

    // Log para verificar se o vendedor existe
    console.log("Vendedor encontrado:", existingSeller);

    if (!existingSeller) {
      return NextResponse.json({ message: 'Vendedor não encontrado' }, { status: 404 });
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(updatedSeller, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar vendedor' }, { status: 500 });
  }
}

