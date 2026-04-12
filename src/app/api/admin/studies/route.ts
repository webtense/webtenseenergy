import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  const studies = await db.studyRequest.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json({ studies });
}
