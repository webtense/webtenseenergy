import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe o ha sido movida.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-green-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Página no encontrada</h1>
      <p className="mt-2 text-gray-500">La página que buscas no existe o ha sido eliminada.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
