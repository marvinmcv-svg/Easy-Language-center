"use client";

/**
 * Shared data hooks for the ELC admin portal.
 *
 * Built on TanStack Query. Each hook returns the normalized list of records
 * plus the underlying query state. Mutation helpers are exposed from this
 * module so managers can invalidate queries after writes.
 */
import * as React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

// ---------------------------- Types ----------------------------

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  authenticated: boolean;
  admin?: AdminUser;
}

export interface Course {
  id: string;
  language: string;
  title: string;
  level: string | null;
  type: string;
  schedule: string | null;
  description: string | null;
  price: string | null;
  priceNote: string | null;
  image: string | null;
  badge: string | null;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = "new" | "contacted" | "enrolled" | "archived";

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  courseInterest: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image: string | null;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image: string | null;
  languages: string | null;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mime: string;
  size: number;
  alt: string | null;
  createdAt: string;
}

export interface SiteConfig {
  id: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  heroTitle: string;
  heroSubtitle: string;
  mapEmbedUrl: string;
  updatedAt: string;
}

export interface Stats {
  leads: number;
  leadsNew: number;
  courses: number;
  testimonials: number;
  teachers: number;
  media: number;
  byStatus: { new: number; contacted: number; enrolled: number; archived: number };
}

// ---------------------------- Fetch helpers ----------------------------

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init?.headers ?? {}),
    },
    credentials: "same-origin",
  });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error || data?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

// ---------------------------- Query keys ----------------------------

export const qk = {
  auth: ["auth"] as const,
  courses: ["courses"] as const,
  leads: ["leads"] as const,
  testimonials: ["testimonials"] as const,
  teachers: ["teachers"] as const,
  media: ["media"] as const,
  settings: ["settings"] as const,
  stats: ["stats"] as const,
  content: ["content"] as const,
  activity: ["activity"] as const,
};

// ---------------------------- Auth ----------------------------

export function useAuth() {
  return useQuery<AuthState>({
    queryKey: qk.auth,
    queryFn: () => fetchJson<AuthState>("/api/auth/me"),
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      fetchJson<{ ok: true; admin: AdminUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.auth });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchJson<{ ok: true }>("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.auth });
      qc.setQueryData(qk.auth, { authenticated: false });
    },
  });
}

// ---------------------------- Courses ----------------------------

export function useCourses(): UseQueryResult<Course[]> {
  const q = useQuery({
    queryKey: qk.courses,
    queryFn: async () => {
      const data = await fetchJson<{ courses: Course[] }>("/api/courses");
      return data.courses;
    },
  });
  return q;
}

export function useCourseMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (input: Partial<Course>) =>
      fetchJson<{ course: Course }>("/api/courses", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.courses }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...patch }: Partial<Course> & { id: string }) =>
      fetchJson<{ course: Course }>(`/api/courses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.courses }),
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/courses/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.courses }),
  });
  return { create, update, remove };
}

// ---------------------------- Leads ----------------------------

export function useLeads(): UseQueryResult<Lead[]> {
  const q = useQuery({
    queryKey: qk.leads,
    queryFn: async () => {
      const data = await fetchJson<{ leads: Lead[] }>("/api/leads");
      return data.leads;
    },
  });
  return q;
}

export function useLeadMutations() {
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: ({ id, ...patch }: Partial<Lead> & { id: string }) =>
      fetchJson<{ lead: Lead }>(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/leads/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.leads });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
  return { update, remove };
}

// ---------------------------- Testimonials ----------------------------

export function useTestimonials(): UseQueryResult<Testimonial[]> {
  const q = useQuery({
    queryKey: qk.testimonials,
    queryFn: async () => {
      const data = await fetchJson<{ testimonials: Testimonial[] }>(
        "/api/testimonials",
      );
      return data.testimonials;
    },
  });
  return q;
}

export function useTestimonialMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (input: Partial<Testimonial>) =>
      fetchJson<{ testimonial: Testimonial }>("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.testimonials }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...patch }: Partial<Testimonial> & { id: string }) =>
      fetchJson<{ testimonial: Testimonial }>(`/api/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.testimonials }),
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/testimonials/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.testimonials }),
  });
  return { create, update, remove };
}

// ---------------------------- Teachers ----------------------------

export function useTeachers(): UseQueryResult<Teacher[]> {
  const q = useQuery({
    queryKey: qk.teachers,
    queryFn: async () => {
      const data = await fetchJson<{ teachers: Teacher[] }>("/api/teachers");
      return data.teachers;
    },
  });
  return q;
}

export function useTeacherMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (input: Partial<Teacher>) =>
      fetchJson<{ teacher: Teacher }>("/api/teachers", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.teachers }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...patch }: Partial<Teacher> & { id: string }) =>
      fetchJson<{ teacher: Teacher }>(`/api/teachers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.teachers }),
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/teachers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.teachers }),
  });
  return { create, update, remove };
}

// ---------------------------- Media ----------------------------

export function useMedia(): UseQueryResult<MediaAsset[]> {
  const q = useQuery({
    queryKey: qk.media,
    queryFn: async () => {
      const data = await fetchJson<{ media: MediaAsset[] }>("/api/media");
      return data.media;
    },
  });
  return q;
}

export function useMediaMutations() {
  const qc = useQueryClient();
  const upload = useMutation({
    mutationFn: ({ file, alt }: { file: File; alt?: string }) => {
      const fd = new FormData();
      fd.append("file", file);
      if (alt) fd.append("alt", alt);
      return fetchJson<{ media: MediaAsset }>("/api/media", {
        method: "POST",
        body: fd,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.media }),
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/media/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.media }),
  });
  return { upload, remove };
}

// ---------------------------- Settings ----------------------------

export function useSettings(): UseQueryResult<SiteConfig> {
  const q = useQuery({
    queryKey: qk.settings,
    queryFn: async () => {
      const data = await fetchJson<{ config: SiteConfig }>("/api/settings");
      return data.config;
    },
  });
  return q;
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<SiteConfig>) =>
      fetchJson<{ config: SiteConfig }>("/api/settings", {
        method: "PUT",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.settings }),
  });
}

// ---------------------------- Stats ----------------------------

export function useStats(): UseQueryResult<Stats> {
  const q = useQuery({
    queryKey: qk.stats,
    queryFn: async () => {
      const data = await fetchJson<Stats>("/api/stats");
      return data;
    },
  });
  return q;
}

// ---------------------------- Content (CMS) ----------------------------

export interface ContentSection {
  id: string;
  label: string;
  published: unknown;
  draft?: unknown;
  updatedAt?: string;
}

export function useContent(): UseQueryResult<{ sections: Record<string, ContentSection> }> {
  const q = useQuery({
    queryKey: qk.content,
    queryFn: async () => {
      const data = await fetchJson<{ sections: Record<string, ContentSection> }>(
        "/api/content",
      );
      return data;
    },
  });
  return q;
}

export function useSaveContentDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      fetchJson<{ ok: true }>(`/api/content/${id}`, {
        method: "PUT",
        body: JSON.stringify({ data }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.content }),
  });
}

export function usePublishContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      fetchJson<{ ok: true }>(`/api/content/${id}`, {
        method: "POST",
        body: JSON.stringify({ data }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.content });
      qc.invalidateQueries({ queryKey: qk.activity });
    },
  });
}

export function useResetContentDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      fetchJson<{ ok: true }>(`/api/content/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.content }),
  });
}

// ---------------------------- Activity log ----------------------------

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string;
  createdAt: string;
}

export function useActivity(): UseQueryResult<ActivityEntry[]> {
  const q = useQuery({
    queryKey: qk.activity,
    queryFn: async () => {
      const data = await fetchJson<{ logs: ActivityEntry[] }>("/api/activity");
      return data.logs;
    },
    staleTime: 30_000,
  });
  return q;
}

// ---------------------------- Misc helpers ----------------------------

export function formatBytes(n: number): string {
  if (!n) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function waDigits(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}
