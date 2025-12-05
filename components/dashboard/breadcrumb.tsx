"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BREADCRUMB_ROUTE_MAP, toTitleCase } from "@/lib/breadcrumbs";

export function DashboardBreadcrumb() {
  const pathname = usePathname() || "/";

  const segments = useMemo(() => {
    const cleaned = pathname.split("?")[0].split("#")[0];
    const parts = cleaned === "/" ? [""] : cleaned.split("/").filter(Boolean);
    const accum: { href: string; label: string }[] = [];
    let current = "";
    if (parts.length === 0) {
      accum.push({ href: "/", label: BREADCRUMB_ROUTE_MAP["/"]?.label || "Dashboard" });
      return accum;
    }
    accum.push({ href: "/", label: "Início" });
    for (let i = 0; i < parts.length; i++) {
      current += `/${parts[i]}`;
      const entry = BREADCRUMB_ROUTE_MAP[current];
      const label = entry?.label ?? toTitleCase(parts[i]);
      accum.push({ href: current, label });
    }
    return accum;
  }, [pathname]);

  const lastIndex = segments.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, idx) => (
          <Fragment key={`seg-${idx}`}>
            <BreadcrumbItem>
              {idx === lastIndex ? (
                <BreadcrumbPage className="text-gray-900 font-medium">{seg.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={seg.href} className="text-gray-500 hover:text-gray-700 transition-colors">
                  {seg.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < lastIndex ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
