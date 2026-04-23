import { EstudioPage } from '@/components/pages/EstudioPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Estudio Energético Gratuito | Webtense Energy',
  description:
    'Sube tu factura de luz o dinos cuánto consumes y obtén un estudio energético personalizado para ahorrar en tu hogar o negocio.',
  path: '/estudio',
  locale: 'root',
});

export default function EstudioRoute() {
  return <EstudioPage />;
}
