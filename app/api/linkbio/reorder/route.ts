import { NextRequest, NextResponse } from "next/server";
import { LinkBioService } from "@/lib/services/LinkBioService";
import { getUserIdFromRequest } from "@/lib/auth/utils/get-user-id";

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { linkIds } = body;

    if (!Array.isArray(linkIds)) {
      return NextResponse.json(
        { error: "linkIds must be an array" },
        { status: 400 }
      );
    }

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.reorderLinks(userId, linkIds);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error reordering links:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

