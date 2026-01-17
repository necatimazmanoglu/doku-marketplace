import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Kullanıcıyı tanı
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum açmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    // 2. Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // 3. Siparişi oluştur (STATUS: COMPLETED olarak)
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        productTitle: product.title,
        pricePaid: product.price,
        status: "COMPLETED", // Ödenmiş gibi işaretliyoruz
        buyerId: user.id,
        buyerEmail: user.emailAddresses[0].emailAddress,
        sellerId: product.sellerId,
        // downloadToken ve orderNumber otomatik oluşur (Schema'da default ayarlı)
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}