import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  // Yönlendirilecek adresi tutacak değişken
  let destinationUrl: string | null = null;

  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // 1. Siparişi ve Ürünü bul
    const order = await prisma.order.findFirst({
      where: { downloadToken: token },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: "İndirme linki geçersiz." }, { status: 404 });
    }

    // 2. Kontroller
    if (order.status !== "COMPLETED") {
      return NextResponse.json({ error: "Ödeme henüz tamamlanmamış." }, { status: 403 });
    }

    if (order.downloadExpiry && new Date() > new Date(order.downloadExpiry)) {
      return NextResponse.json({ error: "Bu indirme linkinin süresi dolmuş." }, { status: 410 });
    }

    // 3. Hedef URL'i belirle (Ama burada yönlendirme YAPMA)
    destinationUrl = order.product.pdfUrl;

  } catch (error) {
    console.error("İndirme hatası:", error);
    return NextResponse.json({ error: "Dosya indirilemedi." }, { status: 500 });
  }

  // 4. Yönlendirmeyi try-catch bloğunun DIŞINDA yapıyoruz
  // Böylece redirect hatası catch'e takılmıyor.
  if (destinationUrl) {
    redirect(destinationUrl);
  }
}