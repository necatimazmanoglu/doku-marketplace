import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.update({
    where: { id },
    data: { isApproved: true },
  });
  return NextResponse.json({ success: true });
}