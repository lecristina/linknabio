"use client";

import { useState, useEffect } from "react";
import type { ProfileWithLinks } from "@/types/linkbio";
import {
  ArrowRight,
  Calendar,
  Phone,
  Heart,
  Video,
  BookOpen,
  FileText,
  Mail,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Github,
  MessageCircle,
  Clock,
  ChevronRight,
  Sparkles,
  User,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  profile: ProfileWithLinks;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  phone: Phone,
  heart: Heart,
  video: Video,
  book: BookOpen,
  file: FileText,
  mail: Mail,
  globe: Globe,
};

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Globe,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  github: Github,
  whatsapp: MessageCircle,
  email: Mail,
  tiktok: Video,
};

// Helper para formatar URLs de redes sociais
function getSocialUrl(platform: string, url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  switch (platform) {
    case "whatsapp":
      const phoneNumber = url.replace(/\D/g, "");
      return `https://wa.me/${phoneNumber}`;
    case "email":
      if (!url.startsWith("mailto:")) {
        return `mailto:${url}`;
      }
      return url;
    case "instagram":
      return `https://instagram.com/${url.replace("@", "")}`;
    case "twitter":
      return `https://twitter.com/${url.replace("@", "")}`;
    case "linkedin":
      return `https://linkedin.com/in/${url}`;
    case "youtube":
      return `https://youtube.com/${url.startsWith("@") ? url : `@${url}`}`;
    case "github":
      return `https://github.com/${url}`;
    case "facebook":
      return `https://facebook.com/${url}`;
    case "tiktok":
      return `https://tiktok.com/@${url.replace("@", "")}`;
    default:
      return url;
  }
}

export function LivePreview({ profile }: LivePreviewProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryColor = profile.theme?.primaryColor || "#0891b2";
  const backgroundColor = profile.theme?.backgroundColor || "#f8fafc";
  const textColor = profile.theme?.textColor || "#1e293b";
  const coverColor = profile.cover_color || "#87CEEB";
  const buttonStyle = profile.theme?.buttonStyle || "rounded";

  const getButtonRadius = () => {
    switch (buttonStyle) {
      case "square":
        return "rounded-md";
      case "pill":
        return "rounded-full";
      default:
        return "rounded-2xl";
    }
  };

  const primaryLinks = (profile.links || []).filter(
    (link) => link.is_active && link.link_type === "primary"
  );
  const secondaryLinks = (profile.links || []).filter(
    (link) => link.is_active && link.link_type === "secondary"
  );
  const activeArticles = (profile.articles || []).filter((article) => article.is_active);
  const socialLinks = profile.social_links || [];
  const badges = profile.badges || [];

  const renderIcon = (iconName: string | null, className: string = "w-5 h-5") => {
    if (!iconName) return <ExternalLink className={className} />;
    const IconComponent = iconMap[iconName.toLowerCase()];
    if (!IconComponent) return <ExternalLink className={className} />;
    return <IconComponent className={className} />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || !mounted) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-[420px] h-[840px] rounded-[3rem] border-[12px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden relative">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />
      
      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-gray-600 rounded-full z-20" />

      {/* Screen Content */}
      <div
        className="w-full h-full overflow-y-auto scrollbar-hide"
        style={{ backgroundColor }}
      >
        {/* Hero Section with Wave */}
        <div className="relative">
          {/* Gradient Cover */}
          <div
            className="h-40 w-full"
            style={{
              background: `linear-gradient(160deg, ${coverColor} 0%, ${primaryColor} 50%, ${primaryColor}90 100%)`,
            }}
          />

          {/* Curved wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-12"
              preserveAspectRatio="none"
              style={{ color: backgroundColor }}
            >
              <path
                d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,75 1440,60 L1440,120 L0,120 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative px-5 -mt-20 pb-8">
          {/* Profile Card */}
          <div 
            className="relative bg-white/80 backdrop-blur-xl rounded-[1.75rem] shadow-2xl border border-white/60 p-6 mb-6"
            style={{ boxShadow: `0 20px 40px -10px ${primaryColor}25` }}
          >
            {/* Decorative corner accent */}
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-bl-[2.5rem] opacity-10"
              style={{ backgroundColor: primaryColor }}
            />
            
            <div className="flex flex-col items-center text-center relative">
              {/* Avatar with ring */}
              <div className="relative mb-5">
                <div
                  className="w-28 h-28 rounded-full p-1"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${coverColor})` }}
                >
                  <div
                    className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name || "Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-white text-3xl font-bold">
                          {getInitials(profile.display_name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Status indicator */}
                <div 
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-[3px] border-white shadow-lg"
                  style={{ backgroundColor: "#22c55e" }}
                />
              </div>

              {/* Name */}
              {profile.display_name && (
                <h1
                  className="text-2xl font-extrabold mb-1 tracking-tight"
                  style={{ color: textColor }}
                >
                  {profile.display_name}
                </h1>
              )}

              {/* Professional Title */}
              {profile.professional_title && (
                <div
                  className="inline-flex items-center gap-1.5 text-base font-semibold mb-2 px-4 py-1.5 rounded-full"
                  style={{ 
                    color: primaryColor,
                    backgroundColor: `${primaryColor}12`
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  {profile.professional_title}
                </div>
              )}

              {/* Subtitle */}
              {profile.subtitle && (
                <p className="text-sm text-gray-500 mb-3">{profile.subtitle}</p>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-gray-600 max-w-[320px] leading-relaxed mb-5">
                  {profile.bio}
                </p>
              )}

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className="text-xs px-4 py-1.5 rounded-full font-semibold shadow-sm border"
                      style={{
                        backgroundColor: "white",
                        color: primaryColor,
                        borderColor: `${primaryColor}30`,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Primary Links (CTAs) */}
          {primaryLinks.length > 0 && (
            <div className="space-y-3 mb-6">
              {primaryLinks.map((link) => (
                <div
                  key={link.id}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 text-white transition-all duration-300 group relative overflow-hidden",
                    getButtonRadius()
                  )}
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 35px -10px ${primaryColor}80`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {renderIcon(link.icon, "w-5 h-5")}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-base">{link.title}</p>
                    {link.description && (
                      <p className="text-sm opacity-80 truncate">{link.description}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0 opacity-70" />
                </div>
              ))}
            </div>
          )}

          {/* Secondary Links */}
          {secondaryLinks.length > 0 && (
            <div className="mb-6">
              {/* Section Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">
                  Recursos
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <div className="space-y-2.5">
                {secondaryLinks.map((link) => (
                  <div
                    key={link.id}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm border border-gray-100/80 shadow-lg group",
                      getButtonRadius()
                    )}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      {renderIcon(link.icon, "w-5 h-5")}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-base text-gray-800">{link.title}</p>
                      {link.description && (
                        <p className="text-sm text-gray-500 truncate">{link.description}</p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {activeArticles.length > 0 && (
            <div className="mb-6">
              {/* Section Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">
                  Blog
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <div className="space-y-3">
                {activeArticles.slice(0, 2).map((article) => (
                  <div
                    key={article.id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-lg overflow-hidden"
                  >
                    {/* Article Image */}
                    <div className="relative h-36 overflow-hidden">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}20, ${coverColor}20)`,
                          }}
                        >
                          <BookOpen className="w-10 h-10" style={{ color: `${primaryColor}50` }} />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Meta badges */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        {article.published_at && (
                          <span className="flex items-center gap-1 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.published_at)}
                          </span>
                        )}
                        {article.read_time && (
                          <span className="flex items-center gap-1 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {article.read_time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-base text-gray-800 mb-1.5 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      {/* Read more */}
                      <div 
                        className="flex items-center gap-1 mt-3 text-sm font-semibold"
                        style={{ color: primaryColor }}
                      >
                        <span>Ler artigo</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-3 mb-6">
              {socialLinks.map((social, index) => {
                const IconComponent = socialIconMap[social.platform] || Globe;
                return (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <footer className="text-center space-y-3 pt-5">
            {profile.footer_text && (
              <p className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "#22c55e" }}
                />
                {profile.footer_text}
              </p>
            )}
            {profile.footer_subtext && (
              <p className="text-xs text-gray-400">{profile.footer_subtext}</p>
            )}
            
            {/* Branding */}
            <div className="pt-5 border-t border-gray-200/50">
              <p className="text-xs text-gray-400">
                © 2025 {profile.display_name}
              </p>
            </div>
          </footer>

          {/* Empty State */}
          {primaryLinks.length === 0 && secondaryLinks.length === 0 && !profile.display_name && (
            <div className="text-center py-12">
              <User className="w-14 h-14 mx-auto text-gray-300 mb-3" />
              <p className="text-base text-gray-400">
                Preencha os campos<br />para ver o preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
