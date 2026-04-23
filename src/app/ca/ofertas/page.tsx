export const revalidate = 900;
import { OfertasPage } from '@/components/pages/OfertasPage';
import { getOfferCatalog } from '@/lib/offers-cache';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: "Ofertes d'Energia | Webtense Energy",
  description:
    'Ofertes en domòtica, autoconsum i eficiència energètica seleccionades per Webtense Energy.',
  path: '/ofertas',
  locale: 'ca',
});

export default async function OfertasCaRoute() {
  const catalog = await getOfferCatalog();
  return (
    <OfertasPage
      initialOffers={catalog.offers}
      refreshedAt={catalog.refreshedAt}
      source={catalog.source}
    />
  );
}
