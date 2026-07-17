"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { TeachersContent } from "@/lib/content";

export interface TeacherItem {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image: string | null;
  languages: string | null;
}

export function Teachers({
  teachers,
  content,
}: {
  teachers: TeacherItem[];
  content?: TeachersContent;
}) {
  const eyebrow = content?.eyebrow ?? "Nuestro equipo";
  const title = content?.title ?? "Conoce a tus profesores";
  const subtitle = content?.subtitle ??
    "Docentes apasionados y calificados, listos para guiarte en tu camino polyglota.";
  const items = teachers.length
    ? teachers
    : [
        {
          id: "fallback-1",
          name: "Equipo ELC",
          role: "Profesores calificados",
          bio: "Docentes especializados con experiencia comprobada en enseñanza de idiomas.",
          image: null,
          languages: "Inglés, Italiano, Portugués, Alemán",
        },
      ];

  return (
    <section
      id="profesores"
      className="elc-section bg-brand-cream py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="size-24 rounded-full object-cover ring-4 ring-brand-gold/30"
                  />
                ) : (
                  <div className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-brand-navy to-brand-red text-3xl font-extrabold text-white ring-4 ring-brand-gold/30">
                    <span style={{ fontFamily: "var(--font-display)" }}>
                      {t.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-brand-gold text-brand-navy shadow">
                  <GraduationCap className="size-4" />
                </span>
              </div>
              <h3
                className="mt-4 text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.name}
              </h3>
              {t.role && (
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                  {t.role}
                </p>
              )}
              {t.bio && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.bio}
                </p>
              )}
              {t.languages && (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {t.languages.split(",").map((l) => (
                    <span
                      key={l}
                      className="rounded-full bg-brand-navy/5 px-2.5 py-1 text-xs font-medium text-brand-navy"
                    >
                      {l.trim()}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
