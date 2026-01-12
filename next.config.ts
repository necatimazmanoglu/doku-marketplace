import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  // Eğer burada "middleware" veya "output: export" satırı varsa SİL.
};

export default nextConfig;