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
    const { productId, buyerInfo } = body; 

    // Ürünü ve satıcıyı bul
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Satıcı kendi ürününü alamaz
    if (product.sellerId === userId) {
      return NextResponse.json({ error: "Kendi ürününüzü satın alamazsınız." }, { status: 400 });
    }

    // --- SİMÜLASYON MODU (Hesaplamalar) ---
    const price = product.price;
    const iyzicoRate = 0.0299; 
    const iyzicoFixed = 0.25;
    const paymentProviderFee = (price * iyzicoRate) + iyzicoFixed;
    
    const standardRate = 10; 
    const appliedRate = product.seller.commissionRate !== null ? product.seller.commissionRate : standardRate;
    const platformFee = price * (appliedRate / 100);
    const netEarnings = price - paymentProviderFee - platformFee;

    // Siparişi Oluştur
    const order = await prisma.order.create({
      data: {
        userId: userId,    // <--- KRİTİK DÜZELTME: Bu alan zorunluydu
        buyerId: userId,   
        buyerEmail: user.emailAddresses[0].emailAddress,
        productId: productId,
        productTitle: product.title,
        pricePaid: price,
        paymentProviderFee: parseFloat(paymentProviderFee.toFixed(2)),
        platformFee: parseFloat(platformFee.toFixed(2)),
        netEarnings: parseFloat(netEarnings.toFixed(2)),
        status: "SUCCESS",
        sellerId: product.sellerId,
      },
    });

    // Satıcı Bakiyesini Güncelle
    await prisma.sellerProfile.update({
      where: { userId: product.sellerId },
      data: { balance: { increment: parseFloat(netEarnings.toFixed(2)) } }
    });

    // Başarılı sayfasına yönlendir
    return NextResponse.json({ 
        status: "success", 
        paymentPageUrl: `/orders/${order.id}`, 
        htmlContent: "" 
    });

  } catch (error: any) {
    console.error("Ödeme başlatma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + error.message }, { status: 500 });
  }
}