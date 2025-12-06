/**
 * Página de erro de autenticação
 */

"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const errorMessages: Record<string, { title: string; message: string; action?: string }> = {
  Configuration: {
    title: "Erro de Configuração",
    message: "Há um problema com a configuração do servidor de autenticação.",
    action: "Entre em contato com o suporte técnico.",
  },
  AccessDenied: {
    title: "Acesso Negado",
    message: "Você não tem permissão para acessar este produto.",
    action: "Entre em contato com o administrador para solicitar acesso.",
  },
  Verification: {
    title: "Token Expirado",
    message: "O token de verificação expirou ou já foi usado.",
    action: "Tente fazer login novamente.",
  },
  OAuthCallback: {
    title: "Erro no Login",
    message: "Ocorreu um erro durante o processo de autenticação.",
    action: "Verifique suas permissões e tente novamente.",
  },
  Default: {
    title: "Erro Inesperado",
    message: "Ocorreu um erro inesperado durante o login.",
    action: "Tente novamente mais tarde.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");
  const errorMessage = searchParams.get("message");

  // Try to match error type or use Default
  const errorKey = (errorType && errorType in errorMessages 
    ? errorType 
    : "Default") as keyof typeof errorMessages;
  
  const errorConfig = errorMessages[errorKey];

  // Use custom message from SSO if available, otherwise use default
  const displayMessage = errorMessage || errorConfig.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">{errorConfig.title}</CardTitle>
          <CardDescription>Não foi possível fazer login na sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>{displayMessage}</p>
              {errorConfig.action && (
                <p className="text-sm font-medium">{errorConfig.action}</p>
              )}
            </AlertDescription>
          </Alert>

          {errorKey === "AccessDenied" && (
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Como obter acesso:</strong>
                <ol className="mt-2 ml-4 list-decimal space-y-1">
                  <li>Acesse o portal do administrador</li>
                  <li>Solicite permissão para este produto</li>
                  <li>Aguarde a aprovação do administrador</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">Tentar novamente</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
