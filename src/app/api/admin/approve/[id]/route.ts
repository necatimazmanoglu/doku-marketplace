// ✅ Ürünü onaylama API endpointi

import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: { isApproved: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[APPROVE_ERROR]', error);
    return NextResponse.json({ error: 'Onay hatası' }, { status: 500 });
  }
}
