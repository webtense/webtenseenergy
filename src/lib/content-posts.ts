import postsData from '@/data/posts.json';
import { db } from '@/lib/db';
import type { BlogListItem } from '@/lib/blog-shared';

export type BlogLocale = 'ES' | 'CA';

type LegacyPost = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  categories: string[];
  status: string;
  featuredImage: string | null;
};

type DbPostWithRelations = {
  id: string;
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  featuredImage: string | null;
  translations: Array<{
    locale: BlogLocale;
    title: string;
    excerpt: string | null;
    content: string;
  }>;
  categories: Array<{
    category: {
      name: string;
    };
  }>;
};

function mapLegacyPosts(): BlogListItem[] {
  return (postsData as LegacyPost[])
    .filter(
      (post) => post.slug && post.title && (post.status === 'publish' || post.status === 'pending')
    )
    .map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      category: post.category || post.categories?.[0] || 'General',
      categories: post.categories?.length ? post.categories : [post.category || 'General'],
      featuredImage: post.featuredImage,
    }));
}

function mapDbPost(post: DbPostWithRelations, locale: BlogLocale): BlogListItem {
  const translation =
    post.translations.find((item) => item.locale === locale) || post.translations[0];
  const categories = post.categories.map((item) => item.category.name);

  return {
    id: post.id,
    slug: post.slug,
    title: translation?.title || post.slug,
    excerpt: translation?.excerpt || '',
    content: translation?.content || '',
    date: (post.publishedAt || post.updatedAt || post.createdAt).toISOString(),
    category: categories[0] || 'General',
    categories: categories.length ? categories : ['General'],
    featuredImage: post.featuredImage,
  };
}

async function getDbPublishedPosts(locale: BlogLocale): Promise<BlogListItem[]> {
  const posts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      translations: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
  });

  return posts.map((post) => mapDbPost(post, locale));
}

export async function getPublishedPosts(locale: BlogLocale): Promise<BlogListItem[]> {
  try {
    const posts = await getDbPublishedPosts(locale);
    if (posts.length > 0) {
      return posts;
    }
  } catch {
    // Fallback al contenido legado mientras se termina la migracion de contenido.
  }

  return mapLegacyPosts();
}

export async function getPublishedPostBySlug(
  slug: string,
  locale: BlogLocale
): Promise<BlogListItem | null> {
  try {
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        translations: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (post?.status === 'PUBLISHED') {
      return mapDbPost(post, locale);
    }
  } catch {
    // Fallback a contenido legado.
  }

  const fallback = mapLegacyPosts().find((post) => post.slug === slug);
  return fallback || null;
}

export async function getPublishedPostSlugs(locale: BlogLocale): Promise<string[]> {
  const posts = await getPublishedPosts(locale);
  return posts.map((post) => post.slug);
}
