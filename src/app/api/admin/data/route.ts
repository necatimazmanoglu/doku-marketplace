import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    // Admin yetkisi kontrolü (Basit email kontrolü)
    const ADMIN_EMAIL = "necatimazmanoglu@gmail.com"; 
    
    if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // 1. İSTATİSTİKLER (Toplam Ciro, Sipariş Sayısı vb.)
    const totalOrdersCount = await prisma.order.count({ where: { status: "SUCCESS" } });
    const totalProductsCount = await prisma.product.count({ where: { isApproved: true } });
    
    // Ciro Hesaplama (Sadece başarılı siparişler)
    const orders = await prisma.order.findMany({ where: { status: "SUCCESS" } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);

    // 2. ONAY BEKLEYENLER
    const pendingProducts = await prisma.product.findMany({
      where: { isApproved: false },
      include: { seller: true },
      orderBy: { createdAt: "desc" }
    });

    // 3. TÜM AKTİF ÜRÜNLER
    const activeProducts = await prisma.product.findMany({
      where: { isApproved: true },
      include: { seller: true },
      orderBy: { createdAt: "desc" }
    });

    // 4. SON SİPARİŞLER (Raporlar Sekmesi İçin)
    const recentOrders = await prisma.order.findMany({
      where: { status: "SUCCESS" },
      take: 20, // Son 20 sipariş
      orderBy: { createdAt: "desc" },
      include: { product: true }
    });

    // 5. SATICILAR (Kullanıcılar Sekmesi İçin)
    // Clerk veritabanına erişemediğimiz için kendi veritabanımızdaki 'SellerProfile'ları çekiyoruz.
    const sellers = await prisma.sellerProfile.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsCount,
      },
      pendingProducts,
      activeProducts,
      recentOrders,
      sellers
    });

  } catch (error) {
    console.error("Admin data hatası:", error);
    return NextResponse.json({ error: "Veri çekilemedi" }, { status: 500 });
  }
}