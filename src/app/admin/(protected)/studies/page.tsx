import { db } from "@/lib/db";
import { AdminPipelineManager } from "@/components/admin/AdminPipelineManager";
import { requireAdminPageUser } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminStudiesPage() {
  await requireAdminPageUser();

  const studies = await db.studyRequest.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return (
    <div className="min-h-[80vh] bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <AdminPipelineManager initialLeads={[]} initialStudies={studies.map((study) => ({
          id: study.id,
          name: study.name,
          email: study.email,
          phone: study.phone,
          company: study.company,
          method: study.method,
          status: study.status,
          fileName: study.fileName,
          createdAt: study.createdAt.toISOString(),
        }))} />
      </div>
    </div>
  );
}
