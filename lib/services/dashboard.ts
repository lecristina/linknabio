export type DashboardSummary = {
  investment: string;
  clicks: string;
  conversions: string;
  cpa: string;
};

export class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    return {
      investment: "R$ 7.240,00",
      clicks: "11.420",
      conversions: "1.013",
      cpa: "R$ 8,12",
    };
  }
}
