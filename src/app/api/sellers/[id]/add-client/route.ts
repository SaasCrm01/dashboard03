// src/app/api/sellers/[id]/add-client/route.ts

// This API route adds a client to a seller by assigning the sellerId to the client.
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
        sellerId: parseInt(params.id), // Links client to the seller
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao adicionar cliente' }, { status: 500 });
  }
}
