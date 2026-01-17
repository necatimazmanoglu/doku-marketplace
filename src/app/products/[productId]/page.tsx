import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { CheckCircle, ShieldCheck, User, FileText, Lock, EyeOff, AlertTriangle } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const { userId } = await auth();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: true,
    },
  });

  if (!product) {
    notFound();
  }

  const isOwner = userId === product.sellerId;
  
  let hasPurchased = false;
  if (userId) {
    const existingOrder = await prisma.order.findFirst({
      where: {
        buyerId: userId,
        productId: product.id,
        status: "SUCCESS"
      }
    });
    if (existingOrder) hasPurchased = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      
      {/* LAYOUT DEĞİŞİKLİĞİ: 
         flex-row yerine flex-col kullandık. 
         Böylece Önizleme Üstte, Bilgiler Altta oldu.
         Genişliği de max-w-2xl yaparak daha kompakt (A4 dikey hissiyatı) hale getirdik.
      */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* --- BÖLÜM 1: GÜVENLİ PDF PENCERESİ (ÜSTTE) --- */}
        <div className="bg-gray-800 p-6 flex flex-col items-center justify-center relative select-none">
          
          {product.pdfUrl ? (
            // PENCERE KONTEYNERİ
            // Yüksekliği h-[350px] yaptık (Daha küçük ve kompakt)
            <div className="relative w-full max-w-[320px] h-[350px] bg-white rounded-md shadow-2xl overflow-hidden border-4 border-gray-700 group">
               
               {/* --- GÜVENLİK KATMANI 1: SABİT FİLİGRAN (CAM ÜZERİNDE) --- */}
               {/* Bu katman 'absolute inset-0' ile pencereye sabitlenir. 
                   İçerik kaydırılsa bile bu yazılar HEP ORADA KALIR. */}
               <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center gap-12 overflow-hidden bg-black/5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="transform -rotate-12 text-2xl font-black text-red-500/20 whitespace-nowrap select-none">
                      DEMO • KOPYALANAMAZ • DEMO
                    </div>
                  ))}
               </div>

               {/* --- GÜVENLİK KATMANI 2: ÜST VE ALT BARLAR --- */}
               <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 z-40 flex items-center justify-between px-3">
                  <div className="flex items-center gap-1.5">
                     <Lock size={12} className="text-red-400" />
                     <span className="text-[10px] text-white font-bold tracking-widest uppercase">KORUMALI ÖNİZLEME</span>
                  </div>
                  <EyeOff size={14} className="text-gray-500" />
               </div>

               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-40 flex items-end justify-center pb-2">
                   <p className="text-[10px] text-white font-medium opacity-80">Devamını görmek için satın alın</p>
               </div>

               {/* --- İÇERİK ALANI (KAYDIRILABİLİR) --- */}
               {/* Kullanıcı sadece bu div'i kaydırabilir */}
               <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pt-8 pb-12 bg-gray-200">
                 
                 {/* PDF (BULANIK VE RENKSİZ) */}
                 {/* pointer-events-none: Tıklamayı engeller */}
                 {/* blur-[1px]: Netliği bozar */}
                 <div className="w-full h-[1200px] pointer-events-none relative bg-white filter blur-[0.8px] grayscale contrast-125 px-1">
                    <iframe 
                      src={`${product.pdfUrl}#toolbar=0&navpanes=0&view=Fit&scrollbar=0`}
                      className="w-full h-full"
                      style={{ border: 'none' }}
                      title="PDF Önizleme"
                    />
                 </div>
               </div>
               
            </div>
          ) : (
            // PDF Yoksa Resim
            <div className="relative w-full max-w-[320px] aspect-[3/4] shadow-xl rounded-sm overflow-hidden transform rotate-1 border-4 border-white">
               <Image src={product.imageUrl || ""} alt={product.title} fill className="object-cover" />
            </div>
          )}

          {/* Uyarı Metni */}
          <div className="mt-4 flex items-center gap-2 text-white/50 text-xs font-mono">
             <AlertTriangle size={12} />
             <span>İçerik güvenliği nedeniyle önizleme sınırlandırılmıştır.</span>
          </div>
        </div>

        {/* --- BÖLÜM 2: BİLGİ VE SATIN ALMA (ALTTA) --- */}
        <div className="p-8 bg-white flex flex-col">
          
          <div className="flex items-start justify-between mb-4">
             <div>
                <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                  {product.category}
                </span>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{product.title}</h1>
             </div>
             {product.isApproved && (
                <div className="bg-green-50 p-2 rounded-full text-green-600" title="Onaylı İçerik">
                   <CheckCircle size={20} />
                </div>
             )}
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
             <span className="font-bold text-gray-400">Satıcı:</span>
             <Link href={`/shop/${product.sellerId}`} className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-lg transition-colors group">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs group-hover:bg-black group-hover:text-white">
                   <User size={12} />
                </div>
                <span className="font-bold text-gray-900 underline decoration-gray-300 group-hover:decoration-black">
                   {product.seller.shopName || "İsimsiz Mağaza"}
                </span>
             </Link>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 max-h-32 overflow-y-auto custom-scrollbar">
            <p>{product.description || "Açıklama bulunmuyor."}</p>
          </div>

          {/* FİYAT VE BUTON ALANI */}
          <div className="mt-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
             
             <div className="text-center sm:text-left">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Toplam Tutar</p>
               <p className="text-4xl font-black text-gray-900 tracking-tight">
                  {product.price === 0 ? <span className="text-green-600">Ücretsiz</span> : `${product.price} ₺`}
               </p>
               <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-1 justify-center sm:justify-start">
                  <ShieldCheck size={12} /> Güvenli Ödeme
               </div>
             </div>

             <div className="w-full flex-1">
                {isOwner ? (
                  <div className="w-full py-4 bg-gray-200 text-gray-500 text-center rounded-xl font-bold border border-gray-300 cursor-not-allowed text-sm">
                    ⛔ Kendi Ürününüz
                  </div>
                ) : hasPurchased ? (
                  <a 
                    href="/dashboard/library" 
                    className="block w-full py-4 bg-green-600 text-white text-center rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200"
                  >
                    ✅ Kütüphaneye Git
                  </a>
                ) : (
                  <BuyButton 
                    productId={product.id} 
                    price={product.price} 
                    isLoggedIn={!!userId}
                  />
                )}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}