import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { uploadMiddleware } from '@/middleware/uploadMiddleware';
import { promisify } from 'util';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const runMiddleware = promisify(uploadMiddleware);

export async function POST(req: Request) {
  try {
    await runMiddleware(req as any, {} as any);
  } catch (error) {
    console.error('Erro no middleware de upload:', error);
    return NextResponse.json({ message: 'Erro ao processar o upload' }, { status: 500 });
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const decodedToken = jwt.verify(token, JWT_SECRET) as { id: number };

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const photoFile = formData.get('photo') as File;

  if (!name || isNaN(price)) {
    return NextResponse.json({ message: 'Nome e preço são obrigatórios' }, { status: 400 });
  }

  const photoPath = photoFile ? `/uploads/${photoFile.name}` : null;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        photo: photoPath,
        createdBy: decodedToken.id, // Registra o criador do produto
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ message: 'Erro ao criar produto' }, { status: 500 });
  }
}
