import { db } from "@/lib/db";
import { ensureAdminDefaults } from "@/lib/admin-defaults";
import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";
import { requireAdminPageUser } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdminPageUser("ADMIN");
  await ensureAdminDefaults();

  const [flags, settings] = await Promise.all([
    db.featureFlag.findMany({ orderBy: { key: "asc" } }),
    db.siteSetting.findMany({ orderBy: [{ key: "asc" }] }),
  ]);

  return <AdminSettingsManager initialFlags={flags} initialSettings={settings} />;
}
