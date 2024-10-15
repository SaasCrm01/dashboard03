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

export const config = {
  matcher: [
    // Protege todas as rotas da API, exceto registro e login
    '/api/:path((?!auth/register|auth/login).*)',
  ],
};
