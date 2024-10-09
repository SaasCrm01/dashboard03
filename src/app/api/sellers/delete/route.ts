// src/app/api/sellers/delete/route.ts

// src/app/api/sellers/delete/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    // Parse o corpo da requisição para pegar o ID
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'ID do vendedor não fornecido.' }, { status: 400 });
    }

    // Verifica se o vendedor existe no modelo `User`
    const seller = await prisma.user.findUnique({
      where: { id: Number(id), role: 'SELLER' },  // Busca apenas vendedores
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado.' }, { status: 404 });
    }

    // Deleta o vendedor da tabela User
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Vendedor excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir vendedor:', error);
    return NextResponse.json({ message: 'Erro ao excluir vendedor.' }, { status: 500 });
  }
}



