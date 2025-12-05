"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Summary = {
  investment: string;
  clicks: string;
  conversions: string;
  cpa: string;
};

export function SummaryCards({ summary }: { summary: Summary | null }) {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Investimento</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{summary.investment}</div>
          <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cliques</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{summary.clicks}</div>
          <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Conversões</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{summary.conversions}</div>
          <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">CPA</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{summary.cpa}</div>
          <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
        </CardContent>
      </Card>
    </div>
  );
}
