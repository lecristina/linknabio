"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FiltersProps = {
  defaultStatus?: "all" | "active" | "paused" | "ended";
};

export function Filters({ defaultStatus = "all" }: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex gap-2 w-full md:w-auto">
        <Input placeholder="Pesquisar campanhas" className="w-full md:w-80" />
        <Select defaultValue={defaultStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="ended">Encerradas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Últimos 30 dias</Button>
        <Button variant="default">Exportar</Button>
      </div>
    </div>
  );
}
