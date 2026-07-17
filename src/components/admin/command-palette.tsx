"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Image as ImageIcon,
  Star,
  Users,
  Settings,
  FileText,
  Activity,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { TabKey } from "./sidebar";

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "dashboard", label: "Panel", icon: LayoutDashboard, desc: "Resumen y estadísticas" },
  { key: "courses", label: "Cursos", icon: BookOpen, desc: "Gestionar cursos" },
  { key: "leads", label: "Mensajes / Leads", icon: Inbox, desc: "Solicitudes de contacto" },
  { key: "content", label: "Contenido del sitio", icon: FileText, desc: "Editar textos del sitio" },
  { key: "media", label: "Medios", icon: ImageIcon, desc: "Biblioteca de imágenes" },
  { key: "testimonials", label: "Testimonios", icon: Star, desc: "Opiniones de estudiantes" },
  { key: "teachers", label: "Profesores", icon: Users, desc: "Equipo docente" },
  { key: "activity", label: "Actividad", icon: Activity, desc: "Registro de cambios" },
  { key: "settings", label: "Ajustes", icon: Settings, desc: "Configuración del sitio" },
];

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate: (tab: TabKey) => void;
  onLogout: () => void;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  function go(tab: TabKey) {
    onOpenChange(false);
    onNavigate(tab);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Busca acciones o ve a una sección…" />
      <CommandList className="elc-scroll">
        <CommandEmpty>No hay resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.key}
              value={`${item.label} ${item.desc}`}
              onSelect={() => go(item.key)}
            >
              <item.icon className="mr-2 size-4 text-brand-navy" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem
            value="ver sitio público"
            onSelect={() => {
              onOpenChange(false);
              window.open("/", "_blank");
            }}
          >
            <ExternalLink className="mr-2 size-4 text-brand-navy" />
            Ver sitio público
          </CommandItem>
          <CommandItem
            value="cambiar tema claro oscuro"
            onSelect={() => {
              onOpenChange(false);
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? (
              <Sun className="mr-2 size-4 text-brand-gold" />
            ) : (
              <Moon className="mr-2 size-4 text-brand-navy" />
            )}
            Cambiar tema ({theme === "dark" ? "Claro" : "Oscuro"})
          </CommandItem>
          <CommandItem
            value="cerrar sesión logout"
            onSelect={() => {
              onOpenChange(false);
              onLogout();
            }}
          >
            <LogOut className="mr-2 size-4 text-destructive" />
            Cerrar sesión
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Hook that binds ⌘K / Ctrl+K to open the palette. */
export function useCommandPaletteToggle(onToggle: () => void) {
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onToggle();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggle]);
}

export function SearchTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:w-56"
    >
      <Search className="size-4" />
      <span className="hidden sm:inline">Buscar…</span>
      <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
