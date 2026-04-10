import { EmpresasPage } from "@/components/pages/EmpresasPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Consultoria Energètica B2B | Webtense Energy",
  description:
    "Solucions energètiques per a empreses. Optimització de contractes, gestió energètica i auditories per reduir costos B2B.",
  path: "/empresas",
  locale: "ca",
});

export default function EmpresasCaRoute() {
  return <EmpresasPage basePath="/ca" />;
}
