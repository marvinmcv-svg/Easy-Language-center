"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, TrendingUp } from "lucide-react";
import { STEPS } from "@/lib/brand";
import type { MethodContent } from "@/lib/content";

const ICONS = [BookOpen, MessageCircle, TrendingUp] as const;

export function Method({ content }: { content?: MethodContent }) {
  const eyebrow = content?.eyebrow ?? "Nuestro método";
  const title = content?.title ?? "Aprende. Practica. Avanza.";
  const steps = content?.steps ?? STEPS;
  return (
    <section
      id="metodo"
      className="elc-section relative overflow-hidden bg-brand-navy py-16 text-white md:py-24"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-gold"
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </motion.h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">
            Una metodología probada en tres pasos para que domines el idioma de
            forma natural y duradera.
          </p>
        </div>

        <div className="relative grid gap-10 md:grid-cols-3">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[58px] hidden h-px bg-gradient-to-r from-transparent via-white/25 to-transparent md:block" />

          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 grid size-28 place-items-center rounded-full border-4 border-brand-navy bg-gradient-to-br from-brand-red to-brand-navy shadow-xl">
                  <Icon className="size-9 text-white" />
                  <span
                    className="absolute -right-2 -top-2 grid size-9 place-items-center rounded-full bg-brand-gold text-sm font-extrabold text-brand-navy shadow-md"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                </div>
                <h3
                  className="mt-6 text-2xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
