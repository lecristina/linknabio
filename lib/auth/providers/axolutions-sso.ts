/**
 * @package @axolutions/auth
 * Provider OAuth 2.0 customizado para Axolutions SSO
 */

import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import type { AxolutionsUser } from "../types";
import { SSO_ENDPOINTS, SSO_SCOPES } from "../config/constants";

export interface AxolutionsSSOProfile extends Record<string, any> {
  sub: string; // OpenID Connect standard - user ID
  email: string;
  name: string;
  picture?: string; // OpenID Connect standard for avatar
  email_verified: boolean;
  updated_at?: string;
  roles?: {
    product: {
      id: string;
      name: string;
      slug: string;
    };
    role: {
      id: string;
      name: string;
      permissions: string[];
    };
    granted_at: string;
    expires_at: string | null;
  };
}

export default function AxolutionsSSO(
  options: OAuthUserConfig<AxolutionsSSOProfile>,
): OAuthConfig<AxolutionsSSOProfile> {
  const clientId = options.clientId;

  return {
    id: "axolutions-sso",
    name: "Axolutions SSO",
    type: "oauth",

    // Explicitly disable id_token expectation (OAuth 2.0, not OIDC)
    idToken: false,

    // OAuth 2.0 endpoints
    authorization: {
      url: SSO_ENDPOINTS.AUTHORIZE,
      params: {
        scope: SSO_SCOPES.join(" "),
        response_type: "code",
        code_challenge_method: "S256",
      },
    },
    token: {
      url: SSO_ENDPOINTS.TOKEN,
      async request(context) {
        const { provider, params, checks } = context;

        // Build token request body with PKCE and client_id
        const body = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", params.code!);
        body.append("redirect_uri", provider.callbackUrl);
        body.append("client_id", clientId!);

        if (checks?.code_verifier) {
          body.append("code_verifier", checks.code_verifier);
        }

        const response = await fetch(SSO_ENDPOINTS.TOKEN, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        const tokens = await response.json();

        if (!response.ok) {
          throw new Error(tokens.error_description || tokens.error || "Token request failed");
        }

        return { tokens };
      },
    },
    userinfo: {
      url: SSO_ENDPOINTS.USERINFO,
      async request(context) {
        const response = await fetch(SSO_ENDPOINTS.USERINFO, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${context.tokens.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Userinfo request failed: ${errorText}`);
        }

        const profile = await response.json();

        return profile;
      },
    },

    // PKCE e State são habilitados automaticamente pelo NextAuth
    checks: ["pkce", "state"],

    // Client configuration
    clientId: options.clientId,
    // NÃO definir clientSecret para PKCE flow - deixa o NextAuth adicionar client_id no body

    // Profile transformation - maps OpenID Connect standard fields to our user model
    profile(profile: AxolutionsSSOProfile): AxolutionsUser {
      // Se email e name não estão disponíveis no profile, usar valores padrão
      const email = profile.email || `user-${profile.sub}@axolutions.com`;
      const name = profile.name || `Usuário ${profile.sub.substring(0, 8)}`;

      return {
        id: profile.sub, // Map OpenID Connect 'sub' to NextAuth 'id'
        sub: profile.sub,
        email: email,
        name: name,
        avatar: profile.picture || undefined,
        email_verified: profile.email_verified || false,
        products: profile.roles ? [profile.roles] : [], // Wrap single role in array if present
      };
    },

    // Style configuration
    style: {
      logo: "/axolutions-logo.svg",
      bg: "#fff",
      text: "#000",
    },

    options,
  };
}
