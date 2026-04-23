import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdminPageUser } from '@/server/auth/admin';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPageUser();

  return <AdminShell user={{ username: user.username, role: user.role }}>{children}</AdminShell>;
}
