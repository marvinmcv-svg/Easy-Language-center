"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { GALLERY } from "@/lib/gallery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { GalleryContent } from "@/lib/content";

export function Gallery({ content }: { content?: GalleryContent }) {
  const eyebrow = content?.eyebrow ?? "Vida en ELC";
  const title = content?.title ?? "Galería";
  const subtitle = content?.subtitle ??
    "Un vistazo a nuestras clases, eventos y la energía de aprender idiomas en comunidad.";
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<number | null>(null);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  return (
    <section
      id="galeria"
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

        {/* Masonry-style grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {GALLERY.map((item, i) => (
            <motion.button
              key={item.url}
              type="button"
              onClick={() => openAt(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
              aria-label={`Abrir imagen: ${item.title}`}
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  {item.tag && (
                    <span className="inline-block rounded-full bg-brand-gold px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-brand-navy">
                      {item.tag}
                    </span>
                  )}
                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-2xl border-border bg-background p-0">
          <div className="relative">
            {active !== null && (
              <>
                <img
                  src={GALLERY[active].url}
                  alt={GALLERY[active].title}
                  className="max-h-[80vh] w-full object-contain bg-black"
                />
                <div className="absolute right-3 top-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar"
                    className="grid size-9 place-items-center rounded-full bg-white/85 text-foreground shadow hover:bg-white"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {GALLERY[active].tag && (
                    <span className="inline-block rounded-full bg-brand-gold px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-brand-navy">
                      {GALLERY[active].tag}
                    </span>
                  )}
                  <DialogTitle className="mt-2 text-white">
                    {GALLERY[active].title}
                  </DialogTitle>
                  <DialogDescription className="text-white/70">
                    Easy Learning Center — Santa Cruz, Bolivia
                  </DialogDescription>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
