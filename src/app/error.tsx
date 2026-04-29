'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-red-500">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Algo ha ido mal</h1>
      <p className="mt-2 text-gray-500">
        Ha ocurrido un error inesperado. Estamos trabajando en solucionarlo.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Intentar de nuevo
      </button>
    </main>
  );
}
