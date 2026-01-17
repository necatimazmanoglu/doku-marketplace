export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import WithdrawButton from "@/components/WithdrawButton"; // Birazdan oluşturacağız

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Satıcı Verilerini Çek
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      payouts: { orderBy: { createdAt: "desc" } } // Geçmiş ödemeler
    }
  });

  if (!seller) redirect("/become-seller");

  // Toplam Kazanılan (Bakiye + Çekilenler)
  const totalWithdrawn = seller.payouts
    .filter(p => p.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const lifetimeEarnings = seller.balance + totalWithdrawn;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Üst Başlık Alanı */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                   <h1 className="text-3xl font-black text-gray-900">Cüzdanım</h1>
                   <p className="text-gray-500 mt-1">Kazançlarınızı takip edin ve ödeme alın.</p>
                </div>
                <Link href="/dashboard/products" className="text-sm font-bold text-gray-400 hover:text-black transition">
                    &larr; Satıcı Paneline Dön
                </Link>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Bakiye Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            {/* 1. KULLANILABİLİR BAKİYE (Ana Kart) */}
            <div className="md:col-span-2 bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">Çekilebilir Bakiye</p>
                    <div className="text-5xl font-black tracking-tight mb-6">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(seller.balance)}
                    </div>
                    
                    {/* Para Çekme Butonu Bileşeni */}
                    <WithdrawButton balance={seller.balance} hasIban={!!seller.iban} />
                    
                    {!seller.iban && (
                        <p className="text-red-300 text-xs mt-3 font-bold">
                            ⚠️ Ödeme almak için <Link href="/dashboard/settings" className="underline hover:text-white">Ayarlar</Link> sayfasından IBAN ekleyin.
                        </p>
                    )}
                </div>
                {/* Dekoratif Arka Plan */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform origin-bottom-right"></div>
            </div>

            {/* 2. TOPLAM KAZANÇ (İstatistik) */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Toplam Kazanç (Ömür Boyu)</p>
                <div className="text-3xl font-black text-gray-900 mb-1">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(lifetimeEarnings)}
                </div>
                <div className="text-xs text-green-600 font-bold bg-green-50 self-start px-2 py-1 rounded">
                    Vergi & Komisyonlar Düşülmüş Net Tutar
                </div>
            </div>
        </div>

        {/* Geçmiş İşlemler Tablosu */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Ödeme Geçmişi</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">IBAN</th>
                            <th className="px-6 py-4 text-right">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {seller.payouts.map((payout) => (
                            <tr key={payout.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(payout.createdAt).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(payout.amount)}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                    {payout.iban}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        payout.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                        payout.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {payout.status === 'PAID' ? 'ÖDENDİ' : 
                                         payout.status === 'REJECTED' ? 'REDDEDİLDİ' : 'BEKLİYOR'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {seller.payouts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    Henüz para çekme talebiniz yok.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}