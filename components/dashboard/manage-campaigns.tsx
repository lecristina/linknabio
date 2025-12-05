"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ManageCampaigns() {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold mb-6 text-foreground">Campanhas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Google Ads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Gerencie suas campanhas do Google Ads.</p>
            <Button asChild>
              <Link href="/campaigns/google">Gerenciar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
