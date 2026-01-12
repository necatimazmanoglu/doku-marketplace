import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. İstatistikler
    const totalProducts = await prisma.product.count({ where: { isApproved: true } });
    const totalOrders = await prisma.order.count({ where: { status: "COMPLETED" } });
    
    const allOrders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      select: { pricePaid: true },
    });
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.pricePaid || 0), 0);

    // 2. Onay Bekleyen Ürünler (isApproved: false olanlar)
    const pendingProducts = await prisma.product.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      stats: { totalProducts, totalOrders, totalRevenue },
      pendingProducts
    });

  } catch (error) {
    console.error("Admin API Hatası:", error);
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}