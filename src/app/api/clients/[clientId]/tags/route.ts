// src/app/api/clients/[clientId]/tags/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request, 
  { params }: { params: { clientId: string } }
) {
  const { tagIds } = await request.json();

  if (!Array.isArray(tagIds)) {
    return NextResponse.json({ error: 'tagIds must be an array' }, { status: 400 });
  }

  const clientId = parseInt(params.clientId, 10);

  if (isNaN(clientId)) {
    return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
  }

  try {
    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        tags: {
          connect: tagIds.map((tagId: number) => ({ id: tagId })),
        },
      },
      include: { tags: true },
    });

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error associating tags to client';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
