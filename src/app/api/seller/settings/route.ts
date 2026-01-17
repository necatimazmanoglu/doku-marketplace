import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    // Website ve Instagram'ı buradan kaldırdık
    const { shopName, description, iban } = body;

    // Basit Validasyon
    if (!shopName) {
      return NextResponse.json({ error: "Mağaza adı zorunludur" }, { status: 400 });
    }

    // Güncelleme İşlemi
    const updatedSeller = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        shopName,
        description,
        iban,
        // website ve instagram veritabanına yazılmayacak
      }
    });

    return NextResponse.json({ success: true, seller: updatedSeller });

  } catch (error) {
    console.error("Ayar güncelleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}