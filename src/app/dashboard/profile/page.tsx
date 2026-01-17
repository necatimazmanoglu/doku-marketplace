"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", surname: "", identityNumber: "",
    phone: "", city: "", address: "", zipCode: ""
  });

  // Sayfa açılınca mevcut veriyi çek
  useEffect(() => {
    fetch("/api/user/billing")
      .then(res => res.json())
      .then(data => {
        if(data && data.name) setFormData(prev => ({...prev, ...data}));
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/user/billing", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      alert("Bilgileriniz kaydedildi! Sonraki alışverişlerde otomatik gelecek.");
      router.refresh();
    } catch (err) {
      alert("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});

  if(loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-black mb-6">Fatura ve Teslimat Bilgilerim</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Ad</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Soyad</label>
                    <input name="surname" value={formData.surname} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">TC Kimlik No</label>
                <input name="identityNumber" maxLength={11} value={formData.identityNumber || ""} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Adres</label>
                <textarea rows={3} name="address" value={formData.address || ""} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Şehir</label>
                    <input name="city" value={formData.city || ""} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Posta Kodu</label>
                    <input name="zipCode" value={formData.zipCode || ""} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
            </div>
            <button disabled={saving} className="w-full bg-black text-white py-3 rounded-xl font-bold mt-4 hover:bg-gray-800 transition">
                {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
            </button>
        </form>
      </div>
    </div>
  );
}