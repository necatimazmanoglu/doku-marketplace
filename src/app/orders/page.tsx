// src/app/orders/page.tsx
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prismaClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const { userId } = auth();

  if (!userId) return notFound();

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: true,
    },
  });

  if (!orders.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sipariş bulunamadı</h1>
        <p className="text-gray-600 mb-6">Henüz hiç ürün satın almadınız.</p>
        <Link
          href="/products"
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 inline-block"
        >
          Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{order.product.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('tr-TR')} • {order.product.price} TL
              </p>
            </div>
            <Link
              href={`/orders/${order.id}`}
              className="text-sm text-purple-600 font-medium hover:underline"
            >
              Detaylar →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
