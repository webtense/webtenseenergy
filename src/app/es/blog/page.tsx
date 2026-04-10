import { BlogIndexPage } from "@/components/pages/BlogIndexPage";
import { getPublishedPosts } from "@/lib/content-posts";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Blog de Eficiencia Energética | Webtense Energy",
  description:
    "Guías, comparativas y tendencias de domótica y eficiencia energética para hogares y empresas.",
  path: "/blog",
  locale: "es",
});

export default async function BlogEsRoute() {
  const posts = await getPublishedPosts("ES");
  return <BlogIndexPage basePath="/es" posts={posts} />;
}
