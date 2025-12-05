"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Info, Loader2, TriangleAlert, User } from "lucide-react";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
      </div>
      <div className="rounded-lg border bg-card">
        <div className="p-4 md:p-6 space-y-6">{children}</div>
      </div>
    </section>
  );
}

function Code({ code }: { code: string }) {
  const { toast } = useToast();
  return (
    <div className="relative rounded-md border bg-muted/40">
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="secondary"
        className="absolute top-2 right-2"
        onClick={() => {
          navigator.clipboard.writeText(code);
          toast({ description: "Código copiado!" });
        }}
      >
        Copiar
      </Button>
    </div>
  );
}

export default function DesignSystemPage() {
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const { toast } = useToast();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-10">
      <Toaster />
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Design System Showcase</h1>
        <p className="text-muted-foreground">
          Componentes, fundações e exemplos de uso para desenvolvimento consistente.
        </p>
      </header>

      <div className="grid gap-10">
        <Section title="Botões" description="Variações de botões e estados.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="ghost">Terciário</Button>
            <Button variant="outline">Outline</Button>
            <Button disabled>Disabled</Button>
            <Button
              onClick={() => {
                setIsLoadingBtn(true);
                setTimeout(() => setIsLoadingBtn(false), 1200);
              }}
            >
              {isLoadingBtn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoadingBtn ? "Carregando" : "Com Loading"}
            </Button>
            <Button size="sm">Pequeno</Button>
            <Button size="lg">Grande</Button>
            <Button>
              <User className="mr-2 h-4 w-4" /> Com ícone
            </Button>
          </div>
          <Code
            code={`<Button>Primário</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Terciário</Button>
<Button disabled>Disabled</Button>
<Button>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}Salvar</Button>`}
          />
        </Section>

        <Section title="Formulários" description="Campos de entrada e seleção.">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Texto</label>
              <Input placeholder="Digite aqui" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="nome@empresa.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea placeholder="Escreva sua mensagem" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Seleção</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Opções</SelectLabel>
                    <SelectItem value="1">Opção 1</SelectItem>
                    <SelectItem value="2">Opção 2</SelectItem>
                    <SelectItem value="3">Opção 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Code
            code={`<Input placeholder="Digite aqui" />
<Input type="email" placeholder="nome@empresa.com" />
<Textarea placeholder="Escreva sua mensagem" />
<Select>...</Select>`}
          />
        </Section>

        <Section title="Cards" description="Agrupamento de conteúdo.">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Título do Card</CardTitle>
                <CardDescription>Descrição breve.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Conteúdo do card com texto simples.</p>
                <Badge>Etiqueta</Badge>
              </CardContent>
              <CardFooter>
                <Button size="sm">Ação</Button>
              </CardFooter>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Variação</CardTitle>
                <CardDescription>Borda tracejada.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Card Emphasys</CardTitle>
                <CardDescription>Com fundo sutil.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Perfeito para destaque de informações.</p>
              </CardContent>
            </Card>
          </div>
          <Code
            code={`<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>`}
          />
        </Section>

        <Section title="Tipografia" description="Escala tipográfica base.">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Heading 1</h1>
            <h2 className="text-2xl font-semibold">Heading 2</h2>
            <h3 className="text-xl font-semibold">Heading 3</h3>
            <p className="text-base">Body text padrão.</p>
            <p className="text-sm text-muted-foreground">Legenda e textos secundários.</p>
            <span className="text-xs uppercase tracking-wider">Caption pequena</span>
          </div>
          <Code
            code={`<h1 className="text-3xl font-bold">Heading 1</h1>
<p className="text-sm text-muted-foreground">Legenda</p>`}
          />
        </Section>

        <Section title="Paleta de cores" description="Cores de marca e de estados.">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              ["primary", "bg-primary text-primary-foreground"],
              ["secondary", "bg-secondary text-secondary-foreground"],
              ["muted", "bg-muted text-muted-foreground"],
              ["destructive", "bg-destructive text-destructive-foreground"],
              ["success", "bg-emerald-500 text-white"],
              ["warning", "bg-amber-500 text-white"],
            ].map(([name, cls]) => (
              <div key={name} className="space-y-1">
                <div className={`h-16 rounded-md border flex items-center justify-center ${cls as string}`}>{name}</div>
                <p className="text-xs text-muted-foreground">.{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Espaçamentos e Grid" description="Exemplos de layout responsivo.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted" />
              ))}
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {[4, 6, 8, 10, 12].map((s) => (
                <div key={s} className="rounded bg-muted text-xs px-2 py-1">
                  gap-{s}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Ícones" description="Conjunto de ícones em uso (Lucide).">
          <div className="flex flex-wrap items-center gap-4">
            <User className="h-6 w-6" />
            <Check className="h-6 w-6" />
            <Info className="h-6 w-6" />
            <AlertCircle className="h-6 w-6" />
            <TriangleAlert className="h-6 w-6" />
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <Code code={`import { User, Check, Info } from 'lucide-react'`} />
        </Section>

        <Section title="Navegação" description="Componentes de navegação.">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Início</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Biblioteca</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Design System</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Tabs defaultValue="conta" className="w-full">
              <TabsList>
                <TabsTrigger value="conta">Conta</TabsTrigger>
                <TabsTrigger value="senha">Senha</TabsTrigger>
              </TabsList>
              <TabsContent value="conta">Conteúdo da conta</TabsContent>
              <TabsContent value="senha">Conteúdo da senha</TabsContent>
            </Tabs>
          </div>
        </Section>

        <Section title="Feedback" description="Alertas, toasts e modais.">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Informação</AlertTitle>
                <AlertDescription>Exemplo de alerta informativo.</AlertDescription>
              </Alert>
              <Alert className="border-emerald-500/30">
                <Check className="h-4 w-4 text-emerald-600" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>Ação concluída com sucesso.</AlertDescription>
              </Alert>
              <Alert className="border-amber-500/30">
                <TriangleAlert className="h-4 w-4 text-amber-600" />
                <AlertTitle>Aviso</AlertTitle>
                <AlertDescription>Verifique os dados informados.</AlertDescription>
              </Alert>
              <Alert className="border-destructive/30">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Algo deu errado. Tente novamente.</AlertDescription>
              </Alert>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() =>
                  toast({
                    title: "Ação realizada",
                    description: "Este é um exemplo de toast.",
                    action: <ToastAction altText="Desfazer">Desfazer</ToastAction>,
                  })
                }
              >
                Mostrar toast
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Abrir modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Título do Modal</DialogTitle>
                    <DialogDescription>Este é um exemplo de modal utilizando o componente Dialog.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <p>Conteúdo do modal...</p>
                    <Button>Confirmar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Section>

        <Section title="Loading e Skeletons" description="Indicadores de carregamento.">
          <div className="flex items-center gap-4">
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando
            </Button>
            <div className="w-full max-w-sm space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
