import { ContactoPage } from '@/components/pages/ContactoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contacte | Webtense Energy',
  description:
    'Contacta amb Webtense Energy per assessorament en eficiència energètica, domòtica i estalvi a la factura.',
  path: '/contacto',
  locale: 'ca',
});

export default function ContactoCaRoute() {
  return <ContactoPage />;
}
