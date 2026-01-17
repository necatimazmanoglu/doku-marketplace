import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Geçersiz tutar" }, { status: 400 });
    }

    // Satıcıyı Bul
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    if (!seller.iban) {
      return NextResponse.json({ error: "Ödeme alabilmek için önce IBAN eklemelisiniz." }, { status: 400 });
    }

    if (seller.balance < amount) {
      return NextResponse.json({ error: "Yetersiz bakiye" }, { status: 400 });
    }

    // TRANSACTION: Hem bakiyeyi düş, hem talep oluştur (Atomik İşlem)
    // Böylece biri olur diğeri olmazsa veri bozulmaz.
    await prisma.$transaction([
      // 1. Bakiyeyi Düş
      prisma.sellerProfile.update({
        where: { id: seller.id },
        data: { balance: { decrement: amount } }
      }),
      // 2. Talep Oluştur
      prisma.payoutRequest.create({
        data: {
          amount: amount,
          iban: seller.iban,
          status: "PENDING",
          sellerId: seller.id
        }
      })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Para çekme hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}