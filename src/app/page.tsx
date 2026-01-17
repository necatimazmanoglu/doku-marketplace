import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* SOL TARAF: Metinler */}
            <div className="text-center lg:text-left z-20">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
                Bildiklerini <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Gelire Dönüştür.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Ders notları, e-kitaplar, yazılımlar veya tasarım şablonları... 
                Dijital ürününü yükle, linkini paylaş ve uyurken bile kazanmaya başla.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* GÜNCELLEME: Linki doğrudan panele yönlendirdik */}
                <Link 
                  href="/dashboard/products/new" 
                  className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-xl hover:scale-105 active:scale-95"
                >
                  Satışa Başla (Ücretsiz)
                </Link>
                <Link 
                  href="/explore" 
                  className="bg-gray-100 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition"
                >
                  Ürünleri Keşfet
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-gray-400 font-medium">
                ✨ Kredi kartı gerekmez. %0 risk.
              </p>
            </div>

            {/* SAĞ TARAF: Modern CSS İllüstrasyonu */}
            <div className="relative z-10 perspective-1000">
              {/* Arka Plan Glow Efekti */}
              <div className="absolute top-10 right-10 w-full h-full bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              
              {/* Ana Kart (Floating Effect) */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-2xl transform rotate-y-12 rotate-x-6 hover:rotate-0 transition duration-700 ease-out">
                
                {/* Kart Üst Bar */}
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                </div>

                {/* İçerik Temsili */}
                <div className="flex gap-6">
                  {/* Sol: Kitap Kapağı Temsili */}
                  <div className="w-32 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-4xl">
                    PDF
                  </div>
                  
                  {/* Sağ: Satır Temsilleri */}
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                    <div className="h-3 w-full bg-gray-100 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                    
                    <div className="pt-4 flex justify-between items-center">
                      <div className="h-8 w-24 bg-black rounded-lg"></div>
                      <div className="text-2xl font-black text-gray-900">₺150</div>
                    </div>
                  </div>
                </div>

                {/* Alt Bildirim */}
                <div className="mt-6 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <div>
                    <div className="text-xs font-bold text-green-800">Ödeme Alındı</div>
                    <div className="text-[10px] text-green-600">Az önce • Stripe / iyzico</div>
                  </div>
                </div>

              </div>

              {/* Süsleme Kartı (Arkada) */}
              <div className="absolute -z-10 top-12 -right-6 w-full h-full bg-gray-50 border border-gray-100 rounded-3xl opacity-60 transform rotate-6"></div>
            </div>

          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR & CTA KISIMLARI --- */}
      <section className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-12">Sadece 3 Adımda Kazan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="text-4xl mb-4">📂</div>
                  <h3 className="font-bold text-lg">1. Yükle</h3>
                  <p className="text-gray-500 text-sm mt-2">PDF, Video veya Zip dosyanı yükle.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="font-bold text-lg">2. Paylaş</h3>
                  <p className="text-gray-500 text-sm mt-2">Sana özel linki takipçilerine gönder.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="text-4xl mb-4">💸</div>
                  <h3 className="font-bold text-lg">3. Kazan</h3>
                  <p className="text-gray-500 text-sm mt-2">Ödemeler güvenle hesabına yatsın.</p>
               </div>
            </div>
         </div>
      </section>

      <section className="py-24 text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-black mb-6">Hemen Başla</h2>
            {/* GÜNCELLEME: Alt butonu da panele yönlendirdik */}
            <Link href="/dashboard/products/new" className="inline-block bg-black text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-800 transition shadow-2xl">
               Mağaza Aç 🚀
            </Link>
         </div>
      </section>

    </div>
  );
}