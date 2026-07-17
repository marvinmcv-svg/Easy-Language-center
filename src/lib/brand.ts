// Central brand & content configuration for Easy Learning Center (ELC)
// Single source of truth for brand identity used across landing + admin.

export const BRAND = {
  name: "Easy Learning Center",
  shortName: "ELC",
  city: "Santa Cruz, Bolivia",
  tagline: "Aprende. Practica. Avanza.",
  heroSlogan: "¡Aprende hoy, abre tu futuro!",
  currency: "Bs",
  foundedNote: "Santa Cruz, Bolivia",
} as const;

export const DEFAULT_CONTACT = {
  phone: "+591 77385885",
  phone2: "+591 76638081",
  whatsapp: "+591 77385885",
  email: "info@easylearningcenter.com",
  address:
    "Zona norte, Radial 27, entre 4to y 5to anillo, calle Río Negro #13, Santa Cruz, Bolivia",
  instagram: "https://www.instagram.com/easylearningcenterscz/",
  facebook: "https://www.facebook.com/EasyLearningSC",
  tiktok: "https://www.tiktok.com/@easy.learning.cen",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Radial%2027%20Santa%20Cruz%20Bolivia&output=embed",
} as const;

// Whatsapp deep link helper
export function whatsappLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export type LanguageCode =
  | "english"
  | "italian"
  | "portuguese"
  | "french"
  | "german"
  | "spanish";

export interface LanguageInfo {
  code: LanguageCode;
  name: string; // Spanish display name
  nativeName: string;
  hello: string; // native greeting
  flag: string; // emoji flag (fallback only)
  flagCode: string; // ISO 3166-1 alpha-2 country code for SVG flag
  accent: string; // tailwind gradient classes
  blurb: string;
}

export const LANGUAGES: LanguageInfo[] = [
  {
    code: "english",
    name: "Inglés",
    nativeName: "English",
    hello: "Hello!",
    flag: "🇺🇸",
    flagCode: "us",
    accent: "from-[#0B2A5B] to-[#1E40AF]",
    blurb:
      "El idioma global por excelencia. Para estudiar, trabajar y viajar sin fronteras.",
  },
  {
    code: "italian",
    name: "Italiano",
    nativeName: "Italiano",
    hello: "Ciao!",
    flag: "🇮🇹",
    flagCode: "it",
    accent: "from-[#2A9D8F] to-[#1B998B]",
    blurb:
      "La lengua del arte, la gastronomía y la dolce vita. ¡Parla italiano!",
  },
  {
    code: "portuguese",
    name: "Portugués",
    nativeName: "Português",
    hello: "Olá!",
    flag: "🇧🇷",
    flagCode: "br",
    accent: "from-[#2A9D8F] to-[#06A77D]",
    blurb:
      "Ideal para estudiar o trabajar en Brasil y Portugal. Tu puerta al mundo lusófono.",
  },
  {
    code: "french",
    name: "Francés",
    nativeName: "Français",
    hello: "Bonjour!",
    flag: "🇫🇷",
    flagCode: "fr",
    accent: "from-[#7C3AED] to-[#5B21B6]",
    blurb:
      "El idioma del amor, la cultura y la diplomacia. Parlons français !",
  },
  {
    code: "german",
    name: "Alemán",
    nativeName: "Deutsch",
    hello: "Hallo!",
    flag: "🇩🇪",
    flagCode: "de",
    accent: "from-[#B45309] to-[#92400E]",
    blurb:
      "La lengua de la ingeniería y la oportunidad. Para estudiar y crecer en Europa.",
  },
  {
    code: "spanish",
    name: "Español",
    nativeName: "Español",
    hello: "¡Hola!",
    flag: "🇪🇸",
    flagCode: "es",
    accent: "from-[#E63946] to-[#C1121F]",
    blurb:
      "Para extranjeros que quieren dominar el segundo idioma más hablado del mundo.",
  },
];

export const COURSE_TYPES = [
  { value: "private", label: "Clases Privadas", icon: "User" },
  { value: "group", label: "Clases Grupales", icon: "Users" },
  { value: "intensive", label: "Curso Intensivo", icon: "Zap" },
  { value: "kids", label: "Niños (7-12)", icon: "GraduationCap" },
  { value: "adults", label: "Adultos", icon: "Briefcase" },
  { value: "exam", label: "Prep. Exámenes", icon: "Award" },
  { value: "online", label: "Online", icon: "Monitor" },
  { value: "counseling", label: "Asesoramiento", icon: "HeartHandshake" },
] as const;

export const SELLING_POINTS = [
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
] as const;

export const STEPS = [
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
] as const;

export const FAQS = [
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
] as const;
