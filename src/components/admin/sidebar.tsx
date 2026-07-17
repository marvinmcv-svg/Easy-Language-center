"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Settings,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ElcLogo } from "@/components/brand/elc-logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type TabKey =
  | "dashboard"
  | "courses"
  | "leads"
  | "content"
  | "media"
  | "testimonials"
  | "teachers"
  | "activity"
  | "settings";

interface NavItem {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Panel",
    icon: LayoutDashboard,
    description: "Resumen general",
  },
  {
    key: "courses",
    label: "Cursos",
    icon: BookOpen,
    description: "Gestiona la oferta académica",
  },
  {
    key: "leads",
    label: "Mensajes",
    icon: Inbox,
    description: "Solicitudes de contacto",
  },
  {
    key: "content",
    label: "Contenido",
    icon: FileText,
    description: "Editar textos del sitio",
  },
  {
    key: "media",
    label: "Medios",
    icon: ImageIcon,
    description: "Biblioteca de imágenes",
  },
  {
    key: "testimonials",
    label: "Testimonios",
    icon: Star,
    description: "Opiniones de estudiantes",
  },
  {
    key: "teachers",
    label: "Profesores",
    icon: Users,
    description: "Equipo docente",
  },
  {
    key: "activity",
    label: "Actividad",
    icon: Activity,
    description: "Registro de cambios",
  },
  {
    key: "settings",
    label: "Ajustes",
    icon: Settings,
    description: "Configuración del sitio",
  },
];

interface SidebarProps {
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  /** Optional badge counts (e.g., number of new leads). */
  badges?: Partial<Record<TabKey, number>>;
}

function SidebarBody({
  active,
  onSelect,
  badges = {},
}: {
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <ElcLogo size={36} />
        <div className="flex flex-col leading-tight">
          <span
            className="text-base font-extrabold tracking-tight text-brand-navy"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ELC Admin
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Easy Learning Center
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          const badge = badges[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-foreground/80 hover:bg-muted hover:text-brand-navy",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-brand-navy",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {typeof badge === "number" && badge > 0 ? (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-brand-red text-white",
                  )}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-brand-navy"
        >
          <ExternalLink className="size-4" />
          Ver sitio público
        </Link>
      </div>
    </div>
  );
}

export function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onMobileOpenChange,
  badges,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody active={active} onSelect={onSelect} badges={badges} />
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navegación del panel</SheetTitle>
          </SheetHeader>
          <SidebarBody
            active={active}
            onSelect={(t) => {
              onSelect(t);
              onMobileOpenChange(false);
            }}
            badges={badges}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
