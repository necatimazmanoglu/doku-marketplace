import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // Kullanıcı zaten giriş yapmış mı kontrol et
  const { userId } = await auth();

  // Eğer giriş yapmışsa, tekrar giriş ekranı gösterme, panele at
  if (userId) {
    redirect("/dashboard");
  }

  // Giriş yapmamışsa formu göster
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <SignIn />
    </div>
  );
}