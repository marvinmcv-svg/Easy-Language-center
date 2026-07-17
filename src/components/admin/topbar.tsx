"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LogOut, Menu, Moon, Sun, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS, type TabKey } from "@/components/admin/sidebar";
import type { AdminUser } from "@/components/admin/use-admin-data";
import { SearchTrigger } from "@/components/admin/command-palette";
import { NotificationsBell } from "@/components/admin/notifications-bell";

interface TopbarProps {
  active: TabKey;
  admin: AdminUser;
  onMenuClick: () => void;
  onLogout: () => void;
  loggingOut: boolean;
  onOpenPalette: () => void;
  onNavigate: (tab: TabKey) => void;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Cambiar tema">
        <Sun className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cambiar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}

export function Topbar({
  active,
  admin,
  onMenuClick,
  onLogout,
  loggingOut,
  onOpenPalette,
  onNavigate,
}: TopbarProps) {
  const item = NAV_ITEMS.find((n) => n.key === active);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1
          className="truncate text-lg font-bold tracking-tight text-brand-navy sm:text-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item?.label ?? "Panel"}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {item?.description}
        </p>
      </div>

      <div className="hidden max-w-xs flex-1 md:block">
        <SearchTrigger onClick={onOpenPalette} />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hidden sm:inline-flex"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" />
            Ver sitio
          </Link>
        </Button>

        <NotificationsBell onNavigate={onNavigate} />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-1 pr-2 text-left transition-colors hover:bg-muted"
              aria-label="Menú de cuenta"
            >
              <Avatar className="size-8 border border-border bg-brand-navy">
                <AvatarFallback className="bg-brand-navy text-xs font-bold text-white">
                  {initials(admin.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:block">
                {admin.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{admin.name}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {admin.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onLogout}
              disabled={loggingOut}
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
