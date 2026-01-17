import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewProductForm from "@/components/NewProductForm"; // Ortak bileşeni çağırıyoruz

export default function NewProductDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      
      {/* Üst Başlık ve İptal Butonu */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Doküman Yükle</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Satıcı panelinden yeni bir dijital ürün oluşturun.
          </p>
        </div>
        <Link 
          href="/dashboard/products" 
          className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors p-2 hover:bg-gray-100 rounded-lg"
        >
           <ArrowLeft size={18} /> İptal
        </Link>
      </div>

      {/* Daha önce hazırladığımız, içinde:
        - Modern FileUpload bileşeni
        - Hukuki Onay Kutucuğu
        - Şık Form Tasarımı
        bulunan ana bileşeni buraya yerleştiriyoruz.
      */}
      <NewProductForm />
      
    </div>
  );
}