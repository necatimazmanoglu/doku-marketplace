import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi - PDF Market",
  description: "PDF Market dijital ürün satışlarına dair mesafeli satış sözleşmesi.",
};

export default function DistanceSalesPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Üst Başlık Alanı */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            İşbu sözleşme, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğince düzenlenmiştir.
          </p>
          <p className="text-sm font-bold text-gray-400 mt-6 uppercase tracking-widest">
            Son Güncelleme: 12 Ocak 2026
          </p>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-red mx-auto text-gray-600 text-justify">
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 1: TARAFLAR</h3>
          <p className="mb-4">
            <strong>1.1. SATICI:</strong>
            <br />
            Satıcı, PDF Market platformu ("Platform") üzerinden dijital ürününü satışa sunan, ürün detay sayfasında bilgileri yer alan kullanıcıdır. (Bundan sonra "SATICI" olarak anılacaktır.)
            <br /><br />
            <strong>1.2. ALICI:</strong>
            <br />
            Platform üzerinden dijital ürün satın alan gerçek veya tüzel kişidir. (Bundan sonra "ALICI" olarak anılacaktır.)
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 2: KONU</h3>
          <p className="mb-4">
            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait dijital ürünü (PDF, e-kitap vb.) Platform üzerinden sipariş vermesi ve satın alması ile ilgili olarak, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 3: SÖZLEŞME KONUSU ÜRÜN VE TESLİMAT</h3>
          <p className="mb-4">
            <strong>3.1.</strong> Sözleşme konusu ürün, elektronik ortamda indirilebilir (download edilebilir) gayrimaddi bir maldır (PDF Dosyası).
            <br />
            <strong>3.2.</strong> Ürün, ödemenin başarılı bir şekilde gerçekleşmesinin ardından ALICI'nın "Kütüphanem" sayfasına anında ve otomatik olarak teslim edilir. Fiziksel bir kargo gönderimi yapılmayacaktır.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 4: GENEL HÜKÜMLER</h3>
          <p className="mb-4">
            <strong>4.1.</strong> ALICI, Platform üzerinde ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
            <br />
            <strong>4.2.</strong> SATICI, sözleşme konusu ürünün sağlam, eksiksiz ve belirtilen niteliklere uygun olarak sunulmasından sorumludur. Ancak Platform (PDF Market), yer sağlayıcı olarak içeriklerin doğruluğunu garanti etmez.
          </p>

          {/* KRİTİK MADDE: CAYMA HAKKI İSTİSNASI */}
          <div className="bg-gray-100 border-l-4 border-black p-6 my-8 rounded-r-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">MADDE 5: CAYMA HAKKI VE İADE KOŞULLARI</h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              <strong>5.1.</strong> Mesafeli Sözleşmeler Yönetmeliği'nin 15. Maddesi (ğ) bendi uyarınca; <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallar"</strong> cayma hakkı kapsamı dışındadır.
              <br /><br />
              <strong>5.2.</strong> ALICI, satın aldığı PDF dosyasının bilgisayarına/cihazına indirilmeye hazır hale gelmesiyle birlikte hizmetin ifa edilmiş sayılacağını ve bu aşamadan sonra <strong>ürünü beğenmeme, vazgeçme vb. nedenlerle cayma (iade) hakkını kullanamayacağını</strong> peşinen kabul eder.
              <br /><br />
              <strong>5.3.</strong> Yalnızca dosyanın teknik olarak bozuk olduğu (açılmadığı, içeriğin boş olduğu) ve Platform tarafından teyit edildiği durumlarda ücret iadesi yapılabilir.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 6: UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
          <p className="mb-4">
            İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-2">MADDE 7: YÜRÜRLÜK</h3>
          <p className="mb-8">
            ALICI, Platform üzerinden verdiği siparişe ait ödemeyi gerçekleştirdiğinde işbu sözleşmenin tüm şartlarını kabul etmiş sayılır.
          </p>

        </div>

        {/* Alt Buton */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
          <Link 
            href="/" 
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg"
          >
            Okudum, Onaylıyorum
          </Link>
        </div>
      </div>
    </div>
  );
}