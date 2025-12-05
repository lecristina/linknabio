/**
 * Componente para proteção de rotas e verificação de permissões
 */

"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { hasPermission, hasRole } from "@/lib/auth/utils/permissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Lock } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  productSlug?: string;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: ReactNode;
}

/**
 * Guarda de autenticação que protege componentes
 * Redireciona para login se não autenticado
 * Mostra erro se não tiver permissão
 */
export function AuthGuard({ children, productSlug, requiredPermission, requiredRole, fallback }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated, signIn } = useAuth();
  const router = useRouter();

  // Carregando
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Não autenticado - redireciona automaticamente para SSO
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Redireciona automaticamente para o fluxo de autenticação
    if (typeof window !== "undefined") {
      signIn();
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Redirecionando para autenticação...</p>
        </div>
      </div>
    );
  }

  // Verificar permissão específica
  if (productSlug && requiredPermission) {
    const hasAccess = hasPermission(user, productSlug, requiredPermission);

    if (!hasAccess) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>
              Você não tem permissão <strong>{requiredPermission}</strong> no produto <strong>{productSlug}</strong>.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Verificar role específica
  if (productSlug && requiredRole) {
    const hasRequiredRole = hasRole(user, productSlug, requiredRole);

    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>
              Você precisa ter a role <strong>{requiredRole}</strong> no produto <strong>{productSlug}</strong>.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Autorizado
  return <>{children}</>;
}
