import { NextResponse } from "next/server";
import { ensureAdminDefaults } from "@/lib/admin-defaults";
import { getPublicFeatureState } from "@/lib/features";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureAdminDefaults();
    return NextResponse.json(await getPublicFeatureState());
  } catch {
    return NextResponse.json(await getPublicFeatureState(), { status: 200 });
  }
}
