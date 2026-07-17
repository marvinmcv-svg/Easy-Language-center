"use client";

import * as React from "react";
import { Send, X, Sparkles, Loader2 } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "¡Hola! 👋 Soy Shirley, la recepcionista virtual de Easy Learning Center. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cursos, horarios, precios o idiomas.";

const SUGGESTIONS = [
  "¿Qué idiomas enseñan?",
  "¿Cuánto cuesta el curso de inglés?",
  "¿Hay clases para niños?",
  "¿Cómo me inscribo?",
];

export function ShirleyWidget() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages: ChatMsg[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply =
        data.reply ??
        data.error ??
        "Lo siento, no pude responder. Intenta de nuevo.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Tengo un problema técnico ahora mismo. Escríbenos por WhatsApp al +591 77385885. 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex flex-col items-start gap-3 print:hidden">
      {/* Chat panel */}
      {mounted && open && (
        <div className="flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-navy to-[#1E40AF] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative grid size-10 place-items-center rounded-full bg-brand-gold text-brand-navy shadow">
                <Sparkles className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-brand-navy" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold">Shirley</p>
                <p className="text-[11px] text-white/80">
                  Recepcionista AI · En línea
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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="elc-scroll flex-1 space-y-3 overflow-y-auto bg-brand-cream px-3 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-brand-navy text-white"
                      : "rounded-bl-sm bg-white text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">
                  <Loader2 className="size-3.5 animate-spin" />
                  Shirley está escribiendo…
                </div>
              </div>
            ) : null}

            {/* Suggestions (only on first message) */}
            {messages.length === 1 && !loading ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-brand-navy/20 bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-white px-3 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              disabled={loading}
              maxLength={500}
              className="flex-1 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm outline-none transition-colors focus:border-brand-navy focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-navy text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat con Shirley" : "Hablar con Shirley"}
        aria-expanded={open}
        className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-navy to-[#1E40AF] py-2.5 pl-2.5 pr-4 text-white shadow-xl shadow-brand-navy/30 transition-transform hover:scale-105 active:scale-95"
      >
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-brand-navy opacity-20" aria-hidden />
        <span className="grid size-9 place-items-center rounded-full bg-brand-gold text-brand-navy shadow">
          <Sparkles className="size-5" />
        </span>
        <span className="text-sm font-bold">{open ? "Cerrar" : "Habla con Shirley"}</span>
      </button>
    </div>
  );
}
