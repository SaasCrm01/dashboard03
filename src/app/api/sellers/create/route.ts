import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validação dos campos obrigatórios
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }

    // Verifica se o email já existe no sistema
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email já cadastrado' }, { status: 400 });
    }

    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o vendedor no banco de dados
    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SELLER', // Define o papel como "vendedor"
      },
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar vendedor:', error);
    return NextResponse.json({ message: 'Erro ao cadastrar vendedor' }, { status: 500 });
  }
}
