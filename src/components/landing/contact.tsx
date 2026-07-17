"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Send,
  Loader2,
} from "lucide-react";
import {
  DEFAULT_CONTACT,
  LANGUAGES,
  whatsappLink,
} from "@/lib/brand";
import { Flag } from "@/components/brand/flag";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ContactConfig {
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  mapEmbedUrl: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const COURSE_INTERESTS = [
  ...LANGUAGES.map((l) => ({
    value: l.code,
    label: `${l.flagCode.toUpperCase()} · ${l.name}`,
    flagCode: l.flagCode,
  })),
  { value: "exam-prep", label: "Preparación de exámenes (TOEFL)" },
  { value: "counseling", label: "Asesoramiento psicológico" },
  { value: "general", label: "Asesoramiento general" },
];

export function Contact({ config }: { config: ContactConfig | null }) {
  const c = config ?? (DEFAULT_CONTACT as unknown as ContactConfig);
  const eyebrow = c.eyebrow ?? "Contacto";
  const title = c.title ?? "¿Hablamos?";
  const subtitle = c.subtitle ??
    "Escríbenos por WhatsApp o completa el formulario. Te respondemos muy pronto.";
  const wa = whatsappLink(
    c.whatsapp,
    "Hola, quiero información sobre los cursos de Easy Learning Center",
  );

  return (
    <section
      id="contacto"
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

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            <div>
              <h3
                className="text-xl font-bold text-brand-navy"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Información de contacto
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Estamos en {DEFAULT_CONTACT.address.split(",")[0]}, Santa Cruz
                de la Sierra.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-navy/5 text-brand-navy">
                  <MapPin className="size-5" />
                </span>
                <span className="pt-1.5 text-foreground/85">{c.address}</span>
              </li>
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-navy/5 text-brand-navy">
                  <Phone className="size-5" />
                </span>
                <span className="pt-1.5">
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="block text-foreground/85 transition-colors hover:text-brand-navy"
                  >
                    {c.phone}
                  </a>
                  <a
                    href={`tel:${c.phone2.replace(/\s/g, "")}`}
                    className="block text-foreground/85 transition-colors hover:text-brand-navy"
                  >
                    {c.phone2}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-navy/5 text-brand-navy">
                  <Mail className="size-5" />
                </span>
                <a
                  href={`mailto:${c.email}`}
                  className="pt-2.5 text-foreground/85 transition-colors hover:text-brand-navy"
                >
                  {c.email}
                </a>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#25D366]/30 transition-colors hover:bg-[#1ebe5d]"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
              <a
                href={c.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-brand-navy hover:text-white"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href={c.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-brand-navy hover:text-white"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href={c.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-brand-navy hover:text-white"
              >
                TT
              </a>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Ubicación de Easy Learning Center en Santa Cruz"
                src={c.mapEmbedUrl}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [courseInterest, setCourseInterest] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
    phone?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Por favor ingresa tu nombre.";
    if (!phone.trim()) next.phone = "Por favor ingresa tu teléfono.";
    else if (phone.replace(/\D/g, "").length < 6)
      next.phone = "El teléfono no parece válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          courseInterest: courseInterest || undefined,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "No pudimos enviar tu solicitud.");
      }
      toast.success("¡Solicitud enviada!", {
        description:
          "Gracias por contactarnos. Te responderemos muy pronto por WhatsApp o teléfono.",
      });
      setName("");
      setPhone("");
      setEmail("");
      setCourseInterest("");
      setMessage("");
      setErrors({});
    } catch (err) {
      toast.error("No se pudo enviar", {
        description:
          err instanceof Error ? err.message : "Intenta de nuevo en unos minutos.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div>
        <h3
          className="text-xl font-bold text-brand-navy"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Solicita información
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa el formulario y te contactaremos con detalles sobre horarios
          y precios.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-name" className="text-sm font-medium">
          Nombre completo <span className="text-brand-red">*</span>
        </Label>
        <Input
          id="lead-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          aria-invalid={!!errors.name}
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-xs text-brand-red">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-phone" className="text-sm font-medium">
          Teléfono / WhatsApp <span className="text-brand-red">*</span>
        </Label>
        <Input
          id="lead-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+591 ..."
          aria-invalid={!!errors.phone}
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="text-xs text-brand-red">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-email" className="text-sm font-medium">
          Correo electrónico{" "}
          <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="lead-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@email.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-course" className="text-sm font-medium">
          Idioma o curso de interés
        </Label>
        <Select value={courseInterest} onValueChange={setCourseInterest}>
          <SelectTrigger id="lead-course" className="w-full">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            {COURSE_INTERESTS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {"flagCode" in opt && opt.flagCode ? (
                  <span className="inline-flex items-center gap-2">
                    <Flag code={opt.flagCode as string} size={18} />
                    {opt.label}
                  </span>
                ) : (
                  opt.label
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-message" className="text-sm font-medium">
          Mensaje{" "}
          <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="lead-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos sobre tus metas, horarios preferidos, etc."
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Enviar solicitud
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Al enviar aceptas ser contactado por ELC sobre tu solicitud. Nunca
        compartimos tus datos.
      </p>
    </form>
  );
}
