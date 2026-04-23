import { PrecioLuzHoyPage } from '@/components/pages/PrecioLuzHoyPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Precio de la luz hoy | Webtense Energy',
  description:
    'Consulta el precio de la luz por horas en tiempo real para optimizar tu ahorro energético.',
  path: '/luz/precio-hoy',
  locale: 'root',
});

export default function PrecioLuzHoyRoute() {
  return <PrecioLuzHoyPage basePath="" />;
}
