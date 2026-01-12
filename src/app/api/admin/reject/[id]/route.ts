import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  req: Request,
  // DÜZELTME: params tipi Promise yapıldı
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DÜZELTME: params await ile beklendi
    const { id } = await params;

    // Önce ürün var mı kontrol edelim
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Ürünü veritabanından sil
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ürün reddedildi ve silindi" });
    
  } catch (error) {
    console.error("[PRODUCT_REJECT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}