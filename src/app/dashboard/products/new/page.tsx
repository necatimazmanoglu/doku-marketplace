"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadButton } from "@/utils/uploadthing"; // Yardımcı dosyamızdan çektik

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Eğitim",
    description: "",
  });

  // Dosya Linklerini ve Bilgilerini Tutacak State'ler
  const [pdfData, setPdfData] = useState<{ url: string; name: string; size: number } | null>(null);
  const [imageData, setImageData] = useState<{ url: string } | null>(null);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!pdfData) {
      alert("Lütfen önce PDF dosyasını yükleyin!");
      return;
    }

    setLoading(true);

    try {
      // Artık JSON olarak gönderiyoruz
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfUrl: pdfData.url,
          fileName: pdfData.name,
          fileSize: pdfData.size,
          imageUrl: imageData?.url || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || "Bir hata oluştu");
      }

      alert("Ürün başarıyla oluşturuldu! Yönetici onayına gönderildi.");
      router.push("/dashboard/seller"); 
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
          <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle (Cloud ☁️)</h1>
          <Link href="/dashboard/seller" className="text-indigo-600 hover:text-indigo-800 font-medium">
             İptal
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Başlığı *</label>
              <input type="text" name="title" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={handleChange} />
            </div>

            {/* Kategori ve Fiyat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="category" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={formData.category} onChange={handleChange}>
                  <option value="Eğitim">Eğitim</option>
                  <option value="Yazılım">Yazılım</option>
                  <option value="Tasarım">Tasarım</option>
                  <option value="Edebiyat">Edebiyat</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL) *</label>
                <input type="number" name="price" required min="0" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.price} onChange={handleChange} />
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea name="description" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={handleChange} />
            </div>

            {/* --- UPLOADTHING ALANLARI --- */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* PDF Yükleme */}
              <div className="text-center p-4 border rounded-xl bg-gray-50">
                <label className="block text-sm font-bold text-gray-900 mb-3">📄 PDF Dosyası</label>
                
                {pdfData ? (
                  <div className="text-green-600 font-medium flex flex-col items-center">
                    <span className="text-2xl mb-1">✅</span>
                    <span className="text-xs break-all">{pdfData.name}</span>
                    <button type="button" onClick={() => setPdfData(null)} className="text-xs text-red-500 underline mt-2">Değiştir</button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                      // Yükleme bitince burası çalışır
                      if (res && res[0]) {
                        setPdfData({
                          url: res[0].url,
                          name: res[0].name,
                          size: res[0].size,
                        });
                        alert("PDF Yüklendi!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Hata: ${error.message}`);
                    }}
                    appearance={{
                      button: "bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition",
                      allowedContent: "text-xs text-gray-400"
                    }}
                    content={{
                      button({ ready }) {
                        return ready ? "PDF Seç" : "Yükleniyor...";
                      },
                    }}
                  />
                )}
              </div>

              {/* Resim Yükleme */}
              <div className="text-center p-4 border rounded-xl bg-gray-50">
                <label className="block text-sm font-bold text-gray-900 mb-3">🖼️ Kapak Resmi</label>
                
                {imageData ? (
                  <div className="flex flex-col items-center">
                    <img src={imageData.url} alt="Kapak" className="w-20 h-20 object-cover rounded-md mb-2 border" />
                    <button type="button" onClick={() => setImageData(null)} className="text-xs text-red-500 underline">Resmi Kaldır</button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setImageData({ url: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Hata: ${error.message}`);
                    }}
                    appearance={{
                      button: "bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition",
                      allowedContent: "text-xs text-gray-400"
                    }}
                    content={{
                      button({ ready }) {
                        return ready ? "Resim Seç" : "Yükleniyor...";
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pdfData} // PDF yüklenmeden buton açılmaz
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Ürünü Yayınla 🚀"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}