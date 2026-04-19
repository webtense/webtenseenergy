type SummaryData = {
  kpis: {
    leadCount: number;
    studyCount: number;
    subscriberCount: number;
    pendingDeals: number;
  };
  recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: Date }>;
  recentStudies: Array<{ id: string; name: string; email: string; status: string; createdAt: Date }>;
  recentSubscribers: Array<{ id: string; email: string; fullName: string | null; isActive: boolean; createdAt: Date }>;
  recentCampaigns: Array<{ id: string; name: string; status: string; updatedAt: Date }>;
  recentDeals: Array<{ id: string; title: string; status: string; updatedAt: Date }>;
  recentAuditLogs: Array<{ id: string; action: string; entityType: string; status: string; createdAt: Date; adminUser: { username: string } | null }>;
};

type Props = {
  data: SummaryData;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const cards = [
  { key: "leadCount", label: "Leads", description: "Contactos pendientes o en curso" },
  { key: "studyCount", label: "Estudios", description: "Solicitudes de analisis recibidas" },
  { key: "subscriberCount", label: "Suscriptores", description: "Newsletter activos" },
  { key: "pendingDeals", label: "Telegram pendientes", description: "Borradores por revisar o enviar" },
] as const;

export function AdminOverview({ data }: Props) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="rounded-3xl border border-white/10 bg-zinc-900/90 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
            <p className="mt-3 text-4xl font-bold text-white">{data.kpis[card.key]}</p>
            <p className="mt-2 text-sm text-zinc-400">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Actividad comercial reciente</h3>
            <a href="/admin/contacts" className="text-sm font-semibold text-primary-300 hover:text-primary-200">Ver contactos</a>
          </div>
          <div className="mt-5 space-y-3">
            {data.recentLeads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                <p className="font-semibold text-zinc-100">{lead.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{lead.email}</p>
                <p className="mt-2 text-xs text-zinc-500">Lead · {lead.status} · {formatDate(lead.createdAt)}</p>
              </div>
            ))}
            {data.recentStudies.map((study) => (
              <div key={study.id} className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                <p className="font-semibold text-zinc-100">{study.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{study.email}</p>
                <p className="mt-2 text-xs text-zinc-500">Estudio · {study.status} · {formatDate(study.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Canales y automatizacion</h3>
            <a href="/admin/newsletter" className="text-sm font-semibold text-primary-300 hover:text-primary-200">Ver envios</a>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Suscriptores recientes</p>
              <div className="mt-3 space-y-2">
                {data.recentSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="text-sm text-zinc-300">
                    <p className="font-medium">{subscriber.fullName || subscriber.email}</p>
                    <p className="text-xs text-zinc-500">{subscriber.email} · {subscriber.isActive ? "activo" : "inactivo"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Campanas y Telegram</p>
              <div className="mt-3 space-y-3">
                {data.recentCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="text-sm text-zinc-300">
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-zinc-500">Campana · {campaign.status} · {formatDate(campaign.updatedAt)}</p>
                  </div>
                ))}
                {data.recentDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="text-sm text-zinc-300">
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-xs text-zinc-500">Telegram · {deal.status} · {formatDate(deal.updatedAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Auditoria reciente</h3>
          <a href="/admin/system" className="text-sm font-semibold text-primary-300 hover:text-primary-200">Ver sistema</a>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
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
              {data.recentAuditLogs.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-zinc-200">{row.action}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.entityType}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.adminUser?.username || "sistema"}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.status}</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
