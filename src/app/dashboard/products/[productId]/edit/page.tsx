"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/FileUpload";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // Next.js 15'te params bir Promise'dir, onu çözüyoruz
  const { productId } = use(params);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Verileri
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  // Dosya Verileri
  const [pdfData, setPdfData] = useState<{ url: string; name: string; size: number } | null>(null);
  const [imageData, setImageData] = useState<{ url: string } | null>(null);

  // 1. Mevcut Verileri Çek
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        
        if (!res.ok) throw new Error("Ürün bulunamadı");
        
        const data = await res.json();
        
        // Formu doldur
        setFormData({
          title: data.title,
          price: data.price.toString(),
          category: data.category,
          description: data.description || "",
        });

        // Dosyaları doldur
        if (data.pdfUrl) {
          setPdfData({ url: data.pdfUrl, name: data.fileName || "Mevcut Dosya", size: data.fileSize || 0 });
        }
        if (data.imageUrl) {
          setImageData({ url: data.imageUrl });
        }
      } catch (error) {
        alert("Veriler yüklenirken hata oluştu veya yetkiniz yok.");
        router.push("/dashboard/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Güncellemeyi Kaydet
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!pdfData) {
      alert("Lütfen bir PDF dosyası olduğundan emin olun.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfUrl: pdfData.url,     // Yeni yüklenen veya mevcut dosya yolu
          fileName: pdfData.name,
          fileSize: pdfData.size,
          imageUrl: imageData?.url || "",
        }),
      });

      if (!response.ok) throw new Error("Güncelleme başarısız");

      alert("Ürün başarıyla güncellendi! 🎉");
      router.push("/dashboard/products");
      router.refresh();

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. Ürünü Silme Fonksiyonu
  const handleDelete = async () => {
    if(!confirm("Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if(!res.ok) throw new Error("Silme başarısız");
      
      alert("Ürün silindi.");
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ürünü Düzenle</h1>
          <div className="flex gap-4">
             <button onClick={handleDelete} type="button" className="text-red-500 font-bold hover:text-red-700 text-sm">
                Sil
             </button>
             <Link href="/dashboard/products" className="text-gray-500 hover:text-black font-medium">
                İptal
             </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Başlığı</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
                <input type="number" name="price" required min="0" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.price} onChange={handleChange} />
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea name="description" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={handleChange} />
            </div>

            {/* --- DOSYA GÜNCELLEME ALANI --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* PDF Yükleme */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                   PDF Dosyası <span className="text-red-500 text-xs">(Değiştirmek için kaldırıp yeni yükleyin)</span>
                </label>
                <FileUpload
                  endpoint="serverPdf"
                  value={pdfData?.url || ""}
                  onChange={(url, fileName, fileSize) => {
                    if (url) {
                      setPdfData({ url, name: fileName || "Yeni Dosya", size: fileSize || 0 });
                    } else {
                      setPdfData(null);
                    }
                  }}
                />
              </div>

              {/* Resim Yükleme */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Kapak Resmi</label>
                <FileUpload
                  endpoint="serverImage"
                  value={imageData?.url || ""}
                  onChange={(url) => {
                    if (url) setImageData({ url });
                    else setImageData(null);
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !pdfData}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}