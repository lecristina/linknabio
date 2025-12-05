import { createAppClient } from "@/lib/supabase/server";
import type { Article, CreateArticleInput, UpdateArticleInput } from "@/types/linkbio";

export class ArticleRepository {
  private async getClient() {
    return await createAppClient();
  }

  async findByProfileId(profileId: string): Promise<Article[]> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("profile_id", profileId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error finding articles:", error);
      return [];
    }

    return (data || []) as Article[];
  }

  async findById(articleId: string): Promise<Article | null> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error finding article by id:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data as Article;
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const supabase = await this.getClient();

    const { data: existingArticles } = await supabase
      .from("articles")
      .select("order_index")
      .eq("profile_id", input.profile_id)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex = existingArticles?.[0]?.order_index
      ? existingArticles[0].order_index + 1
      : 0;

    const { data, error } = await supabase
      .from("articles")
      .insert({
        profile_id: input.profile_id,
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        url: input.url,
        read_time: input.read_time,
        published_at: input.published_at,
        order_index: input.order_index ?? nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create article: ${error.message}`);
    }

    return data as Article;
  }

  async update(articleId: string, input: UpdateArticleInput): Promise<Article> {
    const supabase = await this.getClient();

    const updateData: Record<string, any> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.image_url !== undefined) updateData.image_url = input.image_url;
    if (input.url !== undefined) updateData.url = input.url;
    if (input.read_time !== undefined) updateData.read_time = input.read_time;
    if (input.published_at !== undefined) updateData.published_at = input.published_at;
    if (input.order_index !== undefined) updateData.order_index = input.order_index;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    const { data, error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", articleId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update article: ${error.message}`);
    }

    return data as Article;
  }

  async delete(articleId: string): Promise<void> {
    const supabase = await this.getClient();

    const { error } = await supabase.from("articles").delete().eq("id", articleId);

    if (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
  }

  async reorder(profileId: string, articleIds: string[]): Promise<void> {
    const supabase = await this.getClient();

    for (let index = 0; index < articleIds.length; index++) {
      const { error } = await supabase
        .from("articles")
        .update({ order_index: index })
        .eq("id", articleIds[index])
        .eq("profile_id", profileId);

      if (error) {
        console.error(`Failed to update order for article ${articleIds[index]}:`, error);
      }
    }
  }
}

