/**
 * @package @axolutions/auth
 * Configuração do NextAuth v4 para Axolutions SSO
 */

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { SSO_ENDPOINTS } from "./constants";
import AxolutionsSSO from "../providers/axolutions-sso";

const clientId = process.env.SSO_CLIENT_ID;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3002";

if (!clientId) {
  throw new Error("Missing SSO_CLIENT_ID environment variable");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

/**
 * Verifica se o token expirou
 */
function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= (expiresAt - 60) * 1000;
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const body = {
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: clientId,
    };

    const response = await fetch(SSO_ENDPOINTS.TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() / 1000 + refreshedTokens.expires_in,
      error: undefined,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authConfig: NextAuthOptions = {
  // Providers configuration
  providers: [
    AxolutionsSSO({
      clientId: clientId!,
      clientSecret: "", // PKCE flow - empty string required by NextAuth v4
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Pages configuration
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Callbacks
  callbacks: {
    /**
     * JWT callback - runs when JWT is created or updated
     */
    async jwt({ token, account, profile, user, trigger }) {
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          user: profile as any,
        } as JWT;
      }

      // Se não tem expiresAt, não tenta refresh
      if (!token.expiresAt) {
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (!isTokenExpired(token.expiresAt as number)) {
        return token;
      }

      // Se não tem refresh token, não pode fazer refresh
      if (!token.refreshToken) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        } as JWT;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },

    /**
     * Session callback - runs when session is checked
     */
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }

      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.error = token.error as string | undefined;

      return session;
    },

    /**
     * Redirect callback - controls where user is redirected after auth
     */
    async redirect({ url, baseUrl }) {
      // Se a URL é relativa, adicionar baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        return redirectUrl;
      }

      // Se a URL é do mesmo origin, permitir
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Por padrão, redirecionar para a página inicial
      return baseUrl;
    },
  },

  // Events for logging/analytics
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // User signed in
    },
    async signOut(params: any) {
      // User signed out

      // Revoga o token no SSO
      const token = params.token as JWT | undefined;
      if (token?.accessToken) {
        try {
          const response = await fetch(SSO_ENDPOINTS.REVOKE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token.accessToken,
              client_id: clientId,
            }),
          });

          if (!response.ok) {
            // Failed to revoke token
          }
        } catch (error) {
          // Error revoking token
        }
      }
    },
    async session({ session, token }) {
      // Session is active
    },
  },

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT
  secret: nextAuthSecret,

  // Cookies configuration
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Use JWT for session
  useSecureCookies: process.env.NODE_ENV === "production",
};
