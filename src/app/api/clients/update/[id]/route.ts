import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, phone, sellerId } = await req.json();
    const id = parseInt(params.id); // Pega o ID da URL

    if (!name || !email || !phone) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }

    const updatedClient = await prisma.client.update({
      where: { id }, // Usa o ID da URL para localizar o cliente
      data: {
        name,
        email,
        phone,
        ...(sellerId && { sellerId }), // Adiciona sellerId se fornecido
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json({ message: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}
