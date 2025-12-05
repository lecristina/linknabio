"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/page-title";
import { KpiGrid } from "@/components/campaigns/google/KpiGrid";
import { Filters } from "@/components/campaigns/google/Filters";
import { CampaignsTable, type Campaign } from "@/components/campaigns/google/CampaignsTable";

export default function GoogleCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/campaigns/google")
      .then((r) => r.json())
      .then((data: Campaign[]) => setCampaigns(data))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    if (!campaigns || campaigns.length === 0) {
      return { investment: "-", clicks: "-", conversions: "-", cpa: "-" };
    }

    const totalSpend = campaigns.reduce((sum, c) => sum + parseCurrencyBR(c.spend), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

    return {
      investment: formatCurrencyBR(totalSpend),
      clicks: totalClicks.toLocaleString("pt-BR"),
      conversions: totalConversions.toLocaleString("pt-BR"),
      cpa: formatCurrencyBR(avgCpa),
    };
  }, [campaigns]);

  return (
    <div className="py-8">
      <PageTitle title="Campanhas - Google Ads" subtitle="Visão geral das campanhas e principais métricas." />

      <KpiGrid investment={kpis.investment} clicks={kpis.clicks} conversions={kpis.conversions} cpa={kpis.cpa} />

      <Filters defaultStatus="all" />

      {loading ? null : <CampaignsTable campaigns={campaigns || []} />}
    </div>
  );
}

function parseCurrencyBR(value: string): number {
  const normalized = value
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrencyBR(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
}
