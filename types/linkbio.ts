// Tipos de links
export type LinkType = "primary" | "secondary" | "social";

export interface Profile {
  id: string;
  user_id: string;
  slug: string;
  display_name: string | null;
  professional_title: string | null;
  subtitle: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_color: string | null;
  theme: ProfileTheme;
  badges: string[];
  social_links: SocialLink[];
  footer_text: string | null;
  footer_subtext: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  coverGradient?: string;
  buttonStyle?: "rounded" | "square" | "pill";
  fontFamily?: string;
}

export interface SocialLink {
  platform: "website" | "linkedin" | "instagram" | "youtube" | "twitter" | "facebook" | "tiktok" | "whatsapp" | "email" | "github";
  url: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  url: string;
  icon: string | null;
  link_type: LinkType;
  order_index: number;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  url: string;
  read_time: string | null;
  published_at: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithLinks extends Profile {
  links: Link[];
  articles: Article[];
}

export interface CreateProfileInput {
  user_id: string;
  slug: string;
  display_name?: string;
  professional_title?: string;
  subtitle?: string;
  bio?: string;
  avatar_url?: string;
  cover_color?: string;
  theme?: ProfileTheme;
  badges?: string[];
  social_links?: SocialLink[];
  footer_text?: string;
  footer_subtext?: string;
}

export interface UpdateProfileInput {
  display_name?: string;
  professional_title?: string;
  subtitle?: string;
  bio?: string;
  avatar_url?: string;
  cover_color?: string;
  theme?: ProfileTheme;
  badges?: string[];
  social_links?: SocialLink[];
  footer_text?: string;
  footer_subtext?: string;
  is_active?: boolean;
}

export interface CreateLinkInput {
  profile_id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  link_type?: LinkType;
  order_index?: number;
}

export interface UpdateLinkInput {
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  link_type?: LinkType;
  order_index?: number;
  is_active?: boolean;
}

export interface CreateArticleInput {
  profile_id: string;
  title: string;
  description?: string;
  image_url?: string;
  url: string;
  read_time?: string;
  published_at?: string;
  order_index?: number;
}

export interface UpdateArticleInput {
  title?: string;
  description?: string;
  image_url?: string;
  url?: string;
  read_time?: string;
  published_at?: string;
  order_index?: number;
  is_active?: boolean;
}
