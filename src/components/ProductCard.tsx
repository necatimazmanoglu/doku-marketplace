import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
            PDF
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-extrabold text-indigo-600">
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
          </span>
          <span className="text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            İncele
          </span>
        </div>
      </div>
    </Link>
  );
}