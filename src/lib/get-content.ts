import { db } from "@/lib/db";
import {
  SECTIONS,
  DEFAULT_CONTENT,
  parseSection,
  type SectionKey,
  type HeroContent,
  type StatsContent,
  type LanguagesContent,
  type CoursesContent,
  type MethodContent,
  type FeaturesContent,
  type GalleryContent,
  type TeachersContent,
  type TestimonialsContent,
  type PricingContent,
  type FaqContent,
  type CtaContent,
  type ContactContent,
  type FooterContent,
} from "@/lib/content";

export type PublishedContent = {
  hero: HeroContent;
  stats: StatsContent;
  languages: LanguagesContent;
  courses: CoursesContent;
  method: MethodContent;
  features: FeaturesContent;
  gallery: GalleryContent;
  teachers: TeachersContent;
  testimonials: TestimonialsContent;
  pricing: PricingContent;
  faq: FaqContent;
  cta: CtaContent;
  contact: ContactContent;
  footer: FooterContent;
};

/** Fetch all published section content from DB (with defaults fallback). */
export async function getPublishedContent(): Promise<PublishedContent> {
  const rows = await db.siteContent.findMany();
  const bySection = new Map(rows.map((r) => [r.section, r]));
  const out = {} as Record<SectionKey, unknown>;
  for (const def of SECTIONS) {
    const row = bySection.get(def.key);
    out[def.key] = parseSection(row?.published, DEFAULT_CONTENT[def.key]);
  }
  return out as PublishedContent;
}
