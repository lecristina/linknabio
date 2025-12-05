import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for AUTHENTICATION purposes only.
 * This client should be used for auth-related operations like login, logout, session management.
 */
export async function createAuthClient() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL;
  const authKey = process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY;

  if (!authUrl || !authKey) {
    throw new Error(
      "Missing required environment variables for AUTH Supabase. Please set NEXT_PUBLIC_AUTH_SUPABASE_URL and NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(authUrl, authKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * Creates a Supabase client for APPLICATION data operations.
 * This client should be used for querying app tables, data operations, etc.
 */
export async function createAppClient() {
  const appUrl = process.env.NEXT_PUBLIC_APP_SUPABASE_URL;
  const appKey = process.env.NEXT_PUBLIC_APP_SUPABASE_ANON_KEY;

  if (!appUrl || !appKey) {
    throw new Error(
      "Missing required environment variables for APP Supabase. Please set NEXT_PUBLIC_APP_SUPABASE_URL and NEXT_PUBLIC_APP_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(appUrl, appKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * @deprecated Use createAuthClient() or createAppClient() instead.
 * Kept for backward compatibility.
 */
export async function createClient() {
  return createAuthClient();
}
