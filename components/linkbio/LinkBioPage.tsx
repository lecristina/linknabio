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
  ExternalLink,
  Sparkles,
  ChevronRight,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkBioPageProps {
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
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  github: Github,
  message: MessageCircle,
  play: Play,
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
  // Se já é uma URL completa, retorna como está
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Tratamentos especiais por plataforma
  switch (platform) {
    case "whatsapp":
      // Remove caracteres não numéricos e adiciona o prefixo wa.me
      const phoneNumber = url.replace(/\D/g, "");
      return `https://wa.me/${phoneNumber}`;
    case "email":
      // Adiciona mailto: se for email
      if (!url.startsWith("mailto:")) {
        return `mailto:${url}`;
      }
      return url;
    case "instagram":
      // Se for username, formata URL do Instagram
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

export function LinkBioPage({ profile }: LinkBioPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      await fetch("/api/linkbio/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      });
    } catch (e) {
      // Ignore errors
    }
    window.open(url, "_blank", "noopener,noreferrer");
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

  const primaryColor = profile.theme?.primaryColor || "#0891b2";
  const backgroundColor = profile.theme?.backgroundColor || "#f8fafc";
  const textColor = profile.theme?.textColor || "#1e293b";
  const coverColor = profile.cover_color || "#0891b2";
  const buttonStyle = profile.theme?.buttonStyle || "rounded";

  const getButtonRadius = () => {
    switch (buttonStyle) {
      case "square":
        return "rounded-xl";
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
    if (!iconName || iconName === "none") return <ExternalLink className={className} />;
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
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor }} suppressHydrationWarning>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient blob top right */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Medium blob left */}
        <div
          className="absolute top-1/4 -left-24 w-[300px] h-[300px] rounded-full blur-[100px] opacity-30"
          style={{ backgroundColor: coverColor }}
        />
        {/* Small blob bottom */}
        <div
          className="absolute bottom-20 right-1/4 w-[200px] h-[200px] rounded-full blur-[80px] opacity-25"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero Section with Wave */}
      <div className="relative">
        {/* Gradient Cover */}
        <div
          className="h-72 md:h-80 w-full relative"
          style={{
            background: `linear-gradient(160deg, ${coverColor} 0%, ${primaryColor} 50%, ${primaryColor}90 100%)`,
          }}
        />
      

        {/* Curved wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-24 md:h-28"
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
      <div className="relative max-w-2xl mx-auto px-8 -mt-36 md:-mt-40 pb-20">
        {/* Profile Card */}
        <div 
          className="relative bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/60 p-10 md:p-14 mb-12"
          style={{ boxShadow: `0 30px 60px -15px ${primaryColor}25` }}
        >
          {/* Decorative corner accent */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-bl-[5rem] opacity-10"
            style={{ backgroundColor: primaryColor }}
          />
          
          <div className="flex flex-col items-center text-center relative">
            {/* Avatar with ring */}
            <div className="relative mb-8">
              <div
                className="w-44 h-44 md:w-52 md:h-52 rounded-full p-2"
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
                      <span className="text-white text-5xl md:text-6xl font-bold">
                        {getInitials(profile.display_name)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Status indicator */}
              <div 
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: "#22c55e" }}
              />
            </div>

            {/* Name */}
            {profile.display_name && (
              <h1
                className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight"
                style={{ color: textColor }}
              >
                {profile.display_name}
              </h1>
            )}

            {/* Professional Title */}
            {profile.professional_title && (
              <div
                className="inline-flex items-center gap-2.5 text-xl font-semibold mb-4 px-6 py-2.5 rounded-full"
                style={{ 
                  color: primaryColor,
                  backgroundColor: `${primaryColor}12`
                }}
              >
                <Sparkles className="w-6 h-6" />
                {profile.professional_title}
              </div>
            )}

            {/* Subtitle */}
            {profile.subtitle && (
              <p className="text-lg text-gray-500 mb-5">{profile.subtitle}</p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed mb-8">
                {profile.bio}
              </p>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className="text-base px-6 py-2.5 rounded-full font-semibold shadow-sm border transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
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
          <div className="space-y-5 mb-12">
            {primaryLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className={cn(
                  "w-full flex items-center gap-6 p-6 md:p-8 text-white transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] group relative overflow-hidden",
                  getButtonRadius()
                )}
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 12px 50px -12px ${primaryColor}80`,
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div 
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    }}
                  />
                </div>
                
                <div
                  className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {renderIcon(link.icon, "w-7 h-7 md:w-8 md:h-8")}
                </div>
                <div className="flex-1 text-left min-w-0 relative z-10">
                  <p className="font-bold text-xl md:text-2xl">{link.title}</p>
                  {link.description && (
                    <p className="text-lg opacity-80 truncate">{link.description}</p>
                  )}
                </div>
                <ChevronRight className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 opacity-70" />
              </button>
            ))}
          </div>
        )}

        {/* Secondary Links */}
        {secondaryLinks.length > 0 && (
          <div className="mb-12">
            {/* Section Divider */}
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">
                Recursos
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="space-y-4">
              {secondaryLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className={cn(
                    "w-full flex items-center gap-6 p-6 md:p-7 bg-white/90 backdrop-blur-sm border border-gray-100/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white hover:-translate-y-0.5 group",
                    getButtonRadius()
                  )}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {renderIcon(link.icon, "w-7 h-7")}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-xl text-gray-800">{link.title}</p>
                    {link.description && (
                      <p className="text-lg text-gray-500 truncate">{link.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-7 h-7 text-gray-400 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Articles Section */}
        {activeArticles.length > 0 && (
          <div className="mb-12">
            {/* Section Divider */}
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">
                Blog
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="space-y-6">
              {activeArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => window.open(article.url, "_blank", "noopener,noreferrer")}
                  className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-gray-100/80 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                >
                  {/* Article Image */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}20, ${coverColor}20)`,
                        }}
                      >
                        <BookOpen className="w-20 h-20" style={{ color: `${primaryColor}50` }} />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Meta badges */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-4">
                      {article.published_at && (
                        <span className="flex items-center gap-2 text-base text-white/90 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Calendar className="w-5 h-5" />
                          {formatDate(article.published_at)}
                        </span>
                      )}
                      {article.read_time && (
                        <span className="flex items-center gap-2 text-base text-white/90 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Clock className="w-5 h-5" />
                          {article.read_time}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-7">
                    <h3 className="font-bold text-2xl md:text-3xl text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-lg text-gray-500 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    
                    {/* Read more */}
                    <div 
                      className="flex items-center gap-2 mt-5 text-lg font-semibold transition-all duration-300 group-hover:gap-3"
                      style={{ color: primaryColor }}
                    >
                      <span>Ler artigo</span>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-5 mb-14">
            {socialLinks.map((social, index) => {
              const IconComponent = socialIconMap[social.platform] || Globe;
              return (
                <button
                  key={index}
                  onClick={() => window.open(getSocialUrl(social.platform, social.url), "_blank", "noopener,noreferrer")}
                  className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                >
                  <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-gray-600 transition-colors group-hover:text-gray-800" />
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center space-y-5 pt-10">
          {profile.footer_text && (
            <p className="text-lg font-medium text-gray-600 flex items-center justify-center gap-3">
              <span 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: "#22c55e" }}
              />
              {profile.footer_text}
            </p>
          )}
          {profile.footer_subtext && (
            <p className="text-base text-gray-400">{profile.footer_subtext}</p>
          )}
          
          {/* Branding */}
          <div className="pt-10 border-t border-gray-200/50">
            <p className="text-base text-gray-400">
              © 2025 {profile.display_name}
            </p>
          </div>
        </footer>

        {/* Empty State */}
        {primaryLinks.length === 0 && secondaryLinks.length === 0 && activeArticles.length === 0 && (
          <div 
            className="text-center py-16 rounded-3xl"
            style={{ backgroundColor: `${primaryColor}08` }}
          >
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Sparkles className="w-10 h-10" style={{ color: primaryColor }} />
            </div>
            <p className="font-semibold text-gray-700">Em construção</p>
            <p className="text-sm text-gray-400 mt-1">Novos conteúdos em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}
