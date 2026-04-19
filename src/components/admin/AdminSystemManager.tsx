type UserItem = { id: string; email: string; username: string; role: "ADMIN" | "EDITOR"; isActive: boolean; createdAt: string; updatedAt: string };
type AuditItem = { id: string; action: string; entityType: string; entityId: string | null; status: string; ipHash: string | null; userAgent: string | null; metadata: string | null; createdAt: string; adminUserId: string | null; adminUser: { username: string; email: string } | null };
type TelegramConfigItem = { id: string; botName: string | null; channelId: string; webhookUrl: string | null; webhookSecret: string | null; isActive: boolean; createdAt: string; updatedAt: string } | null;
type EmailErrorItem = { id: string; destination: string; subject: string; status: string; error: string | null; createdAt: string; sentAt: string | null; channel: string; entityType: string | null; entityId: string | null; providerMessageId: string | null; payload: string | null };

type Props = {
  users: UserItem[];
  auditLogs: AuditItem[];
  telegramConfig: TelegramConfigItem;
  recentEmailErrors: EmailErrorItem[];
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

export function AdminSystemManager({ users, auditLogs, telegramConfig, recentEmailErrors }: Props) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Sistema</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Admins, auditoria y salud operativa</h2>
          <p className="mt-2 text-sm text-zinc-400">Vista de supervision del backoffice, trazabilidad y errores recientes.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Telegram</p>
          <p className="mt-2 text-xl font-bold text-white">{telegramConfig?.isActive ? "Activo" : "Sin configurar"}</p>
          <p className="mt-2 text-sm text-zinc-400">Canal: {telegramConfig?.channelId || "-"}</p>
          <p className="mt-1 text-sm text-zinc-500">Bot: {telegramConfig?.botName || "-"}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <h3 className="text-xl font-semibold text-white">Usuarios admin</h3>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                <p className="font-semibold text-zinc-100">{user.username}</p>
                <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
                <p className="mt-2 text-xs text-zinc-500">{user.role} · {user.isActive ? "activo" : "inactivo"}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <h3 className="text-xl font-semibold text-white">Errores recientes de email</h3>
          <div className="mt-4 space-y-3">
            {recentEmailErrors.map((log) => (
              <div key={log.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                <p className="font-semibold text-zinc-100">{log.destination}</p>
                <p className="mt-1 text-sm text-zinc-400">{log.subject}</p>
                <p className="mt-2 text-xs text-red-300">{log.error || "Sin detalle"}</p>
                <p className="mt-2 text-xs text-zinc-500">{formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <h3 className="text-xl font-semibold text-white">Auditoria</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-zinc-950/80 text-left text-xs uppercase tracking-[0.16em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Accion</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-zinc-900/40">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-zinc-200">{log.action}</td>
                  <td className="px-4 py-3 text-zinc-400">{log.entityType}</td>
                  <td className="px-4 py-3 text-zinc-400">{log.adminUser?.username || "sistema"}</td>
                  <td className="px-4 py-3 text-zinc-400">{log.status}</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
