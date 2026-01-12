'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  isApproved: boolean;
  createdAt: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Ürünler alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const approveProduct = async (id: string) => {
    try {
      await axios.put(`/api/products/approve/${id}`);
      toast.success('Ürün onaylandı');
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, isApproved: true } : p))
      );
    } catch (error) {
      console.error('Onaylama hatası:', error);
      toast.error('Ürün onaylanamadı');
    }
  };

  const rejectProduct = async (id: string) => {
    try {
      await axios.delete(`/api/products/reject/${id}`);
      toast.success('Ürün silindi');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Ürün silinemedi');
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tüm Ürünler</h1>

      {products.length === 0 ? (
        <p>Henüz ürün eklenmemiş.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Başlık</th>
              <th className="border px-4 py-2 text-left">Fiyat</th>
              <th className="border px-4 py-2 text-left">Durum</th>
              <th className="border px-4 py-2 text-left">Tarih</th>
              <th className="border px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">{product.price}₺</td>
                <td className="px-4 py-2">
                  {product.isApproved ? '✅ Onaylandı' : '⏳ Beklemede'}
                </td>
                <td className="px-4 py-2">
                  {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Detay
                  </Link>
                  {!product.isApproved && (
                    <>
                      <button
                        onClick={() => approveProduct(product.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => rejectProduct(product.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Reddet
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
