// src/app/api/clients/delete/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id); // Pega o ID da URL

    if (!id) {
      return NextResponse.json({ message: 'ID do cliente é necessário' }, { status: 400 });
    }

    await prisma.client.delete({
      where: { id }, // Usa o ID da URL para excluir o cliente
    });

    return NextResponse.json({ message: 'Cliente excluído com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json({ message: 'Erro ao excluir cliente' }, { status: 500 });
  }
}
