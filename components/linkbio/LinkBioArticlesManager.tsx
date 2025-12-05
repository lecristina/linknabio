"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProfileWithLinks, Article } from "@/types/linkbio";
import { Plus, Trash2, Edit, Calendar, Clock, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface LinkBioArticlesManagerProps {
  profile: ProfileWithLinks;
  onProfileUpdate: (profile: ProfileWithLinks) => void;
}

export function LinkBioArticlesManager({ profile, onProfileUpdate }: LinkBioArticlesManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    url: "",
    read_time: "",
    published_at: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      url: "",
      read_time: "",
      published_at: "",
    });
    setEditingArticle(null);
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description || "",
      image_url: article.image_url || "",
      url: article.url,
      read_time: article.read_time || "",
      published_at: article.published_at ? article.published_at.split("T")[0] : "",
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
      const url = editingArticle
        ? `/api/linkbio/articles/${editingArticle.id}`
        : "/api/linkbio/articles";

      const response = await fetch(url, {
        method: editingArticle ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published_at: formData.published_at || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar artigo");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingArticle ? "Artigo atualizado!" : "Artigo criado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar artigo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/linkbio/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir artigo");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
      toast.success("Artigo excluído!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir artigo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (article: Article) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/linkbio/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !article.is_active }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar artigo");
      }

      const updatedProfile = await response.json();
      onProfileUpdate(updatedProfile);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar artigo");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const articles = profile.articles || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gerenciar Artigos</h3>
          <p className="text-sm text-muted-foreground">
            Adicione artigos e posts do blog para exibir no seu perfil
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
              <DialogDescription>
                Preencha as informações do artigo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Como Lidar com a Ansiedade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Uma breve descrição do artigo..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL do Artigo *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://seublog.com/artigo"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  type="url"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="published_at">Data de Publicação</Label>
                  <Input
                    id="published_at"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    type="date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read_time">Tempo de Leitura</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="Ex: 5 min"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {editingArticle ? "Salvar" : "Criar Artigo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Switch
                    checked={article.is_active}
                    onCheckedChange={() => handleToggleActive(article)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1 line-clamp-1">{article.title}</h4>
                {article.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  {article.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.published_at)}
                    </span>
                  )}
                  {article.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(article)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum artigo adicionado ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Novo Artigo" para adicionar posts do seu blog.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

