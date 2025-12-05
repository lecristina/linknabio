/**
 * @package @axolutions/auth
 * Tipos TypeScript para autenticação Axolutions
 */

export interface AxolutionsUser {
  id: string;
  sub: string;
  email: string;
  name: string;
  avatar?: string;
  email_verified: boolean;
  products: AxolutionsProductAccess[];
  created_at?: string;
  external_id?: string;
  last_login?: string;
  password?: string;
  site_branch_name?: string;
  status?: string;
  updated_at?: string;
  website_url?: string;
}

export interface AxolutionsProductAccess {
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
}

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

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: AxolutionsUser;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }

  interface User extends AxolutionsUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AxolutionsUser;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
