import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isApproved: true, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error("Ürün hatası:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Dijital Ürünlerinizi <br />
            <span className="text-indigo-600">Kolayca Satın ve Alın</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            PDF kitaplar, şablonlar, eğitim setleri. Güvenli ödeme ile hemen başlayın.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg">
              Ürünleri Keşfet
            </Link>
            
            {/* LİNK GÜNCELLENDİ: Artık /products/new adresine gidiyor */}
            <Link href="/products/new" className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition">
              Hemen Ürün Ekle
            </Link>
          </div>
        </div>
      </div>

      {/* Ürünler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Son Eklenenler</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">Henüz ürün yok.</h3>
            <p className="text-gray-500">İlk ürünü eklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}