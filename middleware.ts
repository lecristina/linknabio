/**
 * Middleware para proteção de todas as rotas usando NextAuth v5
 * Todas as rotas são protegidas, exceto as rotas de autenticação
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que NÃO precisam de autenticação (rotas públicas)
  const publicRoutes = [
    "/auth/signin",
    "/auth/error",
    "/api/auth", // NextAuth API routes
  ];

  // Verificar se é uma rota de slug (link na bio público)
  // Padrão: qualquer rota que não comece com /api, /auth, /_next, etc
  const isSlugRoute =
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/campaigns") &&
    !pathname.startsWith("/design_system") &&
    pathname !== "/" &&
    pathname.split("/").length === 2; // Apenas /[slug], não /[slug]/algo

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Se é uma rota pública ou rota de slug, permitir acesso
  if (isPublicRoute || isSlugRoute) {
    return NextResponse.next();
  }

  // Em modo de desenvolvimento com autenticação mockada, permitir acesso sem token
  const isMockedAuth = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_MOCKED_AUTH === "true";

  if (isMockedAuth) {
    return NextResponse.next();
  }

  // Verificar variáveis do Supabase apenas se não estiver em modo mockado
  const appUrl = process.env.NEXT_PUBLIC_APP_SUPABASE_URL;
  const appKey = process.env.NEXT_PUBLIC_APP_SUPABASE_ANON_KEY;

  // Em desenvolvimento, apenas avisar mas não bloquear se as variáveis não estiverem configuradas
  if (!appUrl || !appKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Variáveis do Supabase APP não configuradas. Algumas funcionalidades podem não funcionar."
      );
      // Em desenvolvimento, permitir continuar mas redirecionar para login se não autenticado
    } else {
      throw new Error(
        "Missing required environment variables for APP Supabase. Please set NEXT_PUBLIC_APP_SUPABASE_URL and NEXT_PUBLIC_APP_SUPABASE_ANON_KEY in your .env.local file."
      );
    }
  }

  // Verificar token apenas se não estiver em modo mocked
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Se não está autenticado, redirecionar para login
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
