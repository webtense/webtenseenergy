import logger from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, hashIdentifier } from '@/lib/security';

const ESIOS_TOKEN = process.env.ESIOS_TOKEN;

interface PriceEntry {
  hour: string;
  price: number;
}

interface ElectricityApiResponse {
  date: string;
  now: number;
  average: number;
  min: { price: number; time: string };
  max: { price: number; time: string };
  hourly: PriceEntry[];
  source: string;
  updatedAt: string;
}

interface EsiosValue {
  datetime: string;
  value: number;
}

interface EsiosIndicator {
  attributes?: {
    title?: string;
    values?: EsiosValue[];
  };
}

interface EsiosApiResponse {
  included?: EsiosIndicator[];
}

const CACHE_DURATION = 15 * 60 * 1000;
let cachedData: ElectricityApiResponse | null = null;
let cachedAt = 0;

function getCachedData(): ElectricityApiResponse | null {
  if (!cachedData || Date.now() - cachedAt >= CACHE_DURATION) {
    return null;
  }

  return cachedData;
}

function setCachedData(data: ElectricityApiResponse): void {
  cachedData = data;
  cachedAt = Date.now();
}

function buildFallbackData(now: Date): ElectricityApiResponse {
  const prices = [
    0.0796, 0.08957, 0.08616, 0.07926, 0.08678, 0.10176, 0.11121, 0.13404, 0.15049, 0.12427,
    0.17237, 0.15534, 0.15686, 0.15317, 0.08561, 0.08754, 0.09796, 0.13033, 0.24084, 0.28096,
    0.27663, 0.25874, 0.18902, 0.17891,
  ];

  const hourly: PriceEntry[] = prices.map((value, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
    price: value,
  }));

  const currentHour = now.getHours();
  const currentPrice = hourly[currentHour]?.price ?? prices[0];
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    date: now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    now: Math.round(currentPrice * 10000) / 10000,
    average: Math.round(average * 10000) / 10000,
    min: {
      price: Math.round(minPrice * 10000) / 10000,
      time: hourly.find((h) => h.price === minPrice)?.hour ?? '',
    },
    max: {
      price: Math.round(maxPrice * 10000) / 10000,
      time: hourly.find((h) => h.price === maxPrice)?.hour ?? '',
    },
    hourly,
    source: 'fallback-local',
    updatedAt: now.toISOString(),
  };
}

export async function GET(request: Request) {
  const rate = await checkRateLimit({
    key: hashIdentifier(getClientIp(request)),
    endpoint: 'precios-luz',
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes' },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfter) },
      }
    );
  }

  try {
    const cached = getCachedData();
    if (cached) {
      return NextResponse.json(cached);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const startDateStr = `${year}-${month}-${day}T00:00:00`;
    const endDateStr = `${year}-${month}-${day}T23:59:59`;

    const url = `https://apidatos.ree.es/es/datos/mercados/precios-precios-horarios?start_date=${startDateStr}&end_date=${endDateStr}&time_trunc=hour`;

    const headers: HeadersInit = {
      Accept: 'application/json',
    };

    if (ESIOS_TOKEN) {
      headers['x-api-key'] = ESIOS_TOKEN;
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`ESIOS API error: ${response.status}`);
    }

    const data: EsiosApiResponse = await response.json();

    const indicators = data.included || [];
    const priceIndicator = indicators.find(
      (indicator) => indicator.attributes?.title === 'PVPC (€/kWh)'
    );

    if (!priceIndicator) {
      throw new Error('No price data found in ESIOS response');
    }

    const prices = priceIndicator.attributes?.values ?? [];

    if (!Array.isArray(prices) || prices.length === 0) {
      throw new Error('Price values are missing in ESIOS response');
    }

    const hourly: PriceEntry[] = prices.map((entry) => {
      const datetime = new Date(entry.datetime);
      const hour = datetime.getHours();
      return {
        hour: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
        price: entry.value / 1000,
      };
    });

    const currentHour = now.getHours();
    const currentPrice = hourly[currentHour]?.price || 0;

    const priceValues = hourly.map((h: PriceEntry) => h.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const minHourObj = hourly.find((h: PriceEntry) => h.price === minPrice);
    const maxHourObj = hourly.find((h: PriceEntry) => h.price === maxPrice);
    const average = priceValues.reduce((a: number, b: number) => a + b, 0) / priceValues.length;

    const result = {
      date: now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      now: Math.round(currentPrice * 10000) / 10000,
      average: Math.round(average * 10000) / 10000,
      min: { price: Math.round(minPrice * 10000) / 10000, time: minHourObj?.hour || '' },
      max: { price: Math.round(maxPrice * 10000) / 10000, time: maxHourObj?.hour || '' },
      hourly,
      source: 'ESIOS (Red Eléctrica)',
      updatedAt: now.toISOString(),
    };

    setCachedData(result);

    return NextResponse.json(result);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching electricity prices from ESIOS');

    const cached = getCachedData();
    if (cached) {
      return NextResponse.json({
        ...cached,
        fromCache: true,
        cacheWarning: 'Using cached data due to API error',
      });
    }

    const fallback = buildFallbackData(new Date());
    setCachedData(fallback);

    return NextResponse.json({
      ...fallback,
      fromFallback: true,
      fallbackWarning: 'Using local fallback data due to API error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
