import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from "@clerk/nextjs";
import { 
  Home, 
  Compass, 
  UploadCloud, 
  Library, 
  Store, 
  ShieldCheck 
} from "lucide-react";

export default async function Navbar() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const ADMIN_EMAIL = "necatimazmanoglu@gmail.com"; 
  const isAdmin = userEmail === ADMIN_EMAIL;

  let isSeller = false;
  if (user) {
    try {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: user.id },
      });
      if (sellerProfile) isSeller = true;
    } catch (error) {
      console.error("Profil kontrol hatası:", error);
    }
  }

  // Ortak stil sınıfı
  const baseLinkClass = "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-gray-600 transition-all group";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* --- LOGO --- */}
          <div className="flex items-center gap-8 xl:gap-12">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition group">
              <div className="w-12 h-12 bg-gradient-to-tr from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-xl shadow-red-100 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-2xl">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                  PDF<span className="text-red-600">Market</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Dijital Mağaza</span>
              </div>
            </Link>
            
            {/* --- MENÜ LİNKLERİ --- */}
            {/* DÜZELTME: gap-1 yerine gap-6 yaptık, menüler ferahladı */}
            <div className="hidden md:flex items-center gap-6">
              
              <Link href="/" className={`${baseLinkClass} hover:text-blue-600 hover:bg-blue-50`}>
                <Home size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                Ana Sayfa
              </Link>

              <Link href="/explore" className={`${baseLinkClass} hover:text-violet-600 hover:bg-violet-50`}>
                <Compass size={18} className="text-violet-500 group-hover:scale-110 transition-transform" />
                Keşfet
              </Link>
              
              {/* Giriş Yapmış Kullanıcı Linkleri */}
              <SignedIn>
                  <Link href="/products/new" className={`${baseLinkClass} hover:text-emerald-600 hover:bg-emerald-50`}>
                    <UploadCloud size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    PDF Sat
                  </Link>

                  <Link href="/dashboard/library" className={`${baseLinkClass} hover:text-amber-600 hover:bg-amber-50`}>
                    <Library size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    Kütüphanem
                  </Link>
                  
                  {isSeller && (
                    <Link href="/dashboard/products" className={`${baseLinkClass} hover:text-rose-600 hover:bg-rose-50`}>
                      <Store size={18} className="text-rose-500 group-hover:scale-110 transition-transform" />
                      Satıcı Paneli
                    </Link>
                  )}
              </SignedIn>
            </div>
          </div>

          {/* --- SAĞ TARAF (AUTH) --- */}
          <div className="flex items-center gap-6">
            
            {isAdmin && (
               <Link href="/dashboard/admin" className="hidden lg:flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5">
                 <ShieldCheck size={16} />
                 Admin
               </Link>
            )}

            <div className="flex items-center gap-4">
              {/* GİRİŞ YAPMAMIŞSA */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-black font-bold text-lg px-6 py-3 hover:bg-gray-100 rounded-full transition-all">
                    Giriş Yap
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-xl shadow-red-200">
                    Kayıt Ol
                  </button>
                </SignUpButton>
              </SignedOut>

              {/* GİRİŞ YAPMIŞSA */}
              <SignedIn>
                <div className="flex items-center gap-4 pl-6 border-l border-gray-200 h-12">
                   <div className="flex flex-col items-end hidden sm:flex">
                     <span className="text-base font-bold text-gray-900">{user?.firstName}</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Hesabım</span>
                   </div>
                   <UserButton 
                     afterSignOutUrl="/"
                     appearance={{
                       elements: {
                         avatarBox: "w-12 h-12 border-2 border-white shadow-lg ring-2 ring-gray-50 hover:scale-105 transition-transform"
                       }
                     }}
                   />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}