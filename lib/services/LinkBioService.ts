import { ProfileRepository } from "@/lib/repositories/ProfileRepository";
import { LinkRepository } from "@/lib/repositories/LinkRepository";
import { ArticleRepository } from "@/lib/repositories/ArticleRepository";
import type {
  ProfileWithLinks,
  CreateProfileInput,
  UpdateProfileInput,
  CreateLinkInput,
  UpdateLinkInput,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/types/linkbio";

export class LinkBioService {
  constructor(
    private profileRepository = new ProfileRepository(),
    private linkRepository = new LinkRepository(),
    private articleRepository = new ArticleRepository()
  ) {}

  async getProfileBySlug(slug: string): Promise<ProfileWithLinks | null> {
    return this.profileRepository.findBySlug(slug);
  }

  async getProfileByUserId(userId: string): Promise<ProfileWithLinks | null> {
    return this.profileRepository.findByUserIdWithLinks(userId);
  }

  async createProfile(input: CreateProfileInput): Promise<ProfileWithLinks> {
    try {
      const isAvailable = await this.profileRepository.checkSlugAvailability(
        input.slug
      );

      if (!isAvailable) {
        throw new Error(`Slug "${input.slug}" já está em uso. Escolha outro slug.`);
      }

      const profile = await this.profileRepository.create(input);
      return {
        ...profile,
        links: [],
        articles: [],
      };
    } catch (error: any) {
      if (error.message?.includes("já está em uso")) {
        throw error;
      }
      if (error.message?.includes("duplicate key") || error.message?.includes("23505")) {
        throw new Error(`Slug "${input.slug}" já está em uso. Escolha outro slug.`);
      }
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<ProfileWithLinks> {
    const profile = await this.profileRepository.update(userId, input);
    const links = await this.linkRepository.findByProfileId(profile.id);
    const articles = await this.articleRepository.findByProfileId(profile.id);

    return {
      ...profile,
      links,
      articles,
    };
  }

  // Links
  async createLink(
    userId: string,
    input: CreateLinkInput
  ): Promise<ProfileWithLinks> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    await this.linkRepository.create({
      ...input,
      profile_id: profile.id,
    });

    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  async updateLink(
    userId: string,
    linkId: string,
    input: UpdateLinkInput
  ): Promise<ProfileWithLinks> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new Error("Link not found");
    }

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile || profile.id !== link.profile_id) {
      throw new Error("Unauthorized");
    }

    await this.linkRepository.update(linkId, input);
    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  async deleteLink(linkId: string, userId: string): Promise<ProfileWithLinks> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new Error("Link not found");
    }

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile || profile.id !== link.profile_id) {
      throw new Error("Unauthorized");
    }

    await this.linkRepository.delete(linkId);
    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  async trackLinkClick(linkId: string): Promise<void> {
    await this.linkRepository.incrementClickCount(linkId);
  }

  async reorderLinks(
    userId: string,
    linkIds: string[]
  ): Promise<ProfileWithLinks> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    await this.linkRepository.reorder(profile.id, linkIds);
    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  // Articles
  async createArticle(
    userId: string,
    input: CreateArticleInput
  ): Promise<ProfileWithLinks> {
    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    await this.articleRepository.create({
      ...input,
      profile_id: profile.id,
    });

    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  async updateArticle(
    userId: string,
    articleId: string,
    input: UpdateArticleInput
  ): Promise<ProfileWithLinks> {
    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile || profile.id !== article.profile_id) {
      throw new Error("Unauthorized");
    }

    await this.articleRepository.update(articleId, input);
    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }

  async deleteArticle(articleId: string, userId: string): Promise<ProfileWithLinks> {
    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile || profile.id !== article.profile_id) {
      throw new Error("Unauthorized");
    }

    await this.articleRepository.delete(articleId);
    const result = await this.profileRepository.findByUserIdWithLinks(userId);
    if (!result) {
      throw new Error("Failed to fetch updated profile");
    }
    return result;
  }
}
