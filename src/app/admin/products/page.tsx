'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Ürünler alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await axios.put(`/api/admin/product/${id}/approve`);
      console.log('Onaylandı:', res.data);
      fetchProducts();
    } catch (error) {
      console.error('Onay hatası:', error);
      alert('Onaylama başarısız.');
    }
  };

  const handleReject = async (id: string) => {
    const confirmDelete = confirm('Bu ürünü silmek istediğinize emin misiniz?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/api/admin/product/${id}/reject`);
      console.log('Silindi:', res.data);
      fetchProducts();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme başarısız.');
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
              <th className="border px-4 py-2 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">{product.price}₺</td>
                <td className="px-4 py-2">
                  {product.isApproved ? '✅ Onaylandı' : '⏳ Bekliyor'}
                </td>
                <td className="px-4 py-2">
                  {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-4 py-2 flex flex-col gap-2 text-center">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Detay
                  </Link>

                  {!product.isApproved && (
                    <>
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="text-green-600 hover:underline"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="text-red-600 hover:underline"
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
