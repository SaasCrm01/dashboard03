// src/app/api/clients/update/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    // Extraindo o ID da URL
    const segments = req.url.split("/");
    const id = segments.pop() || segments.pop();  // Verifica se o último valor é o ID, e pega o penúltimo caso o último seja vazio

    // Verifique se o ID foi enviado corretamente
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: 'ID do vendedor inválido ou não fornecido.' }, { status: 400 });
    }

    const { name, email, password } = await req.json();

    // Verifique se o vendedor existe na tabela User
    const seller = await prisma.user.findUnique({
      where: { id: Number(id), role: 'SELLER' },
    });

    if (!seller) {
      return NextResponse.json({ message: 'Vendedor não encontrado.' }, { status: 404 });
    }

    const updatedData: any = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Atualiza o vendedor na tabela User
    const updatedSeller = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    return NextResponse.json(updatedSeller, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar vendedor.' }, { status: 500 });
  }
}
