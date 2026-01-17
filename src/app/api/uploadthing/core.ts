import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Kullanıcının giriş yapıp yapmadığını kontrol eden fonksiyon
const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Giriş yapmalısınız (Unauthorized)");
  return { userId };
};

// --- BURASI KRİTİK ---
// Frontend'de "endpoint" olarak verdiğimiz isimler (serverImage, serverPdf)
// BURADAKİ anahtarlarla (keys) birebir aynı olmalıdır.
export const ourFileRouter = {
  
  // 1. Resim Yükleyici (Kapak Resimleri için)
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resim yüklendi, User ID:", metadata.userId);
      console.log("Dosya URL:", file.url);
    }),

  // 2. PDF Yükleyici (Satılacak Ürünler için)
  serverPdf: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF yüklendi, User ID:", metadata.userId);
      console.log("Dosya URL:", file.url);
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;