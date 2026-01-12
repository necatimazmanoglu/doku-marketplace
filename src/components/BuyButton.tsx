"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyButton({ productId, price }: { productId: string; price: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // HATA BURADA: Sunucudan gelen gerçek hatayı ekrana basıyoruz
        throw new Error(data.details || data.error || "Bilinmeyen bir hata oluştu");
      }

      // Başarılıysa yönlendir
      router.push(`/orders/${data.id}`);

    } catch (error: any) {
      console.error("Satın alma hatası:", error);
      // Hatayı kullanıcıya (sana) gösteriyoruz
      alert(`HATA DETAYI:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
    >
      {loading ? "İşleniyor..." : (price === 0 ? "Hemen İndir (Ücretsiz)" : `Satın Al - ₺${price}`)}
    </button>
  );
}