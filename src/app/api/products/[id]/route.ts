import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 401 });
    }

    const { id } = await params;

    // 1. Ürünü bul ve sahibi bu kullanıcı mı kontrol et
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Başkasının ürününü silmeye çalışıyorsa engelle
    if (product.sellerId !== user.id) {
      return NextResponse.json({ error: "Bu ürünü silme yetkiniz yok" }, { status: 403 });
    }

    // 2. Ürünü Sil
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
  }
}