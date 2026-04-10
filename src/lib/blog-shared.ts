export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  categories: string[];
  featuredImage: string | null;
};

export function getAllCategories(posts: BlogListItem[]): string[] {
  const categories = new Set<string>();
  for (const post of posts) {
    for (const category of post.categories) {
      categories.add(category);
    }
  }

  return ["Todos", ...Array.from(categories).sort((left, right) => left.localeCompare(right, "es"))];
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
