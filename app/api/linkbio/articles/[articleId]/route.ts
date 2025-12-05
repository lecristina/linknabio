import { NextRequest, NextResponse } from "next/server";
import { LinkBioService } from "@/lib/services/LinkBioService";
import { getUserIdFromRequest } from "@/lib/auth/utils/get-user-id";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await params;
    const body = await request.json();

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.updateArticle(userId, articleId, body);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await params;

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.deleteArticle(articleId, userId);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

