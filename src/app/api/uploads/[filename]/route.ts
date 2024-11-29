// src/app/api/uploads/[filename]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { filename: string } }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'public/uploads', filename); // Corrige o caminho para a pasta pública

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png', // Ajuste o tipo conforme necessário
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    return NextResponse.json({ message: 'Imagem não encontrada' }, { status: 404 });
  }
}
