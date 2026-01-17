import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

interface ExplorePageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "Hepsi";
  const searchQuery = params.q || "";

  const whereCondition: any = {
    isApproved: true,
  };

  if (selectedCategory !== "Hepsi") {
    whereCondition.category = selectedCategory;
  }

  if (searchQuery) {
    whereCondition.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    include: {
      seller: true,
    },
  });

  const categories = [
    "Hepsi", "Ders Notları", "Sınav Hazırlık", "E-Kitap",
    "Akademik", "Kılavuz", "Diğer",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Arama Alanı */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900">Dokümanları Keşfet 📚</h1>
            
            <form className="w-full md:w-96 relative">
              <input 
                name="q"
                defaultValue={searchQuery}
                type="text" 
                placeholder="Not veya kitap ara..." 
                className="w-full py-3 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition"
              />
              <button type="submit" className="absolute right-2 top-2 p-1.5 bg-black text-white rounded-lg hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kategoriler */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "Hepsi" ? "/explore" : `/explore?category=${cat}`}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Ürün Listesi */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-900">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mt-2">Aradığınız kriterlere uygun doküman henüz yok.</p>
            {selectedCategory !== "Hepsi" && (
              <Link href="/explore" className="text-indigo-600 font-bold mt-4 inline-block hover:underline">
                Tümünü Göster
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                      <span className="text-xs font-bold uppercase tracking-wider">PDF</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-800 rounded-md shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xs text-gray-500 font-medium truncate">{product.seller.shopName || "Satıcı"}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-gray-900 font-black">{product.price === 0 ? "Ücretsiz" : `${product.price} ₺`}</span>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-indigo-600">İncele &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}