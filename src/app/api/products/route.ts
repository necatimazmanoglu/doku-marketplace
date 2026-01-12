import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    // ARTIK JSON BEKLİYORUZ (Çünkü dosyalar önden yüklendi, bize linki geliyor)
    const body = await req.json();
    const { title, description, price, category, pdfUrl, imageUrl, fileName, fileSize } = body;

    if (!title || !price || !pdfUrl) {
      return NextResponse.json({ error: "Başlık, fiyat ve PDF dosyası zorunludur." }, { status: 400 });
    }

    const priceInt = parseInt(price);

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: priceInt,
        category,
        isApproved: false, 
        isActive: true,
        sellerId: user.id,

        // Gelen Cloud Linklerini Kaydediyoruz
        pdfUrl,
        imageUrl: imageUrl || "/placeholder.png", 
        fileName: fileName || "dosya.pdf",
        fileSize: fileSize || 0,
      },
    });

    return NextResponse.json({ success: true, product });

  } catch (error: any) {
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json({ 
      error: "Ürün eklenemedi.", 
      details: error.message 
    }, { status: 500 });
  }
}