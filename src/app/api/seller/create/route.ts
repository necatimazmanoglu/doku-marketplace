import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const body = await req.json();
    const { shopName, iban, taxId, address, isTermsAccepted } = body;

    // Basit doğrulama
    if (!shopName || !iban || !address || !isTermsAccepted) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun ve sözleşmeyi kabul edin." }, { status: 400 });
    }

    // Satıcı profili oluştur
    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        shopName,
        iban,
        taxId,
        address,
        isTermsAccepted,
      },
    });

    return NextResponse.json({ success: true, sellerProfile });

  } catch (error: any) {
    console.error("Satıcı kayıt hatası:", error);
    // Eğer zaten kaydı varsa (Unique constraint)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Zaten bir satıcı hesabınız var." }, { status: 400 });
    }
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
  }
}