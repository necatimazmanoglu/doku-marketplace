"use client";

import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    category: string;
    sellerId: string; // Link vermek için ID lazım
    seller: {
      shopName: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
      
      {/* --- RESİM ALANI --- */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <Image 
            src={product.imageUrl} 
            alt={product.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 text-gray-300 font-black text-2xl tracking-widest">
            PDF
          </div>
        )}
        
        {/* SOL ÜST KÖŞE: KIRMIZI PDF ETİKETİ */}
        <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase tracking-wide z-10">
           PDF
        </div>
      </Link>

      {/* --- İÇERİK ALANI --- */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Satıcı Bilgisi (GÜNCELLENDİ) */}
        <div className="flex items-center gap-2 mb-2">
           <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
              {product.seller?.shopName?.charAt(0) || "S"}
           </div>
           
           {/* LİNK BURAYA EKLENDİ */}
           <Link 
             href={`/shops/${product.sellerId || "#"}`} 
             className="text-xs text-gray-400 font-medium truncate hover:text-indigo-600 hover:underline transition-colors"
             onClick={(e) => e.stopPropagation()} // Karta tıklayınca ürüne gitmesini engelle, sadece isme tıklayınca satıcıya gitsin
           >
             {product.seller?.shopName || "Satıcı"}
           </Link>
        </div>

        {/* Başlık */}
        <Link href={`/products/${product.id}`} className="block mb-4">
          <h3 className="font-bold text-gray-900 leading-snug hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        
        {/* --- ALT KISIM (FİYAT SOL ALTTA) --- */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          
          {/* FİYAT */}
          <div className="text-lg font-black text-gray-900">
             {product.price === 0 ? (
               <span className="text-green-600">Ücretsiz</span>
             ) : (
               `${product.price} ₺`
             )}
          </div>

          <Link 
            href={`/products/${product.id}`}
            className="text-xs font-bold text-gray-400 hover:text-black hover:underline transition-all"
          >
            İncele →
          </Link>
        </div>

      </div>
    </div>
  );
}