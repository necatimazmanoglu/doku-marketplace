import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Giriş yapmalısınız");
  return { userId: user.id };
};

export const ourFileRouter = {
  // Resim Yükleyicisi (4MB limit)
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resim yüklendi:", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // PDF Yükleyicisi (32MB limit)
  pdfUploader: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF yüklendi:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;