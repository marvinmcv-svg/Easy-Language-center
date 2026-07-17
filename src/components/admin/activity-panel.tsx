"use client";

import * as React from "react";
import {
  Activity as ActivityIcon,
  Plus,
  Pencil,
  Trash2,
  Send,
  LogIn,
  LogOut,
  Upload,
  Save,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useActivity, type ActivityEntry } from "@/components/admin/use-admin-data";

const ACTION_META: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  create: { icon: Plus, color: "text-emerald-600", label: "Creó" },
  update: { icon: Pencil, color: "text-brand-navy", label: "Actualizó" },
  delete: { icon: Trash2, color: "text-destructive", label: "Eliminó" },
  publish: { icon: Send, color: "text-brand-gold", label: "Publicó" },
  login: { icon: LogIn, color: "text-emerald-600", label: "Inició sesión" },
  logout: { icon: LogOut, color: "text-muted-foreground", label: "Cerró sesión" },
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `hace ${day} d`;
  return new Date(iso).toLocaleDateString("es-BO");
}

export function ActivityPanel({
  limit,
  compact,
}: {
  limit?: number;
  compact?: boolean;
}) {
  const { data, isLoading, error } = useActivity();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        No se pudo cargar la actividad.
      </p>
    );
  }

  const logs = (data ?? []).slice(0, limit ?? 50);

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <ActivityIcon className="mx-auto size-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Aún no hay actividad registrada.
        </p>
      </div>
    );
  }

  return (
    <ol className={`space-y-1 ${compact ? "" : ""}`}>
      {logs.map((log) => {
        const meta = ACTION_META[log.action] ?? {
          icon: ActivityIcon,
          color: "text-muted-foreground",
          label: log.action,
        };
        const Icon = meta.icon;
        return (
          <li
            key={log.id}
            className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50"
          >
            <div className={`mt-0.5 shrink-0 ${meta.color}`}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{log.actor}</span>{" "}
                <span className="text-muted-foreground">{log.summary}</span>
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                  {log.entity}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
