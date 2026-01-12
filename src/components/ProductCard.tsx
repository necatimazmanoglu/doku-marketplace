import Link from "next/link";
import Image from "next/image";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  category?: string | null;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Resim Alanı */}
        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-4xl">📄</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
            PDF
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              {product.category || "Genel"}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
            {product.description || "Açıklama bulunmuyor."}
          </p>

          <button className="w-full mt-auto bg-gray-900 text-white py-3 rounded-xl font-medium group-hover:bg-indigo-600 transition-colors">
            İncele & Satın Al
          </button>
        </div>
      </div>
    </Link>
  );
}