import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Kullanıcının satın aldığı (veya ücretsiz aldığı) "SUCCESS" durumundaki siparişleri çek
  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
      status: "SUCCESS",
    },
    include: {
      product: {
        include: {
          seller: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Kütüphanem</h1>
        <p className="text-gray-500 mt-2">Satın aldığınız tüm dijital ürünlere buradan erişebilirsiniz.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900">Henüz bir ürün almadınız.</h3>
          <p className="text-gray-500 mb-6">İhtiyacınız olan ürünleri keşfetmeye başlayın.</p>
          <Link href="/products" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition">
            Mağazaya Git
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              
              {/* Ürün Resmi */}
              <div className="relative aspect-video bg-gray-100">
                {order.product.imageUrl ? (
                  <Image src={order.product.imageUrl} alt={order.productTitle} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300 font-bold tracking-widest">PDF</div>
                )}
                {/* Etiket */}
                <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  SATIN ALINDI
                </div>
              </div>

              {/* İçerik */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-1 text-xs text-gray-400 font-medium">
                   {new Date(order.createdAt).toLocaleDateString("tr-TR")} tarihinde alındı
                </div>
                <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                  {order.productTitle}
                </h3>
                <div className="text-xs text-indigo-600 font-medium mb-6">
                  Satıcı: {order.product.seller.shopName}
                </div>

                {/* Butonlar */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-3">
                   {/* İndir Butonu - Doğrudan token'a gider */}
                   <a 
                     href={`/api/download/${order.downloadToken}`} 
                     target="_blank"
                     className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-bold text-center hover:bg-gray-800 transition flex items-center justify-center gap-2"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                     İndir
                   </a>
                   
                   {/* Detay Butonu */}
                   <Link 
                     href={`/products/${order.productId}`}
                     className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                   >
                     Ürünü Gör
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}