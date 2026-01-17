import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// BİLGİLERİ GETİR
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(null);

  const info = await prisma.billingInfo.findUnique({
    where: { userId }
  });

  return NextResponse.json(info || {}); 
}

// BİLGİLERİ KAYDET / GÜNCELLE
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser(); // Email için
    if (!userId || !user) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

    const body = await request.json();
    
    // Veritabanına kaydet (Varsa güncelle, yoksa oluştur)
    const savedInfo = await prisma.billingInfo.upsert({
      where: { userId },
      update: {
        ...body,
        email: body.email || user.emailAddresses[0].emailAddress
      },
      create: {
        userId,
        ...body,
        email: body.email || user.emailAddresses[0].emailAddress
      }
    });

    return NextResponse.json({ success: true, info: savedInfo });

  } catch (error) {
    console.error("Fatura bilgisi kayıt hatası:", error);
    return NextResponse.json({ error: "Kaydedilemedi" }, { status: 500 });
  }
}