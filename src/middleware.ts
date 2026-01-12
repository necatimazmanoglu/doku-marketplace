import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Herkese açık rotalar
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
    // Next.js statik dosyaları hariç her şeyi yakala
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API rotalarını her zaman yakala
    '/(api|trpc)(.*)',
  ],
}