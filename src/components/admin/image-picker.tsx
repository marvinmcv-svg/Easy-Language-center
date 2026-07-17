"use client";

import * as React from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  useMedia,
  useMediaMutations,
  type MediaAsset,
} from "@/components/admin/use-admin-data";

interface ImagePickerProps {
  /** Currently selected image URL (controlled). */
  value?: string | null;
  /** Called when the user picks a media URL. */
  onChange: (url: string | null) => void;
  /** Optional label for the trigger button. */
  label?: string;
  /** Aspect ratio hint for the preview. */
  aspect?: "square" | "wide" | "tall";
}

/**
 * ImagePicker — lets the user pick an image from the media library
 * or upload a new one inline. Used in course/teacher/testimonial forms.
 */
export function ImagePicker({
  value,
  onChange,
  label = "Seleccionar imagen",
  aspect = "wide",
}: ImagePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { data: media, isLoading } = useMedia();
  const { upload } = useMediaMutations();

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "tall"
        ? "aspect-[3/4]"
        : "aspect-video";

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen supera los 10 MB");
      return;
    }
    setUploading(true);
    try {
      const res = await upload.mutateAsync({ file });
      toast.success("Imagen subida");
      onChange(res.media.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40",
            aspect === "square" && "w-20",
            aspect === "tall" && "w-16",
          )}
        >
          {value ? (
            <img
              src={value}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <ImagePlus className="size-4" />
            {label}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onChange(null)}
            >
              <X className="size-3.5" /> Quitar
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Biblioteca de medios</DialogTitle>
            <DialogDescription>
              Selecciona una imagen o sube una nueva. Máx. 10 MB.
            </DialogDescription>
          </DialogHeader>

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
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors",
              dragOver && "border-brand-navy bg-brand-navy/5",
            )}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploading ? (
              <>
                <Loader2 className="size-6 animate-spin text-brand-navy" />
                <p className="text-sm font-medium">Subiendo…</p>
              </>
            ) : (
              <>
                <Upload className="size-6 text-brand-navy" />
                <p className="text-sm font-medium">
                  Arrastra una imagen aquí o haz clic para subir
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP — hasta 10 MB
                </p>
              </>
            )}
          </div>

          {/* Library grid */}
          <div className="max-h-[50vh] overflow-y-auto elc-scroll pr-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            ) : !media || media.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Aún no hay imágenes en la biblioteca
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {media
                  .filter((m) => m.mime.startsWith("image/"))
                  .map((m: MediaAsset) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onChange(m.url);
                        setOpen(false);
                      }}
                      className={cn(
                        "group relative overflow-hidden rounded-md border bg-muted text-left transition-all hover:border-brand-navy hover:shadow-md",
                        value === m.url && "border-brand-navy ring-2 ring-brand-navy/30",
                      )}
                    >
                      <div className={cn("w-full", aspectClass)}>
                        <img
                          src={m.url}
                          alt={m.alt ?? m.filename}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate font-medium">{m.filename}</p>
                        <p className="text-white/70">{formatBytes(m.size)}</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
