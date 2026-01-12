import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // User tablosu oluşturma adımını SİLDİK.
    // Doğrudan ürün oluşturuyoruz.
    
    const product = await prisma.product.create({
      data: {
        title: "React İle Modern Web Geliştirme (E-Kitap)",
        description: "Bu kitap ile sıfırdan ileri seviyeye React öğreneceksiniz. Component yapısı ve Hooks detayları.",
        price: 250,
        category: "Eğitim",
        isApproved: true, // Ana sayfada görünmesi için ŞART
        isActive: true,   // Ana sayfada görünmesi için ŞART
        
        // Veritabanında User tablosu olmadığı için buraya rastgele bir yazı (ID) giriyoruz.
        // Eğer veritabanın "İlla gerçek bir kullanıcı ID'si olsun" diye zorlarsa hata verebilir, ama deneyelim.
        sellerId: "test-satici-id-12345", 
        
        fileName: "react-egitim-kitabi.pdf",
        fileSize: 5242880, // 5 MB
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        // imageUrl alanını eklemiyoruz (veritabanında yok).
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test ürünü başarıyla oluşturuldu!", 
      product 
    });

  } catch (error: any) {
    console.error("Test verisi oluşturma hatası:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Bilinmeyen hata",
      detail: JSON.stringify(error, null, 2)
    }, { status: 500 });
  }
}