import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });

    // Güvenlik: Ürün gerçekten ücretsiz mi?
    if (product.price > 0) {
      return NextResponse.json({ error: "Bu ürün ücretsiz değil!" }, { status: 400 });
    }

    // Sipariş Oluştur
    const order = await prisma.order.create({
      data: {
        userId: userId,     // <--- KRİTİK DÜZELTME: Bu alan zorunluydu
        buyerId: userId,    
        buyerEmail: user.emailAddresses[0].emailAddress,
        productId: product.id,
        productTitle: product.title,
        pricePaid: 0,
        platformFee: 0,
        paymentProviderFee: 0,
        netEarnings: 0,
        status: "SUCCESS",
        sellerId: product.sellerId,
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error: any) {
    console.error("Ücretsiz alma hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız: " + error.message }, { status: 500 });
  }
}