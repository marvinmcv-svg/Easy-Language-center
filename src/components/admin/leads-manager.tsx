"use client";

import * as React from "react";
import { toast } from "sonner";
import { Inbox, Loader2, MessageCircle, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useLeads,
  useLeadMutations,
  type Lead,
  type LeadStatus,
  waDigits,
} from "@/components/admin/use-admin-data";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

const STATUS_META: Record<
  LeadStatus,
  { label: string; color: string; badgeClass: string }
> = {
  new: {
    label: "Nuevo",
    color: "#E63946",
    badgeClass: "bg-brand-red/10 text-brand-red border-brand-red/20",
  },
  contacted: {
    label: "Contactado",
    color: "#0B2A5B",
    badgeClass: "bg-brand-navy/10 text-brand-navy border-brand-navy/20",
  },
  enrolled: {
    label: "Inscrito",
    color: "#16a34a",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  archived: {
    label: "Archivado",
    color: "#9ca3af",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

type FilterKey = "all" | LeadStatus;

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d}d`;
  return new Date(iso).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
  });
}

export function LeadsManager() {
  const { data, isLoading, error } = useLeads();
  const { update, remove } = useLeadMutations();
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [toDelete, setToDelete] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const counts = React.useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: data?.length ?? 0,
      new: 0,
      contacted: 0,
      enrolled: 0,
      archived: 0,
    };
    data?.forEach((l) => {
      c[l.status] = (c[l.status] ?? 0) + 1;
    });
    return c;
  }, [data]);

  const filtered = React.useMemo(() => {
    if (filter === "all") return data ?? [];
    return (data ?? []).filter((l) => l.status === filter);
  }, [data, filter]);

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    if (lead.status === status) return;
    setUpdatingId(lead.id);
    try {
      await update.mutateAsync({ id: lead.id, status });
      toast.success(`Marcado como ${STATUS_META[status].label.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Mensaje eliminado");
      setToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterKey)}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="all" className="gap-1.5">
              Todos
              <Badge
                variant="secondary"
                className="ml-1 bg-brand-navy/10 text-brand-navy"
              >
                {counts.all}
              </Badge>
            </TabsTrigger>
            {(Object.keys(STATUS_META) as LeadStatus[]).map((s) => (
              <TabsTrigger key={s} value={s} className="gap-1.5">
                {STATUS_META[s].label}
                <span
                  className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold text-white"
                  style={{ backgroundColor: STATUS_META[s].color }}
                >
                  {counts[s] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Inbox className="size-4 text-brand-navy" /> Mensajes
          </CardTitle>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="ml-auto"
          >
            <a href="/api/leads/export" download>
              <Download className="size-4" />
              Exportar CSV
            </a>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-2 px-4 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="px-4 pb-4 text-sm text-destructive">
              Error al cargar: {error.message}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 pb-8 pt-4 text-center text-sm text-muted-foreground">
              No hay mensajes en esta categoría.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="hidden md:table-cell">Interés</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Mensaje
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden sm:table-cell">Recibido</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{lead.name}</span>
                        {lead.phone ? (
                          <a
                            href={`https://wa.me/${waDigits(lead.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1 text-xs text-emerald-600 hover:underline"
                          >
                            <MessageCircle className="size-3" />
                            {lead.phone}
                          </a>
                        ) : null}
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-xs text-muted-foreground hover:text-brand-navy hover:underline"
                          >
                            {lead.email}
                          </a>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      {lead.courseInterest ?? "—"}
                    </TableCell>
                    <TableCell className="hidden max-w-[280px] text-sm text-muted-foreground lg:table-cell">
                      <span className="line-clamp-2">
                        {lead.message ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(v) =>
                          handleStatusChange(lead, v as LeadStatus)
                        }
                        disabled={updatingId === lead.id}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-8 w-[150px] border-none text-xs font-semibold",
                            STATUS_META[lead.status].badgeClass,
                          )}
                        >
                          {updatingId === lead.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_META) as LeadStatus[]).map(
                            (s) => (
                              <SelectItem key={s} value={s}>
                                <span
                                  className="mr-1.5 inline-block size-2 rounded-full"
                                  style={{
                                    backgroundColor: STATUS_META[s].color,
                                  }}
                                />
                                {STATUS_META[s].label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                      {timeAgo(lead.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {lead.phone ? (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-8 text-emerald-600 hover:text-emerald-700"
                          >
                            <a
                              href={`https://wa.me/${waDigits(lead.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="WhatsApp"
                              title="Abrir WhatsApp"
                            >
                              <MessageCircle className="size-4" />
                            </a>
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setToDelete(lead)}
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

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Eliminar mensaje"
        description={
          <>
            ¿Eliminar el mensaje de{" "}
            <span className="font-semibold">{toDelete?.name}</span>? Esta acción
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
