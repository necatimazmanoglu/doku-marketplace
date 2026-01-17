import Link from "next/link";
import { ShieldCheck, Package, LayoutDashboard, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="text-red-500" />
            <span>ADMIN</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition">
             <Package size={20} />
             <span>Ürün Onayları</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mt-10">
             <LayoutDashboard size={20} />
             <span>Mağazama Dön</span>
          </Link>
        </nav>
      </aside>

      {/* İçerik */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}