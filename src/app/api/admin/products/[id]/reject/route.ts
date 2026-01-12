import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Reddedilen ürünü veritabanından siliyoruz
  await prisma.product.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}