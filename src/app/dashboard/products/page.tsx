import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit, Eye, Plus, FileText } from "lucide-react";

export default async function MyProductsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  // Kullanıcının ürünlerini çek
  // DÜZELTME: Sadece "isActive: true" olanları getiriyoruz.
  // Böylece silinen (arşivlenen) ürünler listede görünmez.
  const products = await prisma.product.findMany({
    where: { 
        sellerId: userId,
        isActive: true 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      
      {/* Üst Başlık ve Buton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Ürünlerim</h1>
          <p className="text-gray-500">Mağazanızdaki tüm dijital ürünleri buradan yönetin.</p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Ürün Listesi */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {products.length === 0 ? (
          // Ürün Yoksa Gösterilecek Alan
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Henüz ürününüz yok</h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-6">
              İlk dijital ürününüzü yükleyerek satış yapmaya ve kazanmaya başlayın.
            </p>
            <Link 
              href="/dashboard/products/new" 
              className="text-indigo-600 font-bold hover:underline"
            >
              Şimdi Ürün Ekle &rarr;
            </Link>
          </div>
        ) : (
          // Ürün Varsa Tablo Göster
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
                  <th className="px-6 py-4">Ürün</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Fiyat</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-center">Görüntülenme</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition group">
                    
                    {/* Resim ve Başlık */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-gray-200">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} fill alt={product.title} className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">PDF</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{product.fileName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                        {product.category || "Genel"}
                      </span>
                    </td>

                    {/* Fiyat */}
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {product.price === 0 ? <span className="text-green-600">Ücretsiz</span> : `${product.price} ₺`}
                    </td>

                    {/* Durum (Onaylandı mı?) */}
                    <td className="px-6 py-4">
                      {product.isApproved ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          Yayında
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse"></span>
                          İnceleniyor
                        </div>
                      )}
                    </td>

                    {/* İstatistik */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                        <Eye size={16} />
                        {product.views}
                      </div>
                    </td>

                    {/* Butonlar */}
                    <td className="px-6 py-4 text-right">
                      {/* URL DÜZELTİLDİ: /edit eklendi */}
                      <Link 
                        href={`/dashboard/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black transition"
                        title="Düzenle"
                      >
                        <Edit size={14} />
                      </Link>
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