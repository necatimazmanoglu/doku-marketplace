"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // Silme ikonu için

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form verileri
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    price: product.price || 0,
    tags: product.tags || "", // Etiketler eklendi
    category: product.category || "Ders Notları"
  });

  // GÜNCELLEME İŞLEMİ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API yolunu düzelttim: /api/products/[id] olmalı
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Güncelleme başarısız");
      }

      alert("Ürün başarıyla güncellendi! ✅");
      router.push("/dashboard/products"); 
      router.refresh(); 

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // SİLME İŞLEMİ (YENİ EKLENDİ)
  const handleDelete = async () => {
      if (!confirm("Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;

      setIsDeleting(true);
      try {
          const res = await fetch(`/api/products/${product.id}`, {
              method: "DELETE",
          });

          if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Silme işlemi başarısız");
          }

          alert("Ürün silindi. 🗑️");
          router.push("/dashboard/products");
          router.refresh();
      } catch (error: any) {
          alert("Hata: " + error.message);
          setIsDeleting(false);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Başlık Alanı */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Ürün Başlığı</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fiyat Alanı */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fiyat (TL)</label>
            <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">₺</span>
                <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
                required
                />
            </div>
            <p className="text-xs text-gray-400 mt-1">Ücretsiz yapmak için 0 girin.</p>
          </div>

          {/* Kategori Alanı */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition bg-white"
            >
                <option value="Ders Notları">Ders Notları</option>
                <option value="Sınav Hazırlık">Sınav Hazırlık</option>
                <option value="E-Kitap">E-Kitap</option>
                <option value="Diğer">Diğer</option>
            </select>
          </div>
      </div>

      {/* Etiket Alanı */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Etiketler</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Örn: tarih, kpss, not"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition"
        />
      </div>

      {/* Açıklama Alanı */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Açıklama</label>
        <textarea
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none transition resize-none"
          required
        />
      </div>

      {/* Butonlar */}
      <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4 border-t border-gray-100 mt-6">
        
        {/* Silme Butonu (Sol Tarafta) */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || loading}
          className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
            {isDeleting ? "Siliniyor..." : (
                <>
                    <Trash2 size={18} /> Ürünü Sil
                </>
            )}
        </button>

        <div className="flex-1 flex gap-4 justify-end">
            <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
            >
            İptal
            </button>
            <button
            type="submit"
            disabled={loading || isDeleting}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 flex justify-center items-center"
            >
            {loading ? (
                <span className="animate-pulse">Kaydediliyor...</span>
            ) : (
                "Değişiklikleri Kaydet"
            )}
            </button>
        </div>
      </div>
    </form>
  );
}