"use client";

import * as React from "react";
import { Bell, Inbox } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLeads } from "@/components/admin/use-admin-data";
import type { TabKey } from "./sidebar";

export function NotificationsBell({
  onNavigate,
}: {
  onNavigate: (tab: TabKey) => void;
}) {
  const { data: leads } = useLeads();
  const newLeads = (leads ?? []).filter((l) => l.status === "new");
  const count = newLeads.length;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative grid size-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-4" />
          {count > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white ring-2 ring-background">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notificaciones</p>
          <p className="text-[11px] text-muted-foreground">
            {count > 0
              ? `Tienes ${count} ${count === 1 ? "nuevo mensaje" : "nuevos mensajes"} sin atender`
              : "Todo al día"}
          </p>
        </div>
        <div className="max-h-72 overflow-y-auto elc-scroll">
          {newLeads.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Inbox className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-xs text-muted-foreground">
                Sin notificaciones nuevas.
              </p>
            </div>
          ) : (
            newLeads.slice(0, 8).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate("leads");
                }}
                className="flex w-full items-start gap-2 border-b border-border/50 px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-accent"
              >
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-red" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {l.courseInterest ?? "Solicitud general"} · {l.phone}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        {count > 0 ? (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onNavigate("leads");
            }}
            className="w-full border-t border-border px-4 py-2.5 text-center text-xs font-semibold text-brand-navy transition-colors hover:bg-accent"
          >
            Ver todos los mensajes
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
