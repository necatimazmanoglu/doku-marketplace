"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Eğitim", // Varsayılan
    description: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "Bir hata oluştu");
      }

      alert("Ürün başarıyla oluşturuldu! Vitrine yönlendiriliyorsunuz.");
      router.push("/"); 
      router.refresh(); 

    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Yeni PDF Ürünü</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
             İptal
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Başlığı *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Örn: React.js Eğitim Kitabı"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Kategori ve Fiyat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Eğitim">Eğitim</option>
                  <option value="Yazılım">Yazılım</option>
                  <option value="Tasarım">Tasarım</option>
                  <option value="Edebiyat">Edebiyat</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (TL) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama *
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Ürününüzü detaylıca anlatın..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Dosya Yükleme Alanı (Görsel Olarak Eklendi) */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Dosyası *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <div className="text-4xl mb-2">qx</div>
                <p className="text-sm text-gray-500 font-medium">Dosyayı buraya sürükleyin veya seçin</p>
                <p className="text-xs text-gray-400 mt-1">(Şu an test modundayız, otomatik örnek dosya yüklenecek)</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Oluşturuluyor..." : "Ürünü Oluştur"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}