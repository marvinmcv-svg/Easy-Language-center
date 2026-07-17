"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LANGUAGES } from "@/lib/brand";
import { Flag } from "@/components/brand/flag";
import type { LanguagesContent } from "@/lib/content";

export function Languages({ content }: { content?: LanguagesContent }) {
  const eyebrow = content?.eyebrow ?? "6 idiomas · 1 academia";
  const title = content?.title ?? "Elige tu próximo idioma";
  const subtitle = content?.subtitle ??
    "Desde el inglés hasta el alemán, te acompañamos en cada paso de tu camino polyglota.";
  return (
    <section
      id="idiomas"
      className="elc-section relative overflow-hidden bg-brand-cream py-16 md:py-24"
    >
      {/* Marquee strip of flags above */}
      <div className="pointer-events-none absolute inset-x-0 top-0 select-none overflow-hidden opacity-25">
        <div className="elc-marquee flex w-max items-center gap-6 py-3">
          {[...LANGUAGES, ...LANGUAGES, ...LANGUAGES].map((l, i) => (
            <Flag key={`marquee-${i}`} code={l.flagCode} size={56} bordered={false} />
          ))}
        </div>
      </div>

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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((lang, i) => (
            <motion.a
              key={lang.code}
              href="#cursos"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${lang.accent}`}
              />
              <div className="flex items-start justify-between">
                <Flag code={lang.flagCode} size={56} bordered />
                <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">
                  {lang.nativeName}
                </span>
              </div>
              <p
                className="mt-6 text-3xl font-extrabold text-brand-navy"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lang.hello}
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground">
                {lang.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {lang.blurb}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-red opacity-0 transition-opacity group-hover:opacity-100">
                Ver cursos <ArrowRight className="size-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
