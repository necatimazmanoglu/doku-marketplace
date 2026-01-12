'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  fileSize: number;
  createdAt: string;
  sellerId: string;
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
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  // Verileri API'den çeken fonksiyon
  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      
      if (data.stats) setStats(data.stats);
      if (data.pendingProducts) setPendingProducts(data.pendingProducts);
      
    } catch (error) {
      console.error('Admin verileri alınamadı', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        setPendingProducts(prev => prev.filter(p => p.id !== id));
        fetchData(); // İstatistikleri güncelle (aktif ürün sayısı artacak)
        alert("Ürün onaylandı ve yayına alındı.");
      }
    } catch (err) {
      console.error('Onay hatası:', err);
    }
  };

  const handleReject = async (id: string) => {
    if(!confirm("Bu ürünü reddetmek ve silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}/reject`, { method: 'DELETE' });
      if (res.ok) {
        setPendingProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Reddetme hatası:', err);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Erişim Reddedildi</h2>
        <p className="text-gray-500 mb-6">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition shadow-lg"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Genel Bakış</h2>

            {/* 1. İSTATİSTİK KARTLARI (Bizim Eklediğimiz Kısım) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                <div className="text-purple-200 text-sm font-medium mb-1">Toplam Ciro</div>
                <div className="text-4xl font-extrabold">₺{stats.totalRevenue.toLocaleString('tr-TR')}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Toplam Sipariş</div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.totalOrders} <span className="text-sm font-normal text-gray-400">Adet</span></div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium mb-1">Aktif Ürünler</div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.totalProducts} <span className="text-sm font-normal text-gray-400">Dosya</span></div>
              </div>
            </div>

            {/* 2. ONAY BEKLEYEN ÜRÜNLER (Senin Kodun) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Onay Bekleyen Ürünler</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  {pendingProducts.length} Bekleyen
                </span>
              </div>

              {pendingProducts.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Harika! Şu an onay bekleyen ürün yok.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {pendingProducts.map((product) => (
                    <li key={product.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-100 p-4 rounded-xl hover:bg-gray-50 transition bg-white shadow-sm">
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-bold text-gray-900 text-lg">{product.title}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-1 rounded">📂 {product.category || 'Genel'}</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">₺{product.price}</span>
                          <span className="text-xs flex items-center">📅 {new Date(product.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
                        >
                          ✅ Onayla
                        </button>
                        <button
                          onClick={() => handleReject(product.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          ❌ Reddet
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Tüm Ürün Yönetimi</h2>
            <p className="text-gray-500">Burada sistemdeki tüm aktif ürünleri listeleyip düzenleyebileceğiniz bir tablo olacak.</p>
            <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
              Mevcut vitrine git &rarr;
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header (Senin İstediğin Kırmızı/Turuncu Tasarım) */}
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
                <p className="font-bold text-lg">{user.firstName || user.username || 'Yönetici'}</p>
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
            { id: 'products', label: 'Ürünler', icon: '📦' },
            { id: 'users', label: 'Kullanıcılar', icon: '👥' },
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