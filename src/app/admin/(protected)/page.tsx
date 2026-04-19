import { AdminOverview } from "@/components/admin/AdminOverview";
import { getAdminSummaryData } from "@/server/services/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const summary = await getAdminSummaryData();

  return <AdminOverview data={summary} />;
}
