"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LinkBioLinksManager } from "./LinkBioLinksManager";
import { LinkBioArticlesManager } from "./LinkBioArticlesManager";
import { LinkBioPreview } from "./LinkBioPreview";
import type { ProfileWithLinks, SocialLink } from "@/types/linkbio";
import {
  Save,
  ExternalLink,
  Copy,
  Plus,
  X,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Github,
  MessageCircle,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LinkBioDashboardProps {
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

export function LinkBioDashboard({ initialProfile }: LinkBioDashboardProps) {
  const [profile, setProfile] = useState<ProfileWithLinks | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: profile?.slug || "",
    display_name: profile?.display_name || "",
    professional_title: profile?.professional_title || "",
    subtitle: profile?.subtitle || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
    cover_color: profile?.cover_color || "#87CEEB",
    badges: profile?.badges || [],
    social_links: profile?.social_links || [],
    footer_text: profile?.footer_text || "",
    footer_subtext: profile?.footer_subtext || "",
  });

  const [newBadge, setNewBadge] = useState("");
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "website",
    url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        slug: profile.slug || "",
        display_name: profile.display_name || "",
        professional_title: profile.professional_title || "",
        subtitle: profile.subtitle || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        cover_color: profile.cover_color || "#87CEEB",
        badges: profile.badges || [],
        social_links: profile.social_links || [],
        footer_text: profile.footer_text || "",
        footer_subtext: profile.footer_subtext || "",
      });
    }
  }, [profile]);

  const handleCreateProfile = async () => {
    if (!formData.slug) {
      toast.error("Slug é obrigatório");
      return;
    }

    if (formData.slug.length < 3) {
      toast.error("Slug deve ter pelo menos 3 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/linkbio/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Erro ao criar perfil: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        let errorMessage = data?.error || data?.message;
        if (errorMessage?.includes("já está em uso") || errorMessage?.includes("duplicate")) {
          errorMessage = `O slug "${formData.slug}" já está em uso. Escolha outro slug.`;
        } else if (!errorMessage) {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setProfile(data);
      toast.success("Perfil criado com sucesso!");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(error.message || "Erro ao criar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/linkbio/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar perfil");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: ProfileWithLinks) => {
    setProfile(updatedProfile);
  };

  const copyProfileUrl = () => {
    if (!profile) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${profile.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("URL copiada para a área de transferência!");
    }
  };

  const addBadge = () => {
    if (!newBadge.trim()) return;
    if (formData.badges.includes(newBadge.trim())) {
      toast.error("Badge já existe");
      return;
    }
    setFormData({
      ...formData,
      badges: [...formData.badges, newBadge.trim()],
    });
    setNewBadge("");
  };

  const removeBadge = (badge: string) => {
    setFormData({
      ...formData,
      badges: formData.badges.filter((b) => b !== badge),
    });
  };

  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) return;
    const exists = formData.social_links.some(
      (s) => s.platform === newSocialLink.platform
    );
    if (exists) {
      toast.error("Esta rede social já foi adicionada");
      return;
    }
    setFormData({
      ...formData,
      social_links: [...formData.social_links, { ...newSocialLink }],
    });
    setNewSocialLink({ platform: "website", url: "" });
  };

  const removeSocialLink = (platform: string) => {
    setFormData({
      ...formData,
      social_links: formData.social_links.filter((s) => s.platform !== platform),
    });
  };

  if (!profile) {
    return (
      <div className="container py-8 max-w-4xl">
        <PageTitle
          title="Criar Link na Bio"
          subtitle="Configure seu perfil de link na bio"
        />

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Preencha as informações básicas para criar seu link na bio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL personalizada) *</Label>
              <div className="flex gap-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  {typeof window !== "undefined" ? window.location.origin : ""}/
                </div>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  placeholder="seu-nome"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas letras minúsculas, números e hífens
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name">Nome de Exibição</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Ex: Dra. Ana Carolina Silva"
              />
            </div>

            {/* Professional Title */}
            <div className="space-y-2">
              <Label htmlFor="professional_title">Título Profissional</Label>
              <Input
                id="professional_title"
                value={formData.professional_title}
                onChange={(e) => setFormData({ ...formData, professional_title: e.target.value })}
                placeholder="Ex: Psicóloga Clínica"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo / Especialidades</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ex: Ansiedade, Depressão e Trauma"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Descrição</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Uma breve descrição sobre você e seus serviços..."
                rows={4}
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://exemplo.com/sua-foto.jpg"
                type="url"
              />
            </div>

            <Button onClick={handleCreateProfile} disabled={isLoading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Criar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <PageTitle
        title="Gerenciar Link na Bio"
        subtitle="Configure seu perfil, links e artigos"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyProfileUrl}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar URL
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/${profile.slug}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="articles">Artigos</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-sm">
                      {typeof window !== "undefined" ? window.location.origin : ""}/
                    </span>
                    <Input value={formData.slug} disabled className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Nome de Exibição</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="Ex: Dra. Ana Carolina Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professional_title">Título Profissional</Label>
                  <Input
                    id="professional_title"
                    value={formData.professional_title}
                    onChange={(e) => setFormData({ ...formData, professional_title: e.target.value })}
                    placeholder="Ex: Psicóloga Clínica"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo / Especialidades</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Ansiedade, Depressão e Trauma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Descrição</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Uma breve descrição..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badges / Credenciais</CardTitle>
                  <CardDescription>
                    Adicione suas credenciais e qualificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="Ex: Psicóloga Licenciada"
                      onKeyDown={(e) => e.key === "Enter" && addBadge()}
                    />
                    <Button onClick={addBadge} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {badge}
                        <button
                          onClick={() => removeBadge(badge)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Footer</CardTitle>
                  <CardDescription>
                    Texto que aparece no rodapé da página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer_text">Texto Principal</Label>
                    <Input
                      id="footer_text"
                      value={formData.footer_text}
                      onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                      placeholder="Ex: Aceitando novos pacientes • Convênios aceitos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer_subtext">Texto Secundário</Label>
                    <Input
                      id="footer_subtext"
                      value={formData.footer_subtext}
                      onChange={(e) => setFormData({ ...formData, footer_subtext: e.target.value })}
                      placeholder="Ex: Licenciada pelo CRP 06/123456"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links">
          <LinkBioLinksManager
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <LinkBioArticlesManager
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Adicione links para suas redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select
                  value={newSocialLink.platform}
                  onValueChange={(value) =>
                    setNewSocialLink({ ...newSocialLink, platform: value as any })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <platform.icon className="w-4 h-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newSocialLink.url}
                  onChange={(e) =>
                    setNewSocialLink({ ...newSocialLink, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button onClick={addSocialLink} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {formData.social_links.map((social) => {
                  const platform = socialPlatforms.find((p) => p.value === social.platform);
                  const Icon = platform?.icon || Globe;
                  return (
                    <div
                      key={social.platform}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{platform?.label}</span>
                      <span className="text-muted-foreground text-sm flex-1 truncate">
                        {social.url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(social.platform)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Redes Sociais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <LinkBioPreview profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
