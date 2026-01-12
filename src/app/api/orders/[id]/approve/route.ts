import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

// Bu API, POST isteği aldığında siparişi onaylar
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 için Promise
) {
  try {
    const { id } = await params;

    // 1. Siparişi bul ve güncelle
    await prisma.order.update({
      where: { id },
      data: {
        status: "COMPLETED", // Durumu "Tamamlandı" yap
      },
    });

    // 2. İşlem bitince kullanıcıyı sayfayı yenilemesi için aynı yere yönlendir
    // (Böylece yeşil "Ödendi" yazısını ve İndirme butonunu görecek)
  } catch (error) {
    console.error("Ödeme onay hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }

  // İşlem başarılıysa sayfayı yenilemek için yönlendiriyoruz
  const { id } = await params;
  redirect(`/orders/${id}`);
}