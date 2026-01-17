"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ product, userId }: { product: any; userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    identityNumber: "", // TCKN (Zorunlu)
    email: "",
    phone: "",
    city: "",
    country: "Türkiye",
    address: "",
    zipCode: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("Lütfen Mesafeli Satış Sözleşmesi'ni onaylayın.");
      return;
    }

    setLoading(true);
    
    try {
        // API'ye İstek At (iyzico'yu başlat)
        const res = await fetch("/api/payment/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: product.id,
                buyerInfo: formData // Formdaki tüm verileri gönderiyoruz
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Ödeme başlatılamadı.");
        }

        // iyzico BAŞARILI DÖNDÜ
        // Kullanıcıyı iyzico'nun ödeme ekranına yönlendir
        if (data.paymentPageUrl) {
            window.location.href = data.paymentPageUrl;
        } else {
            alert("Ödeme linki alınamadı.");
        }
        
    } catch (error: any) {
        alert("Hata: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Ad Soyad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adınız</label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="Örn: Ahmet"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Soyadınız</label>
          <input
            type="text"
            name="surname"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="Örn: Yılmaz"
          />
        </div>
      </div>

      {/* TCKN ve Telefon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">TC Kimlik No</label>
           <input
            type="text"
            name="identityNumber"
            required
            maxLength={11}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="11 haneli TCKN"
          />
           <p className="text-[10px] text-gray-400 mt-1">* Fatura kesimi için yasal zorunluluktur.</p>
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
           <input
            type="tel"
            name="phone"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="05XX XXX XX XX"
          />
        </div>
      </div>

      {/* Adres */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Açık Adres</label>
        <textarea
          name="address"
          required
          rows={3}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900 resize-none"
          placeholder="Mahalle, Sokak, Kapı No..."
        />
      </div>

      {/* Şehir / Posta Kodu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Şehir</label>
           <input
            type="text"
            name="city"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="Örn: İstanbul"
          />
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Posta Kodu</label>
           <input
            type="text"
            name="zipCode"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition font-medium text-gray-900"
            placeholder="34000"
          />
        </div>
      </div>

      {/* Sözleşme Onayı */}
      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 border-gray-300 rounded text-black focus:ring-black"
          />
        </div>
        <label htmlFor="terms" className="text-xs text-gray-600 font-medium">
          <span className="font-bold text-black">Ön Bilgilendirme Koşulları</span>'nı ve <span className="font-bold text-black">Mesafeli Satış Sözleşmesi</span>'ni okudum, onaylıyorum.
        </label>
      </div>

      {/* Ödeme Butonu */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-xl font-black text-lg hover:bg-gray-800 transition shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
            <>
               <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
               İşleniyor...
            </>
        ) : (
            <>
               <span>Güvenli Ödeme ile Tamamla</span>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </>
        )}
      </button>

    </form>
  );
}