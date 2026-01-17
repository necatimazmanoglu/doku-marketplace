import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewProductForm from "@/components/NewProductForm"; // Az önce oluşturduğumuz bileşeni çağırıyoruz

// Bu sayfa Sunucu tarafında (Server Component) çalışır
export default async function NewProductPage() {
  // 1. Kullanıcı Giriş Kontrolü
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Satıcı Profili Kontrolü
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
  });

  // 3. EĞER SATICI PROFİLİ YOKSA -> Satıcı Olma Sayfasına Yönlendir
  if (!sellerProfile) {
    redirect("/become-seller");
  }

  // 4. Satıcıysa Formu Göster
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Üst Başlık Kısmı */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Ürün Satışa Çıkar</h1>
            <p className="text-gray-500 mt-2">
              Dijital ürününü yükle, fiyatını belirle ve kazanmaya başla.
            </p>
          </div>
          {/* İptal butonu ana sayfaya döner */}
          <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-black font-medium transition">
             <ArrowLeft size={16} /> İptal
          </Link>
        </div>

        {/* Form Bileşeni */}
        <NewProductForm />
        
      </div>
    </div>
  );
}