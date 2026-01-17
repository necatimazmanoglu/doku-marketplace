import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Gizlilik Politikası - PDF Market",
  description: "PDF Market kullanıcı veri güvenliği ve gizlilik politikaları.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Üst Başlık Alanı */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Gizlilik Politikası
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Verilerinizin güvenliği bizim için önceliklidir. Kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu şeffaflıkla açıklıyoruz.
          </p>
          <p className="text-sm font-bold text-gray-400 mt-6 uppercase tracking-widest">
            Son Güncelleme: 12 Ocak 2026
          </p>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-red mx-auto text-gray-600">
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş ve Kapsam</h3>
          <p className="mb-6 leading-relaxed">
            PDF Market ("Şirket") olarak, kullanıcılarımızın ("Kullanıcı") gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi kullanırken sağladığınız kişisel verilerin nasıl işlendiğini açıklar. Hizmetlerimizi kullanarak bu politikayı kabul etmiş sayılırsınız.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Veriler</h3>
          <p className="mb-4 leading-relaxed">
            Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı.</li>
            <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası.</li>
            <li><strong>İşlem Bilgileri:</strong> Satın alma geçmişi, sipariş detayları (Kredi kartı bilgileriniz sunucularımızda saklanmaz, doğrudan iyzico altyapısı ile işlenir).</li>
            <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi ve çerezler (cookies).</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Verilerin Kullanım Amacı</h3>
          <p className="mb-6 leading-relaxed">
            Topladığımız verileri şu amaçlarla kullanıyoruz:
            <br />
            - Siparişlerinizi işlemek ve dijital ürünleri teslim etmek (PDF indirme linkleri).
            <br />
            - Müşteri hizmetleri desteği sağlamak.
            <br />
            - Yasal yükümlülükleri (fatura kesimi vb.) yerine getirmek.
            <br />
            - Platform güvenliğini sağlamak ve dolandırıcılığı önlemek.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Çerezler (Cookies)</h3>
          <p className="mb-6 leading-relaxed">
            Kullanıcı deneyimini geliştirmek için çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman engelleyebilirsiniz, ancak bu durumda sitenin bazı özellikleri çalışmayabilir.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h3>
          <p className="mb-6 leading-relaxed">
            Verilerinizi korumak için endüstri standardı güvenlik önlemleri (SSL şifreleme, güvenli sunucular) kullanıyoruz. Ancak internet üzerinden yapılan hiçbir veri aktarımının %100 güvenli olduğunu garanti edemeyiz.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">6. İletişim</h3>
          <p className="mb-8 leading-relaxed">
            Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
            <br />
            <strong className="text-gray-900">E-posta:</strong> destek@pdfmarket.com
            <br />
            <strong className="text-gray-900">Adres:</strong> Teknoloji Vadisi, Ankara, Türkiye
          </p>

        </div>

        {/* Alt Buton */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
          <Link 
            href="/" 
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}