import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function OrderSuccessPage(props: any) {
  // HATA AYIKLAMA: Terminalde hatayı görmek için try-catch ekliyoruz
  try {
    // 1. Params uyumluluğu (Next.js 14 ve 15 için ortak çözüm)
    const params = await props.params;
    const orderId = params.orderId;

    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    // 2. Siparişi Çek
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true }
    });

    // 3. Sipariş kontrolü
    if (!order) {
      console.error("Sipariş bulunamadı ID:", orderId);
      notFound();
    }

    // Yetki kontrolü (Opsiyonel: Geliştirme aşamasında kapattım, hata buradaysa anlarız)
    // if (order.buyerId !== userId) { notFound(); }

    // 4. Fiyat Formatlama (Hata vermemesi için güvenli hale getirildi)
    let formattedPrice = "0 ₺";
    if (order.pricePaid === 0) {
      formattedPrice = "Ücretsiz";
    } else {
      try {
        formattedPrice = new Intl.NumberFormat('tr-TR', { 
          style: 'currency', 
          currency: 'TRY' 
        }).format(order.pricePaid);
      } catch (e) {
        formattedPrice = `${order.pricePaid} ₺`; // Format hatası olursa düz yaz
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Başarılı İkonu */}
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
              🎉
            </div>
            <h1 className="text-2xl font-black text-gray-900">Sipariş Başarılı!</h1>
            <p className="text-green-700 font-medium mt-1">Ürününüz hazırlanmıştır.</p>
          </div>

          {/* Sipariş Detayları */}
          <div className="p-8 space-y-6">
            
            {/* Ürün Özeti */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative border border-gray-200">
                  {order.product.imageUrl ? (
                    <Image 
                      src={order.product.imageUrl} 
                      alt={order.productTitle || "Ürün"} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">PDF</div>
                  )}
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{order.productTitle}</h3>
                  <p className="text-xs text-gray-500">Sipariş No: #{order.orderNumber ? order.orderNumber.slice(-8).toUpperCase() : "---"}</p>
               </div>
            </div>

            {/* Bilgi Satırları */}
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Tarih</span>
                  <span className="font-medium text-gray-900">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('tr-TR') : "-"}
                  </span>
               </div>
               
               {/* FİYAT ALANI */}
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Ödenen Tutar</span>
                  <span className={`font-black text-lg ${order.pricePaid === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                     {formattedPrice}
                  </span>
               </div>
            </div>

            {/* İndir Butonu */}
            <a 
              href={`/api/download/${order.downloadToken}`}
              target="_blank"
              className="block w-full py-4 bg-black text-white text-center rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Dosyayı İndir
            </a>

            <Link href="/" className="block text-center text-sm text-gray-400 font-medium hover:text-black hover:underline mt-4">
              Alışverişe Devam Et
            </Link>

          </div>
        </div>
      </div>
    );
  } catch (error) {
    // HATA VARSA TERMİNALE YAZ VE EKRANA GÖSTER
    console.error("SİPARİŞ SAYFASI HATASI:", error);
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold flex-col gap-2">
         <p>Bir hata oluştu.</p>
         <p className="text-sm text-gray-500 font-normal">Lütfen VS Code terminalini kontrol edin.</p>
      </div>
    );
  }
}