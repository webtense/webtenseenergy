import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ensureAdminDefaults } from "@/lib/admin-defaults";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    redirect("/admin/login");
  }

  await ensureAdminDefaults();

  const flags = await db.featureFlag.findMany({ orderBy: { key: "asc" } });
  const settings = await db.siteSetting.findMany({ orderBy: { key: "asc" } });

  return <AdminDashboard user={{ username: user.username, role: user.role }} flags={flags} settings={settings} />;
}
