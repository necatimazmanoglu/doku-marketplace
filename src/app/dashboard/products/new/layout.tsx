import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Kullanıcıyı Sunucu Tarafında Kontrol Et
  const user = await currentUser();

  if (!user) {
    redirect("/"); // Giriş yapmamışsa ana sayfaya gönder
  }

  // 2. Bu kullanıcının Satıcı Profili var mı?
  // NOT: Bu kodun çalışması için terminalde 'npx prisma db push' komutunu
  // çalıştırmış ve sunucuyu yeniden başlatmış olman gerekir.
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  // 3. Eğer satıcı profili YOKSA, "Satıcı Ol" sayfasına yönlendir
  if (!sellerProfile) {
    redirect("/become-seller");
  }

  // 4. Varsa, sayfayı (ürün ekleme formunu) göster
  return <>{children}</>;
}