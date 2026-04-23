import { BlogIndexPage } from '@/components/pages/BlogIndexPage';
import { getPublishedPosts } from '@/lib/content-posts';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: 'Blog de Eficiencia Energética | Webtense Energy',
  description:
    'Guías, comparativas y tendencias de domótica y eficiencia energética para hogares y empresas.',
  path: '/blog',
  locale: 'root',
});

export default async function BlogRoute() {
  const posts = await getPublishedPosts('ES');
  return <BlogIndexPage basePath="" posts={posts} />;
}
