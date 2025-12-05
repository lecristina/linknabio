"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/campaigns/status-badge";

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "ended";
  budget: string;
  spend: string;
  clicks: number;
  impressions: number;
  ctr: string;
  conversions: number;
  cpa: string;
};

type CampaignsTableProps = {
  campaigns: Campaign[];
};

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Orçamento</TableHead>
            <TableHead>Gasto</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>Impressões</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Conversões</TableHead>
            <TableHead>CPA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>
              <TableCell>{c.budget}</TableCell>
              <TableCell>{c.spend}</TableCell>
              <TableCell>{c.clicks.toLocaleString("pt-BR")}</TableCell>
              <TableCell>{c.impressions.toLocaleString("pt-BR")}</TableCell>
              <TableCell>{c.ctr}</TableCell>
              <TableCell>{c.conversions.toLocaleString("pt-BR")}</TableCell>
              <TableCell>{c.cpa}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
