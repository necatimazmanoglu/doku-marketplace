"use client";

interface PDFPreviewProps {
  pdfUrl: string;
}

export default function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  // Google Docs Viewer servisi
  const encodedUrl = encodeURIComponent(pdfUrl);
  const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;

  return (
    <div className="w-full flex flex-col items-start">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Sayfa Önizlemesi
      </h3>
      
      {/* DIŞ ÇERÇEVE: Sabit Boyut */}
      <div className="w-[240px] h-[340px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md relative group select-none">
        
        {/* Iframe Konteynırı */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none pointer-events-none"
            title="PDF Önizleme"
            loading="lazy"
          />
        </div>

        {/* Arkaplan (Iframe yüklenemezse burası görünür) */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
          <div className="text-3xl mb-2">📄</div>
          <span className="text-[10px] font-bold">Önizleme Yükleniyor...</span>
          <span className="text-[8px] opacity-60 mt-1">(Eğer görünmüyorsa dosya linki yerel olabilir)</span>
        </div>

        {/* Koruyucu Katman */}
        <div className="absolute inset-0 z-20 bg-transparent cursor-default" />
        
        {/* Alt Bilgi */}
        <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-white via-white/80 to-transparent p-3 text-center">
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
               Örnek Sayfalar
             </span>
        </div>
      </div>
    </div>
  );
}