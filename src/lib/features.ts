import { db } from "@/lib/db";
import { DEFAULT_FLAGS } from "@/lib/admin-defaults";

export type PublicFeatureState = {
  features: string[];
  blog: boolean;
  ofertas: boolean;
  newsletter: boolean;
  telegram: boolean;
};

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

export async function getPublicFeatureState(): Promise<PublicFeatureState> {
  const defaults = new Map(DEFAULT_FLAGS.map((flag) => [flag.key, flag.enabled]));

  try {
    const flags = await db.featureFlag.findMany({
      select: { key: true, enabled: true },
    });

    for (const flag of flags) {
      defaults.set(flag.key, flag.enabled);
    }
  } catch {
    // If the DB read fails, keep the default public state instead of returning an inconsistent payload.
  }

  const features = Array.from(defaults.entries())
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
    .sort();

  return {
    features,
    blog: defaults.get("blog") === true,
    ofertas: defaults.get("ofertas") === true,
    newsletter: defaults.get("newsletter") === true,
    telegram: defaults.get("telegram") === true,
  };
}
