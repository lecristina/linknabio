export type BreadcrumbEntry = {
  label: string;
};

export const BREADCRUMB_ROUTE_MAP: Record<string, BreadcrumbEntry> = {
  "/": { label: "Dashboard" },
  "/campaigns": { label: "Campanhas" },
  "/campaigns/google": { label: "Google Ads" },
};

export function toTitleCase(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
