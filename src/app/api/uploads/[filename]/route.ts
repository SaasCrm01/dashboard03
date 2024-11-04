// src/app/api/uploads/[filename]/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { filename: string } }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png', // ou outro tipo de imagem se necessário
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    return NextResponse.json({ message: 'Imagem não encontrada' }, { status: 404 });
  }
}
