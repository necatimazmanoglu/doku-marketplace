import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/"); // Giriş yapmamışsa kütüphane görünmez
  }

  // Kullanıcının Clerk'teki email adresini alıyoruz
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Veritabanından bu kullanıcının ID'si VEYA E-postası ile eşleşen siparişleri çek
  const orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
      OR: [
        { buyerId: user.id },      // Kullanıcı ID'si ile eşleşenler
        { buyerEmail: userEmail }  // Email ile eşleşenler
      ]
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kütüphanem</h1>
            <p className="text-gray-500">Merhaba {user.firstName}, sahip olduğun içerikler burada.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-medium text-gray-900">Kütüphaneniz boş</h3>
            <p className="text-gray-500 mt-2 mb-6">Henüz bu hesapla bir şey satın almadınız.</p>
            <Link 
              href="/products" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <span className="text-4xl">📄</span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-mono px-2 py-1 rounded-md text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {order.product.title}
                  </h3>
                  <a
                    href={`/api/download/${order.downloadToken}`}
                    target="_blank"
                    className="block w-full text-center py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>📥</span> İndir
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