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

export const BLOG_EDITORIAL_CATEGORIES = [
  'Ahorro Energético',
  'Domótica',
  'Home Assistant',
  'Ofertas',
  'Reseñas',
];

export function getAllCategories(posts: BlogListItem[]): string[] {
  const categories = new Set<string>();
  for (const post of posts) {
    for (const category of post.categories) {
      categories.add(category);
    }
  }

  for (const category of BLOG_EDITORIAL_CATEGORIES) {
    categories.add(category);
  }

  const remaining = Array.from(categories)
    .filter((category) => !BLOG_EDITORIAL_CATEGORIES.includes(category))
    .sort((left, right) => left.localeCompare(right, 'es'));

  return ['Todos', ...BLOG_EDITORIAL_CATEGORIES, ...remaining];
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
