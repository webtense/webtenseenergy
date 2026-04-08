import { db } from "@/lib/db";

export async function getSiteSettingValue(key: string, locale: "ES" | "CA", fallback: string) {
  try {
    const fullKey = `${key}:${locale}`;
    const setting = await db.siteSetting.findUnique({
      where: { key: fullKey },
      select: { value: true },
    });
    return setting?.value || fallback;
  } catch {
    return fallback;
  }
}
