// src/app/api/sellers/delete/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID do vendedor é necessário' }, { status: 400 });
    }

    await prisma.seller.delete({
      where: { id }, // A propriedade deve ser id do Seller
    });

    return NextResponse.json({ message: 'Vendedor excluído com sucesso' }, { status: 200 });
  } catch (error) {
    console.error(error); // Adicione esta linha para ver o erro no console
    return NextResponse.json({ message: 'Erro ao excluir vendedor' }, { status: 500 });
  }
}
