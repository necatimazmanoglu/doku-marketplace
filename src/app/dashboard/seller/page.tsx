import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeleteProductButton from "@/components/DeleteProductButton"; // Yeni bileşeni ekledik

export default async function SellerDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      sellerId: user.id,
      status: "COMPLETED",
    },
    orderBy: { createdAt: 'desc' },
    include: { product: true },
    take: 10,
  });

  const totalRevenue = orders.reduce((sum, order) => sum + (order.pricePaid || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏪 Satıcı Paneli</h1>
            <p className="text-gray-500 mt-1">Hoş geldin, <span className="font-semibold text-gray-800">{user.firstName || user.username}</span> 👋</p>
          </div>
          <Link 
            href="/dashboard/products/new" 
            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
          >
            <span>+</span> Yeni Ürün Ekle
          </Link>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Toplam Kazanç</div>
            <div className="text-3xl font-extrabold text-green-600">
              ₺{totalRevenue.toLocaleString('tr-TR')}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Toplam Satış</div>
            <div className="text-3xl font-extrabold text-indigo-600">
              {orders.length} <span className="text-lg text-gray-400 font-normal">Adet</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Ürünlerin</div>
            <div className="text-3xl font-extrabold text-gray-900">
              {products.length} <span className="text-lg text-gray-400 font-normal">Aktif</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SATIŞLAR LİSTESİ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Son Satışların</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Henüz satış yapmadın.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">💰</div>
                      <div>
                        <div className="font-medium text-gray-900">{order.productTitle}</div>
                        <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">+₺{order.pricePaid}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ÜRÜNLER LİSTESİ (SİL BUTONU EKLENDİ) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Ürünlerin</h3>
              <Link href="/products" className="text-xs text-indigo-600 hover:underline">Vitrine Git &rarr;</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="mb-4">Henüz hiç ürün eklemedin.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {product.isApproved ? '✅' : '⏳'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>
                        <div className="text-xs text-gray-500 flex gap-2">
                          {product.isApproved 
                            ? <span className="text-green-600">Yayında</span> 
                            : <span className="text-yellow-600">Onay Bekliyor</span>
                          }
                          <span>•</span>
                          <span>₺{product.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* YENİ: SİLME BUTONU BİLEŞENİ */}
                    <div>
                      <DeleteProductButton productId={product.id} />
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}