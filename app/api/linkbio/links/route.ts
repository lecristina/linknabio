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
    const { title, description, url, icon, link_type, order_index } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Título e URL são obrigatórios" },
        { status: 400 }
      );
    }

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.createLink(userId, {
      profile_id: "",
      title,
      description,
      url,
      icon,
      link_type,
      order_index,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

