"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  RotateCcw,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  FileText,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useContent,
  useSaveContentDraft,
  usePublishContent,
  useResetContentDraft,
} from "@/components/admin/use-admin-data";
import type { SectionKey } from "@/lib/content";

// ---- Field helpers ----

function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-foreground/80">{label}</Label>
        {maxLength ? (
          <span className="text-[10px] text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function LongField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-foreground/80">{label}</Label>
        {maxLength ? (
          <span className="text-[10px] text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

// ---- Repeatable item editor (for FAQ, features, steps, promos, stats) ----

function RepeatableGroup<T>({
  items,
  onChange,
  renderItem,
  addLabel,
  newItem,
  maxItems,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel: string;
  newItem: () => T;
  maxItems?: number;
}) {
  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, newItem()]);
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <GripVertical className="size-3" />
              Item {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent disabled:opacity-30"
                aria-label="Subir"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === items.length - 1}
                className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-accent disabled:opacity-30"
                aria-label="Bajar"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="grid size-7 place-items-center rounded text-destructive hover:bg-destructive/10"
                aria-label="Eliminar"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          {renderItem(
            item,
            (patch) => {
              const next = [...items];
              next[i] = { ...next[i], ...patch };
              onChange(next);
            },
            i,
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        disabled={maxItems ? items.length >= maxItems : false}
      >
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}

// ---- Section-specific editors ----

function isDirty(draft: unknown, published: unknown): boolean {
  return JSON.stringify(draft) !== JSON.stringify(published);
}

function SectionEditor({
  sectionKey,
  draft,
  published,
  onSave,
  onPublish,
  onReset,
  saving,
  publishing,
}: {
  sectionKey: SectionKey;
  draft: any;
  published: any;
  onSave: (data: unknown) => void;
  onPublish: (data: unknown) => void;
  onReset: () => void;
  saving: boolean;
  publishing: boolean;
}) {
  const [local, setLocal] = React.useState<any>(draft);
  React.useEffect(() => setLocal(draft), [draft]);
  const set = (patch: Partial<any>) => setLocal((s: any) => ({ ...s, ...patch }));

  const dirty = isDirty(local, published);
  const draftDirty = isDirty(local, draft);

  function handleSave() {
    onSave(local);
  }
  function handlePublish() {
    onPublish(local);
  }

  function renderFields() {
    switch (sectionKey) {
      case "hero":
        return (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TextField label="Eyebrow (texto superior)" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} maxLength={80} />
            <TextField label="Palabra a resaltar (en rojo)" value={local.titleHighlight ?? ""} onChange={(v) => set({ titleHighlight: v })} hint="Debe aparecer en el título." />
            <div className="lg:col-span-2">
              <TextField label="Título principal" value={local.title ?? ""} onChange={(v) => set({ title: v })} maxLength={100} />
            </div>
            <div className="lg:col-span-2">
              <LongField label="Subtítulo" value={local.subtitle ?? ""} onChange={(v) => set({ subtitle: v })} rows={3} maxLength={300} />
            </div>
            <TextField label="Texto botón primario" value={local.primaryCtaLabel ?? ""} onChange={(v) => set({ primaryCtaLabel: v })} />
            <TextField label="Texto botón secundario" value={local.secondaryCtaLabel ?? ""} onChange={(v) => set({ secondaryCtaLabel: v })} />
            <TextField label="Estadística (número)" value={local.statStudents ?? ""} onChange={(v) => set({ statStudents: v })} />
            <TextField label="Estadística (etiqueta)" value={local.statStudentsLabel ?? ""} onChange={(v) => set({ statStudentsLabel: v })} />
            <TextField label="Valoración" value={local.ratingValue ?? ""} onChange={(v) => set({ ratingValue: v })} />
          </div>
        );
      case "stats":
        return (
          <RepeatableGroup
            items={local.stats ?? []}
            onChange={(stats) => set({ stats })}
            addLabel="Añadir cifra"
            newItem={() => ({ value: "", label: "", icon: "Globe" })}
            maxItems={6}
            renderItem={(item: any, update) => (
              <div className="grid grid-cols-3 gap-2">
                <TextField label="Valor" value={item.value ?? ""} onChange={(v) => update({ value: v })} />
                <TextField label="Etiqueta" value={item.label ?? ""} onChange={(v) => update({ label: v })} />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground/80">Icono</Label>
                  <Select value={item.icon ?? "Globe"} onValueChange={(v) => update({ icon: v })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Globe", "GraduationCap", "Users", "Clock", "Star", "Heart", "Award", "BookOpen"].map((ic) => (
                        <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          />
        );
      case "languages":
      case "courses":
      case "gallery":
      case "teachers":
      case "testimonials":
      case "contact":
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Eyebrow" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} maxLength={80} />
            <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} maxLength={100} />
            <LongField label="Subtítulo" value={local.subtitle ?? ""} onChange={(v) => set({ subtitle: v })} rows={2} maxLength={250} />
          </div>
        );
      case "method":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <TextField label="Eyebrow" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
              <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} />
            </div>
            <RepeatableGroup
              items={local.steps ?? []}
              onChange={(steps) => set({ steps })}
              addLabel="Añadir paso"
              newItem={() => ({ n: String((local.steps?.length ?? 0) + 1).padStart(2, "0"), title: "", desc: "" })}
              maxItems={5}
              renderItem={(item: any, update) => (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[80px_1fr]">
                  <TextField label="Nº" value={item.n ?? ""} onChange={(v) => update({ n: v })} />
                  <TextField label="Título" value={item.title ?? ""} onChange={(v) => update({ title: v })} />
                  <div className="sm:col-span-2">
                    <LongField label="Descripción" value={item.desc ?? ""} onChange={(v) => update({ desc: v })} rows={2} />
                  </div>
                </div>
              )}
            />
          </div>
        );
      case "features":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <TextField label="Eyebrow" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
              <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} />
            </div>
            <RepeatableGroup
              items={local.items ?? []}
              onChange={(items) => set({ items })}
              addLabel="Añadir ventaja"
              newItem={() => ({ icon: "Sparkles", title: "", desc: "" })}
              maxItems={9}
              renderItem={(item: any, update) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr]">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground/80">Icono</Label>
                      <Select value={item.icon ?? "Sparkles"} onValueChange={(v) => update({ icon: v })}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["UserCheck", "Sparkles", "Heart", "Clock", "Users", "Globe", "Award", "BookOpen", "Star", "GraduationCap", "Target", "Zap"].map((ic) => (
                            <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <TextField label="Título" value={item.title ?? ""} onChange={(v) => update({ title: v })} />
                  </div>
                  <LongField label="Descripción" value={item.desc ?? ""} onChange={(v) => update({ desc: v })} rows={2} />
                </div>
              )}
            />
          </div>
        );
      case "pricing":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <TextField label="Eyebrow" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
              <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} />
              <LongField label="Subtítulo" value={local.subtitle ?? ""} onChange={(v) => set({ subtitle: v })} rows={2} />
            </div>
            <RepeatableGroup
              items={local.promos ?? []}
              onChange={(promos) => set({ promos })}
              addLabel="Añadir promoción"
              newItem={() => ({ title: "", price: "", note: "", features: [], cta: "Más información", highlight: false })}
              maxItems={6}
              renderItem={(item: any, update) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <TextField label="Título" value={item.title ?? ""} onChange={(v) => update({ title: v })} />
                    <TextField label="Precio" value={item.price ?? ""} onChange={(v) => update({ price: v })} />
                  </div>
                  <TextField label="Nota" value={item.note ?? ""} onChange={(v) => update({ note: v })} />
                  <LongField label="Beneficios (uno por línea)" value={(item.features ?? []).join("\n")} onChange={(v) => update({ features: v.split("\n").filter(Boolean) })} rows={4} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="Texto botón" value={item.cta ?? ""} onChange={(v) => update({ cta: v })} />
                    <label className="flex items-center gap-2 self-end pb-2 text-xs font-medium text-foreground/80">
                      <input type="checkbox" checked={!!item.highlight} onChange={(e) => update({ highlight: e.target.checked })} className="size-4" />
                      Destacada
                    </label>
                  </div>
                </div>
              )}
            />
            <LongField label="Nota IAESTE" value={local.iaesteNote ?? ""} onChange={(v) => set({ iaesteNote: v })} rows={2} />
          </div>
        );
      case "faq":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <TextField label="Eyebrow" value={local.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
              <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} />
              <LongField label="Subtítulo" value={local.subtitle ?? ""} onChange={(v) => set({ subtitle: v })} rows={2} />
              <TextField label="Texto botón WhatsApp" value={local.ctaLabel ?? ""} onChange={(v) => set({ ctaLabel: v })} />
            </div>
            <RepeatableGroup
              items={local.items ?? []}
              onChange={(items) => set({ items })}
              addLabel="Añadir pregunta"
              newItem={() => ({ q: "", a: "" })}
              maxItems={20}
              renderItem={(item: any, update) => (
                <div className="space-y-2">
                  <TextField label="Pregunta" value={item.q ?? ""} onChange={(v) => update({ q: v })} />
                  <LongField label="Respuesta" value={item.a ?? ""} onChange={(v) => update({ a: v })} rows={3} />
                </div>
              )}
            />
          </div>
        );
      case "cta":
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Título" value={local.title ?? ""} onChange={(v) => set({ title: v })} maxLength={100} />
            <LongField label="Subtítulo" value={local.subtitle ?? ""} onChange={(v) => set({ subtitle: v })} rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Botón primario" value={local.primaryCtaLabel ?? ""} onChange={(v) => set({ primaryCtaLabel: v })} />
              <TextField label="Botón secundario" value={local.secondaryCtaLabel ?? ""} onChange={(v) => set({ secondaryCtaLabel: v })} />
            </div>
          </div>
        );
      case "footer":
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Tagline" value={local.tagline ?? ""} onChange={(v) => set({ tagline: v })} />
            <LongField label="Descripción" value={local.description ?? ""} onChange={(v) => set({ description: v })} rows={3} />
          </div>
        );
      default:
        return <p className="text-sm text-muted-foreground">Esta sección no tiene campos editables.</p>;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {dirty ? (
          <Badge variant="outline" className="border-brand-gold/50 bg-brand-gold/10 text-brand-gold">
            Cambios sin publicar
          </Badge>
        ) : (
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600">
            <Check className="mr-1 size-3" /> Publicado
          </Badge>
        )}
        {draftDirty ? (
          <span className="text-xs text-muted-foreground">Tienes cambios sin guardar en este borrador</span>
        ) : null}
      </div>
      {renderFields()}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
        <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={saving || publishing || !dirty}>
          <RotateCcw className="size-4" /> Descartar borrador
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={saving || publishing || !draftDirty}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Guardar borrador
          </Button>
          <Button type="button" size="sm" onClick={handlePublish} disabled={saving || publishing || !dirty} className="bg-brand-navy text-white hover:bg-brand-navy/90">
            {publishing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Main ContentManager ----

export function ContentManager() {
  const { data, isLoading, error } = useContent();
  const saveDraft = useSaveContentDraft();
  const publish = usePublishContent();
  const reset = useResetContentDraft();
  const [activeSection, setActiveSection] = React.useState<SectionKey>("hero");

  const sections = data?.sections ?? {};
  const sectionKeys = Object.keys(sections) as SectionKey[];
  const current = sections[activeSection];

  function handleSave(data: unknown) {
    saveDraft.mutate(
      { id: activeSection, data },
      {
        onSuccess: () => toast.success("Borrador guardado"),
        onError: (e) => toast.error(e.message || "Error al guardar"),
      },
    );
  }
  function handlePublish(data: unknown) {
    publish.mutate(
      { id: activeSection, data },
      {
        onSuccess: () => toast.success("Cambios publicados en el sitio"),
        onError: (e) => toast.error(e.message || "Error al publicar"),
      },
    );
  }
  function handleReset() {
    reset.mutate(
      { id: activeSection },
      {
        onSuccess: () => toast.success("Borrador descartado"),
        onError: (e) => toast.error(e.message || "Error"),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Error al cargar el contenido: {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Section list */}
      <div className="space-y-1">
        <div className="mb-2 flex items-center gap-2 px-2">
          <FileText className="size-4 text-brand-navy" />
          <h3 className="text-sm font-semibold">Secciones del sitio</h3>
        </div>
        {sectionKeys.map((key) => {
          const s = sections[key];
          const dirty = s && isDirty(s.draft, s.published);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeSection === key
                  ? "bg-brand-navy text-white"
                  : "text-foreground/80 hover:bg-accent"
              }`}
            >
              <span className="truncate">{s?.label ?? key}</span>
              {dirty ? <span className="size-2 shrink-0 rounded-full bg-brand-gold" title="Cambios sin publicar" /> : null}
            </button>
          );
        })}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
        >
          <ExternalLink className="size-3.5" /> Ver sitio público
        </a>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-4 text-brand-navy" />
            {current?.label ?? "Sección"}
          </CardTitle>
          <CardDescription>
            Edita el contenido y pulsa <strong>Publicar</strong> para que los cambios aparezcan en el sitio. Guardar borrador no afecta el sitio público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {current ? (
            <SectionEditor
              sectionKey={activeSection}
              draft={current.draft ?? current.published}
              published={current.published}
              onSave={handleSave}
              onPublish={handlePublish}
              onReset={handleReset}
              saving={saveDraft.isPending}
              publishing={publish.isPending}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Selecciona una sección.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
