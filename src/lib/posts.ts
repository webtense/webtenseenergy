import postsData from "@/data/posts.json";

export interface Post {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  categories: string[];
  status: string;
  featuredImage: string | null;
}

// Todos los posts visibles (publish + pending los tratamos como publicados en local)
export const allPosts: Post[] = (postsData as Post[]).filter(
  (p) => p.slug && p.title && (p.status === "publish" || p.status === "pending")
);

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  allPosts.forEach((p) => p.categories.forEach((c) => cats.add(c)));
  return ["Todos", ...Array.from(cats).sort()];
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
