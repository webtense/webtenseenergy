import { NextResponse } from "next/server";
import { ensureAdminDefaults } from "@/lib/admin-defaults";
import { getPublicFeatureState } from "@/lib/features";
import { checkRateLimit, getClientIp, hashIdentifier } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rate = await checkRateLimit({
    key: hashIdentifier(getClientIp(request)),
    endpoint: 'public-feature-flags',
    limit: 120,
    windowMs: 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 });
  }

  try {
    await ensureAdminDefaults();
    return NextResponse.json(await getPublicFeatureState());
  } catch {
    return NextResponse.json(await getPublicFeatureState(), { status: 200 });
  }
}
