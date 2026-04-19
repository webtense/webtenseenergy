import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "ca" ? "CA" : "ES";
  const keys = [
    `newsletter.title:${locale}`,
    `newsletter.subtitle:${locale}`,
    `newsletter.legal:${locale}`,
    `footer.description:${locale}`,
  ];

  const settings = await db.siteSetting.findMany({
    where: {
      key: { in: keys },
    },
    orderBy: [{ key: "asc" }],
  });

  return NextResponse.json({ settings });
}
