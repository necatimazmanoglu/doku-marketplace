import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Ana sayfayı (/) ve ürün detaylarını herkese açık yap
const isPublicRoute = createRouteMatcher([
  '/', 
  '/products(.*)', 
  '/api/uploadthing(.*)',
  '/sign-in(.*)', 
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Next.js iç dosyaları ve statik dosyalar hariç her şeyi kontrol et
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API rotalarını her zaman kontrol et
    '/(api|trpc)(.*)',
  ],
}