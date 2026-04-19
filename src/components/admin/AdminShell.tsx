import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

type Props = {
  user: {
    username: string;
    role: "ADMIN" | "EDITOR";
  };
  children: ReactNode;
};

export function AdminShell({ user, children }: Props) {
  return (
    <div className="min-h-[80vh] bg-zinc-950 px-4 py-8 text-zinc-100 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar role={user.role} />
        <div className="space-y-6">
          <AdminTopbar user={user} />
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
