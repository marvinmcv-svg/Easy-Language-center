import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPublishedContent } from "@/lib/get-content";
import { DEFAULT_CONTACT, LANGUAGES, BRAND } from "@/lib/brand";

type ChatMessage = { role: "assistant" | "user"; content: string };

/**
 * Generate a reply from whichever AI provider is available.
 *
 * The z.ai SDK is imported lazily so the route never hard-fails at module load
 * when the package/credentials aren't present (e.g. on a generic host). If no
 * provider is available or configured, this returns `null` and the caller
 * responds with a warm, on-brand fallback that points users to WhatsApp.
 */
async function generateReply(messages: ChatMessage[]): Promise<string | null> {
  try {
    const mod = await import("z-ai-web-dev-sdk");
    const ZAI = mod.default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });
    return completion.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("[chat] AI provider unavailable:", err);
    return null;
  }
}

// POST /api/chat — Shirley, the AI receptionist for Easy Learning Center.
// body: { message: string, history?: {role:"user"|"assistant", content:string}[] }
// returns: { reply: string }
export async function POST(req: Request) {
  let body: { message?: string; history?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 400 });
  }

  // Build context from DB (FAQ, courses, contact, languages).
  const [content, courses, config] = await Promise.all([
    getPublishedContent(),
    db.course.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { title: true, language: true, level: true, schedule: true, price: true, priceNote: true, type: true },
    }),
    db.siteConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  const faq = content.faq;
  const contact = {
    phone: config?.phone ?? DEFAULT_CONTACT.phone,
    phone2: config?.phone2 ?? DEFAULT_CONTACT.phone2,
    whatsapp: config?.whatsapp ?? DEFAULT_CONTACT.whatsapp,
    email: config?.email ?? DEFAULT_CONTACT.email,
    address: config?.address ?? DEFAULT_CONTACT.address,
  };

  const faqText = faq.items
    .map((it, i) => `P: ${it.q}\nR: ${it.a}`)
    .join("\n\n");

  const coursesText = courses
    .map(
      (c) =>
        `- ${c.title} (${c.language}, ${c.level ?? "todos los niveles"}, ${c.type}): ${c.schedule ?? "horarios flexibles"} — ${c.price ?? "consultar"}`,
    )
    .join("\n");

  const langsText = LANGUAGES.map((l) => `${l.name} (${l.nativeName})`).join(", ");

  const systemPrompt = `Eres ${"Shirley"}, la recepcionista virtual AI de ${BRAND.name}, una academia de idiomas en ${BRAND.city}. Tu personalidad es cálida, amigable, profesional y entusiasta. Hablas español por defecto (a menos que el cliente escriba en otro idioma, en cuyo caso respondes en ese idioma).

Tu trabajo es ayudar a personas interesadas en aprender idiomas, respondiendo sus preguntas y guiándolas hacia la inscripción.

## INFORMACIÓN DEL CENTRO
- Nombre: ${BRAND.name} (ELC)
- Ubicación: ${contact.address}
- Teléfonos/WhatsApp: ${contact.phone} / ${contact.phone2}
- Email: ${contact.email}
- Tagline: ${BRAND.tagline}

## IDIOMAS QUE ENSEÑAMOS
${langsText}

## CURSOS DISPONIBLES
${coursesText}

## PREGUNTAS FRECUENTES (USA ESTAS RESPUESTAS COMO BASE)
${faqText}

## REGLAS
1. Responde de forma breve, clara y conversacional (2-4 frases normalmente). No escribas párrafos largos.
2. Si la pregunta está en las FAQ, usa esa información pero respóndela de forma natural, no copiando literalmente.
3. Si te preguntan por precios, horarios o cursos específicos, da la información que tienes y sugiere escribir al WhatsApp ${contact.whatsapp} para confirmar detalles.
4. Si no sabes algo exacto, sé honesta y sugiere contactar por WhatsApp ${contact.whatsapp} o email ${contact.email}.
5. Siempre que sea relevante, invita a la persona a inscribirse o a pedir más info por WhatsApp.
6. No inventes precios, horarios ni cursos que no estén en la información anterior.
7. Eres "Shirley" — nunca digas que eres un modelo de lenguaje o una IA genérica. Eres la recepcionista de Easy Learning Center.
8. Mantén un tono cálido y motivador ("¡Claro que sí!", "¡Qué bueno que preguntas!", "¡Te esperamos!").`;

  // Build messages: system + up to 8 history + new message
  const history = (body.history ?? []).slice(-8);
  const messages: ChatMessage[] = [
    { role: "assistant", content: systemPrompt },
    ...history.map((h) => ({
      role: (h.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  const reply = await generateReply(messages);

  if (reply) {
    return NextResponse.json({ reply });
  }

  // No AI provider configured/available — degrade gracefully with a warm,
  // on-brand reply that keeps the conversation moving toward WhatsApp.
  return NextResponse.json({
    reply:
      `¡Gracias por escribir! 💬 En este momento no puedo responderte por aquí, ` +
      `pero con gusto te ayudamos al instante por WhatsApp: ${contact.whatsapp}. ` +
      `También puedes llamarnos al ${contact.phone} o escribirnos a ${contact.email}. ¡Te esperamos! 🎓`,
  });
}
