/**
 * @package @axolutions/auth
 * React hooks para autenticação
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { createAuthClient } from "@/lib/supabase/client";
import type { AxolutionsUser } from "../types";
import mockSession from "../mocks/session.dev.json";

export interface UseAuthReturn {
  user: AxolutionsUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | undefined;
  signIn: () => void;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook principal de autenticação
 * Fornece acesso ao usuário atual e métodos de auth
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<AxolutionsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDev = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_MOCKED_AUTH === "true";

  useEffect(() => {
    const fetchUserData = async () => {
      if (isDev) {
        const mockUser: AxolutionsUser = {
          id: mockSession.user.id,
          sub: mockSession.user.sub,
          email: mockSession.user.email,
          name: mockSession.user.name,
          avatar: mockSession.user.avatar,
          email_verified: mockSession.user.email_verified,
          products: mockSession.user.products || [],
          created_at: mockSession.user.created_at,
          external_id: mockSession.user.external_id,
          last_login: mockSession.user.last_login,
          site_branch_name: mockSession.user.site_branch_name,
          status: mockSession.user.status,
          updated_at: mockSession.user.updated_at,
          website_url: mockSession.user.website_url,
        };
        setUser(mockUser);
        setIsLoading(false);
        return;
      }

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userId = session.user.sub;

      try {
        setIsLoading(true);
        // Use APP Supabase for querying user data from the app database
        const supabase = createAuthClient();

        const { data: userData, error } = await supabase.from("users").select("*").eq("id", userId).single();

        if (!error) {
          const transformedUser: AxolutionsUser = {
            id: userData.id,
            sub: userId,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            email_verified: userData.email_verified,
            products: [],
            created_at: userData.created_at,
            external_id: userData.external_id,
            last_login: userData.last_login,
            password: userData.password,
            site_branch_name: userData.site_branch_name,
            status: userData.status,
            updated_at: userData.updated_at,
            website_url: userData.website_url,
          };
          setUser(transformedUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user, isDev]);

  const handleSignIn = () => {
    if (isDev) {
      window.location.href = "/";
      return;
    }
    signIn("axolutions-sso", {
      callbackUrl: window.location.origin + "/",
      redirect: true,
    });
  };

  const handleSignOut = async () => {
    if (isDev) {
      setUser(null);
      window.location.href = "/auth/signin";
      return;
    }
    // Revoga o token no SSO antes de fazer logout
    if (session?.accessToken) {
      try {
        const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3000";
        const response = await fetch(`${SSO_URL}/api/oauth/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: session.accessToken,
          }),
        });

        if (!response.ok) {
          // Failed to revoke token
        }
      } catch (error) {
        // Error revoking token
      }
    }

    // Faz o logout local
    await signOut({
      callbackUrl: window.location.origin,
    });
  };

  const refetch = async () => {
    if (isDev) {
      const mockUser: AxolutionsUser = {
        id: mockSession.user.id,
        sub: mockSession.user.sub,
        email: mockSession.user.email,
        name: mockSession.user.name,
        avatar: mockSession.user.avatar,
        email_verified: mockSession.user.email_verified,
        products: mockSession.user.products || [],
      };
      setUser(mockUser);
      return;
    }
    await update();
  };

  // Effect para redirecionar quando autenticado
  useEffect(() => {
    if ((status === "authenticated" || isDev) && user && window.location.pathname === "/auth/signin") {
      window.location.href = "/";
    }
  }, [status, user, isDev]);

  return {
    user,
    isLoading: isLoading || (!isDev && status === "loading"),
    isAuthenticated: (isDev && !!user) || (status === "authenticated" && !!user),
    error: isDev ? undefined : session?.error,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refetch,
  };
}

/**
 * Hook para verificar se usuário está autenticado
 * Retorna boolean simples
 */
export function useIsAuthenticated(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

/**
 * Hook para obter o usuário atual
 * Retorna o usuário ou null
 */
export function useCurrentUser(): AxolutionsUser | null {
  const { data: session } = useSession();
  return session?.user || null;
}

/**
 * Hook para verificar se está carregando
 */
export function useAuthLoading(): boolean {
  const { status } = useSession();
  return status === "loading";
}
