import { NextRequest, NextResponse } from "next/server";
import { LinkBioService } from "@/lib/services/LinkBioService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json(
        { error: "linkId is required" },
        { status: 400 }
      );
    }

    const linkBioService = new LinkBioService();
    await linkBioService.trackLinkClick(linkId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking link click:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

