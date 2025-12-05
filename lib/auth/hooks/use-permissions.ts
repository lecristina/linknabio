/**
 * @package @axolutions/auth
 * React hooks para permissões
 */

"use client";

import { useAuth } from "./use-auth";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  isAdmin,
  getUserPermissions,
  getUserRole,
  getUserProducts,
} from "../utils/permissions";

export interface UsePermissionsReturn {
  hasPermission: (productSlug: string, permission: string) => boolean;
  hasAnyPermission: (productSlug: string, permissions: string[]) => boolean;
  hasAllPermissions: (productSlug: string, permissions: string[]) => boolean;
  hasRole: (productSlug: string, roleName: string) => boolean;
  hasAnyRole: (productSlug: string, roleNames: string[]) => boolean;
  isAdmin: (productSlug: string) => boolean;
  getUserPermissions: (productSlug: string) => string[];
  getUserRole: (productSlug: string) => string | null;
  getUserProducts: () => string[];
}

/**
 * Hook para verificar permissões do usuário atual
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();

  return {
    hasPermission: (productSlug: string, permission: string) => hasPermission(user, productSlug, permission),
    hasAnyPermission: (productSlug: string, permissions: string[]) => hasAnyPermission(user, productSlug, permissions),
    hasAllPermissions: (productSlug: string, permissions: string[]) =>
      hasAllPermissions(user, productSlug, permissions),
    hasRole: (productSlug: string, roleName: string) => hasRole(user, productSlug, roleName),
    hasAnyRole: (productSlug: string, roleNames: string[]) => hasAnyRole(user, productSlug, roleNames),
    isAdmin: (productSlug: string) => isAdmin(user, productSlug),
    getUserPermissions: (productSlug: string) => getUserPermissions(user, productSlug),
    getUserRole: (productSlug: string) => getUserRole(user, productSlug),
    getUserProducts: () => getUserProducts(user),
  };
}

/**
 * Hook para verificar permissões em um produto específico
 */
export function useProductPermissions(productSlug: string) {
  const permissions = usePermissions();

  return {
    hasPermission: (permission: string) => permissions.hasPermission(productSlug, permission),
    hasAnyPermission: (permissions: string[]) => permissions.hasAnyPermission(productSlug, permissions),
    hasAllPermissions: (permissions: string[]) => permissions.hasAllPermissions(productSlug, permissions),
    hasRole: (roleName: string) => permissions.hasRole(productSlug, roleName),
    hasAnyRole: (roleNames: string[]) => permissions.hasAnyRole(productSlug, roleNames),
    isAdmin: () => permissions.isAdmin(productSlug),
    getUserPermissions: () => permissions.getUserPermissions(productSlug),
    getUserRole: () => permissions.getUserRole(productSlug),
  };
}
