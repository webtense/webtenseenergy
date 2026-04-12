import { NextResponse } from "next/server";
import { buildOfferCatalogFromDatabase, writeOfferCatalog } from "@/lib/offers-cache";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (!expected || auth !== expected) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const catalog = await buildOfferCatalogFromDatabase();
  await writeOfferCatalog(catalog);

  return NextResponse.json({
    ok: true,
    count: catalog.offers.length,
    source: catalog.source,
    refreshedAt: catalog.refreshedAt,
  });
}
