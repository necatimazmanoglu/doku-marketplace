import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Oturum açmalısınız" }, { status: 401 });

  const body = await request.json();
  const { shopName, iban, taxId, address } = body;

  // Basit validasyon
  if (!shopName || !iban || !address) {
    return NextResponse.json({ error: "Eksik bilgi: Mağaza adı, IBAN ve adres zorunludur." }, { status: 400 });
  }

  try {
    // Kullanıcının zaten bir satıcı profili var mı kontrol edelim (Çift kayıt olmasın)
    const existingSeller = await prisma.sellerProfile.findUnique({
      where: { userId: user.id }
    });

    if (existingSeller) {
      return NextResponse.json({ error: "Zaten bir satıcı hesabınız var." }, { status: 400 });
    }

    // Yeni profili oluştur
    await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        shopName,
        iban,
        taxId: taxId || null,
        address,
        isTermsAccepted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Satıcı kayıt hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}