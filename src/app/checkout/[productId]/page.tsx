import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import CheckoutForm from "./CheckoutForm"; // Birazdan oluşturacağız

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { productId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=/checkout/${productId}`);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product) notFound();

  // GÜVENLİK: Kendi ürününü satın almayı engelle
  if (product.sellerId === userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6">
          🚫
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Kendi Ürününü Satın Alamazsın</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Satıcılar kendi mağazalarından alışveriş yapamazlar. Test etmek istiyorsanız farklı bir hesapla giriş yapın.
        </p>
        <a href="/" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
          Ana Sayfaya Dön
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Başlık */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Güvenli Ödeme</h1>
          <p className="text-gray-500 mt-2 text-sm">Ödemeniz 256-bit SSL sertifikası ile korunmaktadır.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- SOL TARAF: FORM --- */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
                 Fatura Bilgileri
               </h2>
               
               {/* Formu Çağırıyoruz */}
               <CheckoutForm product={product} userId={userId} />
            </div>
          </div>

          {/* --- SAĞ TARAF: ÖZET --- */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm">2</span>
                 Sipariş Özeti
              </h2>

              {/* Ürün Kartı */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">PDF</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug">{product.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                  <p className="text-xs text-indigo-600 font-medium mt-1">Satıcı: {product.seller.shopName}</p>
                </div>
              </div>

              {/* Fiyat Dökümü */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Ara Toplam</span>
                  <span>{product.price} ₺</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Hizmet Bedeli</span>
                  <span className="text-green-600 font-medium">0.00 ₺</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Toplam Tutar</span>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
                  </span>
                </div>
              </div>

              {/* Güvenlik Rozetleri */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                 <div className="text-xs font-bold text-gray-400 flex flex-col items-center">
                    🔒 <span className="mt-1">SSL Korumalı</span>
                 </div>
                 <div className="h-8 w-[1px] bg-gray-300"></div>
                 <div className="text-xs font-bold text-gray-400 flex flex-col items-center">
                    💳 <span className="mt-1">Güvenli Ödeme</span>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}