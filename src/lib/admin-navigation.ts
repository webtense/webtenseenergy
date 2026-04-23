export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  adminOnly?: boolean;
};

export const adminNavigation: AdminNavItem[] = [
  { href: '/admin', label: 'Resumen', description: 'KPIs y actividad reciente' },
  { href: '/admin/content', label: 'Contenido', description: 'Blog, categorias y SEO' },
  {
    href: '/admin/offers',
    label: 'Ofertas y Telegram',
    description: 'Borradores, ofertas y canal',
  },
  {
    href: '/admin/contacts',
    label: 'Contactos',
    description: 'Leads, estudios y suscriptores',
    adminOnly: true,
  },
  {
    href: '/admin/newsletter',
    label: 'Newsletter',
    description: 'Campanas, envios y logs',
    adminOnly: true,
  },
  {
    href: '/admin/settings',
    label: 'Ajustes',
    description: 'Flags, textos y version',
    adminOnly: true,
  },
  {
    href: '/admin/system',
    label: 'Sistema',
    description: 'Admins, auditoria y salud',
    adminOnly: true,
  },
];
