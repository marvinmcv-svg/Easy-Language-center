"use client";
import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sun, Moon, MessageCircle, X } from "lucide-react";
import { ElcLogo, ElcWordmark } from "@/components/brand/elc-logo";
import { DEFAULT_CONTACT, whatsappLink } from "@/lib/brand";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#idiomas", label: "Idiomas" },
  { href: "#cursos", label: "Cursos" },
  { href: "#metodo", label: "Método" },
  { href: "#galeria", label: "Galería" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-full border border-border bg-background/70 text-foreground transition-colors hover:bg-accent"
    >
      {mounted && theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = whatsappLink(
    DEFAULT_CONTACT.whatsapp,
    "Hola, quiero información sobre los cursos de Easy Learning Center",
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:py-5">
        {/* Brand */}
        <a
          href="#inicio"
          className="flex items-center gap-3"
          aria-label="Easy Learning Center — Inicio"
        >
          <ElcLogo size={56} />
          <ElcWordmark />
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 xl:flex"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-foreground/80 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-brand-navy/5 hover:text-foreground sm:inline-block"
          >
            Admin
          </Link>
          <ThemeToggle />
          <Button
            asChild
            size="default"
            className="hidden bg-[#25D366] text-white shadow-sm shadow-[#25D366]/30 hover:bg-[#1ebe5d] sm:inline-flex"
          >
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Inscríbete
            </a>
          </Button>

          {/* Mobile sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú"
                className="grid size-10 place-items-center rounded-full border border-border bg-background/70 text-foreground xl:hidden"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-border bg-background p-0"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <SheetTitle className="flex items-center gap-2">
                  <ElcLogo size={48} />
                  <ElcWordmark />
                </SheetTitle>
                <SheetClose
                  aria-label="Cerrar menú"
                  className="grid size-9 place-items-center rounded-full hover:bg-accent"
                >
                  <X className="size-5" />
                </SheetClose>
              </div>
              <nav
                aria-label="Navegación móvil"
                className="elc-scroll flex flex-col gap-1 overflow-y-auto p-4"
              >
                <AnimatePresence>
                  {NAV_LINKS.map((l, idx) => (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * idx }}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
                    >
                      {l.label}
                    </motion.a>
                  ))}
                </AnimatePresence>
                <div className="my-3 h-px bg-border" />
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[#25D366]/30"
                >
                  <MessageCircle className="size-4" />
                  Inscríbete por WhatsApp
                </a>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-2 text-center text-xs text-muted-foreground"
                >
                  Portal Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
