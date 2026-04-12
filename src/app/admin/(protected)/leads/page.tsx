import { db } from "@/lib/db";
import { AdminPipelineManager } from "@/components/admin/AdminPipelineManager";
import { requireAdminPageUser } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireAdminPageUser();

  const leads = await db.lead.findMany({
    include: {
      notes: {
        include: { adminUser: { select: { username: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return (
    <div className="min-h-[80vh] bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <AdminPipelineManager
          initialLeads={leads.map((lead) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            subject: lead.subject,
            source: lead.source,
            status: lead.status,
            createdAt: lead.createdAt.toISOString(),
            notes: lead.notes.map((note) => ({
              id: note.id,
              body: note.body,
              createdAt: note.createdAt.toISOString(),
              adminUser: note.adminUser,
            })),
          }))}
          initialStudies={[]}
        />
      </div>
    </div>
  );
}
