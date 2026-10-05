'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { ThemeToggle } from '@/components/admin/ThemeToggle';

type Props = {
  user: {
    username: string;
    role: 'ADMIN' | 'EDITOR';
  };
  children: ReactNode;
};

export function AdminShell({ user, children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-8 text-gray-900 dark:text-zinc-100 lg:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-8 text-gray-900 dark:text-zinc-100 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar role={user.role} />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <AdminTopbar user={user} />
            <ThemeToggle />
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
