"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ElcLogo } from "@/components/brand/elc-logo";
import { Login } from "@/components/admin/login";
import { Sidebar, type TabKey } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import {
  CommandPalette,
  useCommandPaletteToggle,
} from "@/components/admin/command-palette";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAuth,
  useLogout,
  useLeads,
} from "@/components/admin/use-admin-data";

// Lazy-load every manager so the initial admin bundle stays small.
// Each manager compiles + loads on demand, keeping memory low.
const Dashboard = dynamic(
  () => import("@/components/admin/dashboard").then((m) => m.Dashboard),
  { ssr: false, loading: () => <TabLoading /> },
);
const CoursesManager = dynamic(
  () => import("@/components/admin/courses-manager").then((m) => m.CoursesManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const LeadsManager = dynamic(
  () => import("@/components/admin/leads-manager").then((m) => m.LeadsManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const ContentManager = dynamic(
  () => import("@/components/admin/content-manager").then((m) => m.ContentManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const MediaManager = dynamic(
  () => import("@/components/admin/media-manager").then((m) => m.MediaManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const TestimonialsManager = dynamic(
  () => import("@/components/admin/testimonials-manager").then((m) => m.TestimonialsManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const TeachersManager = dynamic(
  () => import("@/components/admin/teachers-manager").then((m) => m.TeachersManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const SettingsManager = dynamic(
  () => import("@/components/admin/settings-manager").then((m) => m.SettingsManager),
  { ssr: false, loading: () => <TabLoading /> },
);
const ActivityPanel = dynamic(
  () => import("@/components/admin/activity-panel").then((m) => m.ActivityPanel),
  { ssr: false, loading: () => <TabLoading /> },
);

function TabLoading() {
  return (
    <div className="flex items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      <span className="ml-2 text-sm">Cargando…</span>
    </div>
  );
}

const queryOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
};

function useAdminQueryClient() {
  const [qc] = React.useState(
    () => new QueryClient({ defaultOptions: queryOptions }),
  );
  return qc;
}

const VALID_TABS: TabKey[] = [
  "dashboard",
  "courses",
  "leads",
  "content",
  "media",
  "testimonials",
  "teachers",
  "activity",
  "settings",
];

function parseTab(value: string | null): TabKey {
  if (value && VALID_TABS.includes(value as TabKey)) {
    return value as TabKey;
  }
  return "dashboard";
}

function ActiveTab({ tab }: { tab: TabKey }) {
  switch (tab) {
    case "dashboard":
      return null; // rendered with admin context below
    case "courses":
      return <CoursesManager />;
    case "leads":
      return <LeadsManager />;
    case "content":
      return <ContentManager />;
    case "media":
      return <MediaManager />;
    case "testimonials":
      return <TestimonialsManager />;
    case "teachers":
      return <TeachersManager />;
    case "activity":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registro de actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityPanel limit={50} />
          </CardContent>
        </Card>
      );
    case "settings":
      return <SettingsManager />;
    default:
      return null;
  }
}

function AdminShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));
  const { data: auth } = useAuth();
  const logout = useLogout();
  const { data: leads } = useLeads();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  useCommandPaletteToggle(() => setPaletteOpen((v) => !v));

  const newLeads = React.useMemo(
    () => (leads ?? []).filter((l) => l.status === "new").length,
    [leads],
  );

  function handleSelect(t: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", t);
    router.replace(`/admin?${params.toString()}`, { scroll: false });
  }

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } catch {
      /* ignore — the auth query will be invalidated anyway */
    }
  }

  if (!auth?.admin) {
    // Shouldn't normally happen — guarded by parent
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar
        active={tab}
        onSelect={handleSelect}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        badges={{ leads: newLeads }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          active={tab}
          admin={auth.admin}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleLogout}
          loggingOut={logout.isPending}
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={handleSelect}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          {tab === "dashboard" ? (
            <Dashboard admin={auth.admin} />
          ) : (
            <ActiveTab tab={tab} />
          )}
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNavigate={handleSelect}
        onLogout={handleLogout}
      />
    </div>
  );
}

function AuthGate() {
  const { data: auth, isLoading, isError, refetch } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-navy text-white">
        <ElcLogo size={72} />
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Loader2 className="size-4 animate-spin" /> Cargando panel…
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No pudimos verificar tu sesión.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!auth?.authenticated) {
    return <Login onLogin={() => refetch()} />;
  }

  return <AdminShell />;
}

/**
 * AdminPortal — entry point rendered by `/` when `?view=admin`.
 *
 * Sets up a local TanStack Query client (so we don't have to modify the root
 * layout) and an auth gate that shows either the login screen or the admin
 * shell. Tab routing is handled via the `tab` search param.
 */
export function AdminPortal() {
  const qc = useAdminQueryClient();
  return (
    <QueryClientProvider client={qc}>
      <React.Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-brand-navy text-white">
            <Loader2 className="size-5 animate-spin" />
          </div>
        }
      >
        <AuthGate />
      </React.Suspense>
    </QueryClientProvider>
  );
}
