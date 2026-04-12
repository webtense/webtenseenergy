import { OfertasPage } from "@/components/pages/OfertasPage";
import { buildPageMetadata } from "@/lib/seo";
import { getOfferCatalog } from "@/lib/offers-cache";

export const metadata = buildPageMetadata({
  title: "Ofertas de Energía | Webtense Energy",
  description: "Chollos y ofertas en domótica, autoconsumo y eficiencia energética seleccionados por Webtense Energy.",
  path: "/ofertas",
  locale: "root",
});

export default async function OfertasRoute() {
  const catalog = await getOfferCatalog();
  return <OfertasPage initialOffers={catalog.offers} refreshedAt={catalog.refreshedAt} source={catalog.source} />;
}
