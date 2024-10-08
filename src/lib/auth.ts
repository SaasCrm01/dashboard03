// src/lib/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function getToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verifica se o token é do tipo JwtPayload (objeto) e não uma string
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as JwtPayload;
    }
    return null;
  } catch (err) {
    throw new Error('Token inválido ou expirado.');
  }
}
