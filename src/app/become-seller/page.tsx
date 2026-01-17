"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// LİNK İÇİN BU SATIRI EKLEDİK
import Link from "next/link"; 

export default function BecomeSellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    iban: "TR",
    taxId: "",
    address: "",
    isTermsAccepted: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!formData.isTermsAccepted) {
      alert("Lütfen satıcı sözleşmesini onaylayın.");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("/api/become-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/products/new"); 
        router.refresh();
      } else {
        alert(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      alert("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Satıcı Olun 🚀</h1>
          <p className="text-gray-500 mt-2">
            Ürün satmak için yasal bilgilerinizi tamamlamanız gerekmektedir.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Diğer inputlar (Mağaza Adı, IBAN vs.) aynı kalacak... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mağaza Adı *</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Örn: Yılmaz Eğitim Yayınları"
              value={formData.shopName}
              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN *</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              placeholder="TR00 0000..."
              value={formData.iban}
              onChange={(e) => setFormData({...formData, iban: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No (Opsiyonel)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.taxId}
              onChange={(e) => setFormData({...formData, taxId: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Fatura adresi..."
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {/* --- GÜNCELLENEN KISIM BURASI --- */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input 
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
              checked={formData.isTermsAccepted}
              onChange={(e) => setFormData({...formData, isTermsAccepted: e.target.checked})}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
              <Link 
                href="/legal/seller-terms" 
                target="_blank" 
                className="font-bold text-black underline hover:text-indigo-600 transition-colors"
              >
                Satıcı Satış Sözleşmesi
              </Link>
              'ni okudum, onaylıyorum.
            </label>
          </div>
          {/* -------------------------------- */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : "Hesabımı Satıcı Yap"}
          </button>
        </form>

      </div>
    </div>
  );
}