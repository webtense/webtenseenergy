import { db } from "@/lib/db";

const flagCache = new Map<string, { value: boolean; expires: number }>();
const CACHE_TTL_MS = 60 * 1000;

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const now = Date.now();
  const cached = flagCache.get(key);

  if (cached && cached.expires > now) {
    return cached.value;
  }

  try {
    const flag = await db.featureFlag.findUnique({
      where: { key },
      select: { enabled: true },
    });

    const isEnabled = flag?.enabled ?? false;
    flagCache.set(key, { value: isEnabled, expires: now + CACHE_TTL_MS });
    return isEnabled;
  } catch {
    return false;
  }
}

export async function getEnabledFeatures(): Promise<string[]> {
  try {
    const flags = await db.featureFlag.findMany({
      where: { enabled: true },
      select: { key: true },
    });
    return flags.map((f) => f.key);
  } catch {
    return [];
  }
}