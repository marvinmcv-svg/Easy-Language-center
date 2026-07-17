"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  useMedia,
  useMediaMutations,
  type MediaAsset,
} from "@/components/admin/use-admin-data";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function MediaManager() {
  const { data, isLoading, error } = useMedia();
  const { upload, remove } = useMediaMutations();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const results = await Promise.allSettled(
      Array.from(files).map((file) => {
        if (!file.type.startsWith("image/")) {
          return Promise.reject(new Error(`${file.name}: no es una imagen`));
        }
        if (file.size > 10 * 1024 * 1024) {
          return Promise.reject(
            new Error(`${file.name}: supera los 10 MB`),
          );
        }
        return upload.mutateAsync({ file });
      }),
    );
    let ok = 0;
    let fail = 0;
    results.forEach((r) => {
      if (r.status === "fulfilled") ok++;
      else {
        fail++;
        toast.error(r.reason instanceof Error ? r.reason.message : "Error");
      }
    });
    if (ok) toast.success(`${ok} archivo(s) subido(s)`);
    if (fail && !ok) toast.error("No se pudo subir ningún archivo");
  }

  async function copyUrl(m: MediaAsset) {
    try {
      const absolute = new URL(m.url, window.location.origin).toString();
      await navigator.clipboard.writeText(absolute);
      toast.success("URL copiada al portapapeles");
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = new URL(m.url, window.location.origin).toString();
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast.success("URL copiada");
      } catch {
        toast.error("No se pudo copiar");
      }
      document.body.removeChild(ta);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Archivo eliminado");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-10 text-center transition-colors",
          dragOver && "border-brand-navy bg-brand-navy/5",
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-navy/10">
          {upload.isPending ? (
            <Loader2 className="size-5 animate-spin text-brand-navy" />
          ) : (
            <Upload className="size-5 text-brand-navy" />
          )}
        </div>
        <p className="text-sm font-semibold">
          Arrastra imágenes aquí o haz clic para subir
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WebP — hasta 10 MB cada una · múltiple permitido
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Error al cargar: {error.message}
        </div>
      ) : null}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          <ImageIcon className="mx-auto mb-3 size-8 opacity-40" />
          Sin archivos todavía. Sube tu primera imagen.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data.map((m) => (
            <Card key={m.id} className="group overflow-hidden py-0">
              <CardContent className="p-0">
                <div
                  className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                  onClick={() => copyUrl(m)}
                  title="Click para copiar URL"
                >
                  {m.mime.startsWith("image/") ? (
                    <img
                      src={m.url}
                      alt={m.alt ?? m.filename}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                      <Copy className="size-3.5" /> Copiar URL
                    </div>
                  </div>
                </div>
                <div className="space-y-1 p-2.5">
                  <p
                    className="truncate text-xs font-medium"
                    title={m.filename}
                  >
                    {m.filename}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] text-muted-foreground">
                      {formatBytes(m.size)}
                    </span>
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => copyUrl(m)}
                        aria-label="Copiar URL"
                      >
                        <Copy className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => setToDelete(m)}
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Eliminar archivo"
        description={
          <>
            ¿Eliminar{" "}
            <span className="font-semibold">{toDelete?.filename}</span> del
            servidor? Si se está usando en un curso o testimonio, esa referencia
            quedará vacía.
          </>
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
