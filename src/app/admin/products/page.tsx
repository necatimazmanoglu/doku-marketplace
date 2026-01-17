import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { CheckCircle, XCircle, FileText, User, ExternalLink } from "lucide-react";

export default async function AdminProductsPage() {
  const { userId } = await auth();

  // GÜVENLİK: Sadece belirli bir kullanıcı girebilsin (Kendi ID'nizi buraya yazın)
  // Şimdilik açık bırakıyorum ama canlıya alırken burayı açmalısın:
  // if (userId !== "user_2rh...") redirect("/");

  if (!userId) redirect("/");

  // --- DÜZELTME BURADA ---
  // Sadece "isActive: true" olan ürünleri çekiyoruz.
  // Böylece satıcının sildiği (arşivlediği) ürünler admin onayına düşmez.
  const products = await prisma.product.findMany({
    where: {
      isActive: true, // <--- BU SATIR EKLENDİ
    },
    orderBy: [
      { isApproved: "asc" }, // Önce false (onaysız), sonra true (onaylı)
      { createdAt: "desc" }
    ],
    include: {
      seller: true, // Satıcı bilgisini de al
    },
  });

  // --- SERVER ACTIONS (Sunucu tarafı işlemler) ---
  
  // 1. Ürünü Onayla
  async function approveProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    
    await prisma.product.update({
      where: { id: productId },
      data: { isApproved: true },
    });

    revalidatePath("/admin/products");
    revalidatePath("/explore"); // Vitrini de yenile
  }

  // 2. Ürünü Reddet (Sil)
  async function rejectProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    
    // Admin reddettiğinde de eğer sipariş varsa hata vermemesi için
    // burada da "hard delete" yerine "soft delete" (arşivleme) yapılabilir.
    // Ancak şimdilik veritabanından siliyoruz.
    try {
        await prisma.product.delete({
            where: { id: productId },
        });
    } catch (error) {
        // Eğer silinemezse (sipariş varsa) pasife alalım
        await prisma.product.update({
            where: { id: productId },
            data: { isActive: false, isApproved: false, title: "REDDEDİLDİ (SİLİNDİ)" }
        });
    }

    revalidatePath("/admin/products");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Yönetim Paneli</h1>
            <p className="text-gray-500">Onay bekleyen ve yayındaki tüm içerikleri yönetin.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold shadow-sm">
              Toplam: {products.length} Ürün
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="space-y-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white rounded-xl p-5 border shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row gap-6 items-start md:items-center ${
                !product.isApproved ? "border-l-4 border-l-yellow-400" : "border-gray-200"
              }`}
            >
              
              {/* Sol: Görsel */}
              <div className="w-20 h-28 bg-gray-100 rounded-lg relative flex-shrink-0 overflow-hidden border border-gray-200">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} fill alt={product.title} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText size={24} />
                    <span className="text-[10px] font-bold mt-1">PDF</span>
                  </div>
                )}
              </div>

              {/* Orta: Bilgiler */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   {!product.isApproved && (
                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                       Onay Bekliyor
                     </span>
                   )}
                   <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                     {product.category}
                   </span>
                   <span className="text-xs font-bold text-gray-900">
                     {product.price === 0 ? "Ücretsiz" : `${product.price} ₺`}
                   </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{product.title}</h3>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{product.seller.shopName || "Bilinmeyen Satıcı"}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div>{new Date(product.createdAt).toLocaleDateString("tr-TR")}</div>
                  
                  {/* Dosya İndirme Linki (Admin Kontrolü İçin) */}
                  <a 
                    href={product.pdfUrl} 
                    target="_blank" 
                    className="flex items-center gap-1 text-indigo-600 hover:underline font-bold ml-2"
                  >
                    <ExternalLink size={14} /> Dosyayı İncele
                  </a>
                </div>
              </div>

              {/* Sağ: Aksiyonlar */}
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                {!product.isApproved ? (
                  <>
                    <form action={approveProduct}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button 
                        type="submit"
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-sm w-full md:w-auto justify-center"
                      >
                        <CheckCircle size={18} /> Onayla
                      </button>
                    </form>

                    <form action={rejectProduct}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button 
                        type="submit"
                        className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-bold hover:bg-red-50 transition w-full md:w-auto justify-center"
                      >
                        <XCircle size={18} /> Reddet
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg font-bold border border-green-100">
                    <CheckCircle size={18} /> Yayında
                  </div>
                )}
                
                {/* Onaylı olsa bile silme butonu olsun (Admin yetkisi) */}
                {product.isApproved && (
                   <form action={rejectProduct}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button 
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Ürünü Sil"
                      >
                        <XCircle size={20} />
                      </button>
                   </form>
                )}
              </div>

            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500 font-medium">İncelenecek aktif ürün bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}