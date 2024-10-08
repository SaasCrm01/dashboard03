import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, phone, sellerId } = await req.json();

    // Validação de dados obrigatórios (sellerId pode ser opcional)
    if (!name || !email || !phone) {
      return NextResponse.json({ message: 'Nome, email e telefone são obrigatórios' }, { status: 400 });
    }

    // Criando o cliente no banco de dados
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        sellerId: sellerId || null, // sellerId pode ser opcional, definindo como null se não for enviado
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ message: 'Erro ao criar cliente' }, { status: 500 });
  }
}
