import { NextResponse } from "next/server";
import { generateWithOpenRouter } from "@/lib/ai/openrouter";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type GeneratePayload = {
  locale?: "ES" | "CA";
  prompt?: string;
  audience?: string;
  objective?: string;
  tone?: string;
  points?: string;
  cta?: string;
  category?: string;
};

type DraftPayload = {
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  category: string;
  locale: "ES" | "CA";
  status: "REVIEW";
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripJsonFences(value: string) {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

function pickCategory(payload: GeneratePayload) {
  const explicit = payload.category?.trim();
  if (explicit) return explicit;

  const source = `${payload.prompt || ""} ${payload.points || ""}`.toLowerCase();
  if (source.includes("home assistant")) return "Home Assistant";
  if (source.includes("domot")) return "Domótica";
  if (source.includes("ahorro") || source.includes("consumo") || source.includes("factura")) return "Ahorro Energético";
  if (source.includes("review") || source.includes("reseña") || source.includes("comparativa")) return "Reseñas";
  return "Domótica";
}

function buildFallback(payload: GeneratePayload, locale: "ES" | "CA"): DraftPayload {
  const category = pickCategory(payload);
  const title =
    locale === "CA"
      ? `Guia pràctica: ${payload.prompt?.trim() || "automatització i energia a casa"}`
      : `Guía práctica: ${payload.prompt?.trim() || "automatización y energía en casa"}`;
  const excerpt =
    locale === "CA"
      ? `Un esborrany inicial per explicar ${payload.prompt?.trim() || "el tema"} amb un enfocament útil, clar i orientat a decisió.`
      : `Un borrador inicial para explicar ${payload.prompt?.trim() || "el tema"} con un enfoque útil, claro y orientado a decisión.`;
  const intro =
    locale === "CA"
      ? `<p>${excerpt}</p><p>Aquest article està pensat per convertir una idea inicial en una peça editorial revisable des de l'admin.</p>`
      : `<p>${excerpt}</p><p>Este artículo está pensado para convertir una idea inicial en una pieza editorial revisable desde el admin.</p>`;
  const body =
    locale === "CA"
      ? `<h2>Què volem resoldre</h2><p>${payload.objective?.trim() || "Aclarir el context, les opcions disponibles i quan té sentit aplicar-les."}</p><h2>Punts clau</h2><ul><li>${payload.points?.split(/\n|,|;/).find(Boolean)?.trim() || "Context i problema habitual"}</li><li>${payload.audience?.trim() || "A qui va dirigit"}</li><li>${payload.cta?.trim() || "Següent pas recomanat"}</li></ul><h2>Conclusió</h2><p>${payload.tone?.trim() || "To proper i tècnic sense ser opac."}</p>`
      : `<h2>Qué queremos resolver</h2><p>${payload.objective?.trim() || "Aclarar el contexto, las opciones disponibles y cuándo tiene sentido aplicarlas."}</p><h2>Puntos clave</h2><ul><li>${payload.points?.split(/\n|,|;/).find(Boolean)?.trim() || "Contexto y problema habitual"}</li><li>${payload.audience?.trim() || "A quién va dirigido"}</li><li>${payload.cta?.trim() || "Siguiente paso recomendado"}</li></ul><h2>Conclusión</h2><p>${payload.tone?.trim() || "Tono cercano y técnico sin ser opaco."}</p>`;

  return {
    title,
    excerpt,
    content: `${intro}${body}`,
    seoTitle: title,
    seoDescription: excerpt,
    slug: toSlug(title),
    category,
    locale,
    status: "REVIEW",
  };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  try {
    const payload = (await request.json()) as GeneratePayload;
    const locale = payload.locale === "CA" ? "CA" : "ES";
    const prompt = payload.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ message: "Indica al menos la idea principal del artículo." }, { status: 400 });
    }

    const category = pickCategory(payload);
    const languageLabel = locale === "CA" ? "catalán" : "español";
    const systemPrompt =
      "Eres editor senior de Webtense Energy. Respondes solo con JSON valido, sin markdown, sin comentarios y sin texto adicional.";
    const userPrompt = `Genera un borrador de artículo para el blog de Webtense Energy en ${languageLabel}.

Devuelve JSON con estas claves exactas:
- title
- excerpt
- content
- seoTitle
- seoDescription
- slug
- category

Reglas:
- El contenido debe venir en HTML limpio con <p>, <h2>, <h3>, <ul>, <li> y <strong>.
- No uses markdown.
- No inventes enlaces externos si no aportan valor.
- El tono debe ser claro, útil, técnico y comercial sin parecer humo.
- Debe quedar listo para revisión humana, no para publicación automática.
- La categoría preferida es "${category}" salvo que otra encaje claramente mejor.
- El slug debe ser corto y SEO-friendly.

Brief:
- Idea principal: ${prompt}
- Público: ${payload.audience?.trim() || "No especificado"}
- Objetivo: ${payload.objective?.trim() || "No especificado"}
- Tono: ${payload.tone?.trim() || "Claro y práctico"}
- Puntos a cubrir: ${payload.points?.trim() || "No especificado"}
- CTA: ${payload.cta?.trim() || "Invitar a pedir estudio o contacto"}`;

    const response = await generateWithOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    if (!response) {
      return NextResponse.json({ draft: buildFallback(payload, locale), fallback: true });
    }

    try {
      const parsed = JSON.parse(stripJsonFences(response)) as Partial<DraftPayload>;
      const fallback = buildFallback(payload, locale);
      const title = parsed.title?.trim() || fallback.title;

      return NextResponse.json({
        draft: {
          title,
          excerpt: parsed.excerpt?.trim() || fallback.excerpt,
          content: parsed.content?.trim() || fallback.content,
          seoTitle: parsed.seoTitle?.trim() || title,
          seoDescription: parsed.seoDescription?.trim() || parsed.excerpt?.trim() || fallback.seoDescription,
          slug: toSlug(parsed.slug?.trim() || title) || fallback.slug,
          category: parsed.category?.trim() || fallback.category,
          locale,
          status: "REVIEW",
        },
      });
    } catch {
      return NextResponse.json({ draft: buildFallback(payload, locale), fallback: true });
    }
  } catch (error) {
    console.error("Error generando post con IA:", error);
    return NextResponse.json({ message: "No se pudo generar el borrador." }, { status: 500 });
  }
}
