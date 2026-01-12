import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  // Siparişi çekiyoruz
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Sipariş Özeti
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sipariş No: <span className="font-mono text-xs text-gray-700">{order.orderNumber}</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900">{order.productTitle}</h3>
            <div className="mt-2 flex justify-between items-center text-sm">
              <span className="text-gray-500">Tutar:</span>
              <span className="text-xl font-bold text-indigo-600">
                {/* DÜZELTİLDİ: amount yerine pricePaid kullanıyoruz */}
                {order.pricePaid === 0 ? "Ücretsiz" : `₺${order.pricePaid}`}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Ödeme Durumu:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status === 'COMPLETED' ? 'ÖDENDİ' : 'BEKLİYOR'}
              </span>
            </div>

            {order.status !== 'COMPLETED' ? (
              // TEST İÇİN ÖDEME BUTONU
              // Bu buton tıklandığında siparişi "COMPLETED" yapmak için API'ye gidecek
              <form action={`/api/orders/${order.id}/approve`} method="POST"> 
                 <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all"
                >
                  💳 Ödemeyi Tamamla (Test)
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-green-600 text-center font-medium bg-green-50 p-3 rounded-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Ödeme Başarılı!
                </div>
                {/* İNDİRME LİNKİ */}
                {/* downloadToken kullanarak indirme sayfasına yönlendiriyoruz */}
                <a 
                  href={`/api/download/${order.downloadToken}`} 
                  target="_blank"
                  className="block w-full text-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-800 transition shadow-lg"
                >
                  📥 Dosyayı İndir
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
             <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
               İptal Et ve Geri Dön
             </Link>
        </div>

      </div>
    </div>
  );
}