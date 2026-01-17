import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya yüklenmedi." }, { status: 400 });
    }

    // 1. Dosyayı Buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Kaydedilecek Klasörü Hazırla (public/uploads)
    // Bu klasör yoksa otomatik oluşturur.
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. Benzersiz Dosya Adı Oluştur (Çakışmayı önlemek için)
    // Örn: 17156322-dosyam.pdf
    // Türkçe karakterleri ve boşlukları temizle
    const cleanFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    const uniqueName = `${Date.now()}-${cleanFileName}`;
    
    const uploadPath = path.join(uploadDir, uniqueName);

    // 4. Dosyayı Diske Yaz (Fiziksel Kayıt)
    await writeFile(uploadPath, buffer);

    // 5. Veritabanına Kaydedilecek Yolu Döndür
    // Önemli: "/uploads/..." şeklinde dönüyoruz ki Download API bunu bulabilsin.
    const dbUrl = `/uploads/${uniqueName}`;

    console.log("✅ Dosya başarıyla yüklendi:", uploadPath);

    return NextResponse.json({ 
      success: true, 
      url: dbUrl, 
      fileName: file.name,
      fileSize: file.size 
    });

  } catch (error: any) {
    console.error("Yükleme Hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenemedi." }, { status: 500 });
  }
}