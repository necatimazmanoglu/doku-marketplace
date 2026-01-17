'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- TİP TANIMLAMALARI ---
interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  createdAt: string;
  isApproved: boolean;
  seller?: { shopName: string };
}

interface Order {
  id: string;
  price: number;
  createdAt: string;
  product: { title: string };
  userId: string; // Alıcı ID'si
}

interface Seller {
  id: string;
  shopName: string;
  iban: string;
  createdAt: string;
  commissionRate?: number | null; // YENİ: Komisyon oranı
}

// YENİ: Ödeme Talebi Tipi
interface PayoutRequest {
  id: string;
  amount: number;
  iban: string;
  createdAt: string;
  seller: { shopName: string };
}

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // STATE'LER
  const [stats, setStats] = useState<AdminStats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]); // YENİ: Ödeme talepleri
  const [loading, setLoading] = useState(true);

  // Verileri API'den çeken fonksiyon
  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error("Veri çekilemedi");
      
      const data = await res.json();
      
      setStats(data.stats);
      setPendingProducts(data.pendingProducts);
      setActiveProducts(data.activeProducts);
      setRecentOrders(data.recentOrders);
      setSellers(data.sellers);
      if (data.payoutRequests) setPayoutRequests(data.payoutRequests); // YENİ

    } catch (error) {
      console.error('Admin verileri alınamadı', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      // Güvenlik: Sadece admin maili görebilsin
      if (user.emailAddresses[0].emailAddress === "necatimazmanoglu@gmail.com") {
        fetchData();
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user]);

  // --- AKSİYONLAR ---

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        alert("Ürün onaylandı.");
        fetchData();
      }
    } catch (err) {
      console.error('Onay hatası:', err);
    }
  };

  const handleReject = async (id: string) => {
    if(!confirm("Bu ürünü tamamen silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}/reject`, { method: 'DELETE' });
      if (res.ok) {
        alert("Ürün silindi.");
        fetchData();
      }
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  // YENİ: Ödemeyi Onayla Butonu
  const handleMarkAsPaid = async (id: string, amount: number, shopName: string) => {
    if(!confirm(`${shopName} adlı satıcıya ${amount} TL ödemeyi bankadan gönderdiniz mi? Bu işlem geri alınamaz.`)) return;

    try {
      const res = await fetch(`/api/admin/payouts/${id}/pay`, { method: 'PUT' });
      if (res.ok) {
        alert("Ödeme kaydı başarıyla güncellendi.");
        setPayoutRequests(prev => prev.filter(p => p.id !== id)); // Listeden sil
      }
    } catch (err) {
      console.error('Ödeme hatası:', err);
    }
  };

  // --- RENDER ---

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) return null; 

  const renderTabContent = () => {
    switch (activeTab) {
      
      // --- 1. DASHBOARD SEKME ---
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Genel Bakış</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                <div className="text-purple-200 text-sm font-medium mb-1">Toplam Ciro</div>
                <div className="text-4xl font-extrabold">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue)}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Başarılı Sipariş</div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.totalOrders} <span className="text-sm font-normal text-gray-400">Adet</span></div>
              </div>
              {/* YENİ: Bekleyen Ödeme Kartı */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Bekleyen Ödeme Talebi</div>
                <div className="text-3xl font-extrabold text-red-600">{payoutRequests.length} <span className="text-sm font-normal text-gray-400">Adet</span></div>
              </div>
            </div>

            {/* Onay Bekleyenler */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Onay Bekleyen Ürünler</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${pendingProducts.length > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {pendingProducts.length} Bekleyen
                </span>
              </div>

              {pendingProducts.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Süper! Onay bekleyen ürün kalmadı.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {pendingProducts.map((product) => (
                    <li key={product.id} className="flex flex-col md:flex-row justify-between items-center border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition bg-white shadow-sm gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{product.title}</h4>
                        <div className="text-sm text-gray-500">
                           {product.category} • {product.price === 0 ? "Ücretsiz" : `₺${product.price}`} • {product.seller?.shopName || 'Satıcı'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(product.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm">Onayla</button>
                        <button onClick={() => handleReject(product.id)} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">Reddet</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      // --- 2. YENİ: FİNANS SEKMESİ ---
      case 'finance':
        return (
          <div>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Ödeme Talepleri</h2>
             <p className="text-gray-500 mb-6">Satıcıların oluşturduğu para çekme talepleri. Bankadan ödemeyi yaptıktan sonra buradan "Ödendi" olarak işaretleyin.</p>

             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Satıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">IBAN</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payoutRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{req.seller.shopName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{req.iban}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-green-600 text-lg">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(req.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button 
                          onClick={() => handleMarkAsPaid(req.id, req.amount, req.seller.shopName)}
                          className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-sm"
                        >
                          Ödendi İşaretle
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payoutRequests.length === 0 && (
                     <tr><td colSpan={5} className="text-center py-8 text-gray-400">Bekleyen ödeme talebi yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // --- 3. ÜRÜNLER SEKME ---
      case 'products':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tüm Aktif Ürünler</h2>
              <Link href="/products/new" className="text-sm text-indigo-600 hover:underline font-bold">+ Yeni Ürün Ekle</Link>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Satıcı</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {product.price === 0 ? "Ücretsiz" : `₺${product.price}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.seller?.shopName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/products/${product.id}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 mr-4">Görüntüle</Link>
                        <button onClick={() => handleReject(product.id)} className="text-red-600 hover:text-red-900 font-bold">Sil</button>
                      </td>
                    </tr>
                  ))}
                  {activeProducts.length === 0 && (
                     <tr><td colSpan={5} className="text-center py-6 text-gray-500">Henüz onaylanmış ürün yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // --- 4. SATICILAR SEKME (GÜNCELLENDİ: KOMİSYON YÖNETİMİ) ---
      case 'users':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kayıtlı Satıcılar</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mağaza Adı</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Komisyon (%)</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {s.shopName}
                        <div className="text-[10px] text-gray-400 font-normal">{s.iban || "IBAN Yok"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold border border-blue-100">
                           %{s.commissionRate !== null && s.commissionRate !== undefined ? s.commissionRate : '10 (Std)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                         <button 
                           onClick={async () => {
                             const newRate = prompt(`${s.shopName} için yeni komisyon oranı girin (Örn: 5):`, s.commissionRate ? s.commissionRate.toString() : "10");
                             if(newRate !== null) {
                               const res = await fetch(`/api/admin/sellers/${s.id}/commission`, {
                                 method: 'PUT',
                                 body: JSON.stringify({ rate: newRate })
                               });
                               if(res.ok) { alert("Oran güncellendi!"); fetchData(); }
                             }
                           }}
                           className="text-indigo-600 hover:text-indigo-900 font-bold text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                         >
                           Oranı Değiştir
                         </button>
                      </td>
                    </tr>
                  ))}
                  {sellers.length === 0 && (
                     <tr><td colSpan={4} className="text-center py-6 text-gray-500">Henüz satıcı kaydı yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // --- 5. RAPORLAR (SİPARİŞLER) SEKME ---
      case 'reports':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Son Satışlar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Toplam Ciro</h3>
                  <p className="text-3xl font-black text-gray-900">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue)}
                  </p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Platform Komisyonu (Tahmini %10)</h3>
                  <p className="text-3xl font-black text-gray-900">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalRevenue * 0.10)}
                  </p>
               </div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-800">Son 20 Sipariş</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Alıcı ID</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Tutar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {recentOrders.map((order) => (
                     <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.product?.title || "Silinmiş Ürün"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">{order.userId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                          {order.price === 0 ? "Ücretsiz" : `+₺${order.price}`}
                        </td>
                     </tr>
                   ))}
                   {recentOrders.length === 0 && (
                     <tr><td colSpan={4} className="text-center py-6 text-gray-500">Henüz satış yapılmadı.</td></tr>
                   )}
                </tbody>
               </table>
            </div>
          </div>
        );

      // --- 6. AYARLAR SEKME ---
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sistem Ayarları</h2>
            <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Site Başlığı</label>
                  <input type="text" defaultValue="PDF Market" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Komisyon Oranı (%)</label>
                  <input type="number" defaultValue="10" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button onClick={() => alert("Ayarlar kaydedildi (Demo)")} className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Yönetici Paneli</h1>
              <p className="text-orange-100 mt-1 opacity-90">Sistem yönetimi ve moderasyon merkezi</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="px-3">
                <p className="text-xs text-orange-200 uppercase font-bold tracking-wider">Admin</p>
                <p className="font-bold text-lg">{user.firstName || 'Yönetici'}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-md text-sm"
              >
                Siteye Dön
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        
        {/* Sekmeler */}
        <div className="flex gap-2 mb-8 overflow-x-auto bg-white p-1 rounded-xl shadow-md border border-gray-200 max-w-fit mx-auto md:mx-0">
          {[ 
            { id: 'dashboard', label: 'Kontrol Paneli', icon: '📊' },
            { id: 'finance', label: 'Finans / Ödemeler', icon: '💰' }, // YENİ
            { id: 'products', label: 'Ürünler', icon: '📦' },
            { id: 'users', label: 'Satıcılar', icon: '👥' },
            { id: 'reports', label: 'Raporlar', icon: '📈' },
            { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-50 text-red-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sekme İçeriği */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[500px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}