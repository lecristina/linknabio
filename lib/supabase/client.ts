import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase browser client for AUTHENTICATION purposes only.
 * This client should be used for auth-related operations like login, logout, session management.
 */
export function createAuthClient() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL;
  const authKey = process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY;

  if (!authUrl || !authKey) {
    throw new Error(
      "Missing required environment variables for AUTH Supabase. Please set NEXT_PUBLIC_AUTH_SUPABASE_URL and NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  return createBrowserClient(authUrl, authKey);
}

/**
 * Creates a Supabase browser client for APPLICATION data operations.
 * This client should be used for querying app tables, data operations, etc.
 */
export function createAppClient() {
  const appUrl = process.env.NEXT_PUBLIC_APP_SUPABASE_URL;
  const appKey = process.env.NEXT_PUBLIC_APP_SUPABASE_ANON_KEY;

  if (!appUrl || !appKey) {
    throw new Error(
      "Missing required environment variables for APP Supabase. Please set NEXT_PUBLIC_APP_SUPABASE_URL and NEXT_PUBLIC_APP_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  return createBrowserClient(appUrl, appKey);
}

/**
 * @deprecated Use createAuthClient() or createAppClient() instead.
 * Kept for backward compatibility.
 */
export function createClient() {
  return createAuthClient();
}
