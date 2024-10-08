// src/app/api/sellers/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
// import { bcrypt } from 'bcrypt';
import bcrypt from 'bcrypt';


export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Certifique-se de usar bcrypt

    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // Certifique-se de que o campo role exista no modelo User
      },
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao adicionar vendedor' }, { status: 500 });
  }
}
