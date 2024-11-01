// src/app/api/clients/[clientId]/notes/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  const clientId = parseInt(params.clientId, 10);

  if (isNaN(clientId)) {
    return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching notes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  const { content } = await request.json();

  if (typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json({ error: 'Note content must be a non-empty string' }, { status: 400 });
  }

  const clientId = parseInt(params.clientId, 10);

  if (isNaN(clientId)) {
    return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
  }

  try {
    const note = await prisma.note.create({
      data: {
        content,
        clientId,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating note';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
