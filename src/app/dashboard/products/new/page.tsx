"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadButton } from "@/utils/uploadthing";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Eğitim",
    description: "",
  });

  const [pdfData, setPdfData] = useState<{ url: string; name: string; size: number } | null>(null);
  const [imageData, setImageData] = useState<{ url: string } | null>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

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
          <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
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

            {/* --- DÜZELTİLMİŞ YÜKLEME ALANLARI --- */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* PDF Yükleme */}
              <div className={`relative text-center p-6 border-2 border-dashed rounded-xl transition-all group ${pdfData ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'}`}>
                
                {pdfData ? (
                  // Dosya Yüklendiyse
                  <div className="flex flex-col items-center relative z-20">
                    <span className="text-3xl mb-2">✅</span>
                    <p className="text-sm font-bold text-gray-900 break-all">{pdfData.name}</p>
                    <p className="text-xs text-gray-500">{(pdfData.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPdfData(null); }} className="text-xs text-red-500 underline mt-3 hover:text-red-700">
                      Dosyayı Kaldır
                    </button>
                  </div>
                ) : (
                  // Dosya Yüklenmediyse
                  <div className="flex flex-col items-center justify-center relative z-20 pointer-events-none">
                    {isPdfUploading ? (
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                    ) : (
                      <span className="text-4xl mb-2 text-gray-400 group-hover:text-indigo-500 transition-colors">📄</span>
                    )}
                    <p className="text-sm font-bold text-gray-900">PDF Dosyası</p>
                    <p className="text-xs text-gray-500 mt-1">{isPdfUploading ? "Yükleniyor..." : "Seçmek için tıklayın (Max 32MB)"}</p>
                  </div>
                )}

                {/* GÖRÜNMEZ UPLOADTHING BUTONU (Tüm alanı kaplar) */}
                {!pdfData && (
                  <div className="absolute inset-0 w-full h-full opacity-0 z-10">
                    <UploadButton
                      endpoint="pdfUploader"
                      onUploadProgress={() => setIsPdfUploading(true)}
                      onClientUploadComplete={(res) => {
                        setIsPdfUploading(false);
                        if (res && res[0]) {
                          setPdfData({ url: res[0].url, name: res[0].name, size: res[0].size });
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsPdfUploading(false);
                        alert(`Hata: ${error.message}`);
                      }}
                      appearance={{
                        button: "w-full h-full cursor-pointer",
                        container: "w-full h-full",
                        allowedContent: "hidden"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Resim Yükleme */}
              <div className={`relative text-center p-6 border-2 border-dashed rounded-xl transition-all group ${imageData ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer'}`}>
                
                {imageData ? (
                  // Resim Yüklendiyse
                  <div className="flex flex-col items-center relative z-20">
                    <img src={imageData.url} alt="Kapak" className="w-24 h-24 object-cover rounded-lg mb-2 border-2 border-white shadow-sm" />
                    <p className="text-sm font-bold text-gray-900">Kapak Resmi</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setImageData(null); }} className="text-xs text-red-500 underline mt-2 hover:text-red-700">
                      Resmi Kaldır
                    </button>
                  </div>
                ) : (
                  // Resim Yüklenmediyse
                  <div className="flex flex-col items-center justify-center relative z-20 pointer-events-none">
                    {isImageUploading ? (
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600 mb-2"></div>
                    ) : (
                      <span className="text-4xl mb-2 text-gray-400 group-hover:text-purple-500 transition-colors">🖼️</span>
                    )}
                    <p className="text-sm font-bold text-gray-900">Kapak Resmi</p>
                    <p className="text-xs text-gray-500 mt-1">{isImageUploading ? "Yükleniyor..." : "Seçmek için tıklayın (Opsiyonel)"}</p>
                  </div>
                )}

                {/* GÖRÜNMEZ UPLOADTHING BUTONU (Tüm alanı kaplar) */}
                {!imageData && (
                  <div className="absolute inset-0 w-full h-full opacity-0 z-10">
                    <UploadButton
                      endpoint="imageUploader"
                      onUploadProgress={() => setIsImageUploading(true)}
                      onClientUploadComplete={(res) => {
                        setIsImageUploading(false);
                        if (res && res[0]) {
                          setImageData({ url: res[0].url });
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsImageUploading(false);
                        alert(`Hata: ${error.message}`);
                      }}
                      appearance={{
                        button: "w-full h-full cursor-pointer",
                        container: "w-full h-full",
                        allowedContent: "hidden"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !pdfData || isPdfUploading || isImageUploading}
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