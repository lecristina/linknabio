"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProfileWithLinks, Link, LinkType } from "@/types/linkbio";
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Phone,
  Heart,
  Video,
  BookOpen,
  FileText,
  Mail,
  Globe,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

interface LinkBioLinksManagerProps {
  profile: ProfileWithLinks;
  onProfileUpdate: (profile: ProfileWithLinks) => void;
}

const iconOptions = [
  { value: "calendar", label: "Calendário", icon: Calendar },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "heart", label: "Coração", icon: Heart },
  { value: "video", label: "Vídeo", icon: Video },
  { value: "book", label: "Livro", icon: BookOpen },
  { value: "file", label: "Arquivo", icon: FileText },
  { value: "mail", label: "Email", icon: Mail },
  { value: "globe", label: "Website", icon: Globe },
];

const linkTypes: { value: LinkType; label: string; description: string }[] = [
  { value: "primary", label: "Primário (Destacado)", description: "Botão colorido em destaque" },
  { value: "secondary", label: "Secundário", description: "Botão branco com borda" },
];

export function LinkBioLinksManager({ profile, onProfileUpdate }: LinkBioLinksManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    icon: "",
    link_type: "secondary" as LinkType,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      icon: "",
      link_type: "secondary",
    });
    setEditingLink(null);
  };

  const openEditDialog = (link: Link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      description: link.description || "",
      url: link.url,
      icon: link.icon || "",
      link_type: link.link_type as LinkType,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.url) {
      toast.error("Título e URL são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const url = editingLink
        ? `/api/linkbio/links/${editingLink.id}`
        : "/api/linkbio/links";

      const response = await fetch(url, {
        method: editingLink ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar link");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingLink ? "Link atualizado!" : "Link criado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/linkbio/links/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir link");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
      toast.success("Link excluído!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (link: Link) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/linkbio/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !link.is_active }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar link");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar link");
    } finally {
      setIsLoading(false);
    }
  };

  const primaryLinks = profile.links.filter((l) => l.link_type === "primary");
  const secondaryLinks = profile.links.filter((l) => l.link_type === "secondary");

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const iconOption = iconOptions.find((i) => i.value === iconName);
    if (!iconOption) return null;
    const Icon = iconOption.icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gerenciar Links</h3>
          <p className="text-sm text-muted-foreground">
            Adicione e organize os links do seu perfil
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLink ? "Editar Link" : "Novo Link"}</DialogTitle>
              <DialogDescription>
                Preencha as informações do link
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Agendar Consulta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Marque sua primeira sessão"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Link</Label>
                  <Select
                    value={formData.link_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, link_type: value as LinkType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <icon.icon className="w-4 h-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {editingLink ? "Salvar" : "Criar Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Primary Links */}
      {primaryLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links Primários (Destacados)</CardTitle>
            <CardDescription>
              Links em destaque que aparecem com cor de fundo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {primaryLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  {renderIcon(link.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{link.title}</p>
                  {link.description && (
                    <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={() => handleToggleActive(link)}
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(link)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(link.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Secondary Links */}
      {secondaryLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links Secundários</CardTitle>
            <CardDescription>
              Links com fundo branco que aparecem na seção "Recursos e Contato"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {secondaryLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                  {renderIcon(link.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{link.title}</p>
                  {link.description && (
                    <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={() => handleToggleActive(link)}
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(link)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(link.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profile.links.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum link adicionado ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Novo Link" para adicionar seu primeiro link.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
