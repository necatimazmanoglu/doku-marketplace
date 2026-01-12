import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'; // DÜZELTİLDİ: /server eklendi

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        product: true,
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Güvenlik kontrolü: Sadece alıcı veya satıcı görebilir
    if (order.buyerId !== userId && order.product.sellerId !== userId) {
       return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}