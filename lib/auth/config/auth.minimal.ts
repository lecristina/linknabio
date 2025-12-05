/**
 * @package @axolutions/auth
 * Configuração mínima do NextAuth v4 para Axolutions SSO
 */

import type { NextAuthOptions } from "next-auth";

const clientId = process.env.SSO_CLIENT_ID;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!clientId) {
  throw new Error("Missing SSO_CLIENT_ID environment variable");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

export const authConfig: NextAuthOptions = {
  providers: [
    {
      id: "axolutions-sso",
      name: "Axolutions SSO",
      type: "oauth",
      authorization: {
        url: "http://localhost:3000/api/oauth/authorize",
        params: {
          scope: "openid",
          response_type: "code",
          code_challenge_method: "S256",
        },
      },
      token: "http://localhost:3000/api/oauth/token",
      userinfo: "http://localhost:3000/api/oauth/userinfo",
      clientId: clientId,
      clientSecret: "",
      checks: ["pkce", "state"],
      profile(profile: any) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          email_verified: profile.email_verified,
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === "development",
};
