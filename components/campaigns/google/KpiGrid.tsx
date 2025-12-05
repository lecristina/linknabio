"use client";

import { KpiCard } from "@/components/campaigns/kpi-card";

type KpiGridProps = {
  investment: string;
  clicks: string;
  conversions: string;
  cpa: string;
};

export function KpiGrid({ investment, clicks, conversions, cpa }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard title="Investimento" value={investment} subtitle="Últimos 30 dias" />
      <KpiCard title="Cliques" value={clicks} subtitle="Últimos 30 dias" />
      <KpiCard title="Conversões" value={conversions} subtitle="Últimos 30 dias" />
      <KpiCard title="CPA" value={cpa} subtitle="Últimos 30 dias" />
    </div>
  );
}
