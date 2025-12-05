import { NextRequest, NextResponse } from "next/server";
import { LinkBioService } from "@/lib/services/LinkBioService";
import { getUserIdFromRequest } from "@/lib/auth/utils/get-user-id";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.getProfileByUserId(userId);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, display_name, bio, avatar_url, theme } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.createProfile({
      user_id: userId,
      slug,
      display_name,
      bio,
      avatar_url,
      theme,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    
    let status = 500;
    let errorMessage = error?.message || error?.toString() || "Erro desconhecido ao criar perfil";
    
    if (errorMessage.includes("já está em uso") || errorMessage.includes("duplicate")) {
      status = 400;
    } else if (errorMessage.includes("Unauthorized")) {
      status = 401;
    } else if (errorMessage.includes("não encontrada") || errorMessage.includes("does not exist")) {
      status = 503;
      errorMessage = "Banco de dados não configurado. Execute o schema SQL no Supabase.";
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const linkBioService = new LinkBioService();
    const profile = await linkBioService.updateProfile(userId, body);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

