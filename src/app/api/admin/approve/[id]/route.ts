import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: Request,
  // DÜZELTME: params artık 'Promise' tipinde olmalı
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // DÜZELTME: params'ı await ile bekliyoruz
    const { id } = await params;

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        isApproved: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}