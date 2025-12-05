import { createAppClient } from "@/lib/supabase/server";
import type { Link, CreateLinkInput, UpdateLinkInput } from "@/types/linkbio";

export class LinkRepository {
  private async getClient() {
    return await createAppClient();
  }

  async findByProfileId(profileId: string): Promise<Link[]> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profileId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error finding links:", error);
      return [];
    }

    return (data || []) as Link[];
  }

  async findById(linkId: string): Promise<Link | null> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("id", linkId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error finding link by id:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data as Link;
  }

  async create(input: CreateLinkInput): Promise<Link> {
    const supabase = await this.getClient();

    const { data: existingLinks } = await supabase
      .from("links")
      .select("order_index")
      .eq("profile_id", input.profile_id)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex = existingLinks?.[0]?.order_index
      ? existingLinks[0].order_index + 1
      : 0;

    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: input.profile_id,
        title: input.title,
        description: input.description,
        url: input.url,
        icon: input.icon,
        link_type: input.link_type || "secondary",
        order_index: input.order_index ?? nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create link: ${error.message}`);
    }

    return data as Link;
  }

  async update(linkId: string, input: UpdateLinkInput): Promise<Link> {
    const supabase = await this.getClient();

    const updateData: Record<string, any> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.url !== undefined) updateData.url = input.url;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.link_type !== undefined) updateData.link_type = input.link_type;
    if (input.order_index !== undefined) updateData.order_index = input.order_index;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    const { data, error } = await supabase
      .from("links")
      .update(updateData)
      .eq("id", linkId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update link: ${error.message}`);
    }

    return data as Link;
  }

  async delete(linkId: string): Promise<void> {
    const supabase = await this.getClient();

    const { error } = await supabase.from("links").delete().eq("id", linkId);

    if (error) {
      throw new Error(`Failed to delete link: ${error.message}`);
    }
  }

  async incrementClickCount(linkId: string): Promise<void> {
    const supabase = await this.getClient();

    const { error } = await supabase.rpc("increment_link_clicks", {
      link_id: linkId,
    });

    if (error) {
      const link = await this.findById(linkId);
      if (link) {
        const { error: updateError } = await supabase
          .from("links")
          .update({ click_count: link.click_count + 1 })
          .eq("id", linkId);

        if (updateError) {
          console.error("Failed to increment click count:", updateError);
        }
      }
    }
  }

  async reorder(profileId: string, linkIds: string[]): Promise<void> {
    const supabase = await this.getClient();

    for (let index = 0; index < linkIds.length; index++) {
      const { error } = await supabase
        .from("links")
        .update({ order_index: index })
        .eq("id", linkIds[index])
        .eq("profile_id", profileId);

      if (error) {
        console.error(`Failed to update order for link ${linkIds[index]}:`, error);
      }
    }
  }
}
