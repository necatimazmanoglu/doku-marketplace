'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
          <p className="mt-2 text-gray-600">
            PDF Marketplace'e hoş geldiniz
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600',
                footerActionLink: 'text-purple-600 hover:text-purple-700',
              },
            }}
          />
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Hesabınız yok mu?{' '}
          <a href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
}