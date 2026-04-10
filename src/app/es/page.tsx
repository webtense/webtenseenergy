import { HomePage } from "@/components/pages/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "WEBTENSE ENERGY | Eficiencia y Domótica",
  description:
    "Eficiencia energética y domótica práctica para hogares y empresas. Guías, comparativas y soluciones para ahorrar desde hoy.",
  path: "/",
  locale: "es",
});

export default async function HomeEsPage() {
  return <HomePage locale="ES" basePath="/es" />;
}
