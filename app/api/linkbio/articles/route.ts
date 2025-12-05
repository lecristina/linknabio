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
    const { title, description, image_url, url, read_time, published_at } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Título e URL são obrigatórios" },
        { status: 400 }
      );
    }

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.createArticle(userId, {
      profile_id: "",
      title,
      description,
      image_url,
      url,
      read_time,
      published_at,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

