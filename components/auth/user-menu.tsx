/**
 * Menu do usuário com informações e logout
 */

"use client";

import { useAuth } from "@/lib/auth/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Shield } from "lucide-react";

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return null;
  }

  const initials = (() => {
    const source = (user?.name && user.name.trim()) || (user?.email ? user.email.split("@")[0] : "");
    if (!source) return "U";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      const one = parts[0].replace(/[^\p{L}\p{N}]/gu, "");
      return one.slice(0, 2).toUpperCase();
    }
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    return `${first}${last}`.toUpperCase();
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" id="avatar-trigger" className="relative h-8 w-8 rounded-full hover:bg-white/10">
          <Avatar className="h-8 w-8">
            {user?.avatar ? <AvatarImage src={user.avatar} alt={user?.name || "Usuário"} /> : null}
            <AvatarFallback className="bg-white text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user?.products && user.products.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Meus Acessos</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  {user.products.map((access) => (
                    <DropdownMenuItem key={access.product.id} className="flex-col items-start">
                      <div className="font-medium">{access.product.name}</div>
                      <div className="text-xs text-muted-foreground">{access.role.name}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
