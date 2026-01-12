import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json([], { status: 400 });

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const result = purchases.map((purchase) => ({
    id: purchase.product.id,
    title: purchase.product.title,
    description: purchase.product.description,
    price: purchase.product.price,
    author: purchase.product.author,
    category: purchase.product.category,
    purchaseDate: purchase.createdAt
  }));

  return NextResponse.json(result);
}
