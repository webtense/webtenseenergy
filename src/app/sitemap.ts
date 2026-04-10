import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content-posts";
import { buildAlternates, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/blog",
  "/contacto",
  "/empresas",
  "/particulares",
  "/estudio",
  "/ofertas",
  "/luz/precio-hoy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const posts = await getPublishedPosts("ES");

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : 0.7,
    alternates: { languages: buildAlternates(path, "root").languages },
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = post.date ? new Date(post.date) : now;
    const path = `/blog/${post.slug}`;
    return {
      url: new URL(path, baseUrl).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: buildAlternates(path, "root").languages },
    };
  });

  return [...staticEntries, ...blogEntries];
}
