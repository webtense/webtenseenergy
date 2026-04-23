import { BlogIndexPage } from '@/components/pages/BlogIndexPage';
import { getPublishedPosts } from '@/lib/content-posts';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: "Blog d'Eficiència Energètica | Webtense Energy",
  description:
    'Guies, comparatives i tendències de domòtica i eficiència energètica per a llars i empreses.',
  path: '/blog',
  locale: 'ca',
});

export default async function BlogCaRoute() {
  const posts = await getPublishedPosts('CA');
  return <BlogIndexPage basePath="/ca" posts={posts} />;
}
