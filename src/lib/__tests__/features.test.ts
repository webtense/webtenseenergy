import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: {
    featureFlag: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/admin-defaults', () => ({
  DEFAULT_FLAGS: [
    { key: 'blog', enabled: true },
    { key: 'ofertas', enabled: false },
    { key: 'newsletter', enabled: false },
    { key: 'telegram', enabled: false },
  ],
  ensureAdminDefaults: vi.fn().mockResolvedValue(undefined),
}));

import { db } from '@/lib/db';
import { isFeatureEnabled, getEnabledFeatures, getPublicFeatureState } from '../features';

describe('isFeatureEnabled', () => {
  beforeEach(() => {
    vi.mocked(db.featureFlag.findUnique).mockReset();
  });

  it('retorna true cuando el flag está habilitado', async () => {
    vi.mocked(db.featureFlag.findUnique).mockResolvedValueOnce({
      enabled: true,
    } as never);
    const result = await isFeatureEnabled('blog');
    expect(result).toBe(true);
  });

  it('retorna false cuando el flag está deshabilitado', async () => {
    vi.mocked(db.featureFlag.findUnique).mockResolvedValueOnce({
      enabled: false,
    } as never);
    const result = await isFeatureEnabled('newsletter');
    expect(result).toBe(false);
  });

  it('retorna false cuando el flag no existe', async () => {
    vi.mocked(db.featureFlag.findUnique).mockResolvedValueOnce(null);
    const result = await isFeatureEnabled('inexistente');
    expect(result).toBe(false);
  });

  it('retorna false si la BD falla', async () => {
    vi.mocked(db.featureFlag.findUnique).mockRejectedValueOnce(new Error('DB error'));
    // Usar clave única para evitar que el caché en memoria interfiera con otros tests
    const result = await isFeatureEnabled('test-db-failure-key-' + Date.now());
    expect(result).toBe(false);
  });
});

describe('getEnabledFeatures', () => {
  beforeEach(() => {
    vi.mocked(db.featureFlag.findMany).mockReset();
  });

  it('retorna las claves de los flags habilitados', async () => {
    vi.mocked(db.featureFlag.findMany).mockResolvedValueOnce([
      { key: 'blog' },
      { key: 'ofertas' },
    ] as never);
    const result = await getEnabledFeatures();
    expect(result).toEqual(['blog', 'ofertas']);
  });

  it('retorna array vacío si no hay flags activos', async () => {
    vi.mocked(db.featureFlag.findMany).mockResolvedValueOnce([] as never);
    const result = await getEnabledFeatures();
    expect(result).toEqual([]);
  });

  it('retorna array vacío si la BD falla', async () => {
    vi.mocked(db.featureFlag.findMany).mockRejectedValueOnce(new Error('DB error'));
    const result = await getEnabledFeatures();
    expect(result).toEqual([]);
  });
});

describe('getPublicFeatureState', () => {
  beforeEach(() => {
    vi.mocked(db.featureFlag.findMany).mockReset();
  });

  it('combina defaults con flags de la BD', async () => {
    vi.mocked(db.featureFlag.findMany).mockResolvedValueOnce([
      { key: 'newsletter', enabled: true },
    ] as never);
    const result = await getPublicFeatureState();
    expect(result.blog).toBe(true);
    expect(result.newsletter).toBe(true);
    expect(result.ofertas).toBe(false);
  });

  it('usa defaults si la BD falla', async () => {
    vi.mocked(db.featureFlag.findMany).mockRejectedValueOnce(new Error('DB error'));
    const result = await getPublicFeatureState();
    expect(result).toHaveProperty('blog');
    expect(result).toHaveProperty('features');
    expect(Array.isArray(result.features)).toBe(true);
  });

  it('retorna la estructura completa esperada', async () => {
    vi.mocked(db.featureFlag.findMany).mockResolvedValueOnce([] as never);
    const result = await getPublicFeatureState();
    expect(result).toHaveProperty('blog');
    expect(result).toHaveProperty('ofertas');
    expect(result).toHaveProperty('newsletter');
    expect(result).toHaveProperty('telegram');
    expect(result).toHaveProperty('features');
  });
});
