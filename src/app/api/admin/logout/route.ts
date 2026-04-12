import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";
import { isSameOrigin } from "@/lib/security";
import { getAuthenticatedAdmin } from "@/server/auth/admin";
import { createAuditLog } from "@/server/services/audit-log";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  const user = await getAuthenticatedAdmin();
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    priority: "high",
  });

  if (user) {
    await createAuditLog({
      adminUserId: user.id,
      action: "admin_logout",
      entityType: "AdminUser",
      entityId: user.id,
      status: "ok",
    });
  }

  return response;
}
