"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  Clock,
  Globe,
  MessageCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { whatsappLink } from "@/lib/brand";
import { FlagRow } from "@/components/brand/flag";

export interface HeroConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroEyebrow?: string;
  heroHighlight?: string;
  primaryCta?: string;
  secondaryCta?: string;
  statStudents?: string;
  statStudentsLabel?: string;
  ratingValue?: string;
  whatsapp: string;
}

function highlightTitle(title: string, highlight?: string) {
  if (!highlight) {
    const parts = title.split(/(idioma)/gi);
    return parts.map((p, i) =>
      p.toLowerCase() === "idioma" ? (
        <span key={i} className="text-brand-red">
          {p}
        </span>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    );
  }
  // Highlight the configured word/phrase in brand red.
  const safe = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = title.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === highlight.toLowerCase() ? (
      <span key={i} className="text-brand-red">
        {p}
      </span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

export function Hero({ config }: { config: HeroConfig | null }) {
  const title = config?.heroTitle ?? "Aprende un nuevo idioma hoy";
  const subtitle =
    config?.heroSubtitle ??
    "Clases de inglés, italiano, portugués, francés, alemán y español. Presenciales y virtuales, con profesores calificados y horarios flexibles en Santa Cruz, Bolivia.";
  const eyebrow = config?.heroEyebrow ?? "Santa Cruz, Bolivia · Presencial & Virtual";
  const primaryCta = config?.primaryCta ?? "Ver cursos";
  const secondaryCta = config?.secondaryCta ?? "WhatsApp";
  const statStudents = config?.statStudents ?? "+500";
  const statStudentsLabel = config?.statStudentsLabel ?? "estudiantes felices";
  const ratingValue = config?.ratingValue ?? "4.9/5";
  const wa = whatsappLink(
    config?.whatsapp ?? "+591 77385885",
    "Hola, quiero información sobre los cursos de Easy Learning Center",
  );

  return (
    <section
      id="inicio"
      className="elc-section relative overflow-hidden bg-brand-cream pt-32 pb-16 md:pt-40 md:pb-24"
    >
      <div className="elc-hero-mesh absolute inset-0" aria-hidden />
      {/* Soft decorative circles */}
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-navy shadow-sm backdrop-blur"
          >
            <span className="size-2 rounded-full bg-brand-red" />
            {eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-navy sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {highlightTitle(title, config?.heroHighlight)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg lg:mx-0"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <a
              href="#cursos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 transition-transform hover:-translate-y-0.5 hover:bg-brand-navy/90 sm:w-auto"
            >
              {primaryCta}
              <ArrowRight className="size-4" />
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:-translate-y-0.5 hover:bg-[#1ebe5d] sm:w-auto"
            >
              <MessageCircle className="size-4" />
              {secondaryCta}
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4 lg:max-w-xl"
          >
            {[
              { icon: Globe, label: "6 idiomas" },
              { icon: GraduationCap, label: "Profesores calificados" },
              { icon: Clock, label: "Horarios flexibles" },
              { icon: Users, label: "Grupos pequeños" },
            ].map((b) => (
              <li
                key={b.label}
                className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/60 px-3 py-2 text-xs font-medium text-foreground/80 backdrop-blur"
              >
                <b.icon className="size-4 shrink-0 text-brand-red" />
                {b.label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: hero image with floating accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg"
        >
          {/* Main hero photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-brand-navy/20"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src="/uploads/hero/elc-hero-classroom.png"
                alt="Estudiantes aprendiendo idiomas en Easy Learning Center, Santa Cruz"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Gradient veil for text legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
          </motion.div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute -bottom-5 -left-3 z-10 rounded-2xl border border-border bg-white p-4 shadow-xl sm:-left-5"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl bg-brand-navy text-white">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <p
                  className="text-2xl font-extrabold leading-none text-brand-navy"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  +500
                </p>
                <p className="text-xs text-muted-foreground">estudiantes felices</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 border-t border-border pt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3.5 fill-brand-gold text-brand-gold" />
              ))}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                4.9/5 valoración
              </span>
            </div>
          </motion.div>

          {/* Floating language flags pill */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="absolute -right-2 top-6 z-10 rounded-full border border-border bg-white px-3 py-2 shadow-lg sm:-right-4"
            aria-hidden
          >
            <FlagRow size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
