"use client";

import { useState } from "react";
import Image from "next/image";
// UploadThing hook'unu kullanacağız ki senin tasarımın bozulmadan yükleme yapabilelim
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core"; 

// Eğer utils dosyan farklıysa burayı güncelle (genelde src/lib/uploadthing.ts olur)
import { useUploadThing } from "@/lib/uploadthing"; 

interface FileUploadProps {
  endpoint: "serverImage" | "serverPdf";
  value: string;
  onChange: (url: string, fileName?: string, fileSize?: number) => void;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // UploadThing hook'u (Senin özel tasarımını backend'e bağlar)
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      if (file) {
        setIsLoading(false);
        // URL, İsim ve Boyutu üst bileşene gönderiyoruz
        onChange(file.url, file.name, file.size);
      }
    },
    onUploadError: (err: Error) => {
      setIsLoading(false);
      setError(err.message || "Yükleme hatası");
    },
    onUploadBegin: () => {
      setIsLoading(true);
      setError("");
    }
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Seçilen dosyayı UploadThing ile yükle
    await startUpload(Array.from(files));
  };

  // --- BURADAN AŞAĞISI SENİN TASARIMIN (DOKUNULMADI) ---

  if (value) {
    return (
      <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        {endpoint === "serverImage" ? (
           <div className="relative w-20 h-20 rounded-lg overflow-hidden">
             <Image fill src={value} alt="Upload" className="object-cover" />
           </div>
        ) : (
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{value.split('/').pop()}</p>
            <p className="text-xs text-green-600 font-medium">Yüklendi</p>
        </div>

        <button
          onClick={() => onChange("")} // Silme işlemi
          type="button"
          className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative">
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 6 4.5M12 3v13.5" />
            </svg>
            <p className="mb-1 text-sm text-gray-500"><span className="font-bold text-gray-700">Tıklayın</span> veya dosyayı sürükleyin</p>
            <p className="text-xs text-gray-400">PDF veya Resim (Max 10MB)</p>
          </div>
        )}
        
        <input 
          type="file" 
          className="hidden" 
          onChange={handleUpload}
          // Accept parametresini endpoint'e göre ayarlıyoruz
          accept={endpoint === "serverPdf" ? ".pdf" : "image/*"}
          disabled={isLoading}
        />
      </label>
      
      {error && (
        <p className="text-xs text-red-500 mt-2 font-medium">Hata: {error}</p>
      )}
    </div>
  );
};