import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();

    // --- DÜZELTME BURADA YAPILDI ---
    // "!body.price" derseniz 0 TL'yi kabul etmez. 
    // Bu yüzden "body.price === undefined" diyerek kontrol ediyoruz.
    // Böylece 0 TL (Ücretsiz) ürünler de kabul edilir.
    
    const isPriceMissing = body.price === undefined || body.price === null;

    if (!body.title || isPriceMissing || !body.pdfUrl || !body.fileName || !body.fileSize) {
      return NextResponse.json(
        { error: "Eksik bilgi: Başlık, Fiyat ve PDF dosyası zorunludur." },
        { status: 400 }
      );
    }

    // Ürünü Oluştur
    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description || "",
        price: parseFloat(body.price),
        category: body.category || "Diğer",
        imageUrl: body.imageUrl || "",
        
        // Etiketler
        tags: body.tags || "", 
        
        pdfUrl: body.pdfUrl,
        fileName: body.fileName,
        fileSize: parseInt(body.fileSize),
        
        isApproved: false,
        sellerId: userId,
      },
    });

    return NextResponse.json({ success: true, product });

  } catch (error: any) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası: " + error.message },
      { status: 500 }
    );
  }
}

// GET Metodu (Aynı kalıyor)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sellerId = searchParams.get("sellerId");
        const whereCondition: any = { isApproved: true };
        
        if (sellerId) {
            delete whereCondition.isApproved;
            whereCondition.sellerId = sellerId;
        }

        const products = await prisma.product.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            include: { seller: true }
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Hata" }, { status: 500 });
    }
}