// src/app/api/sellers/update/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    // Parse o corpo da requisição para pegar o ID e os dados do vendedor
    const { id, name, email, password } = await req.json();

    // Verifique se o vendedor existe no banco de dados
    const seller = await prisma.seller.findUnique({
      where: { id: Number(id) },
    });

    // Se o vendedor não for encontrado, retorne um erro 404
    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado.' }, { status: 404 });
    }

    // Hash da nova senha, se fornecida
    const updatedData: any = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Atualiza o vendedor no banco de dados
    const updatedSeller = await prisma.seller.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    // Retorna o vendedor atualizado
    return NextResponse.json(updatedSeller, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar vendedor.' }, { status: 500 });
  }
}

