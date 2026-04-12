import { requireAdminPageUser } from "@/server/auth/admin";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPageUser();

  return <>{children}</>;
}
