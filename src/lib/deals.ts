import { generateWithOpenRouter } from "@/lib/ai/openrouter";

export type ParsedDeal = {
  title: string;
  currentPrice: string;
  previousPrice: string | null;
  coupon: string | null;
  sourceUrl: string;
  affiliateUrl: string;
  hashtags: string[];
};

const DEFAULT_AFFILIATE_TAG = "semillasdet02-21";

function normalizePrice(value: string): string {
  return value.replace(/\s+/g, " ").trim().replace(".", ",").replace(/,(\d{2})$/, ",$1").replace(/\s*€/, " €");
}

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

function cleanLine(value: string): string {
  return value
    .replace(/[🟥🔴✅❌🔺🛒🎼➡️⬅️💬🟢✔️🟡]/g, " ")
    .replace(/#\w+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  return match?.[1]?.toUpperCase() || null;
}

export async function resolveOfferUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
    });

    const location = response.headers.get("location");
    if (location) {
      return location;
    }
  } catch {
    // Usamos la URL original si el acortador no responde.
  }

  return url;
}

export function buildAffiliateAmazonUrl(url: string, affiliateTag = process.env.AMAZON_AFFILIATE_TAG || DEFAULT_AFFILIATE_TAG) {
  const asin = extractAsin(url);
  if (!asin) return url;

  const normalized = new URL(`https://www.amazon.es/dp/${asin}`);
  normalized.searchParams.set("tag", affiliateTag);
  normalized.searchParams.set("th", "1");
  normalized.searchParams.set("psc", "1");
  normalized.searchParams.set("language", "es_ES");
  return normalized.toString();
}

export async function parseDealText(rawText: string): Promise<ParsedDeal> {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const urlMatch = rawText.match(/https?:\/\/\S+/i);
  const sourceUrl = urlMatch?.[0] || "";
  const resolvedUrl = sourceUrl ? await resolveOfferUrl(sourceUrl) : "";
  const affiliateUrl = resolvedUrl ? buildAffiliateAmazonUrl(resolvedUrl) : "";

  const titleLine =
    lines
      .map(cleanLine)
      .find(
        (line) =>
          line &&
          !/amazon|publicidad|ahora|antes|cup[oó]n|consultas|ofertacular|music gratis|https?:/i.test(line) &&
          /[A-Za-zÀ-ÿ]{3,}/.test(line),
      ) || "Oferta destacada de Webtense Energy";

  const currentPriceMatch = rawText.match(/AHORA\s+([\d.,]+\s*€)/i);
  const previousPriceMatch = rawText.match(/Antes\s+([\d.,]+\s*€)/i);
  const couponMatch = rawText.match(/Cup[oó]n\s*➡️?\s*([A-Z0-9-]+)/i);
  const hashtags = Array.from(rawText.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map((match) => `#${match[1]}`);

  return {
    title: titleLine,
    currentPrice: normalizePrice(currentPriceMatch?.[1] || "0,00 €"),
    previousPrice: previousPriceMatch?.[1] ? normalizePrice(previousPriceMatch[1]) : null,
    coupon: couponMatch?.[1] || null,
    sourceUrl: resolvedUrl || sourceUrl,
    affiliateUrl: affiliateUrl || sourceUrl,
    hashtags: hashtags.length ? hashtags : ["#Publicidad", "#Amazon"],
  };
}

export function buildTelegramMessage(deal: ParsedDeal) {
  const lines = [
    "🟥 ¡OFERTA ESPECIAL! 🟥 #Publicidad #Amazon",
    "",
    `🔴 ${deal.title}`,
    "",
    `✅ AHORA ${deal.currentPrice} ✔️🟡`,
  ];

  if (deal.previousPrice) {
    lines.push(`❌ Antes ${deal.previousPrice}`);
    lines.push("");
  }

  if (deal.coupon) {
    lines.push(`🔺 Cupón ➡️ ${deal.coupon}`);
    lines.push("");
  }

  lines.push(`🛒 ${deal.affiliateUrl}`);
  lines.push("");
  lines.push("💬 Consultas en @Ofertachat");
  lines.push("🟢 WebtenseEnergy.com");

  return lines.join("\n");
}

function buildFallbackBlogDraft(deal: ParsedDeal) {
  const title = `${deal.title} en oferta: analisis rapido y para quien merece la pena`;
  const excerpt = `${deal.title} baja a ${deal.currentPrice}${deal.previousPrice ? ` desde ${deal.previousPrice}` : ""}. Resumen rapido, puntos fuertes y enlace directo con afiliado.`;
  const content = `
<h2>Resumen rapido de la oferta</h2>
<p><strong>${deal.title}</strong> aparece ahora por <strong>${deal.currentPrice}</strong>${deal.previousPrice ? `, frente a los <strong>${deal.previousPrice}</strong> habituales` : ""}. Es una oportunidad interesante si buscas mejorar tu hogar, tu seguridad o tu comodidad con una compra contenida.</p>

<h2>Lo que mas destaca</h2>
<ul>
  <li>Precio competitivo para una compra de impulso o reposicion.</li>
  <li>Producto facil de compartir en Telegram y campañas de ofertas.</li>
  <li>Encaja en contenidos de ahorro domestico, eficiencia y equipamiento del hogar.</li>
</ul>

<h2>Antes de comprar</h2>
<ul>
  <li>Comprueba medidas, capacidad o compatibilidad segun tu caso.</li>
  <li>Revisa valoraciones recientes y condiciones de envio.</li>
  ${deal.coupon ? `<li>Aplica el cupon <strong>${deal.coupon}</strong> antes de finalizar la compra.</li>` : ""}
</ul>

<h2>Enlace de la oferta</h2>
<p><a href="${deal.affiliateUrl}" target="_blank" rel="noopener noreferrer">Ver oferta en Amazon</a></p>

<p><em>#Publicidad #AfiliadoAmazon. El precio puede cambiar en cualquier momento.</em></p>
`.trim();

  return { title, excerpt, content };
}

export async function buildBlogDraft(deal: ParsedDeal) {
  const fallback = buildFallbackBlogDraft(deal);
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return fallback;

  const prompt = [
    "Genera un JSON valido con keys title, excerpt y content.",
    "Necesito un articulo corto en HTML para un blog de ahorro energetico/domotica.",
    `Producto: ${deal.title}`,
    `Precio actual: ${deal.currentPrice}`,
    `Precio anterior: ${deal.previousPrice || "desconocido"}`,
    `Cupon: ${deal.coupon || "sin cupon"}`,
    `URL afiliada: ${deal.affiliateUrl}`,
    "El tono debe ser claro, comercial y honesto.",
    "Incluye resumen, puntos fuertes, consideraciones y disclosure de afiliado.",
  ].join("\n");

  const result = await generateWithOpenRouter([
    { role: "system", content: "Responde solo JSON valido, sin markdown." },
    { role: "user", content: prompt },
  ]);

  if (!result) return fallback;

  try {
    const parsed = JSON.parse(result) as { title?: string; excerpt?: string; content?: string };
    return {
      title: parsed.title?.trim() || fallback.title,
      excerpt: parsed.excerpt?.trim() || fallback.excerpt,
      content: parsed.content?.trim() || fallback.content,
    };
  } catch {
    return fallback;
  }
}

export function buildOfferSlug(title: string) {
  const base = toSlug(title) || "oferta";
  return `${base}-${new Date().toISOString().slice(0, 10)}`;
}
