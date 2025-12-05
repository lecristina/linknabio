/**
 * Página de login - Redireciona automaticamente para o SSO
 */

"use client";

import { useAuth } from "@/lib/auth/hooks/use-auth";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const hasCallbackError = useMemo(() => authError === "Callback" || authError === "access_denied", [authError]);

  // Redireciona para home se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Inicia automaticamente o fluxo SSO quando não autenticado
  // Evita loop quando houve erro de callback/access_denied
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasCallbackError) {
      signIn();
    }
  }, [isLoading, isAuthenticated, hasCallbackError, signIn]);

  // Se houve erro, não reinicia automaticamente
  if (hasCallbackError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-lg font-semibold">Não foi possível autenticar</p>
          <p className="text-sm text-muted-foreground mt-2">Erro do provedor: {authError}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button onClick={() => signIn()}>Tentar novamente</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mostra loading enquanto redireciona
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Redirecionando para autenticação...</p>
      </div>
    </div>
  );
}
