"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Settings, 
  Plus, 
  Store
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Kütüphane sayfasında mıyız?
  const isLibraryPage = pathname.includes("/dashboard/library");

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const sellerRoutes = [
    { name: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ürünlerim", href: "/dashboard/products", icon: Package },
  ];

  const buyerRoutes = [
    { name: "Kütüphanem", href: "/dashboard/library", icon: BookOpen },
    { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      
      {/* --- SIDEBAR (SOL MENÜ) --- */}
      {/* Sadece kütüphane sayfası DEĞİLSE göster */}
      {!isLibraryPage && (
        <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20 shadow-sm transition-all duration-300">
          
          {/* Logo */}
          <div className="p-8 pb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-black text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                 <Store size={20} />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                MARKET<span className="text-indigo-600">.</span>
              </span>
            </Link>
          </div>

          {/* CTA Butonu */}
          <div className="px-6 mb-6">
            <Link 
              href="/dashboard/products/new" 
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Yeni Ürün Ekle
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* SATICI GRUBU */}
            <div>
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mağaza Yönetimi</p>
              <div className="space-y-1">
                {sellerRoutes.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
                      isActive(item.href) 
                        ? "bg-gray-100 text-black font-bold" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <item.icon size={20} className={isActive(item.href) ? "text-indigo-600" : "text-gray-400 group-hover:text-black"} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* KİŞİSEL GRUP */}
            <div>
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kişisel</p>
              <div className="space-y-1">
                {buyerRoutes.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
                      isActive(item.href) 
                        ? "bg-gray-100 text-black font-bold" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <item.icon size={20} className={isActive(item.href) ? "text-indigo-600" : "text-gray-400 group-hover:text-black"} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </nav>

          {/* Alt Kullanıcı Alanı */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="bg-white p-1 rounded-full shadow-sm">
                  <UserButton afterSignOutUrl="/" />
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-gray-900 truncate">Hesabım</p>
                  <p className="text-[10px] text-gray-500 truncate">Profil Ayarları</p>
               </div>
            </div>
          </div>
        </aside>
      )}

      {/* --- ANA İÇERİK --- */}
      {/* Eğer Kütüphane sayfasındaysak margin bırakma, tam ekran olsun */}
      <main className={`flex-1 p-6 md:p-10 transition-all duration-300 ${!isLibraryPage ? "md:ml-72" : ""}`}>
        <div className={`mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ${!isLibraryPage ? "max-w-6xl" : "max-w-7xl"}`}>
           {children}
        </div>
      </main>
      
    </div>
  );
}