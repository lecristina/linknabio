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

const errorMessages = {
  Configuration: "Há um problema com a configuração do servidor.",
  AccessDenied: "Você não tem permissão para fazer login.",
  Verification: "O token de verificação expirou ou já foi usado.",
  Default: "Ocorreu um erro inesperado durante o login.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Erro de Autenticação</CardTitle>
          <CardDescription>Não foi possível fazer login na sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

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
