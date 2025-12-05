"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/page-title";

export default function CampaignsIndexPage() {
  return (
    <div className="py-8">
      <PageTitle title="Campanhas - Google Ads" subtitle="Visão geral das campanhas e principais métricas." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Google Ads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Gerencie suas campanhas do Google Ads.</p>
            <Button asChild>
              <Link href="/campaigns/google">Abrir</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
