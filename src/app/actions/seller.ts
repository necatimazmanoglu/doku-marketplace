"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateSellerSettings(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Oturum açmanız gerekiyor.");
  }

  // Sadece istenen verileri alıyoruz
  const shopName = formData.get("shopName") as string;
  const description = formData.get("description") as string;
  const iban = formData.get("iban") as string;

  try {
    await prisma.sellerProfile.update({
      where: { userId: userId },
      data: {
        shopName,
        description,
        iban,
        // Instagram ve Website çıkarıldı
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/products`);
    
    return { success: true, message: "Ayarlar başarıyla kaydedildi." };

  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}