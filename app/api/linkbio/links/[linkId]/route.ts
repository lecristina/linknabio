import { NextRequest, NextResponse } from "next/server";
import { LinkBioService } from "@/lib/services/LinkBioService";
import { getUserIdFromRequest } from "@/lib/auth/utils/get-user-id";

interface RouteParams {
  params: Promise<{ linkId: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkId } = await params;
    const body = await request.json();

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.updateLink(userId, linkId, body);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkId } = await params;

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.deleteLink(linkId, userId);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

