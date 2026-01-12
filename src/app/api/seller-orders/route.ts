// src/app/api/seller-orders/route.ts
import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Eksik kullanıcı ID' }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: {
      sellerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(orders);
}
