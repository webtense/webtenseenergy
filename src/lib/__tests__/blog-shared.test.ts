import { describe, it, expect } from 'vitest';
import { getAllCategories, formatDate, BLOG_EDITORIAL_CATEGORIES } from '../blog-shared';
import type { BlogListItem } from '../blog-shared';

const makePost = (overrides: Partial<BlogListItem> = {}): BlogListItem => ({
  id: '1',
  slug: 'test',
  title: 'Test Post',
  excerpt: 'Excerpt',
  content: 'Content',
  date: '2024-01-01',
  category: 'Ahorro Energético',
  categories: ['Ahorro Energético'],
  featuredImage: null,
  ...overrides,
});

describe('getAllCategories', () => {
  it('siempre incluye "Todos" como primer elemento', () => {
    const result = getAllCategories([]);
    expect(result[0]).toBe('Todos');
  });

  it('siempre incluye las categorías editoriales', () => {
    const result = getAllCategories([]);
    for (const cat of BLOG_EDITORIAL_CATEGORIES) {
      expect(result).toContain(cat);
    }
  });

  it('añade categorías extras de posts en orden alfabético al final', () => {
    const posts = [
      makePost({ categories: ['Zonas Verdes'] }),
      makePost({ categories: ['Aerotermia'] }),
    ];
    const result = getAllCategories(posts);
    const editorialEnd = result.indexOf(BLOG_EDITORIAL_CATEGORIES.at(-1)!);
    const aerotermiaIdx = result.indexOf('Aerotermia');
    const zonasVerdesIdx = result.indexOf('Zonas Verdes');
    expect(aerotermiaIdx).toBeGreaterThan(editorialEnd);
    expect(aerotermiaIdx).toBeLessThan(zonasVerdesIdx);
  });

  it('no duplica categorías editoriales que aparezcan en posts', () => {
    const posts = [makePost({ categories: ['Domótica', 'Domótica'] })];
    const result = getAllCategories(posts);
    const count = result.filter((c) => c === 'Domótica').length;
    expect(count).toBe(1);
  });

  it('devuelve solo [Todos, ...editoriales] para lista de posts vacía', () => {
    const result = getAllCategories([]);
    expect(result).toEqual(['Todos', ...BLOG_EDITORIAL_CATEGORIES]);
  });
});

describe('formatDate', () => {
  it('devuelve string vacío para input vacío', () => {
    expect(formatDate('')).toBe('');
  });

  it('formatea una fecha ISO como texto legible en español', () => {
    const result = formatDate('2024-03-15');
    expect(result).toContain('2024');
    expect(result).toMatch(/marzo|march/i);
  });

  it('devuelve algún string para entrada no parseable (no lanza)', () => {
    expect(() => formatDate('no-es-fecha')).not.toThrow();
    expect(typeof formatDate('no-es-fecha')).toBe('string');
  });
});
