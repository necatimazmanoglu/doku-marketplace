import type { Metadata } from "next";
import "./globals.css";
// import "@uploadthing/react/styles.css"; // Bu satıra gerek yok, sildik.
import { ClerkProvider, UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "PDF Marketplace MVP - PDF Satış Platformu",
  description: "Uzmanların hazırladığı PDF'leri keşfedin veya kendi PDF'lerinizi satın",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // *** BURAYA KENDİ E-POSTA ADRESİNİ YAZ ***
  const ADMIN_EMAIL = "necatimazmanoglu@gmail.com"; 
  const isAdmin = userEmail === ADMIN_EMAIL;

  // SATICI KONTROLÜ
  let isSeller = false;
  if (user) {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });
    if (sellerProfile) {
      isSeller = true;
    }
  }

  return (
    <ClerkProvider>
      <html lang="tr">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans bg-gray-50">
          
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                
                {/* SOL TARAF */}
                <div className="flex items-center gap-10">
                  <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                      <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                      PDF Market
                    </span>
                  </a>
                  
                  {/* MENÜ LİNKLERİ */}
                  <div className="hidden md:flex items-center space-x-2">
                    <a href="/" className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-semibold transition-all text-base flex items-center gap-2">
                      🏠 Ana Sayfa
                    </a>
                    <a href="/products" className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-semibold transition-all text-base flex items-center gap-2">
                      📚 Keşfet
                    </a>
                    
                    {user && (
                      <>
                        <a href="/dashboard/products/new" className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-semibold transition-all text-base flex items-center gap-2">
                          📤 PDF Sat
                        </a>

                        <a href="/library" className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-semibold transition-all text-base flex items-center gap-2">
                          📖 Kütüphanem
                        </a>

                        {isSeller && (
                          <a href="/dashboard/seller" className="px-4 py-2.5 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 font-semibold transition-all text-base flex items-center gap-2">
                            🏪 Satıcı Paneli
                          </a>
                        )}
                      </>
                    )}

                    {isAdmin && (
                      <a href="/dashboard/admin" className="ml-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold transition-all text-base flex items-center gap-2 shadow-sm">
                        👑 Admin
                      </a>
                    )}
                  </div>
                </div>
                
                {/* SAĞ TARAF */}
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center gap-4">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-gray-600 hover:text-gray-900 font-semibold text-base px-4 py-2 hover:bg-gray-100 rounded-lg transition-all">
                          Giriş Yap
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="bg-gray-900 hover:bg-black text-white font-semibold text-base px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-gray-200">
                          Kayıt Ol
                        </button>
                      </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                      <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                         {isAdmin && <span className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest">Yönetici</span>}
                         <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "w-11 h-11 border-2 border-white shadow-md"
                            }
                          }}
                          afterSignOutUrl="/"
                        />
                      </div>
                    </SignedIn>
                  </div>
                  
                  {/* Mobil Menü Butonu */}
                  <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </nav>

          <main>{children}</main>

          <footer className="bg-gray-900 text-white mt-24 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
                  <span className="font-bold text-2xl tracking-tighter">PDF Market</span>
               </div>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Bilgi ve deneyimlerinizi kazanca dönüştürün. Güvenli, hızlı ve modern dijital pazar yeri.
              </p>
              <div className="text-sm text-gray-600">
                © 2026 PDF Market. Tüm hakları saklıdır.
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}