import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: {
    siteSetting: { findUnique: vi.fn() },
  },
}));

import { db } from '@/lib/db';
import { getSiteSettingValue } from '../site-settings';

describe('getSiteSettingValue', () => {
  beforeEach(() => {
    vi.mocked(db.siteSetting.findUnique).mockReset();
  });

  it('retorna el valor de la BD cuando existe', async () => {
    vi.mocked(db.siteSetting.findUnique).mockResolvedValueOnce({ value: 'Hola desde DB' } as never);
    const result = await getSiteSettingValue('newsletter.title', 'ES', 'Fallback');
    expect(result).toBe('Hola desde DB');
  });

  it('retorna el fallback cuando el registro no existe', async () => {
    vi.mocked(db.siteSetting.findUnique).mockResolvedValueOnce(null);
    const result = await getSiteSettingValue('newsletter.title', 'ES', 'Mi fallback');
    expect(result).toBe('Mi fallback');
  });

  it('retorna el fallback cuando la BD falla', async () => {
    vi.mocked(db.siteSetting.findUnique).mockRejectedValueOnce(new Error('DB error'));
    const result = await getSiteSettingValue('newsletter.title', 'CA', 'Fallback CA');
    expect(result).toBe('Fallback CA');
  });

  it('construye la clave correctamente con locale', async () => {
    vi.mocked(db.siteSetting.findUnique).mockResolvedValueOnce(null);
    await getSiteSettingValue('footer.description', 'CA', '');
    expect(db.siteSetting.findUnique).toHaveBeenCalledWith({
      where: { key: 'footer.description:CA' },
      select: { value: true },
    });
  });
});
