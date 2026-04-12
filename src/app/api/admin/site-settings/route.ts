import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { ensureAdminDefaults } from "@/lib/admin-defaults";
import { isSameOrigin } from "@/lib/security";

type SiteSettingInput = {
  key?: string;
  value?: string;
  locale?: "ES" | "CA";
};

export async function GET() {
  const result = await requireAdminApiUser("ADMIN");
  if ("error" in result) return result.error;

  await ensureAdminDefaults();

  const settings = await db.siteSetting.findMany({ orderBy: [{ key: "asc" }] });
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const result = await requireAdminApiUser("ADMIN");
  if ("error" in result) return result.error;

  try {
    const body = (await request.json()) as { items?: SiteSettingInput[] };
    const items = body.items || [];
    if (items.length === 0) {
      return NextResponse.json({ message: "No hay cambios" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.key || typeof item.value !== "string") continue;
      const safeLocale = item.locale === "CA" ? "CA" : "ES";
      const storedKey = `${item.key}:${safeLocale}`;

      await db.siteSetting.upsert({
        where: { key: storedKey },
        create: {
          key: storedKey,
          value: item.value,
          locale: safeLocale,
        },
        update: {
          value: item.value,
          locale: safeLocale,
        },
      });
    }

    const settings = await db.siteSetting.findMany({ orderBy: [{ key: "asc" }] });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error guardando ajustes:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
