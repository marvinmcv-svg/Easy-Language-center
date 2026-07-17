"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  useTestimonials,
  useTestimonialMutations,
  type Testimonial,
} from "@/components/admin/use-admin-data";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImagePicker } from "@/components/admin/image-picker";

type FormState = {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  order: number;
  active: boolean;
};

const EMPTY: FormState = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  image: "",
  order: 0,
  active: true,
};

function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cn(
            "transition-transform",
            onChange && "hover:scale-110 cursor-pointer",
          )}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sz,
              n <= value
                ? "fill-brand-gold text-brand-gold"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Testimonial | null;
  onSubmit: (data: FormState) => void | Promise<void>;
  submitting: boolean;
}) {
  const [form, setForm] = React.useState<FormState>(EMPTY);

  React.useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          role: initial.role ?? "",
          content: initial.content,
          rating: initial.rating ?? 5,
          image: initial.image ?? "",
          order: initial.order ?? 0,
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
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!form.content.trim()) {
      toast.error("El testimonio no puede estar vacío");
      return;
    }
    await onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Editar testimonio" : "Nuevo testimonio"}
          </DialogTitle>
          <DialogDescription>
            Comparte la opinión de un estudiante.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t-name">Nombre *</Label>
              <Input
                id="t-name"
                placeholder="Ej. María Fernanda"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-role">Rol / Programa</Label>
              <Input
                id="t-role"
                placeholder="Ej. Estudiante de Inglés"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="t-content">Testimonio *</Label>
            <Textarea
              id="t-content"
              rows={4}
              placeholder="Lo que el estudiante dice sobre ELC…"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Label>Calificación</Label>
            <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t-order">Orden</Label>
              <Input
                id="t-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="t-active"
                  checked={form.active}
                  onCheckedChange={(v) => set("active", v)}
                />
                <Label htmlFor="t-active" className="cursor-pointer">
                  Activo
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto (opcional)</Label>
            <ImagePicker
              value={form.image || null}
              onChange={(url) => set("image", url ?? "")}
              label="Elegir foto"
              aspect="square"
            />
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
                "Crear testimonio"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TestimonialsManager() {
  const { data, isLoading, error } = useTestimonials();
  const { create, update, remove } = useTestimonialMutations();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Testimonial | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setDialogOpen(true);
  }

  async function handleSubmit(form: FormState) {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim() || null,
        content: form.content.trim(),
        rating: Number(form.rating) || 5,
        image: form.image.trim() || null,
        order: Number(form.order) || 0,
        active: form.active,
      };
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...payload });
        toast.success("Testimonio actualizado");
      } else {
        await create.mutateAsync(payload);
        toast.success("Testimonio creado");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo guardar",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(t: Testimonial) {
    try {
      await update.mutateAsync({ id: t.id, active: !t.active });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Testimonio eliminado");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} testimonio(s)
        </p>
        <Button
          onClick={openCreate}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          <Plus className="size-4" /> Nuevo testimonio
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="size-4 text-brand-gold" /> Testimonios
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-2 px-4 pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="px-4 pb-4 text-sm text-destructive">
              Error: {error.message}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="px-4 pb-8 pt-4 text-center text-sm text-muted-foreground">
              Sin testimonios todavía.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="hidden md:table-cell">Rol</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Testimonio
                  </TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 overflow-hidden rounded-full bg-muted">
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                              {t.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{t.name}</span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {t.role ?? "—"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      {t.role ?? "—"}
                    </TableCell>
                    <TableCell className="hidden max-w-[320px] text-sm text-muted-foreground lg:table-cell">
                      <span className="line-clamp-2">{t.content}</span>
                    </TableCell>
                    <TableCell>
                      <StarRating value={t.rating} size="sm" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={t.active}
                        onCheckedChange={() => toggleActive(t)}
                        aria-label="Toggle activo"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEdit(t)}
                          aria-label="Editar"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setToDelete(t)}
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

      <TestimonialFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Eliminar testimonio"
        description={
          <>
            ¿Eliminar el testimonio de{" "}
            <span className="font-semibold">{toDelete?.name}</span>?
          </>
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
