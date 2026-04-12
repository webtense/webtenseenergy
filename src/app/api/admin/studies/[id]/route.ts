import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApiUser } from "@/lib/admin-guard";
import { isSameOrigin } from "@/lib/security";
import { createAuditLog } from "@/server/services/audit-log";

type UpdateStudyBody = {
  status?: "NEW" | "REVIEWING" | "QUOTED" | "WON" | "LOST";
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const auth = await requireAdminApiUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await request.json()) as UpdateStudyBody;

  const study = await db.studyRequest.findUnique({ where: { id } });
  if (!study) {
    return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
  }

  const updated = await db.studyRequest.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.status === "REVIEWING" ? { reviewedAt: new Date() } : {}),
      ...(body.status === "QUOTED" ? { quotedAt: new Date() } : {}),
      ...(body.status === "WON" ? { wonAt: new Date() } : {}),
      ...(body.status === "LOST" ? { lostAt: new Date() } : {}),
    },
  });

  await createAuditLog({
    adminUserId: auth.user.id,
    action: "study_updated",
    entityType: "StudyRequest",
    entityId: id,
    status: "ok",
    metadata: JSON.stringify({ status: body.status || study.status }),
  });

  return NextResponse.json({ study: updated });
}
