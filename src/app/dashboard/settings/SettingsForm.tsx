"use client";

import { useState } from "react";
import { updateSellerSettings } from "@/app/actions/seller";
import { Store, Save, CreditCard } from "lucide-react";

interface SettingsFormProps {
  seller: {
    shopName: string;
    description: string | null;
    iban: string | null;
  };
}

export default function SettingsForm({ seller }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await updateSellerSettings(formData);
      if (result.success) {
        alert("✅ " + result.message);
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      alert("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      
      {/* 1. MAĞAZA KİMLİĞİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-100 pb-8">
        <div className="md:col-span-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Store size={18} />
            Mağaza Kimliği
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Müşterilerinizin sizi tanıyacağı isim ve açıklamalar.
          </p>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mağaza Adı</label>
            <input 
              name="shopName"
              type="text" 
              defaultValue={seller.shopName}
              required
              placeholder="Örn: Akademi Notları"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mağaza Açıklaması</label>
            <textarea 
              name="description"
              rows={4}
              defaultValue={seller.description || ""}
              placeholder="Hangi alanda içerik üretiyorsunuz? Kendinizden kısaca bahsedin."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* 2. ÖDEME BİLGİLERİ (IBAN) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={18} />
            Banka Bilgileri
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Ödemelerinizi alacağınız TR IBAN numarası.
          </p>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">IBAN Numarası</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 font-bold">TR</span>
            <input 
              name="iban"
              type="text" 
              defaultValue={seller.iban || ""}
              placeholder="00 0000 0000 0000 0000 0000 00"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition font-mono tracking-wide"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * IBAN bilginiz müşterilerle paylaşılmaz, sadece ödeme almanız içindir.
          </p>
        </div>
      </div>

      {/* KAYDET BUTONU */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
             <>Kayıt Ediliyor...</>
          ) : (
             <>
               <Save size={18} /> Değişiklikleri Kaydet
             </>
          )}
        </button>
      </div>

    </form>
  );
}