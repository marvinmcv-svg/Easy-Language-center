"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ExternalLink,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useSettings,
  useUpdateSettings,
  type SiteConfig,
} from "@/components/admin/use-admin-data";

type FormState = Pick<
  SiteConfig,
  | "heroTitle"
  | "heroSubtitle"
  | "phone"
  | "phone2"
  | "whatsapp"
  | "email"
  | "address"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "mapEmbedUrl"
>;

const EMPTY_FORM: FormState = {
  heroTitle: "",
  heroSubtitle: "",
  phone: "",
  phone2: "",
  whatsapp: "",
  email: "",
  address: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  mapEmbedUrl: "",
};

function Field({
  id,
  label,
  hint,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SettingsManager() {
  const { data, isLoading, error } = useSettings();
  const update = useUpdateSettings();
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setForm({
        heroTitle: data.heroTitle ?? "",
        heroSubtitle: data.heroSubtitle ?? "",
        phone: data.phone ?? "",
        phone2: data.phone2 ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        instagram: data.instagram ?? "",
        facebook: data.facebook ?? "",
        tiktok: data.tiktok ?? "",
        mapEmbedUrl: data.mapEmbedUrl ?? "",
      });
      setDirty(false);
    }
  }, [data]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.heroTitle.trim()) {
      toast.error("El título del héroe es obligatorio");
      return;
    }
    try {
      await update.mutateAsync(form);
      toast.success("Configuración guardada");
      setDirty(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full lg:col-span-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Error al cargar la configuración: {error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hero section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-brand-gold" /> Sección principal
            (Hero)
          </CardTitle>
          <CardDescription>
            Lo que ven los visitantes al entrar al sitio.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field id="heroTitle" label="Título principal">
            <Input
              id="heroTitle"
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
              placeholder="Aprende un nuevo idioma hoy"
            />
          </Field>
          <Field
            id="heroSubtitle"
            label="Subtítulo"
            hint="Una o dos líneas que describan la oferta"
          >
            <Textarea
              id="heroSubtitle"
              rows={2}
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
              placeholder="Clases presenciales y virtuales en Santa Cruz…"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="size-4 text-brand-navy" /> Contacto
          </CardTitle>
          <CardDescription>
            Teléfonos, WhatsApp y correo que se muestran en el sitio.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="phone" label="Teléfono principal">
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+591 77385885"
            />
          </Field>
          <Field id="phone2" label="Teléfono secundario">
            <Input
              id="phone2"
              value={form.phone2}
              onChange={(e) => set("phone2", e.target.value)}
              placeholder="+591 76638081"
            />
          </Field>
          <Field
            id="whatsapp"
            label="WhatsApp"
            hint="Aparece como botón flotante en el sitio"
          >
            <div className="relative">
              <MessageCircle className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="whatsapp"
                className="pl-9"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="+591 77385885"
              />
            </div>
          </Field>
          <Field id="email" label="Correo electrónico">
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="info@easylearningcenter.com"
            />
          </Field>
          <Field
            id="address"
            label="Dirección"
          >
            <Textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Zona norte, Radial 27, Santa Cruz, Bolivia"
            />
          </Field>
          <Field
            id="mapEmbedUrl"
            label="URL del mapa (embed)"
            hint="Enlace de Google Maps en formato embed"
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="mapEmbedUrl"
                className="pl-9"
                value={form.mapEmbedUrl}
                onChange={(e) => set("mapEmbedUrl", e.target.value)}
                placeholder="https://www.google.com/maps?q=…&output=embed"
              />
            </div>
          </Field>
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="size-4 text-brand-navy" /> Redes sociales
          </CardTitle>
          <CardDescription>
            Enlaces a los perfiles sociales del centro.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field id="instagram" label="Instagram">
            <Input
              id="instagram"
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="https://instagram.com/…"
            />
          </Field>
          <Field id="facebook" label="Facebook">
            <Input
              id="facebook"
              value={form.facebook}
              onChange={(e) => set("facebook", e.target.value)}
              placeholder="https://facebook.com/…"
            />
          </Field>
          <Field id="tiktok" label="TikTok">
            <Input
              id="tiktok"
              value={form.tiktok}
              onChange={(e) => set("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@…"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <p className="text-xs text-muted-foreground">
          {dirty
            ? "Tienes cambios sin guardar"
            : data?.updatedAt
              ? `Última actualización: ${new Date(data.updatedAt).toLocaleString("es-BO")}`
              : "Todos los cambios guardados"}
        </p>
        <Button
          type="submit"
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
          disabled={update.isPending || !dirty}
        >
          {update.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Guardando…
            </>
          ) : (
            <>
              <Save className="size-4" /> Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
