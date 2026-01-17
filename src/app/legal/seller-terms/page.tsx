export default function SellerTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200">
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">SATICI İŞ ORTAKLIĞI VE SATIŞ SÖZLEŞMESİ</h1>
        <p className="text-sm text-gray-500 mb-8 font-mono">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

        <div className="prose prose-slate max-w-none text-gray-700 text-sm leading-relaxed space-y-6">
          
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">1. TARAFLAR VE KONU</h2>
            <p>
              İşbu sözleşme, dijital içerik pazaryeri platformu ("Platform") ile bu platform üzerinden dijital ürün (PDF, e-kitap, doküman vb.) satışı yapmak isteyen gerçek veya tüzel kişi ("Satıcı") arasında akdedilmiştir. Satıcı, platforma kayıt olarak ve ürün yükleyerek bu sözleşmenin tüm hükümlerini kayıtsız şartsız kabul etmiş sayılır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">2. SATICININ YÜKÜMLÜLÜKLERİ VE BEYANLARI</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Telif Hakkı Garantisi:</strong> Satıcı, Platform'a yüklediği tüm içeriklerin (PDF, görsel, metin) yasal sahibi olduğunu veya yasal satış haklarına sahip olduğunu beyan ve taahhüt eder. Başkasına ait, korsan, kopyalanmış veya telif hakkı ihlali içeren materyallerin yüklenmesi kesinlikle yasaktır.</li>
              <li><strong>Hukuki Sorumluluk:</strong> Yüklenen içeriklerle ilgili doğabilecek her türlü telif hakkı davası, tazminat talebi veya idari para cezasından münhasıran Satıcı sorumludur. Platform, bu tür durumlarda "Yer Sağlayıcı" sıfatıyla hareket eder ve hiçbir hukuki sorumluluk kabul etmez. Satıcı, Platform'un uğrayacağı tüm zararları nakden ve defaten ödemeyi kabul eder.</li>
              <li><strong>Yasadışı İçerik:</strong> Satıcı; genel ahlaka aykırı, suç teşkil eden, terörü öven, ırkçı veya nefret söylemi içeren hiçbir dokümanı sisteme yükleyemez.</li>
              <li><strong>Virüs ve Zararlı Yazılım:</strong> Yüklenen dosyaların virüs, trojan veya kullanıcıların cihazlarına zarar verebilecek kötü amaçlı yazılım içermediğini Satıcı garanti eder.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">3. MALİ HÜKÜMLER VE VERGİLENDİRME</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Komisyon:</strong> Platform, gerçekleşen her satış üzerinden belirlenen oranda "Hizmet Bedeli/Komisyon" kesme hakkına sahiptir.</li>
              <li><strong>Vergi Sorumluluğu:</strong> Satıcı, Platform üzerinden elde ettiği gelirlerin vergilendirilmesinden (KDV, Gelir Vergisi vb.) şahsen ve tamamen sorumludur. Platform, Satıcı adına vergi beyanında bulunmaz. Satıcının vergi mükellefiyetini yerine getirmemesinden doğacak cezalardan Platform sorumlu tutulamaz.</li>
              <li><strong>Ödemeler:</strong> Ödemeler, ürünün alıcı tarafından indirilmesi ve olası iade süreçlerinin tamamlanmasını takiben, Platform'un belirlediği ödeme takvimine göre Satıcı'nın IBAN adresine yapılır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">4. PLATFORMUN YETKİLERİ VE FESİH</h2>
            <p>
              Platform, aşağıda belirtilen durumlarda herhangi bir ön bildirimde bulunmaksızın Satıcı'nın hesabını askıya alma, içeriklerini silme ve içerideki bakiyesini bloke etme hakkını saklı tutar:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Şüpheli işlem veya dolandırıcılık tespiti durumunda.</li>
              <li>Telif hakkı ihlali şikayeti alınması durumunda.</li>
              <li>Satıcının işbu sözleşme maddelerinden herhangi birini ihlal etmesi durumunda.</li>
            </ul>
            <p className="mt-2 font-bold text-red-600">
              Bu durumlarda Satıcı, Platform'dan herhangi bir hak veya tazminat talep edemeyeceğini şimdiden kabul ve taahhüt eder.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">5. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
            <p>
              İşbu sözleşmeden doğacak her türlü ihtilafın çözümünde Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Bu sözleşme dijital ortamda onaylanmış olup, ıslak imza hükmündedir.
          </p>
        </div>

      </div>
    </div>
  );
}