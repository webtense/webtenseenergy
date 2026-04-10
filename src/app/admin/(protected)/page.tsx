import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";
import { AdminDealsManager } from "@/components/admin/AdminDealsManager";
import { ensureAdminDefaults } from "@/lib/admin-defaults";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    redirect("/admin/login");
  }

  await ensureAdminDefaults();

  const flags = await db.featureFlag.findMany({ orderBy: { key: "asc" } });
  const settings = await db.siteSetting.findMany({ orderBy: { key: "asc" } });
  const posts = await db.post.findMany({
    include: {
      translations: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
  const deals = await db.telegramDeal.findMany({ orderBy: [{ updatedAt: "desc" }] });

  return (
    <div className="min-h-[80vh] bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminDashboard user={{ username: user.username, role: user.role }} flags={flags} settings={settings} />
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Borradores de ofertas y Telegram</h2>
            <p className="mt-1 text-sm text-zinc-400">Pega una oferta, genera el borrador y publícalo solo tras revisión.</p>
          </div>
          <AdminDealsManager
            initialDeals={deals.map((deal) => ({
              ...deal,
              url: deal.url,
              sentAt: deal.sentAt?.toISOString() || null,
              updatedAt: deal.updatedAt.toISOString(),
            }))}
          />
        </section>
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Gestor de blog</h2>
            <p className="mt-1 text-sm text-zinc-400">Edita posts reales en base de datos y revisa los borradores creados desde ofertas.</p>
          </div>
          <AdminBlogManager
            initialPosts={posts.map((post) => ({
              id: post.id,
              slug: post.slug,
              status: post.status,
              scheduledFor: post.scheduledFor?.toISOString() || null,
              featuredImage: post.featuredImage,
              seoTitle: post.seoTitle,
              seoDescription: post.seoDescription,
              locale: post.locale,
              category: post.categories[0]?.category.name || "",
              translations: post.translations,
              updatedAt: post.updatedAt.toISOString(),
            }))}
          />
        </section>
      </div>
    </div>
  );
}
