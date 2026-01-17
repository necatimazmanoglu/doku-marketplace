import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    // Admin kontrolü
    if (user?.emailAddresses[0].emailAddress !== "necatimazmanoglu@gmail.com") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const body = await request.json();
    const { rate } = body; // Örn: 5, 10, 20 gibi sayı gelecek

    // Oranı güncelle (Null gelirse standarta döner)
    await prisma.sellerProfile.update({
      where: { id }, // Satıcı Profil ID'sine göre
      data: {
        commissionRate: rate ? parseFloat(rate) : null
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}