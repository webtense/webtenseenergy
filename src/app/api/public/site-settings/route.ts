import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureAdminDefaults, getDefaultSettingRecord } from "@/lib/admin-defaults";
import { checkRateLimit, getClientIp, hashIdentifier } from "@/lib/security";

export async function GET(request: Request) {
  const rate = await checkRateLimit({
    key: hashIdentifier(getClientIp(request)),
    endpoint: 'public-site-settings',
    limit: 120,
    windowMs: 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "ca" ? "CA" : "ES";
  const keys = [
    `newsletter.title:${locale}`,
    `newsletter.subtitle:${locale}`,
    `newsletter.legal:${locale}`,
    `footer.description:${locale}`,
  ];

  await ensureAdminDefaults();

  const settings = await db.siteSetting.findMany({
    where: {
      key: { in: keys },
    },
    orderBy: [{ key: "asc" }],
  });

  const normalized = keys.map((fullKey) => {
    const existing = settings.find((setting) => setting.key === fullKey);
    if (existing) return existing;

    const baseKey = fullKey.replace(/:(ES|CA)$/, "");
    return {
      id: fullKey,
      description: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      ...getDefaultSettingRecord(baseKey, locale),
    };
  });

  return NextResponse.json({ settings: normalized });
}
