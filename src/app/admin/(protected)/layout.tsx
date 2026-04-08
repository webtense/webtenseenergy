import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, isActive: true },
  });

  if (!user || !user.isActive) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
