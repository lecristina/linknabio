"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { Greeting } from "@/components/dashboard/greeting";
import { DiscoverProducts } from "@/components/dashboard/discover-products";
import { ManageCampaigns } from "@/components/dashboard/manage-campaigns";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <main className="container mx-auto px-4 py-8 md:px-6 max-w-7xl">
          <div className="mb-10">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <main className="py-8">
          <Greeting displayName={user?.name} />

          <ManageCampaigns />

          <DiscoverProducts />
        </main>
      </div>
    </>
  );
}
