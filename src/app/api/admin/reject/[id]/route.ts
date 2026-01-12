// ✅ Ürünü reddetme (silme) API endpointi

import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Silindi' });
  } catch (error) {
    console.error('[REJECT_ERROR]', error);
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
