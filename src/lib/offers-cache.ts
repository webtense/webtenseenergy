import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";

export type OfferCatalogItem = {
  id: string;
  title: string;
  price: number;
  oldPrice: number;
  category: string;
  url: string;
  icon: string;
  rating: number;
  tag?: string;
  source: "cache" | "database" | "fallback";
};

export type OfferCatalog = {
  offers: OfferCatalogItem[];
  refreshedAt: string;
  source: "cache" | "database" | "fallback";
};

const CACHE_FILE = path.join(process.cwd(), "data", "offers-cache.json");

const FALLBACK_OFFERS: OfferCatalogItem[] = [
  {
    id: "fallback-solar-kit",
    title: "Kit Paneles Solares 400W",
    price: 199,
    oldPrice: 299,
    category: "Solar",
    url: "https://www.amazon.es/s?k=kit+panel+solar+400w&tag=semillasdet02-21",
    icon: "☀️",
    rating: 4.6,
    tag: "Mejor ahorro",
    source: "fallback",
  },
  {
    id: "fallback-thermostat",
    title: "Termostato Inteligente WiFi",
    price: 45.5,
    oldPrice: 89.99,
    category: "Climatización",
    url: "https://www.amazon.es/s?k=termostato+inteligente+wifi&tag=semillasdet02-21",
    icon: "🌡️",
    rating: 4.5,
    tag: "Top invierno",
    source: "fallback",
  },
  {
    id: "fallback-plugs",
    title: "Pack 4 Enchufes Inteligentes",
    price: 24.99,
    oldPrice: 34.99,
    category: "Domótica",
    url: "https://www.amazon.es/s?k=enchufe+inteligente+wifi&tag=semillasdet02-21",
    icon: "🔌",
    rating: 4.4,
    source: "fallback",
  },
  {
    id: "fallback-meter",
    title: "Medidor Consumo Eléctrico Carril DIN",
    price: 32.15,
    oldPrice: 45,
    category: "Medición",
    url: "https://www.amazon.es/s?k=medidor+consumo+electrico+carril+din&tag=semillasdet02-21",
    icon: "📊",
    rating: 4.3,
    tag: "Control",
    source: "fallback",
  },
];

function parsePrice(value: string | null | undefined, fallback = 0) {
  if (!value) return fallback;
  const normalized = value.replace(/€/g, "").replace(/\./g, "").replace(/,/g, ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOfferCategory(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes("clima")) return "Climatización";
  if (lower.includes("dom")) return "Domótica";
  if (lower.includes("medi")) return "Medición";
  if (lower.includes("solar")) return "Solar";
  return value;
}

export async function buildOfferCatalogFromDatabase(): Promise<OfferCatalog> {
  const databaseUrl = process.env.DATABASE_URL || "";
  if (!databaseUrl || databaseUrl.includes("127.0.0.1:5432/webtenseenergy")) {
    return {
      offers: FALLBACK_OFFERS,
      refreshedAt: new Date().toISOString(),
      source: "fallback",
    };
  }

  try {
    const rows = await db.offer.findMany({
      where: { locale: "ES" },
      orderBy: [{ updatedAt: "desc" }],
      take: 24,
    });

    if (!rows.length) {
      return {
        offers: FALLBACK_OFFERS,
        refreshedAt: new Date().toISOString(),
        source: "fallback",
      };
    }

    return {
      offers: rows.map((row, index) => ({
        id: row.id,
        title: row.title,
        price: parsePrice(row.price),
        oldPrice: parsePrice(row.oldPrice, parsePrice(row.price)),
        category: normalizeOfferCategory(row.category),
        url: row.url,
        icon: row.icon || ["☀️", "🌡️", "🔌", "📊"][index % 4],
        rating: 4.2 + (index % 4) * 0.1,
        tag: row.discount || undefined,
        source: "database",
      })),
      refreshedAt: new Date().toISOString(),
      source: "database",
    };
  } catch {
    return {
      offers: FALLBACK_OFFERS,
      refreshedAt: new Date().toISOString(),
      source: "fallback",
    };
  }
}

export async function writeOfferCatalog(catalog: OfferCatalog) {
  await mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify(catalog, null, 2), "utf-8");
}

export async function readOfferCatalog(): Promise<OfferCatalog | null> {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as OfferCatalog;
  } catch {
    return null;
  }
}

export async function getOfferCatalog(): Promise<OfferCatalog> {
  const cached = await readOfferCatalog();
  if (cached?.offers?.length) {
    return { ...cached, source: "cache" };
  }

  const built = await buildOfferCatalogFromDatabase();
  await writeOfferCatalog(built);
  return built;
}
