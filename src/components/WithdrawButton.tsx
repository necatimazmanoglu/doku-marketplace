"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  balance: number;
  hasIban: boolean;
}

export default function WithdrawButton({ balance, hasIban }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWithdraw = async () => {
    if (!hasIban) {
      alert("Lütfen önce ayarlar sayfasından IBAN ekleyin.");
      return;
    }

    const amountStr = prompt(`Çekmek istediğiniz tutarı girin (Maks: ${balance} TL):`, balance.toString());
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      alert("Geçersiz tutar.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/seller/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Talebiniz alındı! Admin onayından sonra hesabınıza yatırılacaktır.");
      router.refresh(); // Sayfayı yenile (Bakiye güncellensin)

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWithdraw}
      disabled={loading || balance <= 0}
      className={`px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
        balance > 0 
          ? "bg-white text-black hover:bg-gray-100 hover:scale-105" 
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
      }`}
    >
      {loading ? "İşleniyor..." : "💸 Para Çek"}
    </button>
  );
}