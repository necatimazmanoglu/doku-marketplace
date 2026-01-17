"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/FileUpload";
import { ArrowLeft, Save, Trash2, Loader2, AlertTriangle, XCircle } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // Next.js 15: Parametreyi çözümlüyoruz
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const router = useRouter();
  
  // State Tanımları
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);  
  const [deleting, setDeleting] = useState(false); 
  const [error, setError] = useState<string | null>(null); // Hata mesajı için state

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  const [pdfData, setPdfData] = useState<{ url: string; name: string; size: number } | null>(null);
  const [imageData, setImageData] = useState<{ url: string } | null>(null);

  // 1. VERİLERİ ÇEK
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        
        // Hata Kontrolü: Eğer API hata dönerse yönlendirme yapma, hatayı ekrana bas.
        if (!res.ok) {
           setError(data.error || "Ürün bilgileri alınamadı.");
           setLoading(false);
           return; 
        }
        
        // Verileri State'e doldur
        setFormData({
          title: data.title,
          price: data.price.toString(),
          category: data.category || "Diğer",
          description: data.description || "",
        });

        if (data.pdfUrl) {
          setPdfData({ url: data.pdfUrl, name: data.fileName || "Mevcut Dosya", size: data.fileSize || 0 });
        }
        if (data.imageUrl) {
          setImageData({ url: data.imageUrl });
        }
      } catch (err) {
        console.error("Hata:", err);
        setError("Sunucu ile bağlantı kurulamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. GÜNCELLEME İŞLEMİ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfData) return alert("Lütfen PDF dosyası olduğundan emin olun.");

    setSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfUrl: pdfData.url,
          fileName: pdfData.name,
          fileSize: pdfData.size,
          imageUrl: imageData?.url || "",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Güncelleme başarısız");
      }

      alert("Ürün başarıyla güncellendi! Onay için tekrar sıraya alındı.");
      router.push("/dashboard/products");
      router.refresh(); 

    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. SİLME İŞLEMİ
  const handleDelete = async () => {
    if(!confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if(!res.ok) throw new Error("Silme başarısız");
      
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      alert("Silme hatası.");
      setDeleting(false);
    }
  };

  // Yükleniyor Ekranı
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <span className="text-gray-500 font-medium animate-pulse">Ürün bilgileri getiriliyor...</span>
      </div>
    );
  }

  // HATA EKRANI (Sayfa kapanmaz, hatayı gösterir)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} />
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Erişim Hatası</h2>
           <p className="text-gray-500 mb-6">{error}</p>
           <Link 
             href="/dashboard/products" 
             className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
           >
             Listeye Dön
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Üst Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div>
             <Link href="/dashboard/products" className="flex items-center gap-1 text-gray-500 hover:text-black mb-1 transition text-sm font-medium">
                <ArrowLeft size={16} /> Listeye Dön
             </Link>
             <h1 className="text-3xl font-black text-gray-900">Ürünü Düzenle</h1>
          </div>
          
          <button 
            onClick={handleDelete} 
            disabled={deleting}
            type="button" 
            className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-bold transition disabled:opacity-50"
          >
            {deleting ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18} />}
            Sil
          </button>
        </div>

        {/* Form Alanı */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Temel Bilgiler */}
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Ürün Başlığı</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition" 
                    value={formData.title} 
                    onChange={handleChange} 
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-900 mb-2">Kategori</label>
                     <select 
                        name="category" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none bg-white transition" 
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
                     <label className="block text-sm font-bold text-gray-900 mb-2">Fiyat (₺)</label>
                     <input 
                        type="number" 
                        name="price" 
                        required 
                        min="0" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition" 
                        value={formData.price} 
                        onChange={handleChange} 
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Açıklama</label>
                  <textarea 
                    name="description" 
                    rows={5} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition" 
                    value={formData.description} 
                    onChange={handleChange} 
                  />
               </div>
            </div>

            {/* Uyarı Kutusu */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                <p className="text-sm text-yellow-800 font-medium">
                    Ürün bilgilerinde veya dosyalarda değişiklik yaparsanız, ürününüz güvenlik kontrolü için <strong>tekrar onaya gönderilecektir.</strong>
                </p>
            </div>

            {/* Dosya Yükleme Alanı */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
                <h3 className="font-bold text-gray-900">Dosya Güncelleme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">PDF Dosyası</label>
                      <FileUpload
                         endpoint="serverPdf"
                         value={pdfData?.url || ""} 
                         onChange={(url, fileName, fileSize) => {
                            if (url) setPdfData({ url, name: fileName || "Yeni Dosya", size: fileSize || 0 });
                            else setPdfData(null);
                         }}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kapak Görseli</label>
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
            </div>

            <button 
               type="submit" 
               disabled={saving || !pdfData} 
               className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
               {saving ? (
                  <>
                     <Loader2 className="animate-spin" /> Kaydediliyor...
                  </>
               ) : (
                  <>
                     <Save size={20} /> Değişiklikleri Kaydet
                  </>
               )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}