"use client";

import { Badge } from "@/components/ui/badge";

type Status = "active" | "paused" | "ended";

export function StatusBadge({ status }: { status: Status }) {
  const labelByStatus: Record<Status, string> = {
    active: "Ativa",
    paused: "Pausada",
    ended: "Encerrada",
  };

  const classByStatus: Record<Status, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    paused: "bg-amber-100 text-amber-700 border-amber-200",
    ended: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge variant="outline" className={classByStatus[status]}>
      {labelByStatus[status]}
    </Badge>
  );
}
