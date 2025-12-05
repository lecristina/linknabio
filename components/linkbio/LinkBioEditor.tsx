"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProfileWithLinks, Link, Article, SocialLink, LinkType } from "@/types/linkbio";
import {
  Save,
  Plus,
  X,
  Trash2,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Github,
  MessageCircle,
  Mail,
  Calendar,
  Phone,
  Heart,
  Video,
  BookOpen,
  FileText,
  Smartphone,
  Palette,
  User,
  Link2,
  FileImage,
  Eye,
  GripVertical,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LivePreview } from "./LivePreview";

interface LinkBioEditorProps {
  initialProfile: ProfileWithLinks | null;
}

const socialPlatforms = [
  { value: "website", label: "Website", icon: Globe },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "twitter", label: "Twitter/X", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "github", label: "GitHub", icon: Github },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
];

const iconOptions = [
  { value: "none", label: "Nenhum", icon: ExternalLink },
  { value: "calendar", label: "Calendário", icon: Calendar },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "heart", label: "Coração", icon: Heart },
  { value: "video", label: "Vídeo", icon: Video },
  { value: "book", label: "Livro", icon: BookOpen },
  { value: "file", label: "Arquivo", icon: FileText },
  { value: "mail", label: "Email", icon: Mail },
  { value: "globe", label: "Website", icon: Globe },
];

const presetColors = [
  { name: "Azul", primary: "#0891b2", bg: "#ecfeff", cover: "#67e8f9" },
  { name: "Roxo", primary: "#7c3aed", bg: "#faf5ff", cover: "#c4b5fd" },
  { name: "Rosa", primary: "#db2777", bg: "#fdf2f8", cover: "#f9a8d4" },
  { name: "Verde", primary: "#059669", bg: "#ecfdf5", cover: "#6ee7b7" },
  { name: "Laranja", primary: "#ea580c", bg: "#fff7ed", cover: "#fdba74" },
  { name: "Índigo", primary: "#4f46e5", bg: "#eef2ff", cover: "#a5b4fc" },
  { name: "Teal", primary: "#0d9488", bg: "#f0fdfa", cover: "#5eead4" },
  { name: "Cinza", primary: "#475569", bg: "#f8fafc", cover: "#94a3b8" },
];

export function LinkBioEditor({ initialProfile }: LinkBioEditorProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(initialProfile?.id || null);

  // Gerar slug a partir do nome do usuário
  const generateSlugFromName = (name: string | null | undefined): string => {
    if (!name) return "";
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const defaultSlug = initialProfile?.slug || generateSlugFromName(user?.name);
  const defaultDisplayName = initialProfile?.display_name || user?.name || "";

  // Estado do perfil
  const [profileData, setProfileData] = useState({
    slug: defaultSlug,
    display_name: defaultDisplayName,
    professional_title: initialProfile?.professional_title || "",
    subtitle: initialProfile?.subtitle || "",
    bio: initialProfile?.bio || "",
    avatar_url: initialProfile?.avatar_url || "",
    cover_color: initialProfile?.cover_color || "#67e8f9",
    theme: initialProfile?.theme || {
      primaryColor: "#0891b2",
      backgroundColor: "#ecfeff",
      textColor: "#1e293b",
      buttonStyle: "rounded" as const,
    },
    badges: initialProfile?.badges || [],
    social_links: initialProfile?.social_links || [],
    footer_text: initialProfile?.footer_text || "",
    footer_subtext: initialProfile?.footer_subtext || "",
  });

  const [links, setLinks] = useState<Link[]>(initialProfile?.links || []);
  const [articles, setArticles] = useState<Article[]>(initialProfile?.articles || []);

  // Estados temporários
  const [newBadge, setNewBadge] = useState("");
  const [newLink, setNewLink] = useState({
    title: "",
    description: "",
    url: "",
    icon: "",
    link_type: "secondary" as LinkType,
  });
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "instagram",
    url: "",
  });
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    image_url: "",
    url: "",
    read_time: "",
    published_at: "",
  });

  // Funções de atualização
  const updateProfile = (updates: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateTheme = (updates: Partial<typeof profileData.theme>) => {
    setProfileData((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...updates },
    }));
    setHasChanges(true);
  };

  const applyPresetColor = (preset: typeof presetColors[0]) => {
    updateProfile({
      cover_color: preset.cover,
      theme: {
        ...profileData.theme,
        primaryColor: preset.primary,
        backgroundColor: preset.bg,
      },
    });
  };

  // Badges
  const addBadge = () => {
    if (!newBadge.trim()) return;
    if (profileData.badges.includes(newBadge.trim())) {
      toast.error("Badge já existe");
      return;
    }
    updateProfile({ badges: [...profileData.badges, newBadge.trim()] });
    setNewBadge("");
  };

  const removeBadge = (badge: string) => {
    updateProfile({ badges: profileData.badges.filter((b) => b !== badge) });
  };

  // Links
  const addLink = () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Título e URL são obrigatórios");
      return;
    }
    const link: Link = {
      id: `new-${Date.now()}`,
      profile_id: profileId || "",
      title: newLink.title,
      description: newLink.description || null,
      url: newLink.url,
      icon: newLink.icon || null,
      link_type: newLink.link_type,
      order_index: links.length,
      is_active: true,
      click_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLinks([...links, link]);
    setNewLink({ title: "", description: "", url: "", icon: "", link_type: "secondary" });
    setHasChanges(true);
    toast.success("Link adicionado! Clique em Salvar para aplicar.");
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    setHasChanges(true);
  };

  const toggleLinkActive = (id: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, is_active: !l.is_active } : l)));
    setHasChanges(true);
  };

  // Social Links
  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) {
      toast.error("URL é obrigatória");
      return;
    }
    const exists = profileData.social_links.some((s) => s.platform === newSocialLink.platform);
    if (exists) {
      toast.error("Esta rede social já foi adicionada");
      return;
    }
    updateProfile({ social_links: [...profileData.social_links, { ...newSocialLink }] });
    setNewSocialLink({ platform: "instagram", url: "" });
  };

  const removeSocialLink = (platform: string) => {
    updateProfile({
      social_links: profileData.social_links.filter((s) => s.platform !== platform),
    });
  };

  // Articles
  const addArticle = () => {
    if (!newArticle.title || !newArticle.url) {
      toast.error("Título e URL são obrigatórios");
      return;
    }
    const article: Article = {
      id: `new-${Date.now()}`,
      profile_id: profileId || "",
      title: newArticle.title,
      description: newArticle.description || null,
      image_url: newArticle.image_url || null,
      url: newArticle.url,
      read_time: newArticle.read_time || null,
      published_at: newArticle.published_at || null,
      order_index: articles.length,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setArticles([...articles, article]);
    setNewArticle({ title: "", description: "", image_url: "", url: "", read_time: "", published_at: "" });
    setHasChanges(true);
    toast.success("Artigo adicionado! Clique em Salvar para aplicar.");
  };

  const removeArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
    setHasChanges(true);
  };

  // Salvar TUDO
  const handleSave = async () => {
    if (!profileData.slug) {
      toast.error("Slug é obrigatório");
      return;
    }

    if (profileData.slug.length < 3) {
      toast.error("Slug deve ter pelo menos 3 caracteres");
      return;
    }

    setIsSaving(true);
    try {
      const isNewProfile = !profileId;

      // 1. Salvar perfil
      const profileResponse = await fetch("/api/linkbio/profile", {
        method: isNewProfile ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        const error = await profileResponse.json();
        throw new Error(error.error || "Erro ao salvar perfil");
      }

      const savedProfile = await profileResponse.json();
      
      if (isNewProfile && savedProfile?.id) {
        setProfileId(savedProfile.id);
      }

      // 2. Salvar links (criar novos, deletar removidos)
      for (const link of links) {
        if (link.id.startsWith("new-")) {
          // Criar novo link
          await fetch("/api/linkbio/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: link.title,
              description: link.description,
              url: link.url,
              icon: link.icon,
              link_type: link.link_type,
              order_index: link.order_index,
            }),
          });
        } else {
          // Atualizar link existente
          await fetch(`/api/linkbio/links/${link.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: link.title,
              description: link.description,
              url: link.url,
              icon: link.icon,
              link_type: link.link_type,
              is_active: link.is_active,
              order_index: link.order_index,
            }),
          });
        }
      }

      // 3. Salvar artigos
      for (const article of articles) {
        if (article.id.startsWith("new-")) {
          await fetch("/api/linkbio/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: article.title,
              description: article.description,
              image_url: article.image_url,
              url: article.url,
              read_time: article.read_time,
              published_at: article.published_at,
              order_index: article.order_index,
            }),
          });
        } else {
          await fetch(`/api/linkbio/articles/${article.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: article.title,
              description: article.description,
              image_url: article.image_url,
              url: article.url,
              read_time: article.read_time,
              published_at: article.published_at,
              is_active: article.is_active,
            }),
          });
        }
      }

      // Recarregar dados
      const refreshResponse = await fetch("/api/linkbio/profile");
      if (refreshResponse.ok) {
        const refreshedProfile = await refreshResponse.json();
        if (refreshedProfile) {
          setLinks(refreshedProfile.links || []);
          setArticles(refreshedProfile.articles || []);
        }
      }

      toast.success("Tudo salvo com sucesso!");
      setHasChanges(false);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview Profile
  const previewProfile: ProfileWithLinks = {
    id: profileId || "preview",
    user_id: initialProfile?.user_id || "preview",
    slug: profileData.slug,
    display_name: profileData.display_name,
    professional_title: profileData.professional_title,
    subtitle: profileData.subtitle,
    bio: profileData.bio,
    avatar_url: profileData.avatar_url,
    cover_color: profileData.cover_color,
    theme: profileData.theme,
    badges: profileData.badges,
    social_links: profileData.social_links,
    footer_text: profileData.footer_text,
    footer_subtext: profileData.footer_subtext,
    is_active: true,
    created_at: initialProfile?.created_at || "",
    updated_at: initialProfile?.updated_at || "",
    links,
    articles,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Editor Panel - Scrollable */}
      <div className="w-[60%] flex flex-col border-r bg-background overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b bg-card flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold">Editor do Link na Bio</h1>
            <p className="text-muted-foreground text-lg">
              Edite e veja as alterações em tempo real
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className={cn(
              "min-w-[120px]",
              hasChanges && "bg-primary animate-pulse"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : hasChanges ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Tudo
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Salvo
              </>
            )}
          </Button>
        </div>

        {/* Editor Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <Accordion type="multiple" defaultValue={["profile", "theme", "links"]} className="space-y-5">
              
              {/* PERFIL */}
              <AccordionItem value="profile" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Informações do Perfil</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Slug (URL)</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground text-base">
                          /
                        </span>
                        <Input
                          value={profileData.slug}
                          onChange={(e) =>
                            updateProfile({
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                            })
                          }
                          placeholder="seu-nome"
                          className="rounded-l-none h-14 text-xl"
                          disabled={!!profileId}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nome de Exibição</Label>
                      <Input
                        value={profileData.display_name}
                        onChange={(e) => updateProfile({ display_name: e.target.value })}
                        placeholder="Seu Nome"
                        className="h-11 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Título Profissional</Label>
                      <Input
                        value={profileData.professional_title}
                        onChange={(e) => updateProfile({ professional_title: e.target.value })}
                        placeholder="Psicóloga Clínica"
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subtítulo</Label>
                      <Input
                        value={profileData.subtitle}
                        onChange={(e) => updateProfile({ subtitle: e.target.value })}
                        placeholder="Especialidades"
                        className="h-11 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Bio</Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      placeholder="Uma breve descrição sobre você..."
                      rows={3}
                      className="resize-none text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">URL da Foto</Label>
                    <Input
                      value={profileData.avatar_url}
                      onChange={(e) => updateProfile({ avatar_url: e.target.value })}
                      placeholder="https://..."
                      className="h-11 text-base"
                    />
                  </div>

                  {/* Badges */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Badges / Credenciais</Label>
                    <div className="flex gap-3">
                      <Input
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        placeholder="Ex: Certificado"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                        className="h-11 text-base"
                      />
                      <Button size="default" onClick={addBadge} className="h-11 px-4">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    {profileData.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profileData.badges.map((badge, i) => (
                          <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3 pr-2">
                            {badge}
                            <button onClick={() => removeBadge(badge)} className="ml-2 hover:text-destructive">
                              <X className="w-5 h-5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Texto do Footer</Label>
                      <Input
                        value={profileData.footer_text}
                        onChange={(e) => updateProfile({ footer_text: e.target.value })}
                        placeholder="Aceitando novos pacientes"
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subtexto</Label>
                      <Input
                        value={profileData.footer_subtext}
                        onChange={(e) => updateProfile({ footer_subtext: e.target.value })}
                        placeholder="CRP 06/123456"
                        className="h-11 text-base"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* TEMA E CORES */}
              <AccordionItem value="theme" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Tema e Cores</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-6">
                  {/* Preset Colors */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Temas Prontos</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyPresetColor(preset)}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all hover:scale-105",
                            profileData.theme.primaryColor === preset.primary
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-gray-300"
                          )}
                          style={{ backgroundColor: preset.bg }}
                        >
                          <div
                            className="w-full h-8 rounded-md mb-2"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="text-sm font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cor Principal</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-11 h-11 rounded-lg border shadow-sm cursor-pointer"
                          style={{ backgroundColor: profileData.theme.primaryColor }}
                        />
                        <Input
                          type="color"
                          value={profileData.theme.primaryColor}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="w-full h-11 p-1.5 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cor de Fundo</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-11 h-11 rounded-lg border shadow-sm"
                          style={{ backgroundColor: profileData.theme.backgroundColor }}
                        />
                        <Input
                          type="color"
                          value={profileData.theme.backgroundColor}
                          onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                          className="w-full h-11 p-1.5 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cor do Header</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-11 h-11 rounded-lg border shadow-sm"
                          style={{ backgroundColor: profileData.cover_color }}
                        />
                        <Input
                          type="color"
                          value={profileData.cover_color}
                          onChange={(e) => updateProfile({ cover_color: e.target.value })}
                          className="w-full h-11 p-1.5 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Button Style */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Estilo dos Botões</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {(["rounded", "square", "pill"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => updateTheme({ buttonStyle: style })}
                          className={cn(
                            "py-3 px-4 border-2 transition-all text-sm font-medium",
                            style === "rounded" && "rounded-xl",
                            style === "square" && "rounded-md",
                            style === "pill" && "rounded-full",
                            profileData.theme.buttonStyle === style
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-muted hover:border-gray-300"
                          )}
                        >
                          {style === "rounded" ? "Arredondado" : style === "square" ? "Quadrado" : "Pílula"}
                        </button>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* LINKS */}
              <AccordionItem value="links" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Links ({links.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-5">
                  {/* Add Link */}
                  <Card className="border-dashed">
                    <CardContent className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          placeholder="Título"
                          className="h-11 text-base"
                        />
                        <Input
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                          placeholder="https://..."
                          className="h-11 text-base"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          value={newLink.description}
                          onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                          placeholder="Descrição"
                          className="h-11 text-base"
                        />
                        <Select
                          value={newLink.link_type}
                          onValueChange={(v) => setNewLink({ ...newLink, link_type: v as LinkType })}
                        >
                          <SelectTrigger className="h-11 text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primário</SelectItem>
                            <SelectItem value="secondary">Secundário</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={newLink.icon}
                          onValueChange={(v) => setNewLink({ ...newLink, icon: v })}
                        >
                          <SelectTrigger className="h-11 text-base">
                            <SelectValue placeholder="Ícone" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((icon) => (
                              <SelectItem key={icon.value} value={icon.value}>
                                <div className="flex items-center gap-2">
                                  <icon.icon className="w-5 h-5" />
                                  <span className="text-sm">{icon.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addLink} size="default" className="w-full h-14 text-xl">
                        <Plus className="w-6 h-6 mr-2" />
                        Adicionar Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Links List */}
                  {links.length > 0 && (
                    <div className="space-y-3">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border",
                            link.link_type === "primary"
                              ? "bg-primary/5 border-primary/20"
                              : "bg-muted/50"
                          )}
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{link.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                          </div>
                          <Badge variant={link.link_type === "primary" ? "default" : "secondary"} className="text-base">
                            {link.link_type === "primary" ? "CTA" : "Link"}
                          </Badge>
                          <Switch
                            checked={link.is_active}
                            onCheckedChange={() => toggleLinkActive(link.id)}
                          />
                          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => removeLink(link.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* REDES SOCIAIS */}
              <AccordionItem value="social" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Redes Sociais ({profileData.social_links.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-5">
                  <div className="flex gap-4">
                    <Select
                      value={newSocialLink.platform}
                      onValueChange={(v) => setNewSocialLink({ ...newSocialLink, platform: v as any })}
                    >
                      <SelectTrigger className="w-44 h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <div className="flex items-center gap-2">
                              <p.icon className="w-5 h-5" />
                              <span className="text-sm">{p.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 h-14 text-xl"
                    />
                    <Button size="default" onClick={addSocialLink} className="h-11 px-4">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  {profileData.social_links.length > 0 && (
                    <div className="space-y-3">
                      {profileData.social_links.map((social) => {
                        const platform = socialPlatforms.find((p) => p.value === social.platform);
                        const Icon = platform?.icon || Globe;
                        return (
                          <div key={social.platform} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                            <Icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{platform?.label}</span>
                            <span className="text-xs text-muted-foreground flex-1 truncate">{social.url}</span>
                            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => removeSocialLink(social.platform)}>
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* ARTIGOS */}
              <AccordionItem value="articles" className="border rounded-lg bg-card">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileImage className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-base">Artigos ({articles.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-5">
                  <Card className="border-dashed">
                    <CardContent className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={newArticle.title}
                          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                          placeholder="Título"
                          className="h-11 text-base"
                        />
                        <Input
                          value={newArticle.url}
                          onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                          placeholder="URL do artigo"
                          className="h-11 text-base"
                        />
                      </div>
                      <Input
                        value={newArticle.description}
                        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                        placeholder="Descrição"
                        className="h-11 text-base"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          value={newArticle.image_url}
                          onChange={(e) => setNewArticle({ ...newArticle, image_url: e.target.value })}
                          placeholder="URL da imagem"
                          className="h-11 text-base"
                        />
                        <Input
                          value={newArticle.read_time}
                          onChange={(e) => setNewArticle({ ...newArticle, read_time: e.target.value })}
                          placeholder="5 min"
                          className="h-11 text-base"
                        />
                        <Input
                          type="date"
                          value={newArticle.published_at}
                          onChange={(e) => setNewArticle({ ...newArticle, published_at: e.target.value })}
                          className="h-11 text-base"
                        />
                      </div>
                      <Button onClick={addArticle} size="default" className="w-full h-14 text-xl">
                        <Plus className="w-6 h-6 mr-2" />
                        Adicionar Artigo
                      </Button>
                    </CardContent>
                  </Card>

                  {articles.length > 0 && (
                    <div className="space-y-3">
                      {articles.map((article) => (
                        <div key={article.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                            {article.image_url ? (
                              <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FileImage className="w-7 h-7" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.read_time || "Sem tempo"}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => removeArticle(article.id)}>
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Preview Panel - Fixed */}
      <div className="w-[40%] flex flex-col bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 sticky top-0 h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">Preview ao Vivo</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Smartphone className="w-5 h-5" />
            <span className="text-sm">Mobile</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <LivePreview profile={previewProfile} />
        </div>

        {profileId && (
          <div className="p-4 border-t bg-white/50 backdrop-blur-sm flex-shrink-0">
            <Button
              variant="outline"
              className="w-full h-12 text-lg"
              onClick={() => window.open(`/${profileData.slug}`, "_blank")}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Abrir Página Pública
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
