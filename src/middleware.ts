// src/middleware.ts
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function middleware(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    // Verifica o token JWT
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    // Continua se o token for válido
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 401 });
  }
}

// Atualiza o matcher para seguir o padrão correto
export const config = {
  matcher: ['/api/protected/:path*'],  // Protege qualquer rota que comece com /api/protected
};
