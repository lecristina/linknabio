/**
 * @package @axolutions/auth
 * Utilitários para gerenciamento de sessão
 */

import { getServerSession } from "next-auth";
import { authConfig } from "../config/auth.config";
import type { AxolutionsUser } from "../types";

/**
 * Obtém a sessão atual do servidor
 */
export async function getSession() {
  return await getServerSession(authConfig);
}

/**
 * Obtém o usuário atual do servidor
 */
export async function getCurrentUser(): Promise<AxolutionsUser | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Requer autenticação - lança erro se não autenticado
 */
export async function requireAuth(): Promise<AxolutionsUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Requer uma permissão específica
 */
export async function requirePermission(productSlug: string, permission: string): Promise<AxolutionsUser> {
  const user = await requireAuth();

  const { hasPermission } = await import("./permissions");

  if (!hasPermission(user, productSlug, permission)) {
    throw new Error(`Permission '${permission}' required for product '${productSlug}'`);
  }

  return user;
}

/**
 * Requer uma role específica
 */
export async function requireRole(productSlug: string, roleName: string): Promise<AxolutionsUser> {
  const user = await requireAuth();

  const { hasRole } = await import("./permissions");

  if (!hasRole(user, productSlug, roleName)) {
    throw new Error(`Role '${roleName}' required for product '${productSlug}'`);
  }

  return user;
}
