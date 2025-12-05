"use client";

import Image from "next/image";
import {
  ShoppingBag,
  FileText,
  Link2,
  Zap,
  MessageSquare,
  ImageIcon,
  BarChart3,
  TrendingUp,
  Check,
  Plus,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Star,
  Heart,
  Shield,
  Zap as Lightning,
  Globe,
  Target,
  Rocket,
  Folder,
  Monitor,
  Clock,
  Layers,
  Dock,
  RotateCcw,
  ArrowRight,
  Activity,
  User,
  Server,
  Key,
  Bot,
  GitBranch,
  Package,
  ArrowUpDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function AppSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    home: false,
    settings: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Sidebar style={{ backgroundColor: "color-mix(in srgb, var(--primary) 85%, black)" }}>
      <SidebarHeader style={{ backgroundColor: "color-mix(in srgb, var(--primary) 85%, black)" }}>
        <div className="flex items-center px-2 py-4">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image src="/logo.png" alt="Axolutions Logo" width={32} height={32} className="rounded-lg" />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--primary-foreground)" }}>
              Axolutions
            </h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent style={{ backgroundColor: "color-mix(in srgb, var(--primary) 85%, black)" }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://app.axolutions.com.br"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <ArrowRight
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Voltar para AXOPLATAFORMA
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Home Section */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="font-medium text-xs uppercase tracking-wider mb-3 px-4"
            style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
          >
            Home
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="data-[active=true]:bg-white/15 data-[active=true]:text-white data-[active=true]:rounded-lg"
                >
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <LayoutDashboard
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Dashboard
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <BarChart3
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Análises
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Products Section */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="font-medium text-xs uppercase tracking-wider mb-3 px-4"
            style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
          >
            Produtos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <Globe
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Cosmos
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <FileText
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Blog Admin
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <Link2
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Link na Bio
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <MessageSquare
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Chatbot IA
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="font-medium text-xs uppercase tracking-wider mb-3 px-4"
            style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
          >
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <User
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Conta
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <Star
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Plano
                    </span>
                    <SidebarMenuBadge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Ativo
                    </SidebarMenuBadge>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <Settings
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Configurações
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  >
                    <HelpCircle
                      className="h-4 w-4 group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.7 }}
                    />
                    <span
                      className="font-medium group-hover:opacity-100 transition-colors duration-300"
                      style={{ color: "var(--primary-foreground)", opacity: 0.8 }}
                    >
                      Suporte
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
