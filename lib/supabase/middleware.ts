import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Middleware uses AUTH Supabase for authentication checks
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL;
  const authKey = process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY;

  if (!authUrl || !authKey) {
    throw new Error(
      "Missing required environment variables for AUTH Supabase. Please set NEXT_PUBLIC_AUTH_SUPABASE_URL and NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  const supabase = createServerClient(authUrl, authKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
