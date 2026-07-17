// Seed script for Easy Learning Center.
// Run with: bun run scripts/seed.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { DEFAULT_CONTACT } from "../src/lib/brand";
import { COURSE_IMAGES } from "../src/lib/gallery";
import { SECTIONS } from "../src/lib/content";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Admin ----
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@easylearning.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "elc-admin-2026";
  const adminName = process.env.ADMIN_NAME ?? "Administrador ELC";
  const passwordHash = hashPassword(adminPassword);
  await db.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
    },
  });
  console.log(`✓ Admin user (${adminEmail})`);

  // ---- Site config ----
  await db.siteConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: DEFAULT_CONTACT.phone,
      phone2: DEFAULT_CONTACT.phone2,
      whatsapp: DEFAULT_CONTACT.whatsapp,
      email: DEFAULT_CONTACT.email,
      address: DEFAULT_CONTACT.address,
      instagram: DEFAULT_CONTACT.instagram,
      facebook: DEFAULT_CONTACT.facebook,
      tiktok: DEFAULT_CONTACT.tiktok,
      heroTitle: "Aprende un nuevo idioma hoy",
      heroSubtitle:
        "Clases de inglés, italiano, portugués, francés, alemán y español. Presenciales y virtuales, con profesores calificados y horarios flexibles en Santa Cruz, Bolivia.",
      mapEmbedUrl: DEFAULT_CONTACT.mapEmbedUrl,
    },
  });
  console.log("✓ Site config");

  // ---- Courses ----
  await db.course.deleteMany({});
  const courses = [
    {
      language: "english",
      title: "Inglés General — Nivel 1",
      level: "Nivel 1 (Inicial)",
      type: "group",
      schedule: "Lunes y Miércoles, 7:00 - 9:00 pm",
      description:
        "Clases dinámicas, prácticas y divertidas. Mejora tu inglés desde cero con un método fácil y efectivo, en un ambiente amigable.",
      price: "Desde 650 Bs/mes",
      priceNote: "20% de descuento inscribiéndote esta semana",
      image: COURSE_IMAGES.englishAdults,
      badge: "Más popular",
      featured: true,
      order: 1,
    },
    {
      language: "english",
      title: "Inglés para Niños",
      level: "7 a 12 años",
      type: "kids",
      schedule: "Lun/Mié 15-17h · Mar/Jue 16-18h · Sáb 9-12h",
      description:
        "Grupos reducidos de solo 8 cupos para que tu hijo aprenda inglés jugando. Aprender inglés desde niños es abrir puertas al futuro.",
      price: "Consultar",
      priceNote: "Solo 8 cupos por grupo",
      image: COURSE_IMAGES.englishKids,
      badge: "Niños",
      featured: true,
      order: 2,
    },
    {
      language: "english",
      title: "Curso Intensivo de Inglés",
      level: "Todos los niveles",
      type: "intensive",
      schedule: "Lunes a Jueves, 7:00 pm - 9:00 pm",
      description:
        "Aprende, practica y avanza más rápido. 4 días a la semana para acelerar tu progreso. Mínimo 5 estudiantes por grupo.",
      price: "1000 Bs/mes",
      priceNote: "Inscripciones abiertas",
      image: COURSE_IMAGES.englishIntensive,
      badge: "Intensivo",
      featured: true,
      order: 3,
    },
    {
      language: "english",
      title: "Clases Privadas de Inglés",
      level: "Todos los niveles",
      type: "private",
      schedule: "Horarios flexibles",
      description:
        "Atención 1 a 1, 100% enfocada en ti y tus objetivos. Avanza a tu ritmo, habla con confianza y alcanza tus metas.",
      price: "Consultar",
      priceNote: "Personalizado",
      image: COURSE_IMAGES.englishPrivate,
      badge: "1 a 1",
      featured: true,
      order: 4,
    },
    {
      language: "english",
      title: "Preparación TOEFL",
      level: "Avanzado",
      type: "exam",
      schedule: "Horarios coordinados",
      description:
        "Desarrolla las habilidades de Reading, Listening, Speaking y Writing para alcanzar el puntaje que te abrirá nuevas oportunidades académicas y profesionales.",
      price: "Consultar",
      priceNote: "Presencial y online",
      image: COURSE_IMAGES.toefl,
      badge: "Examen internacional",
      featured: true,
      order: 5,
    },
    {
      language: "italian",
      title: "Clases de Italiano — Nivel Inicial",
      level: "Nivel Inicial",
      type: "group",
      schedule: "Martes y Jueves, 9:30 - 11:30 am",
      description:
        "Parla italiano e apri le porte del mondo! Clases privadas o grupales en todos los niveles, con profesores especializados.",
      price: "Consultar",
      priceNote: "Todos los niveles",
      image: COURSE_IMAGES.italian,
      badge: "Italiano",
      featured: true,
      order: 6,
    },
    {
      language: "german",
      title: "Clases de Alemán",
      level: "Todos los niveles",
      type: "private",
      schedule: "Horarios flexibles",
      description:
        "Clases privadas o grupales en todos los niveles. La lengua de la ingeniería y la oportunidad europea.",
      price: "Consultar",
      priceNote: "Privadas o grupales",
      image: COURSE_IMAGES.german,
      badge: "Alemán",
      featured: false,
      order: 7,
    },
    {
      language: "portuguese",
      title: "Clases de Portugués",
      level: "Todos los niveles",
      type: "private",
      schedule: "Horarios flexibles",
      description:
        "Clases para estudiar en Brasil y Portugal. Inscripciones sin matrícula, clases privadas personalizadas.",
      price: "Consultar",
      priceNote: "Sin matrícula",
      image: COURSE_IMAGES.portuguese,
      badge: "Portugués",
      featured: false,
      order: 8,
    },
    {
      language: "french",
      title: "Clases de Francés",
      level: "Todos los niveles",
      type: "group",
      schedule: "Consultar horarios",
      description:
        "El idioma del amor, la cultura y la diplomacia. Clases dinámicas para dominar el francés desde lo básico.",
      price: "Consultar",
      priceNote: "Grupos reducidos",
      image: COURSE_IMAGES.all,
      badge: "Francés",
      featured: false,
      order: 9,
    },
    {
      language: "spanish",
      title: "Español para Extranjeros",
      level: "Todos los niveles",
      type: "private",
      schedule: "Horarios flexibles",
      description:
        "Para extranjeros que quieren dominar el segundo idioma más hablado del mundo. Clases personalizadas y conversacionales.",
      price: "Consultar",
      priceNote: "Para extranjeros",
      image: COURSE_IMAGES.all,
      badge: "Español",
      featured: false,
      order: 10,
    },
  ];

  for (const c of courses) {
    await db.course.create({ data: c });
  }
  console.log(`✓ ${courses.length} courses`);

  // ---- Testimonials ----
  await db.testimonial.deleteMany({});
  const testimonials = [
    {
      name: "María Fernanda R.",
      role: "Estudiante de Inglés",
      content:
        "Las clases son súper dinámicas y los profesores muy pacientes. Pasé de no atreverme a hablar a conversar con confianza en pocos meses.",
      rating: 5,
      order: 1,
    },
    {
      name: "Carlos Gómez",
      role: "Preparación TOEFL",
      content:
        "Gracias a ELC alcancé el puntaje que necesitaba para mi beca. Las estrategias y la práctica constante marcaron la diferencia.",
      rating: 5,
      order: 2,
    },
    {
      name: "Daniela Suárez",
      role: "Mamá de alumno",
      content:
        "Mi hijo de 9 años adora sus clases de inglés. Los grupos pequeños hacen que realmente aprenda y participe. ¡Totalmente recomendado!",
      rating: 5,
      order: 3,
    },
    {
      name: "Luca Bianchi",
      role: "Estudiante de Italiano",
      content:
        "Aprendí italiano desde cero y pude comunicarme en mi viaje a Italia. El método es fácil, efectivo y muy amigable.",
      rating: 5,
      order: 4,
    },
    {
      name: "Andrea Vargas",
      role: "Curso Intensivo de Inglés",
      content:
        "El intensivo es exigente pero vale cada minuto. En un mes avancé más que en años estudiando sola.",
      rating: 5,
      order: 5,
    },
    {
      name: "Rodrigo Méndez",
      role: "Clases Privadas",
      content:
        "La atención 1 a 1 y los horarios flexibles encajaron perfecto con mi trabajo. Profesores realmente calificados.",
      rating: 5,
      order: 6,
    },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }
  console.log(`✓ ${testimonials.length} testimonials`);

  // ---- Teachers ----
  await db.teacher.deleteMany({});
  const teachers = [
    {
      name: "Lic. Patricia Flores",
      role: "Coordinadora · Profesora de Inglés",
      bio: "Más de 10 años formando estudiantes en inglés general y preparación TOEFL. Especialista en metodología comunicativa.",
      languages: "Inglés, Español",
      order: 1,
    },
    {
      name: "Prof. Marco Rinaldi",
      role: "Profesor de Italiano",
      bio: "Italoboliviano apasionado por enseñar su lengua materna y la cultura de Italia a estudiantes de todas las edades.",
      languages: "Italiano, Español, Inglés",
      order: 2,
    },
    {
      name: "Lic. Ana Belén Cortez",
      role: "Profesora de Portugués",
      bio: "Especialista en portugués de Brasil y Portugal. Prepara estudiantes para estudios y oportunidades en el exterior.",
      languages: "Portugués, Español, Inglés",
      order: 3,
    },
    {
      name: "Prof. Sebastián Weiss",
      role: "Profesor de Alemán",
      bio: "Profesor certificado con experiencia en preparación para exámenes internacionales de alemán.",
      languages: "Alemán, Español, Inglés",
      order: 4,
    },
  ];
  for (const t of teachers) {
    await db.teacher.create({ data: t });
  }
  console.log(`✓ ${teachers.length} teachers`);

  // ---- Site content (CMS sections) ----
  await db.siteContent.deleteMany({});
  for (const def of SECTIONS) {
    const json = JSON.stringify(def.defaults);
    await db.siteContent.create({
      data: {
        id: def.key,
        section: def.key,
        label: def.label,
        draft: json,
        published: json,
      },
    });
  }
  console.log(`✓ ${SECTIONS.length} content sections`);

  console.log("\n✅ Seed complete!");
  console.log("   Admin login: admin@easylearning.com / elc-admin-2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
