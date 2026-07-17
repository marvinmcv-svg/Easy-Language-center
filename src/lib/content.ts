// Structured content schema for ALL editable landing-page copy.
// Each section has a typed shape. The admin edits these; the landing page
// reads the `published` version. Defaults (DEFAULT_CONTENT) are seeded into
// the DB and also used as fallbacks.

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleHighlight: string; // word to highlight in red
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  statStudents: string;
  statStudentsLabel: string;
  ratingValue: string;
}

export interface StatsContent {
  stats: { value: string; label: string; icon: string }[];
}

export interface LanguagesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface CoursesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface MethodContent {
  eyebrow: string;
  title: string;
  steps: { n: string; title: string; desc: string }[];
}

export interface FeaturesContent {
  eyebrow: string;
  title: string;
  items: { icon: string; title: string; desc: string }[];
}

export interface GalleryContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface TeachersContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface PricingContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  promos: {
    title: string;
    price: string;
    note: string;
    features: string[];
    cta: string;
    highlight: boolean;
  }[];
  iaesteNote: string;
}

export interface FaqContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  items: { q: string; a: string }[];
}

export interface CtaContent {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface FooterContent {
  tagline: string;
  description: string;
}

export type SectionKey =
  | "hero"
  | "stats"
  | "languages"
  | "courses"
  | "method"
  | "features"
  | "gallery"
  | "teachers"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "contact"
  | "footer";

export interface SectionDef<T> {
  key: SectionKey;
  label: string;
  description: string;
  defaults: T;
}

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Santa Cruz, Bolivia · Presencial & Virtual",
  title: "Aprende un nuevo idioma hoy",
  titleHighlight: "idioma",
  subtitle:
    "Clases de inglés, italiano, portugués, francés, alemán y español. Presenciales y virtuales, con profesores calificados y horarios flexibles en Santa Cruz, Bolivia.",
  primaryCtaLabel: "Ver cursos",
  secondaryCtaLabel: "WhatsApp",
  statStudents: "+500",
  statStudentsLabel: "estudiantes felices",
  ratingValue: "4.9/5",
};

export const DEFAULT_STATS: StatsContent = {
  stats: [
    { value: "6", label: "Idiomas", icon: "Globe" },
    { value: "+500", label: "Estudiantes", icon: "GraduationCap" },
    { value: "Presencial", label: "& Virtual", icon: "Users" },
    { value: "Horarios", label: "Flexibles", icon: "Clock" },
  ],
};

export const DEFAULT_LANGUAGES: LanguagesContent = {
  eyebrow: "6 idiomas · 1 academia",
  title: "Elige tu próximo idioma",
  subtitle:
    "Desde el inglés hasta el alemán, te acompañamos en cada paso de tu camino polyglota.",
};

export const DEFAULT_COURSES: CoursesContent = {
  eyebrow: "Cursos disponibles",
  title: "Nuestros cursos",
  subtitle:
    "Elige el formato que se adapte a ti: clases grupales, privadas, intensivas o para niños.",
};

export const DEFAULT_METHOD: MethodContent = {
  eyebrow: "Nuestro método",
  title: "Aprende. Practica. Avanza.",
  steps: [
    {
      n: "01",
      title: "Aprende",
      desc: "Domina gramática, vocabulario y pronunciación con clases estructuradas y didácticas.",
    },
    {
      n: "02",
      title: "Practica",
      desc: "Conversación real, ejercicios dinámicos y actividades que llevan el idioma a tu vida.",
    },
    {
      n: "03",
      title: "Avanza",
      desc: "Sube de nivel, certifícate y abre las puertas del mundo a tu futuro.",
    },
  ],
};

export const DEFAULT_FEATURES: FeaturesContent = {
  eyebrow: "¿Por qué elegirnos?",
  title: "¿Por qué elegir Easy Learning Center?",
  items: [
    {
      icon: "UserCheck",
      title: "Profesores calificados",
      desc: "Docentes especializados con experiencia comprobada y metodología pedagógica.",
    },
    {
      icon: "Sparkles",
      title: "Método fácil y efectivo",
      desc: "Clases dinámicas, prácticas y divertidas para que aprendas desde cero.",
    },
    {
      icon: "Heart",
      title: "Ambiente amigable",
      desc: "Una comunidad que te impulsa a hablar con confianza y alcanzar tus metas.",
    },
    {
      icon: "Clock",
      title: "Horarios flexibles",
      desc: "Nos adaptamos a tu tiempo con grupos matutinos, vespertinos y sabatinos.",
    },
    {
      icon: "Users",
      title: "Grupos pequeños",
      desc: "Cupos limitados para garantizar atención personalizada en cada clase.",
    },
    {
      icon: "Globe",
      title: "Presencial y virtual",
      desc: "Aprende en nuestras aulas o desde cualquier lugar del mundo.",
    },
  ],
};

export const DEFAULT_GALLERY: GalleryContent = {
  eyebrow: "Vida en ELC",
  title: "Galería",
  subtitle:
    "Un vistazo a nuestras clases, eventos y la energía de aprender idiomas en comunidad.",
};

export const DEFAULT_TEACHERS: TeachersContent = {
  eyebrow: "Nuestro equipo",
  title: "Conoce a tus profesores",
  subtitle:
    "Docentes apasionados y calificados, listos para guiarte en tu camino polyglota.",
};

export const DEFAULT_TESTIMONIALS: TestimonialsContent = {
  eyebrow: "Testimonios",
  title: "Lo que dicen nuestros estudiantes",
  subtitle:
    "Historias reales de personas que ya están hablando un nuevo idioma gracias a ELC.",
};

export const DEFAULT_PRICING: PricingContent = {
  eyebrow: "Promociones",
  title: "Inscríbete con los mejores precios",
  subtitle:
    "Ofertas y planes flexibles para que empezar a aprender sea más fácil que nunca.",
  promos: [
    {
      title: "Curso Intensivo de Inglés",
      price: "1000 Bs/mes",
      note: "Lunes a Jueves · 7:00 pm - 9:00 pm",
      features: [
        "4 clases por semana",
        "Avanza más rápido",
        "Método intensivo comprobado",
        "Material incluido",
      ],
      cta: "Inscríbete ahora",
      highlight: true,
    },
    {
      title: "20% de descuento",
      price: "Early bird",
      note: "Inscribiéndote esta semana",
      features: [
        "Válido para todos los cursos",
        "Cupos limitados",
        "Aplica para clases grupales",
      ],
      cta: "Aprovechar oferta",
      highlight: false,
    },
    {
      title: "Sin matrícula",
      price: "0 Bs",
      note: "Inscripciones sin matrícula",
      features: [
        "Sin costo de ingreso",
        "Clases privadas",
        "Horarios flexibles",
      ],
      cta: "Más información",
      highlight: false,
    },
    {
      title: "Clases Privadas",
      price: "Consultar",
      note: "Atención 1 a 1 personalizada",
      features: [
        "100% enfocadas en ti",
        "Horarios a tu medida",
        "Avanza a tu ritmo",
      ],
      cta: "Solicitar info",
      highlight: false,
    },
  ],
  iaesteNote:
    "¿Eres estudiante IAESTE? Pregunta por nuestro descuento especial al escribirnos.",
};

export const DEFAULT_FAQ: FaqContent = {
  eyebrow: "Preguntas frecuentes",
  title: "Resolvemos tus dudas",
  subtitle:
    "Resolvemos las preguntas más comunes antes de empezar tu próximo idioma. Si necesitas más info, escríbenos por WhatsApp.",
  ctaLabel: "Preguntar por WhatsApp",
  items: [
    {
      q: "¿Qué idiomas enseñan?",
      a: "Ofrecemos clases de inglés, italiano, portugués, francés, alemán y español, tanto para principiantes como para niveles avanzados.",
    },
    {
      q: "¿Las clases son presenciales o virtuales?",
      a: "Ambas. Puedes aprender en nuestras aulas en Santa Cruz o de forma 100% virtual desde cualquier lugar.",
    },
    {
      q: "¿Ofrecen clases privadas y grupales?",
      a: "Sí. Contamos con clases privadas 1 a 1 con horarios flexibles y clases grupales con cupos limitados para una atención personalizada.",
    },
    {
      q: "¿Preparan para exámenes internacionales?",
      a: "Por supuesto. Te preparamos para TOEFL y otros exámenes internacionales y universitarios con estrategias comprobadas y resultados reales.",
    },
    {
      q: "¿Hay clases para niños?",
      a: "Sí, tenemos grupos especiales para niños de 7 a 12 años con horarios de tarde y sábados, y solo 8 cupos por grupo.",
    },
    {
      q: "¿Cómo me inscribo?",
      a: "Escríbenos por WhatsApp al +591 77385885 o completa el formulario de contacto y te asesoraremos para elegir el curso ideal para ti.",
    },
  ],
};

export const DEFAULT_CTA: CtaContent = {
  title: "¿Listo para empezar tu viaje?",
  subtitle:
    "Inscríbete hoy y únete a más de 500 estudiantes que ya están aprendiendo un nuevo idioma con Easy Learning Center.",
  primaryCtaLabel: "Inscríbete por WhatsApp",
  secondaryCtaLabel: "Ver cursos",
};

export const DEFAULT_CONTACT: ContactContent = {
  eyebrow: "Contacto",
  title: "¿Hablamos?",
  subtitle:
    "Escríbenos por WhatsApp o completa el formulario. Te respondemos muy pronto.",
};

export const DEFAULT_FOOTER: FooterContent = {
  tagline: "Aprende. Practica. Avanza.",
  description:
    "Academia de idiomas en Santa Cruz, Bolivia. Clases presenciales y virtuales con profesores calificados.",
};

export const SECTIONS: SectionDef<unknown>[] = [
  {
    key: "hero",
    label: "Hero / Portada",
    description: "La primera sección que ven los visitantes.",
    defaults: DEFAULT_HERO,
  },
  {
    key: "stats",
    label: "Cifras destacadas",
    description: "La franja con números clave (idiomas, estudiantes, etc.).",
    defaults: DEFAULT_STATS,
  },
  {
    key: "languages",
    label: "Sección Idiomas",
    description: "Encabezado de la grilla de 6 idiomas.",
    defaults: DEFAULT_LANGUAGES,
  },
  {
    key: "courses",
    label: "Sección Cursos",
    description: "Encabezado sobre la grilla de cursos.",
    defaults: DEFAULT_COURSES,
  },
  {
    key: "method",
    label: "Método (Aprende/Practica/Avanza)",
    description: "Los 3 pasos del método ELC.",
    defaults: DEFAULT_METHOD,
  },
  {
    key: "features",
    label: "Por qué elegirnos",
    description: "La grilla de ventajas (profesores, método, ambiente, etc.).",
    defaults: DEFAULT_FEATURES,
  },
  {
    key: "gallery",
    label: "Galería",
    description: "Encabezado de la galería de imágenes.",
    defaults: DEFAULT_GALLERY,
  },
  {
    key: "teachers",
    label: "Profesores",
    description: "Encabezado de la sección de profesores.",
    defaults: DEFAULT_TEACHERS,
  },
  {
    key: "testimonials",
    label: "Testimonios",
    description: "Encabezado del carrusel de testimonios.",
    defaults: DEFAULT_TESTIMONIALS,
  },
  {
    key: "pricing",
    label: "Precios y Promociones",
    description: "Las tarjetas de promociones y la nota IAESTE.",
    defaults: DEFAULT_PRICING,
  },
  {
    key: "faq",
    label: "Preguntas frecuentes",
    description: "Encabezado + lista de preguntas y respuestas.",
    defaults: DEFAULT_FAQ,
  },
  {
    key: "cta",
    label: "Llamado a la acción",
    description: "La franja azul '¿Listo para empezar?'",
    defaults: DEFAULT_CTA,
  },
  {
    key: "contact",
    label: "Contacto",
    description: "Encabezado del formulario de contacto.",
    defaults: DEFAULT_CONTACT,
  },
  {
    key: "footer",
    label: "Pie de página",
    description: "El tagline y descripción del footer.",
    defaults: DEFAULT_FOOTER,
  },
];

export const DEFAULT_CONTENT: Record<SectionKey, unknown> = SECTIONS.reduce(
  (acc, s) => {
    acc[s.key] = s.defaults;
    return acc;
  },
  {} as Record<SectionKey, unknown>,
);

// Helper: safely parse a section's JSON, falling back to defaults.
export function parseSection<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(json) as Partial<T>) };
  } catch {
    return fallback;
  }
}
