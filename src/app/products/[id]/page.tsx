import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton"; 

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* SOL TARA: BÜYÜK ÜRÜN GÖRSELİ */}
          <div className="h-[400px] lg:h-[600px] bg-gray-100 relative overflow-hidden group">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <span className="text-9xl opacity-20">📄</span>
              </div>
            )}
            
            {/* Önizleme efekti (Süs) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>

          {/* SAĞ TARAF: ÜRÜN BİLGİLERİ */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            
            <div className="mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category || "Eğitim"}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-yellow-400 text-lg">
                ★★★★★
              </div>
              <span className="text-gray-400 text-sm">
                (Henüz değerlendirme yok)
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dosya Boyutu</p>
                  <p className="font-mono font-medium text-gray-900">
                    {(product.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Format</p>
                  <p className="font-mono font-medium text-gray-900">PDF</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Fiyat</p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
                  </p>
                </div>
              </div>

              {/* Satın Alma Butonu */}
              <BuyButton productId={product.id} price={product.price} />
              
              <p className="text-center text-xs text-gray-400 mt-4">
                Güvenli ödeme ve anında teslimat garantisi.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}