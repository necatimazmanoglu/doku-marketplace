import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "İndirmek için giriş yapmalısınız" }, { status: 401 });
  }

  const body = await request.json();
  const { productId } = body;

  try {
    // 1. Ürünü bul ve gerçekten ücretsiz mi kontrol et (Güvenlik)
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    if (product.price > 0) {
      return NextResponse.json({ error: "Bu ürün ücretsiz değil!" }, { status: 400 });
    }

    // 2. Daha önce indirmiş mi? (İsteğe bağlı, şimdilik her tıklamada sipariş oluştursun veya kontrol edebilirsin)
    // Basit tutalım: Sipariş kaydı oluştur.
    
    await prisma.order.create({
      data: {
        userId: userId,
        productId: productId,
        price: 0,            // Fiyat 0
        status: "SUCCESS",   // Direkt başarılı
        paymentId: "FREE",   // Ödeme ID yerine FREE yazdık
      },
    });

    // 3. Başarılı, indirme linkini (veya direkt URL'i) dön
    return NextResponse.json({ 
      success: true, 
      downloadUrl: product.pdfUrl 
    });

  } catch (error) {
    console.error("Ücretsiz sipariş hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}