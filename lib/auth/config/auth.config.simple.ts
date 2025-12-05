/**
 * @package @axolutions/auth
 * Configuração simplificada do NextAuth v4 para Axolutions SSO
 */

import type { NextAuthOptions } from "next-auth";
import { SSO_ENDPOINTS } from "./constants";

const clientId = process.env.SSO_CLIENT_ID;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!clientId) {
  throw new Error("Missing SSO_CLIENT_ID environment variable");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

export const authConfig: NextAuthOptions = {
  // Providers configuration
  providers: [
    {
      id: "axolutions-sso",
      name: "Axolutions SSO",
      type: "oauth",
      authorization: {
        url: SSO_ENDPOINTS.AUTHORIZE,
        params: {
          scope: "openid",
          response_type: "code",
          code_challenge_method: "S256",
        },
      },
      token: SSO_ENDPOINTS.TOKEN,
      userinfo: SSO_ENDPOINTS.USERINFO,
      clientId: clientId,
      clientSecret: "", // PKCE flow
      checks: ["pkce", "state"],
      profile(profile: any) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          email_verified: profile.email_verified,
          products: profile.roles ? [profile.roles] : [],
        };
      },
    },
  ],

  // Session configuration
  session: {
    strategy: "jwt",
  },

  // Pages configuration
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Secret for JWT
  secret: nextAuthSecret,

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === "development",

  // Disable NextAuth CSS to avoid parsing errors
  theme: {
    colorScheme: "light",
  },
};
