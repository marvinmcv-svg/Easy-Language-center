"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COURSE_TYPES, LANGUAGES } from "@/lib/brand";
import { cn } from "@/lib/utils";
import {
  useCourses,
  useCourseMutations,
  type Course,
} from "@/components/admin/use-admin-data";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImagePicker } from "@/components/admin/image-picker";

type FormState = {
  language: string;
  title: string;
  level: string;
  type: string;
  schedule: string;
  description: string;
  price: string;
  priceNote: string;
  image: string;
  badge: string;
  order: number;
  featured: boolean;
  active: boolean;
};

const EMPTY: FormState = {
  language: "english",
  title: "",
  level: "",
  type: "group",
  schedule: "",
  description: "",
  price: "",
  priceNote: "",
  image: "",
  badge: "",
  order: 0,
  featured: false,
  active: true,
};

function langLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

function typeLabel(value: string): string {
  return COURSE_TYPES.find((t) => t.value === value)?.label ?? value;
}

function CourseFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Course | null;
  onSubmit: (data: FormState) => void | Promise<void>;
  submitting: boolean;
}) {
  const [form, setForm] = React.useState<FormState>(EMPTY);

  React.useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          language: initial.language,
          title: initial.title,
          level: initial.level ?? "",
          type: initial.type,
          schedule: initial.schedule ?? "",
          description: initial.description ?? "",
          price: initial.price ?? "",
          priceNote: initial.priceNote ?? "",
          image: initial.image ?? "",
          badge: initial.badge ?? "",
          order: initial.order ?? 0,
          featured: !!initial.featured,
          active: !!initial.active,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, initial]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("El título del curso es obligatorio");
      return;
    }
    if (!form.language) {
      toast.error("Selecciona un idioma");
      return;
    }
    if (!form.type) {
      toast.error("Selecciona un tipo de curso");
      return;
    }
    await onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Editar curso" : "Nuevo curso"}
          </DialogTitle>
          <DialogDescription>
            {initial
              ? "Actualiza los datos del curso."
              : "Completa los datos para crear un nuevo curso."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ej. Inglés Intensivo Matutino"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Idioma *</Label>
              <Select
                value={form.language}
                onValueChange={(v) => set("language", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      <span className="mr-1.5">{l.flag}</span> {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de curso *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nivel</Label>
              <Input
                id="level"
                placeholder="Ej. Inicial / Intermedio / Todos los niveles"
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Horario</Label>
              <Input
                id="schedule"
                placeholder="Ej. Lun y Mié, 7:00–9:00 pm"
                value={form.schedule}
                onChange={(e) => set("schedule", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                placeholder="Ej. 1000 Bs/mes"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceNote">Nota de precio</Label>
              <Input
                id="priceNote"
                placeholder="Ej. 20% off inscripción anticipada"
                value={form.priceNote}
                onChange={(e) => set("priceNote", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Etiqueta</Label>
              <Input
                id="badge"
                placeholder="Ej. Más popular / Nuevo"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) =>
                  set("order", Number(e.target.value) || 0)
                }
              />
              <p className="text-xs text-muted-foreground">
                Menor número = aparece primero
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Breve descripción del curso, lo que aprenderás, metodología…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Imagen del curso</Label>
              <ImagePicker
                value={form.image || null}
                onChange={(url) => set("image", url ?? "")}
                label="Elegir imagen"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">
                  Destacado
                </Label>
                <p className="text-xs text-muted-foreground">
                  Se mostrará como curso destacado en el inicio
                </p>
              </div>
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
              <div>
                <Label htmlFor="active" className="cursor-pointer">
                  Activo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Los cursos inactivos no se muestran en el sitio público
                </p>
              </div>
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => set("active", v)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-brand-navy text-white hover:bg-brand-navy/90"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Guardando…
                </>
              ) : initial ? (
                "Guardar cambios"
              ) : (
                "Crear curso"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CoursesManager() {
  const { data, isLoading, error } = useCourses();
  const { create, update, remove } = useCourseMutations();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Course | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Course | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(c: Course) {
    setEditing(c);
    setDialogOpen(true);
  }

  async function handleSubmit(form: FormState) {
    setSubmitting(true);
    try {
      const payload = {
        language: form.language,
        title: form.title.trim(),
        level: form.level.trim() || null,
        type: form.type,
        schedule: form.schedule.trim() || null,
        description: form.description.trim() || null,
        price: form.price.trim() || null,
        priceNote: form.priceNote.trim() || null,
        image: form.image.trim() || null,
        badge: form.badge.trim() || null,
        order: Number(form.order) || 0,
        featured: form.featured,
        active: form.active,
      };
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...payload });
        toast.success("Curso actualizado");
      } else {
        await create.mutateAsync(payload);
        toast.success("Curso creado");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo guardar el curso",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleFeatured(c: Course) {
    try {
      await update.mutateAsync({ id: c.id, featured: !c.featured });
      toast.success(c.featured ? "Quitado de destacados" : "Marcado como destacado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    }
  }

  async function toggleActive(c: Course) {
    try {
      await update.mutateAsync({ id: c.id, active: !c.active });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Curso eliminado");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} curso(s) en total
        </p>
        <Button
          onClick={openCreate}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          <Plus className="size-4" /> Nuevo curso
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="size-4 text-brand-navy" /> Cursos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-2 px-4 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="px-4 pb-4 text-sm text-destructive">
              Error al cargar: {error.message}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="px-4 pb-8 pt-4 text-center text-sm text-muted-foreground">
              Sin registros todavía. Crea tu primer curso.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden lg:table-cell">Horario</TableHead>
                  <TableHead className="hidden xl:table-cell">Precio</TableHead>
                  <TableHead className="text-center">Destacado</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="size-10 overflow-hidden rounded-md border bg-muted">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <BookOpen className="size-4" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{c.title}</span>
                        {c.badge ? (
                          <Badge
                            variant="secondary"
                            className="mt-0.5 w-fit bg-brand-gold/20 text-brand-navy"
                          >
                            {c.badge}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{langLabel(c.language)}</TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      {typeLabel(c.type)}
                    </TableCell>
                    <TableCell className="hidden max-w-[180px] truncate text-sm text-muted-foreground lg:table-cell">
                      {c.schedule ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm xl:table-cell">
                      {c.price ?? "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toggleFeatured(c)}
                        aria-label="Toggle destacado"
                        title={
                          c.featured ? "Quitar destacado" : "Marcar destacado"
                        }
                      >
                        <Star
                          className={cn(
                            "size-4",
                            c.featured
                              ? "fill-brand-gold text-brand-gold"
                              : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={c.active}
                        onCheckedChange={() => toggleActive(c)}
                        aria-label="Toggle activo"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEdit(c)}
                          aria-label="Editar"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setToDelete(c)}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CourseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Eliminar curso"
        description={
          <>
            ¿Seguro que deseas eliminar{" "}
            <span className="font-semibold">{toDelete?.title}</span>? Esta acción
            no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
