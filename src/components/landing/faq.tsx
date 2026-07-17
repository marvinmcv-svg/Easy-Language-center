"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, whatsappLink, DEFAULT_CONTACT } from "@/lib/brand";
import { MessageCircle } from "lucide-react";
import type { FaqContent } from "@/lib/content";

export function Faq({ content }: { content?: FaqContent }) {
  const eyebrow = content?.eyebrow ?? "Preguntas frecuentes";
  const title = content?.title ?? "Resolvemos tus dudas";
  const subtitle = content?.subtitle ??
    "Resolvemos las preguntas más comunes antes de empezar tu próximo idioma. Si necesitas más info, escríbenos por WhatsApp.";
  const ctaLabel = content?.ctaLabel ?? "Preguntar por WhatsApp";
  const items = content?.items ?? FAQS;
  const wa = whatsappLink(
    DEFAULT_CONTACT.whatsapp,
    "Hola, tengo una pregunta sobre los cursos de Easy Learning Center",
  );

  return (
    <section
      id="faq"
      className="elc-section bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Left intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
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
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#25D366]/30 transition-colors hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="size-4" />
              {ctaLabel}
            </a>
          </div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            <Accordion type="single" collapsible className="w-full">
              {items.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-brand-navy hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
