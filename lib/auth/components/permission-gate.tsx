/**
 * @package @axolutions/auth
 * Componente para renderização condicional baseada em permissões
 */

"use client";

import { ReactNode } from "react";
import { usePermissions } from "../hooks/use-permissions";

interface PermissionGateProps {
  children: ReactNode;
  productSlug: string;
  permission?: string;
  role?: string;
  fallback?: ReactNode;
}

/**
 * Componente que renderiza children apenas se o usuário tiver a permissão/role necessária
 */
export function PermissionGate({ children, productSlug, permission, role, fallback = null }: PermissionGateProps) {
  const permissions = usePermissions();

  // Verificar permissão específica
  if (permission) {
    if (!permissions.hasPermission(productSlug, permission)) {
      return <>{fallback}</>;
    }
  }

  // Verificar role específica
  if (role) {
    if (!permissions.hasRole(productSlug, role)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
