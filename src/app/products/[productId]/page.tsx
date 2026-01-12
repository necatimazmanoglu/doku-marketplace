export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Sol: Ürün Görseli */}
        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain p-8"
          />
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div className="flex flex-col justify-center">
          <nav className="flex mb-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Ürün Detayı</span>
          </nav>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <p className="text-3xl font-bold text-indigo-600 mb-6">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
          </p>
          
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Ürün Açıklaması</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Bu ürün için bir açıklama girilmemiş."}
            </p>
          </div>

          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
            Hemen Satın Al
          </button>
        </div>
      </div>
    </div>
  );
}