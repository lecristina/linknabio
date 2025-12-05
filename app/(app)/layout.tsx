import type React from "react";
import { Header } from "@/components/dashboard/promo-banner";
import { DashboardBreadcrumb } from "@/components/dashboard/breadcrumb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
        <DashboardBreadcrumb />
        {children}
      </main>
    </div>
  );
}
