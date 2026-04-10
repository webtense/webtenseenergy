import { HomePage } from "@/components/pages/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "WEBTENSE ENERGY | Eficiència i Domòtica",
  description:
    "Eficiència energètica i domòtica pràctica per a llars i empreses. Guies, comparatives i solucions per estalviar des d'avui.",
  path: "/",
  locale: "ca",
});

export default async function HomeCaPage() {
  return <HomePage locale="CA" basePath="/ca" />;
}
