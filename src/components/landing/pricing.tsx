"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle, Sparkles, Zap, User, type LucideIcon } from "lucide-react";
import { DEFAULT_CONTACT, whatsappLink } from "@/lib/brand";
import type { PricingContent } from "@/lib/content";

interface PromoCard {
  icon?: LucideIcon;
  title: string;
  price: string;
  priceNote?: string;
  note?: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const PROMOS: PromoCard[] = [
  {
    icon: Zap,
    title: "Curso Intensivo de Inglés",
    price: "1000 Bs",
    priceNote: "/mes",
    note: "Lunes a Jueves · 4 días/semana",
    features: [
      "4 clases por semana de 2 horas",
      "Avance acelerado garantizado",
      "Material de estudio incluido",
      "Mínimo 5 estudiantes por grupo",
    ],
    highlight: true,
    cta: "Quiero el intensivo",
  },
  {
    icon: Sparkles,
    title: "20% de descuento",
    price: "−20%",
    priceNote: "esta semana",
    note: "Inscripción anticipada",
    features: [
      "Válido para cursos grupales",
      "Cupos limitados por grupo",
      "Solo por esta semana",
      "Aplica para nuevos estudiantes",
    ],
    cta: "Aprovechar el 20%",
  },
  {
    icon: Check,
    title: "Sin matrícula",
    price: "0 Bs",
    priceNote: "matrícula",
    note: "Inscripciones abiertas todo el año",
    features: [
      "Sin costos ocultos de inscripción",
      "Pago mensual sencillo",
      "Clases privadas o grupales",
      "Portugués e italiano incluidos",
    ],
    cta: "Inscribirme sin matrícula",
  },
  {
    icon: User,
    title: "Clases Privadas",
    price: "Consultar",
    priceNote: "",
    note: "Atención 100% personalizada",
    features: [
      "1 a 1 con profesor especializado",
      "Horarios 100% flexibles",
      "Plan adaptado a tus metas",
      "Presencial u online",
    ],
    cta: "Consultar clases privadas",
  },
];

const PROMO_ICONS: LucideIcon[] = [Zap, Sparkles, Check, User];

export function Pricing({ content }: { content?: PricingContent }) {
  const eyebrow = content?.eyebrow ?? "Promociones";
  const title = content?.title ?? "Inscríbete con los mejores precios";
  const subtitle = content?.subtitle ??
    "Promociones especiales cada mes y descuentos para estudiantes IAESTE. ¡No dejes pasar la oportunidad!";
  const promos = content?.promos ?? PROMOS;
  const iaesteNote = content?.iaesteNote ??
    "¿Eres estudiante IAESTE? Pregunta por nuestro descuento especial al inscribirte.";
  return (
    <section
      id="precios"
      className="elc-section bg-gradient-to-b from-brand-cream to-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full bg-brand-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-red"
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
          {promos.map((promo, i) => {
            const Icon = promo.icon ?? PROMO_ICONS[i % PROMO_ICONS.length] ?? Sparkles;
            const wa = whatsappLink(
              DEFAULT_CONTACT.whatsapp,
              `Hola, quiero información sobre: ${promo.title}. ${promo.cta}.`,
            );
            return (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl border p-6 shadow-sm transition-shadow hover:shadow-xl ${
                  promo.highlight
                    ? "border-brand-red bg-brand-navy text-white"
                    : "border-border bg-card"
                }`}
              >
                {promo.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-navy shadow">
                    Más popular
                  </span>
                )}
                <div
                  className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${
                    promo.highlight
                      ? "bg-white/10 text-brand-gold"
                      : "bg-brand-navy/5 text-brand-navy"
                  }`}
                >
                  <Icon className="size-6" />
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {promo.title}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {promo.price}
                  </span>
                  {promo.priceNote && (
                    <span
                      className={`text-sm ${
                        promo.highlight ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {promo.priceNote}
                    </span>
                  )}
                </div>
                {promo.note && (
                  <p
                    className={`mt-1 text-xs ${
                      promo.highlight ? "text-white/60" : "text-muted-foreground"
                    }`}
                  >
                    {promo.note}
                  </p>
                )}
                <ul
                  className={`mt-5 space-y-2 text-sm ${
                    promo.highlight ? "text-white/85" : "text-foreground/85"
                  }`}
                >
                  {promo.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${
                          promo.highlight ? "text-brand-gold" : "text-brand-red"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    promo.highlight
                      ? "bg-[#25D366] text-white shadow-sm shadow-[#25D366]/30 hover:bg-[#1ebe5d]"
                      : "bg-[#25D366] text-white shadow-sm shadow-[#25D366]/30 hover:bg-[#1ebe5d]"
                  }`}
                >
                  <MessageCircle className="size-4" />
                  {promo.cta}
                </a>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          {iaesteNote}
        </motion.p>
      </div>
    </section>
  );
}
