import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Kullanıcı Sözleşmesi - PDF Market",
  description: "PDF Market satıcı ve alıcı yükümlülükleri, telif hakları ve kullanım şartları.",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Üst Başlık Alanı */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Kullanıcı Sözleşmesi
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Platformu kullanmadan önce haklarınızı ve yükümlülüklerinizi lütfen dikkatlice okuyunuz.
          </p>
          <p className="text-sm font-bold text-gray-400 mt-6 uppercase tracking-widest">
            Son Güncelleme: 12 Ocak 2026
          </p>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-red mx-auto text-gray-600">
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Taraflar ve Konu</h3>
          <p className="mb-6 leading-relaxed">
            Bu sözleşme, PDF Market ("Platform") ile siteye üye olan, ürün satan ("Satıcı") veya ürün satın alan ("Alıcı") kullanıcılar arasındadır. Siteye üye olarak veya alışveriş yaparak bu şartları peşinen kabul etmiş sayılırsınız.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Platformun Rolü (Yer Sağlayıcı)</h3>
          <p className="mb-6 leading-relaxed">
            PDF Market, 5651 sayılı kanun kapsamında "Yer Sağlayıcı" olarak hizmet vermektedir. Platform, satıcılar tarafından yüklenen içeriklerin doğruluğunu, özgünlüğünü veya hukuka uygunluğunu denetlemekle yükümlü değildir. Ancak, telif hakkı ihlali bildirimi (uyar-kaldır) yapıldığında ilgili içeriği yayından kaldırma hakkını saklı tutar.
          </p>

          {/* KRİTİK MADDE 1: SATICI SORUMLULUĞU */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 my-8 rounded-r-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Satıcıların Yükümlülükleri ve Telif Hakkı Beyanı</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              <strong>3.1.</strong> Satıcı, Platform'a yüklediği tüm PDF dosyalarının, görsellerin ve açıklamaların <strong>fikri mülkiyet haklarının tamamen kendisine ait olduğunu</strong> veya bu içerikleri satmak için gerekli yasal izinlere sahip olduğunu beyan ve taahhüt eder.
              <br/><br/>
              <strong>3.2.</strong> Yüklenen içeriklerin çalıntı, kopya veya üçüncü şahısların telif haklarını ihlal ettiği tespit edilirse, <strong>doğacak tüm hukuki, cezai ve mali sorumluluk tamamen Satıcı'ya aittir.</strong> Platform, bu tür durumlarda hiçbir şekilde taraf gösterilemez ve sorumlu tutulamaz.
              <br/><br/>
              <strong>3.3.</strong> Satıcı, telif hakkı ihlali nedeniyle Platform'un uğrayacağı her türlü zararı (avukatlık ücretleri, tazminatlar ve cezalar dahil) derhal tazmin etmeyi kabul eder.
            </p>
          </div>

          {/* KRİTİK MADDE 2: ALICI KISITLAMASI */}
          <div className="bg-gray-50 border-l-4 border-gray-800 p-6 my-8 rounded-r-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">4. Alıcıların Yükümlülükleri ve İzinsiz Paylaşım Yasağı</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              <strong>4.1.</strong> Alıcı, satın aldığı dijital içeriği (PDF, e-kitap, ders notu vb.) yalnızca <strong>bireysel ve şahsi kullanımı</strong> için lisanslamış sayılır. Bu işlem, telif haklarının devri anlamına gelmez.
              <br/><br/>
              <strong>4.2.</strong> Satın alınan dosyanın; <strong>sosyal medya platformlarında (Instagram, Telegram, WhatsApp grupları vb.), forum sitelerinde, dosya paylaşım sitelerinde veya herhangi bir dijital ortamda herkese açık şekilde paylaşılması, çoğaltılması ve yeniden satılması KESİNLİKLE YASAKTIR.</strong>
              <br/><br/>
              <strong>4.3.</strong> Tespit edilmesi halinde, Satıcı veya Platform, izinsiz paylaşım yapan Alıcı hakkında 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında yasal işlem başlatma hakkına sahiptir. Alıcı, bu ihlalden kaynaklanan zararları karşılamakla yükümlüdür.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Cayma Hakkı ve İade (İstisna)</h3>
          <p className="mb-6 leading-relaxed">
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; <strong>elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayrimaddi mallar (PDF dosyaları vb.) cayma hakkı kapsamı dışındadır.</strong> Bu nedenle, dosyada teknik bir bozukluk (açılmama, eksik sayfa) olmadığı sürece satın alınan ürünlerin iptali ve iadesi mümkün değildir.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Üyelik İptali ve Fesih</h3>
          <p className="mb-8 leading-relaxed">
            Platform, işbu sözleşmeye aykırı davranan, şüpheli işlem yapan veya telif hakkı ihlalinde bulunan üyelerin hesaplarını önceden bildirimde bulunmaksızın askıya alma veya kalıcı olarak kapatma hakkını saklı tutar.
          </p>

        </div>

        {/* Alt Buton */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
          <Link 
            href="/" 
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg"
          >
            Okudum, Kabul Ediyorum
          </Link>
        </div>
      </div>
    </div>
  );
}