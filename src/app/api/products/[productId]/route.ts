import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

// UploadThing Dosya Yönetimi
const utapi = new UTApi();

type Props = {
  params: Promise<{ productId: string }>;
};

// 1. GET (Mevcut)
export async function GET(req: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const productId = params.productId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// 2. PATCH (Mevcut)
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const productId = params.productId;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct || existingProduct.sellerId !== userId) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    const priceValue = (body.price !== undefined && body.price !== null) 
        ? parseFloat(body.price) 
        : existingProduct.price;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: body.title,
        description: body.description,
        price: priceValue,
        category: body.category,
        tags: body.tags,
        pdfUrl: body.pdfUrl,
        fileName: body.fileName,
        fileSize: body.fileSize ? parseInt(body.fileSize) : undefined,
        imageUrl: body.imageUrl,
        isApproved: false, 
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: "Güncelleme hatası: " + error.message }, { status: 500 });
  }
}

// 3. DELETE (GÜNCELLENDİ: Akıllı Silme)
export async function DELETE(req: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const productId = params.productId;
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    // Ürünü ve sipariş geçmişini kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { 
        orders: true // Siparişleri de çekiyoruz
      }
    });

    if (!product || product.sellerId !== userId) {
        return NextResponse.json({ error: "Bu ürünü silme yetkiniz yok." }, { status: 403 });
    }

    // --- SENARYO 1: Ürünün Satış Geçmişi Var ---
    if (product.orders.length > 0) {
        // 
        // Ürün satılmışsa veritabanından SİLEMEYİZ (Fatura/Sipariş bozulur).
        // Bunun yerine "Arşivliyoruz" (Pasife çekiyoruz).
        await prisma.product.update({
            where: { id: productId },
            data: {
                isActive: false,       // Satışa kapat
                isApproved: false,     // Vitrinden kaldır
                title: `${product.title} (SİLİNDİ)`, // Panelde anlaşılsın diye ismini değiştiriyoruz
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Ürün geçmiş siparişleri olduğu için tamamen silinmedi, arşive kaldırıldı." 
        });
    }

    // --- SENARYO 2: Ürün Hiç Satılmamış ---
    // Gönül rahatlığıyla her yerden silebiliriz.

    // A) UploadThing'den dosyaları temizle
    if (product.pdfUrl) {
        const fileKey = product.pdfUrl.split("/").pop();
        if (fileKey) await utapi.deleteFiles(fileKey);
    }
    if (product.imageUrl) {
        const imageKey = product.imageUrl.split("/").pop();
        if (imageKey) await utapi.deleteFiles(imageKey);
    }

    // B) Veritabanından Sil
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ success: true, message: "Ürün başarıyla silindi." });

  } catch (error: any) {
    console.error("DELETE Hatası:", error);
    return NextResponse.json({ error: "Silme işlemi sırasında hata oluştu: " + error.message }, { status: 500 });
  }
}