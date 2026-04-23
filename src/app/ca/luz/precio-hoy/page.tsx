import { PrecioLuzHoyPage } from '@/components/pages/PrecioLuzHoyPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Preu de la llum avui | Webtense Energy',
  description:
    "Consulta el preu de la llum per hores en temps real per optimitzar l'estalvi energètic.",
  path: '/luz/precio-hoy',
  locale: 'ca',
});

export default function PrecioLuzCaRoute() {
  return <PrecioLuzHoyPage basePath="/ca" />;
}
