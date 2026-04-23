export const revalidate = 900;
import { OfertasPage } from '@/components/pages/OfertasPage';
import { getOfferCatalog } from '@/lib/offers-cache';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Ofertas de Energía | Webtense Energy',
  description:
    'Chollos y ofertas en domótica, autoconsumo y eficiencia energética seleccionados por Webtense Energy.',
  path: '/ofertas',
  locale: 'es',
});

export default async function OfertasEsRoute() {
  const catalog = await getOfferCatalog();
  return (
    <OfertasPage
      initialOffers={catalog.offers}
      refreshedAt={catalog.refreshedAt}
      source={catalog.source}
    />
  );
}
