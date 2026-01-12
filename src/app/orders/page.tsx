import { auth } from '@clerk/nextjs/server'; // DÜZELTİLDİ: /server eklendi
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim 📦</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 mb-4">Henüz bir siparişiniz bulunmuyor.</p>
            <Link href="/products" className="text-indigo-600 font-medium hover:underline">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{order.product.title}</h3>
                  <p className="text-sm text-gray-500">Sipariş No: {order.id.slice(0, 8)}...</p>
                  <p className="text-sm text-gray-400">Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">₺{order.amount}</span>
                  <a 
                    href={order.product.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    İndir ⬇️
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}