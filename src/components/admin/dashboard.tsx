"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Image as ImageIcon,
  Inbox,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useLeads,
  useStats,
  type AdminUser,
  type Lead,
  type LeadStatus,
  waDigits,
} from "@/components/admin/use-admin-data";
import { ActivityPanel } from "@/components/admin/activity-panel";

interface DashboardProps {
  admin: AdminUser;
}

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

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  accent: string;
  loading?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className="flex size-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </div>
        )}
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className={meta.badgeClass}>
      {meta.label}
    </Badge>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hace un momento";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
  });
}

export function Dashboard({ admin }: DashboardProps) {
  const stats = useStats();
  const leads = useLeads();
  const recent: Lead[] = React.useMemo(
    () => (leads.data ?? []).slice(0, 5),
    [leads.data],
  );

  const chartData = React.useMemo(() => {
    const s = stats.data?.byStatus ?? {
      new: 0,
      contacted: 0,
      enrolled: 0,
      archived: 0,
    };
    return (Object.keys(STATUS_META) as LeadStatus[]).map((k) => ({
      name: STATUS_META[k].label,
      value: s[k] ?? 0,
      color: STATUS_META[k].color,
    }));
  }, [stats.data]);

  const loading = stats.isLoading;
  const firstName = admin.name.split(/\s+/)[0];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-brand-navy to-[#1E3A8A] p-6 text-white shadow-sm sm:p-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {new Date().toLocaleDateString("es-BO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h2
          className="mt-1 text-2xl font-extrabold sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hola, {firstName} 👋
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-white/80">
          Este es el resumen de actividad del Easy Learning Center. Revisa los
          mensajes nuevos, gestiona tus cursos y mantén el sitio actualizado.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Inbox}
          label="Mensajes totales"
          value={stats.data?.leads ?? 0}
          loading={loading}
          accent="#0B2A5B"
        />
        <StatCard
          icon={TrendingUp}
          label="Nuevos"
          value={stats.data?.leadsNew ?? 0}
          hint="Pendientes de contactar"
          loading={loading}
          accent="#E63946"
        />
        <StatCard
          icon={BookOpen}
          label="Cursos"
          value={stats.data?.courses ?? 0}
          loading={loading}
          accent="#FBBF24"
        />
        <StatCard
          icon={Star}
          label="Testimonios"
          value={stats.data?.testimonials ?? 0}
          loading={loading}
          accent="#16a34a"
        />
        <StatCard
          icon={Users}
          label="Profesores"
          value={stats.data?.teachers ?? 0}
          loading={loading}
          accent="#8A5A44"
        />
        <StatCard
          icon={ImageIcon}
          label="Medios"
          value={stats.data?.media ?? 0}
          loading={loading}
          accent="#2A9D8F"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Mensajes por estado</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribución actual de las solicitudes recibidas
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.08)"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                      }}
                      formatter={(v: number) => [`${v}`, "Mensajes"]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64}>
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent leads */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Mensajes recientes</CardTitle>
              <p className="text-sm text-muted-foreground">Últimas 5 solicitudes</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin?tab=leads">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {leads.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Aún no hay mensajes
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Interés</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Hace</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{lead.name}</span>
                          {lead.phone ? (
                            <a
                              href={`https://wa.me/${waDigits(lead.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-brand-navy hover:underline"
                            >
                              {lead.phone}
                            </a>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:table-cell">
                        {lead.courseInterest ?? "—"}
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {timeAgo(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos cambios</p>
          </CardHeader>
          <CardContent>
            <ActivityPanel limit={8} compact />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
