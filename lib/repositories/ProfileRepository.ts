import { createAppClient } from "@/lib/supabase/server";
import type {
  Profile,
  ProfileWithLinks,
  CreateProfileInput,
  UpdateProfileInput,
} from "@/types/linkbio";

export class ProfileRepository {
  private async getClient() {
    return await createAppClient();
  }

  async findBySlug(slug: string): Promise<ProfileWithLinks | null> {
    const supabase = await this.getClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        links (*),
        articles (*)
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error finding profile by slug:", error);
      return null;
    }

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      badges: profile.badges || [],
      social_links: profile.social_links || [],
      links: (profile.links || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
      articles: (profile.articles || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
    } as ProfileWithLinks;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error finding profile by user_id:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      badges: data.badges || [],
      social_links: data.social_links || [],
    } as Profile;
  }

  async findByUserIdWithLinks(userId: string): Promise<ProfileWithLinks | null> {
    const supabase = await this.getClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        links (*),
        articles (*)
      `
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error finding profile with links:", error);
      return null;
    }

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      badges: profile.badges || [],
      social_links: profile.social_links || [],
      links: (profile.links || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
      articles: (profile.articles || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
    } as ProfileWithLinks;
  }

  async create(input: CreateProfileInput): Promise<Profile> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: input.user_id,
        slug: input.slug,
        display_name: input.display_name,
        professional_title: input.professional_title,
        subtitle: input.subtitle,
        bio: input.bio,
        avatar_url: input.avatar_url,
        cover_color: input.cover_color || "#87CEEB",
        theme: input.theme || {
          primaryColor: "#0891b2",
          backgroundColor: "#f0f9ff",
          textColor: "#1e293b",
          coverGradient: "linear-gradient(180deg, #87CEEB 0%, #f0f9ff 100%)",
          buttonStyle: "rounded",
        },
        badges: input.badges || [],
        social_links: input.social_links || [],
        footer_text: input.footer_text,
        footer_subtext: input.footer_subtext,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating profile:", error);

      if (
        error.code === "42P01" ||
        error.message?.includes("does not exist") ||
        error.message?.includes("relation")
      ) {
        throw new Error(
          "Tabela 'profiles' não encontrada. Execute o schema SQL no Supabase (arquivo supabase/schema-completo-v2.sql)"
        );
      }

      if (
        error.code === "23505" ||
        error.code === "PGRST301" ||
        error.message?.includes("duplicate key") ||
        error.message?.includes("unique constraint")
      ) {
        throw new Error(`Slug "${input.slug}" já está em uso. Escolha outro slug.`);
      }

      if (
        error.code === "42501" ||
        error.message?.includes("permission denied") ||
        error.message?.includes("RLS")
      ) {
        throw new Error(
          "Erro de permissão. Execute o schema-completo-v2.sql no Supabase para desabilitar RLS."
        );
      }

      throw new Error(
        `Erro ao criar perfil: ${error.message || error.code || "Erro desconhecido"}`
      );
    }

    if (!data) {
      throw new Error("Perfil criado mas nenhum dado retornado");
    }

    return {
      ...data,
      badges: data.badges || [],
      social_links: data.social_links || [],
    } as Profile;
  }

  async update(userId: string, input: UpdateProfileInput): Promise<Profile> {
    const supabase = await this.getClient();

    const updateData: Record<string, any> = {};

    if (input.display_name !== undefined) updateData.display_name = input.display_name;
    if (input.professional_title !== undefined) updateData.professional_title = input.professional_title;
    if (input.subtitle !== undefined) updateData.subtitle = input.subtitle;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;
    if (input.cover_color !== undefined) updateData.cover_color = input.cover_color;
    if (input.theme !== undefined) updateData.theme = input.theme;
    if (input.badges !== undefined) updateData.badges = input.badges;
    if (input.social_links !== undefined) updateData.social_links = input.social_links;
    if (input.footer_text !== undefined) updateData.footer_text = input.footer_text;
    if (input.footer_subtext !== undefined) updateData.footer_subtext = input.footer_subtext;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return {
      ...data,
      badges: data.badges || [],
      social_links: data.social_links || [],
    } as Profile;
  }

  async checkSlugAvailability(slug: string): Promise<boolean> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return true;
      }
      console.error("Error checking slug availability:", error);
      throw new Error(`Erro ao verificar disponibilidade do slug: ${error.message}`);
    }

    return !data;
  }
}
