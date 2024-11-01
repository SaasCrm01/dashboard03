    // src/app/api/products/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { name, description, price } = await req.json();

  if (!name || !price) {
    return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
    