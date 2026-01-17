"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  productId: string;
  price: number;
  isLoggedIn: boolean; // Bu bilgi sayfa tarafından gönderilecek
}

// "export default" yerine "export const" kullandık ki sayfa tarafındaki import { BuyButton } çalışsın.
export const BuyButton = ({ productId, price, isLoggedIn }: BuyButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    // 1. Giriş Kontrolü
    if (!isLoggedIn) {
      // Giriş yapmamışsa login sayfasına at, dönüşte tekrar buraya (veya checkout'a) gelsin
      const redirectPath = price === 0 ? `/products/${productId}` : `/checkout/${productId}`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectPath)}`);
      return;
    }

    // 2. ÜCRETSİZ ÜRÜN SENARYOSU (Hemen Al)
    if (price === 0) {
      try {
        setLoading(true);
        const res = await fetch("/api/payment/free", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
        });
        
        // Yanıtın JSON olup olmadığını kontrol et (Güvenlik önlemi)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Sunucudan geçersiz yanıt alındı.");
        }

        const data = await res.json();
        
        if (data.success) {
            router.push(`/orders/${data.orderId}`);
        } else {
            alert(data.error || "Hata oluştu");
        }
      } catch (err) {
        console.error(err);
        alert("İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. ÜCRETLİ ÜRÜN SENARYOSU (Ödeme Sayfasına Git)
    router.push(`/checkout/${productId}`);
  };

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className={`w-full py-4 rounded-xl font-black text-xl transition-all shadow-xl text-center flex items-center justify-center gap-2 active:scale-[0.98] ${
         price === 0 
         ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200" 
         : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
           <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
           <span>İşleniyor...</span>
        </div>
      ) : (
        <>
            <span>{price === 0 ? "Hemen Ücretsiz İndir" : "Güvenle Satın Al"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {price === 0 
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                }
            </svg>
        </>
      )}
    </button>
  );
};