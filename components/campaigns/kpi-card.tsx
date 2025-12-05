"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function KpiCard({ title, value, subtitle }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
