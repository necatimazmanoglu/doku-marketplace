// src/app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const orderId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        product: true,
      },
    });

    if (!order || order.buyerId !== userId) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDER_GET_ERROR]', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
