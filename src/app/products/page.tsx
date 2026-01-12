import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  // Sadece onaylanmış ve aktif ürünleri çekiyoruz
  const products = await prisma.product.findMany({
    where: {
      isApproved: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Bilgi Hazinesini Keşfedin 📚
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uzmanlardan yazılım, tasarım ve kişisel gelişim üzerine en iyi kaynaklar.
          </p>
        </div>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* ÜRÜN KAPAK RESMİ */}
              <div className="h-56 bg-gray-100 overflow-hidden relative">
                {product.imageUrl ? (
                  // Gerçek Resim Varsa
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  // Resim Yoksa Varsayılan Placeholder
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                    <span className="text-6xl">📄</span>
                  </div>
                )}
                
                {/* Kategori Etiketi */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                  {product.category || "Genel"}
                </span>
              </div>

              {/* İçerik */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
                  </span>
                  <span className="text-indigo-600 font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    İncele &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Henüz onaylanmış ürün bulunmuyor.</p>
          </div>
        )}

      </div>
    </div>
  );
}