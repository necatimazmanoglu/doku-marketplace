"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "Hepsi",
  "E-Kitap",
  "Ders Notları",
  "Sınav Hazırlık",
  "Yazılım & Kod",
  "Tasarım Şablonları",
  "İş & Kariyer",
  "Diğer",
];

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'deki mevcut değerleri al (Sayfa yenilense bile korunsun)
  const currentCategory = searchParams.get("category") || "Hepsi";
  const currentSearch = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Kategoriye Tıklanınca Çalışır
  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (cat === "Hepsi") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    
    // Arama terimini koruyarak sadece kategoriyi değiştir
    router.push(`/explore?${params.toString()}`);
  };

  // Arama Yapılınca (Enter veya Buton)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm.trim() === "") {
      params.delete("q");
    } else {
      params.set("q", searchTerm);
    }

    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      
      {/* --- 1. ARAMA KUTUSU --- */}
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          placeholder="Not, kitap veya kod ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-black focus:ring-1 focus:ring-black outline-none shadow-sm transition-all font-medium group-hover:shadow-md"
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-black transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </form>

      {/* --- 2. KATEGORİ LİSTESİ --- */}
      <div>
        <h3 className="font-black text-gray-900 mb-4 px-2 text-sm uppercase tracking-wider">Kategoriler</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                currentCategory === cat 
                  ? "bg-black text-white shadow-lg shadow-gray-200 scale-105" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {cat}
              {currentCategory === cat && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}