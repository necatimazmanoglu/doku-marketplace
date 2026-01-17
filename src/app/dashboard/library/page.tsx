import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Download, FileText, ArrowLeft, Search, Calendar, ExternalLink } from "lucide-react";

export default async function LibraryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Kullanıcının satın aldığı ürünleri çekiyoruz
  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
      status: "SUCCESS", // Sadece başarılı siparişler
    },
    include: {
      product: {
        include: {
          seller: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      
      {/* --- STICKY HEADER --- */}
      {/* Sol menüyü gizlediğimiz için buraya navigasyon koyuyoruz */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-black group"
              title="Mağaza Paneline Dön"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kütüphanem</h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">
                Satın aldığınız içeriklere buradan erişebilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
            Toplam {orders.length} Dosya
          </div>
        </div>
      </div>

      {/* --- İÇERİK ALANI --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {orders.length === 0 ? (
          // BOŞ DURUM (EMPTY STATE)
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Search size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz bir şey yok.</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Kütüphaneniz boş görünüyor. İhtiyacınız olan ders notlarını veya kitapları keşfederek başlayın.
            </p>
            <Link 
              href="/explore" 
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Mağazayı Keşfet 🚀
            </Link>
          </div>
        ) : (
          // LİSTE GÖRÜNÜMÜ
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => {
              const product = order.product;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                  
                  {/* Görsel Alanı */}
                  <Link href={`/products/${product.id}`} className="relative h-52 bg-gray-100 overflow-hidden block">
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        fill 
                        alt={product.title} 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <FileText size={48} />
                        <span className="font-bold mt-2 opacity-50">PDF</span>
                      </div>
                    )}
                    
                    {/* Kategori Etiketi */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                            {product.category}
                        </span>
                    </div>
                  </Link>

                  {/* Kart İçeriği */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-medium">
                       <Calendar size={14} />
                       <span>{new Date(order.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-gray-200 inline-block"></span>
                      {product.seller.shopName || "Satıcı"}
                    </p>

                    {/* Butonlar */}
                    <div className="mt-auto grid grid-cols-5 gap-3">
                      {/* İndir Butonu (Geniş) */}
                      <a 
                        href={product.pdfUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-3 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition active:scale-95 shadow-md"
                      >
                        <Download size={16} />
                        İndir
                      </a>

                      {/* Detay Butonu (Dar) */}
                      <Link 
                        href={`/products/${product.id}`} 
                        className="col-span-2 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition active:scale-95"
                      >
                        <ExternalLink size={16} />
                        Detay
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}