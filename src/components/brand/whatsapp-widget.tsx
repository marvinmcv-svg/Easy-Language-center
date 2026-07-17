"use client";

import * as React from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsappLink, DEFAULT_CONTACT } from "@/lib/brand";

/**
 * Floating WhatsApp widget — the classic green bubble that stays fixed at the
 * bottom-right of every page. Clicking opens a small chat-style popup with a
 * greeting and a button that deep-links into WhatsApp with a prefilled
 * message. Redirects all leads straight to the center's WhatsApp.
 */
export function WhatsAppWidget({
  phone,
  label = "Easy Learning Center",
  greeting = "¡Hola! 👋 ¿En qué podemos ayudarte hoy? Escríbenos y te responderemos enseguida.",
}: {
  phone?: string;
  label?: string;
  greeting?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const number = phone ?? DEFAULT_CONTACT.whatsapp;
  const wa = whatsappLink(
    number,
    "Hola, quiero información sobre los cursos de Easy Learning Center",
  );

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 print:hidden"
      aria-live="polite"
    >
      {/* Popup card */}
      {mounted && open && (
        <div className="w-[300px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#075E54] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-white/15">
                <MessageCircle className="size-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold">{label}</p>
                <p className="text-[11px] text-white/80">
                  En línea · Responde en minutos
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="grid size-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
          {/* Body */}
          <div className="bg-[#ECE5DD] px-4 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-foreground shadow-sm">
              {greeting}
            </div>
          </div>
          {/* Footer CTA */}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d]"
          >
            <MessageCircle className="size-5" />
            Iniciar chat en WhatsApp
          </a>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        aria-expanded={open}
        className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-transform hover:scale-105 active:scale-95"
      >
        {/* Ping ring */}
        <span
          className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"
          aria-hidden
        />
        {open ? (
          <X className="size-6" />
        ) : (
          // Official WhatsApp glyph
          <svg
            viewBox="0 0 32 32"
            className="size-8"
            fill="currentColor"
            aria-hidden
          >
            <path d="M16.04 4c-6.62 0-12 5.38-12 12 0 2.11.55 4.16 1.6 5.97L4 28l6.18-1.62A11.93 11.93 0 0 0 16.04 28c6.62 0 12-5.38 12-12s-5.38-12-12-12zm0 21.82c-1.86 0-3.68-.5-5.27-1.45l-.38-.22-3.67.96.98-3.58-.25-.37a9.82 9.82 0 0 1-1.5-5.22c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.85 9.85zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
          </svg>
        )}
        {/* Unread dot */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-brand-red text-[10px] font-bold text-white ring-2 ring-background">
            1
          </span>
        )}
      </button>
    </div>
  );
}
