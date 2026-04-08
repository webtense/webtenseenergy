import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

export async function requireAdminApiUser() {
  const session = await getAdminSession();
  if (!session) {
    return { error: NextResponse.json({ message: "No autenticado" }, { status: 401 }) };
  }

  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return { error: NextResponse.json({ message: "Sesion invalida" }, { status: 401 }) };
  }

  return { user };
}
