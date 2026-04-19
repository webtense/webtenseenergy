import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  redirect("/admin/contacts?tab=leads");
}
