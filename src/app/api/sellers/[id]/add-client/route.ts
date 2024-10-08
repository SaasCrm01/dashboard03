// src/app/api/sellers/[id]/add-client/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { name, email, phone } = await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        sellerId: parseInt(params.id), // Certifique-se de que o campo sellerId exista no modelo Client
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao adicionar cliente' }, { status: 500 });
  }
}
