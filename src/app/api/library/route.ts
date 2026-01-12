import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // DÜZELTME: 'purchase' yerine 'order' tablosunu kullanıyoruz.
    // Ayrıca şemamızda alıcı 'buyerId' olarak geçiyor.
    const purchases = await prisma.order.findMany({
      where: {
        buyerId: userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(purchases);

  } catch (error) {
    console.log("[LIBRARY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}