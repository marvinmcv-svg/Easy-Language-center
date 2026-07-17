import * as React from "react";
import { db } from "@/lib/db";
import { DEFAULT_CONTACT, whatsappLink, LANGUAGES, BRAND } from "@/lib/brand";
import { getPublishedContent } from "@/lib/get-content";
import { GALLERY } from "@/lib/gallery";
import { ElcLogo, ElcWordmark } from "@/components/brand/elc-logo";
import { Flag } from "@/components/brand/flag";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Users,
  Globe,
  GraduationCap,
  UserCheck,
  Sparkles,
  Heart,
  ArrowRight,
  Star,
  Send,
} from "lucide-react";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  const [courses, testimonials, teachers, config, content] = await Promise.all([
    db.course.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true, language: true, title: true, level: true, type: true,
        schedule: true, description: true, price: true, priceNote: true,
        image: true, badge: true, featured: true, order: true,
      },
    }),
    db.testimonial.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, role: true, content: true, rating: true, image: true },
    }),
    db.teacher.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, role: true, bio: true, image: true, languages: true },
    }),
    db.siteConfig.findUnique({ where: { id: "singleton" } }),
    getPublishedContent(),
  ]);
  return { courses, testimonials, teachers, config, content };
}

export async function LandingPage() {
  const { courses, testimonials, teachers, config, content } = await getData();
  const c = content;
  const wa = whatsappLink(
    config?.whatsapp ?? DEFAULT_CONTACT.whatsapp,
    "Hola, quiero información sobre los cursos de Easy Learning Center",
  );
  const phone = config?.phone ?? DEFAULT_CONTACT.phone;
  const email = config?.email ?? DEFAULT_CONTACT.email;
  const address = config?.address ?? DEFAULT_CONTACT.address;

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:py-5">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Easy Learning Center — Inicio">
            <ElcLogo size={56} />
            <ElcWordmark />
          </a>
          <nav className="hidden items-center gap-1 xl:flex">
            {[
              { href: "#inicio", label: "Inicio" },
              { href: "#idiomas", label: "Idiomas" },
              { href: "#cursos", label: "Cursos" },
              { href: "#metodo", label: "Método" },
              { href: "#galeria", label: "Galería" },
              { href: "#testimonios", label: "Testimonios" },
              { href: "#precios", label: "Precios" },
              { href: "#faq", label: "FAQ" },
              { href: "#contacto", label: "Contacto" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-foreground/80 hover:bg-brand-navy/5 hover:text-brand-navy">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="/admin" className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-brand-navy/5 hover:text-foreground sm:inline-block">
              Admin
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#25D366]/30 hover:bg-[#1ebe5d]">
              <MessageCircle className="size-4" /> Inscríbete
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section id="inicio" className="elc-section relative overflow-hidden bg-brand-cream pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="elc-hero-mesh absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-navy shadow-sm backdrop-blur">
                <span className="size-2 rounded-full bg-brand-red" />
                {c.hero.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-navy sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                {c.hero.title.split(new RegExp(`(${c.hero.titleHighlight})`, "i")).map((p, i) =>
                  p.toLowerCase() === c.hero.titleHighlight.toLowerCase()
                    ? <span key={i} className="text-brand-red">{p}</span>
                    : <React.Fragment key={i}>{p}</React.Fragment>
                )}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg lg:mx-0">{c.hero.subtitle}</p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                <a href="#cursos" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 sm:w-auto">
                  {c.hero.primaryCtaLabel} <ArrowRight className="size-4" />
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1ebe5d] sm:w-auto">
                  <MessageCircle className="size-4" /> {c.hero.secondaryCtaLabel}
                </a>
              </div>
              <ul className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4 lg:max-w-xl">
                {[
                  { icon: Globe, label: "6 idiomas" },
                  { icon: GraduationCap, label: "Profesores calificados" },
                  { icon: Clock, label: "Horarios flexibles" },
                  { icon: Users, label: "Grupos pequeños" },
                ].map((b) => (
                  <li key={b.label} className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/60 px-3 py-2 text-xs font-medium text-foreground/80 backdrop-blur">
                    <b.icon className="size-4 shrink-0 text-brand-red" /> {b.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-brand-navy/20">
                <img src="/uploads/hero/elc-hero-classroom.png" alt="Estudiantes aprendiendo idiomas en Easy Learning Center" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-3 z-10 rounded-2xl border border-border bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl bg-brand-navy text-white"><GraduationCap className="size-6" /></div>
                  <div>
                    <p className="text-2xl font-extrabold leading-none text-brand-navy" style={{ fontFamily: "var(--font-display)" }}>{c.hero.statStudents}</p>
                    <p className="text-xs text-muted-foreground">{c.hero.statStudentsLabel}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 border-t border-border pt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-brand-gold text-brand-gold" />)}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">{c.hero.ratingValue} valoración</span>
                </div>
              </div>
              <div className="absolute -right-2 top-6 z-10 rounded-full border border-border bg-white px-3 py-2 shadow-lg">
                <span className="flex items-center gap-1">
                  {LANGUAGES.map((l) => <Flag key={l.code} code={l.flagCode} size={20} />)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Cifras destacadas" className="bg-brand-navy text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4 md:py-12">
            {c.stats.stats.map((s, i) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ?? Globe;
              return (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="size-6 text-brand-gold" />
                  <p className="text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                  <p className="text-xs uppercase tracking-widest text-white/70 md:text-sm">{s.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Languages */}
        <section id="idiomas" className="elc-section bg-brand-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.languages.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.languages.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.languages.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LANGUAGES.map((lang) => (
                <a key={lang.code} href="#cursos" className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-xl">
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${lang.accent}`} />
                  <div className="flex items-start justify-between">
                    <Flag code={lang.flagCode} size={56} bordered />
                    <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy">{lang.nativeName}</span>
                  </div>
                  <p className="mt-6 text-3xl font-extrabold text-brand-navy" style={{ fontFamily: "var(--font-display)" }}>{lang.hello}</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{lang.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lang.blurb}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="cursos" className="elc-section bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.courses.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.courses.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.courses.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const lang = LANGUAGES.find((l) => l.code === course.language);
                const cwa = whatsappLink(DEFAULT_CONTACT.whatsapp, `Hola, quiero más información sobre: ${course.title}`);
                return (
                  <article key={course.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {course.image ? <img src={course.image} alt={course.title} className="h-full w-full object-cover" /> : null}
                      {course.badge ? <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-navy shadow">{course.badge}</span> : null}
                      {course.featured ? <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-navy/85 px-2.5 py-1 text-xs font-semibold text-white"><Star className="size-3 fill-brand-gold text-brand-gold" /> Destacado</span> : null}
                      {lang ? <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-navy"><Flag code={lang.flagCode} size={16} /> {lang.name}</span> : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{course.title}</h3>
                      {course.level ? <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-red">{course.level}</p> : null}
                      {course.description ? <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{course.description}</p> : null}
                      {course.schedule ? <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground"><Clock className="mt-0.5 size-4 shrink-0 text-brand-navy" /><span>{course.schedule}</span></div> : null}
                      <div className="mt-auto pt-5">
                        {course.price ? <div className="mb-3"><span className="text-xl font-extrabold text-brand-navy" style={{ fontFamily: "var(--font-display)" }}>{course.price}</span>{course.priceNote ? <p className="text-xs text-muted-foreground">{course.priceNote}</p> : null}</div> : null}
                        <a href={cwa} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90"><MessageCircle className="size-4" /> Más información</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Method */}
        <section id="metodo" className="elc-section bg-brand-navy py-16 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-gold">{c.method.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.method.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {c.method.steps.map((step, i) => (
                <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
                  <span className="text-6xl font-extrabold text-brand-gold/30" style={{ fontFamily: "var(--font-display)" }}>{step.n}</span>
                  <h3 className="mt-2 text-2xl font-bold text-brand-gold" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="elc-section bg-brand-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.features.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.features.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.features.items.map((item, i) => {
                const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[item.icon] ?? Sparkles;
                return (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md">
                    <div className="grid size-12 place-items-center rounded-xl bg-brand-navy/10 text-brand-navy"><Icon className="size-6" /></div>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="galeria" className="elc-section bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.gallery.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.gallery.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.gallery.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {GALLERY.slice(0, 12).map((g, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-border shadow-sm">
                  <img src={g.url} alt={g.title} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">{g.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section id="profesores" className="elc-section bg-brand-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.teachers.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.teachers.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.teachers.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teachers.map((t) => (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                  <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand-navy text-2xl font-bold text-white">
                    {t.name.split(" ").slice(0, 2).map((p) => p.charAt(0)).join("")}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{t.name}</h3>
                  {t.role ? <p className="text-xs font-medium uppercase tracking-wide text-brand-red">{t.role}</p> : null}
                  {t.bio ? <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p> : null}
                  {t.languages ? <p className="mt-3 text-xs text-muted-foreground">🗣️ {t.languages}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonios" className="elc-section bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.testimonials.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.testimonials.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.testimonials.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex gap-1">{[...Array(t.rating)].map((_, i) => <Star key={i} className="size-4 fill-brand-gold text-brand-gold" />)}</div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.content}"</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    <div className="grid size-10 place-items-center rounded-full bg-brand-navy/10 text-sm font-bold text-brand-navy">{t.name.charAt(0)}</div>
                    <div><p className="text-sm font-bold text-foreground">{t.name}</p>{t.role ? <p className="text-xs text-muted-foreground">{t.role}</p> : null}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="elc-section bg-brand-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.pricing.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.pricing.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.pricing.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.pricing.promos.map((promo, i) => (
                <div key={i} className={`relative rounded-2xl border p-6 shadow-sm ${promo.highlight ? "border-brand-gold bg-white ring-2 ring-brand-gold/30" : "border-border bg-card"}`}>
                  {promo.highlight ? <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase text-brand-navy">Más popular</span> : null}
                  <h3 className="text-lg font-bold text-foreground">{promo.title}</h3>
                  <p className="mt-2 text-3xl font-extrabold text-brand-navy" style={{ fontFamily: "var(--font-display)" }}>{promo.price}</p>
                  <p className="text-xs text-muted-foreground">{promo.note}</p>
                  <ul className="mt-4 space-y-2">{promo.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><span className={`mt-0.5 ${promo.highlight ? "text-brand-gold" : "text-brand-red"}`}>✓</span><span>{f}</span></li>)}</ul>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1ebe5d]"><MessageCircle className="size-4" /> {promo.cta}</a>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{c.pricing.iaesteNote}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="elc-section bg-white py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.faq.eyebrow}</span>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.faq.title}</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.faq.subtitle}</p>
            </div>
            <div className="space-y-3">
              {c.faq.items.map((item, i) => (
                <details key={i} className="group rounded-xl border border-border bg-card p-5 shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-foreground">
                    {item.q}
                    <span className="ml-4 text-brand-navy transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-20">
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">{c.cta.subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[#1ebe5d] sm:w-auto"><MessageCircle className="size-4" /> {c.cta.primaryCtaLabel}</a>
              <a href="#cursos" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto">{c.cta.secondaryCtaLabel} <ArrowRight className="size-4" /></a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contacto" className="elc-section bg-brand-cream py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-block rounded-full bg-brand-navy/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">{c.contact.eyebrow}</span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{c.contact.title}</h2>
                <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.contact.subtitle}</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 text-brand-navy" /><span className="text-sm text-foreground">{address}</span></li>
                  <li className="flex items-start gap-3"><Phone className="mt-0.5 size-5 text-brand-navy" /><div><a href={`tel:${phone}`} className="block text-sm font-medium text-foreground hover:text-brand-navy">{phone}</a></div></li>
                  <li className="flex items-start gap-3"><Mail className="mt-0.5 size-5 text-brand-navy" /><a href={`mailto:${email}`} className="text-sm font-medium text-foreground hover:text-brand-navy">{email}</a></li>
                </ul>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1ebe5d]"><MessageCircle className="size-4" /> WhatsApp</a>
                {config?.mapEmbedUrl ? <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-sm"><iframe src={config.mapEmbedUrl} className="h-64 w-full" loading="lazy" title="Ubicación de Easy Learning Center" /></div> : null}
              </div>
              <form action="/api/leads" method="POST" className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div><label className="mb-1.5 block text-sm font-medium">Nombre completo *</label><input name="name" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-navy" placeholder="Tu nombre" /></div>
                <div><label className="mb-1.5 block text-sm font-medium">Teléfono / WhatsApp *</label><input name="phone" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-navy" placeholder="+591 ..." /></div>
                <div><label className="mb-1.5 block text-sm font-medium">Correo electrónico</label><input name="email" type="email" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-navy" placeholder="tucorreo@email.com" /></div>
                <div><label className="mb-1.5 block text-sm font-medium">Mensaje</label><textarea name="message" rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-navy" placeholder="Cuéntanos sobre tus metas..." /></div>
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90"><Send className="size-4" /> Enviar solicitud</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-5">
              <div className="flex items-center gap-3"><ElcLogo size={56} /><ElcWordmark className="text-white" /></div>
              <p className="text-sm leading-relaxed text-white/70">{c.footer.tagline} {c.footer.description}</p>
              <div className="flex gap-3">
                <a href={config?.instagram ?? DEFAULT_CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-brand-red">IG</a>
                <a href={config?.facebook ?? DEFAULT_CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-brand-red">FB</a>
                <a href={config?.tiktok ?? DEFAULT_CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-brand-red">TT</a>
              </div>
            </div>
            <nav className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Idiomas</h3>
              <ul className="space-y-2 text-sm">{LANGUAGES.map((l) => <li key={l.code}><a href="#idiomas" className="inline-flex items-center gap-2 text-white/75 hover:text-white"><Flag code={l.flagCode} size={18} /> {l.name}</a></li>)}</ul>
            </nav>
            <nav className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Cursos</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#cursos" className="text-white/75 hover:text-white">Inglés general</a></li>
                <li><a href="#cursos" className="text-white/75 hover:text-white">Curso intensivo</a></li>
                <li><a href="#cursos" className="text-white/75 hover:text-white">Clases privadas</a></li>
                <li><a href="#cursos" className="text-white/75 hover:text-white">Inglés para niños</a></li>
                <li><a href="#cursos" className="text-white/75 hover:text-white">Preparación TOEFL</a></li>
              </ul>
            </nav>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-white/75">{phone}</li>
                <li className="text-white/75">{email}</li>
                <li className="text-white/75">{address}</li>
              </ul>
              <a href="/admin" className="text-xs text-white/40 hover:text-white/70">Portal Admin</a>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">© {new Date().getFullYear()} {BRAND.name} — {BRAND.city}</div>
        </div>
      </footer>

      {/* Floating Shirley + WhatsApp buttons (static links) */}
      <a href={wa} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-[60] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 hover:scale-105" aria-label="WhatsApp">
        <MessageCircle className="size-7" />
      </a>
    </div>
  );
}
