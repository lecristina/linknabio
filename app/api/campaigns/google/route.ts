import { NextResponse } from "next/server";

export async function GET() {
  const campaigns = [
    {
      id: "1",
      name: "Brand - Search BR",
      status: "active",
      budget: "R$ 2.500,00",
      spend: "R$ 1.980,00",
      clicks: 3421,
      impressions: 81234,
      ctr: "4,2%",
      conversions: 312,
      cpa: "R$ 6,35",
    },
    {
      id: "2",
      name: "Prospecting - Display",
      status: "paused",
      budget: "R$ 1.200,00",
      spend: "R$ 730,00",
      clicks: 1240,
      impressions: 54210,
      ctr: "2,3%",
      conversions: 98,
      cpa: "R$ 7,45",
    },
    {
      id: "3",
      name: "Performance Max - Ecom",
      status: "active",
      budget: "R$ 6.000,00",
      spend: "R$ 4.530,00",
      clicks: 6290,
      impressions: 203411,
      ctr: "3,1%",
      conversions: 542,
      cpa: "R$ 8,36",
    },
    {
      id: "4",
      name: "Remarketing - YouTube",
      status: "ended",
      budget: "R$ 900,00",
      spend: "R$ 880,00",
      clicks: 532,
      impressions: 32101,
      ctr: "1,7%",
      conversions: 61,
      cpa: "R$ 14,43",
    },
  ];

  return NextResponse.json(campaigns);
}
