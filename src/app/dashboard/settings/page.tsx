import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm"; // 2. Adımda oluşturduğumuz dosya

export default async function SettingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
     redirect("/sign-in");
  }

  // Şemana göre 'SellerProfile' tablosundan veriyi çekiyoruz
  // userId (Clerk ID) bu tabloda 'userId' alanıyla eşleşiyor.
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: userId }
  });

  // Eğer satıcı profili yoksa, satıcı olma sayfasına yönlendir
  if (!seller) {
     redirect("/become-seller"); // Bu sayfayı henüz yapmadıysak Dashboard'a atabilirsin
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Mağaza Ayarları</h1>
        <p className="text-gray-500 mt-2">Mağaza bilgilerinizi ve ödeme alma (IBAN) detaylarınızı güncelleyin.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Veriyi Form bileşenine gönderiyoruz */}
        <SettingsForm seller={seller} />
      </div>
    </div>
  );
}