import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, type AdminSessionPayload } from "@/lib/admin-auth";

export type AdminRole = "ADMIN" | "EDITOR";

export type AuthenticatedAdmin = {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
};

async function loadAdminUser(session: AdminSessionPayload | null): Promise<AuthenticatedAdmin | null> {
  if (!session) return null;

  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) return null;
  return user;
}

export function hasRequiredRole(role: AdminRole, requiredRole: AdminRole) {
  if (requiredRole === "EDITOR") return role === "EDITOR" || role === "ADMIN";
  return role === "ADMIN";
}

export async function getAuthenticatedAdmin() {
  const session = await getAdminSession();
  return loadAdminUser(session);
}

export async function requireAdminPageUser(requiredRole: AdminRole = "EDITOR") {
  const user = await getAuthenticatedAdmin();
  if (!user || !hasRequiredRole(user.role, requiredRole)) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdminApiUser(requiredRole: AdminRole = "EDITOR") {
  const user = await getAuthenticatedAdmin();
  if (!user) {
    return { error: NextResponse.json({ message: "No autenticado" }, { status: 401 }) };
  }

  if (!hasRequiredRole(user.role, requiredRole)) {
    return { error: NextResponse.json({ message: "Permisos insuficientes" }, { status: 403 }) };
  }

  return { user };
}
