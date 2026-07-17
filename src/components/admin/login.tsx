"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { ElcLogo } from "@/components/brand/elc-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/components/admin/use-admin-data";

interface LoginProps {
  /** Called after a successful login so the parent can refresh auth state. */
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const login = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Ingresa tu correo y contraseña");
      return;
    }
    try {
      await login.mutateAsync({ email: email.trim(), password });
      toast.success("Bienvenido al panel de administración");
      onLogin();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo iniciar sesión",
      );
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-4 py-12">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(900px 500px at 15% 20%, rgba(251,191,36,0.18), transparent 60%), radial-gradient(800px 480px at 85% 80%, rgba(230,57,70,0.18), transparent 60%)",
        }}
      />
      <div className="absolute -top-24 -left-24 size-64 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 size-72 rounded-full bg-brand-gold/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <ElcLogo size={88} className="drop-shadow-lg" />
          <h1
            className="mt-4 text-3xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ELC Admin
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Panel de administración · Easy Learning Center
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8"
        >
          <div className="mb-5 flex items-center gap-2 text-brand-navy">
            <ShieldCheck className="size-5" />
            <h2 className="text-lg font-semibold">Iniciar sesión</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@easylearning.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full bg-brand-navy text-white hover:bg-brand-navy/90"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Ingresando…
              </>
            ) : (
              "Ingresar"
            )}
          </Button>

          <div className="mt-5 rounded-lg border border-dashed border-brand-gold/40 bg-brand-gold/10 p-3 text-xs text-brand-navy">
            <p className="font-semibold">Credenciales de demo</p>
            <p className="mt-1 text-muted-foreground">
              <span className="font-mono">admin@easylearning.com</span>
              <br />
              <span className="font-mono">elc-admin-2026</span>
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Easy Learning Center — Santa Cruz, Bolivia
        </p>
      </div>
    </div>
  );
}
