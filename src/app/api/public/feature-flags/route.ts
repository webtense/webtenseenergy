import { NextResponse } from "next/server";
import { getEnabledFeatures } from "@/lib/features";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const features = await getEnabledFeatures();
    return NextResponse.json({ features, blog: features.includes("blog"), ofertas: features.includes("ofertas"), newsletter: features.includes("newsletter"), telegram: features.includes("telegram") });
  } catch {
    return NextResponse.json({ features: [], blog: true, ofertas: true, newsletter: false, telegram: false }, { status: 500 });
  }
}