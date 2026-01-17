import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Package, 
  Eye, 
  CheckCircle, 
  Clock, 
  Plus
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // --- İSTATİSTİKLERİ ÇEK (DÜZELTME: isActive: true EKLENDİ) ---
  
  // 1. Toplam Ürün Sayısı (Sadece Aktif Olanlar)
  const totalProducts = await prisma.product.count({
    where: { 
        sellerId: userId,
        isActive: true // <--- EKLENDİ
    },
  });

  // 2. Yayındaki (Onaylı) Ürünler
  const activeProducts = await prisma.product.count({
    where: { 
        sellerId: userId, 
        isApproved: true,
        isActive: true // <--- EKLENDİ
    },
  });

  // 3. Onay Bekleyenler
  const pendingProducts = await prisma.product.count({
    where: { 
        sellerId: userId, 
        isApproved: false,
        isActive: true // <--- EKLENDİ (Böylece silinenler burada sayılmaz)
    },
  });

  // 4. Toplam Görüntülenme
  const viewsAggregate = await prisma.product.aggregate({
    where: { 
        sellerId: userId,
        isActive: true // <--- EKLENDİ
    },
    _sum: { views: true },
  });
  const totalViews = viewsAggregate._sum.views || 0;

  // Son Eklenen 5 Ürün (Silinenleri getirme)
  const recentProducts = await prisma.product.findMany({
    where: { 
        sellerId: userId,
        isActive: true // <--- EKLENDİ
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      
      {/* Başlık Alanı */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Genel Bakış</h1>
          <p className="text-gray-500">Mağazanızın anlık durumunu buradan takip edebilirsiniz.</p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Hızlı Ürün Ekle
        </Link>
      </div>

      {/* --- İSTATİSTİK KARTLARI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Kart 1: Toplam Ürün */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Package size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Toplam</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalProducts}</div>
          <p className="text-sm text-gray-500 mt-1">Yüklenen Ürün</p>
        </div>

        {/* Kart 2: Yayında */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Aktif</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{activeProducts}</div>
          <p className="text-sm text-gray-500 mt-1">Satışa Açık</p>
        </div>

        {/* Kart 3: Onay Bekleyen */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Bekliyor</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{pendingProducts}</div>
          <p className="text-sm text-gray-500 mt-1">Admin Onayında</p>
        </div>

        {/* Kart 4: Görüntülenme */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Eye size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Trafik</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{totalViews}</div>
          <p className="text-sm text-gray-500 mt-1">Toplam Görüntülenme</p>
        </div>
      </div>

      {/* --- SON EKLENENLER TABLOSU --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">Son Eklenen Ürünler</h3>
          <Link href="/dashboard/products" className="text-sm text-indigo-600 font-bold hover:underline">
            Tümünü Gör
          </Link>
        </div>
        
        {recentProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Henüz hiç ürün yüklemediniz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Ürün Adı</th>
                  <th className="px-6 py-4">Fiyat</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                    <td className="px-6 py-4 font-bold">{product.price} ₺</td>
                    <td className="px-6 py-4">
                      {product.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                          Onay Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}