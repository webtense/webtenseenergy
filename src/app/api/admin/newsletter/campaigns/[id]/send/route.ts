import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";
import { sendCampaignNow } from "@/server/services/admin-newsletter";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser("ADMIN");
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const result = await sendCampaignNow({ campaignId: id, adminUserId: auth.user.id });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Error interno" }, { status: 400 });
  }
}
