import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { currentUser } from "@clerk/nextjs/server"; // Clerk entegrasyonu

export async function POST(req: Request) {
  try {
    // 1. Kullanıcı giriş yapmış mı bakalım
    const user = await currentUser();

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID eksik." }, { status: 400 });
    }

    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    // Gerekli Verileri Üretelim
    const generatedOrderNumber = `ORD-${Date.now()}`;
    const uniqueDownloadToken = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // İndirme Süresi (7 Gün)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // ALICI BİLGİLERİNİ BELİRLEME
    // Eğer giriş yaptıysa Clerk bilgilerini, yapmadıysa Misafir bilgilerini kullan
    const buyerId = user ? user.id : "guest_buyer_" + Date.now();
    const buyerEmail = user ? (user.emailAddresses[0]?.emailAddress || "no-email@clerk.com") : "guest@example.com";

    // 2. Sipariş Oluşturalım
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        status: "PENDING",
        orderNumber: generatedOrderNumber,
        productTitle: product.title,
        pricePaid: product.price,
        sellerId: product.sellerId,
        downloadToken: uniqueDownloadToken,
        downloadExpiry: expiryDate,

        // GÜNCELLENEN KISIMLAR:
        buyerId: buyerId,       // Gerçek User ID veya Random Misafir ID
        buyerEmail: buyerEmail, // Gerçek Email veya Misafir Email
      },
    });

    return NextResponse.json(order);

  } catch (error: any) {
    console.error("Sipariş API Hatası:", error);
    return NextResponse.json({ 
      error: "Sipariş oluşturulamadı", 
      details: error.message 
    }, { status: 500 });
  }
}