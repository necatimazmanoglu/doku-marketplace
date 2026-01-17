import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Hata veren Unsplash resimleri için
      },
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing'den gelen kapak resimleri için (Çok Önemli)
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk kullanıcı profil resimleri için
      },
    ],
  },
};

export default nextConfig;