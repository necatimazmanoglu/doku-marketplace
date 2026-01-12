import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pendingProducts = await prisma.product.findMany({
      where: {
        isApproved: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pendingProducts);
  } catch (error) {
    console.error('API ERROR: /api/admin/pending-products', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
