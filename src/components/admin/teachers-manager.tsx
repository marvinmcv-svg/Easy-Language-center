"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, UserCircle2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  useTeachers,
  useTeacherMutations,
  type Teacher,
} from "@/components/admin/use-admin-data";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImagePicker } from "@/components/admin/image-picker";

type FormState = {
  name: string;
  role: string;
  bio: string;
  image: string;
  languages: string;
  order: number;
  active: boolean;
};

const EMPTY: FormState = {
  name: "",
  role: "",
  bio: "",
  image: "",
  languages: "",
  order: 0,
  active: true,
};

function TeacherFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Teacher | null;
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
          bio: initial.bio ?? "",
          image: initial.image ?? "",
          languages: initial.languages ?? "",
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
    await onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Editar profesor" : "Nuevo profesor"}
          </DialogTitle>
          <DialogDescription>
            Añade un miembro del equipo docente de ELC.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tch-name">Nombre *</Label>
              <Input
                id="tch-name"
                placeholder="Ej. Lic. Carla Ovando"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tch-role">Rol</Label>
              <Input
                id="tch-role"
                placeholder="Ej. Profesora de Inglés"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tch-languages">Idiomas</Label>
              <Input
                id="tch-languages"
                placeholder="Ej. Inglés, Portugués"
                value={form.languages}
                onChange={(e) => set("languages", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separa los idiomas por comas
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tch-bio">Biografía</Label>
              <Textarea
                id="tch-bio"
                rows={3}
                placeholder="Breve biografía, experiencia, especialidades…"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tch-order">Orden</Label>
              <Input
                id="tch-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <Switch
                id="tch-active"
                checked={form.active}
                onCheckedChange={(v) => set("active", v)}
              />
              <Label htmlFor="tch-active" className="cursor-pointer">
                Activo
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            <ImagePicker
              value={form.image || null}
              onChange={(url) => set("image", url ?? "")}
              label="Elegir foto"
              aspect="tall"
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
                "Crear profesor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeachersManager() {
  const { data, isLoading, error } = useTeachers();
  const { create, update, remove } = useTeacherMutations();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Teacher | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Teacher | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(t: Teacher) {
    setEditing(t);
    setDialogOpen(true);
  }

  async function handleSubmit(form: FormState) {
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim() || null,
        bio: form.bio.trim() || null,
        image: form.image.trim() || null,
        languages: form.languages.trim() || null,
        order: Number(form.order) || 0,
        active: form.active,
      };
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...payload });
        toast.success("Profesor actualizado");
      } else {
        await create.mutateAsync(payload);
        toast.success("Profesor creado");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(t: Teacher) {
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
      toast.success("Profesor eliminado");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setDeleting(false);
    }
  }

  const sorted = React.useMemo(() => {
    return [...(data ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} profesor(es)
        </p>
        <Button
          onClick={openCreate}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
        >
          <Plus className="size-4" /> Nuevo profesor
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Error: {error.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          <UserCircle2 className="mx-auto mb-3 size-8 opacity-40" />
          Sin profesores registrados todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-full border bg-muted">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <UserCircle2 className="size-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{t.name}</h3>
                        {t.role ? (
                          <p className="truncate text-sm text-muted-foreground">
                            {t.role}
                          </p>
                        ) : null}
                      </div>
                      <Switch
                        checked={t.active}
                        onCheckedChange={() => toggleActive(t)}
                        aria-label="Toggle activo"
                      />
                    </div>
                    {t.languages ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.languages
                          .split(",")
                          .map((l) => l.trim())
                          .filter(Boolean)
                          .map((l, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-brand-navy/10 text-brand-navy"
                            >
                              {l}
                            </Badge>
                          ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {t.bio ? (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {t.bio}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    Orden: {t.order}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="size-3.5" /> Editar
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TeacherFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Eliminar profesor"
        description={
          <>
            ¿Eliminar a <span className="font-semibold">{toDelete?.name}</span>{" "}
            del equipo?
          </>
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
