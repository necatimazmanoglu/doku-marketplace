import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      price,
      category,
      tags,
      pdfUrl,
      fileName,
      fileSize,
      sellerId
    } = body;

    if (
      !title ||
      !description ||
      !price ||
      !pdfUrl ||
      !fileName ||
      !fileSize ||
      !sellerId
    ) {
      return NextResponse.json(
        { error: 'Eksik alanlar var.' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        tags,
        pdfUrl,
        fileName,
        fileSize,
        sellerId,
        isActive: true,
        isApproved: false,
        views: 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[PRODUCT_POST]', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
