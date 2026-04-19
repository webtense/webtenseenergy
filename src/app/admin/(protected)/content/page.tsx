import { db } from "@/lib/db";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
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

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-400">Contenido</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Blog y base editorial</h2>
        <p className="mt-2 text-sm text-zinc-400">Gestiona posts, estados editoriales, SEO y categorias del blog desde una vista dedicada.</p>
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
  );
}
