"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { TestimonialsContent } from "@/lib/content";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image: string | null;
}

export function Testimonials({
  testimonials,
  content,
}: {
  testimonials: TestimonialItem[];
  content?: TestimonialsContent;
}) {
  const eyebrow = content?.eyebrow ?? "Testimonios";
  const title = content?.title ?? "Lo que dicen nuestros estudiantes";
  const subtitle = content?.subtitle ??
    "Historias reales de personas que ya están hablando un nuevo idioma gracias a ELC.";
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-advance every 5.5s
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 5500);
    return () => clearInterval(id);
  }, [api]);

  const items = testimonials.length
    ? testimonials
    : [
        {
          id: "fallback",
          name: "Comunidad ELC",
          role: "Santa Cruz, Bolivia",
          content:
            "Únete a nuestra comunidad de estudiantes y descubre lo que significa aprender con método, amistad y resultados.",
          rating: 5,
          image: null,
        },
      ];

  return (
    <section
      id="testimonios"
      className="elc-section relative overflow-hidden bg-white py-16 md:py-24"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
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

        <div className="mx-auto max-w-4xl px-4">
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "center" }}
            className="w-full"
          >
            <CarouselContent>
              {items.map((t) => (
                <CarouselItem key={t.id}>
                  <TestimonialCard t={t} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 sm:-left-12" />
            <CarouselNext className="right-1 sm:-right-12" />
          </Carousel>

          {/* Dots */}
          {count > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-brand-red"
                      : "w-2 bg-brand-navy/20 hover:bg-brand-navy/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: TestimonialItem }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-full bg-brand-navy/5 text-brand-navy">
          <Quote className="size-7" />
        </div>
        <div className="mb-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-5 ${
                i < t.rating
                  ? "fill-brand-gold text-brand-gold"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
          “{t.content}”
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          {t.image ? (
            <img
              src={t.image}
              alt={t.name}
              className="size-12 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-12 place-items-center rounded-full bg-brand-red text-white">
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="text-left">
            <p
              className="font-bold text-brand-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.name}
            </p>
            {t.role && (
              <p className="text-xs text-muted-foreground">{t.role}</p>
            )}
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}
