import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Store, Calendar, ShieldCheck } from "lucide-react";

interface ShopPageProps {
  params: Promise<{ sellerId: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { sellerId } = await params;

  // 1. Satıcıyı ve Onaylı Ürünlerini Çek
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: sellerId },
    include: {
      products: {
        where: { isApproved: true, isActive: true }, // Sadece aktif ve onaylılar
        orderBy: { createdAt: "desc" },
        include: { seller: true }
      }
    }
  });

  if (!seller) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- SATICI PROFİL BAŞLIĞI (HEADER) --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            {/* Logo / Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full border-4 border-white shadow-lg overflow-hidden relative shrink-0">
               {seller.logoUrl ? (
                 <Image src={seller.logoUrl} alt={seller.shopName} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black">
                    {seller.shopName.charAt(0).toUpperCase()}
                 </div>
               )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                    {seller.shopName}
                    <ShieldCheck className="text-blue-500" size={24} />
                 </h1>
               </div>
               
               <p className="text-gray-600 max-w-2xl mb-4 leading-relaxed">
                 {seller.description || "Bu satıcı henüz bir açıklama eklemedi."}
               </p>

               {/* İstatistikler (Instagram/Web Sitesi YOK) */}
               <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Store size={14} />
                    <span className="text-gray-900 font-bold">{seller.products.length}</span> Ürün
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span>Katılım: {new Date(seller.createdAt).getFullYear()}</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- ÜRÜN LİSTESİ --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-4">
            Satıcının Ürünleri
        </h2>
        
        {seller.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
             <div className="text-4xl mb-4">📭</div>
             <p className="text-gray-500">Bu satıcının henüz aktif ürünü yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seller.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}