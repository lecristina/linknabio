"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

export function DiscoverProducts() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-6 text-foreground">Descubra novos produtos:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Link na Bio</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Crie sua página de links personalizada.</p>
            <Button asChild>
              <Link href="/linkbio">Começar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
