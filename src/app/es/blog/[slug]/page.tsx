import type { Metadata } from 'next';
import { BlogPostPage } from '@/components/pages/BlogPostPage';
import { getPublishedPostBySlug } from '@/lib/content-posts';
import { buildPageMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug, 'ES');
  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt?.substring(0, 160) || post.title,
    path: `/blog/${slug}`,
    locale: 'es',
    image:
      post.featuredImage && !post.featuredImage.startsWith('/images/')
        ? post.featuredImage
        : undefined,
    type: 'article',
  });
}

export default async function BlogPostEsRoute({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} basePath="/es" locale="ES" />;
}
