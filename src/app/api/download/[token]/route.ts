import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const params = await props.params;
    const { token } = params;

    // 1. Siparişi Bul
    const order = await prisma.order.findUnique({
      where: { downloadToken: token },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Geçersiz indirme bağlantısı." }, { status: 404 });
    }

    const fileUrl = order.product.pdfUrl;
    if (!fileUrl) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 404 });
    }

    // 2. DOSYAYI ÇEK (UploadThing)
    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error("Dosya Çekilemedi:", fileUrl);
      return NextResponse.json({ error: "Dosya sunucudan alınamadı." }, { status: 404 });
    }

    // 3. Dosya İsmini Hazırla (Türkçe Karakter Sorunu Çözümü)
    // Ham dosya ismini al (Örn: "İnsan Hakları.pdf")
    const rawFileName = order.product.fileName || "dosya.pdf";
    
    // Header'a koymak için ASCII formatına çevir (Örn: "%C4%B0nsan...")
    const encodedFileName = encodeURIComponent(rawFileName);

    // 4. Dosyayı Hazırla
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    
    // ÖNEMLİ DÜZELTME: filename*=UTF-8'' formatı kullanıyoruz.
    // Bu sayede tarayıcı %C4... kodunu görüp tekrar "İ" harfine çevirir.
    headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);
    
    headers.set("Content-Length", buffer.length.toString());

    return new NextResponse(buffer, {
      status: 200,
      headers: headers,
    });

  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + error.message }, { status: 500 });
  }
}