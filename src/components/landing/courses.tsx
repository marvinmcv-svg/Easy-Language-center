"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MessageCircle, Star, Layers } from "lucide-react";
import { LANGUAGES, whatsappLink, DEFAULT_CONTACT } from "@/lib/brand";
import { Flag } from "@/components/brand/flag";
import type { CoursesContent } from "@/lib/content";

export interface CourseItem {
  id: string;
  language: string;
  title: string;
  level: string | null;
  type: string;
  schedule: string | null;
  description: string | null;
  price: string | null;
  priceNote: string | null;
  image: string | null;
  badge: string | null;
  featured: boolean;
  order: number;
}

type Tab = "all" | string;

const LANGUAGE_LABELS: Record<string, { label: string; flagCode: string }> =
  LANGUAGES.reduce(
    (acc, l) => {
      acc[l.code] = { label: l.name, flagCode: l.flagCode };
      return acc;
    },
    {} as Record<string, { label: string; flagCode: string }>,
  );

function flagCodeFor(code: string) {
  return LANGUAGE_LABELS[code]?.flagCode ?? "";
}
function labelFor(code: string) {
  return LANGUAGE_LABELS[code]?.label ?? code;
}

export function Courses({
  courses,
  content,
}: {
  courses: CourseItem[];
  content?: CoursesContent;
}) {
  const eyebrow = content?.eyebrow ?? "Cursos disponibles";
  const title = content?.title ?? "Nuestros cursos";
  const subtitle = content?.subtitle ??
    "Elige el formato que se adapte a ti: clases grupales, privadas, intensivas o para niños.";
  const [tab, setTab] = React.useState<Tab>("all");

  // Build tabs only for languages that have at least one course.
  const availableLangs = React.useMemo(() => {
    const set = new Set(courses.map((c) => c.language));
    return LANGUAGES.filter((l) => set.has(l.code));
  }, [courses]);

  const filtered = React.useMemo(() => {
    if (tab === "all") return courses;
    return courses.filter((c) => c.language === tab);
  }, [tab, courses]);

  return (
    <section
      id="cursos"
      className="elc-section bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy"
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </motion.h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <TabButton
            active={tab === "all"}
            onClick={() => setTab("all")}
            label="Todos"
          />
          {availableLangs.map((l) => (
            <TabButton
              key={l.code}
              active={tab === l.code}
              onClick={() => setTab(l.code)}
              label={l.name}
              flagCode={l.flagCode}
            />
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No hay cursos disponibles para este idioma en este momento.
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  label,
  flagCode,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  flagCode?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-brand-navy bg-brand-navy text-white shadow-sm"
          : "border-border bg-background text-foreground/80 hover:border-brand-navy/40 hover:bg-brand-navy/5"
      }`}
    >
      {flagCode ? <Flag code={flagCode} size={18} /> : <span aria-hidden>✨</span>}
      {label}
    </button>
  );
}

function CourseCard({ course, index }: { course: CourseItem; index: number }) {
  const wa = whatsappLink(
    DEFAULT_CONTACT.whatsapp,
    `Hola, quiero más información sobre el curso: ${course.title} (${labelFor(
      course.language,
    )}). ¿Me pueden ayudar?`,
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-brand-navy/5 text-brand-navy/40">
            <Layers className="size-12" />
          </div>
        )}
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-navy shadow">
            {course.badge}
          </span>
        )}
        {course.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-navy/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star className="size-3 fill-brand-gold text-brand-gold" />
            Destacado
          </span>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-navy backdrop-blur">
          <Flag code={flagCodeFor(course.language)} size={16} />
          {labelFor(course.language)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-lg font-bold leading-snug text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {course.title}
        </h3>
        {course.level && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-red">
            {course.level}
          </p>
        )}
        {course.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {course.description}
          </p>
        )}

        <div className="mt-4 space-y-2 text-sm">
          {course.schedule && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-navy" />
              <span>{course.schedule}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          {course.price && (
            <div className="mb-3">
              <span
                className="text-xl font-extrabold text-brand-navy"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {course.price}
              </span>
              {course.priceNote && (
                <p className="text-xs text-muted-foreground">
                  {course.priceNote}
                </p>
              )}
            </div>
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90"
          >
            <MessageCircle className="size-4" />
            Más información
          </a>
        </div>
      </div>
    </motion.article>
  );
}
