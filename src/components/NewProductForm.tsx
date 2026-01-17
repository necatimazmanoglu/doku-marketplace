"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/FileUpload"; 
import { ShieldCheck, AlertCircle, FileText, Image as ImageIcon, Plus, Loader2 } from "lucide-react";

const CATEGORIES = [
  "E-Kitap",
  "Ders Notları",
  "Sınav Hazırlık",
  "Yazılım & Kod",
  "Tasarım Şablonları",
  "İş & Kariyer",
  "Diğer",
];

export default function NewProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: CATEGORIES[0],
    tags: "",
    description: "",
  });

  const [pdfData, setPdfData] = useState<{ url: string; name: string; size: number } | null>(null);
  const [imageData, setImageData] = useState<{ url: string } | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isAgreed) {
      setError("Devam etmek için hukuki sorumluluk ve satış sözleşmesini onaylamanız gerekmektedir.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.title || formData.price === "" || !formData.description || !pdfData) {
      setError("Lütfen zorunlu alanları (Ürün İsmi, Fiyat, Açıklama ve PDF) doldurun.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          pdfUrl: pdfData.url,
          fileName: pdfData.name,
          fileSize: pdfData.size,
          imageUrl: imageData?.url || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ürün oluşturulurken bir hata meydana geldi.");
      }

      router.push("/dashboard/products");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* --- Ürün Bilgileri --- */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Ürün İsmi *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-50 outline-none transition-all font-medium"
            placeholder="Örn: 2024 TYT Matematik Ders Notları"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all font-medium bg-white cursor-pointer"
            >
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Fiyat (TL) *</label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all font-medium"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400 font-bold">₺</div>
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-900 mb-2">Etiketler</label>
           <input 
             type="text" 
             name="tags" 
             value={formData.tags}
             onChange={handleChange}
             placeholder="Örn: kpss, tarih, özet, 2024, sınav (Virgül ile ayırın)"
             className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-50 outline-none transition-all font-medium" 
           />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Açıklama *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all font-medium resize-none"
            placeholder="Ürünün içeriği hakkında detaylı bilgi verin..."
            required
          />
        </div>
      </div>

      {/* --- DOSYA YÜKLEME ALANLARI (DÜZELTİLDİ: Endpointler) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 pt-6 border-t border-gray-50">
          
          {/* PDF YÜKLEME KUTUSU */}
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-dashed border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <FileText size={18} />
                  </div>
                  <label className="text-sm font-bold text-gray-900">
                      PDF Dosyası <span className="text-red-500">*</span>
                  </label>
              </div>
              {/* DÜZELTME: endpoint="serverPdf" yapıldı */}
              <FileUpload
                  endpoint="serverPdf" 
                  value={pdfData?.url || ""}
                  onChange={(url, fileName, fileSize) => {
                      if (url) setPdfData({ url, name: fileName || "Dosya", size: fileSize || 0 });
                      else setPdfData(null);
                  }}
              />
          </div>

          {/* KAPAK GÖRSELİ YÜKLEME KUTUSU */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                      <ImageIcon size={18} />
                  </div>
                  <label className="text-sm font-bold text-gray-900">
                      Kapak Görseli <span className="text-gray-400 text-xs font-normal ml-1">(Opsiyonel)</span>
                  </label>
              </div>
              {/* DÜZELTME: endpoint="serverImage" yapıldı */}
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

      {/* --- Hukuki Sözleşme Onayı --- */}
      <div className={`mb-8 p-6 rounded-2xl border transition-all ${isAgreed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <input 
              id="product-terms"
              type="checkbox"
              className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black cursor-pointer accent-black"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="product-terms" className="text-sm font-bold text-gray-900 cursor-pointer select-none">
              Hukuki Beyan ve Satış Şartları
            </label>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bu ürünü yükleyerek, içerdiği tüm materyallerin <span className="font-bold text-gray-900">telif haklarının bana ait olduğunu</span>, 
              üçüncü şahısların haklarını ihlal etmediğini ve <Link href="/legal/seller-terms" target="_blank" className="font-bold text-black underline hover:text-red-600">Satıcı Kuralları</Link>'na uygun olduğunu beyan ederim. 
              Olası telif ihlallerinde tüm hukuki sorumluluğu kabul ediyorum.
            </p>
          </div>
        </div>
      </div>

      {/* --- Aksiyon Butonları --- */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8">
        <Link href="/dashboard/products" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">Vazgeç</Link>
        <button
          type="submit"
          disabled={loading || !pdfData || !isAgreed}
          className={`px-10 py-4 rounded-2xl font-black text-white transition-all shadow-lg flex items-center gap-2 ${
            loading || !pdfData || !isAgreed
              ? "bg-gray-200 cursor-not-allowed shadow-none" 
              : "bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-gray-200"
          }`}
        >
          {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
          ) : (
              <Plus className="w-5 h-5" />
          )}
          {loading ? "İşleniyor..." : "Ürünü Yayına Al"}
        </button>
      </div>
    </form>
  );
}