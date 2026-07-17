import * as React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { ElcLogo, ElcWordmark } from "@/components/brand/elc-logo";
import { Flag } from "@/components/brand/flag";
import { BRAND, LANGUAGES, DEFAULT_CONTACT } from "@/lib/brand";

export interface FooterConfig {
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  tagline: string;
  description: string;
}

export function Footer({ config }: { config: FooterConfig | null }) {
  const c = config ?? (DEFAULT_CONTACT as unknown as FooterConfig);
  const tagline = c.tagline ?? "Aprende. Practica. Avanza.";
  const description = c.description ??
    "Academia de idiomas en Santa Cruz, Bolivia. Clases presenciales y virtuales con profesores calificados.";
  return (
    <footer className="mt-auto bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <ElcLogo size={56} />
              <ElcWordmark className="text-white" />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {tagline} {description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={c.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Easy Learning Center"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand-red"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href={c.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Easy Learning Center"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand-red"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href={c.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Easy Learning Center"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand-red"
              >
                <span className="text-sm font-bold">TT</span>
              </a>
            </div>
          </div>

          {/* Idiomas */}
          <nav aria-label="Idiomas" className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">
              Idiomas
            </h3>
            <ul className="space-y-2 text-sm">
              {LANGUAGES.map((l) => (
                <li key={l.code}>
                  <a
                    href="#idiomas"
                    className="inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                  >
                    <Flag code={l.flagCode} size={18} />
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cursos */}
          <nav aria-label="Cursos" className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">
              Cursos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#cursos"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Inglés general
                </a>
              </li>
              <li>
                <a
                  href="#cursos"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Curso intensivo
                </a>
              </li>
              <li>
                <a
                  href="#cursos"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Clases privadas
                </a>
              </li>
              <li>
                <a
                  href="#cursos"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Inglés para niños
                </a>
              </li>
              <li>
                <a
                  href="#cursos"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Preparación TOEFL
                </a>
              </li>
              <li>
                <a
                  href="#precios"
                  className="text-white/75 transition-colors hover:text-white"
                >
                  Promociones
                </a>
              </li>
            </ul>
          </nav>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                <span>{c.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {c.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                <a
                  href={`tel:${c.phone2.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {c.phone2}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                <a
                  href={`mailto:${c.email}`}
                  className="transition-colors hover:text-white"
                >
                  {c.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row">
          <p>
            © 2026 {BRAND.name} — {BRAND.city}. Todos los derechos reservados.
          </p>
          <Link
            href="/admin"
            className="text-white/45 underline-offset-2 transition-colors hover:text-white/80 hover:underline"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
